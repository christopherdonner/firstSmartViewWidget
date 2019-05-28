/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/marionette', 'csui/lib/jquery',
  'csui/utils/contexts/page/page.context',
  'csui/utils/contexts/factories/connector', 'csui/models/node/node.model',
  'csui/models/nodes', 'csui/utils/commands/copy.link',
  'csui/utils/commands', 'csui/controls/globalmessage/globalmessage'
], function (Marionette, $, PageContext, ConnectorFactory, NodeModel,
    NodeCollection, CopyLinkCommand, commands, GlobalMessage) {
  'use strict';

  describe('CopyLink Command', function () {

    var copyLinkCommand, context, connector;

    beforeAll(function () {

      copyLinkCommand = commands.get('CopyLink');
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
      var helloCommand = new CopyLinkCommand();
      expect(helloCommand instanceof CopyLinkCommand).toBeTruthy();
    });

    it('is registered by default', function () {
      expect(copyLinkCommand).toBeDefined();
    });

    it('signature is "CopyLink"', function () {
      expect(copyLinkCommand.get('signature')).toEqual('CopyLink');
      expect(copyLinkCommand.get('command_key')).toBeUndefined();
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
          context: context,
          nodes: new NodeCollection([node]),
          file: {name: 'test.txt', size: 456, type: 'text/plain'}
        };
      });

      it('gets enabled for a single node without any specific permission', function () {
        expect(copyLinkCommand.enabled(status)).toBeTruthy();
      });

      it('does not get enabled for multiple nodes', function () {
        status.nodes = new NodeCollection(
            [
              new NodeModel({id: 2003}, {connector: connector}),
              new NodeModel({id: 2004}, {connector: connector})
            ]);
        expect(copyLinkCommand.enabled(status)).toBeFalsy();
      });

      it('succeeds without container & originating view in status', function () {
        status.originatingView = undefined;
        status.container = undefined;
        copyLinkCommand.execute(status);  //Todo: need to find a way to validate copied link on

      });
    });

  });

});
