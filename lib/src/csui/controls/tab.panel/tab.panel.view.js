/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/utils/base', 'csui/controls/tab.panel/impl/tab.links.view',
  'csui/controls/tab.panel/impl/tab.contents.view',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
  'csui/models/version',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/tab.panel/behaviors/tab.panel.keyboard.behavior',
  'csui/utils/non-emptying.region/non-emptying.region',
  'csui/controls/form/pub.sub',
  'csui/lib/binf/js/binf'
], function (_, Backbone, Marionette, base, TabLinkCollectionView,
    TabContentCollectionView, ViewEventsPropagationMixin, VersionModel,
    TabableRegionBehavior, TabPanelKeyboardBehavior, NonEmptyingRegion, PubSub) {
  'use strict';

  var TabPanelView = Marionette.View.extend({

    className: 'cs-tabpanel tab-panel',
    attributes: function () {
      var id = this.id || _.uniqueId('cs-tab');
      var attrs = {id: id, role: 'tabpanel'};
      return attrs;
    },

    events: {"keydown": "onKeyInView"},

    behaviors: {
      TabableRegionBehavior: {
        behaviorClass: TabableRegionBehavior,
        notSetFocus: true,
        initialActivationWeight: 100
      },
      TabPanelKeyboardBehavior: {
        behaviorClass: TabPanelKeyboardBehavior
      }
    },

    constructor: function TabPanelView(options) {
      options || (options = {});
      options.tabPanel = this;
      if (!options.collection) {
        options.collection = this._convertCollection(options);
      }
      this._generateUniqueTabId(options);
      if (options.node) {
        var initialPanel = options.node.get('initialPanel');
        if (initialPanel) {
          var initialTabIndex = options.collection.findIndex({name: initialPanel});
          if (initialTabIndex >= 0 && initialTabIndex < options.collection.length) {
            var initialPanelModel = options.collection.at(initialTabIndex);
            options.activeTab = new Backbone.Model(initialPanelModel.attributes);
            options.activeTab.set('tabIndex', initialTabIndex);
            options.selectedTab = new Backbone.Model(initialPanelModel.attributes);
          }
        }
      }
      if (!options.activeTab) {
        options.activeTab = new Backbone.Model({tabIndex: 0});
      }

      Marionette.View.prototype.constructor.apply(this, arguments);

      this.linksRegion = new NonEmptyingRegion({el: this.el});
      this.contentRegion = new NonEmptyingRegion({el: this.el});
      this.activeTab = options.activeTab;
      var tabIndex = this.activeTab.get('tabIndex');
      if (tabIndex >= this.collection.length) {
        this.activeTab.set('tabIndex', this.collection.length - 1);
      }
      this.listenTo(this.collection, 'reset', this._generateUniqueTabId);
      this.listenTo(this.collection, 'add', this._setModelUniqueTabId);

      this.listenTo(this, 'activate:tab', this._scrollToActiveTab);
      this.listenTo(this, 'before:destroy', this._destroyContent);
    },

    _scrollToActiveTab: function (tabContent, tabPane, tabLink) {
      this.activeTabLink = tabLink;
      this.activeTabContent = tabContent;
      if (this.options.mode) {
        var href           = tabLink.$el.find('>a').attr('href'),
            extraTopOffset = this.getOption('extraScrollTopOffset') || 0;
        href[0] === '#' && (href = href.substr(1));
        var hrefElems = this.$el.find("div[id='" + href + "']");
        if (hrefElems.length > 0) {
          var tabPosTop = hrefElems[0].offsetTop + extraTopOffset;
          if (this.options.mode === 'spy') {
            var scrollspy = this.tabContent.$el.data('binf.scrollspy');
            scrollspy && scrollspy.refresh();
          }
          this.tabContent.$el.animate({
            scrollTop: tabPosTop
          }, 300);
          var newTabHeaderText = tabLink.$el.find(".cs-tablink-text").html(),
              pubsubPostFix    = (this.options.node instanceof VersionModel ? 'v' : 'p') +
                                 this.options.node.get('id'),
              objPubSubId      = 'pubsub:tab:contents:header:view:change:tab:title:' +
                                 pubsubPostFix;

          PubSub.trigger(objPubSubId, newTabHeaderText);
        }
      }
    },

    render: function () {
      this._ensureViewIsIntact();
      this.triggerMethod('before:render', this);
      this._destroyContent();
      this._renderContent();
      this._bindingToEvents();
      this.triggerMethod('render', this);
      return this;
    },

    _renderContent: function () {
      var TabLinkCollectionViewClass = this.options.TabLinkCollectionViewClass ||
                                       TabLinkCollectionView;
      this.tabLinks = new TabLinkCollectionViewClass(this.options);
      var TabContentCollectionViewClass = this.options.TabContentCollectionViewClass ||
                                          TabContentCollectionView;
      this.tabContent = new TabContentCollectionViewClass(this.options);
      this.propagateEventsToViews(this.tabLinks, this.tabContent);
      this.linksRegion.show(this.tabLinks);
      this.contentRegion.show(this.tabContent);
      var self = this;
      this.listenTo(this.tabLinks, 'childview:before:activate:tab',
          function (tabLink) {
            var tabPane    = this.tabContent.children.findByModel(tabLink.model),
                tabContent = tabPane.content;
            this.activatingTab = true;
            this.triggerMethod('before:activate:tab', tabContent, tabPane, tabLink);
          });
      this.listenTo(this.tabLinks, 'childview:activate:tab',
          function (tabLink) {
            var tabPane    = this.tabContent.children.findByModel(tabLink.model),
                tabContent = tabPane.content;
            setTimeout(function () {
              self.activatingTab = false;
            }, 600);
            this.triggerMethod('activate:tab', tabContent, tabPane, tabLink);
            tabContent.triggerMethod('dom:refresh');
          });

      var tabIndex = 0;
      if (this.activeTab && this.activeTab.get('tabIndex') >= 0 &&
          this.activeTab.get('tabIndex') < this.collection.length) {
        tabIndex = this.activeTab.get('tabIndex');
      }
      this.activeTabLink = this.tabLinks.children.findByIndex(tabIndex);
      if (this.activeTabLink) {
        this.activeTabContent = this.tabContent.children.findByIndex(tabIndex).content;
      }
    },

    _destroyContent: function () {
      this.$el.unbind('tab:content:focus');
      this.$el.unbind('tab:link:delete');
      if (this.tabLinks) {
        this.cancelEventsToViewsPropagation(this.tabLinks, this.tabContent);
        this.stopListening(this.tabLinks)
            .stopListening(this.tabContent);
        this.linksRegion.empty();
        this.contentRegion.empty();
      }
    },

    _bindingToEvents: function () {
      var self = this;
      this.$el.bind('tab:content:focus',
          function (event) {
            var $elem = self.tabContent.getTabContentFirstFocusableELement(event.tabId);
            if ($elem) {
              self.currentTabPosition = this.keyboardBehavior ?
                                        this.keyboardBehavior.tabContentIndex : -1;
              self._moveTo && self._moveTo(event, $elem);
              self.tabContent.keyboardBehavior &&
              self.tabContent.keyboardBehavior.updateCurrentTabPosition();
            }
          });
      this.$el.bind('tab:link:delete',
          function (event) {
            event.preventDefault();
            event.stopPropagation();
            self.tabLinks.deleteTabById(event.tabId);
          });
    },

    _convertCollection: function (options) {
      var tabs = new Backbone.Collection(options.tabs);
      tabs.each(function (tab) {
        tab.set('id', _.uniqueId('cs-tab'));
      });
      return tabs;
    },

    _generateUniqueTabId: function (options) {
      var collection = options instanceof Backbone.Collection ? options :
                       (options.collection || this.collection);
      if (collection) {
        collection.each(_.bind(function (tab) {
          this._setModelUniqueTabId(tab);
        }, this));
      }
    },

    _setModelUniqueTabId: function (model) {
      model && model.set('uniqueTabId', _.uniqueId('cstab-uid-'), {silent: true});
    },

    _isTablinkVisibleInParents: function ($el, options) {
      return this.tabLinks._isTablinkVisibleInParents($el, options);
    }

  });

  _.extend(TabPanelView.prototype, ViewEventsPropagationMixin);

  return TabPanelView;

});
