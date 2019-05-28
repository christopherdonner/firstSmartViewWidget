/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/backbone'
], function (_, Backbone) {
  'use strict';
  function Authenticator(options) {
    this.connection = options && options.connection || {};
  }

  _.extend(Authenticator.prototype, Backbone.Events, {
    authenticate: function (options, succeeded, failed) {
      if (typeof options === 'function') {
        failed = succeeded;
        succeeded = options;
        options = undefined;
      }
      options || (options = {});

      this.syncStorage(options.session);
      if (this.doAuthenticate(options, succeeded, failed)) {
        return this;
      }

      if (this.isAuthenticated()) {
        if (succeeded) {
          succeeded(this.connection);
        }
      } else {
        var error = new Error('Missing authentication parameters.');
        if (failed) {
          failed(error, this.connection);
        } else {
          throw error;
        }
      }
      return this;
    },

    doAuthenticate: function (options) {
    },

    unauthenticate: function (options) {
      return this;
    },

    isAuthenticated: function () {
      return false;
    },

    syncStorage: function (session) {
      return this;
    },

    setAuthenticationHeaders: function (headers) {
    },

    updateAuthenticatedSession: function (session) {
    }
  });

  Authenticator.extend = Backbone.View.extend;

  return Authenticator;
});
