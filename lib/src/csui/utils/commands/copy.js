/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'require', 'csui/lib/underscore', 'csui/lib/jquery',
  'i18n!csui/utils/commands/nls/localized.strings', 'csui/utils/log',
  'csui/utils/url', 'csui/models/command', 'csui/utils/commandhelper',
  'csui/utils/command.error', 'csui/utils/commands/multiple.items',
  'csui/utils/node.links/node.links'
], function (module, require, _, $, lang, log, Url, CommandModel,
    CommandHelper, CommandError, MultipleItemsCommand, nodeLinks) {
  'use strict';

  var config = module.config();
  _.defaults(config, {
    parallelism: 3
  });
  var GlobalMessage, ConflictResolver, TaskQueue,
      ApplyPropertiesSelectorView, UploadFileCollection, PageLeavingBlocker,
      NextNodeModelFactory;

  var CopyCommandParent = CommandModel.extend({});                // create helper parent
  _.extend(CopyCommandParent.prototype, MultipleItemsCommand);    // apply needed mixin

  var CopyCommand = CopyCommandParent.extend({
    defaults: {
      signature: "Copy",
      command_key: ['copy', 'Copy'],
      name: lang.CommandNameCopy,
      verb: lang.CommandVerbCopy,
      pageLeavingWarning: lang.CopyPageLeavingWarning,
      scope: "multiple",
      successMessages: {
        formatForNone: lang.CopyItemsNoneMessage,
        formatForOne: lang.CopyOneItemSuccessMessage,
        formatForTwo: lang.CopySomeItemsSuccessMessage,
        formatForFive: lang.CopyManyItemsSuccessMessage
      },
      errorMessages: {
        formatForNone: lang.CopyItemsNoneMessage,
        formatForOne: lang.CopyOneItemFailMessage,
        formatForTwo: lang.CopySomeItemsFailMessage,
        formatForFive: lang.CopyManyItemsFailMessage
      }
    },

    execute: function (status, options) {
      var self = this;
      var deferred = $.Deferred();
      var context = status.context || options && options.context;
      status.suppressSuccessMessage = true;
      status.suppressFailMessage = true;

      require(['csui/controls/globalmessage/globalmessage',
        'csui/controls/conflict.resolver/conflict.resolver',
        'csui/utils/taskqueue',
        'csui/dialogs/node.picker/impl/header/apply.properties.selector/apply.properties.selector.view',
        'csui/models/fileuploads', 'csui/utils/page.leaving.blocker',
        'csui/utils/contexts/factories/next.node'
      ], function () {
        GlobalMessage = arguments[0];
        ConflictResolver = arguments[1];
        TaskQueue = arguments[2];
        ApplyPropertiesSelectorView = arguments[3];
        UploadFileCollection = arguments[4];
        PageLeavingBlocker = arguments[5];
        NextNodeModelFactory = arguments[6];

        self._selectCopyOptions(status, options)
            .done(function (selectedOptions) {
              var selectedNodes = status.nodes;
              var targetFolder = selectedOptions.nodes[0];
              var openMetadata = selectedOptions.openSelectedProperties;
              var applyProperties = selectedOptions.applyProperties;
              var copyToCurrentFolder = status.container ?
                                        (targetFolder.get('id') === status.container.get('id')) :
                                        false;

              self._announceOperationStart(status);

              var namesToResolve = selectedNodes.map(function (node) {
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
                var type = node.get('type');
                if (type === 144 || type === 749 || type === 736 || type === 30309) {
                  returnObj.size_formatted = node.get('size_formatted');
                } else if (type === 140) {
                  returnObj.url = node.get('url');
                }
                returnObj.actions = node.actions;
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

                    self._metadataHandling(copyInstructions, _.extend(selectedOptions, {context: context, targetFolder: targetFolder}))
                        .done(function () {
                          var uploadCollection = new UploadFileCollection(copyInstructions);
                          uploadCollection.each(function (model) {
                            var sourceNode = selectedNodes.findWhere({
                              id: model.get('id')
                            });
                            model.node.set(_.omit(sourceNode.attributes, 'id'));
                          });
                          var connector = status.container && status.container.connector;
                          if (connector === undefined) {
                            var aNode = CommandHelper.getAtLeastOneNode(status).first();
                            aNode && (connector = aNode.connector);
                          }

                          self._copySelectedNodes(uploadCollection, connector,
                              targetFolder, applyProperties, copyToCurrentFolder, status.collection)
                              .done(function (promises) {
                                GlobalMessage.hideFileUploadProgress();
                                if (promises.length) {
                                  var msgOptions = {
                                    context: context,
                                    nextNodeModelFactory: NextNodeModelFactory,
                                    link_url: nodeLinks.getUrl(targetFolder),
                                    targetFolder: targetFolder
                                  };
                                  self.showSuccessWithLink(promises, msgOptions);
                                }
                                deferred.resolve();
                              })
                              .always(function (promises) {
                                self._announceOperationEnd(status, copyToCurrentFolder);
                              })
                              .fail(function (copyResults) {
                                deferred.reject();
                              });

                        })
                        .fail( function (error) {
                          self._announceOperationEnd(status, copyToCurrentFolder);

                          deferred.reject();
                        });

                  })
                  .fail(function (error) {
                    if (error && error.userAction && error.userAction ===
                        "cancelResolveNamingConflicts") {
                      self.trigger("resolve:naming:conflicts:cancelled");
                    }
                    else if (error && !error.cancelled) {  // if not undefined (cancel) then display error
                      self.showError(error);
                    }
                    self._announceOperationEnd(status, copyToCurrentFolder);
                    deferred.reject();
                  });
            })
            .fail(function (error) {
              if(error && !error.cancelled) {                                   // if not undefined (cancel) then display error
                self.showError(error);
              }
              deferred.reject();
            });

      }, deferred.reject);          // require

      return deferred.promise();    // return empty promise!
    },

    _announceOperationStart: function (status) {
      var originatingView = status.originatingView;
      if (originatingView.blockActions) {
        originatingView.blockActions();
      }
      PageLeavingBlocker.enable(this.get('pageLeavingWarning'));
    },

    _announceOperationEnd: function (status, copyToCurrentFolder) {
      PageLeavingBlocker.disable();
      var originatingView = status.originatingView;
      if (originatingView.unblockActions) {
        originatingView.unblockActions();
      }
    },

    _selectCopyOptions: function (status, options) {
      var self = this;
      var deferred = $.Deferred();

      require(['csui/dialogs/node.picker/node.picker'],
          function (NodePicker) {
            var contextMenuCopy = status.container ?
                                  (status.container.get('id') ===
                                   status.nodes.models[0].get('id')) : false;
            var numNodes = status.nodes.length;
            var dialogTitle = _.str.sformat(numNodes > 1 ? lang.DialogTitleCopy : lang.DialogTitleSingleCopy, numNodes);
            var pickerOptions = _.extend({
              command: 'copy',
              selectableTypes: [-1],
              unselectableTypes: [899],
              showAllTypes: true,
              orderBy: 'type asc',
              dialogTitle: dialogTitle,
              initialContainer: status.container || status.nodes.models[0].parent,
              initialSelection: status.nodes,
              startLocation: contextMenuCopy ? 'recent.containers' : '',
              includeCombineProperties: (numNodes === 1),
              propertiesSeletor: true,
              globalSearch: true,
              context: options ? options.context : status.context,
              startLocations: ['enterprise.volume', 'current.location', 'personal.volume',
                'favorites', 'recent.containers'],
              resolveShortcuts: true,
              resultOriginalNode: true
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
      var h1 =  (nodeNames.length === 1) ? lang.CopyingNode : _.str.sformat( lang.CopyingNodes, nodeNames.length );
      var conflictResolver = new ConflictResolver({
        h1Label: h1,
        actionBtnLabel: lang.CommandNameCopy,
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
        log.warn('Failed to load MetadataCopyMoveItemsController. {0}', error)
        && console.warn(log.last);
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
                            self._addToCurrentTable(model.node, targetCollection);
                            deferred.resolve(attributes);
                          })
                          .fail(function (cause) {
                            var errMsg = new CommandError(cause);
                            model.deferred.reject(model, errMsg);
                            deferred.reject(errMsg);
                          });
                    })
                    .fail(function (cause) {
                      var errMsg = new CommandError(cause);
                      model.deferred.reject(model, errMsg);
                      deferred.reject(errMsg);
                    });
                return deferred.promise();
              }
            });
            return deferred.promise(promises);      // return promises
          });
      GlobalMessage.showFileUploadProgress(uploadCollection, {
        oneFileTitle: lang.CopyingOneItem,
        oneFileSuccess: lang.CopyOneItemSuccessMessage,
        multiFileSuccess: lang.CopyManyItemsSuccessMessage,
        oneFilePending: lang.CopyingOneItem,
        multiFilePending: lang.CopyItems,
        oneFileFailure: lang.CopyOneItemFailMessage,
        multiFileFailure: lang.CopyManyItemsFailMessage2,
        someFileSuccess: lang.CopySomeItemsSuccessMessage,
        someFilePending: lang.CopySomeItems,
        someFileFailure: lang.CopySomeItemsFailMessage2,
        enableCancel: false
      });

      return $.whenAll.apply($, promises);
    },

    _addToCurrentTable: function (node, targetCollection) {
      node.isLocallyCreated = true;
      node.fetch({collection: targetCollection})
          .then(function () {
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

      return node.save(undefined, {
        data: nodeAttr,
        url: connector.connection.url + '/nodes'
      });
    },

    _getCategories: function (attributes, connector, targetFolderID, applyProperties) {
      var deferred = $.Deferred(),
          self     = this;
      if (attributes.extended_data && attributes.extended_data.roles) {
        deferred.resolve(attributes.extended_data.roles);
      }
      else {
        var getCategoriesOptions = connector.extendAjaxOptions({
          url: connector.connection.url + '/forms/nodes/copy?' +
              $.param({
                id: attributes.id,
                parent_id: targetFolderID
              })
        });

        $.ajax(getCategoriesOptions)
            .then(function (response, statusText, jqxhr) {
              var form = response.forms[1],
                  data = form && form.data || {};
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
