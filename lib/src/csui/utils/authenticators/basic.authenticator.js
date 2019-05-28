/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/base',
  'csui/utils/url', 'csui/utils/log', 'csui/utils/namedsessionstorage',
  'csui/utils/authenticators/authenticator',
  'csui/models/mixins/uploadable/uploadable.mixin',
  'csui/utils/authenticators/server.adaptors/basic.mixin'
], function (module, _, $, base, Url, log, NamedSessionStorage,
    Authenticator, UploadableMixin, ServerAdaptorMixin) {
  'use strict';

  var config = _.extend({
    rememberCredentials: true
  }, module.config());

  var storage = new NamedSessionStorage(module.id);
  var BasicAuthenticator = Authenticator.extend({
    constructor: function BasicAuthenticator(options) {
      Authenticator.prototype.constructor.call(this, options);
      this.credentials = options && options.credentials;
      this.makeServerAdaptor(options);
    },

    check: function (options, succeeded, failed) {
      log.debug('Checking credentials with {0}.', this.connection.url)
      && console.log(log.last);
      var settings = this.prepareRequest(options);
      return this.makeRequest(settings, succeeded, failed);
    },

    prepareRequest: function (options) {
      return options;
    },

    makeRequest: function (options, succeeded, failed) {
      var headers = _.extend({}, this.connection.headers, options.headers);
      return $.ajax(_.extend({
        timeout: this.connectionTimeout,
        context: this,

        beforeSend: function (request, settings) {
          request.settings = settings;
        },

        success: function (response, textStatus, request) {
          log.debug('Receiving credentials-checking response from {0}.',
              this.connection.url) && console.log(log.last);
          this.doAuthenticate(options);
          if (succeeded) {
            succeeded(this.connection);
          }
          this.trigger('loggedIn', {
            sender: this,
            connection: this.connection
          });
        },

        error: function (request) {
          var error = new base.RequestErrorMessage(request);
          log.warn('Check credentials with {0} failed:\r\n{1}',
            this.connection.url, error) && console.warn(log.last);
          if (failed) {
            failed(error, this.connection);
          }
        }
      }, options, {
        headers: headers
      }));
    },

    doAuthenticate: function (options, succeeded, failed) {
      var credentials = options.credentials ||
                        this.credentials ||
                        this.connection.credentials;
      if (credentials) {
        this.connection.credentials = credentials;
        if (config.rememberCredentials) {
          storage.set(this.connection.url, credentials);
        }
      }
    },

    unauthenticate: function (options) {
      var first = this.isAuthenticated();
      this.connection.credentials = undefined;
      if (config.rememberCredentials) {
        storage.remove(this.connection.url);
      }
      if (first) {
        this.trigger('loggedOut', {
          sender: this,
          connection: this.connection,
          reason: options && options.reason
        });
      }
      return this;
    },

    isAuthenticated: function () {
      return !!this.connection.credentials;
    },

    syncStorage: function () {
      if (!this.connection.credentials && config.rememberCredentials) {
        this.connection.credentials = storage.get(this.connection.url);
      }
      return this;
    },

    setAuthenticationHeaders: function (headers) {
      headers.authorization = this.formatAuthorizationHeader(
        this.connection.credentials);
    },

    formatAuthorizationHeader: function (credentials) {
      return 'Basic ' + btoa(unescape(encodeURIComponent(
        credentials.username + ':' + credentials.password)));
    }
  });

  ServerAdaptorMixin.mixin(BasicAuthenticator.prototype);

  return BasicAuthenticator;
});
