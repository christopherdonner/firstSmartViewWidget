/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["csui/lib/underscore", "csui/widgets/metadata/impl/common/base.metadata.action.view",
  "csui/widgets/metadata/impl/metadata.controller",
  "csui/widgets/metadata/metadata.action.one.item.properties.view",
  "csui/utils/commandhelper", "i18n!csui/widgets/metadata/impl/nls/lang",
  "csui/dialogs/modal.alert/modal.alert", 'csui/utils/nodesprites',
  'csui/utils/commands', "css!csui/widgets/metadata/impl/metadata"
], function (_, BaseMetadataActionView, MetadataController,
    MetadataActionOneItemPropertiesView, CommandHelper, lang, ModalAlert,
    nodeSpriteCollection, commands) {

  function MetadataAddItemController() {
  }

  _.extend(MetadataAddItemController.prototype, BaseMetadataActionView.prototype, {
    displayForm: function (status, options) {
      var nodes = CommandHelper.getAtLeastOneNode(status);
      var node = nodes.length > 0 ? nodes.models[0] : null;
      var addableTypeName = node.get('type_name') ?
                            nodeSpriteCollection.findTypeByNode(node) :
                            lang.addItemMetadataDialogTitleGeneric;

      this.node = node;
      this.metadataController = options.metadataController;

      var addItemView = this.metadataAddItemPropView = new MetadataActionOneItemPropertiesView({
        model: node,
        container: status.container,
        id: options.id,
        context: status.context || options && options.context,
        commands: commands,
        action: 'create',
        inheritance: options.inheritance,
        collection: options.completeFormCollection,
        formCollection: options.formCollection
      });
      var baseUIOptions = {};
      baseUIOptions.callerProcessData = options.callerProcessData;
      baseUIOptions.originatingView = options.originatingView;
      baseUIOptions.view = addItemView;
      var dialogOptions = {};
      dialogOptions.dialogTitle = options.dialogTitle ? options.dialogTitle :
                                  _.str.sformat(lang.addItemMetadataDialogTitle1, addableTypeName);
      dialogOptions.OkButtonTitle = options.addButtonTitle ? options.addButtonTitle :
                                    lang.addItemMetadataDialogButtonAddTitle;
      dialogOptions.OkButtonClick = this._addItem;
      dialogOptions.CancelButtonActionToken = options.cancelButtonActionToken;
      baseUIOptions.dialogOptions = dialogOptions;

      var deferred = this.baseDisplayForm(baseUIOptions);
      this.listenTo(this.metadataAddItemPropView, "update:button", _.bind(function (args) {
        this.dialog && this.dialog.trigger("update:button", args);
      }, this));

      return deferred;
    },
    _addItem: function (args) {
      function updateButtons(dialog, attributes) {
        if (dialog && dialog.footerView) {
          dialog.footerView.getButtons().forEach(function (buttonView) {
            buttonView.updateButton(attributes);
          });
        }
      }

      if (!!args.view.metadataPropertiesView.allFormsRendered) {
        var enable = false;
        if (args.callerProcessData !== true) {
          updateButtons(this.dialog, {disabled: true});
          enable = true;
        }
        var valid = this.metadataAddItemPropView.validate();
        if (valid) {
          var data = this.metadataAddItemPropView.getValues();

          if (args.callerProcessData === true) {
            this.dialog.destroy();
            this.deferred.resolve({data: data});
          } else {
            var metadataController = this.metadataController ||
                                     new MetadataController();

            this.metadataAddItemPropView.blockActions();
            enable = false;
            metadataController.createItem(this.node, data)
                .done(_.bind(function (resp) {
                  this.listenToOnce(this.dialog, "hide", function () {
                    this.metadataAddItemPropView.unblockActions();
                    updateButtons(this.dialog, {disabled: false});
                  });
                  this.dialog.destroy();
                  this.deferred.resolve({name: data.name});
                }, this))
                .fail(_.bind(function (resp) {
                  this.metadataAddItemPropView.unblockActions();
                  var error = lang.failedToCreateItem;
                  if (resp) {
                    if (resp.responseJSON && resp.responseJSON.error) {
                      error = resp.responseJSON.error;
                    } else if (resp.responseText) {
                      error = resp.responseText;
                    }
                    ModalAlert.showError(error);
                  }
                  updateButtons(this.dialog, {disabled: false});
                }, this));
          }
        }
        if (enable) {
          updateButtons(this.dialog, {disabled: false});
        }
      }
    }

  });

  _.extend(MetadataAddItemController, {version: "1.0"});

  return MetadataAddItemController;

});
