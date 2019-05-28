/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'hbs!csui/controls/table.rowselection.toolbar/impl/right.toolbar',
  'i18n!csui/controls/table.rowselection.toolbar/impl/nls/localized.strings',
  'css!csui/controls/table.rowselection.toolbar/impl/right.toolbar'
], function (_, $, Marionette, ViewEventsPropagationMixin, TabableRegionBehavior, template, lang) {
  'use strict';

  var RightToolbarView = Marionette.ItemView.extend({

    className: 'csui-right-toolbar-view',

    template: template,
    templateHelpers: function () {
      return {
        showCondensedHeaderToggle: this.options.showCondensedHeaderToggle,
        toggleCondensedHeaderTooltip: lang.showCondensedHeaderTooltip
      };
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    ui: {
      condensedHeaderToggleButton: '.csui-condensed-header-toggle',
      condensedHeaderToggleIcon: '.icon-condensed-header'
    },

    events: {
      'keydown': 'onKeyInView',
      'click .csui-condensed-header-toggle-container': 'onClickCondensedHeaderToggle'
    },

    constructor: function RightToolbarView(options) {
      options || (options = {});
      Marionette.ItemView.prototype.constructor.call(this, options);
      this._toolbarVisible = false;
    },

    onRender: function () {
      this.delegateEvents();
    },

    onToolbarActivity: function (toolbarVisible, headerVisible) {
      this._toolbarVisible = toolbarVisible;
      if (this.options.showCondensedHeaderToggle) {
        this.ui.condensedHeaderToggleButton.attr('tabindex', toolbarVisible ? '0' : '-1');
        if (headerVisible) {
          this.ui.condensedHeaderToggleIcon.addClass('icon-rotate180');
          this.ui.condensedHeaderToggleButton.attr('aria-label', lang.hideCondensedHeaderTooltip);
          this.ui.condensedHeaderToggleButton.attr('title', lang.hideCondensedHeaderTooltip);
        } else {
          this.ui.condensedHeaderToggleIcon.removeClass('icon-rotate180');
          this.ui.condensedHeaderToggleButton.attr('aria-label', lang.showCondensedHeaderTooltip);
          this.ui.condensedHeaderToggleButton.attr('title', lang.showCondensedHeaderTooltip);
        }
      }
    },

    onClickCondensedHeaderToggle: function (event) {
      this.trigger('toggle:condensed:header');
      this.ui.condensedHeaderToggleButton.focus();
    },

    currentlyFocusedElement: function () {
      if (this._toolbarVisible) {
        return this.ui.condensedHeaderToggleButton;
      } else {
        return $();
      }
    },

    onKeyInView: function (event) {
      if (event.keyCode === 32 || event.keyCode === 13) {  // space or enter key
        event.preventDefault();
        event.stopPropagation();
        $(event.target).click();
      }
    }

  });

  _.extend(RightToolbarView.prototype, ViewEventsPropagationMixin);

  return RightToolbarView;

});
