/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module',
  'require',
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/models/command',
  'csui/utils/commandhelper',
  'csui/utils/command.error',
  'csui/models/node/node.model',
  'i18n!workflow/widgets/workitem/workitem.attachments/impl/nls/lang'
], function (module, require, _, $, CommandModel,
    CommandHelper, CommandError, NodeModel, lang) {
  'use strict';

  var config = module.config();
  _.defaults(config, {
    parallelism: 3
  });
  var GlobalMessage, ConflictResolver, TaskQueue,
      ApplyPropertiesSelectorView, UploadFileCollection, PageLeavingBlocker;

  var AddCommand = CommandModel.extend({

    defaults: {
      signature: "Add",
      name: lang.CommandNameAdd,
      verb: lang.CommandVerbAdd,
      doneVerb: lang.CommandDoneVerbAdd,
      pageLeavingWarning: lang.AddPageLeavingWarning
    },

    execute: function (status, options) {
      this.options = options;
      var self = this;
      var deferred = $.Deferred();
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

        self._selectShortCutCreateOptions(status)
            .done(function (selectedOptions) {
              var selectedNodes = selectedOptions.nodes;
              var targetFolder = collection.node;
              var applyProperties = selectedOptions.applyProperties;
              var createToCurrentFolder = true;
              self._announceOperationStart(status.originatingView);

              var namesToResolve = _.map(selectedNodes, function (node) {
                var returnObj = {
                  id: node.get('id'),
                  name: node.get('name'),
                  container: node.get('container'),
                  mime_type: node.get('mime_type'),
                  original_id: node.get('original_id'),
                  original_id_expand: node.get('original_id_expand'),
                  type: node.get('type'),
                  size: node.get('size'),
                  type_name: node.get('type_name'),
                  state: 'pending',
                  count: 0,
                  total: 1,
                  enableCancel: false
                };
                return returnObj;
              });
              var createNamesToResolve = _.map(namesToResolve, function (name) {
                return _.clone(name);
              });
              self._resolveNamingConflicts(targetFolder, createNamesToResolve)
                  .done(function (createInstructions) {

                    _.each(createInstructions, function (instruction) {
                      instruction.type = _.findWhere(namesToResolve,
                          {name: instruction.name}).type;

                    });

                    var uploadCollection = new UploadFileCollection(createInstructions);
                    var connector = collection.connector;

                    self._createSelectedNodes(uploadCollection, connector,
                        targetFolder, applyProperties, createToCurrentFolder,
                        status.collection)
                        .done(function () {
                          GlobalMessage.hideFileUploadProgress();
                          var msg = (createInstructions.length === 1) ?
                                    lang.MessageItemAdded : lang.MessageItemsAdded;
                          msg = _.str.sformat(msg, createInstructions.length);
                          GlobalMessage.showMessage('success', msg);
                          deferred.resolve();
                        })
                        .always(function () {
                          self._announceOperationEnd(status.originatingView,
                              createToCurrentFolder);
                        })
                        .fail(function () {
                          deferred.reject();
                        });

                  })
                  .fail(function (error) {
                    self._announceOperationEnd(status.originatingView, createToCurrentFolder);
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

    _announceOperationEnd: function (view, createToCurrentFolder) {
      PageLeavingBlocker.disable();
      var collectionView = view.resultsView || view.tableView;
      if (collectionView) {
        if (createToCurrentFolder) {
          collectionView.collection.fetch();
        }
        collectionView.unblockActions();
      }
    },

    _selectShortCutCreateOptions: function (status) {
      var self = this;
      var deferred = $.Deferred();

      require(['csui/dialogs/node.picker/node.picker'],
          function (NodePicker) {
            var pickerOptions = _.extend({
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
                .then(function (args) {
                  var nodes = [];
                  _.each(args.nodes, function (node) {
                    var newNode = new NodeModel({
                      "type": self.options.type,
                      "icon": node.get('icon'),
                      "type_name": self.options.type_name,
                      "container": false,
                      "name": node.get('name'),
                      "original_id": node.get('id'),
                      "original_id_expand": node.attributes
                    }, {connector: status.container.connector});
                    nodes.push(newNode);
                  });
                  args.nodes = nodes;
                  return args;
                })
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
      var h1 = (nodeNames.length === 1) ? lang.AddingNode : lang.AddingNodes;
      var conflictResolver = new ConflictResolver({
        h1Label: _.str.sformat(h1, nodeNames.length),
        actionBtnLabel: 'Add',
        excludeAddVersion: true,
        container: targetFolder,
        files: nodeNames
      });
      return conflictResolver.run();
    },

    _createSelectedNodes: function (uploadCollection, connector, targetFolder, applyProperties,
        createToCurrentFolder, targetCollection) {
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
                      self._createNode(categories, attributes, connector, targetId, model.node)
                          .done(function () {
                            model.set('count', 1);
                            model.deferred.resolve(model);
                            createToCurrentFolder &&
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
            targetCollection.unshift(node);
          });

    },

    _createNode: function (categories, instruction, connector, targetFolderID, node) {

      var nodeAttr = {
        "original_id": instruction.original_id,
        "parent_id": targetFolderID,
        "name": instruction.newName ? instruction.newName : instruction.name,
        "roles": categories,
        "action": 'create',
        "type": instruction.type,
        "original_id_expand": instruction.original_id_expand
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
          url: connector.connection.url + '/forms/nodes/create',
          method: 'get',
          data: {
            type: attributes.type,
            parent_id: targetFolderID
          }
        });

        $.ajax(getCategoriesOptions)
            .then(function (response) {
              var data = response.forms[0].data;
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

  return AddCommand;

});
