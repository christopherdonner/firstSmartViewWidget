/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery',
  'csui/pages/start/impl/perspective.panel/perspective.panel.view',
  'csui/utils/contexts/perspective/perspective.context',
  'csui/utils/contexts/factories/application.scope.factory',
  'csui/utils/contexts/factories/next.node',
  './perspective.panel.mock.js', 'csui/lib/jquery.mockjax'
], function (_, $, PerspectivePanelView, PerspectiveContext,
    ApplicationScopeModelFactory, NextNodeModelFactory, mock, mockjax) {
  'use strict';

  describe('PerspectivePanelView', function () {
    var perspectiveContext, applicationScope, nextNode, mockjaxLogging;

    function ensurePerspective() {
      if (!perspectiveContext) {
        perspectiveContext = new PerspectiveContext({
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
        applicationScope = perspectiveContext.getModel(ApplicationScopeModelFactory);
        nextNode = perspectiveContext.getModel(NextNodeModelFactory);
        var perspectivePanelView = new PerspectivePanelView({
          context: perspectiveContext
        });
        perspectivePanelView.render();
      }
    }

    function reloadPerspective() {
      perspectiveContext = undefined;
      ensurePerspective();
    }

    beforeAll(function () {
      mockjaxLogging = $.mockjaxSettings.logging;
      $.mockjaxSettings.logging = true;

      mock.enable();
    });

    afterAll(function () {
      mock.disable();

      $.mockjaxSettings.logging = mockjaxLogging;
    });

    beforeEach(function () {
      ensurePerspective();
    });

    it('loading the default landing page makes 7 server calls', function (done) {
      var initialMockedCalls = mockjax.mockedAjaxCalls().length,
          contextSynced = $.Deferred();
      perspectiveContext.once('sync', contextSynced.resolve);
      perspectiveContext.fetchPerspective();
      contextSynced.done(function () {
        setTimeout(function () {
          var finalMockedCalls = mockjax.mockedAjaxCalls().length;
          expect(finalMockedCalls - initialMockedCalls)
              .toBe(7, '7 server calls should follow');
          done();
        }, 300);
      });
    }, 5000);

    it('switching to the default container page makes 5 server calls', function (done) {
      var initialMockedCalls = mockjax.mockedAjaxCalls().length,
          contextSynced = $.Deferred();
      perspectiveContext.once('sync', contextSynced.resolve);
      nextNode.set({id: 2000});
      contextSynced.done(function () {
        setTimeout(function () {
          var finalMockedCalls = mockjax.mockedAjaxCalls().length;
          expect(finalMockedCalls - initialMockedCalls)
              .toBe(5, '5 server calls should follow:');
          done();
        }, 300);
      });
    }, 5000);

    it('reloading the default container page makes 8 server calls', function (done) {
      var initialMockedCalls = mockjax.mockedAjaxCalls().length,
          contextSynced = $.Deferred();
      reloadPerspective();
      perspectiveContext.once('sync', contextSynced.resolve);
      nextNode.set({id: 2000});
      contextSynced.done(function () {
        setTimeout(function () {
          var finalMockedCalls = mockjax.mockedAjaxCalls().length;
          expect(finalMockedCalls - initialMockedCalls)
              .toBe(8, '8 server calls should follow:');
          done();
        }, 300);
      });
    }, 5000);
  });
});
