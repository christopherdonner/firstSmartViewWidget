/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'require', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/marionette', 'csui/controls/globalmessage/globalmessage',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/widgets/navigation.header/navigation.header.controls',
  'hbs!csui/pages/start/impl/navigationheader/impl/navigationheader',
  'i18n!csui/pages/start/impl/nls/lang',
  'css!csui/pages/start/impl/navigationheader/impl/navigationheader',
  'csui/lib/jquery.when.all'
], function (require, _, $, Backbone, Marionette, GlobalMessage,
    LayoutViewEventsPropagationMixin, controls, template, lang) {
  'use strict';

  var NavigationHeaderView = Marionette.LayoutView.extend({
    template: template,

    regions: {
      messageRegion: '.csui-navbar-message'
    },

    ui: {
      branding: '.binf-navbar-brand',
      logo: '.csui-logo',
      left: '.binf-navbar-left',
      right: '.binf-navbar-right'
    },

    templateHelpers: function() {
      return {
        mainNavigationAria: lang.mainNavigationAria
      };
    },

    constructor: function NavigationHeaderView(options) {
      Marionette.LayoutView.call(this, options);
      this.propagateEventsToRegions();
    },

    onRender: function () {
      var context = this.options.context,
          self = this;

      GlobalMessage.setMessageRegionView(this, {classes: "csui-global-message"});

      var logoLocation = controls.logo.get('location');
      if (logoLocation === 'none') {
        this.ui.logo.addClass('binf-hidden');
      } else {
        this.ui.branding.addClass('csui-logo-' + logoLocation);
      }

      this._resolveComponents()
          .done(function () {
            self.trigger('before:render:controls', self);
            controls.leftSide.each(createControls.bind(self, self.ui.left));
            controls.rightSide.each(createControls.bind(self, self.ui.right));
            self.trigger('render:controls', self);
          });

      function createControls(target, control) {
        var View = control.get('view');
        if (View) {
          var el = $('<div>').addClass(control.get('parentClassName'))
                            .appendTo(target).attr('role', 'menuitem'),
              region = self.addRegion(_.uniqueId('csui:navigation.header.control'), {selector: el}),
              view = new View({
                context: context,
                parentView: self
              });
          region.show(view);
        }
      }
    },

    _resolveComponents: function () {
      if (this._controlsResolved) {
        return this._controlsResolved;
      }

      function resolveControl(name) {
        var deferred = $.Deferred();
        require([name], deferred.resolve, deferred.reject);
        return deferred.promise();
      }

      var allComponents = controls.leftSide.models.concat(controls.rightSide.models),
          promises = allComponents.map(function (control) {
                                    return resolveControl(control.id);
                                  }),
          deferred = $.Deferred();
      $.whenAll.apply($, promises)
               .always(function (views) {
                 views.forEach(function (view, index) {
                   allComponents[index].set('view', view);
                 });
                 deferred.resolve();
               });
      this._controlsResolved = deferred.promise();
      return this._controlsResolved;
    }
  });

  _.extend(NavigationHeaderView.prototype, LayoutViewEventsPropagationMixin);

  return NavigationHeaderView;
});
