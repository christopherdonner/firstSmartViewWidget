/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["csui/lib/backbone"], function (Backbone) {
  "use strict";
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
      key: 'status_key',
      sequence: 10
    },
    {
      key: 'due_date',
      sequence: 20
    },
    {
      key: 'wf_name',
      sequence: 30
    },
    {
      key: 'step_name',
      sequence: 40
    },
    {
      key: 'assignee',
      sequence: 50
    },
    {
      key: 'date_initiated',
      sequence: 60
    }
  ]);

  return MyAssignmentsTableColumns;

});
