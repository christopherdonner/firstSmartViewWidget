/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'require', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/backbone', 'csui/utils/url', 'csui/utils/command.error',
  'csui/models/command', 'i18n!csui/utils/commands/collection/nls/lang',
  'csui/utils/base', 'csui/models/nodes',
  'csui/lib/underscore.string'
], function (module, require, _, $, Backbone, Url, CommandError, CommandModel,
    lang, base, NodeCollection) {
  'use strict';

  var config = module.config();
  _.defaults(config, {
    parallelism: 3
  });

  var GlobalMessage, TaskQueue, UploadFileCollection, PageLeavingBlocker,
      NextNodeModelFactory, CollectionConflictView,
      CollectCommand = CommandModel.extend({
        defaults: {
          signature: 'CollectionCanCollect',
          name: lang.addItemsToolTip,
          command_key: ['collectionCanCollect'],
          scope: 'single',
          successMessages: {
            formatForOne: lang.CollectOneItemSuccessMessage,
            formatForTwo: lang.CollectManyItemsSuccessMessage,
            formatForMany: lang.CollectManyItemsSuccessMessage,
            formatForFive: lang.CollectManyItemsSuccessMessage,
          },
          errorMessages: {
            formatForOne: lang.CollectOneItemFailMessage,
            formatForTwo: lang.CollectManyItemsFailMessage,
            formatForMany: lang.CollectManyItemsFailMessage,
            formatForFive: lang.CollectManyItemsFailMessage,
          }
        },

        enabled: function (status) {
          if (status.container.get('type') === 298) {
            status.nodes = new NodeCollection([status.container]);
            return CollectCommand.__super__.enabled.apply(this, arguments);
          } else {
            return false;
          }
        },

        execute: function (status, options) {
          var deferred = $.Deferred(),
              self     = this;

          require(['csui/controls/globalmessage/globalmessage',
            'csui/controls/conflict.resolver/impl/collection.conflicts/collection.conflicts.view',
            'csui/utils/taskqueue',
            'csui/models/fileuploads', 'csui/utils/page.leaving.blocker',
            'csui/utils/contexts/factories/next.node'
          ], function () {
            GlobalMessage = arguments[0];
            CollectionConflictView = arguments[1];
            TaskQueue = arguments[2];
            UploadFileCollection = arguments[3];
            PageLeavingBlocker = arguments[4];
            NextNodeModelFactory = arguments[5];
            self._addToCollection(status, options)
                .done(function (selectedOptions) {
                  var selectedNodes    = selectedOptions.nodes,
                      nodes            = _.map(selectedNodes, function (node) {
                        return {
                          name: node.get('name'),
                          state: 'pending',
                          count: 0,
                          total: 1,
                          node: node
                        };
                      }),
                      targetFolder     = status.container,
                      uploadCollection = new UploadFileCollection(nodes, {connector: connector}),
                      connector        = status.container && status.container.connector;
                  status.container.collection = status.collection;
                  self._announceOperationStart(status);
                  uploadCollection.each(function (fileUpload) {
                    var node = fileUpload.get('node');
                    fileUpload.node = node;
                    fileUpload.unset('node');
                    fileUpload.set('mime_type', node.get('mime_type'));
                  });

                  self._addSelectedNodesToCollection(uploadCollection, connector, targetFolder,
                      status.collection)
                      .then(function (promises) {
                        GlobalMessage.hideFileUploadProgress();
                        var result = self._checkPromises(promises);
                        if (result.failedNodes.length) {
                          self._showDialog(result.failedNodes).then(
                              function (resolveOption, dialog) {
                                dialog.kill();
                                if (result.successNodes.length) {
                                  self._showGlobalMessage(result.successNodes.length);
                                }
                              });

                        } else if (result.successNodes.length) {
                          self._showGlobalMessage(result.successNodes.length);
                        }
                      });
                  self._announceOperationEnd(status);
                  deferred.resolve();
                })
                .fail(function (error) {
                  if (error && !error.cancelled) {
                    self.showError(error);
                  }
                  deferred.reject();
                });
          });
          return deferred.promise();
        },

        _addToCollection: function (status, options) {
          var self     = this,
              deferred = $.Deferred();

          require(['csui/dialogs/node.picker/node.picker'],
              function (NodePicker) {
                var pickerOptions = _.extend({
                  selectableTypes: [],
                  showAllTypes: true,
                  orderBy: 'type asc',
                  dialogTitle: lang.collectItemsDialogTitle,
                  selectButtonLabel: lang.selectButtonLabel,
                  globalSearch: true,
                  selectMultiple: true,
                  context: options ? options.context : status.context,
                  startLocations: ['enterprise.volume', 'current.location', 'personal.volume',
                    'favorites', 'recent.containers'],
                  resolveShortcuts: true
                }, status);

                self.nodePicker = new NodePicker(pickerOptions);

                self.nodePicker
                    .show()
                    .done(function () {
                      deferred.resolve.apply(deferred, arguments);
                    })
                    .fail(function () {
                      deferred.reject.apply(deferred, arguments);
                    });
              }, function (error) {
                deferred.reject(error);
              });
          return deferred.promise();
        },

        _addSelectedNodesToCollection: function (uploadCollection, connector, targetFolder,
            targetCollection) {
          var self     = this,
              queue    = new TaskQueue({
                parallelism: config.parallelism
              }),
              count    = 0,
              promises = _.map(uploadCollection.models, function (model) {
                var deferred = $.Deferred();
                queue.pending.add({
                  worker: function () {
                    var node     = model.node,
                        node_id  = node.get('id'),
                        targetId = targetFolder.get('id');
                    self._collectNode(connector, targetId, node_id)
                        .done(function () {
                          model.set('count', 1);
                          model.deferred.resolve(model);
                          self._addToCurrentTable(model.node, targetCollection, targetId);
                          deferred.resolve(model);
                        })
                        .fail(function (cause) {
                          deferred.resolve(model);
                        });
                    return deferred.promise();
                  }
                });
                count++;
                return deferred.promise(promises);  // return promises
              });
          GlobalMessage.showFileUploadProgress(uploadCollection, {
            oneFileTitle: lang.CollectingOneItem,
            oneFileSuccess: lang.CollectOneItemSuccessMessage,
            multiFileSuccess: lang.CollectManyItemsSuccessMessage,
            oneFilePending: lang.CollectingOneItem,
            multiFilePending: lang.CollectingItems,
            oneFileFailure: lang.CollectOneItemFailMessage,
            multiFileFailure: lang.CollectManyItemsFailMessage2,
            someFileSuccess: lang.CollectManyItemsSuccessMessage,
            someFilePending: lang.CollectingItems,
            someFileFailure: lang.CollectManyItemsFailMessage2,
            enableCancel: false
          });

          return $.whenAll.apply($, promises);
        },

        _collectNode: function (connector, targetFolderID, node_id) {
          var deferred = $.Deferred();
          var nodeAttr = {
            "collection_id": targetFolderID
          };

          var collectOptions = connector.extendAjaxOptions({
            url: connector.connection.url.replace('/v1', '/v2') + '/nodes/' + node_id,
            type: 'PUT',
            data: 'body=' + encodeURIComponent(JSON.stringify(nodeAttr)),
            contentType: 'application/x-www-form-urlencoded'
          });

          $.ajax(collectOptions).done(function (resp) {
            deferred.resolve(resp);

          }).fail(function (resp) {
            deferred.reject(resp);
          });
          return deferred.promise();
        },

        _getListView: function (conflictFiles) {
          var retVal = new CollectionConflictView(_.extend({}, {collection: conflictFiles}));
          return retVal;
        },

        _showDialog: function (conflictFiles) {
          var deferred = $.Deferred(),
              buttons  = [{
                id: 'close',
                label: lang.conflictsDialogCloseLabel,
                toolTip: lang.conflictsDialogCloseLabel,
                click: function (args) {
                  deferred.resolve('close', args.dialog);
                }
              }];
          this._showConflictDialog(conflictFiles, buttons);
          return deferred;
        },

        _showConflictDialog: function (collection, buttons) {
          var self     = this,
              deferred = $.Deferred();
          require(['csui/controls/dialog/dialog.view'], function (DialogView) {
            var failureMessage = base.formatMessage(collection.length, self.get("errorMessages")),
                dialog         = new DialogView({
                  title: failureMessage,
                  midSize: true,
                  iconLeft: 'csui-icon-notification-information',
                  className: "csui-collection-conflicts-dialog",
                  view: self._getListView(collection),
                  buttons: buttons
                });
            dialog.show();
            return dialog;
          });

        },

        _checkPromises: function (promises) {
          if (!_.isArray(promises)) {
            promises = [promises];
          }

          var successPromises = new Backbone.Collection(),
              failedPromises  = new Backbone.Collection();

          _.each(promises, function (prom) {
            if (prom !== undefined) {
              if (!prom.cancelled) {
                if (prom.get("count") === undefined) {
                } else if (prom.get("count")) {
                  successPromises.push(prom);
                }
                else {
                  failedPromises.push(prom);
                }
              }
            }
          });

          return {
            successNodes: successPromises,
            failedNodes: failedPromises
          };
        },

        _addToCurrentTable: function (collectItem, targetCollection, targetId) {
          collectItem.isLocallyCreated = true;
          collectItem.refernce_id = targetId;
          collectItem.fetch({collection: targetCollection})
              .then(function () {
                targetCollection.unshift(collectItem);
              });
        },

        _showGlobalMessage: function (successCount) {
          var successMessage = base.formatMessage(successCount, this.get("successMessages"));
          GlobalMessage.showMessage("success", successMessage);
        },
        _announceOperationStart: function (status) {
          var originatingView = status.originatingView;
          if (originatingView.blockActions) {
            originatingView.blockActions();
          }
          PageLeavingBlocker.enable(this.get('pageLeavingWarning'));
        },

        _announceOperationEnd: function (status) {
          PageLeavingBlocker.disable();
          var originatingView = status.originatingView;
          if (originatingView.unblockActions) {
            originatingView.unblockActions();
          }
        }
      });

  return CollectCommand;
});
