/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/marionette', 'csui/lib/alpaca/js/alpaca',
  'csui/controls/form/fields/arraybuttonsfield.view', 'csui/utils/base'
], function (module, _, $, Backbone, Marionette, Alpaca, ArrayButtonsFieldView, base) {

  Alpaca.Fields.CsuiArrayButtonsField = Alpaca.Fields.TextField.extend({

    constructor: function CsuiArrayButtonsField(container, data, options, schema, view, connector, onError) {
      this.base(container, data, options, schema, view, connector, onError);
    },

    getFieldType: function () {
      return 'otcs_array_buttons';
    },

    postRender: function (callback) {
      this.base(callback);
      this.showField();
      this.field.parent().addClass("csui-field-" + this.getFieldType());
    },

      getValue: function () {
        return null;
      },

    showField: function () {

      this.fieldView = new ArrayButtonsFieldView();
      var $field = $('<div>').addClass('alpaca-control cs-alp-array-buttons');
      this.getControlEl().replaceWith( $field);
      this.region = new Marionette.Region({ el: $field});
      this.region.show(this.fieldView);

      return;
    },

    setValueAndValidate: function( value, validate) {
      this.setValue(value);
      var bIsValid = true;
      if( validate) {
        bIsValid = this.validate();
        this.refreshValidationState(false);
      }
      return bIsValid;
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

  Alpaca.registerFieldClass('otcs_array_buttons', Alpaca.Fields.CsuiArrayButtonsField, 'bootstrap-csui');

  return $.alpaca.Fields.CsuiArrayButtonsField;
})
;
