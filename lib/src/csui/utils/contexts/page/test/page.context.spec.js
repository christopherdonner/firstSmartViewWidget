/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

csui.require.config({
  config: {
    "csui/utils/contexts/page/page.context": {
      "extensions": {
        "test": [
          "test-page.context.plugin"
        ]
      }
    }
  }
});

define('test-page.context.plugin', [
  'csui/utils/contexts/context.plugin',
  'csui/utils/contexts/factories/application.scope.factory'
], function (ContextPlugin, ApplicationScopeModelFactory) {
  'use strict';

  var TestContextPlugin = ContextPlugin.extend({
    constructor: function TestContextPlugin(options) {
      ContextPlugin.prototype.constructor.apply(this, arguments);
      this.applicationScope = this.context.getModel(ApplicationScopeModelFactory);
    }
  });

  return TestContextPlugin;
});

define([
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/contexts/page/page.context',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/application.scope.factory'
], function (_, $, PageContext, Factory, ApplicationScopeModelFactory) {
  'use strict';

  describe('PageContext', function () {
    var fetchSpy, destroySpy;

    var FetchableObjectFactory = Factory.extend({
      propertyPrefix: 'fetchable',

      constructor: function FetchableObjectFactory(context, options) {
        Factory.prototype.constructor.apply(this, arguments);

        this.property = {};

        fetchSpy = spyOn(this, 'fetch');
        fetchSpy.and.callThrough();
        destroySpy = spyOn(this, 'destroy');
        destroySpy.and.callThrough();
      },

      fetch: function () {
        var self = this,
          deferred = $.Deferred();
        setTimeout(function () {
          self.property.fetched = true;
          deferred.resolve();
        }, 1);
        return deferred.promise();
      }
    });

    var NonFetchableObjectFactory = Factory.extend({
      propertyPrefix: 'non-fetchable',

      constructor: function NonFetchableObjectFactory(context, options) {
        Factory.prototype.constructor.apply(this, arguments);

        this.property = {};
      }
    });

    var pageContext, fetchableObject;

    beforeEach(function () {
      pageContext = new PageContext();
      fetchableObject = pageContext.getObject(FetchableObjectFactory);
    });

    it('supports plugins', function () {
      var context = new PageContext();
      expect(context.hasModel(ApplicationScopeModelFactory)).toBeTruthy();
    });

    it('offers method aliases to get contextual objects of different kinds', function () {
      var method1 = PageContext.prototype.getObject,
          method2 = PageContext.prototype.getModel,
          method3 = PageContext.prototype.getCollection;
      expect(method1).toBe(method2);
      expect(method1).toBe(method3);
    });

    it('creates one contextual object for one factory class requested multiple times', function () {
      var fetchableObject2 = pageContext.getObject(FetchableObjectFactory);
      expect(fetchableObject).toBe(fetchableObject2);
    });

    it('fetches only fetchable objects', function () {
      pageContext.getModel(NonFetchableObjectFactory);
      pageContext.fetch();
      expect(fetchSpy).toHaveBeenCalled();
    });

    it('waits for the contextual objects until they are fetched', function (done) {
      expect(fetchableObject.fetched).toBeFalsy();

      pageContext.fetch().then(function() {
        expect(fetchableObject.fetched).toBeTruthy();
        done();
      });
    });

    it('removes object factories when being cleared', function () {
      var property1 = pageContext.getObject(NonFetchableObjectFactory);
      pageContext.clear();
      var property2 = pageContext.getObject(NonFetchableObjectFactory);
      expect(property1).not.toBe(property2);
    });

    it('destroys object factories when being cleared', function () {
      pageContext.clear();
      expect(destroySpy).toHaveBeenCalled();
    });
  });
});
