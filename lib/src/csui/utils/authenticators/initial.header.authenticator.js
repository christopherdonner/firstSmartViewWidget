/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'require', 'csui/utils/log',
  'csui/utils/authenticators/request.authenticator',
  'csui/utils/authenticators/server.adaptors/initial.header.mixin'
], function (require, log, RequestAuthenticator, ServerAdaptorMixin) {
  'use strict';

  var InitialHeaderAuthenticator = RequestAuthenticator.extend({
    constructor: function InitialHeaderAuthenticator(options) {
      RequestAuthenticator.prototype.constructor.call(this, options);
      this.makeServerAdaptor(options);
    },

    doAuthenticate: function (options, succeeded, failed) {
      var headers = options.headers ||
                    this.connection.authenticationHeaders,
          self = this;
      if (headers) {
        this.connection.authenticationHeaders = headers;
        this.login({}, succeeded, function (error, connection) {
          self._reportError(error);
          self.unauthenticate({reason: 'failed'});
          if (failed) {
            failed(error, connection);
          }
        });
        return true;
      }
    },

    authenticateSession: function (response, request) {
      if (response && response.data) {
        log.info('Logging in to {0} as {1} succeeded.',
            this.connection.url, response.data.name)
        && console.log(log.last);
        this.updateAuthenticatedSession(request);
        return true;
      }
    },

    _reportError: function (error) {
      require(['csui/dialogs/modal.alert/modal.alert'
      ], function (ModalAlert) {
        ModalAlert.showError(error.toString());
      });
    }
  });

  ServerAdaptorMixin.mixin(InitialHeaderAuthenticator.prototype);

  return InitialHeaderAuthenticator;
});
