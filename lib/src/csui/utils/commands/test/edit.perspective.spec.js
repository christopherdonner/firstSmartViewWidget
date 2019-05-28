/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/marionette', 'csui/lib/backbone', 'csui/lib/jquery',
  'csui/utils/contexts/page/page.context',
  'csui/utils/contexts/factories/connector', 'csui/models/node/node.model',
  'csui/models/nodes', 'csui/utils/commands/edit.perspective',
  'csui/utils/commands', 'csui/controls/globalmessage/globalmessage',
  "./edit.perspective.mock.js"
], function (Marionette, Backbone, $, PageContext, ConnectorFactory, NodeModel,
    NodeCollection, EditPerspective, commands, GlobalMessage, Mock) {
  'use strict';

  describe('Edit perspective Command', function () {

    var editPerspectiveCommand, context, connector;

    beforeAll(function () {
      editPerspectiveCommand = commands.get('EditPerspective');
      Mock.enable();
    });

    afterAll(function () {
      $('body').empty();
      Mock.disable();
    });

    it('can be constructed', function () {
      var helloCommand = new EditPerspective();
      expect(helloCommand instanceof EditPerspective).toBeTruthy();
    });

    it('is registered by default', function () {
      expect(editPerspectiveCommand).toBeDefined();
    });

    it('signature is "EditPerspective"', function () {
      expect(editPerspectiveCommand.get('signature')).toEqual('EditPerspective');
      expect(editPerspectiveCommand.get('command_key')).toBeUndefined();
    });

    describe('when executed with a node', function () {

      var messageLocation, status;

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
        var perspective = new Backbone.Model({canEditPerspective: true, id: 1});
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
          },
        });
        context.perspective = perspective;
        connector = context.getObject(ConnectorFactory);
        status = {
          context: context
        };
      });

      it('disable when node dont have perspectives configured', function () {
        context.perspective.unset('id');
        expect(editPerspectiveCommand.enabled(status)).toBeFalsy();
      });

      it('disable when no perspective eding permission', function () {
        context.perspective.set('canEditPerspective', false);
        expect(editPerspectiveCommand.enabled(status)).toBeFalsy();
      });

      it('enable when having perspective eding permission', function () {
        context.perspective.set('canEditPerspective', true);
        expect(editPerspectiveCommand.enabled(status)).toBeTruthy();
      });

      it('Open inline perspective editing on execution', function (done) {
        editPerspectiveCommand.execute(status, {inlinePerspectiveEditing: true}).done(function () {
          expect($('.pman').length > 0).toBeTruthy();
          done();
        });
      });
    });

  });

});
