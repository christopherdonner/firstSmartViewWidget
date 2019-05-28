/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/controls/table/cells/templated/templated.view',
  'csui/controls/table/cells/cell.registry',
  'csui/utils/base',
  'css!csui/controls/table/cells/date/impl/date'
], function (_, TemplatedCellView, cellViewRegistry, base) {
  'use strict';

  var DateCellView = TemplatedCellView.extend({
    className: 'csui-nowrap',
    needsAriaLabel: true,

    formatFunction: base.formatExactDateTime,

    constructor: function DateCellView(options) {
      TemplatedCellView.prototype.constructor.apply(this, arguments);
    },

    getValueData: function () {
      var propertyValue = this.model.get(this.options.column.name);
      var formatFunction = this.formatFunction;
      function format (singleValue) {
        return formatFunction(singleValue);
      }
      return this.getSingleOrMultipleValueData(propertyValue, format, format);
    },
    getValueText: function () {
      return this.getValueData().formattedValue;
    }
  }, {
    flexibleWidth: true,
    columnClassName: 'csui-table-cell-date',

    getValue: function (model, column) {
      var value = TemplatedCellView.getValue(model, column);
      return value && base.parseDate(value);
    }
  });

  cellViewRegistry.registerByDataType(-7, DateCellView);

  return DateCellView;
});
