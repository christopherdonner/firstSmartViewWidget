/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/controls/table/cells/cell/cell.view',
  'hbs!csui/controls/table/cells/templated/value'
], function (CellView, template) {
  'use strict';

  var TemplatedCellView = CellView.extend({
    template: template,

    renderValue: function () {
      var data = this.getValueData(),
          html = data ? this.template(data) : '';
      this.$el.html(html);
    },

    getValueData: function () {
      var model          = this.model,
          column         = this.options.column,
          columnName     = column.name,
          value          = model.get(columnName),
          formattedValue = model.get(columnName + "_formatted");

      function formatValue(singleValue) {
        return singleValue;
      }

      function formatFormattedValue(singleValue) {
        if (formattedValue) {
          return formattedValue;
        }
        if (singleValue === null) {
          singleValue = '';
        }
        return singleValue;
      }

      return this.getSingleOrMultipleValueData(value, formatValue, formatFormattedValue);
    },

    getSingleOrMultipleValueData: function (propertyValue, valueFormatter,
        formattedValueFormatter) {
      var value, formattedValue;
      if (Array.isArray(propertyValue)) {
        value = this.concatenateTextValues(propertyValue, valueFormatter);
        formattedValue = this.concatenateTextValues(propertyValue,
            formattedValueFormatter);
      } else {
        value = valueFormatter(propertyValue);
        formattedValue = formattedValueFormatter(propertyValue);
      }
      return {
        value: value,
        formattedValue: formattedValue
      };
    }

  });

  return TemplatedCellView;
});
