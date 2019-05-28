/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'require', 'csui/utils/authenticators/request.authenticator',
  'csui/utils/authenticators/server.adaptors/credentials.mixin'
], function (require, RequestAuthenticator, ServerAdaptorMixin) {
  'use strict';
  var CredentialsAuthenticator = RequestAuthenticator.extend({
    constructor: function CredentialsAuthenticator(options) {
      RequestAuthenticator.prototype.constructor.call(this, options);
      this.credentials = options && options.credentials;
      this.makeServerAdaptor(options);
    },

    doAuthenticate: function (options, succeeded, failed) {
      var credentials = options.credentials ||
                        this.credentials ||
                        this.connection.credentials,
          self = this;
      if (credentials) {
        this.connection.credentials = credentials;
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

    _reportError: function (error) {
      require(['csui/dialogs/modal.alert/modal.alert'
      ], function (ModalAlert) {
        ModalAlert.showError(error.toString());
      });
    }
  });

  ServerAdaptorMixin.mixin(CredentialsAuthenticator.prototype);

  return CredentialsAuthenticator;
});
