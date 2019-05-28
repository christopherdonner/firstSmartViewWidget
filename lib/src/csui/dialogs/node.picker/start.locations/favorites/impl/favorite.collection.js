/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/backbone', 'csui/utils/url',
  'csui/models/node/node.model', 'csui/models/mixins/connectable/connectable.mixin',
  'csui/models/mixins/fetchable/fetchable.mixin', 'csui/models/browsable/client-side.mixin',
  'csui/models/browsable/v2.response.mixin'
], function (_, Backbone, Url, NodeModel, ConnectableMixin, FetchableMixin,
    ClientSideBrowsableMixin, BrowsableV2ResponseMixin) {
  "use strict";

  var FavoriteCollection = Backbone.Collection.extend({

    model: NodeModel,

    constructor: function FavoriteCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);

      this.makeConnectable(options)
          .makeFetchable(options)
          .makeClientSideBrowsable(options)
          .makeBrowsableV2Response(options);
    },

    url: function () {
      var orderBy = '';
      if (this.orderBy) {
        var first = this.orderBy.split(",")[0].split(" ");
        orderBy = (first[1] || 'asc') + "_" + first[0];
      }
      var url = this.connector.connection.url.replace('/v1', '/v2'),
          query = Url.combineQueryString({
            fields: ['properties', 'versions.element(0)'],
            expand: 'properties{original_id}',
            orderBy: orderBy,
            actions: ''
          });
      return Url.appendQuery(Url.combine(url, 'members/favorites'), query);
    },

    parse: function (response, options) {
      this.parseBrowsedState(response, options);
      return this.parseBrowsedItems(response, options);
    }

  });

  ClientSideBrowsableMixin.mixin(FavoriteCollection.prototype);
  BrowsableV2ResponseMixin.mixin(FavoriteCollection.prototype);
  ConnectableMixin.mixin(FavoriteCollection.prototype);
  FetchableMixin.mixin(FavoriteCollection.prototype);

  return FavoriteCollection;

});
