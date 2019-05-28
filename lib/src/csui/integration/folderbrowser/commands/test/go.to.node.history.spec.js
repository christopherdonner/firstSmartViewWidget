/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/utils/contexts/page/page.context',
  'csui/utils/contexts/factories/next.node',
  'csui/utils/contexts/factories/node',
  'csui/utils/commands',
  './go.to.node.history.mock.js'
], function (PageContext, NextNodeModelFactory, NodeModelFactory, commands, mock) {
  'use strict';

  describe('GoToNodeHistory', function () {

    var backCommand, context, node, nextNode, status;

    beforeAll(function (done) {
      mock.enable();

      window.csui.requirejs.config({
        config: {
          'csui/integration/folderbrowser/commands/go.to.node.history': {
            enabled: true
          }
        }
      });

      backCommand = commands.get('Back');
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
      node = context.getModel(NodeModelFactory);
      node.set('id', 2000);
      nextNode = context.getModel(NextNodeModelFactory);
      status = {
        context: context
      };
      backCommand.enabled(status);
      setTimeout(done, 100);
    });

    afterAll(function () {
      window.csui.requirejs.config({
        config: {
          'csui/integration/folderbrowser/commands/go.to.node.history': {
            enabled: false
          }
        }
      });

      mock.disable();
    });

    afterEach(function () {
      nextNode.unset('id', {silent: true});
    });

    it('is registered by default', function () {
      expect(backCommand).toBeDefined();
    });

    it('is not enabled by default', function () {
      expect(backCommand.enabled(status)).toBeFalsy();
    });

    it('is not enabled after realoding the same container', function () {
      nextNode.set('id', 2000);
      expect(backCommand.enabled(status)).toBeFalsy();
    });

    it('gets enabled after a drill-down', function () {
      nextNode.set('id', 2001);
      expect(backCommand.enabled(status)).toBeTruthy();
    });

    it('gets disabled again after going back', function (done) {
      backCommand
          .execute(status)
          .done(function () {
            expect(nextNode.get('id')).toEqual(2000);
            expect(backCommand.enabled(status)).toBeFalsy();
            done();
          });
    });

    it('gets enabled after context re-fetch with a different node too', function (done) {
      node.set('id', 2001);
      context
          .fetch()
          .done(function () {
            expect(backCommand.enabled(status)).toBeTruthy();
            done();
          });
    });

    it('gets disabled after clearing history', function () {
      expect(backCommand.enabled(status)).toBeTruthy();
      backCommand.clearHistory(context);
      expect(backCommand.enabled(status)).toBeFalsy();
    });

  });

});
