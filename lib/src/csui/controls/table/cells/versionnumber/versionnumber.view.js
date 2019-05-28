/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/controls/table/cells/templated/templated.view',
  'csui/controls/table/cells/cell.registry',
  'csui/utils/base',
  'css!csui/controls/table/cells/versionnumber/impl/versionnumber'
], function (TemplatedCellView, cellViewRegistry, base) {
  'use strict';

  var VersionNumberCellView = TemplatedCellView.extend({
      className: 'csui-nowrap',
      needsAriaLabel: true
    }, {
      hasFixedWidth: true,
      columnClassName: 'csui-table-cell-version_number_name'
    }
  );

  cellViewRegistry.registerByColumnKey('version_number_name', VersionNumberCellView);

  return VersionNumberCellView;
});
