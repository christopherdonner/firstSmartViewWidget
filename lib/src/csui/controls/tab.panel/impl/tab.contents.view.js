/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/controls/tab.panel/impl/tab.content.view',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
  'csui/controls/tab.panel/behaviors/tab.contents.keyboard.behavior',
  'csui/controls/tab.panel/behaviors/tab.contents.proxy.keyboard.behavior',
  'csui/lib/binf/js/binf'
], function (_, $, Marionette, TabContentView, ViewEventsPropagationMixin,
    TabContentKeyboardBehavior, TabContentProxyKeyboardBehavior) {
  "use strict";

  var TabContentCollectionView = Marionette.CollectionView.extend({

    className: 'binf-tab-content',

    childView: TabContentView,
    childViewOptions: function (model, index) {
      return _.extend(this.options, {
        index: index,
        activeTab: this.options.activeTab
      });
    },
    behaviors: {},

    defaults: {
      implementTabContentsDefaultKeyboardHandling: true,
      tabContentAccSelectors: 'a[href], area[href], input:not([disabled]),' +
                              ' select:not([disabled]), textarea:not([disabled]),' +
                              ' button:not([disabled]), iframe, object, embed,' +
                              ' *[tabindex], *[data-cstabindex], *[contenteditable]'
    },

    constructor: function TabContentCollectionView(options) {
      _.defaults(options, this.defaults);
      if (options.implementTabContentsDefaultKeyboardHandling) {
        this.behaviors = _.extend({
          TabContentKeyboardBehavior: {
            behaviorClass: TabContentKeyboardBehavior
          }
        }, this.behaviors);
      } else if (options.implementTabContentsDefaultKeyboardHandling === false) {
        this.behaviors = _.extend({
          TabContentProxyKeyboardBehavior: {
            behaviorClass: TabContentProxyKeyboardBehavior
          }
        }, this.behaviors);
      }

      Marionette.CollectionView.prototype.constructor.apply(this, arguments);
      this.reactToChildEvent = false;

      this.listenTo(this, 'add:child', this.propagateEventsToViews);
    },

    onBeforeDestroy: function () {
      this.reactToChildEvent = false;
    },

    onRender: function () {
      this.reactToChildEvent = true;
      this._setLastTabCssClass();
      if (this.options.mode === 'spy') {
        var targetSelector = '.tab-links.scrollspy';
        if (this.options && this.options.tabPanel && this.options.tabPanel.$el) {
          var id = this.options.tabPanel.$el.attr('id');
          if (id !== undefined) {
            targetSelector = '#' + id + ' ' + targetSelector;
          }
        }
        this.$el.binf_scrollspy({target: targetSelector});
      }
    },

    onReorder: function () {
      this._setLastTabCssClass();
    },

    onAddChild: function (childView) {
      this._setLastTabCssClass();
    },

    onRemoveChild: function (childView) {
      this._setLastTabCssClass();
    },

    _setLastTabCssClass: function () {
      if (this.reactToChildEvent !== true) {
        return;
      }

      var cssClass = 'last-tab-panel';
      this.children.each(function (view) {
        if (view.$el.hasClass(cssClass)) {
          view.$el.removeClass(cssClass);
        }
      });
      if (this.children.length > 1) {
        var lastChildView = this.getLastVisibleChild(this.collection.length - 1);
        lastChildView && lastChildView.$el.addClass(cssClass);
      }
    },
    getLastVisibleChild: function (index) {
      var lastModel = this.collection.at(index);
      if (lastModel) {
        var lastChildView = this.children.findByModel(lastModel);
        if (lastChildView && !lastChildView.$el.hasClass('binf-hidden')) {
          return lastChildView;
        } else {
          return this.getLastVisibleChild(index - 1);
        }
      }
      return;
    },

    getTabContentFirstFocusableELement: function (tabId) {
      var ret;
      if (tabId === undefined || this.options.searchTabContentForTabableElements !== true) {
        return ret;
      }
      var uTabId = tabId.charAt(0) === '#' ? tabId.slice(1) : tabId;
      var model = this.collection.findWhere({uniqueTabId: uTabId});
      if (model) {
        var tabPane = this.children.findByModel(model);
        var tabContent = tabPane.content;
        var tabElemId = 0;
        var elems = tabContent.$el.find(this.options.tabContentAccSelectors).filter(':visible');
        if (elems.length > 0) {
          var $currentElem = $(elems[tabElemId]);
          while (this.closestTabable && this.closestTabable($currentElem) === false) {
            tabElemId++;
            if (tabElemId >= elems.length) {
              tabElemId = -1;
              break;
            }
            $currentElem = $(elems[tabElemId]);
          }
          if (tabElemId >= 0 && tabElemId < elems.length) {
            ret = $currentElem;
          }
        }
      }
      return ret;
    }

  });

  _.extend(TabContentCollectionView.prototype, ViewEventsPropagationMixin);

  return TabContentCollectionView;

});
