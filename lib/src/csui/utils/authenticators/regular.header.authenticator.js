/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'csui/lib/underscore', 'csui/utils/log',
  'csui/utils/authenticators/authenticator', 'csui/utils/namedsessionstorage'
], function (module, _, log, Authenticator, NamedSessionStorage) {
  'use strict';

  var config = _.extend({
    rememberAuthenticationHeaders: true
  }, module.config());

  var storage = new NamedSessionStorage(module.id);

  var RegularHeaderAuthenticator = Authenticator.extend({
    constructor: function RegularHeaderAuthenticator(options) {
      Authenticator.prototype.constructor.call(this, options);
    },

    doAuthenticate: function (options, succeeded, failed) {
      var headers = options.headers ||
                    this.connection.authenticationHeaders;
      if (headers) {
        this.connection.authenticationHeaders = headers;
        if (config.rememberAuthenticationHeaders) {
          storage.remove(this.connection.url);
        }
      }
    },

    unauthenticate: function (options) {
      this.connection.authenticationHeaders = undefined;
      if (config.rememberAuthenticationHeaders) {
        storage.remove(this.connection.url);
      }
      return this;
    },

    isAuthenticated: function () {
      return !!this.connection.authenticationHeaders;
    },

    syncStorage: function () {
      if (!this.connection.authenticationHeaders &&
          config.rememberAuthenticationHeaders) {
        this.connection.authenticationHeaders = storage.get(this.connection.url);
      }
      return this;
    },

    setAuthenticationHeaders: function (headers) {
      _.extend(headers, this.connection.authenticationHeaders);
    }
  });

  return RegularHeaderAuthenticator;
});
