/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery', 'csui/lib/underscore',
  'csui/utils/basicauthenticator',
  'csui/utils/connector',
  'csui/models/node/node.model',
  './connector.mock.data.js'
], function ($, _,
    BasicAuthenticator,
    Connector,
    NodeModel,
    ConnectorMock) {
  'use strict';

  describe('Connector', function () {

    var authenticator, connector;

    beforeAll(function () {

      ConnectorMock.enable();

      authenticator = new BasicAuthenticator({
        credentials: {
          username: 'Admin',
          password: 'livelink'
        }
      });
      connector = new Connector({
        authenticator: authenticator,
        connection: {
          url: '//server/otcs/cs/api/v1',
          supportPath: '/otcssupport'
        }
      });
    });

    afterAll(function () {
      ConnectorMock.disable();
    });

    it('can be instantiated', function () {
      expect(connector).toBeDefined();
    });

    it('provides connection URL as an object', function () {
      var url = connector.getConnectionUrl();
      expect(url.toString()).toEqual('//server/otcs/cs/api/v1');
      expect(url.getApiBase('v2')).toEqual('//server/otcs/cs/api/v2/');
    });

    it('can authenticate ...', function () {

      connector.authenticator.authenticate({
        credentials: {
          username: 'Admin',
          password: 'livelink'
        }
      }, function () {
        expect(true).toBeTruthy();
      }, function () {
        expect(false).toBeTruthy('Authentication failed');
      });

    });

    it('can connect and get NodeModel...', function (done) {
      var node = new NodeModel({id: 2000}, {
        connector: connector
      });

      var fetched = node.fetch()
                        .then(function () {
                          var name = node.get('name');
                          expect(name).toEqual('Enterprise');
                          done();
                        })
                        .fail(function () {
                          expect(false).toBeTruthy(
                              'Fetch failed (state=' + fetched.state() + '\').');
                        });

    });

  });

});
