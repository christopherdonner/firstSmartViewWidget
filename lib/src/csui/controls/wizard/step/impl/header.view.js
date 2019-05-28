/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'hbs!csui/controls/wizard/step/impl/step.header',
  'i18n!csui/controls/wizard/impl/nls/lang',
  'css!csui/controls/wizard/impl/wizard'
], function (_, $, Marionette, TabableRegion, headerTemplate, lang) {

  var WizardStepHeaderView = Marionette.ItemView.extend({

    template: headerTemplate,

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegion
      }
    },

    ui: {
      headerControl: '.cs-header-control'
    },

    events: {
      'keydown': 'onKeyInView'
    },

    templateHelpers: function () {
      return {
        iconLeft: this.options.iconLeft,
        actionIconLeft: this.options.actionIconLeft,
        imageLeftUrl: this.options.imageLeftUrl,
        imageLeftClass: this.options.imageLeftClass,
        title: this.options.title,
        showCloseBtn: this.options.showCloseBtn,
        iconRight: this.options.iconRight || 'cs-icon-cross',
        expandedHeader: this.options.expandedHeader,
        dialogCloseButtonTooltip: lang.dialogCloseButtonTooltip,
        dialogCloseAria: lang.dialogCloseAria
      };
    },

    constructor: function WizardStepHeaderView(options) {
      Marionette.View.prototype.constructor.apply(this, arguments);
    },

    isTabable: function () {
      return this.$('*[tabindex]').length > 0;
    },

    currentlyFocusedElement: function (event) {
      var tabElements = this.$('*[tabindex]');
      if (tabElements.length) {
        tabElements.prop('tabindex', 0);
      }
      if (!!event && event.shiftKey) {
        return $(tabElements[tabElements.length - 1]);
      } else {
        return $(tabElements[0]);
      }
    },

    onLastTabElement: function (shiftTab, event) {
      return (shiftTab && event.target === this.$('*[tabindex]')[0]);
    },

    onKeyInView: function (event) {
      var keyCode = event.keyCode;
      if (keyCode === 13 || keyCode === 32) {
        $(event.target).click();
      }
    },

    onRender: function () {
      var headers = this.options.headers || [];
      if (headers.length) {
        _.each(headers, function (header) {
          var $header = this._renderHeader(header);
          this.$el.append($header);
        }, this);
      }
      var headerControl = this.options.headerControl;
      if (headerControl) {
        this.ui.headerControl.append(headerControl.$el);
        headerControl.render();
        headerControl.trigger('dom:refresh');
      }

      if (!!this.options.actionIconLeft) {
        this._adjustTitleCSS();
      }
    },
    onDomRefresh: function () {
      var headerControl = this.options.headerControl;
      if (headerControl) {
        headerControl.triggerMethod('dom:refresh');
        headerControl.triggerMethod('after:show');
      }
    },

    _renderHeader: function (options) {
      var div = $('<div class="modal-header-item"></div>')
          .text(options.label);
      if (options.class) {
        div.addClass(options.class);
      }
      if (options.id) {
        div.attr("id", options.id);
      }
      return div;
    },

    _adjustTitleCSS: function (options) {
      this.$el.find('div.tile-title').addClass('tile-action-icon-tittle');
    }

  });

  return WizardStepHeaderView;
});
