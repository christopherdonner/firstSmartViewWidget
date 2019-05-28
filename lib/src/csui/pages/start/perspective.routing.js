/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  'module', 'csui/lib/underscore', 'csui/lib/backbone', 'csui/utils/url',
  'csui/pages/start/impl/perspective.router',
  'csui/pages/start/impl/landing.perspective.router',
  'csui-ext!csui/pages/start/perspective.routing'
], function (module, _, Backbone, Url, PerspectiveRouter,
    LandingPerspectiveRouter, extraRouters) {
  'use strict';
  var instance,
      config = _.extend({
    developmentPage: !PerspectiveRouter.routesWithSlashes(),
    handlerUrlPathSuffix: '/app',
    rootUrlPath: null
  }, module.config());

  function PerspectiveRouting(options) {
    var Routers = _
            .chain(extraRouters)
            .flatten(true)
            .concat([LandingPerspectiveRouter])
            .unique()
            .reverse()
            .value(),
        routeWithSlashes = PerspectiveRouting.routesWithSlashes();
    this._routers = _.map(Routers, function (Router) {
      var router = new Router(_.extend({
        routeWithSlashes: routeWithSlashes
      }, options));
      router.on('before:route', _.bind(this._informOthers, this));
      return router;
    }, this);

    this._context = options.context;
    this._originalHistoryLength = history.length;
  }

  _.extend(PerspectiveRouting.prototype, Backbone.Events, {

    start: function () {
      var historyOptions;
      if (PerspectiveRouting.routesWithSlashes()) {
        historyOptions = {
          pushState: true,
          root: config.rootUrlPath != null && config.rootUrlPath ||
                Url.combine(
                  new Url(new Url(location.pathname).getCgiScript()).getPath(),
                  config.handlerUrlPathSuffix)
        };
      } else {
        historyOptions = {
          root: location.pathname
        };
      }
      Backbone.history.start(historyOptions);
    },

    hasRouted: function () {
      return history.length > this._originalHistoryLength;
    },

    _informOthers: function (akceptor) {
      _.each(this._routers, function (router) {
        if (router !== akceptor) {
          router.trigger('other:route', router, akceptor);
        }
      });
    }
  });

  PerspectiveRouting.routesWithSlashes = PerspectiveRouter.routesWithSlashes;

  return {
    getInstance: function (options) {
      if (!instance) {
        instance = new PerspectiveRouting(options);
      }
      return instance;
    },
    routesWithSlashes: PerspectiveRouter.routesWithSlashes
  };
});
