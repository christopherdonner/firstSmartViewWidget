/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['require', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/utils/base', 'csui/utils/log', 'csui/utils/contexts/context',
  'csui/utils/contexts/factories/user',
  'csui/utils/contexts/factories/application.scope.factory',
  'csui/utils/contexts/perspective/impl/landing.perspective.context.plugin',
  'csui/utils/contexts/perspective/perspective.guide',
  'csui-ext!csui/utils/contexts/perspective/perspective.context'
], function (require, _, $, Backbone, base, log, Context,
    UserModelFactory, ApplicationScopeModelFactory,
    LandingPerspectiveContextPlugin, PerspectiveGuide, contextPlugins) {
  'use strict';

  var PerspectiveContext = Context.extend({

    constructor: function PerspectiveContext() {
      Context.prototype.constructor.apply(this, arguments);

      _.defaults(this.options, {online: true});

      this.perspective = new Backbone.Model();
      this.perspectiveGuide = new PerspectiveGuide();
      this._applicationScope = this.getModel(ApplicationScopeModelFactory, {
        permanent: true,
        detached: true
      });

      if (this.options.online) {
        this._user = this.getModel(UserModelFactory, {
          options: {
            includeResources: ['perspective']
          },
          permanent: true
        });
      }
      var Plugins = _
          .chain(contextPlugins)
          .flatten(true)
          .concat([LandingPerspectiveContextPlugin])
          .unique()
          .reverse()
          .value();
      this._plugins = _.map(Plugins, function (Plugin) {
        return new Plugin({context: this});
      }, this);
    },
    fetchPerspective: function () {
      var landingPerspectivePlugin = _.find(this._plugins, function (plugin) {
        return plugin instanceof LandingPerspectiveContextPlugin;
      });
      landingPerspectivePlugin._fetchLandingPerspective();
      return this;
    },

    _destroyNonPermanentFactories: function () {
      Context.prototype._destroyNonPermanentFactories.apply(this, arguments);
      _.invoke(this._plugins, 'onClear');
    },

    _isFetchable: function (factory) {
      return Context.prototype._isFetchable.apply(this, arguments) &&
             (factory.property !== this._user || !this._user.get('id')) &&
             _.all(this._plugins, function (plugin) {
               return plugin.isFetchable(factory) !== false;
             });
    },

    loadPerspective: function (perspectiveModule) {
      var deferred = $.Deferred(),
          self     = this;
      log.debug('Using perspective from "{0}".', perspectiveModule) &&
      console.log(log.last);
      this.triggerMethod('request:perspective', this.context);
      this.loadingPerspective = deferred.promise();
      require([perspectiveModule], function (perspective) {
        var wrapperModel = new Backbone.Model({perspective: perspective});
        self.loadingPerspective = false;
        self.applyPerspective(wrapperModel);
      }, function (error) {
        self.loadingPerspective = false;
        self.rejectPerspective(error);
      });
    },

    overridePerspective: function (sourceModel, perspectiveModule) {
      var self = this;
      log.debug('Overriding the perspective in {0} with "{1}".',
          log.getObjectName(sourceModel), perspectiveModule) &&
      console.log(log.last);
      return require([perspectiveModule], function (perspective) {
        sourceModel.set('perspective', perspective);
        self.applyPerspective(sourceModel);
      }, _.bind(this.rejectPerspective, this));
    },

    applyPerspective: function (sourceModel) {
      this.triggerMethod('sync:perspective', this, sourceModel);
      var newPerspective = sourceModel.get('perspective') || {};
      if (this.perspectiveGuide.isNew(this.perspective.attributes, newPerspective)) {
        this.triggerMethod('before:change:perspective', this, sourceModel);
        log.info('Perspective has changed') && console.log(log.last);
        this.perspective.clear();
        this.perspective.set(newPerspective);
        this.triggerMethod('change:perspective', this, sourceModel);
      } else {
        var self = this;
        log.info('Perspective has not changed') && console.log(log.last);
        this._destroyTemporaryFactories();
        _.invoke(this._plugins, 'onRefresh');
        this
            .fetch()
            .fail(function (error) {
              self.rejectPerspective(sourceModel, error);
            });
      }
    },

    rejectPerspective: function (sourceModel, error) {
      var self = this;

      if (!error) {
        error = sourceModel;
      }
      if (!(error instanceof Error)) {
        error = new base.Error(error);
      }
      this.triggerMethod('error:perspective', this, error);

      function informFailure() {
        self._informFailure(error)
            .then(function () {
              self.trigger('reject:perspective');
            });
      }

      if (sourceModel && sourceModel instanceof Backbone.Model) {
        sourceModel.set('id', -1, {silent: true});
        self.trigger('current:folder:changed', sourceModel);

        var errorPage = 'json!csui/utils/contexts/perspective/impl/perspectives/error.global.json';
        require([errorPage], function (perspective) {
          log.debug('Showing error page perspective for {0} with "{1}".',
              log.getObjectName(sourceModel), errorPage) &&
          console.log(log.last);

          sourceModel.set('perspective', perspective, {silent: true});
          sourceModel.set('serverError', error.toString(), {silent: true});

          self.applyPerspective(sourceModel);

        }, function () {
          informFailure();
        });
      } else {
        informFailure();
      }
    },

    _informFailure: function (error) {
      var errorHandled = false,
          deferred     = $.Deferred();
      if (error.statusCode === 0) {
        errorHandled = _.find(this._plugins, function (plugin) {
          if (plugin.offlineErrorHandler) {
            return plugin.offlineErrorHandler(error);
          }
        });
      }

      if (!errorHandled) {
        require(['csui/dialogs/modal.alert/modal.alert'], function (alertDialog) {
          alertDialog.showError(error.toString())
              .always(deferred.resolve);
        });
      }
      return deferred.promise();
    }

  });

  return PerspectiveContext;

});
