/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/models/node/node.model', 'csui/utils/contexts/context',
  'csui/utils/contexts/factories/node', 'csui/utils/contexts/factories/connector'
], function ($, NodeModel, Context, NodeModelFactory, ConnectorFactory) {
  'use strict';

  describe('NodeModelFactory', function () {

    var context;

    beforeEach(function () {
      context = new Context({
        factories: {
          connector: {
            connection: {
              url: '//server/otcs/cs/api/v1',
              supportPath: '/support',
              session: {
                ticket: 'dummy'
              }
            }
          }
        }
      });

    });

    it('provides a node with connector', function () {
      var node = context.getModel(NodeModelFactory),
          connector = context.getObject(ConnectorFactory);
      expect(node.connector).toBe(connector);
    });

    it('initializes the node with attributes from the property prefix option', function () {
      var node = context.getModel(NodeModelFactory, {
        node: {
          attributes: {id: 1}
        }
      });
      expect(node.get('id')).toEqual(1);
    });

    it('initializes the node with options from the property prefix option', function () {
      var node = context.getModel(NodeModelFactory, {
        node: {
          options: {expand: 'test'}
        }
      });
      expect(node.expand).toEqual('test');
    });

    it('adopts the object specified by the property prefix option', function () {
      var node = new NodeModel({
            id: 1,
            name: 'test'
          }),
          node1 = context.getModel(NodeModelFactory, {
            attributes: {id: 1},
            node: node
          }),
          node2 = context.getModel(NodeModelFactory, {
            attributes: {id: 1}
          });
      expect(node1).toBe(node);
      expect(node2).toBe(node);
    });

    it('delegates checking of fetch-ability to the node', function () {
      var node = context.getModel(NodeModelFactory),
          factory = context._factories['node'];
      expect(context._isFetchable(factory)).toBeFalsy();
      node.isFetchable = function () {
        return true;
      };
      expect(context._isFetchable(factory)).toBeTruthy();
    });

    it('passes fetching options along and returns the promise', function (done) {
      var node = context.getModel(NodeModelFactory, {
            node: {
              attributes: {id: 1}
            }
          }),
          passedOptions;
      node.fetch = function (options) {
        passedOptions = options;
        return $.Deferred().resolve({});
      };
      context.fetch({test: true})
        .then(function() {
          expect(passedOptions.test).toBeTruthy();
          done();
        });
    }, 2000);

  });

});
