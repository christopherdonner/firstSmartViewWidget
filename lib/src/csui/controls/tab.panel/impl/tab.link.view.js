/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/marionette',
  'hbs!csui/controls/tab.panel/impl/tab.link',
  'csui/lib/binf/js/binf',
  'csui/utils/handlebars/l10n' // support {{csui-l10n ...}}
], function (_, Marionette, tabLinkTemplate) {
  'use strict';

  var TabLinkView = Marionette.ItemView.extend({

    tagName: 'li',

    className: function () {
      return this._isOptionActiveTab() ? 'binf-active' : '';
    },

    attributes: function () {
      var uniqueTabId = this.model.get('uniqueTabId');
      var title = this.model.get('title');
      var attrs = {
        id: 'tablink-' + uniqueTabId,
        role: 'tab',
        'aria-controls': uniqueTabId
      };
      this._isOptionActiveTab() && _.extend(attrs, {'aria-selected': 'true'});
      return attrs;
    },

    template: tabLinkTemplate,

    events: {
      'show.binf.tab > a': 'onShowingTab',
      'shown.binf.tab > a': 'onShownTab'
    },

    ui: {
      link: '>a'
    },

    constructor: function TabLinkView() {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },

    _isOptionActiveTab: function () {
      var active = false;
      var activeTabIndex = 0;
      if (this.options.activeTab && this.options.activeTab.get('tabIndex') !== undefined) {
        activeTabIndex = this.options.activeTab.get('tabIndex');
      }
      activeTabIndex = Math.max(0, activeTabIndex);
      this.model === this.model.collection.at(activeTabIndex) && (active = true);
      return active;
    },

    activate: function () {
      this.$el.removeClass("binf-active").removeAttr('aria-selected');
      this.ui.link.binf_tab('show');
    },

    isActive: function () {
      return this.$el.hasClass('binf-active');
    },

    onShowingTab: function (event) {
      this.triggerMethod('before:activate:tab', this);
    },

    onShownTab: function (event) {
      var index = this.model.collection.indexOf(this.model);
      this.options.activeTab && this.options.activeTab.set('tabIndex', index);
      this.triggerMethod('activate:tab', this);
    }

  });

  return TabLinkView;

});
