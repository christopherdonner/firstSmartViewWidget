/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/marionette', 'csui/utils/contexts/page/page.context',
  'csui/utils/contexts/factories/connector', 'csui/models/node/node.model',
  'csui/models/nodes', 'csui/utils/commands/add.version',
  'csui/utils/commands', 'csui/controls/globalmessage/globalmessage',
  './add.version.mock.js',
  'csui/lib/jquery.mockjax'
], function (Marionette, PageContext, ConnectorFactory, NodeModel,
    NodeCollection, AddVersionCommand, commands, GlobalMessage, mock, mockjax) {
  'use strict';

  describe('AddVersionCommand', function () {

    var addVersionCommand, context, connector;

    beforeAll(function () {
      mockjax.publishHandlers();
      mock.enable();
      addVersionCommand = commands.get('AddVersion');
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
      mock.disable();
    });

    it('can be constructed', function () {
      var helloCommand = new AddVersionCommand();
      expect(helloCommand instanceof AddVersionCommand).toBeTruthy();
    });

    it('is registered by default', function () {
      expect(addVersionCommand).toBeDefined();
    });

    it('requires a singe node and "addversion" permitted action', function () {
      expect(addVersionCommand.get('scope')).toEqual('single');
      expect(addVersionCommand.get('command_key')).toEqual('addversion');
    });

    describe('when executed with a node', function () {

      var messageLocation, node, status;

      beforeAll(function () {
        messageLocation = new Marionette.View();
        messageLocation.render();
        messageLocation.$el.height("62px");
        messageLocation.trigger('before:show');
        messageLocation.$el.appendTo(document.body);
        messageLocation.trigger('show');
        GlobalMessage.setMessageRegionView(messageLocation);
      });

      afterAll(function () {
        messageLocation.destroy();
      });

      beforeEach(function () {
        node = new NodeModel({id: 2001}, {connector: connector});
        status = {
          context:context,
          nodes: new NodeCollection([node]),
          file: {name: 'test.txt', size: 456, type: 'text/plain'}
        };
      });

      xit('succeeds without container in status', function (done) {
        status.originatingView = new Marionette.View();
        addVersionCommand
            .execute(status)
            .done(done);
      }, 5000);

      xit('succeeds without originating view in status', function (done) {
        status.container = new NodeModel({id: 2000}, {connector: connector});
        addVersionCommand
            .execute(status)
            .done(done);
      });

    });

  });

});
