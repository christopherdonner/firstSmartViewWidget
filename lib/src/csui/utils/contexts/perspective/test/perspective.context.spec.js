/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery',
  'csui/utils/contexts/perspective/perspective.context',
  'csui/utils/contexts/factories/application.scope.factory',
  'csui/utils/contexts/factories/next.node',
  'csui/utils/contexts/factories/factory',
  './perspective.context.mock.js'
], function (_, $, PerspectiveContext, ApplicationScopeModelFactory,
    NextNodeModelFactory, Factory, mock) {
  'use strict';


  describe('PerspectiveContext', function () {

    var TestObjectFactory = Factory.extend({

      propertyPrefix: 'test',

      constructor: function TestObjectFactory(context, options) {
        Factory.prototype.constructor.apply(this, arguments);

        this.property = {};
      }

    });

    var perspectiveContext, fetchSpy, applicationScope, nextNode;

    beforeAll(function () {
      mock.clear();
      mock.enable();
    });

    afterAll(function () {
      mock.disable();
    });

    beforeEach(function () {
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
      fetchSpy = spyOn(perspectiveContext, 'fetch');
      fetchSpy.and.callThrough();
    });

    it('retains the internal contextual objects when the perspective is changed',
        function () {
          var initialFactoryCount = _.keys(perspectiveContext._factories).length;
          perspectiveContext.getObject(TestObjectFactory);
          var fullFactoryCount = _.keys(perspectiveContext._factories).length;
          perspectiveContext.clear();
          var clearedFactoryCount = _.keys(perspectiveContext._factories).length;
          expect(fullFactoryCount)
              .toBe(initialFactoryCount + 1, 'Model count in context before clear');
          expect(clearedFactoryCount)
              .toBe(initialFactoryCount, 'Model count in context after clear');
        });

    it('loads the landing page perspective when given no node', function (done) {
      perspectiveContext.once('change:perspective', function () {
        var landingPage = perspectiveContext.perspective.get('landing.page');
        expect(landingPage).toBeTruthy();
        done();
      });
      perspectiveContext.fetchPerspective();
    });

    it('loads the node perspective when the context points to a node', function (done) {
      perspectiveContext.once('change:perspective', function () {
        var node50 = perspectiveContext.perspective.get('node.50');
        expect(node50).toBeTruthy();
        done();
      });
      nextNode.set('id', 50);
    });

    it('opening another container, which has the same perspective as the current one, ' +
       'does not change the current perspective, but just re-fetches the data',
        function (done) {
          perspectiveContext.once('change:perspective', function () {
            perspectiveContext
                .once('change:perspective', function () {
                  fail('Perspective should not change');
                })
                .once('sync', function () {
                  expect(fetchSpy).toHaveBeenCalled();
                  done();
                });
            nextNode.set('id', 60);
          });
          nextNode.set('id', 50);
        });

    it('opening another container, which has a different perspective that the current one, ' +
       'change the current perspective, and does not re-fetchs the data',
        function (done) {
          perspectiveContext.once('change:perspective', function () {
            var perspectiveChanged;
            perspectiveContext.once('change:perspective', function () {
              expect(fetchSpy).not.toHaveBeenCalled();
              done();
            });
            nextNode.set('id', 70);
          });
          nextNode.set('id', 50);
        });

    it('going back from a node to the initial state loads the landing page',
        function (done) {
          var perspectiveChanged;
          perspectiveContext.once('change:perspective', function () {
            perspectiveContext.once('change:perspective', function () {
              var landingPage = perspectiveContext.perspective.get('landing.page');
              expect(landingPage).toBeTruthy();
              done();
            });
            applicationScope.set('id', '');
          });
          nextNode.set('id', 50);
        });

    describe('handles server errors well', function () {

      beforeAll(function () {
        mock.disable();
        mock.enableErrors();
      });
      xit('when loading the landing page', function (done) {
        perspectiveContext.once('error:perspective', function (error) {
          expect(error).toBeDefined();
          done();
        });
        applicationScope.clear({silent: true});
        applicationScope.set('id', '');
      });

      it('when loading a node perspective', function (done) {
        perspectiveContext.once('error:perspective', function (error) {
          expect(error).toBeDefined();
          done();
        });
        nextNode.set('id', 10);
      });

    });

  });

});
