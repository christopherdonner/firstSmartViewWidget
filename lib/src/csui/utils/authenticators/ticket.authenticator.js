/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'csui/lib/underscore', 'csui/utils/authenticators/authenticator',
  'csui/utils/namedsessionstorage'
], function (module, _, Authenticator, NamedSessionStorage) {
  'use strict';

  var config = window.csui.requirejs.s.contexts._.config
      .config['csui/utils/authenticator'] || {};
  config = _.extend({
    rememberTicket: true,
    ticketHeader: 'OTCSTicket',
    ticketExpirationHeader: 'OTCSTicketExpires'
  }, config, module.config());
  config.ticketHeader = config.ticketHeader.toLowerCase();
  config.ticketExpirationHeader = config.ticketExpirationHeader.toLowerCase();

  var storage = new NamedSessionStorage(module.id);
  var TicketAuthenticator = Authenticator.extend({
    constructor: function TicketAuthenticator(options) {
      Authenticator.prototype.constructor.call(this, options);
    },

    unauthenticate: function (options) {
      this.connection.session = undefined;
      if (config.rememberTicket) {
        storage.remove(this.connection.url);
      }
      this.trigger('loggedOut', {
        sender: this,
        connection: this.connection,
        reason: options && options.reason
      });
      return this;
    },

    isAuthenticated: function () {
      var session = this.connection.session;
      return !!(session && session.ticket);
    },

    syncStorage: function (session) {
      session || (session = this.connection.session);
      if (!session && config.rememberTicket) {
        session = storage.get(this.connection.url);
      }
      if (session) {
        this.connection.session || (this.connection.session = {});
        _.extend(this.connection.session, session);
      }
      return this;
    },

    setAuthenticationHeaders: function (headers) {
      var session = this.connection.session,
          ticket = session && session.ticket;
      if (ticket) {
        headers[config.ticketHeader] = ticket;
        return true;
      }
    },

    updateAuthenticatedSession: function (data, request) {
      data || (data = {});
      if (!request && data.getResponseHeader) {
        request = data;
        data = {};
      }
      var ticket = data.ticket || request &&
                   request.getResponseHeader(config.ticketHeader);
      if (ticket) {
        var session = this.connection.session ||
                      (this.connection.session = {});
        _.extend(session, {
          ticket: ticket,
          expires: data.expires || request &&
                   request.getResponseHeader(config.ticketExpirationHeader)
        });
        if (config.rememberTicket) {
          storage.set(this.connection.url, session);
        }
      }
    }
  });

  return TicketAuthenticator;
});
