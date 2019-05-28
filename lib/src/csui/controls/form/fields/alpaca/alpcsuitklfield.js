/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/marionette', 'csui/lib/alpaca/js/alpaca', 'csui/models/form',
  'csui/controls/form/fields/tklfield.view', 'csui/utils/base',
  'i18n!csui/controls/form/impl/nls/lang'
], function (module, _, $, Backbone, Marionette, Alpaca, FormModel, TKLFieldView, base, lang) {

  Alpaca.Fields.CsuiTKLField = Alpaca.Fields.SelectField.extend({

    constructor: function CsuiTKLField(container, data, options, schema, view, connector,
        onError) {
      this.excludeNoneOption = options.removeDefaultNone !== undefined && options.removeDefaultNone;
      this.base(container, data, options, schema, view, connector, onError);
    },

    getFieldType: function () {
      return 'tkl';
    },

    postRender: function (callback) {
      this.base(callback);
      this.showField();
      this.field.parent().addClass("csui-field-" + this.getFieldType());
    },

    showField: function () {
      var hasValue = true;
      if (this.data === null || this.data === "") {
        hasValue = this.options.mode === 'create';
      }

      var id = this.id;
      var id4Label,
          labelElement = $(this.field[0]).find('label');

      if (labelElement && labelElement.length==1) {
        id4Label = labelElement.attr('for') + "Label";
        labelElement.attr('id', id4Label);
      }
      this.fieldView = new TKLFieldView({
        model: new Backbone.Model({
          data: this.data,
          options: this.options,
          schema: this.schema,
          id: id
        }),
        id: _.uniqueId(id), // wrapper <div>
        alpacaField: this,
        labelId: id4Label,
        mode: this.options.mode,
        path: this.path,
        dataId: this.name,
        alpaca: {
          data: this.data,
          options: this.options,
          schema: this.schema
        },
        hasValue: hasValue
      });
      this.options.validator = function (callback) {
        callback({
          "status": this.fieldView.isValidTKLState,
          "message": this.fieldView.isValidTKLState ? '' : lang.invalidTkl
        });
      };
      var $field = $('<div>').addClass('alpaca-control');
      this.getControlEl().replaceWith($field);
      this.region = new Marionette.Region({el: $field});
      this.region.show(this.fieldView);

      return;
    },

    setValueAndValidate: function (value, validate) {
      this.setValue(value);
      if(this.fieldView.ui.writeField.val() ===''){
        this.fieldView.isValidTKLState = true;
      }
      var bIsValid = true;
      if (validate) {
        bIsValid = this.validate() && this.fieldView.isValidTKLState;
        this.refreshValidationState(false);
      }
      return bIsValid;
    },

    _validator: function (callback) {

      var value = this.getValue();

      if (this.schema.required && value === "") {
        callback({
          "status": false,
          "message": "This is a required field."
        });
      } else {
        callback({
          "status": true
        });
      }

    },

    validate: function () {
      var ret = this.base();
      if (!!this.validation['invalidValueOfEnum'] &&
          !this.validation['invalidValueOfEnum']['status']) {
        this.validation['invalidValueOfEnum']['message'] = '';
        this.validation['invalidValueOfEnum']['status'] = true;
        ret = this.validation['notOptional']['status'];
      }

      for (var validation in this.validation) {
        if (this.validation[validation]["status"] === false) {
          if (validation !== "notOptional") {
            this.validation[validation]["status"] = true;
            this.validation[validation]["message"] = "";
          } else if (!this.fieldView.isValidTKLState) {
            this.validation['notOptional']['status'] = true;
          }
        }
      }
      return ret;
    },

    setValue: function (value) {
      value === null ? this.base("") : this.base(value);
    },

    getValue: function () {
      return this.base();
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

  Alpaca.registerFieldClass('tkl', Alpaca.Fields.CsuiTKLField, 'bootstrap-csui');
  return $.alpaca.Fields.CsuiTKLField;
})
;
