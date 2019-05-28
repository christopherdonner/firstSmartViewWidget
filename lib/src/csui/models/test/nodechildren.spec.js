/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery',
  'csui/models/node/node.model', 'csui/models/nodechildren',
  'csui/utils/connector', './nodechildren.mock.js'
], function (_, $, NodeModel, NodeChildrenCollection, Connector, mock) {
  'use strict';

  describe('NodeChildrenCollection', function () {

    var connector, container;

    beforeAll(function () {
      mock.enable();
      connector = new Connector({
        connection: {
          url: '//server/otcs/cs/api/v1',
          supportPath: '/support',
          session: {
            ticket: 'dummy'
          }
        }
      });
      container = new NodeModel({id: 2000}, {connector: connector});
    });

    afterAll(function () {
      mock.disable();
    });

    describe('when cloned', function () {

      it('leaves original collection filtering intact', function (done) {
        var original = new NodeChildrenCollection({id: 2000}, {
              node: container,
              filter: {}
            }),
            clone = original.clone();
        clone.setFilter({name: 'Second'}, {fetch: false});
        $
            .when(original.fetch(), clone.fetch())
            .done(function () {
              expect(original.length).toEqual(2);
              expect(original.first().get('name')).toEqual('First child');
              expect(clone.length).toEqual(1);
              expect(clone.first().get('name')).toEqual('Second child');
              done();
            });
      }, 5000);

      it('leaves original collection expanding intact', function () {
        var original = new NodeChildrenCollection({id: 2000}, {
              node: container,
              expand: ['node']
            }),
            clone = original.clone();
        clone.setExpand(['user']);
        expect(original.expand).toEqual(['node']);
        expect(clone.expand).toEqual(['node', 'user']);
      });

    });

    describe('when requesting all actions immediately', function () {

      var children;
      it('just one server call is issued', function (done) {
        children = new NodeChildrenCollection({id: 2000}, {
          node: container,
          commands: ['browse', 'download', 'reserve', 'delete']
        });
        children
            .fetch()
            .done(done);
      }, 5000);

      it('just one server call is issued', function () {
        expect(children.delayedActions.fetching ||
               children.delayedActions.fetched).toBeFalsy();
      });

      it('all requested actions are received', function () {
        expect(children.length).toEqual(2);
        var signatures = children.first().actions.pluck('signature');
        expect(signatures).toEqual(['browse', 'delete']);
        signatures = children.last().actions.pluck('signature');
        expect(signatures).toEqual(['delete', 'download', 'reserve']);
      });

    });

    describe('when requesting delayed actions', function () {

      var children, defaultActions;
      it('just one server call is issued', function (done) {
        children = new NodeChildrenCollection({id: 2000}, {
          node: container,
          commands: ['browse', 'download', 'reserve', 'delete'],
          defaultActionCommands: ['browse', 'download'],
          delayRestCommands: true
        });
        children.delayedActions.once('sync', done);
        children
            .fetch({
              success: function () {
                expect(children.length).toEqual(2);
                defaultActions = [
                    children.first().actions.clone(),
                    children.last().actions.clone()
                ];
              }
            });
      }, 5000);

      it('just default actions are received by the first call', function () {
        var signatures = defaultActions[0].pluck('signature');
        expect(signatures).toEqual(['browse']);
        signatures = defaultActions[1].pluck('signature');
        expect(signatures).toEqual(['download']);
      });

      it('an additional server call is issued', function () {
        expect(children.delayedActions.fetching ||
               children.delayedActions.fetched).toBeTruthy();
      }, 5000);

      it('only the rest of actions is requested by the second call', function () {
        expect(children.delayedActions.length).toEqual(2);
        var signatures = children.delayedActions.first().actions.pluck('signature');
        expect(signatures).toEqual(['delete']);
        signatures = children.delayedActions.last().actions.pluck('signature');
        expect(signatures).toEqual(['delete', 'reserve']);
      });

      it('all actions are available when the second call is finished', function () {
        var signatures = children.first().actions.pluck('signature');
        expect(signatures).toEqual(['browse', 'delete']);
        signatures = children.last().actions.pluck('signature');
        expect(signatures).toEqual(['download', 'delete', 'reserve']);
      });

    });

  });

});
