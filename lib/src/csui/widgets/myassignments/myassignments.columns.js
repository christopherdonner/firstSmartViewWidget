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

  var MyAssignmentsTableColumns = new TableColumnCollection([
    {
      key: 'type',
      sequence: 10
    },
    {
      key: 'name',
      sequence: 20
    },
    {
      key: 'location_id',
      sequence: 30
    },
    {
      key: 'date_due',
      sequence: 40
    },
    {
      key: 'priority',
      sequence: 50
    },
    {
      key: 'status',
      sequence: 60
    },
    {
      key: 'from_user_name',
      sequence: 70
    }
  ]);

  return MyAssignmentsTableColumns;

});
