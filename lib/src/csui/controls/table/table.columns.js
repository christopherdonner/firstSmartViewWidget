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
      sequence: 2,
      permanentColumn: true // don't wrap column due to responsiveness into details row
    },
    {
      key: 'name',
      sequence: 3,
      permanentColumn: true, // don't wrap column due to responsiveness into details row
      isNaming: true  // use this column as a starting point for the inline forms
    },
    {
      key: 'reserved',
      sequence: 4,
      title: 'State', // "reserved"" is just to bind the column to some property
      noTitleInHeader: true // don't display a column header
    },
    {
      key: 'wnd_comments',
      sequence: 900,
      noTitleInHeader: true,
      permanentColumn: true // don't wrap column due to responsiveness into details row
    },
    {
      key: 'favorite',
      sequence: 910,
      noTitleInHeader: true,
      permanentColumn: true // don't wrap column due to responsivenes into details row
    }
  ]);

  return tableColumns;

});
