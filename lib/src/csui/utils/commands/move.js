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
  var MoveCommandParent = CommandModel.extend({});
  _.extend(MoveCommandParent.prototype, MultipleItemsCommand);     // apply needed mixin

  var MoveCommand = MoveCommandParent.extend({
    defaults: {
      signature: "Move",
      command_key: ['move', 'Move'],
      name: lang.CommandNameMove,
      verb: lang.CommandNameVerbMove,
      pageLeavingWarning: lang.MovePageLeavingWarning,
      scope: "multiple",
      successMessages: {
        formatForNone: lang.MoveItemsNoneMessage,
        formatForOne: lang.MoveOneItemSuccessMessage,
        formatForTwo: lang.MoveSomeItemsSuccessMessage,
        formatForFive: lang.MoveManyItemsSuccessMessage
      },
      errorMessages: {
        formatForNone: lang.MoveItemsNoneMessage,
        formatForOne: lang.MoveOneItemFailMessage,
        formatForTwo: lang.MoveSomeItemsFailMessage,
        formatForFive: lang.MoveManyItemsFailMessage
      }
    },

    allowCollectionRefetch: false,

    execute: function (status, options) {
      var self             = this,
          deferred         = $.Deferred(),
          context          = status.context || options && options.context,
          uploadFileModels = [];
      status.suppressFailMessage = true;
      status.suppressSuccessMessage = true;

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

        self._selectMoveOptions(status, options)
            .done(function (selectedOptions) {
              var selectedNodes = status.nodes;
              var targetFolder = selectedOptions.nodes[0];
              var applyProperties = selectedOptions.applyProperties;

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
              var moveNamesToResolve = _.map(namesToResolve, function (name) {
                return _.clone(name);
              });
              self._resolveNamingConflicts(targetFolder, moveNamesToResolve)
                  .done(function (moveInstructions) {

                    _.each(moveInstructions, function (instruction) {
                      if (instruction.id === undefined) {
                        instruction.id = _.findWhere(namesToResolve,
                            {name: instruction.name}).id;
                      }
                    });

                    self._metadataHandling(moveInstructions,
                        _.extend(selectedOptions, {context: context, targetFolder: targetFolder}))
                        .done(function () {
                          var uploadCollection = new UploadFileCollection(moveInstructions);
                          uploadCollection.each(function (model) {
                            model.node = selectedNodes.findWhere({
                              id: model.get('id')
                            });
                          });
                          var connector = status.container && status.container.connector;
                          if (connector === undefined) {
                            var aNode = CommandHelper.getAtLeastOneNode(status).first();
                            aNode && (connector = aNode.connector);
                          }
                          self._moveSelectedNodes(uploadCollection, connector,
                              targetFolder, applyProperties)
                              .done(function (promises) {
                                if (promises.length) {
                                  GlobalMessage.hideFileUploadProgress();
                                  var msgOptions = {
                                    context: context,
                                    nextNodeModelFactory: NextNodeModelFactory,
                                    link_url: nodeLinks.getUrl(targetFolder),
                                    targetFolder: targetFolder
                                  };
                                  self.showSuccessWithLink(promises, msgOptions);
                                }
                                uploadCollection.models && uploadCollection.models.length > 0 &&
                                _.each(uploadCollection.models, function (filemodel) {
                                  uploadFileModels.push(filemodel.node);
                                });
                                status.collection && status.collection.remove(uploadFileModels);     // remove only processed nodes and not all selected
                                self.allowCollectionRefetch = true;
                                deferred.resolve(uploadFileModels);
                              })
                              .always(function () {
                                self._announceOperationEnd(status);
                                context.trigger('current:folder:changed');
                              })
                              .fail(function () {
                                deferred.reject();
                              });

                        })
                        .fail(function () {
                          self._announceOperationEnd(status);
                          deferred.reject();
                        });

                  })
                  .fail(function (error) {   // resolve namingConflicts
                    if (error && error.userAction && error.userAction ===
                        "cancelResolveNamingConflicts") {
                      self.trigger("resolve:naming:conflicts:cancelled");
                    }
                    else if (error && !error.cancelled) {  // if not undefined (cancel) then display error
                      self.showError(error);
                    }
                    self._announceOperationEnd(status);
                    deferred.reject();                  // empty promise
                  });
            })
            .fail(function (error) {
              if (error && !error.cancelled) {                           // if not undefined (cancel) then display error
                self.showError(error);
              }
              deferred.reject();
            });

      }, deferred.reject);              // require

      return deferred.promise();        // return empty promise!
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
    },

    _selectMoveOptions: function (status, options) {
      var self = this;
      var deferred = $.Deferred();

      require(['csui/dialogs/node.picker/node.picker'],
          function (NodeDestinationPicker) {
            var contextMenuCopy = status.container ? (status.container.get('id') ===
                                                      status.nodes.models[0].get('id')) : false;
            var numNodes = status.nodes.length;
            var dialogTitle = _.str.sformat(
                numNodes > 1 ? lang.DialogTitleMove : lang.DialogTitleSingleMove, numNodes);
            var pickerOptions = _.extend({
              command: 'move',
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

            self.nodePicker = new NodeDestinationPicker(pickerOptions);

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
      var h1 = nodeNames.length === 1 ? lang.MovingNode :
               _.str.sformat(lang.MovingNodes, nodeNames.length);
      var conflictResolver = new ConflictResolver({
        h1Label: h1,
        actionBtnLabel: lang.CommandNameMove,
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

        options.action = 'move';
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

    _moveSelectedNodes: function (uploadCollection, connector, targetFolder, applyProperties) {
      var self     = this,
          queue    = new TaskQueue({
            parallelism: config.parallelism
          }),
          promises = _.map(uploadCollection.models, function (model) {
            var deferred = $.Deferred();
            queue.pending.add({
              worker: function () {
                var promise,
                    attributes = model.attributes;
                if (attributes.extended_data && attributes.extended_data.roles) {
                  promise = self._moveNodeWithMetadata(attributes, connector,
                      targetFolder.get('id'), applyProperties);
                } else {
                  promise = self._moveNode(attributes, connector, targetFolder.get('id'),
                      applyProperties);
                }
                promise
                    .done(function () {
                      model.set('count', 1);
                      model.deferred.resolve(model);
                      deferred.resolve(model);
                    })
                    .fail(function (cause) {
                      var errObj = new CommandError(cause);
                      model.deferred.reject(model, errObj);
                      deferred.reject(errObj);
                    });
                return deferred.promise();
              }
            });
            return deferred.promise(promises);      // return promises
          });

      GlobalMessage.showFileUploadProgress(uploadCollection, {
        oneFileTitle: lang.MovingOneItem,
        oneFileSuccess: lang.MoveOneItemSuccessMessage,
        multiFileSuccess: lang.MoveManyItemsSuccessMessage,
        oneFilePending: lang.MovingOneItem,
        multiFilePending: lang.MovingItems,
        oneFileFailure: lang.MoveOneItemFailMessage,
        multiFileFailure: lang.MoveManyItemsFailMessage2,
        someFileSuccess: lang.MoveSomeItemsSuccessMessage,
        someFilePending: lang.MovingSomeItems,
        someFileFailure: lang.MoveSomeItemsFailMessage2,
        enableCancel: false
      });
      return $.whenAll.apply($, promises);
    },

    _moveNodeWithMetadata: function (instruction, connector, targetFolderID, applyProperties) {
      var self = this;
      var bodyParam;
      var moveOptions;

      bodyParam = {
        "parent_id": targetFolderID,
        "name": instruction.newName ? instruction.newName : instruction.name,
        "roles": instruction.extended_data.roles
      };
      moveOptions = connector.extendAjaxOptions({
        url: Url.combine(connector.connection.url.replace('/v1', '/v2'), '/nodes/', instruction.id),
        method: 'PUT',
        data: connector.formatAjaxData(bodyParam),
        contentType: connector.getAjaxContentType()
      });

      return $.ajax(moveOptions);
    },

    _moveNode: function (instruction, connector, targetFolderID, applyProperties) {
      var self = this;

      return this._getCategories(connector, instruction.id, targetFolderID)
          .then(function (categories) {
            var categoryGroupMapping;
            var bodyParam;
            var moveOptions;

            categoryGroupMapping = {};
            categoryGroupMapping[ApplyPropertiesSelectorView.KEEP_ORIGINAL_PROPERTIES] = 'original';
            categoryGroupMapping[ApplyPropertiesSelectorView.APPLY_DESTINATION_PROPERTIES] = 'destination';
            categoryGroupMapping[ApplyPropertiesSelectorView.COMBINE_ALL_PROPERTIES] = 'merged';

            bodyParam = {
              "parent_id": targetFolderID,
              "name": instruction.newName ? instruction.newName : instruction.name,
              "roles": {
                "categories": categories[categoryGroupMapping[applyProperties]]
              }
            };
            moveOptions = connector.extendAjaxOptions({
              url: Url.combine(connector.connection.url.replace('/v1', '/v2'), '/nodes/',
                  instruction.id),
              method: 'PUT',
              data: connector.formatAjaxData(bodyParam),
              contentType: connector.getAjaxContentType()
            });

            return $.ajax(moveOptions);
          });
    },

    _getCategories: function (connector, nodeID, targetFolderID) {
      var getCategoriesOptions = connector.extendAjaxOptions({
        url: connector.connection.url + '/forms/nodes/move?' +
             $.param({
               id: nodeID,
               parent_id: targetFolderID
             })
      });

      return $.ajax(getCategoriesOptions)
          .then(function (response, statusText, jqxhr) {
            var form = response.forms[1];
            return form && form.data || {};
          });
    }
  });

  return MoveCommand;
});
