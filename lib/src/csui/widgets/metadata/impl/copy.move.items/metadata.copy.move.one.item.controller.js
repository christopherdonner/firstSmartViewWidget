/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["csui/lib/underscore", "csui/widgets/metadata/impl/common/base.metadata.action.view",
  "csui/widgets/metadata/impl/metadata.controller",
  "csui/widgets/metadata/metadata.action.one.item.properties.view",
  "csui/utils/commandhelper", "i18n!csui/widgets/metadata/impl/nls/lang",
  "csui/dialogs/modal.alert/modal.alert", 'csui/utils/commands',
  "css!csui/widgets/metadata/impl/metadata"
], function (_, BaseMetadataActionView, MetadataController,
    MetadataActionOneItemPropertiesView, CommandHelper, lang, ModalAlert, commands) {

  function MetadataCopyMoveOneItemController() {
  }

  _.extend(MetadataCopyMoveOneItemController.prototype, BaseMetadataActionView.prototype, {
    displayForm: function (status, options) {
      var nodes = CommandHelper.getAtLeastOneNode(status);
      var node = nodes.length > 0 ? nodes.models[0] : null;

      this.node = node;

      var addItemView = this.metadataAddItemPropView = new MetadataActionOneItemPropertiesView({
        model: node,
        container: status.container,
        originatingView: options.originatingView,
        context: options.context,
        commands: commands,
        action: options.action,
        inheritance: options.inheritance
      });

      var baseUIOptions = {};
      baseUIOptions.callerProcessData = options.callerProcessData;
      baseUIOptions.originatingView = options.originatingView;
      baseUIOptions.view = addItemView;
      var dialogOptions = {};
      dialogOptions.dialogTitle = options.dialogTitle ? options.dialogTitle :
                                  lang.defaultDialogTitle;
      dialogOptions.OkButtonTitle = options.okButtonTitle ? options.okButtonTitle :
                                    lang.defaultDialogOkButtonTitle;
      dialogOptions.OkButtonClick = this._CopyMoveItem;
      baseUIOptions.dialogOptions = dialogOptions;

      var deferred = this.baseDisplayForm(baseUIOptions);

      return deferred;
    },
    _CopyMoveItem: function (args) {
      if (args.view.metadataPropertiesView && args.view.metadataPropertiesView.allFormsRendered) {
        var valid = this.metadataAddItemPropView.validate();
        if (valid) {
          var data = this.metadataAddItemPropView.getValues();

          if (args.callerProcessData === true) {
            this.dialog.destroy();
            this.deferred.resolve({data: data});
          } else {
            var metadataController = new MetadataController();
            metadataController.createItem(this.node, data)
                .done(_.bind(function (resp) {
                  this.dialog.destroy();
                  this.deferred.resolve({name: data.name});
                }, this))
                .fail(function (resp) {
                  var error = lang.failedToCreateItem;
                  if (resp) {
                    if (resp.responseJSON && resp.responseJSON.error) {
                      error = resp.responseJSON.error;
                    } else if (resp.responseText) {
                      error = resp.responseText;
                    }
                    ModalAlert.showError(error);
                  }
                });
          }
        }
      }
    }

  });

  _.extend(MetadataCopyMoveOneItemController, {version: "1.0"});

  return MetadataCopyMoveOneItemController;

});
