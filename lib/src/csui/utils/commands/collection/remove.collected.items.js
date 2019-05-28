/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'require', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/models/command', 'csui/utils/commandhelper',
  'i18n!csui/utils/commands/collection/nls/lang',
  'csui/utils/commands/confirmable', 'csui/utils/commands/multiple.items',
  'csui/utils/command.error'
], function (module, require, _, $, CommandModel, CommandHelper, lang,
    ConfirmableCommand, MultipleItemsCommand, CommandError) {
  'use strict';

  var config = module.config();
  _.defaults(config, {
    parallelism: 1
  });

  var GlobalMessage;

  var RemoveCollectionItemsCommand = CommandModel.extend({
    defaults: {
      signature: 'RemoveCollectedItems',
      command_key: 'removefromcollection',
      name: lang.removefromCollection,
      pageLeavingWarning: lang.DeletePageLeavingWarning,
      scope: 'multiple',
      successMessages: {
        formatForNone: lang.RemoveItemsNoneMessage,
        formatForOne: lang.RemoveOneItemSuccessMessage,
        formatForTwo: lang.RemoveSomeItemsSuccessMessage,
        formatForFive: lang.RemoveManyItemsSuccessMessage
      },
      errorMessages: {
        formatForNone: lang.RemoveItemsNoneMessage,
        formatForOne: lang.RemoveOneItemFailMessage,
        formatForTwo: lang.RemoveSomeItemsFailMessage,
        formatForFive: lang.RemoveManyItemsFailMessage
      }
    },


    allowCollectionRefetch: false,

    _getConfirmTemplate: function (status, options) {
      return _.template(lang.RemoveCollectItemsCommandConfirmDialogHtml);
    },

    _getConfirmData: function (status, options) {
      var nodes = CommandHelper.getAtLeastOneNode(status);
      var msg = (nodes.length === 1 ?
                 _.str.sformat(lang.RemoveCommandConfirmDialogSingleMessage,
                     nodes.at(0).get('name')) :
                 _.str.sformat(lang.RemoveCommandConfirmDialogMultipleMessage,
                     nodes.length) );
      return {
        title: lang.RemoveCommandConfirmDialogTitle,
        message: msg
      };
    },

    _performAction: function (model, options) {
      var node                = model.node,
          d                   = $.Deferred(),
          nodeAttr            = {
            "collection_id": options.container.get("id"),
            "operation": "remove"
          },
          connector           = options.container.connector,
          containerCollection = options.containerCollection,

          collectOptions      = connector.extendAjaxOptions({
            url: connector.connection.url.replace('/v1', '/v2') + '/nodes/' + node.get("id"),
            type: 'PUT',
            data: 'body=' + encodeURIComponent(JSON.stringify(nodeAttr)),
            contentType: 'application/x-www-form-urlencoded'
          }),

          jqxhr               = $.ajax(collectOptions).done(function (resp) {
            model.set('count', 1);
            containerCollection.remove(node);
            model.deferred.resolve(model);
            d.resolve(model);
          }).fail(function (error) {
            var commandError = error ? new CommandError(error, model) :
                               error;
            model.deferred.reject(model, commandError);
            if (!error) {
              jqxhr.abort();
            }
            d.reject(commandError);
          });

      return d.promise();
    },

    startGlobalMessage: function (uploadCollection) {
      GlobalMessage.showFileUploadProgress(uploadCollection, {
        oneFileTitle: lang.RemovingOneItem,
        oneFileSuccess: lang.RemoveOneItemSuccessMessage,
        multiFileSuccess: lang.RemoveManyItemsSuccessMessage,
        oneFilePending: lang.RemovingOneItem,
        multiFilePending: lang.RemoveItems,
        oneFileFailure: lang.RemoveOneItemFailMessage,
        multiFileFailure: lang.RemoveManyItemsFailMessage2,
        someFileSuccess: lang.RemoveSomeItemsSuccessMessage,
        someFilePending: lang.RemovingSomeItems,
        someFileFailure: lang.RemoveSomeItemsFailMessage2,
        enableCancel: false
      });
    }

  });

  _.extend(RemoveCollectionItemsCommand.prototype, ConfirmableCommand, {
    execute: function (status, options) {
      var deferred = $.Deferred(),
          self     = this;
      status.suppressFailMessage = true;
      status.suppressSuccessMessage = true;

      require([
        'csui/controls/globalmessage/globalmessage'
      ], function (localGlobalMessage) {
        GlobalMessage = localGlobalMessage;
        self._executeRemoveCollectionItems(status, options)
            .then(deferred.resolve, deferred.reject);
      }, deferred.reject);
      return deferred.promise();
    },

    _executeRemoveCollectionItems: function (status, options) {
      var self = this;
      options || (options = {});
      var nodes       = CommandHelper.getAtLeastOneNode(status),
          node        = nodes.length === 1 && nodes.first(),
          deferred    = $.Deferred(),
          commandData = status.data || {},
          context     = status.context || options.context;

      options.parallelism || (options.parallelism = config.parallelism);

      var showProgressDialog = commandData.showProgressDialog != null ?
                               commandData.showProgressDialog : true;

      ConfirmableCommand.execute.apply(this, arguments)
          .done(function (results) {
            if (showProgressDialog) {
              GlobalMessage.hideFileUploadProgress();
            }
            if (options.infiniteScroll) {
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
      options || (options = {});
      var self               = this,
          deferred           = $.Deferred(),
          commandData        = status.data || {},
          showProgressDialog = commandData.showProgressDialog != null ?
                               commandData.showProgressDialog : true;

      options.container || (options.container = status.container);
      options.containerCollection = status.collection;
      require(['csui/models/fileuploads'
      ], function (UploadFileCollection) {
        var models = status.nodes.models;
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
          self.startGlobalMessage(uploadCollection);
        }
        newStatus.suppressMultipleSuccessMessage = true;
        newStatus.suppressMultipleFailMessage = true;

        MultipleItemsCommand._performActions.call(self, newStatus, options)
            .done(function (results) {
              if (showProgressDialog) {
                GlobalMessage.hideFileUploadProgress();
              }
              self.showSuccess(results);
              deferred.resolve(results);
            })
            .fail(function (errors) {
              if (!showProgressDialog) {
                self.showError(errors);
              }
              return deferred.reject(errors);
            });
      }, deferred.reject);
      return deferred.promise();
    }
  });

  return RemoveCollectionItemsCommand;
});
