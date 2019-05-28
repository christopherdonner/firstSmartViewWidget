/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module',
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/utils/base',
  'csui/utils/contexts/factories/search.query.factory',
  'csui/utils/contexts/factories/search.results.factory',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/widgets/search.results/impl/search.results.header.view',
  'csui/controls/tabletoolbar/tabletoolbar.view',
  'csui/controls/pagination/nodespagination.view',
  'csui/widgets/search.results/controls/sorting/sort.menu.view',
  'csui/controls/progressblocker/blocker',
  'csui/widgets/search.results/toolbaritems',
  'csui/widgets/search.results/toolbaritems.masks',
  'csui/controls/table/cells/favorite/favorite.view',
  'csui/controls/checkbox/checkbox.view',
  'csui/widgets/search.results/controls/expandall/expandall.view',
  'csui/controls/table/cells/reservation/reservation.view',
  'csui/widgets/search.custom/impl/search.object.view',
  'csui/utils/contexts/factories/search.metadata.factory',
  'csui/widgets/search.results/impl/metadata/search.metadata.view',
  'csui/controls/globalmessage/globalmessage',
  'i18n!csui/widgets/search.results/impl/nls/lang',
  'csui/controls/tableactionbar/tableactionbar.view',
  'csui/utils/nodesprites', 'csui/controls/node-type.icon/node-type.icon.view',
  'csui/controls/breadcrumbs/breadcrumbs.view',
  'csui/models/nodeancestors',
  'csui/utils/contexts/factories/node',
  'csui/models/node/node.model',
  'csui/models/nodes',
  'csui/utils/commands/properties',
  'csui/behaviors/default.action/default.action.behavior',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/controls/toolbar/toolbar.command.controller',
  'hbs!csui/widgets/search.results/impl/search.results',
  'hbs!csui/widgets/search.results/impl/search.result',
  'hbs!csui/widgets/search.results/impl/search.empty',
  'csui/utils/defaultactionitems',
  'csui/utils/commands',
  'csui/dialogs/modal.alert/modal.alert',
  'csui/controls/facet.panel/facet.panel.view',
  'csui/controls/facet.bar/facet.bar.view',
  'csui/utils/node.links/node.links',
  'csui/lib/handlebars.helpers.xif',
  'css!csui/widgets/search.results/impl/search.results',
  'csui/lib/jquery.mousehover'

], function (module, _, $, Backbone, Marionette, base, SearchQueryModelFactory,
    SearchResultsCollectionFactory, LayoutViewEventsPropagationMixin, HeaderView,
    TableToolbarView, PaginationView, SortingView, BlockingView, toolbarItems,
    ToolbarItemsMasks, FavoritesView, CheckboxView, ExpandAllView,
    Reservation, SearchObjectView, SearchMetadataFactory, SearchMetadataView, GlobalMessage,
    lang, TableActionBarView, NodeSpriteCollection, NodeTypeIconView, BreadcrumbsView,
    NodeAncestorCollection, NodeModelFactory, NodeModel, NodeCollection, PropertiesCommand,
    DefaultActionBehavior, PerfectScrollingBehavior, ToolbarCommandController, layoutTemplate,
    itemTemplate, emptyTemplate, defaultActionItems, commands, ModalAlert,
    FacetPanelView, FacetBarView, nodeLinks) {
  'use strict';
  var config = _.extend({
    enableFacetFilter: true, // LPAD-60082: Enable/disable facets
    enableBreadcrumb: true
  }, module.config());

  var NoSearchResultView = Marionette.ItemView.extend({

    className: 'csui-empty',
    template: emptyTemplate,

    constructor: function NoSearchResultView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      this.listenTo(this.model, 'change', this.render);
    }

  });

  var SearchResultItemView = Marionette.LayoutView.extend({

    className: 'binf-list-group-item binf-col-lg-12 binf-col-md-12 binf-col-sm-12 binf-col-xs-12',
    template: itemTemplate,

    regions: {
      favRegion: ".csui-search-item-fav",
      selectionRegion: ".csui-search-item-check",
      searchMetadataRegion: ".csui-search-item-details-wrapper",
      breadcrumbRegion: ".csui-search-item-breadcrumb",
      reservationRegion: ".csui-search-item-reservation"
    },

    ui: {
      descriptionField: '.csui-overflow-description',
      modifiedByField: '.csui-search-modified-by',
      metadataDetails: '.csui-search-item-details',
      inlineToolbarContainer: '.csui-search-toolbar-container',
      inlineToolbar: '.csui-search-item-row'
    },

    events: {
      'click .csui-search-item-link': 'openSearchItem',
      'click .csui-search-version-label': 'openVersionHistory',
      'click .icon-expandArrowUp': 'showMetadataInfo',
      'click .icon-expandArrowDown': 'hideMetadataInfo'
    },

    templateHelpers: function () {

      var defaultActionController = this.options.defaultActionController,
          checkModelHasAction     = defaultActionController.hasAction.bind(defaultActionController),
          inActiveClass           = checkModelHasAction(this.model) ? "" :
                                    "csui-search-no-default-action",
          messages                = {
            created: lang.created,
            createdby: lang.createdBy,
            modified: lang.modified,
            owner: lang.owner,
            type: lang.type,
            items: lang.items,
            showMore: lang.showMore, // where does this show up
            showLess: lang.showLess,
            versionLabel: lang.versionLabel,
            versionSeparator: lang.versionSeparator,
            inactiveclass: inActiveClass,
            enableBreadcrumb: config.enableBreadcrumb
          },
          defaultActionUrl        = nodeLinks.getUrl(this.model),
          parent                  = this.model.attributes.ancestors &&
                                    this.model.attributes.ancestors.length > 0 ?
                                    this.model.attributes.ancestors.slice(-1)[0] : undefined,
          parentName              = parent && parent.attributes ? parent.attributes.name :
                                    undefined;

      return {
        showOwner: this.model.attributes.hasOwnProperty('owner_user_id'), // LPAD-61022: hide owner, if not set in response
        messages: messages,
        defaultActionUrl: defaultActionUrl,
        cid: this.cid,
        itemBreadcrumb: _.str.sformat(lang.itemBreadcrumbAria, parentName),
        mimeTypeAria: _.str.sformat(lang.mimeTypeAria, this.model.get('mime_type_search'))
      };
    },

    openSearchItem: function (event) {
      event.preventDefault();
      this.trigger("click:item", this.model);
    },

    constructor: function SearchResultItemView(options) {
      options || (options = {});
      Marionette.LayoutView.prototype.constructor.call(this, options);
      this.model.attributes.mime_type = !!this.model.attributes.mime_type ?
                                        this.model.attributes.mime_type :
                                        (this.model.attributes.versions ?
                                         this.model.attributes.versions.mime_type : "");
      _.extend(this.model.attributes, {
        collection_id: this.model.cid,
        mime_type_search: NodeSpriteCollection.findTypeByNode(this.model)
      });

      this._rowStates = options.rowStates;
      this.addOwnerDisplayName();
      this.addCreatedUserDisplayName();

      this.listenTo(this._rowStates, 'change:' + SearchResultsView.RowStatesSelectedRows,
          this._selectionChanged
      );

      this.listenTo(this.model, 'change', function () {
        if (_.size(this.model.changed) === 1 &&
            _.has(this.model.changed, 'csuiDelayedActionsRetrieved')) {
          return;
        }
        this.render();
        this.updateItemdetails();
      });

      if (base.isAppleMobile() === false) {
        this.$el.on('mouseenter.' + this.cid, '.csui-search-item-row',
            _.bind(this._hoverStart, this));
        this.$el.on('mouseleave.' + this.cid, '.csui-search-item-row',
            _.bind(this._hoverEnd, this));
      }
    },

    _hoverStart: function () {
      this.showInlineActions();
    },

    _hoverEnd: function () {
      this.hideInlineActions();
    },

    _selectionChanged: function (rowStatesModel) {
      var previous = rowStatesModel.previous(SearchResultsView.RowStatesSelectedRows);
      var changed = rowStatesModel.changed[SearchResultsView.RowStatesSelectedRows];

      var deselected = _.difference(previous, changed);
      var selected = _.difference(changed, previous);

      var id = this.model.get('id');

      if (_.contains(deselected, id)) {
        this._checkboxView.setChecked(false);
        this.ui.inlineToolbar.removeClass('selected');
      }
      if (_.contains(selected, id)) {
        this._checkboxView.setChecked(true);
        this.ui.inlineToolbar.addClass('selected');

        this.hideInlineActions(); // hide if a item was selected by checkbox
      }
    },

    initActionViews: function (options) {
      this.favView = new FavoritesView({
        tagName: 'div',
        focusable: true,
        model: options.model,
        context: options.context,
        tableView: options.tableView
      });

      var selectedModelIds = this._rowStates.get(SearchResultsView.RowStatesSelectedRows);
      var checked = _.contains(selectedModelIds, this.model.get('id'));
      var checkboxTitle = _.str.sformat(lang.selectItem, options.model.get('name'));
      var checkboxAriaLabel = _.str.sformat(lang.selectItemAria, options.model.get('name'));

      var selectable = options.model.get('selectable') !== false;
      this._checkboxView = new CheckboxView({
        checked: checked ? 'true' : 'false',
        disabled: !selectable,
        ariaLabel: checkboxAriaLabel,
        title: checkboxTitle
      });

      this.listenTo(this._checkboxView.model, 'change:checked', function (event) {
        this._markAsSelected(event.changed.checked === 'true');
      });

      this.reservation = new Reservation({
        tagName: 'div',
        model: options.model,
        context: options.context
      });
      options.connector = options.model.connector;
      this.searchMetadataView = new SearchMetadataView({
        rowId: this.cid,
        collection: this.options.metadata,
        model: this.model
      });
      if (!!config.enableBreadcrumb) {
        this.addBreadcrumbs(options);
      }
    },

    _markAsSelected: function (select) {
      var newSelectedModelIds;
      var modelId = this.model.get('id');
      var selectedModelIds = this._rowStates.get(SearchResultsView.RowStatesSelectedRows);
      if (select) {
        if (!_.contains(selectedModelIds, modelId)) {
          newSelectedModelIds = selectedModelIds.concat([modelId]);
          this._rowStates.set(SearchResultsView.RowStatesSelectedRows, newSelectedModelIds);
        }
      } else {
        if (_.contains(selectedModelIds, modelId)) {
          newSelectedModelIds = _.without(selectedModelIds, modelId);
          this._rowStates.set(SearchResultsView.RowStatesSelectedRows, newSelectedModelIds);
        }
      }
    },

    addBreadcrumbs: function (options) {
      var ancestors = new NodeAncestorCollection(
          options.model.attributes.ancestors, {
            node: options.model, autofetch: false
          });
      this.breadcrumbsView = new BreadcrumbsView({
        context: options.context,
        collection: ancestors
      });
      this.breadcrumbsView.synchronizeCollections();
      return true;
    },

    onRender: function (e) {
      this.initActionViews(this.options);
      this.reservationRegion.show(this.reservation);
      if (!!this.model.get("search_result_metadata") &&
          (this.model.get("search_result_metadata").current_version !== false &&
          this.model.get("search_result_metadata").version_type !== "minor") &&
          this.model.get('favorite') !== undefined) { // LPAD-61021) {
        this.favRegion.show(this.favView);
      }
      if (!!config.enableBreadcrumb) {
        this.breadcrumbRegion.show(this.breadcrumbsView);
        this.$el.find('ol.binf-breadcrumb').attr('aria-label',
            this.templateHelpers().itemBreadcrumb);
      }
      this.selectionRegion.show(this._checkboxView);
      this.searchMetadataRegion.show(this.searchMetadataView);

      this._nodeIconView = new NodeTypeIconView({
        el: this.$('.csui-type-icon').get(0),
        node: this.model
      });
      this._nodeIconView.render();

      var summ = this.model.get('summary');
      if (summ.length > 0) {
        summ = summ.replace(/</gi, '&lt;').replace(/>/gi, '&gt;');
        var hhRegEx = /&lt;HH&gt;/gi;
        var hhEndRegEx = /&lt;\/HH&gt;/gi;
        summ.replace(hhRegEx, '<span class="csui-summary-hh">');
        var modded = summ.replace(hhRegEx, '<span class="csui-summary-hh">');
        modded = modded.replace(hhEndRegEx, '</span>');
        this.$el.find('.csui-search-item-desc').html(modded);
      }
    },

    onBeforeDestroy: function () {
      if (this._nodeIconView) {
        this._nodeIconView.destroy();
      }
      if (this.$el && base.isAppleMobile() === false) {
        this.$el.off('mouseenter.' + this.cid, '.csui-search-item-row', this._hoverStart);
        this.$el.off('mouseleave.' + this.cid, '.csui-search-item-row', this._hoverEnd);
      }
    },

    onShow: function (e) {
      this.updateItemdetails(e);
    },

    updateItemdetails: function (e) {
      var self           = this,
          isOverflown    = this.isTextOverflown(this.ui.descriptionField[0]),
          hasDescription = this.hasDescriptionText(this.ui.descriptionField[0]); // for few objects it could be summary.

      if (isOverflown) {
        var _ellipsisEle = $("<span/>", {
          "class": "csui-overflow-ellipsis",
          "html": "&#133;"
        });
        $(this.ui.descriptionField).append(_ellipsisEle);
      }

      if (!!config.enableBreadcrumb && this.breadcrumbsView) {
        this.breadcrumbsView.refresh();
      }

      this.$el.find('.truncated-' + this.cid).hide();

      this.$el.find('.csui-search-item-fav.search-fav-' + this.cid)
          .after(
              '<button class="search-results-item-expand icon-expandArrowDown" title="' +
              lang.showMore + '" aria-expanded="false" aria-label="' + lang.showMoreAria +
              '"></button>')
          .next().on('click', function () {
        $(this).toggleClass('icon-expandArrowUp');
        $('.truncated-' + self.cid).toggle();
        if (this.classList.contains("icon-expandArrowUp")) {
          $(this).removeClass('icon-expandArrowDown').addClass('icon-expandArrowUp').attr('title',
              lang.showLess).attr('aria-expanded', 'true');
          self.ui.descriptionField.addClass("csui-search-item-desc-height").find(
              ".csui-overflow-ellipsis").hide();
        } else {
          $(this).removeClass('icon-expandArrowUp').addClass('icon-expandArrowDown').attr('title',
              lang.showMore).attr('aria-expanded', 'false');
          self.ui.descriptionField.removeClass("csui-search-item-desc-height").find(
              ".csui-overflow-ellipsis").show();
        }
      });

      if (!hasDescription) {   //when there is no description or summary, hide description field and 'Modified' metadata property
        this.ui.descriptionField.addClass("binf-hidden");
        this.ui.modifiedByField.addClass("binf-hidden");
      }
    },

    addOwnerDisplayName: function () {
      var ownerDisplayName = "";
      if (!!this.model.attributes.owner_user_id_expand) {
        ownerDisplayName = this.getDisplayName(this.model.attributes.owner_user_id_expand);
      }
      _.extend(this.model.attributes, {
        owner_display_name: ownerDisplayName
      });
    },

    addCreatedUserDisplayName: function () {
      var createUserDisplayName = "";
      if (!!this.model.attributes.create_user_id_expand) {
        createUserDisplayName = this.getDisplayName(this.model.attributes.create_user_id_expand);
      }
      _.extend(this.model.attributes, {
        create_user_display_name: createUserDisplayName
      });
    },

    getDisplayName: function (userInfo) {
      var displayName = !!userInfo.name_formatted ? userInfo.name_formatted : userInfo.name;
      return displayName;
    },

    hasDescriptionText: function (el) {
      return (el && el.textContent.trim().length > 0);
    },

    isTextOverflown: function (el) {
      var isOverflowing = false;
      if (!!el && el.style) {
        var curOverflow = el.style.overflow;
        if (!curOverflow || curOverflow === "visible") {
          el.style.overflow = "hidden";
        }
        isOverflowing = el.clientWidth < el.scrollWidth
                        || el.clientHeight < el.scrollHeight;
        el.style.overflow = curOverflow;
      }
      return isOverflowing;
    },

    showInlineActions: function () {
      if (this.ui.inlineToolbarContainer.find('.csui-table-actionbar').length === 0) {
        if (this._rowStates.get(SearchResultsView.RowStatesSelectedRows).length > 0) {
          return;
        }

        this.searchMetadataView &&
        this.searchMetadataView.ui.fieldsToBeHiddenOnHover.addClass("binf-hidden");
        if (this.$el.find(".icon-expandArrowDown").length > 0) {
          this.ui.modifiedByField.addClass("binf-hidden");
        }

        this.ui.inlineToolbarContainer.removeClass("binf-hidden");

        var versionId   = this.model.attributes.version_id ?
                          "-" + this.model.attributes.version_id :
                          "",
            selectedRow = $(".csui-search-item-action-" + this.cid + versionId)[0];
        var args = {
          sender: this,
          target: selectedRow,
          node: this.model
        };
        this.trigger("enterSearchRow", args);
      }
    },

    hideInlineActions: function () {
      this.ui.inlineToolbarContainer.addClass("binf-hidden");
      this.ui.metadataDetails.removeClass("binf-hidden");
      this.searchMetadataView &&
      this.searchMetadataView.ui.fieldsToBeHiddenOnHover.removeClass("binf-hidden");
      if (this.$el.find(".icon-expandArrowDown").length > 0) {
        var descLength = this.ui.descriptionField.html().trim().length;
        if (descLength <= 0) {
          this.ui.descriptionField.addClass("binf-hidden");
          this.ui.modifiedByField.addClass("binf-hidden");
        }
      }

      var versionId   = this.model.attributes.version_id ? "-" + this.model.attributes.version_id :
                        "",
          selectedRow = $(".csui-search-item-action-" + this.cid + versionId)[0];
      var args = {
        sender: this,
        target: selectedRow,
        node: []
      };
      this.trigger("leaveSearchRow", args);
    },

    openVersionHistory: function (event) {
      var self         = this,
          args         = {},
          selectedNode = [];
      var versionId   = this.model.attributes.version_id ? "-" + this.model.attributes.version_id :
                        "",
          selectedRow = $(".csui-search-item-action-" + this.cid + versionId)[0];
      selectedNode = this.model;
      args = {
        sender: self,
        target: selectedRow,
        node: selectedNode
      };
      self.trigger("openVersionHistory", args);
    },

    showMetadataInfo: function (event) {
      this.ui.descriptionField.removeClass("binf-hidden");
      this.ui.modifiedByField.removeClass("binf-hidden");
      event.preventDefault();
      event.stopPropagation();
    },

    hideMetadataInfo: function (event) {
      var descLength = this.ui.descriptionField.html().trim().length;
      if (descLength <= 0) {
        this.ui.descriptionField.addClass("binf-hidden");
        this.ui.modifiedByField.addClass("binf-hidden");
      }
      event.preventDefault();
      event.stopPropagation();
    }
  });

  var SearchResultListView = Marionette.CollectionView.extend({

    className: 'binf-list-group',

    childView: SearchResultItemView,
    childViewOptions: function () {
      return {
        context: this.options.context,
        tableView: this.options.layoutView,
        defaultActionController: this.defaultActionController,
        metadata: this.options.metadata,
        rowStates: this._rowStates
      };
    },

    emptyView: NoSearchResultView,
    emptyViewOptions: function () {
      return {
        model: this.emptyModel
      };
    },

    behaviors: {

      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      }

    },

    childEvents: {
      'click:item': 'onClickItem'
    },

    constructor: function SearchResultListView(options) {
      options || (options = {});
      this.context = options.context;
      this._rowStates = options.rowStates;
      Marionette.CollectionView.prototype.constructor.apply(this, arguments);

      BlockingView.delegate(this, options.layoutView);

      this.collection.layoutView = options.layoutView;
      this.emptyModel = new Backbone.Model({
        message: lang.noSearchResultMessage,
        suggestionKeyword: lang.suggestionKeyword,
        searchSuggestion1: lang.searchSuggestion1,
        searchSuggestion2: lang.searchSuggestion2,
        searchSuggestion3: lang.searchSuggestion3,
        searchSuggestion4: lang.searchSuggestion4
      });
      this.listenTo(this.collection, 'request', function () {
        this.emptyModel.set('message', lang.loadingSearchResultMessage);
      });
      this.listenTo(this.collection, 'sync', function () {
        this.emptyModel.set('message', lang.noSearchResultMessage);
        this.$el.find(".csui-no-result-message-wrapper").show();
        var tabElements = this.options.layoutView.facetView &&
                          this.options.layoutView.facetView.$('.csui-facet');
        if (tabElements && tabElements.length) {
          tabElements.prop('tabindex', 0);
        }
      });
      this.listenTo(this.collection, 'error', function () {
        this.emptyModel.set('message', lang.failedSearchResultMessage);
      });
      this.listenTo(this, 'dom:refresh', this._refreshDom);
    },

    collectionEvents: {'reset': 'updateLayoutView'},

    updateLayoutView: function () {
      this.collection.layoutView.expandAllView.pageChange();
    },

    onClickItem: function (target) {
      this.triggerMethod('execute:defaultAction', target.model);
    },

    onScrollTop: function () {
      $('.binf-list-group').scrollTop(0);
    },

    _refreshDom: function () {
      this.$el.addClass("list-group-height");
      this.onScrollTop();
    }
  });

  var SearchResultsView = Marionette.LayoutView.extend({

    className: 'csui-search-results binf-panel binf-panel-default',
    template: layoutTemplate,
    templateHelpers: function () {
      var messages = {
        customSearchTab: lang.customSearchTab,
        searchFilterTab: lang.searchFilterTab,
        enableCustomSearch: this.enableCustomSearch
      };
      return {
        messages: messages
      };
    },

    ui: {
      toolBarContainer: '.csui-search-tool-container',
      customSearchContainer: '.csui-search-results-custom',
      facetView: '#facetview',
      customViewTab: '.csui-search-custom-tab',
      facetViewTab: '.csui-search-facet-tab',
      searchResultsContent: '.csui-search-results-content',
      searchResultsBody: ".csui-search-results-body",
      searchSidePanel: ".csui-search-left-panel"
    },

    events: {
      'click @ui.customViewTab': 'openCustomView',
      'click @ui.facetViewTab': 'openFacetView',
      'keypress @ui.customViewTab': 'openCustomView',
      'keypress @ui.facetViewTab': 'openFacetView'
    },

    regions: {
      headerRegion: '#header',
      toolbarRegion: '#toolbar',
      resultsRegion: '#results',
      paginationRegion: '#pagination',
      selectAllRegion: '#selectAllCheckBox',
      expandAllRegion: '#expandAllArrow',
      sortingRegion: '#csui-search-sort',
      customSearchRegion: '#csui-search-custom-container',
      facetBarRegion: '#facetbarview',
      facetRegion: '#facetview'
    },

    behaviors: {

      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: '.csui-result-list',
        suppressScrollX: true,
        scrollYMarginOffset: 15
      },
      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      }

    },

    constructor: function SearchResultsView(options) {
      options || (options = {});
      options.data || (options.data = {});
      options.pageSize || (options.pageSize = 10);

      options.toolbarItems || (options.toolbarItems = toolbarItems);
      options.toolbarItemsMasks || (options.toolbarItemsMasks = new ToolbarItemsMasks());

      this.context = options.context;
      if (!options.query) {
        options.query = this.context.getModel(SearchQueryModelFactory);
      }

      if (options.collection) {
        if (!options.collection.fetched) {
          this._originalScope = options.collection.getResourceScope();
        }
      } else {
        options.collection = this.context.getModel(SearchResultsCollectionFactory, options);
      }
      if (!options.collection.fetched) {
        options.collection.setResourceScope(
            SearchResultsCollectionFactory.getDefaultResourceScope());
        options.collection.setDefaultActionCommands(
            defaultActionItems.getAllCommandSignatures(commands));
        options.collection.setEnabledDelayRestCommands(true);
        if (options.collection.delayedActions) {
          this.listenTo(options.collection.delayedActions, 'error',
              function (collection, request, options) {
                var error = new base.Error(request);
                GlobalMessage.showMessage('error', error.message);
              });
        }
      }

      Marionette.LayoutView.prototype.constructor.call(this, options);
      this._rowStates = new Backbone.Model();
      this._rowStates.set(SearchResultsView.RowStatesSelectedRows, []);

      this.metadata = options.metadata ||
                      this.context.getCollection(SearchMetadataFactory, options);
      this.query = options.query;
      this.collection.setLimit(0, options.pageSize, false);
      this._toggleCustomSearch();

      this.commandController = new ToolbarCommandController({commands: commands});
      this.listenTo(this.commandController, 'after:execute:command', this._toolbarCommandExecuted);

      this.setSearchHeader();
      var self = this;
      this.listenTo(this.headerView, "go:back", function () {
        self.trigger("go:back");
      });
      this.listenTo(this.headerView, "toggle:filter", this._completeFilterCommand);
      this.listenTo(this.headerView, "focus:filter", this._focusFilter);

      this.facetFilters = this.collection.searchFacets;
      this._setToolBar();
      this.setResultView();
      this.setPagination();
      this.setSelectAllView();
      this.setSortingView();
      this.setExpandAllView();
      this.setInlineActionBarEvents();
      this._setFacetBarView();
      if (this.enableCustomSearch) {
        this.setCustomSearchView();
        this.listenTo(this.customSearchView, "change:title", this.updateHeaderTitle);
      }

      if (this.options.blockingParentView) {
        BlockingView.delegate(this, this.options.blockingParentView);
      } else {
        BlockingView.imbue(this);
      }
      this.listenTo(this.query, 'change', function () {
        this._updatePanels();
        if (this.collection.isFetchable()) {
          this.facetFilters.clearFilter();
          this.paginationView.nodeChange();
          this.collection.fetch({
            error: _.bind(this.onSearchResultsFailed, this, options)
          });

          this._removeAllSelections();
          this.expandAllView.pageChange();
          this.resetScrollToTop();
        }
      });
      this.listenTo(this.options.context, 'request', this.blockActions)
          .listenTo(this.options.context, 'sync', this.unblockActions)
          .listenTo(this.options.context, 'error', this.unblockActions)
          .listenTo(this.collection, "request", this.blockActions)
          .listenTo(this.collection, "sync", this.unblockSearchResultsAction)
          .listenTo(this.collection, "sync", this.updateActionToolBar)
          .listenTo(this.collection, "error", this.unblockActions)
          .listenTo(this.collection, "destroy", this.unblockActions)
          .listenTo(this.collection, "sync", this.updateScrollbar)
          .listenTo(this.collection, "sync", this._removeAllSelections)
          .listenTo(this.collection, "sync", this._focusOnFirstSearchResultElement)
          .listenTo(this.collection, "new:page", this.resetScrollToTop);

      !base.isMozilla() && this.propagateEventsToRegions();
      this.onWinRefresh = _.bind(this.windowRefresh, this);
      $(window).bind("resize.app", this.onWinRefresh);
      if (this.enableCustomSearch) {
        this.listenToOnce(this, 'dom:refresh', _.bind(function () {
          if (this.$el.width() > 1023) {
            this.ui.searchSidePanel.addClass('csui-is-visible');
            this.ui.searchResultsBody.addClass('csui-search-results-body-right');
          } else {
            this.ui.searchSidePanel.addClass("search-side-panel-overlay");
            this.ui.searchSidePanel.addClass("search-side-panel-auto");
          }
        }, this));
      }
    },
    _removeAllSelections: function () {
      this._rowStates.set(SearchResultsView.RowStatesSelectedRows, []);
    },

    _focusFilter: function (view) {
      !!view && view.headerView.ui.filter.focus();
      if (this.ui.searchSidePanel.hasClass('csui-is-visible')) {
        !!view && view.headerView.ui.filter.attr("aria-label", lang.filterCollapseAria);
        !!view && view.headerView.ui.filter.attr("aria-expanded", true);
      } else {
        !!view && view.headerView.ui.filter.attr("aria-label", lang.filterExpandAria);
        !!view && view.headerView.ui.filter.attr("aria-expanded", false);
      }
      var tabElements = this.facetView && this.facetView.$('.csui-facet');
      if (tabElements && tabElements.length) {
        tabElements.prop('tabindex', 0);
      }
    },
    onSearchResultsFailed: function (model, request, message) {
      var error = new base.RequestErrorMessage(message);
      ModalAlert.showError(error.toString());
    },
    updateScrollbar: function () {
      this.triggerMethod('update:scrollbar', this);
    },
    _focusOnFirstSearchResultElement: function () {
      this.$el.find(".binf-list-group-item:first-child .csui-search-item-name > a").focus();
    },
    resetScrollToTop: function () {
      var scrollContainer = this.$('#results');
      scrollContainer.scrollTop(0);
    },
    updateActionToolBar: function () {
      if (this.collection.totalCount === 0) {
        this.ui.toolBarContainer.addClass('binf-hidden');
        if (!this.enableCustomSearch) {
          this.ui.customSearchContainer.addClass('binf-hidden');
        }
      } else {
        this.ui.toolBarContainer.removeClass('binf-hidden');
        this.ui.customSearchContainer.removeClass('binf-hidden');
      }
    },
    unblockSearchResultsAction: function () {
      this.unblockActions();
      if (this.collection.models.length > 0) {
        this.$el.find(".binf-list-group").removeClass("list-group-height-noresults");
        this.$el.find(".csui-search-results-content").removeClass("csui-search-noresults");
      } else {
        this.$el.find(".binf-list-group").addClass("list-group-height-noresults");
        this.$el.find(".csui-search-results-content").addClass("csui-search-noresults");
      }
    },
    _toggleCustomSearch: function () {
      this.enableCustomSearch = !!this.options.customSearchView || this.query.get("query_id") &&
                                Object.keys(
                                    this.query.attributes).length >
                                1;
      if (this.enableCustomSearch) {
        this.$el.find("#csui-search-custom-container").addClass('csui-search-custom-container');
        this.$el.find("#csui-search-custom-results").addClass("csui-search-custom-results");
        this.$el.find(".csui-search-custom-tab").addClass('binf-active');
      } else {
        if (this.customSearchView && this.query.get("where")) {
          this.customSearchRegion.empty();
          this.$el.find("#csui-search-custom-container").removeClass(
              'csui-search-custom-container');
          this.$el.find("#csui-search-custom-results").removeClass("csui-search-custom-results");
        }
      }
    },

    _updatePanels: function () {
      this._toggleCustomSearch();
      if (!this.enableCustomSearch) {
        if (this.ui.searchSidePanel.hasClass('csui-is-visible')) {
          var view = this;
          this.ui.searchSidePanel.one(this._transitionEnd(),
              function () {
                view.$el.find(".csui-search-results-custom").hide();
                view.$el.find(".csui-search-left-panel-tabs").hide();
                if (!view.ui.searchSidePanel.hasClass('csui-is-visible')) {
                  view.ui.searchSidePanel.addClass('csui-is-hidden');
                }
                view.ui.facetView.show();
              });
          this.ui.searchResultsBody.removeClass("csui-search-results-body-right");
          this.ui.searchSidePanel.removeClass("csui-is-visible");
        } else {
          this.$el.find(".csui-search-results-custom").hide();
          this.$el.find(".csui-search-left-panel-tabs").hide();
          this.ui.facetView.show();
        }
      } else {
        this.$el.find(".csui-search-results-custom").show();
        this.$el.find(".csui-search-left-panel-tabs").show();
        this.ui.searchResultsBody.addClass("csui-search-results-body-right");
      }
      if (this.headerView) {
        this.headerView.options.useCustomTitle = this.enableCustomSearch;
      }
      if (this.facetView) {
        this.facetView.options.data.showTitle = !this.enableCustomSearch;
        this.facetView.render();
      }
    },

    openCustomView: function (e) {
      if (this.enableCustomSearch) {
        if ((e.type === 'keypress' && e.keyCode === 13) || (e.type === 'click')) {
          this.ui.facetView.hide();
          this.$el.find(".csui-search-results-custom").show();
          this.$el.find(".csui-search-facet-tab").removeClass('binf-active');
          this.$el.find(".csui-search-custom-tab").addClass('binf-active');
          e.stopPropagation();
        }
      }
    },

    openFacetView: function (e) {
      if (this.enableCustomSearch) {
        this._ensureFacetPanelViewDisplayed();
        if ((e.type === 'keypress' && e.keyCode === 13) || (e.type === 'click')) {
          this.$el.find(".csui-search-results-custom").hide();
          this.ui.facetView.show();
          this.$el.find(".csui-search-custom-tab").removeClass('binf-active');
          this.$el.find(".csui-search-facet-tab").addClass('binf-active');
          e.stopPropagation();
        }
      }
    },

    onDestroy: function () {
      $(window).unbind("resize.app", this.onWinRefresh);
      if (this._originalScope) {
        this.options.collection.setResourceScope(this._originalScope);
      }

    },
    windowRefresh: function () {
      this.facetView && this.facetView.triggerMethod('dom:refresh');
      if (this._selectAllView) {
        this._selectAllView.triggerMethod('dom:refresh');
      }
      if (this.expandAllView) {
        this.expandAllView.triggerMethod('dom:refresh');
      }
      var panelPosition = this.ui.searchSidePanel.css("position");
      if (panelPosition != "absolute") {
        if (this.$el.width() > 1023 &&
            this.ui.searchSidePanel.hasClass("search-side-panel-overlay")) {
          this.ui.searchSidePanel.removeClass("search-side-panel-overlay");
          if (this.ui.searchSidePanel.hasClass("search-side-panel-auto")) {
            this.ui.searchSidePanel.removeClass("search-side-panel-auto");
            this._completeFilterCommand(this, true);
          }
        }
      } else if (!this.ui.searchSidePanel.hasClass("search-side-panel-auto") &&
                 !this.ui.searchSidePanel.hasClass("search-side-panel-overlay")) {
        this.ui.searchSidePanel.addClass("search-side-panel-overlay");
        if (this.ui.searchSidePanel.hasClass("csui-is-visible")) {
          this.ui.searchSidePanel.addClass("search-side-panel-auto");
          this._completeFilterCommand(this, true);
        }
      }
    }
    ,

    setSearchHeader: function () {
      this.headerView = new HeaderView({
        collection: this.collection,
        filter: this.options.searchString,
        context: this.options.context,
        enableBackButton: this.options.enableBackButton,
        backButtonToolTip: this.options.backButtonToolTip,
        enableFacetFilter: config.enableFacetFilter, // LPAD-60082: Enable/disable facets
        useCustomTitle: this.enableCustomSearch,
        commands: commands,
        originatingView: this,
        titleView: this.options.titleView
      });
      return true;
    },

    _setToolBar: function () {
      var self       = this,
          parentNode = new NodeModel({id: undefined},
              {connector: this.collection.connector});
      this.collection.node = parentNode;
      this.toolbarView = new TableToolbarView({
        toolbarItems: this.options.toolbarItems,
        toolbarItemsMasks: this.options.toolbarItemsMasks,
        collection: this.collection,
        originatingView: this,
        context: this.options.context,
        toolbarCommandController: this.commandController,
        events: function () {
          return _.extend({}, TableToolbarView.prototype.events, {
            'keydown': self.onKeyInViewInToolbarView
          });
        }
      });
      this.listenTo(this.toolbarView, 'refresh:tabindexes', function () {
        this.toolbarView.$el.find('.csui-otherToolbar>ul>li>a:visible').attr('tabindex', 0);
      });
    },

    onKeyInViewInToolbarView: function (event) {
      switch (event.keyCode) {
      case 37:
        event.preventDefault();
        event.stopPropagation();
        break;
      case 39:
        event.preventDefault();
        event.stopPropagation();
        break;
      }
    },

    setResultView: function () {
      this.resultsView = new SearchResultListView({
        context: this.options.context,
        collection: this.collection,
        layoutView: this,
        filter: this.options.searchString,
        metadata: this.metadata,
        rowStates: this._rowStates
      });
      return true;
    },

    setPagination: function () {
      this.paginationView = new PaginationView({
        collection: this.collection,
        pageSize: this.options.pageSize,
        defaultDDList: [10, 25, 50, 100] // LPAD-48290, to make consistent with classic console
      });
      return true;
    },

    _calculateSelectAllCheckedStatus: function () {
      var selected = this._rowStates.get(SearchResultsView.RowStatesSelectedRows);
      var all = selected.length === this.collection.length;
      if (selected.length > 0 && !all) {
        return 'mixed';
      } else {
        return selected.length > 0;
      }
    },

    _updateSelectAllCheckbox: function () {
      if (this._selectAllView) {
        this._selectAllView.setChecked(this._calculateSelectAllCheckedStatus());
        this._selectAllView.setDisabled(this.collection.length === 0);
      }
    },

    setSelectAllView: function () {
      this._selectAllView = new CheckboxView({
        checked: this._calculateSelectAllCheckedStatus(),
        disabled: this.collection.length === 0,
        ariaLabel: lang.selectAllAria,
        title: lang.selectAll
      });

      this.listenTo(this._selectAllView, 'clicked', function (e) {
        e.cancel = true;  // don't update checkbox immediately

        var checked = this._selectAllView.model.get('checked'); // state before clicking cb

        switch (checked) {
        case 'true':
          this._rowStates.set(SearchResultsView.RowStatesSelectedRows, []);
          break;
        default:
          var selectedModelIds = [];
          this.collection.each(function (model) {
            if (model.get('selectable') !== false) {
              selectedModelIds.push(model.get('id'));
            }
          });
          this._rowStates.set(SearchResultsView.RowStatesSelectedRows, selectedModelIds);
        }
      });

      this.listenTo(this._rowStates, 'change:' + SearchResultsView.RowStatesSelectedRows,
          function () {
            this._updateSelectAllCheckbox();
          });

      this.listenTo(this.collection, 'reset', function () {
        this._updateSelectAllCheckbox();
      });
    },

    setExpandAllView: function () {
      this.expandAllView = new ExpandAllView({
        collection: this.collection,
        view: this.resultsView,
        _eleCollapse: "icon-expandArrowUp",
        _eleExpand: "icon-expandArrowDown"
      });
      return true;
    },

    setSortingView: function () {
      this.sortingView = new SortingView({
        collection: this.collection
      });
      return true;
    },

    setCustomSearchView: function () {
      this.customSearchView = this.options.customSearchView || new SearchObjectView({
        context: this.options.context,
        savedSearchQueryId: this.query.get("query_id"),
        customValues: this.query,
        parentView: this
      });
      return true;
    },
    _toolbarCommandExecuted: function (context) {
      if (context && context.commandSignature) {
        this._updateToolItems();
        if (!!context.command && !!context.command.allowCollectionRefetch &&
            this.collection.totalCount > this.collection.topCount) {
          this.collection.fetch();
        }
      }
    },

    setInlineActionBarEvents: function () {
      this.listenTo(this.resultsView, 'childview:enterSearchRow',
          this._showInlineActionBarWithDelay);
      this.listenTo(this.resultsView, 'childview:openVersionHistory',
          this.openVersionHistory);
      this.listenTo(this.resultsView, 'childview:leaveSearchRow', this._actionBarShouldDestroy);
      this.listenTo(this.collection, "reset", this._destroyInlineActionBar);
      this.listenTo(this.collection, "remove", this._updateToolItems);
      this.listenTo(this._rowStates, 'change:' + SearchResultsView.RowStatesSelectedRows,
          this._updateToolItems);
    },

    _updateToolItems: function () {
      if (this.toolbarView) {
        var selectedModelIds = this._rowStates.get(SearchResultsView.RowStatesSelectedRows);
        var nodes = [];
        _.each(selectedModelIds, function (id) {
          nodes.push(this.collection.findWhere({id: id}));
        }, this);
        if (nodes && nodes.length === 1) {
          this.toolbarView.options.collection.node = nodes[0].parent;
        } else {
          this.toolbarView.options.collection.node = new NodeModel({id: undefined},
              {connector: this.collection.connector});
        }
        this.toolbarView.updateForSelectedChildren(nodes);
      }
    },

    _showInlineActionBar: function (args) {
      if (!!args) {
        this._savedHoverEnterArgs = null;

        var parentId = args.node.get('parent_id');
        if (parentId instanceof Object) {
          parentId = args.node.get('parent_id').id;
        }
        var parentNode = new NodeModel({id: parentId},
            {connector: args.node.connector});

        this.inlineToolbarView = new TableActionBarView(_.extend({
              context: this.options.context,
              commands: commands,
              delayedActions: this.collection.delayedActions,
              collection: this.options.toolbarItems.inlineToolbar,
              toolItemsMask: this.options.toolbarItemsMasks.toolbars.inlineToolbar,
              container: parentNode,
              containerCollection: this.collection,
              model: args.node,
              originatingView: this
            }, this.options.toolbarItems.inlineToolbar.options)
        );

        this.listenTo(this.inlineToolbarView, 'after:execute:command',
            this._toolbarCommandExecuted);
        this.inlineToolbarView.render();
        this.listenTo(this.inlineToolbarView, 'destroy', function () {
          this.inlineToolbarView = undefined;
          if (this._savedHoverEnterArgs) {
            this._showInlineActionBarWithDelay(this._savedHoverEnterArgs);
          }
        }, this);
        $(args.target).append(this.inlineToolbarView.$el).css("display", "block")
            .addClass('csui-table-cell-name-appendix-full');
        this.inlineToolbarView.triggerMethod("show");
      }
    },

    _showInlineActionBarWithDelay: function (_view, args) {
      if (this._showInlineActionbarTimeout) {
        clearTimeout(this._showInlineActionbarTimeout);
      }
      var self = this;
      this._showInlineActionbarTimeout = setTimeout(function () {
        self._showInlineActionbarTimeout = undefined;
        if (!self.resultsView.lockedForOtherContols) {
          self._showInlineActionBar.call(self, args);
        }
      }, 200);
    },

    _actionBarShouldDestroy: function (_view, args) {
      if (this._showInlineActionbarTimeout) {
        clearTimeout(this._showInlineActionbarTimeout);
        this._showInlineActionbarTimeout = undefined;
      }
      if (this.inlineToolbarView) {
        this.inlineToolbarView.destroy();
      }
    },

    _destroyInlineActionBar: function () {
      if (this.inlineToolbarView) {
        this.inlineToolbarView.destroy();
        this.inlineToolbarView = undefined;
      }
    },

    openVersionHistory: function (args) {
      var nodes = new NodeCollection();
      nodes.push(args.model);
      var status = {
        nodes: nodes,
        container: args.model.collection.node,
        collection: args.model.collection,
        selectedTab: new Backbone.Model({title: 'Versions'})
      };
      status = _.extend(status, {originatingView: this});
      var propertiesCmd = new PropertiesCommand();
      propertiesCmd.execute(status, this.options)
          .always(function (args) {
          });
    },

    onRender: function () {
      var self = this;
      this.headerRegion.show(this.headerView);
      this.toolbarRegion.show(this.toolbarView);
      this.resultsRegion.show(this.resultsView);
      this.paginationRegion.show(this.paginationView);
      this.selectAllRegion.show(this._selectAllView);
      this.sortingRegion.show(this.sortingView);
      this.expandAllRegion.show(this.expandAllView);
      if (this.enableCustomSearch) {
        this.customSearchRegion.show(this.customSearchView);
      }
      if (this.facetBarView) {
        this.facetBarRegion.show(this.facetBarView);
      }

      if (this.enableCustomSearch) {
        this.ui.facetView.hide();
        this.ui.searchSidePanel.removeClass('csui-is-hidden');
      } else {
        this.ui.searchSidePanel.removeClass('csui-is-visible');
        var view = this;
        this.ui.searchSidePanel.one(this._transitionEnd(),
            function () {
              if (!view.ui.searchSidePanel.hasClass('csui-is-visible')) {
                view.ui.searchSidePanel.addClass('csui-is-hidden');
              }
            });
      }
      this._toggleCustomSearch();
      this.$('.csui-result-list').on('scroll', function () {
        self.trigger('scroll');
      });
    },

    _ensureFacetPanelViewDisplayed: function () {
      if (this.facetView === undefined) {
        this._setFacetPanelView();
        this.facetRegion.show(this.facetView);
      }
    },

    _setFacetPanelView: function () {
      this.facetView = new FacetPanelView({
        collection: this.facetFilters,
        blockingLocal: true,
        showTitle: !this.enableCustomSearch
      });
      this.listenTo(this.facetView, 'remove:filter', this._removeFacetFilter)
          .listenTo(this.facetView, 'remove:all', this._removeAll)
          .listenTo(this.facetView, 'apply:filter', this._addToFacetFilter);
    },

    _removeFacetPanelView: function () {
      this.facetRegion.empty();
      this.facetView = undefined;
    },

    _setFacetBarView: function () {
      this.facetBarView = new FacetBarView({
        collection: this.facetFilters
      });
      this.listenTo(this.facetBarView, 'remove:filter', this._removeFacetFilter)
          .listenTo(this.facetBarView, 'remove:all', this._removeAll)
          .listenTo(this.facetBarView, 'facet:bar:visible', this._handleFacetBarVisible)
          .listenTo(this.facetBarView, 'facet:bar:hidden', this._handleFacetBarHidden);
    },

    _addToFacetFilter: function (filter) {
      this.facetFilters.addFilter(filter);
      this.collection.setDefaultPageNum();
      this.collection.fetch();
      this.resetScrollToTop();
    },

    _removeFacetFilter: function (filter) {
      this.facetFilters.removeFilter(filter);
      this.collection.setDefaultPageNum();
      this.collection.fetch();
      this.resetScrollToTop();
    },

    _removeAll: function () {
      this.facetFilters.clearFilter();
      this.collection.setDefaultPageNum();
      this.collection.fetch();
      this.resetScrollToTop();
    },

    _completeFilterCommand: function (view, flag) {
      var panelPosition = view.ui.searchSidePanel.css("position");
      if (panelPosition === "absolute" && flag === undefined) {
        view.ui.searchSidePanel.removeClass("search-side-panel-auto");
        view.ui.searchSidePanel.addClass("search-side-panel-overlay");
      }
      view.showSidePanel = !view.ui.searchSidePanel.hasClass("csui-is-visible");
      if (view.showSidePanel) {
        view._ensureFacetPanelViewDisplayed();
        view.ui.searchSidePanel.removeClass('csui-is-hidden');
        view.ui.searchSidePanel.one(view._transitionEnd(),
            function () {
              if (base.isMSBrowser()) {
                if (view.ui.searchSidePanel.hasClass('csui-is-visible')) {
                  view.ui.searchResultsBody.addClass('csui-search-results-body-right');
                }
              }
              view.triggerMethod('dom:refresh');
              if (view.paginationView) {
                view.paginationView.triggerMethod('dom:refresh');
              }
            }).addClass('csui-is-visible');
        if (!base.isMSBrowser()) {
          if (view.ui.searchSidePanel.hasClass('csui-is-visible')) {
            view.ui.searchResultsBody.addClass('csui-search-results-body-right');
          }
        }
      } else {
        view.ui.searchSidePanel.one(view._transitionEnd(),
            function () {
              if (!view.ui.searchSidePanel.hasClass('csui-is-visible')) {
                view.ui.searchSidePanel.addClass('csui-is-hidden');
              }
              view.triggerMethod('dom:refresh');
              view._removeFacetPanelView();
              if (view.paginationView) {
                view.paginationView.triggerMethod('dom:refresh');
              }
            }).removeClass('csui-is-visible');
        view.ui.searchResultsBody.removeClass('csui-search-results-body-right');
      }
      this.facetView && this.facetView.triggerMethod('dom:refresh');
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

    updateHeaderTitle: function () {
      this.headerView.setCustomSearchTitle(this.options.title);
    },

    _handleFacetBarVisible: function () {
      this.ui.searchResultsContent.addClass('csui-facetbarviewOpened');
      this.ui.searchResultsContent.find(".csui-facet-list-bar .csui-facet-item:last a").focus();
    },

    _handleFacetBarHidden: function () {
      this.ui.searchResultsContent.removeClass('csui-facetbarviewOpened');
      this.headerView.trigger("refresh:tabindexes");
    }
  }, {
    RowStatesSelectedRows: 'selected'
  });

  _.extend(SearchResultsView.prototype, LayoutViewEventsPropagationMixin);

  return SearchResultsView;

});
