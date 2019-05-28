/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/utils/url',
], function (_, Url) {
  'use strict';

  var ServerAdaptorMixin = {
    mixin: function (prototype) {
      return _.extend(prototype, {
        makeServerAdaptor: function (options) {
          return this;
        },

        prepareRequest: function (options) {
          var headers = options && options.headers ||
                        this.connection.authenticationHeaders;
          return {
            url: Url.combine(this.connection.url, 'auth'),
            headers: headers
          };
        }
      });
    }
  };

  return ServerAdaptorMixin;
});
