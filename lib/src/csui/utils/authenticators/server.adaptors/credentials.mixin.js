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

        prepareRequest: function (options) {
          var credentials = options && options.data ||
                            this.connection.credentials;
          return {
            type: 'POST',
            url: Url.combine(this.connection.url, 'auth'),
            data: {
              username: credentials.username,
              password: credentials.password,
              domain: ''
            }
          };
        }
      });
    }
  };

  return ServerAdaptorMixin;
});
