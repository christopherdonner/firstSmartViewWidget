/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'csui/lib/jquery', 'csui/lib/underscore',
  'csui/utils/base', 'csui/utils/url', 'csui/utils/log',
  'csui/models/mixins/uploadable/uploadable.mixin',
  'csui/utils/authenticators/ticket.authenticator',
  'csui/lib/jquery.parse.param'
], function (module, $, _, base, Url, log, UploadableMixin,
     TicketAuthenticator) {
  'use strict';

  var config = window.csui.requirejs.s.contexts._.config
  .config['csui/utils/requestauthenticator'] || {};
  config = _.extend({
    connectionTimeout: 60 * 1000
  }, config, module.config());
  var RequestAuthenticator = TicketAuthenticator.extend({
    constructor: function RequestAuthenticator(options) {
      TicketAuthenticator.prototype.constructor.call(this, options);
    },

    login: function (options, succeeded, failed) {
      delete this.connection.session;
      log.debug('Sending authentication request to {0}.', this.connection.url)
      && console.log(log.last);
      var settings = this.prepareRequest(options);
      this.updateRequestBody(settings);
      return this.makeRequest(settings, succeeded, failed);
    },

    prepareRequest: function (options) {
      return options;
    },

    parseResponse: function (response, request) {
      return response;
    },

    makeRequest: function (options, succeeded, failed) {
      var headers = _.extend({}, this.connection.headers, options.headers);
      return $.ajax(_.extend({
        url: Url.combine(this.connection.url, 'auth'),

        timeout: this.connectionTimeout,
        context: this,

        beforeSend: function (request, settings) {
          request.settings = settings;
        },

        success: function (response, textStatus, request) {
          log.debug('Receiving authentication response from {0}.', this.connection.url)
          && console.log(log.last);
          response = this.parseResponse(response, request);
          if (this.authenticateSession(response, request)) {
            if (succeeded) {
              succeeded.call(this, this.connection);
            }
            this.trigger('loggedIn', {
              sender: this,
              connection: this.connection
            });
          }
        },

        error: function (request) {
          var error = new base.RequestErrorMessage(request);
          log.warn('Logging in to {0} failed:\r\n{1}',
            this.connection.url, error) && console.warn(log.last);
          if (failed) {
            failed.call(this, error, this.connection);
          }
        }
      }, options, {
        headers: headers
      }));
    },

    updateRequestBody: function (settings) {
      var data;
      if (UploadableMixin.useJSON || UploadableMixin.mock) {
        if (settings.contentType !== 'application/json') {
          settings.contentType = 'application/json';
          data = settings.data;
          if (typeof data === 'string') {
            data = $.parseParam(data);
          }
          if (UploadableMixin.mock) {
            settings.data = data;
          } else {
            settings.data = JSON.stringify(data);
          }
          settings.processData = false;
        }
      } else {
        if (settings.contentType === 'application/json') {
          settings.contentType = 'application/x-www-form-urlencoded';
          data = settings.data;
          if (typeof data === 'string') {
            settings.data = JSON.parse(data);
          }
          if (UploadableMixin.mock) {
            settings.data = data;
          }
          settings.processData = true;
        }
      }
    },

    authenticateSession: function (response, request) {
      if (response && response.ticket) {
        if (request && request.settings && request.settings.data) {
          log.info('Logging in to {0} as {1} succeeded.',
              this.connection.url, request.settings.data.username)
          && console.log(log.last);
        }
        this.updateAuthenticatedSession(response, request);
        return true;
      }
      return true;
    },

    unauthenticate: function (options) {
      var first = this.isAuthenticated();
      TicketAuthenticator.prototype.unauthenticate.apply(this, arguments);
      if (first) {
        this.trigger('loggedOut', {
          sender: this,
          connection: this.connection,
          reason: options && options.reason
        });
      }
      return this;
    },

    connectionTimeout: config.connectionTimeout
  });

  return RequestAuthenticator;
});
