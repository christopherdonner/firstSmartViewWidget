/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/controls/table/cells/date/date.view',
  'csui/controls/table/cells/cell.registry', 'csui/utils/base'
], function (DateCellView, cellViewRegistry, base) {

  var DateTimeCellView = DateCellView.extend({

    formatFunction: base.formatDateTime

  });

  cellViewRegistry.registerByDataType(401, DateTimeCellView);

  return DateTimeCellView;

});
