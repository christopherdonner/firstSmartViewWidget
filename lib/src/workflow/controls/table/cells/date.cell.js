/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/controls/table/cells/cell/cell.view',
  'csui/controls/table/cells/cell.registry',
  'workflow/utils/workitem.util'
], function (CellView, cellViewRegistry, WorkItemUtil) {
  'use strict';

  var DateCellView = CellView.extend({

    renderValue: function () {

      var value = this.getValueText(),
          dateValue = (value) ? WorkItemUtil.dateConversion(value) : '';
      this.$el.text(dateValue);

    }
  });

  cellViewRegistry.registerByColumnKey('due_date', DateCellView);
  cellViewRegistry.registerByColumnKey('date_initiated', DateCellView);


  return DateCellView;
});
