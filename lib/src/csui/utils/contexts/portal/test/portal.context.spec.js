/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

csui.require.config({
  config: {
    "csui/utils/contexts/portal/portal.context": {
      "extensions": {
        "test": [
          "test-portal.context.plugin"
        ]
      }
    }
  }
});

define('test-portal.context.plugin', [
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
  'csui/utils/contexts/portal/portal.context',
  'csui/utils/contexts/factories/application.scope.factory'
], function (PortalContext, ApplicationScopeModelFactory) {
  'use strict';

  describe('PortalContext', function () {
    it('supports plugins', function () {
      var context = new PortalContext();
      expect(context.hasModel(ApplicationScopeModelFactory)).toBeTruthy();
    });
  });
});
