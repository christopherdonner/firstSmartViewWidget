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

        urlRoot: function () {
          var apiBase = new Url(this.connector.connection.url).getApiBase('v1');
          return Url.combine(apiBase, '/members');
        },

        url: function () {
          var query = Url.combineQueryString(this.getExpandableResourcesUrlQuery()),
              id = this.get('id'),
              url;
          if (id) {
            url = Url.combine(this.urlRoot(), id);
          } else {
            var apiBase = new Url(this.connector.connection.url).getApiBase('v1');
            url = Url.combine(apiBase, '/auth');
          }
          return query ? url + '?' + query : url;
        },

        parse: function (response) {
          return response.user || response.data || response;
        }
      });
    }

  };

  return ServerAdaptorMixin;
});
