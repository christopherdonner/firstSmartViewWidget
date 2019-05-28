/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/controls/table/cells/cell/cell.view',
  'csui/controls/table/cells/cell.registry',
  'workflow/utils/workitem.util',
  'i18n!workflow/widgets/wfstatus/impl/nls/lang'
], function ($, CellView, cellViewRegistry, WorkItemUtil, lang) {
  'use strict';

  var StatusCellView = CellView.extend({

    renderValue: function () {

      var result = WorkItemUtil.formatStatus({
        dueDate: this.model.get('due_date'),
        status: this.model.get('status_key')
      });

      this.$el.html('<div class="wfstatus-status"><span' +
                    ' class="wfstatus-status-icon-col ' + result.styleclass +
                    '"></span><span class="wfstatus-status-col-value">' + result.status +
                    '</span></div>');
    }

  });

  cellViewRegistry.registerByColumnKey('status_key', StatusCellView);

  return StatusCellView;
});
