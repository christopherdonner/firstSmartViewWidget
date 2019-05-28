/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/marionette', 'csui/lib/backbone', 'csui/lib/jquery',
  'csui/utils/contexts/page/page.context',
  'csui/utils/contexts/factories/connector', 'csui/models/node/node.model',
  'csui/models/nodes', 'csui/utils/commands/create.perspective',
  'csui/utils/commands', 'csui/controls/globalmessage/globalmessage',
  'csui/utils/contexts/factories/application.scope.factory',
], function (Marionette, Backbone, $, PageContext, ConnectorFactory, NodeModel,
    NodeCollection, EditPerspective, commands, GlobalMessage, ApplicationScopeModelFactory) {
  'use strict';

  describe('Create perspective Command', function () {

    var createPerspectiveCommand;

    beforeAll(function () {
      createPerspectiveCommand = commands.get('CreatePerspective');
    });

    afterAll(function () {
      $('body').empty();
    });

    it('can be constructed', function () {
      var helloCommand = new EditPerspective();
      expect(helloCommand instanceof EditPerspective).toBeTruthy();
    });

    it('is registered by default', function () {
      expect(createPerspectiveCommand).toBeDefined();
    });

    it('signature is "CreatePerspective"', function () {
      expect(createPerspectiveCommand.get('signature')).toEqual('CreatePerspective');
      expect(createPerspectiveCommand.get('command_key')).toBeUndefined();
    });

    describe('when executed with a node', function () {

      var messageLocation, status, context;

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
        var perspective = new Backbone.Model({canEditPerspective: true});
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
        var appScope = context.getModel(ApplicationScopeModelFactory, {
          permanent: true,
          detached: true
        });
        appScope.set('id', 'node');
        context._applicationScope = appScope;
        status = {
          context: context
        };
      });

      it('disable when when current scope is not a node', function () {
        context._applicationScope.set('id', '');
        expect(createPerspectiveCommand.enabled(status)).toBeFalsy();
      });

      it('enable when node dont have perspectives configured', function () {
        expect(createPerspectiveCommand.enabled(status)).toBeTruthy();
      });

      it('disable when no perspective editng permission', function () {
        context.perspective.set('canEditPerspective', false);
        expect(createPerspectiveCommand.enabled(status)).toBeFalsy();
      });

      it('enable when having perspective eding permission', function () {
        context.perspective.unset('id');
        context.perspective.set('canEditPerspective', true);
        expect(createPerspectiveCommand.enabled(status)).toBeTruthy();
      });

      it('Open inline perspective editing on execution', function (done) {
        createPerspectiveCommand.execute(status, {inlinePerspectiveEditing: true}).done(
            function () {
              expect($('.pman').length > 0).toBeTruthy();
              done();
            });
      });
    });

  });

});
