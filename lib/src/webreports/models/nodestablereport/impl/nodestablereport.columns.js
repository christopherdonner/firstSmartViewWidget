/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["csui/lib/backbone"], function (Backbone) {

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
    }


  });

  var tableColumns = new TableColumnCollection([
    {
      key: 'type',
      sequence: 10
    },
    {
      key: 'name',
      sequence: 20
    },
    {
      key: 'reserved',
      sequence: 30,
      noTitleInHeader: true // don't display a column header
    },
    {
      key: 'size',
      sequence: 40
    },
    {
      key: 'modify_date',
      sequence: 50
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
