/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'require', 'module', 'csui/lib/underscore',
  'csui/utils/authenticators/request.authenticator'
], function (require, module, _, RequestAuthenticator) {
  'use strict';
  var InteractiveCredentialsAuthenticator = RequestAuthenticator.extend({
    constructor: function InteractiveCredentialsAuthenticator(options) {
      RequestAuthenticator.prototype.constructor.call(this, options);
    },

    authenticate: function (options, succeeded, failed) {
      if (typeof options === 'function') {
        failed = succeeded;
        succeeded = options;
        options = undefined;
      }

      RequestAuthenticator.prototype.authenticate.call(this, options,
          succeeded, _.bind(this.openSignInDialog, this, succeeded));
    },

    openSignInDialog: function (succeeded) {
      var self = this;
      require(['csui/utils/impl/signin.dialog/signin.dialog'
      ], function (SignInDialog) {
        var dialog = new SignInDialog({
          connection: self.connection
        });
        dialog.show()
              .done(function (args) {
                self.connection.session = args.session;
                succeeded(self.connection);
              });
      });
    }
  });

  return InteractiveCredentialsAuthenticator;
});
