/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'require', 'csui/lib/underscore'
], function (module, require, _) {
  'use strict';

  var config = _.extend({
    developmentPage: false
  }, module.config());

  function PerspectiveRouter(options) {
    require(['csui/pages/start/perspective.routing'], function (PrespectiveRouting) {
      var routing = new PrespectiveRouting(options);
    });
  }

  PerspectiveRouter.routesWithSlashes = function () {
    return /\/app(?:\/.*)?$/.test(location.pathname) || !config.developmentPage;
  };

  return PerspectiveRouter;

});
