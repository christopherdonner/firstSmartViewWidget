/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette', 'csui/utils/base',
  'csui/utils/contexts/factories/node', 'csui/utils/contexts/factories/application.scope.factory',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'hbs!csui/widgets/error.global/impl/error.global',
  'i18n!csui/widgets/error.global/impl/nls/lang',
  'css!csui/widgets/error.global/impl/error.global'
], function (_, $, Marionette, base, NodeModelFactory, ApplicationScopeModelFactory,
    TabableRegionBehavior, template, lang) {

  var GlobalErrorView = Marionette.ItemView.extend({

    className: 'csui-global-error',

    template: template,
    templateHelpers: function () {
      return {
        errorMessage: lang.errorMessage,
        backText: lang.backText,
        backTooltip: lang.backTooltip,
        homeText: lang.homeText,
        homeTooltip: lang.homeTooltip
      };
    },

    TabableRegion: {
      behaviorClass: TabableRegionBehavior,
      initialActivationWeight: 100
    },

    ui: {
      errorMessage: '.error-message > span'
    },

    events: {
      'keydown': 'onKeyInView',
      'click .go-home-button': 'onClickHome',
      'click .go-home-text': 'onClickHome',
      'click .go-back-button': 'onClickBack',
      'click .go-back-text': 'onClickBack'
    },

    constructor: function GlobalErrorView(options) {
      options || (options = {});
      Marionette.ItemView.prototype.constructor.apply(this, arguments);

      if (options.context) {
        if (!this.model) {
          this.model = options.context.getModel(NodeModelFactory, options);
        }
        this.applicationScope = options.context.getModel(ApplicationScopeModelFactory);
      }
      if (base.isIE11()) {
        var self = this;
        var resizeHandler = function () {
          self.render();
        };
        $(window).bind('resize', resizeHandler);
        this.once('before:destroy', function () {
          $(window).unbind('resize', resizeHandler);
        });
      }
    },

    currentlyFocusedElement: function (event) {
      return this.ui.errorMessage;
    },

    onKeyInView: function (event) {
      if (event.keyCode === 32 || event.keyCode === 13) {
        event.preventDefault();
        event.stopPropagation();
        $(event.target).click();
      }
    },

    onClickHome: function (event) {
      event.preventDefault();
      event.stopPropagation();
      this.applicationScope && this.applicationScope.set('id', '');
    },

    onClickBack: function (event) {
      event.preventDefault();
      event.stopPropagation();
      window.history.back();
    }

  });

  return GlobalErrorView;
});
