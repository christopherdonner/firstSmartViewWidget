/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/utils/url',
  'csui/models/browsable/v1.request.mixin',
  'csui/models/browsable/v1.response.mixin'
], function (_, Url, BrowsableV1RequestMixin, BrowsableV1ResponseMixin) {
  'use strict';

  var ServerAdaptorMixin = {
    mixin: function (prototype) {
      BrowsableV1ResponseMixin.mixin(prototype);
      BrowsableV1RequestMixin.mixin(prototype);

      return _.extend(prototype, {
        makeServerAdaptor: function (options) {
          this.makeBrowsableV1Request(options)
              .makeBrowsableV1Response(options);
          return this;
        },

        url: function () {
          var includeActions = !!this.includeActions,
              query = Url.combineQueryString({
                extra: includeActions,
                actions: includeActions
              },
              this.getBrowsableUrlQuery(),
              this.getExpandableResourcesUrlQuery(),
              this.getRequestedCommandsUrlQuery()
          );
          return Url.combine(this.node.urlBase(),
              query ? '/nodes?' + query : '/nodes');
        },
        urlCacheBase: function(){
          return Url.combine(this.node.urlBase(),'/nodes?');
        },

        parse: function (response, options) {
          this.parseBrowsedState(response, options);
          this.columns && this.columns.resetColumns(response, this.options);
          return this.parseBrowsedItems(response, options);
        }
      });
    }
  };

  return ServerAdaptorMixin;
});
