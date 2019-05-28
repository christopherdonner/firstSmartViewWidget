/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/controls/table/cells/cell/cell.view',
  'csui/controls/table/cells/cell.registry', 'csui/utils/base'
], function (_, CellView, cellViewRegistry, base) {
  'use strict';

  var MemberCellView = CellView.extend({
    className: 'csui-truncate',
    needsAriaLabel: true,

    getValueText: function () {
      return MemberCellView.getValue(this.model, this.options.column);
    }
  }, {
    getValue: function (model, column) {
      var columnName = column.name,
          value = model.get(columnName + "_expand") ||
                  model.get(columnName) || '',
          text;
      if (_.isObject(value)) {
        text = base.formatMemberName(value);
      } else {
        text = model.get(columnName + "_formatted") || value.toString();
      }
      return text;
    },

    getModelExpand: function (options) {
      return {properties: [options.column.name]};
    }
  });

  cellViewRegistry.registerByDataType(14, MemberCellView);
  cellViewRegistry.registerByDataType(19, MemberCellView);
  cellViewRegistry.registerByColumnKey('owner_id', MemberCellView);

  return MemberCellView;
});
