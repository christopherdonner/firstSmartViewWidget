/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'require', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/lib/alpaca/js/alpaca',
  "csui/models/node/node.model",
  'workflow/controls/form/fields/itempickerfield.view',
  'i18n!workflow/controls/form/impl/nls/lang'
], function (module, _require, _, $, Backbone, Marionette, Alpaca, NodeModel, NodePickerFieldView,
    Lang) {
  'use strict';

  Alpaca.Fields.CsuiItemReferenceField = Alpaca.Fields.IntegerField.extend({
    constructor: function ItemPickerField(container, data, options, schema,
        view, connector, onError) {
      this.base(container, data, options, schema, view, connector, onError);
      this.on("showNodePickerDialog", this.actionTriggerShowNodePickerDialog);
    },

    getFieldType: function () {
      return 'item_reference_picker';
    },

    postRender: function (callback) {
      this.base(callback);
      this.showField();
    },

    showField: function () {

      var id = this.id,
          type_control;

      this.options.id = "lbl" + _.uniqueId(id);
      var id4Label,
          labelElement = $(this.field[0]).find('label');

      if (labelElement && labelElement.length === 1) {
        id4Label = labelElement.attr('for') + "Label";
        labelElement.attr('id', id4Label);
      }

      if (this.options.isMultiFieldItem) {
        var name       = this.name,
            childField = parseInt(name.substr(name.length - 1));
        type_control = this.options.type_control[Object.keys(
            this.options.type_control)[childField]];
        delete this.options["item"];
      }
      this.options.placeholder = Lang.alpacaPlaceholderItemReferencePicker;
      this.options.customField = true;

      this.fieldView = new NodePickerFieldView({
        context: this.connector.config.context,
        formView: this.connector.config.formView,
        model: new Backbone.Model({
          data: this.data ? this.data : null,
          options: this.options,
          schema: this.schema,
          typeControl: type_control,
          multiFiedsItem: this.options.isMultiFieldItem,
          id: id
        }),
        id: _.uniqueId(id),
        alpacaField: this,
        labelId: id4Label,
        value: this.data,
        readonly: true,
        dataId: this.name,
        path: this.path,
        alpaca: {
          data: this.data,
          options: this.options,
          schema: this.schema
        }
      });
      var $field = $('<div>').addClass('alpaca-control');
      this.getControlEl().replaceWith($field);
      this.region = new Marionette.Region({el: $field});
      this.region.show(this.fieldView);

      return;
    },

    setValueAndValidate: function (value, validate) {
      this.setValue(value);
      var bIsValid = true;
      if (validate) {
        bIsValid = this.validate();
        this.refreshValidationState(false);
      }
      return bIsValid;
    },

    focus: function () {
      this.fieldView.$el.focus();
    },

    destroy: function () {
      this.base();
      if (this.region) {
        this.region.destroy();
      }
    }

  });

  Alpaca.registerFieldClass('item_reference_picker', Alpaca.Fields.CsuiItemReferenceField,
      'bootstrap-csui');
  Alpaca.registerFieldClass('item_reference_picker', Alpaca.Fields.CsuiItemReferenceField,
      'bootstrap-edit-horizontal');

  return $.alpaca.Fields.ItemPickerField;
});
