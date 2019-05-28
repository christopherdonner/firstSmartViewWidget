/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

csui.require.config({
  config: {
    "csui/utils/contexts/browsing/browsing.context": {
      "extensions": {
        "test": [
          "test-browsing.context.plugin"
        ]
      }
    }
  }
});

define('test-browsing.context.plugin', [
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
  'csui/utils/contexts/browsing/browsing.context',
  'csui/utils/contexts/factories/application.scope.factory'
], function (BrowsingContext, ApplicationScopeModelFactory) {
  'use strict';

  describe('BrowsingContext', function () {
    it('supports plugins', function () {
      var context = new BrowsingContext();
      expect(context.hasModel(ApplicationScopeModelFactory)).toBeTruthy();
    });
  });
});
