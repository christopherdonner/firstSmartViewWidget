/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["csui/lib/underscore", "csui/lib/jquery", "csui/lib/backbone", "csui/models/nodes",
  "csui/models/node/node.model", "csui/widgets/metadata/impl/metadata.utils", "csui/models/actions",
  "csui/widgets/metadata/impl/copy.move.items/metadata.copy.move.one.item.controller",
  "csui/widgets/metadata/impl/copy.move.items/metadata.copy.move.multiple.items.controller",
  "i18n!csui/widgets/metadata/impl/nls/lang", "csui/utils/deepClone/deepClone"
], function (_, $, Backbone, NodeCollection, NodeModel, MetadataUtils, ActionCollection,
    MetadataCopyMoveOneItemController, MetadataCopyMoveMultipleItemsController, lang) {

  function MetadataCopyMoveItemsController() {
  }

  _.extend(MetadataCopyMoveItemsController.prototype, Backbone.Events, {
    CopyMoveItemsWithMetadata: function (items, options) {
      return this.CopyMoveItemsRequiredMetadata(items, _.extend(options, {openMetadata: true}));
    },
    _copyMoveItemsWithMetadata: function (items, options) {
      var deferred = $.Deferred();
      var metadataDeferred = $.Deferred();

      if (items && items.length > 0) {
        options.id || (options.id = items[0].id);
        options.container || (options.container = options.targetFolder);
      }

      if (items && items.length === 1) {
        metadataDeferred = this._copyMoveOneItemWithRequiredMetadata(items, options);
      } else if (items && items.length > 1) {
        metadataDeferred = this._copyMoveMultipleItemsWithRequiredMetadata(items, options);
      } else {
        deferred.reject();
      }

      metadataDeferred.done(function (resp) {
        deferred.resolve();
      }).fail(function (error) {
        deferred.reject(error);
      });

      return deferred.promise();
    },
    CopyMoveItemsRequiredMetadata: function (items, options) {
      if (!items || items.length < 1) {
        return $.Deferred().reject();
      }
      if (options.openMetadata !== true && options.inheritance === 'original') {
        return $.Deferred().resolve();
      }
      if (options.openMetadata !== true && items.length > 1 && options.inheritance === 'merged') {
        return $.Deferred().resolve();
      }

      var deferred = $.Deferred();
      var utilOptions = {
        action: options.action,
        inheritance: options.inheritance,
        items: items,
        container: options.targetFolder,
        context: options.context
      };
      var metadataUtils = new MetadataUtils();
      metadataUtils.ContainerHasEnforcedEmptyRequiredMetadataOnNodes(utilOptions)
          .done(_.bind(function (resp) {
            if ((resp.requiredMetadata && resp.enforcedItems && resp.enforcedItems.length > 0) ||
                options.openMetadata === true) {
              if (resp.requiredMetadata) {
                utilOptions = _.extend(utilOptions, {enforcedItems: resp.enforcedItems});
              }
              this._copyMoveItemsWithMetadata(items, utilOptions)
                  .done(function (resp) {
                    deferred.resolve(resp);
                  }).fail(function (error) {
                deferred.reject(error);
              });
            } else {
              deferred.resolve();
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
          var enforcedRequiredAttrs = _.find(options.enforcedItems,
              function (enfItem) { return enfItem.id === item.id; }) === undefined ? false : true;
          var node = new NodeModel({
            id: item.id,
            name: item.newName || item.name,
            container: item.container,
            mime_type: item.mime_type,
            original_id: item.original_id,
            type: item.type,
            type_name: item.type_name,
            action: options.action,
            inheritance: options.inheritance,
            itemObject: item,
            size: item.size,
            size_formatted: (item.type === 144 || item.type === 749 || item.type === 736 ||
                             item.type === 30309) ? item.size_formatted : undefined
          }, {
            connector: options.container.connector
          });
          if (item.type === 140) { // for url object
            node.attributes.url = item.url;
          }
          _.extend(node.options, {
            original: item.original,
            enforcedRequiredAttrs: enforcedRequiredAttrs
          });
          node.original = item.original || node.original;
          node.actions = item.actions || new ActionCollection();
          nodes.add(node, {silent: true});
        }, this);
      }
      return nodes;
    },
    _copyMoveOneItemWithRequiredMetadata: function (items, options) {
      var deferred = $.Deferred();
      var nodes = this._makeNodeCollectionFromItems(items, options);
      var status = {
        nodes: nodes,
        container: options.container
      };
      var dialogTitle, okButtonTitle;
      if (options.action === 'copy') {
        dialogTitle = lang.copyOneItemMetadataDialogTitle;
        okButtonTitle = lang.copyItemsMetadataDialogButtonTitle;
      } else if (options.action === 'move') {
        dialogTitle = lang.moveOneItemMetadataDialogTitle;
        okButtonTitle = lang.moveItemsMetadataDialogButtonTitle;
      }
      dialogTitle = this._extendDialogTitle(dialogTitle, options.inheritance);

      var cmdOptions = {
        callerProcessData: true,
        action: options.action,
        context: options.context,
        inheritance: options.inheritance,
        originatingView: options.originatingView,
        dialogTitle: dialogTitle,
        okButtonTitle: okButtonTitle
      };
      var metadataCopyMoveOneItemController = new MetadataCopyMoveOneItemController();
      metadataCopyMoveOneItemController
          .displayForm(status, cmdOptions)
          .done(function (resp) {
            items[0].newName = resp.data.name;
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
              items[0].extended_data = extendedData;
            }

            deferred.resolve();
          })
          .fail(function (error) {
            deferred.reject(error);
          });

      return deferred.promise();
    },
    _copyMoveMultipleItemsWithRequiredMetadata: function (items, options) {
      var deferred = $.Deferred();

      var dialogTitle, okButtonTitle;
      if (options.action === 'copy') {
        dialogTitle = _.str.sformat(lang.copyMultipleItemsMetadataDialogTitle, items.length);
        okButtonTitle = lang.copyItemsMetadataDialogButtonTitle;
      } else if (options.action === 'move') {
        dialogTitle = _.str.sformat(lang.moveMultipleItemsMetadataDialogTitle, items.length);
        okButtonTitle = lang.moveItemsMetadataDialogButtonTitle;
      }
      dialogTitle = this._extendDialogTitle(dialogTitle, options.inheritance);

      var nodes = this._makeNodeCollectionFromItems(items, options);
      var cmdStatus = {nodes: nodes};
      var cmdOptions = {
        action: options.action,
        inheritance: options.inheritance,
        container: options.container,
        context: options.context,
        originatingView: options.originatingView,
        dialogTitle: dialogTitle,
        okButtonTitle: okButtonTitle
      };
      var metadataCopyMoveMultipleItemsController = new MetadataCopyMoveMultipleItemsController();
      metadataCopyMoveMultipleItemsController
          .displayForm(cmdStatus, cmdOptions)
          .done(function (resp) {
            deferred.resolve();
          })
          .fail(function (error) {
            deferred.reject(error);
          });

      return deferred.promise();
    },
    _extendDialogTitle: function (dialogTitle, inheritance) {
      var extDialogTitle = dialogTitle;
      if (inheritance === 'original') {
        extDialogTitle = dialogTitle + ' ' + lang.inheritanceOriginalProperties;
      } else if (inheritance === 'destination') {
        extDialogTitle = dialogTitle + ' ' + lang.inheritanceDestinationProperties;
      } else if (inheritance === 'merged') {
        extDialogTitle = dialogTitle + ' ' + lang.inheritanceMergedProperties;
      }
      return extDialogTitle;
    }

  });

  MetadataCopyMoveItemsController.prototype.get = Backbone.Model.prototype.get;
  _.extend(MetadataCopyMoveItemsController, {version: "1.0"});

  return MetadataCopyMoveItemsController;
});
