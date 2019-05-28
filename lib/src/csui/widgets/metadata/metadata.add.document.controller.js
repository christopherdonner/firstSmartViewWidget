/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["csui/lib/underscore", "csui/lib/jquery", "csui/lib/backbone",
  "csui/models/nodes", "csui/models/node/node.model",
  "csui/widgets/metadata/metadata.add.item.controller", "csui/widgets/metadata/impl/metadata.utils",
  "csui/widgets/metadata/impl/add.items/metadata.add.multiple.docs.controller",
  "i18n!csui/widgets/metadata/impl/nls/lang", "csui/utils/deepClone/deepClone"
], function (_, $, Backbone, NodeCollection, NodeModel, MetadataAddItemController, MetadataUtils,
    MetadataAddMultipleDocsController, lang) {
  'use strict';

  function MetadataAddDocumentController() {
  }

  _.extend(MetadataAddDocumentController.prototype, Backbone.Events, {
    addItemsRequiredMetadata: function (fileUploadCollection, options) {
      var deferred      = $.Deferred(),
          fileModels    = fileUploadCollection.models,
          file          = _.find(fileUploadCollection.models, function (fileUploadModel) {
                return fileUploadModel.get('newVersion') === undefined;
              }) || fileModels[0],
          tempName      = fileModels.length > 0 ? file.get('file').name : 'temp_name',
          utilOptions   = {
            action: 'create',
            addableType: options.addableType,
            name: tempName,
            container: options.container,
            docParentId: fileModels.length > 0 ? file.get('id') : null
          },
          metadataUtils = new MetadataUtils(),
          newFiles      = $.grep(fileUploadCollection.models, function (fileUploadModel) {
            return fileUploadModel.get('newVersion') === undefined;
          }); //Collection might contain new versions of existing items, remove such items

      metadataUtils.ContainerHasEnforcedEmptyRequiredMetadata(utilOptions)
          .done(_.bind(function (resp) {
            if (resp.hasRequiredMetadata === true) {
              var metadataDeferred = $.Deferred();

              if (newFiles && newFiles.length === 1) {
                metadataDeferred = this._addOneItemWithRequiredMetadata(newFiles,
                    options);
              } else if (newFiles && newFiles.length > 1) {
                if (resp.initialFormData) {
                  options.initialFormData = resp.initialFormData;
                }
                metadataDeferred = this._addMultipleItemsWithRequiredMetadata(newFiles,
                    options);
              } else {
                deferred.reject();
              }

              metadataDeferred.done(function (resp) {
                deferred.resolve(resp);
              }).fail(function (error) {
                deferred.reject(error);
              });

            } else {
              deferred.resolve({});
            }
          }, this))
          .fail(function (error) {
            deferred.reject(error);
          });

      return deferred.promise();
    },
    _makeNodeCollectionFromItems: function (items, options) {
      var nodes = new NodeCollection();
      if (items && items.length > 0) {
        _.each(items, function (item) {
          var file = item.get('file');
          var node = new NodeModel({
            name: item.get('newName') || file.name,
            type: item.get('type') || 144,
            size: file.size,
            mime_type: file.type,
            fileObject: item,
            extended_data: item.get('extended_data')
          }, {
            connector: options.container.connector
          });
          _.extend(node.options, {
            enforcedRequiredAttrs: true
          });
          nodes.add(node, {silent: true});
        }, this);
      }
      return nodes;
    },
    _addOneItemWithRequiredMetadata: function (items, options) {
      var deferred = $.Deferred();

      var nodes = this._makeNodeCollectionFromItems(items, options);
      var status = {
        nodes: nodes,
        container: options.container,
        context: options.context
      };
      var cmdOptions = {
        callerProcessData: true,
        dialogTitle: lang.addDocumentMetadataDialogTitle,
        addButtonTitle: lang.addDocumentMetadataDialogAddButtonTitle,
        cancelButtonActionToken: "cancelAddOneItemWithRequiredMetadata"
      };
      var metadataAddItemController = new MetadataAddItemController();
      metadataAddItemController
          .displayForm(status, cmdOptions)
          .done(function (resp) {
            var item = items[0];
            item.set('newName', resp.data.name);

            var extendedData = {};
            if (resp.data.description !== undefined) {
              extendedData.description = resp.data.description;
            }
            if (resp.data.advanced_versioning !== undefined) {
              extendedData.advanced_versioning = resp.data.advanced_versioning;
            }
            if (resp.data.roles) {
              extendedData.roles = _.deepClone(resp.data.roles);
            }
            if (_.isEmpty(extendedData) === false) {
              item.set('extended_data', extendedData);
            }

            deferred.resolve();
          })
          .fail(function (args) {
            var error = (args && args.error) ? args.error : undefined;
            var userAction;

            if (args && args.buttonAttributes) {
              if (args.buttonAttributes.actionToken === "cancelAddOneItemWithRequiredMetadata") {
                userAction = "cancelAddOneItemWithRequiredMetadata";
              }
              else if (args.buttonAttributes.actionToken === "closeMetadataActionView") {
                userAction = "closeMetadataActionView";
              }
            }
            deferred.reject({error: error, userAction: userAction});
          });

      return deferred.promise();
    },
    _addMultipleItemsWithRequiredMetadata: function (items, options) {
      var deferred = $.Deferred();

      var nodes = this._makeNodeCollectionFromItems(items, options);
      var cmdStatus = {nodes: nodes};

      var metadataAddMultipleDocsController = new MetadataAddMultipleDocsController();
      metadataAddMultipleDocsController
          .displayForm(cmdStatus, options)
          .done(function (resp) {
            deferred.resolve();
          })
          .fail(function () {
            deferred.reject();
          });

      return deferred.promise();
    }

  });

  MetadataAddDocumentController.prototype.get = Backbone.Model.prototype.get;
  _.extend(MetadataAddDocumentController, {version: "1.0"});

  return MetadataAddDocumentController;

});
