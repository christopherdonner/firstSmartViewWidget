/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["csui/lib/jquery", "csui/lib/underscore", "csui/utils/basicauthenticator",
  "./authenticator.mock.data.js"
], function ($, _, BasicAuthenticator, mock) {
  "use strict";

  describe("Authenticator", function () {
    var authenticator;
    var validUsername = 'Admin',
      validPassword = 'livelink';

    beforeAll(function () {
      mock.enable();

      authenticator = new BasicAuthenticator({
        connection: {
          url: '//server/otcs/cs/api/v1',
          supportPath: '/otcssupport'
        }
      });
    });

    afterAll(function () {
      mock.disable();
    });


    it("Basic authentication ... ", function () {

      authenticator.authenticate({
        credentials: {
          username: validUsername,
          password: validPassword
        }
      }, function () {
        expect(true).toBeTruthy();
      }, function () {
        expect(false).toBeTruthy('Authentication failed');
      });
    });
  });
});
