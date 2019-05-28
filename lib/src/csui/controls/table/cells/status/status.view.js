/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/controls/table/cells/templated/templated.view',
  'csui/controls/table/cells/cell.registry',
  'hbs!csui/controls/table/cells/status/impl/status',
  'i18n!csui/controls/table/cells/status/impl/nls/lang',
  'css!csui/controls/table/cells/status/impl/status'
], function (TemplatedCellView, cellViewRegistry, template, lang) {
  'use strict';

  var StatusCellView = TemplatedCellView.extend({
      template: template,
      needsAriaLabel: true,

      getValueData: function () {
        var statusName = this._getStatusName();
        var type = this.model.get('type');
        var statusLate = false;
        if (type === 153 && (status === 3 || status === 4 || status === 5 || status === 10)) {
          statusLate = true;
        }

        return {
          status_name: statusName,
          status_late: statusLate
        };
      },
      getValueText: function () {
        return this._getStatusName();
      },

      _getStatusName: function () {
        var type = this.model.get('type');
        var status = this.model.get(this.options.column.name);
        var status_name_from_clientside = lang['status_name_' + type + '_' + status];
        var status_name_from_server = this.model.get(this.options.column.name + "_name");

        return status_name_from_clientside || status_name_from_server;
      }
    },
    {
      hasFixedWidth: true,
      columnClassName: 'csui-table-cell-status'
    }
  );

  cellViewRegistry.registerByColumnKey("status", StatusCellView);

  return StatusCellView;
});
