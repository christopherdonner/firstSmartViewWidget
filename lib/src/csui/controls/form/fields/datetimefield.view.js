/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/utils/types/date',
  'csui/controls/form/fields/impl/datebasefield.view'
], function (date, DateBaseFieldView) {
  'use strict';

  var DateTimeFieldView = DateBaseFieldView.extend({
    className: DateBaseFieldView.prototype.className + ' cs-datetime',

    format: date.exactDateTimeFormat,

    inputType: 'datetime-local',
    inputStep: '1',

    constructor: function DateTimeFieldView(options) {
      DateBaseFieldView.apply(this, arguments);
    },

    getDisplayValue: function() {
      return this.$el.find(':input')[0].value;
    }
  });

  return DateTimeFieldView;
});
