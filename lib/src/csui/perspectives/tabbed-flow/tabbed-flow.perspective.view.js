/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['require', 'module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/marionette', 'csui/models/widget/widget.collection',
  'csui/models/widget/widget.model',
  'csui/controls/tab.panel/tab.panel.view', 'csui/controls/grid/grid.view',
  'csui/behaviors/widget.container/widget.container.behavior',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/utils/contexts/factories/active.tab.factory',
  'csui/controls/tab.panel/tab.links.ext.scroll.mixin',
  'csui/controls/tab.panel/tab.links.ext.view',
  'csui/perspectives/tabbed/behaviors/tab.extensions.behavior',
  'csui/utils/log',
  'csui/perspectives/tabbed-flow/impl/edit.perspective/tab.links.view',
  'hbs!csui/perspectives/tabbed/impl/tabbed.perspective',
  'css!csui/perspectives/tabbed/impl/tabbed.perspective'
], function (require, module, _, $, Backbone, Marionette, WidgetCollection, WidgetModel,
    TabPanelView, GridView, WidgetContainerBehavior, LayoutViewEventsPropagationMixin,
    ActiveTabModelFactory, TabLinksScrollMixin,
    TabLinkCollectionViewExt, TabExtensionsBehavior, log, EditPerspectiveTabLinks,
    perspectiveTemplate) {
  'use strict';

  var config = module.config();
  _.defaults(config, {
    defaultWidgetKind: 'tile',
    widgetSizes: {
      fullpage: {
        widths: {
          xs: 12
        }
      },
      tile: {
        widths: {
          md: 6,
          xl: 4
        }
      },
      header: {
        widths: {
          xs: 12,
          md: 8,
          xl: 6
        }
      }
    }
  });

  var GridRowWidgetContainerView = GridView.RowView.extend({

    cellView: function (model) {
      var widget = model.get('widget');
      if (widget) {
        if (!widget.view) {
          throw new Marionette.Error({
            name: 'UnresolvedWidgetError',
            message: 'Widget "' + widget.type + '" not resolved:' +
                     widget['error']
          });
        }
        return widget.view;
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

    constructor: function GridRowWidgetContainerView(options) {
      if (!!options && options.perspectiveMode === 'edit') {
        this._prepareForEditMode(options);
      }
      GridView.RowView.prototype.constructor.apply(this, arguments);
      if (this.options.perspectiveMode === 'edit') {
        this._initEditMode();
        this._registerEditEvents();
      }
    },

    _prepareForEditMode: function (options) {
      options.cellBehaviours = {
        PerspectiveWidgetConfig: { // For widget editing
          behaviorClass: require(
              'csui/perspective.manage/behaviours/pman.widget.config.behaviour'),
          perspectiveView: this,
          perspectiveSelector: '.perspective-editing .cs-perspective #' + options.tabId
        }
      };
    },

    _initEditMode: function () {
      var self         = this,
          placeholderW = {
            type: 'csui/perspective.manage/widgets/perspective.placeholder'
          };
      TabbedFlowPerspectiveView._resolveWidget(placeholderW).done(function (resolvedWidget) {
        var newCell = TabbedFlowPerspectiveView._createCell(placeholderW, resolvedWidget);
        self.options.collection.add(newCell);
      });
    },

    _registerEditEvents: function () {
      var self = this;
      this.listenTo(this, 'delete:widget', function (widgetView) {
        var model = widgetView.model;
        self.collection.remove(model);
      });

      this.listenTo(this, 'replace:widget', this._replaceWidget);
    },

    _replaceWidget: function (currentWidget, widgetToReplace) {
      if (!this.getPManPlaceholderWidget) {
        return;
      }
      var self = this;
      TabbedFlowPerspectiveView._resolveWidget(widgetToReplace).done(function () {
        if (currentWidget.model.get('widget').type !== self.getPManPlaceholderWidget().type) {
          widgetToReplace.kind = currentWidget.model.get('widget').kind;
        }
        var widgetUpdates = TabbedFlowPerspectiveView._prepareCell(widgetToReplace);
        currentWidget.model.set(widgetUpdates);
        var placeholderWidget = self.getPManPlaceholderWidget(),
            cells             = self.collection,
            hasPlaceholders   = cells.filter(function (w) {
                  return w.get('widget').type === placeholderWidget.type;
                }).length > 0;
        if (!hasPlaceholders) {
          TabbedFlowPerspectiveView._resolveWidget(placeholderWidget).done(
              function (resolvedWidget) {
                var newCell = TabbedFlowPerspectiveView._createCell(placeholderWidget,
                    resolvedWidget, cells.length);
                cells.add(newCell);
              });
        }
      });
    }

  });

  var TabWidgetContainerView = TabPanelView.extend({

    contentView: GridRowWidgetContainerView,

    contentViewOptions: function (model) {
      return {
        context: this.options.context,
        columns: model.get('columns'),
        perspectiveMode: this.options.perspectiveMode,
        tabId: model.get('uniqueTabId')
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
      if (options.perspectiveMode === 'edit') {
        _.extend(options, {
          TabLinkCollectionViewClass: EditPerspectiveTabLinks
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

    render: function () {
      TabPanelView.prototype.render.apply(this);
      this.listenTo(this.collection, 'change reset remove', _.bind(function (event) {
        this._enableToolbarState();
      }, this));
      this.listenTo(this.collection, 'add', _.bind(function (event) {
        this._autoScrollLastTab();
      }, this));
      return this;
    },

    onDomRefresh: function () {
      this._enableToolbarState();
    },

    _onWindowResize: function (event) {
      if (event && event.data && event.data.view) {
        event.data.view._enableToolbarState();
      }
    }
  });

  _.extend(TabWidgetContainerView.prototype, TabLinksScrollMixin);
  var HeaderView = Marionette.ItemView.extend({
    className: 'cs-tabbed-perspective-header',
    constructor: function HeaderView(options) {
      options || (options = {});
      if (!options.header) {
        options.header = {};
      }
      if (options.perspectiveMode === 'edit') {
        var PerspectiveWidgetConfigBehaviour = require(
            'csui/perspective.manage/behaviours/pman.widget.config.behaviour');
        this.behaviors = _.extend({
          PerspectiveWidgetConfig: {
            behaviorClass: PerspectiveWidgetConfigBehaviour,
            perspectiveView: this
          }
        }, this.behaviors);
      }
      Marionette.ItemView.call(this, _.extend({template: false}, options));
      if (this.options.perspectiveMode === 'edit') {
        this._initEditMode(options);
        this._registerEditEvents();
      }
    },

    _initEditMode: function (options) {
      if (!this.options.header.widget && this.getPManPlaceholderWidget) {
        this._handleReplaceWidget(this, this.getPManPlaceholderWidget());
      }
    },

    _ensureRegion: function () {
      if (!this.headerContainer) {
        this.headerContainer = new Marionette.Region({
          el: this.el
        });
      }
      return this.headerContainer;
    },

    onRender: function () {
      if (!!this.options.header.widget) {
        this.navigationHeader = this._createWidget(this.options.header.widget);
        var region = this._ensureRegion();
        region.show(this.navigationHeader);
      }
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

    _registerEditEvents: function () {
      var self = this;
      this.listenTo(this, 'delete:widget', function (widgetView) {
        if (self.getPManPlaceholderWidget) {
          var placeholder = self.getPManPlaceholderWidget();
          TabbedFlowPerspectiveView._resolveWidget(placeholder).done(function () {
            self._replaceWidget(placeholder);
          });
        }
      });
      this.listenTo(this, 'replace:widget', this._handleReplaceWidget);
    },

    _replaceWidget: function (widgetToReplace) {
      this.options.header.widget = widgetToReplace;
      this.render();
    },

    _handleReplaceWidget: function (currentWidget, widgetToReplace) {
      var self = this;
      TabbedFlowPerspectiveView._resolveWidget(widgetToReplace).done(function () {
        self._replaceWidget(widgetToReplace);
      });
    },
    getPManWidgetConfig: function () {
      return this.options.header.widget;
    }
  });

  var TabbedFlowPerspectiveView = Marionette.LayoutView.extend({

    className: 'cs-tabbed-perspective cs-perspective binf-container-fluid cs-tabbed-flow-perspective',
    template: perspectiveTemplate,

    regions: {
      headerRegion: '> .cs-header',
      contentRegion: '> .cs-content'
    },

    constructor: function TabbedFlowPerspectiveView(options) {
      options || (options = {});
      options = $.extend(true, {}, options);
      if (!options.collection) {
        options.collection = this._createCollection(options);
      }
      Marionette.LayoutView.prototype.constructor.call(this, options);

      this.propagateEventsToRegions();
    },

    onRender: function () {
      this.headerView = new HeaderView(this.options);
      this.headerRegion.show(this.headerView);
      this.tabPanel = new TabWidgetContainerView(_.extend({
        activeTab: this.activeTab,
        delayTabContent: this.options.delayTabContent,
        tabBarExtensionViewClass: this.headerView.navigationHeader.tabBarExtensionView,
        tabBarExtensionViewOptions: this.headerView.navigationHeader.tabBarExtensionViewOptions,
        enableExtensionOnFirstTab: this.headerView.navigationHeader.enableExtensionOnFirstTab
      }, this.options));
      this._updateToggleHeaderState();
      this.listenTo(this.tabPanel, 'activate:tab', this._updateToggleHeaderState);
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

    _updateToggleHeaderState: function (tabContent, tabPane, tabLink) {
      if (this.options.perspectiveMode === 'edit') {
        return;
      }
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

    _createCollection: function (options) {
      var tabs            = new Backbone.Collection(options.tabs),
          uniqueWidgets   = _.chain(options.tabs)
              .map(function (tab) {
                return tab.widgets;
              })
              .flatten()
              .pluck('type')
              .unique()
              .map(function (id) {
                return {id: id};
              })
              .value(),
          headerWidget    = options.header && options.header.widget,
          resolvedWidgets = new WidgetCollection(uniqueWidgets),
          self            = this;
      if (headerWidget) {
        resolvedWidgets.add({id: headerWidget.type});
      }
      tabs.each(function (tab) {
        tab.set('id', _.uniqueId('cs-tab'));
      });
      this.widgetsResolved = resolvedWidgets
          .fetch()
          .then(function () {
            if (headerWidget) {
              var resolvedWidget = resolvedWidgets.get(headerWidget.type),
                  widgetView     = resolvedWidget.get('view');
              if (widgetView) {
                _.extend(headerWidget, {view: widgetView});
              } else {
                var error = resolvedWidget.get('error');
                log.warn('Loading widget "{0}" failed. {1}', headerWidget.type, error)
                && console.warn(log.last);
                _.extend(headerWidget, WidgetContainerBehavior.getErrorWidget(
                    headerWidget, error));
              }
            }
            tabs.each(function (tab) {
              tab.set('columns', self._createColumns(tab.get('widgets'), resolvedWidgets));
            });
          });
      return tabs;
    },

    _createColumns: function (widgets, resolvedWidgets) {
      return _.map(widgets, function (widget) {
        var resolvedWidget = resolvedWidgets.get(widget.type);
        return TabbedFlowPerspectiveView._createCell(widget, resolvedWidget);
      }.bind(this));
    },

  }, {

    _prepareCell: function (widgetConfig) {
      if (!widgetConfig.kind) {
        widgetConfig.kind = config.defaultWidgetKind;
      }
      var sizes = config.widgetSizes[widgetConfig.kind] || {};
      return {
        sizes: sizes.widths,
        widget: {
          type: widgetConfig.type,
          options: widgetConfig.options,
          view: widgetConfig.view
        }
      };
    },

    _createCell: function (widget, resolvedWidget) {
      var widgetView     = resolvedWidget.get('view'),
          manifest       = resolvedWidget.get('manifest') || {},
          supportedKinds = manifest.supportedKinds,
          kind           = widget.kind;
      if (!kind || !supportedKinds || !_.contains(supportedKinds, kind)) {
        kind = manifest.kind;
      }
      widget.kind = kind;
      if (!kind) {
        kind = config.defaultWidgetKind;
      }
      var sizes = config.widgetSizes[kind] || {};
      if (widgetView) {
        widget.view = widgetView;
        return TabbedFlowPerspectiveView._prepareCell(widget);
      }
      var error = resolvedWidget.get('error');
      log.warn('Loading widget "{0}" failed. {1}', widget.type, error)
      && console.warn(log.last);
      return {
        sizes: config.widgetSizes[config.defaultWidgetKind].widths,
        widget: WidgetContainerBehavior.getErrorWidget(widget, error)
      };
    },

    _resolveWidget: function (widget) {
      var deferred = $.Deferred();
      var widgetModel = new WidgetModel({id: widget.type});
      widgetModel.fetch().then(function () {
        widget.view = widgetModel.get('view');
        deferred.resolve(widgetModel);
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise();
    },
  });

  _.extend(TabbedFlowPerspectiveView.prototype, LayoutViewEventsPropagationMixin);

  return TabbedFlowPerspectiveView;

});
