/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/utils/log',
  'csui/utils/contexts/factories/user',
  'csui/utils/contexts/factories/application.scope.factory',
  'csui/utils/contexts/perspective/perspective.context.plugin',
  'csui/utils/contexts/perspective/landing.perspectives'
], function (_, log, UserModelFactory, ApplicationScopeModelFactory,
    PerspectiveContextPlugin, landingPerspectives) {
  'use strict';

  var LandingPerspectiveContextPlugin = PerspectiveContextPlugin.extend({

    constructor: function LandingPerspectiveContextPlugin(options) {
      PerspectiveContextPlugin.prototype.constructor.apply(this, arguments);

      this.applicationScope = this.context
          .getModel(ApplicationScopeModelFactory)
          .on('change', this._fetchLandingPerspective, this);
      this.userFactory = this.context.getFactory(UserModelFactory);
      this.user = this.userFactory.property;
    },

    _fetchLandingPerspective: function () {
      if (this.applicationScope.id) {
        return;
      }
      this.context.triggerMethod('request:perspective', this);
      this.userFactory.fetch({
        success: _.bind(this._changePerspective, this, this.user),
        error: _.bind(this.context.rejectPerspective, this.context)
      });
    },

    _changePerspective: function (sourceModel) {
      var perspectiveModule,
          perspective = landingPerspectives.findByUser(sourceModel);
      if (_.isEmpty(sourceModel.get('perspective')) || perspective.get('important')) {
        perspectiveModule = perspective.get('module');
      }
      if (perspectiveModule) {
        return this.context.overridePerspective(sourceModel, perspectiveModule);
      }
      this.context.applyPerspective(sourceModel);
    }

  });

  return LandingPerspectiveContextPlugin;

});
