/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['csui/lib/underscore', 'csui/lib/marionette', 'csui/utils/base',
  'hbs!csui/controls/tab.panel/impl/tab.links',
  'csui/controls/tab.panel/impl/tab.link.view',
  'csui/controls/tab.panel/behaviors/tab.links.keyboard.behavior',
  'csui/lib/binf/js/binf'
], function (_, Marionette, base, tabLinksTemplate, TabLinkView,
    TabLinksKeyboardBehavior) {
  'use strict';

  var TabLinkCollectionView = Marionette.CompositeView.extend({

    className: function () {
      var ret = 'tab-links';
      if (this.options.mode === 'spy') {
        ret += ' scrollspy';
      }
      return ret;
    },

    childViewOptions: function (model, index) {
      return _.extend(this.options, {
        index: index,
        activeTab: this.options.activeTab
      });
    },

    template: tabLinksTemplate,
    templateHelpers: function () {
      return {
        tab_type: this.tabType
      };
    },

    childView: TabLinkView,
    childViewContainer: function () {
      return '>.' + this.tabType;
    },

    behaviors: {
      TabLinksKeyboardBehavior: {
        behaviorClass: TabLinksKeyboardBehavior
      }
    },

    constructor: function TabLinkCollectionView(options) {
      this.tabType = options.tabType || 'binf-nav-tabs';
      Marionette.CompositeView.prototype.constructor.apply(this, arguments);
      this.listenTo(this.options.activeTab, 'change:tabIndex', this._updateActiveTab);
    },

    onChildviewActivateTab: function (childView) {
      this.children.each(function (view) {
        if (view.el.hasAttribute('aria-selected') !== undefined) {
          view.$el.removeAttr('aria-selected');
        }
      });
      childView.$el.attr('aria-selected', 'true');
    },

    _updateActiveTab: function () {
      var tabIndex = this.options.activeTab.get('tabIndex'),
          linkView = this.children.findByIndex(tabIndex);
      if (linkView) {
        if (tabIndex === linkView._index) {
          if (!linkView.isActive()) {
            linkView.activate();
          }
        }
      } else {
        tabIndex = 0;
        this.children.find(function (linkView, index) {
          if (linkView.isActive()) {
            tabIndex = index;
            return true;
          }
        });
        this.options.activeTab.set('tabIndex', tabIndex);
      }
    },
    _isTablinkVisibleInParents: function ($el, options) {
      var levels = options && options.levels || 3;
      var percentX = options && options.percentX || 100;
      var percentY = options && options.percentY || 100;
      return base.isElementVisibleInParents($el, levels, percentX, percentY);
    },
    deleteTabById: function (tabId) {
      return;
    }

  });

  return TabLinkCollectionView;

});
