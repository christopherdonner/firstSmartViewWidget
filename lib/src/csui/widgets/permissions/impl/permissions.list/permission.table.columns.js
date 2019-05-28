/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', "csui/lib/backbone",
  'csui/models/permission/permission.table.columns.model',
  'i18n!csui/widgets/permissions/impl/nls/lang',
  'csui-ext!csui/widgets/permissions/table.columns'
], function (_, Backbone, TableColumnModel, lang, extraTableColumns) {

  var TableColumnCollection = Backbone.Collection.extend({

    model: TableColumnModel,
    comparator: "sequence",

    getColumnKeys: function () {
      return this.pluck('key');
    },

    deepClone: function () {
      return new TableColumnCollection(
          this.map(function (column) {
            return column.attributes;
          }));
    }

  });

  var tableColumns = [
    {
      key: 'right_id',
      column_key: 'right_id',
      column_name: lang.right_id,
      sequence: 20,
      permanentColumn: true, // don't wrap column due to responsiveness into details row,
      containsInlineActions: true
    },
    {
      key: 'permissions',
      column_key: 'permissions',
      column_name: lang.permission_level,
      sequence: 40,
      permanentColumn: true // don't wrap column due to responsivenes into details row
    },
    {
      column_key: 'addpermissions',
      key: 'addpermissions',
      name: '',
      sortable: false,
      alignment: 'center',
      permanentColumn: true,
      isToolbar: true,
      sequence: 999,
      className: 'csui-inlinetoolbar-touch'
    }
  ];

  if (extraTableColumns) {
    _.each(extraTableColumns, function (moduleTableColumns) {
      _.each(moduleTableColumns, function (tableColumn, key) {
        tableColumns.push(tableColumn);
      });
    });
  }

  var tableColumnCollection = new TableColumnCollection(tableColumns);

  return tableColumnCollection;

});

