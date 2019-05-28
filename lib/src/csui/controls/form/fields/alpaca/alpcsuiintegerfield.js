/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/marionette', 'csui/lib/alpaca/js/alpaca', 'csui/models/form',
  'csui/controls/form/fields/textfield.view', 'csui/utils/base'
], function (module, _, $, Backbone, Marionette, Alpaca, FormModel, TextFieldView, base) {

  Alpaca.Fields.CsuiIntegerField = Alpaca.Fields.IntegerField.extend({

    constructor: function CsuiIntegerField(container, data, options, schema, view, connector,
        onError) {
      this.base(container, data, options, schema, view, connector, onError);
    },

    getFieldType: function () {
      return 'text';
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

      if (labelElement && labelElement.length == 1) {
        id4Label = labelElement.attr('for') + "Label";
        labelElement.attr('id', id4Label);
      }
      this.schema.maximum = !!this.schema.maximum && this.schema.maximum < Number.MAX_SAFE_INTEGER ?
                            this.schema.maximum : Number.MAX_SAFE_INTEGER;
      this.schema.minimum = !!this.schema.minimum && this.schema.minimum > Number.MIN_SAFE_INTEGER ?
                            this.schema.minimum : Number.MIN_SAFE_INTEGER;

      this.fieldView = new TextFieldView({
        model: new Backbone.Model({
          data: this.data,
          options: this.options,
          schema: this.schema,
          id: id
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

      return;
    },
    getValue: function () {
      var val = this._getControlVal(true);

      if (val === null || val === '') {
        return null;
      }

      return parseInt(val);
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

  Alpaca.registerFieldClass('integer', Alpaca.Fields.CsuiIntegerField, 'bootstrap-csui');
  Alpaca.registerFieldClass('integer', Alpaca.Fields.CsuiIntegerField, 'bootstrap-edit-horizontal');

  return $.alpaca.Fields.CsuiIntegerField;
})
;
