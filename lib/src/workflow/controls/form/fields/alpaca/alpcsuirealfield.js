/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module',
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/lib/alpaca/js/alpaca',
  'csui/models/form',
  'csui/controls/form/fields/textfield.view',
  'csui/utils/base'
], function (module, _, $, Backbone, Marionette, Alpaca, FormModel, TextFieldView, base) {
  'use strict';

  Alpaca.Fields.CsuiRealField = Alpaca.Fields.NumberField.extend({

    constructor: function CsuiRealField(container, data, options, schema, view, connector, onError) {
      this.base(container, data, options, schema, view, connector, onError);
    },

    getFieldType: function () {
      return 'text';
    },

    postRender: function (callback) {
      this.base(callback);
      this.showField();
    },

    showField: function () {

      var id = this.id;
      this.options.id = "lbl" + _.uniqueId(id);
      var id4Label,
          labelElement = $(this.field[0]).find('label');

      if (labelElement && labelElement.length === 1) {
        id4Label = labelElement.attr('for') + "Label";
        labelElement.attr('id', id4Label);
      }

      this.fieldView = new TextFieldView({
        model: new Backbone.Model({
          data: this.data,
          options: this.options,
          schema: this.schema,
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

    getValue: function () {
      var val = $(this.control).val();
      if (val === null || val === '') {
        return null;
      }
      return Number(val);
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
    },

    destroy: function () {
      this.base();
      if (this.region) {
        this.region.destroy();
      }
    }

  });

  Alpaca.registerFieldClass('number', Alpaca.Fields.CsuiRealField, 'bootstrap-csui');
  Alpaca.registerFieldClass('number', Alpaca.Fields.CsuiRealField, 'bootstrap-edit-horizontal');

  return $.alpaca.Fields.CsuiRealField;
});
