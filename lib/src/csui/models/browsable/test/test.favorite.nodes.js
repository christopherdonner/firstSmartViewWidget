/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/backbone', 'csui/utils/url',
  'csui/models/node/node.model', 'csui/models/mixins/connectable/connectable.mixin',
  'csui/models/mixins/fetchable/fetchable.mixin',
  'csui/models/browsable/client-side.mixin', 'csui/models/browsable/v2.response.mixin'
], function (_, Backbone, Url, NodeModel, ConnectableMixin, FetchableMixin,
    ClientSideBrowsableMixin, BrowsableV2ResponseMixin) {
  'use strict';

  var FavoriteNodeCollection = Backbone.Collection.extend({

    model: NodeModel,

    constructor: function NodeChildrenCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);

      this.makeConnectable(options)
          .makeFetchable(options)
          .makeClientSideBrowsable(options)
          .makeBrowsableV2Response(options);
    },

    url: function () {
      var url = this.connector.connection.url.replace('/v1', '/v2');
      return Url.combine(url, 'members/favorites');
    },

    parse: function (response, options) {
      this.parseBrowsedState(response, options);
      return this.parseBrowsedItems(response, options);
    }

  });

  ClientSideBrowsableMixin.mixin(FavoriteNodeCollection.prototype);
  BrowsableV2ResponseMixin.mixin(FavoriteNodeCollection.prototype);
  ConnectableMixin.mixin(FavoriteNodeCollection.prototype);
  FetchableMixin.mixin(FavoriteNodeCollection.prototype);

  return FavoriteNodeCollection;

});
