/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/controls/table/cells/cell.registry',
  'csui/controls/table/cells/text/text.view',
  'csui/controls/table/cells/name/name.view',
  'csui/controls/table/cells/date/date.view',
  'csui/controls/table/cells/datetime/datetime.view',
  'csui/controls/table/cells/duedate/duedate.view',
  'csui/controls/table/cells/member/member.view',
  'csui/controls/table/cells/node.state/node.state.view',
  'csui/controls/table/cells/parent/parent.view',
  'csui/controls/table/cells/priority/priority.view',
  'csui/controls/table/cells/select/select.view',
  'csui/controls/table/cells/toggledetails/toggledetails.view',
  'csui/controls/table/cells/size/size.view',
  'csui/controls/table/cells/status/status.view',
  'csui/controls/table/cells/favorite/favorite.view',
  'csui/controls/table/cells/favorite/favorite.name.view',
  'csui/controls/table/cells/type.icon/type.icon.view',
  'csui/controls/table/cells/user/user.view',
  'csui/controls/table/cells/permission/permission.level.view',
  'csui/controls/table/cells/add.permission/add.permission.view',
  'csui/controls/table/cells/versionnumber/versionnumber.view',
  'csui-ext!csui/controls/table/cells/cell.factory'
], function (_, cellViewRegistry, TextCellView, NameCellView) {

  function CellViewFactory() {}

  _.extend(CellViewFactory.prototype, {

    hasCellViewByOtherKey: function (columnKey) {
      return cellViewRegistry.hasCellViewByOtherKey(columnKey);
    },

    getCellView: function (columnDefinition) {
      if (columnDefinition.get('isNaming') === true) {
        return NameCellView;
      }
      var CellView = cellViewRegistry.getCellView(columnDefinition);
      return CellView || TextCellView;
    }

  });

  return new CellViewFactory();

});
