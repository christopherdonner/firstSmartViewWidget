/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/utils/types/date',
  'csui/controls/form/fields/impl/datebasefield.view'
], function (date, DateBaseFieldView) {
  'use strict';

  var DateFieldView = DateBaseFieldView.extend({
    format: date.exactDateFormat,

    inputType: 'date',

    constructor: function DateFieldView(options) {
      DateBaseFieldView.apply(this, arguments);
    },

    getDisplayValue: function() {
      return this.$el.find(':input')[0].value;
    },

    getValue: function() {
      var val = this.model.get('data'),
          uiVal = this._convertFromModelToInput(val),     // convert model data containing both date and time to ui format with date only.
          value = this._convertFromInputToModel(uiVal);  // obtain server formatted date value from ui formatted value above.
        return value;
    },

    _convertFromInputToModel: function (value) {
      return value ? date.serializeDate(value, undefined, function (){ return false; }) : null;
    },

    _convertFromModelToInput: function (value) {
      return value ? date.formatExactDate(date.deserializeDate(value)): '';
    }
  });

  return DateFieldView;
});
