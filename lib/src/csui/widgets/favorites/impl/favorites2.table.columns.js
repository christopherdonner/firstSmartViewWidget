/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/backbone', 'i18n!csui/widgets/favorites/impl/nls/lang'
], function (_, Backbone, lang) {
  'use strict';

  var TableColumnModel = Backbone.Model.extend({

    idAttribute: "key",

    defaults: {
      key: null,  // key from the resource definitions
      sequence: 0 // smaller number moves the column to the front
    }

  });

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
    },

    resetCollection: function (columns, options) {
      if (columns) {
        var sequence = 0;
        var models = _.map(columns, function (column) {
          var columnData = column instanceof Backbone.Model ? column.toJSON() : column;
          sequence += 10;
          return new TableColumnModel(_.defaults(columnData,
              {key: columnData.column_key, sequence: sequence}));
        });
        this.reset(models, options);
      }
    }

  });

  var tableColumns = new TableColumnCollection([
    {
      key: 'type',
      sequence: 10,
      permanentColumn: true // don't wrap column due to responsiveness into details row
    },
    {
      key: 'favorite_name',
      title: lang.favoriteColumnNameTitle,
      cellViewClassname: "csui/controls/table/cells/name.view",
      sequence: 20,
      permanentColumn: true, // don't wrap column due to responsiveness into details row
      isNaming: true  // use this column as a starting point for the inline forms
    },
    {
      key: 'reserved',
      sequence: 30,
      noTitleInHeader: true // don't display a column header
    },
    {
      key: 'parent_id',
      sequence: 40
    },
    {
      key: 'favorite',
      sequence: 910,
      noTitleInHeader: true, // don't display a column header
      permanentColumn: true // don't wrap column due to responsiveness into details row
    }
  ]);

  return tableColumns;

});
