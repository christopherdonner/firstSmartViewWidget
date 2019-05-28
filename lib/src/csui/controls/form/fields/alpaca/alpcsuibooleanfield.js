/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/marionette', 'csui/lib/alpaca/js/alpaca',
  'csui/controls/form/fields/booleanfield.view', 'csui/utils/base'
], function (module, _, $, Backbone, Marionette, Alpaca, BooleanFieldView, base) {

  Alpaca.Fields.CsuiBooleanField = Alpaca.Fields.CheckBoxField.extend({

    constructor: function CsuiBooleanField(container, data, options, schema, view, connector,
        onError) {
      this.base(container, data, options, schema, view, connector, onError);
    },

    setup: function () {
      this.base();
      this.csuiValue = this.data;
      this.setValue(this.data); // currently changes date to configured format
    },

    getFieldType: function () {
      return "checkbox";
    },

    postRender: function (callback) {
      this.base(callback);
      this.showField();
      this.field.parent().addClass("csui-field-" + this.getFieldType());
    },

    showField: function () {

      var id = this.id;
      var id4Label,
          labelElement = $(this.field[0]).find('label');

      if (labelElement && labelElement.length==1) {
        id4Label = labelElement.attr('for') + "Label";
        labelElement.attr('id', id4Label);
      }

      this.fieldView = new BooleanFieldView({
        model: new Backbone.Model({
          data: this.data,
          options: this.options,
          schema: this.schema,
          id: id // <input type="checkbox"
        }),
        id: _.uniqueId(id), // wrapper <div>
       
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
      this.region = new Marionette.Region({
        el: $(".alpaca-control", this.containerItemEl)
      });
      this.containerItemEl.find(".alpaca-control").empty();
      this.region.show(this.fieldView);

      if (this.options.setRequiredFieldsEditable && this.schema.required) {
        this.fieldView.setStateRead(false);
      }

      return;
    },

    setValueAndValidate: function (value, validate) {
      this.setValue(value);
      this.csuiValue = value;
      return true;
    },

    getValue: function () {
      var bRet = this.csuiValue;
      return bRet;
    },

    focus: function () {
      this.fieldView.setFocus();
    },

    destroy: function () {
      this.base();
      if (this.region) {
        this.region.destroy();
      }
    }

  });

  Alpaca.registerFieldClass("checkbox", Alpaca.Fields.CsuiBooleanField, 'bootstrap-csui');
  return $.alpaca.Fields.CsuiBooleanField;
})
;
