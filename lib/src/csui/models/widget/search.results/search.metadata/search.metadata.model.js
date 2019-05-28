/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/lib/underscore', "csui/lib/backbone",
  'csui/models/mixins/connectable/connectable.mixin',
  'csui/models/mixins/fetchable/fetchable.mixin',
  'csui/models/widget/search.results/search.metadata/search.metadata.mixin',
  'csui/models/widget/search.results/search.metadata/server.adaptor.mixin'
], function ($, _, Backbone, ConnectableMixin, FetchableMixin, SearchMetadataMixin,
    ServerAdaptorMixin) {
  "use strict";

  var SearchMetadataItemModel = Backbone.Model.extend({

    idAttribute: "key",

    defaults: {
      key: null,  // key from the resource definitions
      sequence: 0 // smaller number moves the column to the front
    }

  });

  var SearchMetadataItemsCollection = Backbone.Collection.extend({

    model: SearchMetadataItemModel,
    comparator: "sequence",

    constructor: function SearchMetadataItemsCollection(attributes, options) {
      SearchMetadataItemsCollection.__super__.constructor.apply(this, arguments);
      this.makeConnectable(options)
          .makeFetchable(options)
          .makeSearchMetadataResponse(options)
          .makeServerAdaptor(options);
    },

    getColumnKeys: function () {
      return this.pluck('key');
    },

    deepClone: function () {
      return new SearchMetadataItemsCollection(
          this.map(function (column) {
            return column.attributes;
          }));
    }
  });

  ConnectableMixin.mixin(SearchMetadataItemsCollection.prototype);
  FetchableMixin.mixin(SearchMetadataItemsCollection.prototype);
  SearchMetadataMixin.mixin(SearchMetadataItemsCollection.prototype);
  ServerAdaptorMixin.mixin(SearchMetadataItemsCollection.prototype);

  return SearchMetadataItemsCollection;
});