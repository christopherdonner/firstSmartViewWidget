/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery', 'csui/utils/contexts/context',
  'csui/utils/contexts/factories/connector'
], function ($, Context, ConnectorFactory) {
  'use strict';

  describe('ConnectorFactory', function () {
    describe('with no configuration', function () {
      beforeAll(function () {
        csui.require.s.contexts._.config.config['csui/utils/contexts/factories/connector'] = {};
      });

      it('creates a connector with an empty connection object', function () {
        var context = new Context(),
            connector = context.getObject(ConnectorFactory);
        expect(typeof connector.connection === 'object').toBeTruthy();
        expect(Object.keys(connector.connection).length).toEqual(0);
      });
    });

    describe('with a configuration', function () {
      beforeAll(function () {
        csui.require.config({
          config: {
            'csui/utils/contexts/factories/connector': {
              connection: {
                url: '//server/otcs/cs/api/v1',
                supportPath: '/support'
              }
            }
          }
        });
      });

      it('populates connection from global configuration', function () {
        var context = new Context(),
            connector = context.getObject(ConnectorFactory);
        expect(connector.connection).toBeDefined();
        expect(connector.connection.url).toEqual('//server/otcs/cs/api/v1');
      });

      it('merges authentication parameters from context options', function () {
        var context = new Context({
              factories: {
                connector: {
                  connection: {
                    session: {
                      ticket: 'dummy'
                    }
                  }
                }
              }
            }),
            connector = context.getObject(ConnectorFactory);
        expect(connector.connection).toBeDefined();
        expect(connector.connection.url).toEqual('//server/otcs/cs/api/v1');
        expect(connector.connection.session).toBeDefined();
        expect(connector.connection.session.ticket).toEqual('dummy');
        expect(connector.authenticator.isAuthenticated()).toBeTruthy();
      });

      it('merges authentication parameters from factory options', function () {
        var context = new Context(),
            connector = context.getObject(ConnectorFactory, {
              connector: {
                connection: {
                  session: {
                    ticket: 'dummy'
                  }
                }
              }
            });
        expect(connector.connection).toBeDefined();
        expect(connector.connection.url).toEqual('//server/otcs/cs/api/v1');
        expect(connector.connection.session).toBeDefined();
        expect(connector.connection.session.ticket).toEqual('dummy');
        expect(connector.authenticator.isAuthenticated()).toBeTruthy();
      });
    });
  });
});
