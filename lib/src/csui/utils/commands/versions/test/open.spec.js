/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/backbone', 'csui/utils/connector',
  'csui/models/version', 'csui/utils/commands/versions/open',
  './open.mock.js'
], function (Backbone, Connector, VersionModel, OpenVersionCommand,
    mock) {
  'use strict';

  describe('OpenVersionCommand', function () {

    var connector, apiUrlBase, openCommand,
        originalWindowOpen, openedWindow;

    beforeAll(function () {
      apiUrlBase = '//server/otcs/cs/api';
      connector = new Connector({
        connection: {
          url: apiUrlBase + '/v1',
          supportPath: '/support',
          session: {
            ticket: 'dummy'
          }
        }
      });

      openCommand = new OpenVersionCommand();

      originalWindowOpen = window.open;
      window.open = function (url) {
        openedWindow = {
          location: {
            href: url
          },
          focus: function () {}
        };
        return openedWindow;
      };

      mock.enable();
    });

    afterAll(function () {
      window.open = originalWindowOpen;

      mock.disable();
    });

    it('Navigates to version-specific REST URL', function (done) {
      var version = new VersionModel({
            id: 2001,
            mime_type: 'text/plain',
            version_number: 2
          }, {
            connector: connector
          }),
          status = {
            nodes: new Backbone.Collection([version])
          };
      openCommand
          .execute(status)
          .done(function () {
            expect(openedWindow.location.href).toEqual(
                apiUrlBase +
                '/v1/nodes/2001/versions/2/content?action=open&token=dummy');
            done();
          });
    });

  });

});
