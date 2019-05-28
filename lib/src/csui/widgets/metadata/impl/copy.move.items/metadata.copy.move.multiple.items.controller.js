/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["csui/lib/underscore", "csui/widgets/metadata/impl/common/base.metadata.action.view",
  "csui/models/node/node.model", "csui/controls/dialog/dialog.view",
  "csui/widgets/metadata/impl/common/metadata.action.multiple.items.view",
  "i18n!csui/widgets/metadata/impl/nls/lang", "csui/dialogs/modal.alert/modal.alert",
  "css!csui/widgets/metadata/impl/metadata", "csui/utils/deepClone/deepClone"
], function (_, BaseMetadataActionView, NodeModel, DialogView,
    MetadataActionMultipleItemsView, lang, ModalAlert) {

  function MetadataCopyMoveMultipleItemsController() {
  }

  _.extend(MetadataCopyMoveMultipleItemsController.prototype, BaseMetadataActionView.prototype, {
    displayForm: function (status, options) {

      this.metadataAddItems = new MetadataActionMultipleItemsView({
        container: options.container,
        collection: status.nodes,
        selected: status.nodes,
        originatingView: options.originatingView,
        context: options.context,
        action: options.action,
        inheritance: options.inheritance
      });

      this.listenTo(this.metadataAddItems, "metadata:add", _.bind(function () {
        this.deferred.resolve();
      }, this));

      var baseUIOptions = {};
      baseUIOptions.originatingView = options.originatingView;
      baseUIOptions.view = this.metadataAddItems;
      var dialogOptions = {};
      dialogOptions.dialogTitle = options.dialogTitle ? options.dialogTitle :
                                  lang.defaultDialogTitle;
      dialogOptions.OkButtonTitle = options.okButtonTitle ? options.okButtonTitle :
                                    lang.defaultDialogOkButtonTitle;
      dialogOptions.OkButtonClick = this._CopyMoveItems;
      baseUIOptions.dialogOptions = dialogOptions;

      return this.baseDisplayForm(baseUIOptions);

    },
    _CopyMoveItems: function (args) {
      if (args.view.mdv && args.view.mdv.metadataPropertiesView &&
          args.view.mdv.metadataPropertiesView.allFormsRendered) {
        var valid = this.metadataAddItems.validateAndSetValuesToNode();
        if (valid) {
          var allValid = true;
          this.metadataAddItems.collection.forEach(function (model) {
            var modelValid = model.options.enforcedRequiredAttrs === true ?
                             (model.validated ? true : false ) : true;
            allValid = allValid && modelValid;
          });
          if (allValid) {
            this.metadataAddItems.collection.forEach(function (model) {
              var data = model.get('data');
              var item = model.get('itemObject');
              if (data && item) {
                item.newName = data.name;
                var extendedData = {};
                if (data.description !== undefined) {
                  extendedData.description = data.description;
                }
                if (data.advanced_versioning !== undefined) {
                  extendedData.advanced_versioning = data.advanced_versioning;
                }
                if (data.roles) {
                  extendedData.roles = _.deepClone(data.roles);
                }
                if (_.isEmpty(extendedData) === false) {
                  item.extended_data = extendedData;
                }
              }
            });
            this.dialog.destroy();
            this.deferred.resolve();
          } else {
            var title = lang.defaultDialogTitle;
            var message = lang.missingRequiredMetadataForObjects;
            ModalAlert.showError(message, title);
          }
        }
      }
    }

  });

  _.extend(MetadataCopyMoveMultipleItemsController, {version: "1.0"});

  return MetadataCopyMoveMultipleItemsController;

});
