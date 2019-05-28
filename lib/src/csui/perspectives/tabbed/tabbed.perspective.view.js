/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/controls/tab.panel/tab.panel.view', 'csui/controls/grid/grid.view',
  'csui/behaviors/widget.container/widget.container.behavior',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/utils/contexts/factories/active.tab.factory',
  'csui/controls/tab.panel/tab.links.ext.scroll.mixin',
  'csui/controls/tab.panel/tab.links.ext.view',
  'csui/perspectives/tabbed/behaviors/tab.extensions.behavior',
  'hbs!csui/perspectives/tabbed/impl/tabbed.perspective',
  'css!csui/perspectives/tabbed/impl/tabbed.perspective'
], function (_, $, Marionette, TabPanelView, GridView, WidgetContainerBehavior,
    LayoutViewEventsPropagationMixin, ActiveTabModelFactory, TabLinksScrollMixin,
    TabLinkCollectionViewExt, TabExtensionsBehavior, perspectiveTemplate) {
  'use strict';

  var GridRowWidgetContainerView = GridView.RowView.extend({

    cellView: function (model) {
      var widget = model.get('widget');
      if (widget) {
        var view = widget.view;
        if (!view) {
          throw new Marionette.Error({
            name: 'UnresolvedWidgetError',
            message: 'Widget "' + widget.type + '" not resolved: ' +
                     widget.error
          });
        }
        return view;
      }
    },

    cellViewOptions: function (model) {
      var widget = model.get('widget');
      return {
        context: this.options.context,
        data: widget && widget.options || {},
        model: undefined
      };
    },

    constructor: function GridRowWidgetContainerView() {
      GridView.RowView.prototype.constructor.apply(this, arguments);
    }

  });

  var TabWidgetContainerView = TabPanelView.extend({

    contentView: GridRowWidgetContainerView,

    contentViewOptions: function (model) {
      return {
        context: this.options.context,
        columns: model.get('columns')
      };
    },

    constructor: function TabWidgetContainerView(options) {
      options || (options = {});
      _.defaults(options, {
        delayTabContent: false,
        toolbar: true,
        TabLinkCollectionViewClass: TabLinkCollectionViewExt,
        tabBarExtensionViewClass: options.tabBarExtensionViewClass,
        tabBarExtensionViewOptions: options.tabBarExtensionViewOptions,
        enableExtensionOnFirstTab: options.enableExtensionOnFirstTab
      });
      if (options.tabs) {
        _.each(options.tabs, function (tab, tabIndex) {
          _.each(tab.columns, function (col, columnIndex) {
            col.widget.cellAddress = 'tab' + tabIndex + ':r0:c' + columnIndex;
          });
        });
      }
      this.behaviors = _.extend({
        TabExtensionsBehavior: {
          behaviorClass: TabExtensionsBehavior,
        }
      }, this.behaviors);

      $(window).bind('resize', {view: this}, this._onWindowResize);
      TabPanelView.prototype.constructor.call(this, options);
    },

    _onWindowResize: function (event) {
      if (event && event.data && event.data.view) {
        event.data.view._enableToolbarState();
      }
    }

  });

  _.extend(TabWidgetContainerView.prototype, TabLinksScrollMixin);

  var TabbedPerspectiveView = Marionette.LayoutView.extend({

    className: 'cs-tabbed-perspective cs-perspective binf-container-fluid',
    template: perspectiveTemplate,

    behaviors: {
      WidgetContainer: {
        behaviorClass: WidgetContainerBehavior
      }
    },

    regions: {
      headerRegion: '> .cs-header',
      contentRegion: '> .cs-content'
    },

    constructor: function TabbedPerspectiveView(options) {
      options || (options = {});
      options = $.extend(true, {}, options);

      Marionette.LayoutView.prototype.constructor.call(this, options);

      this.propagateEventsToRegions();
    },

    onRender: function () {
      this.navigationHeader = this._createWidget(this.options.header.widget);
      this.tabPanel = new TabWidgetContainerView(_.extend({
        activeTab: this.activeTab,
        delayTabContent: this.options.delayTabContent,
        tabBarExtensionViewClass: this.navigationHeader.tabBarExtensionView,
        tabBarExtensionViewOptions: this.navigationHeader.tabBarExtensionViewOptions,
        enableExtensionOnFirstTab: this.navigationHeader.enableExtensionOnFirstTab
      }, this.options));
      this._updateToggleHeaderState();
      this.listenTo(this.tabPanel, 'activate:tab', this._updateToggleHeaderState);
      this.headerRegion.show(this.navigationHeader);
      this.contentRegion.show(this.tabPanel);
      this.headerRegion.$el.on(this._transitionEnd(), _.bind(function (event) {
        if (event.target === this.headerRegion.el) {
          this.$el.removeClass('cs-toggling');
          this.triggerMethod('dom:refresh');
        }
      }, this));
    },

    onBeforeRender: function () {
      if (this.headerRegion && this.headerRegion.$el) {
        this.headerRegion.$el.off(this._transitionEnd());
      }
    },

    onBeforeDestroy: function () {
      if (this.headerRegion && this.headerRegion.$el) {
        this.headerRegion.$el.off(this._transitionEnd());
      }
    },

    enumerateWidgets: function (callback) {
      var widget = this.options && this.options.header && this.options.header.widget;
      widget && callback(widget);
      _.each(this.options.tabs, function (tab) {
        _.each(tab.columns || [], function (column) {
          column.widget && callback(column.widget);
        });
      });
    },

    _createWidget: function (widget) {
      var Widget = widget.view;
      if (!Widget) {
        throw new Marionette.Error({
          name: 'UnresolvedWidgetError',
          message: 'Widget not resolved: "' + widget.type + '"'
        });
      }
      return new Widget({
        context: this.options.context,
        data: widget.options || {}
      });
    },

    _updateToggleHeaderState: function (tabContent, tabPane, tabLink) {
      var tabIndex    = tabLink ? tabLink.model.collection.indexOf(tabLink.model) :
                        this.activeTab && this.activeTab.get('tabIndex') || 0,
          method      = tabIndex === 0 ? 'removeClass' : 'addClass',
          isCollapsed = this.$el.hasClass('cs-collapse');
      if (method === 'removeClass' && isCollapsed ||
          method === 'addClass' && !isCollapsed) {
        this.$el.addClass('cs-toggling');
        this.$el[method]('cs-collapse');
      }
    },
    _transitionEnd: _.once(
        function () {
          var transitions = {
                transition: 'transitionend',
                WebkitTransition: 'webkitTransitionEnd',
                MozTransition: 'transitionend',
                OTransition: 'oTransitionEnd otransitionend'
              },
              element     = document.createElement('div'),
              transition;
          for (transition in transitions) {
            if (typeof element.style[transition] !== 'undefined') {
              return transitions[transition];
            }
          }
        }
    ),

    _supportMaximizeWidget: true

  });

  _.extend(TabbedPerspectiveView.prototype, LayoutViewEventsPropagationMixin);

  return TabbedPerspectiveView;

});
