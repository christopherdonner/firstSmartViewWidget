/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["csui/lib/underscore", "csui/widgets/metadata/impl/common/base.metadata.action.view",
  "csui/models/node/node.model", "csui/controls/dialog/dialog.view",
  "csui/widgets/metadata/impl/common/metadata.action.multiple.items.view",
  "i18n!csui/widgets/metadata/impl/nls/lang", "csui/dialogs/modal.alert/modal.alert",
  'csui/utils/commands',
  "css!csui/widgets/metadata/impl/metadata", "csui/utils/deepClone/deepClone"
], function (_, BaseMetadataActionView, NodeModel, DialogView,
    MetadataActionMultipleItemsView, lang, ModalAlert, commands) {

  function MetadataAddMultipleDocsController() {
  }

  _.extend(MetadataAddMultipleDocsController.prototype, BaseMetadataActionView.prototype, {
    displayForm: function (status, options) {

      var applyFlag        = false,
          commonCategories = this._getCommonCategories(options);
      if (options.initialFormData && options.initialFormData.models &&
          options.initialFormData.models.length > 1) {
        applyFlag = true;
      }
      this.metadataAddItems = new MetadataActionMultipleItemsView({
        container: options.container,
        collection: status.nodes,
        selected: status.nodes,
        action: 'create',
        originatingView: options.originatingView,
        context: options.context,
        commands: commands,
        commonCategories: commonCategories,
        applyFlag: applyFlag,
        initialFormData: options.initialFormData
      });

      this.listenTo(this.metadataAddItems, "metadata:add", _.bind(function () {
        this.deferred.resolve();
      }, this));

      var baseUIOptions = {};
      baseUIOptions.originatingView = options.originatingView;
      baseUIOptions.view = this.metadataAddItems;
      var dialogOptions = {};
      dialogOptions.dialogTitle = options.dialogTitle ? options.dialogTitle :
                                  lang.addDocumentMetadataDialogTitle;
      dialogOptions.OkButtonTitle = options.addButtonTitle ? options.addButtonTitle :
                                    lang.addDocumentMetadataDialogAddButtonTitle;
      dialogOptions.OkButtonClick = this._addItems;
      baseUIOptions.dialogOptions = dialogOptions;

      return this.baseDisplayForm(baseUIOptions);

    },

    _getCommonCategories: function (options) {
      var formValues = {},
          that       = this;
      if (options.initialFormData && options.initialFormData.models) {
        _.each(options.initialFormData.models, function (tab, key) {
          var values   = tab.get("data"),
              roleName = tab.get("role_name"),
              options  = tab.get('options'),
              schema   = tab.get('schema'),
              roles, role, category;

          if (values) {
            if (roleName) {
              roles = formValues.roles || (formValues.roles = {});
              role = roles[roleName] || (roles[roleName] = {});
              if (roleName === 'categories') {
                var catId = tab.get("id").toString();
                category = role[catId] || (role[catId] = {});
                if (_.isEmpty(values)) {
                  category = null;
                } else {
                  values = JSON.parse(JSON.stringify(values).replace(/null/g, "\"\""));
                  _.extend(category, values);
                }
              } else {
              }
            }
          }
        });
      }
      return formValues;
    },
    _addItems: function (args) {
      if (args.view.mdv && args.view.mdv.metadataPropertiesView &&
          args.view.mdv.metadataPropertiesView.allFormsRendered) {
        var valid = this.metadataAddItems.validateAndSetValuesToNode();
        if (valid) {
          this.options.view.$el.find(".cs-formfield-invalid").removeClass('cs-formfield-invalid');
          var allValid = true;
          this.metadataAddItems.validateAndSetValuesToAllNode();
          this.metadataAddItems.collection.forEach(function (model) {
            allValid = allValid && (model.validated ? true : false);
          });
          if (allValid) {
            this.metadataAddItems.collection.forEach(function (model) {
              var data = model.get('data');
              var item = model.get('fileObject');
              var extended_data = model.get('extended_data');
              if (data && item) {
                item.set('newName', data.name);
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
                  _.extend(extended_data, extendedData);
                }
              }
            });
            this.dialog.destroy();
            this.deferred.resolve();
          } else {
            var title = lang.addDocumentMetadataDialogTitle;
            var message = lang.missingRequiredMetadataForDocuments;
            ModalAlert.showError(message, title);
          }
        } else {
          this.options.view.$el.find(".binf-has-error .cs-formfield").addClass(
              'cs-formfield-invalid');
        }
      }
    }

  });

  _.extend(MetadataAddMultipleDocsController, {version: "1.0"});

  return MetadataAddMultipleDocsController;

});
