/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', "csui/lib/backbone",
  'csui-ext!csui/controls/thumbnail/thumbnail.content'
], function (_, Backbone, extraThumbnailContent) {

  var ThumbnailContentModel = Backbone.Model.extend({

    idAttribute: "key",

    defaults: {
      key: null,  // key from the resource definitions
      sequence: 0 // smaller number moves the column to the front
    }

  });

  var ThumbnailContentCollection = Backbone.Collection.extend({

    model: ThumbnailContentModel,
    comparator: "sequence",

    getColumnKeys: function () {
      return this.pluck('key');
    },

    deepClone: function () {
      return new ThumbnailContentCollection(
          this.map(function (column) {
            return column.attributes;
          }));
    }

  });

  var thumbnailContent = [
    {
      key: 'name',
      sequence: 4,
      defaultAction: true
    },
    {
      key: 'reserved',
      sequence: 5,
      displayTitle: true,
      title: 'State'
    },
    {
      key: 'wnd_comments',
      sequence: 900
    },
    {
      key: 'favorite',
      sequence: 910
    },
    {
      key: 'overview',
      sequence: 920,
      showoverview: true
    }
  ];

  if (extraThumbnailContent) {
    _.each(extraThumbnailContent, function (moduleThumbnailContent) {
      _.each(moduleThumbnailContent, function (thumbnailContent, key) {
        thumbnailContent.push(thumbnailContent);
      });
    });
  }

  var thumbnailContentCollection = new ThumbnailContentCollection(thumbnailContent);

  return thumbnailContentCollection;
});