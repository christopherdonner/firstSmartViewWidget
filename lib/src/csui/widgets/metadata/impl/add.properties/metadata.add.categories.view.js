/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['require', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/url',
  'csui/utils/log', 'csui/widgets/metadata/impl/common/base.metadata.action.view',
  'csui/models/forms', 'i18n!csui/widgets/metadata/impl/nls/lang',
  'csui/dialogs/modal.alert/modal.alert', 'css!csui/widgets/metadata/impl/metadata'
], function (require, _, $, Url, log, BaseMetadataActionView, FormCollection, lang, ModalAlert) {
  'use strict';
  function MetadataAddCategoriesView() {
  }

  _.extend(MetadataAddCategoriesView.prototype, BaseMetadataActionView.prototype, {

    displayForm: function (options) {
      var deferred = $.Deferred();
      var self = this;

      options || (options = {});
      this.node = options.model;
      this.catId = options.catId;
      this.catName = options.catName;

      var catCollection = new FormCollection([options.catModel]);
      catCollection.fetching = false;
      catCollection.fetched = true;

      require(["csui/widgets/metadata/metadata.action.one.item.properties.view"
      ], function (MetadataActionOneItemPropertiesView) {

        self.metadataAddItemPropView = new MetadataActionOneItemPropertiesView({
          model: options.model,
          collection: catCollection,
          context: options.context,
          commands: options.commands,
          suppressAddProperties: true,
          suppressHeaderView: true,
          extraViewClass: 'add-category'
        });

        var baseUIOptions = {};
        baseUIOptions.callerProcessData = options.callerProcessData;
        baseUIOptions.originatingView = options.originatingView;
        baseUIOptions.view = self.metadataAddItemPropView;
        var dialogOptions = {};
        dialogOptions.dialogTitle = options.dialogTitle ? options.dialogTitle :
                                    lang.addNewCategoryDialogTitle;
        dialogOptions.OkButtonTitle = options.okButtonTitle ? options.okButtonTitle :
                                      lang.addNewCategoryDialogAddButtonTitle;
        dialogOptions.OkButtonClick = self._addCategory;
        baseUIOptions.dialogOptions = dialogOptions;

        self.baseDisplayForm(baseUIOptions)
            .done(function (resp) {
              deferred.resolve(resp);
            })
            .fail(function (error2) {
              deferred.reject(error2);
            });

      }, function (error) {
        log.warn('Failed to load MetadataActionOneItemPropertiesView. {0}', error)
        && console.log(log.last);
        deferred.reject(error);
      });

      return deferred.promise();
    },
    _addCategory: function (args) {
      var valid = this.metadataAddItemPropView.validate();
      if (valid) {
        this.options.view.$el.find(".cs-formfield-invalid").removeClass('cs-formfield-invalid');
        var nodeId = this.node.get('id');
        var catData = this.metadataAddItemPropView.getValues();
        var data = {id: nodeId, category_id: this.catId};
        if (catData.roles && catData.roles.categories) {
          _.each(catData.roles.categories, function (cat, key) {
            data = _.extend(data, cat);
          });
        }

        var fullUrl = Url.combine(this.node.urlBase(), 'categories');
        var formData = new FormData();
        var options = {
          type: 'POST',
          url: fullUrl
        };
        formData.append('body', JSON.stringify(data));
        _.extend(options, {
          data: formData,
          contentType: false,
          processData: false
        });

        this.node.connector &&
        this.node.connector.extendAjaxOptions(options);

        this.metadataAddItemPropView.blockActions();
        $.ajax(options)
            .done(_.bind(function (resp) {
              this.metadataAddItemPropView.unblockActions();
              this.dialog.destroy();
              this.deferred.resolve(resp);
            }, this))
            .fail(_.bind(function (error) {
              this.metadataAddItemPropView.unblockActions();
              var serverError = '';
              if (error && error.responseJSON && error.responseJSON.error) {
                serverError = error.responseJSON.error;
              }
              var title = lang.addNewCategoryFailTitle;
              var message = _.str.sformat(lang.addNewCategoryFailMessage,
                  this.catName, this.node.get('name'), nodeId, serverError);
              ModalAlert.showError(message, title);
            }, this));

      } else {
        this.options.view.$el.find(".binf-has-error .cs-formfield").addClass(
            'cs-formfield-invalid');

      }

    }

  });

  _.extend(MetadataAddCategoriesView, {version: "1.0"});

  return MetadataAddCategoriesView;

});
