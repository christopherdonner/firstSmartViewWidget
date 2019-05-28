/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', "csui/lib/backbone",
  'csui-ext!csui/controls/thumbnail/content/overview/overview.content'
], function (_, Backbone, extraOverviewContent) {

  var OverviewContentModel = Backbone.Model.extend({

    idAttribute: "key",

    defaults: {
      key: null,  // key from the resource definitions
      sequence: 0 // smaller number moves the column to the front
    }

  });

  var OverviewContentCollection = Backbone.Collection.extend({

    model: OverviewContentModel,
    comparator: "sequence",

    getColumnKeys: function () {
      return this.pluck('key');
    },

    deepClone: function () {
      return new OverviewContentCollection(
          this.map(function (column) {
            return column.attributes;
          }));
    }

  });

  var overviewContent = [
    {
      key: 'type',
      sequence: 2,
      defaultAction: false
    },
    {
      key: 'name',
      sequence: 4,
      displayLabel: true,
      defaultAction: false,
      displayIcon: true
    },
    {
      key: 'properties',
      title: 'properties',
      sequence: 7
    },
    {
      key: 'reserved',
      sequence: 100,
      title: 'State'
    }
  ];

  var fixedOrRemovedOverviewContent = ['type', 'name', 'properties', 'reserved', 'wnd_comments'];

  if (extraOverviewContent) {
    _.each(extraOverviewContent, function (moduleOverviewContent) {
      _.each(moduleOverviewContent, function (contentData, key) {
        overviewContent.push(contentData);
      });
    });
  }

  var overviewContentCollection = new OverviewContentCollection(overviewContent);
  overviewContentCollection.fixedOrRemovedOverviewContent = fixedOrRemovedOverviewContent;

  return overviewContentCollection;
});