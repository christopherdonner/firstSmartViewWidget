/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/utils/contexts/factories/previous.node',
  'csui/utils/contexts/factories/next.node',
  'csui/utils/namedsessionstorage',
  'csui/utils/contexts/factories/search.query.factory',
  'csui/pages/start/perspective.routing',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'i18n!csui/widgets/search.results/impl/nls/lang',
  'hbs!csui/widgets/search.results/impl/search.results.header',
  'csui/utils/contexts/factories/application.scope.factory',
  'csui/widgets/search.results/impl/search.results.header.title.view',
  'css!csui/widgets/search.results/impl/search.results'
], function (_, $, Marionette, PreviousNodeModelFactory, NextNodeModelFactory,
    NamedSessionStorage, SearchQueryModelFactory, PerspectiveRouting,
    TabableRegionBehavior, lang, headerTemplate,
    ApplicationScopeModelFactory, TitleView) {
  "use strict";

  var SearchHeaderView = Marionette.ItemView.extend({
    className: "csui-search-results-header",
    template: headerTemplate,
    templateHelpers: function () {
      var messages = {
        searchResults: lang.searchResults,
        clearAll: lang.clearAll,
        about: lang.about,
        searchBackTooltip: lang.searchBackTooltip,
        searchFilterTooltip: lang.filter,
        filterAria: lang.filterExpandAria,
        enableSearchFilter: this.options.enableFacetFilter
      };
      return {
        messages: messages
      };
    },
    ui: {
      back: '.cs-go-back',
      parent: '.csui-search-arrow-back-parent',
      filter: '.csui-search-filter',
      filterParent: '.csui-search-facet-filter-parent',
      resultTitle: '.csui-results-title',
      searchHeaderTitle: '.csui-search-header-title'
    },
    events: {
      'click @ui.back': 'onClickBack',
      'click @ui.parent': 'onClickBack',
      'keypress @ui.back': 'onClickBack',
      'click @ui.filter': 'onClickFilter',
      'keypress @ui.filter': 'onClickFilter',
      'click @ui.filterParent': 'onClickFilter'
    },

    behaviors: {
      TabableRegionBehavior: {
        behaviorClass: TabableRegionBehavior
      }
    },

    currentlyFocusedElement: function (event) {
      var tabElements = this.$('*[tabindex]');
      if (tabElements.length) {
        tabElements.prop('tabindex', 0);
      }
      if (!!event && event.shiftKey) {
        return $(tabElements[tabElements.length - 1]);
      } else {
        return $(tabElements[0]).hasClass('csui-acc-focusable-active') ? this.ui.filter :
               $(tabElements[0]);
      }
    },
    namedSessionStorage: new NamedSessionStorage(),
    constructor: function SearchHeaderView(options) {
      options || (options = {});
      Marionette.View.prototype.constructor.apply(this, arguments); // apply (modified) options to this
      if (this.collection) {
        this.listenTo(this.collection, 'reset', this.render) // render after reset of collection
            .listenTo(this.collection, 'remove', this._collectionItemRemoved);
      }
      this.previousNode = options.context.getModel(PreviousNodeModelFactory).clone();
      this.nextNode = options.context.getModel(NextNodeModelFactory);
      this.searchQuery = options.context.getModel(SearchQueryModelFactory);
      this.applicationScope = options.context.getModel(ApplicationScopeModelFactory);
      if (this.applicationScope.previous('id') === "") { /* Previous page is Home Page */
        if (this.namedSessionStorage && this.namedSessionStorage.get("previousNodeId")) {
          this.namedSessionStorage.remove("previousNodeName");
          this.namedSessionStorage.remove("previousNodeId");
        }
      }
    },
    initialize: function () {
      this.titleView = this.options.titleView || new TitleView({});
    },
    onRender: function () {
      _.extend(this.titleView.options, {
        count: this.collection.totalCount,
        searchHeaderTitle: this.collection.searching ?
                           this.collection.searching.result_title : lang.searchResults
      });

      this.titleView.render();

      Marionette.triggerMethodOn(this.titleView, 'before:show', this.titleView, this);
      this.ui.searchHeaderTitle.append(this.titleView.el);
      Marionette.triggerMethodOn(this.titleView, 'show', this.titleView, this);

      if (this.collection.length) {
        this.ui.back.addClass('search_results_data');
        this.ui.filter.addClass('search_results_data');
      } else {
        this.ui.back.addClass('search_results_nodata');
        this.ui.filter.addClass('search_results_nodata');
      }

      this.rendered = true;
      this.$el.show();
      if (this.options.enableBackButton) {
        this.ui.back.attr('title', this.options.backButtonToolTip);
        this.ui.back.attr('aria-label', this.options.backButtonToolTip);
      } else if (PerspectiveRouting.getInstance(this.options).hasRouted() || history.state ||
                 this.previousNode.get('id') ||
                 (!!this.namedSessionStorage && this.namedSessionStorage.get("previousNodeId"))) {
        this._setBackButtonTitle();
      } else {
        this.ui.back.hide();
        this.ui.parent.hide();
      }
    },
    onBeforeDestroy: function () {
      this.titleView.destroy();
    },

    _setBackButtonTitle: function () {
      var name;
      if (this.searchQuery.attributes.location_id1 === undefined && !this.previousNode.get('id') &&
          !(this.namedSessionStorage && this.namedSessionStorage.get("previousNodeId"))) {
        name = lang.searchBackToHome;
        this.namedSessionStorage = null;
      }
      else {
        if (this.previousNode.get('id')) {
          name = this.previousNode.get('name');
          this.namedSessionStorage.set("previousNodeName", this.previousNode.get('name'));
          this.namedSessionStorage.set("previousNodeId", this.previousNode.get('id'));
        }
        else {
          name = this.namedSessionStorage.get("previousNodeName");
        }
      }
      this.ui.back.attr('title', lang.searchBackTooltip + " " + lang.searchBackTooltipTo +
                                 " '" + name + "'");
      this.ui.back.attr('aria-label', lang.searchBackTooltip + " " + lang.searchBackTooltipTo +
                                 " '" + name + "'");
    },

    setCustomSearchTitle: function (title) {
      !!this.titleView.setCustomSearchTitle &&
      this.titleView.setCustomSearchTitle(title);
    },
    _collectionItemRemoved: function () {
      var originalCount = this.collection.totalCount;
      this.collection.totalCount = --this.totalCount;
      this.render();
      this.collection.totalCount = originalCount;
    },
    onClickBack: function (event) {
      if ((event.type === 'keypress' && event.keyCode === 13) || (event.type === 'click')) {
        if (this.options.enableBackButton) {
          event.stopPropagation();
          this.trigger("go:back");
        } else if (this.previousNode.get('id') ||
                   (!!this.namedSessionStorage && this.namedSessionStorage.get("previousNodeId"))) {
          this.nextNode.set('id', this.namedSessionStorage.get("previousNodeId"));
        } else {
          this.applicationScope.set('id', '');
        }
      }
    },

    onClickFilter: function (event) {
      if ((event.type === 'keypress' && event.keyCode === 13) || (event.type === 'click')) {
        if (this.options.enableFacetFilter) {
          event.stopPropagation();
          this.trigger("toggle:filter", this.options.originatingView);
          this.trigger("focus:filter", this.options.originatingView);
        }
      }
    }
  });

  return SearchHeaderView;

});
