/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/utils/url'
], function (_, Url) {
  'use strict';

  var ServerAdaptorMixin = {
    mixin: function (prototype) {
      return _.extend(prototype, {
        makeServerAdaptor: function (options) {
          return this;
        },

        url: function () {
          var apiBase = new Url(this.connector.connection.url).getApiBase('v1'),
              url = Url.combine(apiBase, '/auth'),
              query = Url.combineQueryString(
                this.getExpandableResourcesUrlQuery(),
                this.getAdditionalResourcesUrlQuery()
              );
          return query ? url + '?' + query : url;
        },
    
        parse: function (response) {
          var user = response.data || {};
          user.perspective = response.perspective;
          return user;
        }
      });
    }
  };

  return ServerAdaptorMixin;
});
