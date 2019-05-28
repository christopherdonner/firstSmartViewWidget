/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module',
  'require',
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/utils/log',
  'csui/utils/url',
  'csui/models/command',
  'csui/utils/commandhelper',
  'csui/utils/command.error',
  'i18n!workflow/widgets/workitem/workitem.attachments/impl/nls/lang'
], function (module, require, _, $, log, Url, CommandModel,
    CommandHelper, CommandError, lang) {
  'use strict';

  var config = module.config();
  _.defaults(config, {
    parallelism: 3
  });
  var GlobalMessage, ConflictResolver, TaskQueue,
      ApplyPropertiesSelectorView, UploadFileCollection, PageLeavingBlocker;

  var CopyCommand = CommandModel.extend({

    defaults: {
      signature: "Add",
      name: lang.CommandNameAdd,
      verb: lang.CommandVerbAdd,
      doneVerb: lang.CommandDoneVerbAdd,
      pageLeavingWarning: lang.AddPageLeavingWarning
    },

    execute: function (status, options) {
      var self = this;
      var deferred = $.Deferred();
      var context = status.context || options && options.context;
      var collection = status.collection;

      status.suppressSuccessMessage = true;
      require(['csui/controls/globalmessage/globalmessage',
        'csui/controls/conflict.resolver/conflict.resolver',
        'csui/utils/taskqueue',
        'csui/dialogs/node.picker/impl/header/apply.properties.selector/apply.properties.selector.view',
        'csui/models/fileuploads',
        'csui/utils/page.leaving.blocker'
      ], function () {
        GlobalMessage = arguments[0];
        ConflictResolver = arguments[1];
        TaskQueue = arguments[2];
        ApplyPropertiesSelectorView = arguments[3];
        UploadFileCollection = arguments[4];
        PageLeavingBlocker = arguments[5];

        self._selectCopyOptions(status)
            .done(function (selectedOptions) {
              var selectedNodes = selectedOptions.nodes;
              var targetFolder = collection.node;
              var applyProperties = selectedOptions.applyProperties;
              var copyToCurrentFolder = true;
              self._announceOperationStart(status.originatingView);

              var namesToResolve = _.map(selectedNodes, function (node) {
                var returnObj = {
                  id: node.get('id'),
                  name: node.get('name'),
                  container: node.get('container'),
                  mime_type: node.get('mime_type'),
                  original_id: node.get('original_id'),
                  original: node.original,
                  type: node.get('type'),
                  size: node.get('size'),
                  type_name: node.get('type_name'),
                  state: 'pending',
                  count: 0,
                  total: 1,
                  enableCancel: false
                };
                if (node.get('type') === (144 || 749 || 30309)) {
                  returnObj.size_formatted = node.get('size_formatted');
                }
                return returnObj;
              });
              var copyNamesToResolve = _.map(namesToResolve, function (name) {
                return _.clone(name);
              });
              self._resolveNamingConflicts(targetFolder, copyNamesToResolve)
                  .done(function (copyInstructions) {

                    _.each(copyInstructions, function (instruction) {
                      if (instruction.id === undefined) {
                        instruction.id = _.findWhere(namesToResolve,
                            {name: instruction.name}).id;
                      }
                    });

                    self._metadataHandling(copyInstructions,
                        _.extend(selectedOptions, {context: context, targetFolder: targetFolder}))
                        .done(function () {
                          var uploadCollection = new UploadFileCollection(copyInstructions);

                          var connector = collection.connector;

                          self._copySelectedNodes(uploadCollection, connector,
                              targetFolder, applyProperties, copyToCurrentFolder,
                              status.collection)
                              .done(function () {
                                GlobalMessage.hideFileUploadProgress();
                                var msg = (copyInstructions.length === 1) ?
                                          lang.MessageItemCopied : lang.MessageItemsCopied;
                                msg = _.str.sformat(msg, copyInstructions.length);
                                GlobalMessage.showMessage('success', msg);
                                deferred.resolve();
                              })
                              .always(function () {
                                self._announceOperationEnd(status.originatingView,
                                    copyToCurrentFolder);
                              })
                              .fail(function (/*copyResults*/) {
                                deferred.reject();
                              });

                        })
                        .fail(function (error) {
                          self._announceOperationEnd(status.originatingView, copyToCurrentFolder);
                          deferred.reject(error);
                        });

                  })
                  .fail(function (error) {
                    self._announceOperationEnd(status.originatingView, copyToCurrentFolder);
                    deferred.reject(error);
                  });
            });
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise();
    },

    _announceOperationStart: function (view) {
      var collectionView = view.resultsView || view.tableView;
      if (collectionView) {
        collectionView.blockActions();
      }
      PageLeavingBlocker.enable(this.get('pageLeavingWarning'));
    },

    _announceOperationEnd: function (view, copyToCurrentFolder) {
      PageLeavingBlocker.disable();
      var collectionView = view.resultsView || view.tableView;
      if (collectionView) {
        if (copyToCurrentFolder) {
          collectionView.collection.fetch();
        }
        collectionView.unblockActions();
      }
    },

    _selectCopyOptions: function (status) {
      var self = this;
      var deferred = $.Deferred();

      require(['csui/dialogs/node.picker/node.picker'],
          function (NodePicker) {
            var pickerOptions = _.extend({
              selectableTypes: status.validTypes,
              showAllTypes: true,
              dialogTitle: lang.AddDocumentLabel,
              selectButtonLabel: lang.ButtonLabelAdd,
              initialContainer: status.container,
              startLocation: 'enterprise.volume',
              propertiesSeletor: true,
              globalSearch: true,
              startLocations: ['enterprise.volume', 'current.location', 'personal.volume',
                'favorites', 'recent.containers']
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

    _resolveNamingConflicts: function (targetFolder, nodeNames) {
      var h1 = (nodeNames.length === 1) ? lang.CopyingNode : lang.CopyingNodes;
      var conflictResolver = new ConflictResolver({
        h1Label: _.str.sformat(h1, nodeNames.length),
        actionBtnLabel: 'Add',
        excludeAddVersion: true,
        container: targetFolder,
        files: nodeNames
      });
      return conflictResolver.run();
    },

    _metadataHandling: function (items, options) {
      var deferred = $.Deferred();

      require(['csui/widgets/metadata/metadata.copy.move.items.controller'
      ], function (MetadataCopyMoveItemsController) {
        var openMetadata = options.openSelectedProperties;
        var applyProperties = options.applyProperties;
        var metadataController = new MetadataCopyMoveItemsController();
        var controllerFunction;
        if (openMetadata) {
          controllerFunction = metadataController.CopyMoveItemsWithMetadata;
        } else if (applyProperties === ApplyPropertiesSelectorView.APPLY_DESTINATION_PROPERTIES ||
                   applyProperties === ApplyPropertiesSelectorView.COMBINE_ALL_PROPERTIES) {
          controllerFunction = metadataController.CopyMoveItemsRequiredMetadata;
        } else {
          return deferred.resolve();
        }

        if (applyProperties === ApplyPropertiesSelectorView.KEEP_ORIGINAL_PROPERTIES) {
          options.inheritance = 'original';
        } else if (applyProperties === ApplyPropertiesSelectorView.APPLY_DESTINATION_PROPERTIES) {
          options.inheritance = 'destination';
        } else if (applyProperties === ApplyPropertiesSelectorView.COMBINE_ALL_PROPERTIES) {
          options.inheritance = 'merged';
        }

        options.action = 'copy';
        controllerFunction.call(metadataController, items, options)
            .done(function () {
              deferred.resolve();
            })
            .fail(function (error) {
              deferred.reject(error);
            });

      }, function (error) {
        log.warn('Failed to load MetadataCopyMoveItemsController. {0}', error);
        deferred.reject(error);
      });

      return deferred.promise();
    },

    _copySelectedNodes: function (uploadCollection, connector, targetFolder, applyProperties,
        copyToCurrentFolder, targetCollection) {
      var self     = this,
          queue    = new TaskQueue({
            parallelism: config.parallelism
          }),
          promises = _.map(uploadCollection.models, function (model) {
            var deferred = $.Deferred();
            queue.pending.add({
              worker: function () {
                var attributes = model.attributes,
                    targetId   = targetFolder.get('id');

                self._getCategories(attributes, connector, targetId, applyProperties)
                    .done(function (categories) {
                      self._copyNode(categories, attributes, connector, targetId, model.node)
                          .done(function () {
                            model.set('count', 1);
                            model.deferred.resolve(model);
                            copyToCurrentFolder &&
                            self._addToCurrentTable(model.node, targetCollection, uploadCollection);
                            deferred.resolve(attributes);
                          })
                          .fail(function (cause) {
                            model.deferred.reject(model, new CommandError(cause));
                            deferred.reject();
                          });
                    })
                    .fail(function (cause) {
                      model.deferred.reject(model, new CommandError(cause));
                      deferred.reject();
                    });
                return deferred.promise();
              }
            });
            return deferred.promise();
          });
      GlobalMessage.showFileUploadProgress(uploadCollection, {
        oneFileTitle: lang.AddingOneFile,
        oneFileSuccess: lang.AddOneFileSucceeded,
        multiFileSuccess: lang.AddFilesSucceeded,
        oneFilePending: lang.AddingOneFile,
        multiFilePending: lang.AddFiles,
        oneFileFailure: lang.AddFilesOneFailed,
        multiFileFailure: lang.AddFilesFailed,
        oneFailure: lang.AddFilesOneFailed,
        enableCancel: false
      });

      return $.whenAll.apply($, promises);
    },

    _addToCurrentTable: function (node, targetCollection, uploadCollection) {

      node.isLocallyCreated = true;
      if (uploadCollection.length === 1) {
        targetCollection.singleFileUpload = true;
      }
      CommandHelper
          .refreshModelAttributesFromServer(node, targetCollection)
          .done(function () {
            if (node.original) {
              node.attributes.original_id = 0;
              node.original = undefined;
            }
            targetCollection.unshift(node);
          });

    },

    _copyNode: function (categories, instruction, connector, targetFolderID, node) {

      var nodeAttr = {
        "original_id": instruction.id,
        "parent_id": targetFolderID,
        "name": instruction.newName ? instruction.newName : instruction.name,
        "roles": categories
      };
      if (!node.connector) {
        connector.assignTo(node);
      }

      return node.save(nodeAttr, {
        data: nodeAttr,
        url: connector.connection.url + '/nodes'
      });
    },

    _getCategories: function (attributes, connector, targetFolderID, applyProperties) {
      var deferred = $.Deferred();
      if (attributes.extended_data && attributes.extended_data.roles) {
        deferred.resolve(attributes.extended_data.roles);
      }
      else {
        var getCategoriesOptions = connector.extendAjaxOptions({
          url: connector.connection.url + '/forms/nodes/copy',
          method: 'get',
          data: {
            id: attributes.id,
            parent_id: targetFolderID
          }
        });

        $.ajax(getCategoriesOptions)
            .then(function (response/*, statusText, jqxhr*/) {
              var data = response.forms[1].data;
              var categoryGroupMapping;
              categoryGroupMapping = {};
              categoryGroupMapping[ApplyPropertiesSelectorView.KEEP_ORIGINAL_PROPERTIES] = 'original';
              categoryGroupMapping[ApplyPropertiesSelectorView.APPLY_DESTINATION_PROPERTIES] = 'destination';
              categoryGroupMapping[ApplyPropertiesSelectorView.COMBINE_ALL_PROPERTIES] = 'merged';
              var categories = data[categoryGroupMapping[applyProperties]];
              deferred.resolve({"categories": categories});
            })
            .fail(function (error) {
              deferred.reject(error);
            });
      }
      return deferred.promise();
    }

  });

  return CopyCommand;

});
