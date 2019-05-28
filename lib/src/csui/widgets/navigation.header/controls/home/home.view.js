/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'i18n!csui/widgets/navigation.header/controls/home/impl/nls/localized.strings',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/utils/contexts/factories/application.scope.factory',
  'hbs!csui/widgets/navigation.header/controls/home/impl/home'
], function(_, $, Marionette, localizedStrings, TabableRegionBehavior,
    ApplicationScopeModelFactory, template) {
  'use strict';

  var HomeView = Marionette.ItemView.extend({
    tagName: 'a',

    className: 'csui-home binf-hidden',

    attributes: {
      href: '#',
      title: localizedStrings.HomeIconTitle,
      'aria-label': localizedStrings.HomeIconAria
    },

    ui: {
      homeButton: '.csui-icon-home'
    },

    events: {
      'click .csui-icon-home': 'onClickHomeIcon'
    },

    template: template,

    templateHelpers: function () {
      return {
        title: localizedStrings.HomeIconTitle
      };
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    currentlyFocusedElement: function () {
      return this.$el;
    },

    constructor: function HomeView(options) {
      Marionette.ItemView.call(this, options);
      this.listenTo(options.context, 'sync error', this._toggleVisibility);
      this.applicationScope = options.context.getModel(ApplicationScopeModelFactory);
      this.listenTo(this, 'click:home', this._onClick);
    },

    onRender: function () {
      var self = this;
      this.$el.click(function () {
        self.triggerMethod('click:home');
      });
      this.$el.keydown(function (event) {
        if (event.keyCode === 32) {
          event.preventDefault();
          self.triggerMethod('click:home');
        }
      });

    },

    onClickHomeIcon:function(e){
      e.preventDefault();
    },

    _toggleVisibility: function () {
      if (this._isRendered) {
        if (!this.applicationScope.id) {
          this.$el.addClass('binf-hidden');
        } else {
          this.$el.removeClass('binf-hidden');
        }
      }
    },

    _onClick: function () {
      this.applicationScope.set('id', '');
    }
  });

  return HomeView;
});
