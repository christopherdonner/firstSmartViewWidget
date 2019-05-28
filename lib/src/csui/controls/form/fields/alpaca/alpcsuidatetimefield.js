/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/marionette', 'csui/lib/alpaca/js/alpaca', 'csui/utils/types/date',
  'csui/controls/form/fields/datetimefield.view'
], function (_, $, Backbone, Marionette, Alpaca, date, DateTimeFieldView) {
  'use strict';

  Alpaca.Fields.CsuiDateTimeField = Alpaca.Fields.DatetimeField.extend({
    constructor: function CsuiDateTimeField(container, data, options, schema, view,
        connector, onError) {
      this.base(container, data, options, schema, view, connector, onError);
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

      this.fieldView = new DateTimeFieldView({
        model: new Backbone.Model({
          data: this.data,
          options: this.options,
          schema: this.schema,
          inputType: 'text',
          id: id // <input type=

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
      var $field = $('<div>').addClass('alpaca-control');
      this.getControlEl().replaceWith($field);
      this.region = new Marionette.Region({el: $field});
      this.region.show(this.fieldView);
    },

    getValue: function () {
      var value = this.base();
      return value ? value : null;
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
    _validateDateFormat: function () {
      var value = this.containerItemEl.find('input').val();
      if (!value && this.isRequired()) {
        return false;
      }
      return !value || date.validateDateTime(value);
    },

    focus: function () {
      this.fieldView.setFocus();
    },

    handleValidate: function () {
      var ret = this.base();
      if (!ret) {
        var arrayValidations = this.validation;
        if (this.fieldView.ui.writeField.val() !== "") {
          arrayValidations["notOptional"]["status"] = true;
          arrayValidations["notOptional"]["message"] = "";
          return ret;
        }
        for (var validation in arrayValidations) {
          if (arrayValidations[validation]["status"] === false) {
            if (validation !== "notOptional") {
              arrayValidations[validation]["status"] = true;
              arrayValidations[validation]["message"] = "";
            }
          }
        }
      }
      return ret;
    }
  });

  Alpaca.registerFieldClass("datetime", Alpaca.Fields.CsuiDateTimeField);
  Alpaca.registerFieldClass("datetime", Alpaca.Fields.CsuiDateTimeField,
      'bootstrap-csui');
  Alpaca.registerFieldClass("datetime", Alpaca.Fields.CsuiDateTimeField,
      'bootstrap-edit-horizontal');

  Alpaca.registerDefaultFormatFieldMapping("datetime", "datetime");

  return Alpaca.Fields.CsuiDateTimeField;
});
