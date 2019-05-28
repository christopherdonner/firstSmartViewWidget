/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["module", "csui/lib/underscore", "csui/lib/jquery", "csui/lib/marionette",
  "csui/widgets/metadata/impl/header/metadata.header.view",
  "csui/widgets/metadata/metadata.properties.view", 'csui/utils/log',
  "csui/controls/mixins/view.events.propagation/view.events.propagation.mixin",
  "css!csui/widgets/metadata/impl/metadata"
], function (module, _, $, Marionette, MetadataHeaderView, MetadataPropertiesView,
    log, ViewEventsPropagationMixin) {

  var MetadataActionOneItemPropertiesView = Marionette.ItemView.extend({

    className: 'cs-add-item-metadata-form',
    template: false,
    constructor: function MetadataActionOneItemPropertiesView(options) {
      options || (options = {});
      this.options = options;
      Marionette.ItemView.prototype.constructor.apply(this, arguments);

      options.showRequiredFieldsSwitch = true;
      this.metadataHeaderView = new MetadataHeaderView(options);
      this.listenTo(this.metadataHeaderView, "metadata:item:name:save", this._saveItemName);
      this.listenTo(this.metadataHeaderView, "update:button", _.bind(function (args) {
        this.trigger("update:button", args);
      }, this));

      this.metadataPropertiesView = new MetadataPropertiesView({
        node: options.model,
        collection: options.collection,
        container: options.container,
        context: options.context,
        formMode: 'create',
        action: options.action,
        inheritance: options.inheritance,
        metadataView: this,
        formCollection: options.formCollection,
        suppressAddProperties: options.suppressAddProperties
      });
      if (!options.collection) {
        this.listenTo(this.metadataPropertiesView.allForms, 'sync', this._updateSchema);
      }
      this.listenTo(this.metadataPropertiesView, 'render:forms', this.setNameFieldFocus);
      this.propagateEventsToViews(this.metadataHeaderView, this.metadataPropertiesView);
    },
    _updateSchema: function() {
      var generalForm = this.metadataPropertiesView.allForms.first(),
          formSchema = generalForm && generalForm.get('schema'),
          nameSchema = formSchema && formSchema.properties && formSchema.properties.name;
      if (nameSchema) {
        this.metadataHeaderView.metadataItemNameView.updateNameSchema(nameSchema);
      } else {
        log.warn('Form collection lacks name field in the first form.') && console.warn(log.last);
      }
    },
    onRender: function () {
      var inv = this.metadataHeaderView.render();
      var mdv = this.metadataPropertiesView.render();

      Marionette.triggerMethodOn(inv, 'before:show', inv, this);
      Marionette.triggerMethodOn(mdv, 'before:show', mdv, this);

      if (this.options.suppressHeaderView !== true) {
        this.$el.append(inv.el);
      }
      this.$el.append(mdv.el);

      if (this.options.suppressHeaderView) {
        this.$el.addClass('without-header-bar');
      }

      if (this.options.extraViewClass) {
        this.$el.addClass(this.options.extraViewClass);
      }

      Marionette.triggerMethodOn(inv, 'show', inv, this);
      Marionette.triggerMethodOn(mdv, 'show', mdv, this);
    },
    onBeforeDestroy: function () {
      this.cancelEventsToViewsPropagation(this.metadataHeaderView, this.metadataPropertiesView);
      this.metadataHeaderView.destroy();
      this.metadataPropertiesView.destroy();
    },
    validate: function () {
      var bNameIsValid = this.metadataHeaderView.validateName();
      var bFormsAreValid = this.metadataPropertiesView.validateForms();

      return bNameIsValid && bFormsAreValid;
    },
    getValues: function () {
      var data = {};
      var validation = this.validate();
      if (validation) {
        var itemName = this.metadataHeaderView.getNameValue();
        data = {
          "name": itemName,
          "type": this.options.model.get('type'),
          "parent_id": this.options.model.get('parent_id')
        };
        var formsValues = this.metadataPropertiesView.getFormsValues();
        _.extend(data, formsValues);
      }

      return data;
    },
    setNameFieldFocus: function () {
      if (this.firstFocusCalled !== true && this.options.suppressHeaderView !== true) {
        this.metadataHeaderView.setNameEditModeFocus();
      }
      this.firstFocusCalled = true;
    },

    _saveItemName: function (args) {
      var itemName = args.sender.getValue();
      this.model.set('name', itemName, {silent: true});
      args.success && args.success();
    }

  });

  MetadataActionOneItemPropertiesView.version = "1.0";

  _.extend(MetadataActionOneItemPropertiesView.prototype, ViewEventsPropagationMixin);

  return MetadataActionOneItemPropertiesView;

});
