/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/marionette', 'csui/lib/jquery',
  'csui/utils/contexts/page/page.context',
  'csui/utils/contexts/factories/connector', 'csui/models/node/node.model',
  'csui/models/nodes', 'csui/utils/commands/goto.location',
  'csui/utils/commands'
], function (Marionette, $, PageContext, ConnectorFactory, NodeModel,
    NodeCollection, GoToLocationCommand, commands) {
  'use strict';

  describe('GoToLocationCommand Command', function () {

    var goToLocationCommand, context, connector;

    beforeAll(function () {

      goToLocationCommand = commands.get('goToLocation');
      context = new PageContext({
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
      connector = context.getObject(ConnectorFactory);
    });

    afterAll(function () {
      $('body').empty();
    });

    it('can be constructed', function () {
      var helloCommand = new GoToLocationCommand();
      expect(helloCommand instanceof GoToLocationCommand).toBeTruthy();
    });

    it('is registered by default', function () {
      expect(goToLocationCommand).toBeDefined();
    });

    it('signature is "GoToLocation"', function () {
      expect(goToLocationCommand.get('signature')).toEqual('goToLocation');
      expect(goToLocationCommand.get('command_key')).toBeUndefined();
    });

    describe('when executed with a node', function () {
      var status;
      beforeEach(function () {
        status = {
          context: context,
          file: {name: 'test.txt', size: 456, type: 'text/plain'}
        };
      });

      it('gets enabled for a single node with document type', function () {
        status.nodes = new NodeCollection(
            new NodeModel({id: 2003, type: 144, parent_id: {id: 2001, container: true}},
                {connector: connector}));
        expect(goToLocationCommand.enabled(status)).toBeTruthy();
      });
      it('does not gets enabled for node other than document type', function () {
        status.nodes = new NodeCollection(
            new NodeModel({id: 2003, type: 0, parent_id: {id: 2001, container: true}},
                {connector: connector}));
        expect(goToLocationCommand.enabled(status)).toBeFalsy();
      });
      it('execute when object is  document type', function () {
        status.originatingView = new Marionette.View();
        status.container = undefined;
        status.nodes = new NodeCollection(
            new NodeModel({id: 2003, type: 144, parent_id: {id: 2001, container: true, type:0 }},
                {connector: connector}));
        goToLocationCommand.execute(status).done();
      });
    });

  });

});
