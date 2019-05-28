/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/utils/url',
  'csui/models/browsable/v1.request.mixin',
  'csui/models/browsable/v2.response.mixin'
], function (_, Url, BrowsableV1RequestMixin, BrowsableV2ResponseMixin) {
  'use strict';

  var ServerAdaptorMixin = {
    mixin: function (prototype) {
      BrowsableV2ResponseMixin.mixin(prototype);
      BrowsableV1RequestMixin.mixin(prototype);

      return _.extend(prototype, {
        makeServerAdaptor: function (options) {
          this.makeBrowsableV1Request(options)
              .makeBrowsableV2Response(options);
          return this;
        },

        url: function () {
          var apiUrl = new Url(this.node.connector.connection.url).getApiBase(2),
              url = Url.combine(apiUrl, 'nodes', this.node.get('id'), 'nodes'),
              query = Url.combineQueryString(
                  this.getBrowsableUrlQuery(),
                  this.getAdditionalResourcesUrlQuery(),
                  this.getResourceFieldsUrlQuery(),
                  this.getExpandableResourcesUrlQuery(),
                  this.getRequestedCommandsUrlQuery()
              );
          return Url.appendQuery(url, query);
        },

        parse: function (response, options) {
          this.parseBrowsedState(response, options);
          return this.parseBrowsedItems(response, options);
        }
      });
    }
  };

  return ServerAdaptorMixin;
});
