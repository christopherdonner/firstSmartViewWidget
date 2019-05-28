/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/controls/table/cells/name/name.view', 'csui/controls/table/cells/cell.registry'
], function (NameCellView, cellViewRegistry) {
  var FavoriteNameCellView = NameCellView.extend({});

  cellViewRegistry.registerByColumnKey('favorite_name', FavoriteNameCellView);

  return FavoriteNameCellView;
});
