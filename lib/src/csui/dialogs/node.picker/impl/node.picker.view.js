/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["module", "csui/lib/jquery", "csui/lib/underscore", "csui/lib/marionette",
  "csui/utils/log", "csui/utils/base",
  "csui/models/node/node.model", "csui/models/nodechildren",
  "csui/dialogs/node.picker/impl/select.views/select.views",
  "csui/controls/breadcrumbs/breadcrumbs.view",
  "csui/utils/contexts/factories/ancestors", "csui/models/nodeancestors",
  "hbs!csui/dialogs/node.picker/impl/node.picker",
  'i18n!csui/dialogs/node.picker/impl/nls/lang',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  "csui/dialogs/node.picker/impl/search.list/header/search.result.header.view"
], function (module, $, _, Marionette, log, base,
    NodeModel, NodeChildrenCollection, SelectViews,
    BreadcrumbsView, AncestorCollectionFactory, NodeAncestorCollection, template,
    lang, LayoutViewEventsPropagationMixin, SearchResultsHeaderView) {

  var NodePicker = Marionette.LayoutView.extend({

    template: template,
    className: 'csui-node-picker',

    regions: {
      breadcrumbRegion: '#csui-np-breadcrumbs > div.breadcrumb-inner',
      searchHeaderRegion: '#csui-np-breadcrumbs > div.searchheader-inner',
      selectViewRegion: '#csui-np-selectviews'
    },

    ui: {
      breadcrumb: '#csui-np-breadcrumbs',
      breadcrumbContent: '.breadcrumb-inner',
      searchHeaderContent: '.searchheader-inner',
      selectViews: '#csui-np-selectviews'
    },

    templateHelpers: function () {
      return {
        breadcrumbAria: lang.breadcrumbAria,
        nodePickerChoices: lang.nodePickerChoices
      };
    },
    constructor: function NodePicker(options) {
      options || (options = {});

      Marionette.LayoutView.prototype.constructor.call(this, options);

      this.propagateEventsToRegions();
      this.setViews(options);
      this.setBreadcrumbs(options);
      if (options.searchView) {
        this.updatedBreadcrumbId = options.locationID;
        this.setSearchResultsHeader(options);
      }
      this.onWinRefresh = _.bind(this.windowRefresh, this);
      $(window).bind("resize.app", this.onWinRefresh);
    },

    windowRefresh: function () {
      var breadCrumb       = $('.cs-breadcrumb'),
          breadCrumbHeight = breadCrumb.is(':visible') ? breadCrumb.height() : 0,
          viewHeight       = this.$el.height() - breadCrumbHeight;
      if (!!window.chrome && viewHeight > 0) {
        this.selectViews.$el.css('height', viewHeight + 'px');
      }
      this.selectViews.triggerMethod('dom:refresh', this.selectViews);
      if (this.breadcrumbs) {
        this.breadcrumbs.refresh();
      }
    },
    onBeforeDestroy: function () {
      if (this.selectViews) {
        if (this.selectViews.leftView) {
          this.selectViews.leftView.clearSelect();
        }
        if (this.selectViews.rightView) {
          this.selectViews.rightView.clearSelect();
        }
      }
    },
    onDestroy: function () {
      $(window).unbind("resize.app", this.onWinRefresh);
    },
    onRender: function () {
      if (this.options.searchView) {
        this.searchHeaderRegion.show(this.searchHeaderView);
      }
      if (this.breadcrumbs) {
        this.breadcrumbRegion.show(this.breadcrumbs);
      }
      this.selectViews.options.navigateFromHistory = this.options.navigateFromHistory;
      this.selectViewRegion.show(this.selectViews);
    },
    onDomRefresh: function () {
      this.windowRefresh();
    },

    onShow: function () {
      _.each(this.regionManager.regions, function (region) {
        if (region.currentView) {
          region.currentView.trigger('show');
        }
      });
      if (!this.options.container && !this.options.searchView) {
        this.ui.breadcrumb.hide();
        this.ui.selectViews.addClass('csui-full-height');
      }
    },

    setViews: function (options) {
      var views = this.selectViews = new SelectViews(options);
      this.listenTo(views, 'changed', this.updateBreadcrumbs);
      this.listenTo(views, 'update:searchHeader', this.updateSearchResultHeader);
      this.listenTo(views, 'change:complete', _.bind(this.trigger, this, 'change:complete'));
      this.listenTo(views, 'click:location', _.bind(this.trigger, this, 'open:location'));
      this.listenTo(views, 'change:location', _.bind(this.trigger, this, 'change:location'));
      this.listenTo(views, 'back:toSearch', function (promise) {
        this.trigger('back:toSearch', promise);
      });
      this.listenTo(views, 'backto:folder', function (promise) {
        this.trigger('backto:folder', promise);
      });
      this.listenTo(views, 'close', this.close)
          .listenTo(views, 'toggle:breadcrumbs', this.updateBreadcrumbs);

    },

    getSelection: function () {
      return _.values(this.selectViews.getSelection());
    },

    getNumberOfSelectItems: function () {
      return this.selectViews.getNumberOfSelectItems();
    },

    close: function () {
      this.destroy();
      this.trigger('close');
    },

    updateBreadcrumbs: function (objId) {
      var ancestors;
      this.updatedBreadcrumbId = undefined;
      if (this.breadcrumbNode) {
        this.breadcrumbNode.set('id', objId);
      }

      if (objId) {
        var self = this;
        this.getAncestors(objId).fetch();
      }
      this.listenTo(this.breadcrumbs, 'after:synchronized', this.onAfterBreadcrumbsSynchronized);
      return true;
    },

    getAncestors: function (nodeId) {
      var node            = new NodeModel({id: nodeId}, {connector: this.options.connector}),
          ancestorOptions = {node: node, autofetch: true},
          newAncestors    = new NodeAncestorCollection(undefined, ancestorOptions);
      this.breadcrumbs = new BreadcrumbsView({
        node: node,
        collection: newAncestors
      });
      this.breadcrumbs.synchronizeCollections();
      if (!this.breadcrumbNode) {
        this.breadcrumbNode = node;
      }
      return newAncestors;
    },

    setBreadcrumbs: function (options) {
      var container = options.container || options.initialContainer,
          id        = container ? container.get('id') : 0;

      if (!id || id === 0) {
        this.getAncestors(0);
        this.setBreadcrumbEvents();
        return;
      }

      if (options.container) {
        var self = this;
        this.getAncestors(id).fetch();
      } else {
        this.getAncestors(0);
        this.setBreadcrumbEvents();
      }

      this.setBreadcrumbEvents();

      return true;
    },

    showBackButton: function () {
      this.selectViews.showBackButton();
    },

    setBreadcrumbEvents: function () {
      this.listenTo(this.breadcrumbs, 'before:defaultAction', function (args) {
        var selectViews = this.selectViews,
            self        = this;
        selectViews.newLeftView(args.node).done(function (view) {
          selectViews.setParentNodeAsTarget(view.container);
          self.trigger('change:complete', view.container);
        });
      });
      this.listenTo(this.breadcrumbs, 'after:synchronized', this.onAfterBreadcrumbsSynchronized);
    },

    onAfterBreadcrumbsSynchronized: function () {
      if (this.ui.breadcrumb.hasClass('cs-breadcrumb')) {
        this.ui.breadcrumb.show();
        this.ui.breadcrumbContent.show();
        this.ui.searchHeaderContent.hide();
        this.ui.selectViews.removeClass('csui-full-height');
        if (this.breadcrumbs.collection.length === 1) {
          this.options.targetBrowseHistory = [];
        }
        this.windowRefresh();
      }
    },

    setSearchResultsHeader: function (options) {
      this.searchHeaderView = new SearchResultsHeaderView({
        collection: this.collection
      });
      return true;
    },

    updateSearchResultHeader: function () {
      if (this.options.searchView) {
        if (!this.options.container) {
          this.ui.searchHeaderContent.addClass('csui-non-container-padding');
        } else {
          this.ui.searchHeaderContent.removeClass('csui-non-container-padding');
        }
        this.ui.breadcrumbContent.hide();
        this.ui.searchHeaderContent.show();
        this.searchHeaderView._assignTotalItemElem(this.collection);
      }
    }
  });

  _.extend(NodePicker.prototype, LayoutViewEventsPropagationMixin);

  return NodePicker;

});
