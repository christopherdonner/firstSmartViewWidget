/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'csui/lib/underscore',
  'csui/utils/authenticators/ticket.authenticator',
  'csui/utils/authenticators/basic.authenticator',
  'csui/utils/authenticators/credentials.authenticator',
  'csui/utils/authenticators/regular.header.authenticator',
  'csui/utils/authenticators/initial.header.authenticator',
  'csui/utils/authenticators/interactive.credentials.authenticator'
], function (module, _, TicketAuthenticator, BasicAuthenticator,
     CredentialsAuthenticator, RegularHeaderAuthenticator,
     InitialHeaderAuthenticator, InteractiveCredentialsAuthenticator) {
  'use strict';

  var config = window.csui.requirejs.s.contexts._.config
      .config['csui/utils/interactiveauthenticator'] || {},
      enableInteractiveAuthenticator = config.enabled;
  config = _.extend({
    enableInteractiveAuthenticator: enableInteractiveAuthenticator != null ?
	                            enableInteractiveAuthenticator : true,
    forceBasicAuthenticator: false,
    preferBasicAuthenticator: false,
    preferRegularHeaderAuthenticator: false
  }, module.config());

  return [
    {
      authenticator: BasicAuthenticator,
      sequence: 50,
      decides: function (connection) {
        return config.forceBasicAuthenticator ||
               connection.credentials && config.preferBasicAuthenticator;
      }
    },
    {
      authenticator: RegularHeaderAuthenticator,
      sequence: 50,
      and: {
        has: 'authenticationHeaders',
        decides: function () {
          return config.preferRegularHeaderAuthentication;
        }
      }
    },
    {
      authenticator: CredentialsAuthenticator,
      has: 'credentials'
    },
    {
      authenticator: InitialHeaderAuthenticator,
      has: 'authenticationHeaders'
    },
    {
      sequence: 1000,
      authenticator: config.enableInteractiveAuthenticator ?
                     InteractiveCredentialsAuthenticator : TicketAuthenticator
    }
  ];
});
