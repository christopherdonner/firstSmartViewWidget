/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/utils/url',
  'csui/models/member/member.model', 'csui/models/mixins/connectable/connectable.mixin',
  'csui/models/mixins/fetchable/fetchable.mixin', 'csui/models/browsable/client-side.mixin',
  'csui/models/browsable/v2.response.mixin'
], function (module, _, $, Backbone, Url, MemberModel, ConnectableMixin, FetchableMixin,
    ClientSideBrowsableMixin, BrowsableV2ResponseMixin) {
  "use strict";

  var RecentContainerCollection = Backbone.Collection.extend({

    model: MemberModel,

    constructor: function RecentContainerCollection(models, options) {
      Backbone.Collection.prototype.constructor.call(this, models, options);

      this.makeConnectable(options)
          .makeFetchable(options)
          .makeClientSideBrowsable(options)
          .makeBrowsableV2Response(options);
    },

    url: function () {
      var url = this.connector.connection.url.replace('/v1', '/v2');
      return Url.appendQuery(Url.combine(url, 'members/targets'));
    },

    parse: function (response, options) {
      this.parseBrowsedState(response, options);
      this.parseBrowsedItems(response, options);
      response.results.reverse();
      return response.results;
    }

  });

  ClientSideBrowsableMixin.mixin(RecentContainerCollection.prototype);
  BrowsableV2ResponseMixin.mixin(RecentContainerCollection.prototype);
  ConnectableMixin.mixin(RecentContainerCollection.prototype);
  FetchableMixin.mixin(RecentContainerCollection.prototype);

  return RecentContainerCollection;
});