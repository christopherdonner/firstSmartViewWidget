/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'require', 'csui/lib/underscore', 'csui/lib/jquery',
  'i18n!csui/utils/commands/nls/localized.strings',
  'csui/utils/log', 'csui/utils/commandhelper', 'csui/utils/commands/node',
  'csui/utils/commands/multiple.items', 'csui/utils/commands/confirmable',
  'csui/utils/command.error'
], function (module, require, _, $, lang, log, CommandHelper, NodeCommand,
    MultipleItemsCommand, ConfirmableCommand, CommandError) {
  'use strict';

  var config = module.config();
  _.defaults(config, {
    parallelism: 1
  });

  var UploadFileCollection, NextNodeModelFactory, GlobalMessage;

  var DeleteCommand = NodeCommand.extend({
    defaults: {
      signature: 'Delete',
      command_key: ['delete', 'Delete'],
      name: lang.CommandNameDelete,
      verb: lang.CommandVerbDelete,
      pageLeavingWarning: lang.DeletePageLeavingWarning,
      scope: 'multiple',
      successMessages: {
        formatForNone: lang.DeleteItemsNoneMessage,
        formatForOne: lang.DeleteOneItemSuccessMessage,
        formatForTwo: lang.DeleteSomeItemsSuccessMessage,
        formatForFive: lang.DeleteManyItemsSuccessMessage
      },
      errorMessages: {
        formatForNone: lang.DeleteItemsNoneMessage,
        formatForOne: lang.DeleteOneItemFailMessage,
        formatForTwo: lang.DeleteSomeItemsFailMessage,
        formatForFive: lang.DeleteManyItemsFailMessage
      }
    },

    allowCollectionRefetch: false,

    _getConfirmTemplate: function (status, options) {
      return _.template(lang.DeleteCommandConfirmDialogHtml);
    },

    _getConfirmData: function (status, options) {
      var nodes = CommandHelper.getAtLeastOneNode(status);
      var msg = (nodes.length === 1 ?
                 _.str.sformat(lang.DeleteCommandConfirmDialogSingleMessage,
                     nodes.at(0).get('name')) :
                 _.str.sformat(lang.DeleteCommandConfirmDialogMultipleMessage,
                     nodes.length));
      return {
        title: lang.DeleteCommandConfirmDialogTitle,
        message: msg
      };
    },
    _performAction: function (model, options) {
      var node = model.node;
      var d = $.Deferred();
      var collection = node.collection;
      if (collection) {
        var jqxhr = node.destroy({
          wait: true
        })
            .done(function () {
              model.set('count', 1);
              model.deferred.resolve(model);
              d.resolve(node);
            })
            .fail(function (error) {
              var commandError = error ? new CommandError(error, node) :
                                 error;
              model.deferred.reject(model, commandError);
              if (!error) {
                jqxhr.abort();
              }
              d.reject(commandError);
            });
        return d.promise();
      }
      else {
        return d.reject(
            new CommandError(_.str.sformat(lang.DeleteItemFailed, node.get('name')),
                {errorDetails: 'collection is undefined'}));
      }
    },
    startGlobalMessage: function (uploadCollection, options) {
      GlobalMessage.showFileUploadProgress(uploadCollection, {
        oneFileTitle: lang.DeletingOneItem,
        oneFileSuccess: lang.DeleteOneItemSuccessMessage,
        multiFileSuccess: lang.DeleteManyItemsSuccessMessage,
        oneFilePending: lang.DeletingOneItem,
        multiFilePending: lang.DeleteItems,
        oneFileFailure: lang.DeleteOneItemFailMessage,
        multiFileFailure: lang.DeleteManyItemsFailMessage2,
        someFileSuccess: lang.DeleteSomeItemsSuccessMessage,
        someFilePending: lang.DeletingSomeItems,
        someFileFailure: lang.DeleteSomeItemsFailMessage2,
        enableCancel: false,
        originatingView: options.originatingView
      });
    }
  });

  _.extend(DeleteCommand.prototype, ConfirmableCommand, {
    execute: function (status, options) {
      var deferred = $.Deferred(),
          self     = this;
      status.suppressFailMessage = true;
      status.suppressSuccessMessage = true;

      require([
        'csui/models/fileuploads',
        'csui/utils/contexts/factories/next.node',
        'csui/controls/globalmessage/globalmessage'
      ], function (localUploadFileCollection, localNextNodeModelFactory,
          localGlobalMessage) {
        UploadFileCollection = localUploadFileCollection;
        NextNodeModelFactory = localNextNodeModelFactory;
        GlobalMessage = localGlobalMessage;
        self._executeDelete(status, options)
            .then(deferred.resolve, deferred.reject);
      }, deferred.reject);
      return deferred.promise();
    },

    _executeDelete: function (status, options) {
      var self = this;
      options || (options = {});
      var nodes       = CommandHelper.getAtLeastOneNode(status),
          node        = nodes.length === 1 && nodes.first(),
          deferred    = $.Deferred(),
          commandData = status.data || {},
          context     = status.context || options.context;

      options.parallelism || (options.parallelism = config.parallelism);
      options.originatingView = status.originatingView;

      var showProgressDialog = commandData.showProgressDialog != null ?
                               commandData.showProgressDialog : true;
      ConfirmableCommand.execute.call(this, status, options)
          .done(function (results) {
            if (showProgressDialog) {
              GlobalMessage.hideFileUploadProgress();
            }
            if (node && node === status.container) {
              setTimeout(function () {
                var nextNode = context.getModel(NextNodeModelFactory),
                    parentId = status.container.get('parent_id');
                nextNode.set('id', parentId.id || parentId);
              });
            }
            else if (options.infiniteScroll) {
              status.collection.fetch({
                reset: false,
                remove: false,
                merge: true
              });
            }
            self.allowCollectionRefetch = true;
            deferred.resolve(results);
          })
          .fail(function (args) {
            var oneSuccess = args && _.find(args, function (result) {
              return !(result instanceof CommandError);
            });
            var rejectResults = oneSuccess ? oneSuccess : args;
            deferred.reject(rejectResults);
          });

      return deferred.promise();
    },

    _performActions: function (status, options) {
      var self               = this,
          deferred           = $.Deferred(),
          commandData        = status.data || {},
          showProgressDialog = commandData.showProgressDialog != null ?
                               commandData.showProgressDialog : true,
          models             = status.nodes.models;
      var nodes = _.map(models, function (node) {
        return {
          name: node.get('name'),
          state: 'pending',
          count: 0,
          total: 1,
          node: node
        };
      });
      var connector = models && models[0] && models[0].connector;
      var uploadCollection = new UploadFileCollection(nodes, {connector: connector});
      var newStatus = _.defaults({nodes: uploadCollection}, status);
      uploadCollection.each(function (fileUpload) {
        var node = fileUpload.get('node');
        fileUpload.node = node;
        fileUpload.unset('node');
        fileUpload.set('mime_type', node.get('mime_type'));

      });
      if (showProgressDialog) {
        this.startGlobalMessage(uploadCollection, options);
      }
      newStatus.suppressMultipleSuccessMessage = true;
      newStatus.suppressMultipleFailMessage = true;

      MultipleItemsCommand._performActions.call(this, newStatus, options)
          .done(function (results) {
            if (showProgressDialog) {
              GlobalMessage.hideFileUploadProgress();
            }
            deferred.resolve(results);
            setTimeout(function () {
              self.showSuccess(results);
            }, 500);
          })
          .fail(function (errors) {
            if (!showProgressDialog) {
              self.showError(errors);
            }
            return deferred.reject(errors);
          });
      return deferred.promise();
    }
  });

  return DeleteCommand;
});
