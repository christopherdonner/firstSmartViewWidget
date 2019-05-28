/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  "csui/lib/jquery", "csui/lib/underscore", "csui/lib/marionette",
  'csui/utils/log',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/pagination/impl/keyevent.navigation',
  'csui/controls/mixins/global.alert/global.alert.mixin',
  'i18n!csui/controls/pagination/nls/localized.strings',
  'i18n!csui/controls/pagination/impl/nls/localized.strings',
  'hbs!csui/controls/pagination/impl/nodespagination',
  'css!csui/controls/pagination/impl/nodespagination'
], function ($, _, Marionette, log, TabableRegionBehavior, KeyEventNavigation,
    GlobalAlertMixin, publicLang, lang, template) {
  'use strict';

  var NodesPaginationView = Marionette.ItemView.extend({

    template: template,
    className: 'csui-pager',
    ui: {
      totalCount: '> .csui-total-container-items',
      pageSizeMenu: '> .csui-pagesize-menu',
      dropDownMenu: '> .csui-pagesize-menu > .csui-dropdown > .binf-dropdown-toggle',
      dropDownList: '> .csui-pagesize-menu .csui-dropdown-list',
      navPagingMenu: '> .csui-pagination > .csui-paging-navbar',
      dropDownListItem: '> .csui-pagesize-menu ul.csui-dropdown-list a'
    },

    templateHelpers: function () {
      var totalCount = this._getTotalCount();
      var pageSize = this.pageSize && this.pageSize > 0 ? this.pageSize : 30;
      this.pageTotalAria = totalCount <= pageSize ? _.str.sformat(lang.SinglePageTotalsAria, totalCount) :
        _.str.sformat(lang.PageNTotalsAria, this.currentPageNum, 1 + Math.floor(totalCount / pageSize), totalCount);

      this.nextPagesAria = lang.NextPagesAria;
      this.previousPagesAria = lang.PreviousPagesAria;

      return {
        totalItems: this._getTotalDisplayCount(),
        itemsPerPage: _.str.sformat(lang.PageNavBarItemsPerPage, this.pageSize),
        pageSizeMenuAria: _.str.sformat(lang.PageSizeMenuAria, this.pageSize)
      };
    },

    events: {
      'keyup @ui.dropDownListItem': 'resetPageSizeKeyUp',
      'click .csui-pagesize-menu ul.csui-dropdown-list a': 'resetPageSize',
      'click .csui-paging-navbar > ul > li:not(.csui-overflow) > a': 'onChangePage',
      'click .csui-pagination  li.csui-overflow > a': 'onSlidePageMenu',
      'keydown': 'onKeyInView'
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    constructor: function NodesPaginationView(options) {
      options || (options = {});
      options.pageSize || (options.pageSize = 30);

      Marionette.ItemView.prototype.constructor.call(this, options);

      this.addPaging = true;
      this.currentPageNum = 1;
      this.ddList = this.defaultDDList = options.defaultDDList || [30, 50, 100];
      this.skipCollectionRequest = false;
      this.skipPaginationUpdateRequest = !!options.skipPaginationUpdateRequest;
      this.pageSize = this.selectedPageSize = this.options.pageSize;
      this.rendered = false;
      this.pageTotalAriaLast = undefined;
      this.pageTotalTimeoutHandle = undefined;

      if (this.collection) {
        this.collection.setLimit(0, this.options.pageSize, false);
        this.listenTo(this.collection, 'reset', this.collectionChange); // render after reset of collection
        this.listenTo(this.collection, 'add', this._maintainPageSize); // render after an item upload
        this.listenTo(this.collection, 'remove', this._maintainPageSize); // render after a delete item
        if (this.collection.node) {
          this.listenTo(this.collection.node, 'change:id', this.nodeChange); // render after reset of collection
        }
      }

      this.onWinRefresh = _.bind(this.windowRefresh, this);
      $(window).bind("resize.app", this.onWinRefresh);
      this.prepareForGlobalAlert();
    },

    onDestroy: function () {
      $(window).unbind("resize.app", this.onWinRefresh);
    },

    windowRefresh: function () {
      if (this._isRendered) {
        this._initializePageTabMenu(false, true);
        this.resetActiveChild();
      }
    },

    collectionChange: function () {
      var slideBars = this.$el.find('.csui-paging-navbar ul');

      this.totalCount = 0;
      slideBars.empty();
      slideBars.remove();
      if (this.lastAction !== 'setPageSize') {
        this._reCalculatePageSizes();
      }

      this.lastAction = '';
      this.render();
    },
    nodeChange: function () {
      this.pageSize = this.selectedPageSize = this.options.pageSize;
      this.totalCount = 0;
      this.resetRenderFlags();
      this.resetCollection(0, this.pageSize, false);
      if (this._isRendered) {
        this.setActiveChild(this.ui.dropDownMenu);
      }
    },

    resetRenderFlags: function () {
      this.addPaging = true;
    },
    onChangePage: function (e) {
      e.preventDefault();
      e.stopPropagation();
      var targetPageTab = $(e.currentTarget),
          pageNum       = parseInt(targetPageTab.attr('data-pageid'), 10);
      this.changePage(pageNum);
      this.setActiveChild(targetPageTab);
    },
    changePage: function (pageNum) {
      var pageSize = this.pageSize;
      this.currentPageNum = pageNum + 1;
      var skipCount = pageNum * pageSize;
      this.collection.pagination = this.addPaging;
      this.collection.trigger('new:page');
      this.resetCollection(skipCount, pageSize, true);

      this.templateHelpers();
    },
    resetCollection: function (skipItems, pageSize, autoFetch) {
      this.collection.setLimit(skipItems, pageSize, autoFetch);
    },

    resetPageSizeKeyUp: function(e) {
      if(e.keyCode === 32) {
        this.resetPageSize(e);
      }
      return true;
    },

    resetPageSize: function (e) {
      e.preventDefault();
      e.stopPropagation();
      this.collection.pagination = this.addPaging;
      var newPageSize = parseInt($(e.currentTarget).attr('data-pagesize'), 10);
      this.setPageSize(newPageSize, true);
    },

    setPageSize: function (size, autoFetch) {
      this.pageSize = this.selectedPageSize = size;
      if (this.skipCollectionRequest || !autoFetch) {
        this.skipCollectionRequest = false;
      }
      else {
        this.rendered = false;
        this.resetCollection(0, size, autoFetch);
      }
      this.lastAction = 'setPageSize';
      this.currentPageNum = 1;
    },

    _setPageTotalAria: function() {
      if (this.pageTotalAria!=this.pageTotalAriaLast){
        this.$el.parent().children(".binf-sr-only").html(this.pageTotalAria);
        this.pageTotalAriaLast = this.pageTotalAria;
        this.pageTotalTimeoutHandle = undefined;
      }
    },

    onRender: function () {
      var collection = this.collection;
      var sronlyExists = this.$el.parent().children(".binf-sr-only");
      if (!(sronlyExists && sronlyExists.length)) {
        this.$el.before('<div class="binf-sr-only" aria-live="polite"></div>');
      }
      if (this._validCollection(collection)) {
        this.pageSize = (this.pageSize > this.options.pageSize) &&
                        (this.pageSize > this.totalCount) ? this.totalCount : this.pageSize;
        this.rendered = true;
        this.$el.removeClass('binf-hidden');
        this._initializeDDList();
        if (this.pageTotalTimeoutHandle){
          clearTimeout(this.pageTotalTimeoutHandle);
        }
        this.pageTotalTimeoutHandle = setTimeout(this._setPageTotalAria.bind(this), 1200);
      }
      else {
        this.$el.addClass('binf-hidden');
        if (!this.pageTotalTimeoutHandle) {
          this.pageTotalTimeoutHandle = setTimeout(this._setPageTotalAria.bind(this), 2400);
        }
      }

      this.trigger('render:complete');
    },
    onDomRefresh: function () {
      if (this._validCollection(this.collection) && this.rendered) {
        var totalCount = this.totalCount;
        if (totalCount > this.options.pageSize) {
          this._setPageSizeMenu();
          if (totalCount > this.pageSize) {
            this._initializePageTabMenu(true, true);
          }
        }
        else {
          this._showTotalOnly();
        }
        this.resetActiveChild();
      }
    },
    hidePaging: function () {
      this.$el.find('.csui-pagination').addClass('binf-hidden');
      return true;
    },

    onSlidePageMenu: function (e) {
      e.preventDefault();
      e.stopPropagation();
      var nextPgMenu = parseInt($(e.currentTarget).attr('data-slidepage'), 10);
      this.slidePageMenu(nextPgMenu);
    },
    slidePageMenu: function (nextPgMenu) {
      var el = this.$el;
      this._initializePageTabMenu(true, true, nextPgMenu);
      el.find('.csui-pages-' + nextPgMenu).addClass('csui-slide');

    },

    getDDList: function (tt) {
      var ddItemLists  = this.defaultDDList,
          ddListLength = ddItemLists.length,
          ddList       = [];

      for (var i = 0; i < ddListLength; i++) {
        if (ddItemLists[i] >= tt) {
          ddList.push(tt);
          break;
        }
        ddList.push(ddItemLists[i]);
      }

      return ddList;
    },

    _getOverflowIconWidth: function () {
      if (!this.overFlowIcon || this.overFlowIcon === 0) {
        var overFlowIcon = this.$el.find('.csui-paging-navbar > ul > li.csui-overflow');
        this.overFlowIcon = parseInt(overFlowIcon.css('width'), 10);
      }
      return this.overFlowIcon;
    },

    _getPageTabMinWidth: function () {
      if (!this.pageTabMinWidth || this.pageTabMinWidth === 0) {
        var pageTab = this.$el.find('.csui-paging-navbar > ul > li');
        this.pageTabMinWidth = parseInt(pageTab.css('min-width'), 10);
        pageTab = null;
      }
      this.pageTabMinWidth = 64;
      return this.pageTabMinWidth;
    },
    _initializeDDList: function () {

      this.ddList = this.getDDList(this.totalCount);
    },

    _validCollection: function (collection) {
      var retVal     = false,
          totalCount = this.totalCount;

      if (!collection) {
        log.error('Pagination won\'t be rendered (collection is not set)') &&
        console.error(log.last);
      }
      else {
        var collectionCount = this._getTotalCount(collection);
        this.totalCount = totalCount && totalCount < collectionCount ? totalCount : collectionCount;

        if (collectionCount && collectionCount > 0) {
          retVal = true;
        }
      }

      return retVal;
    },

    _showTotalOnly: function () {
      this.$el.parent().removeAttr('role');
      this.$el.find('.csui-pagesize-menu').addClass('binf-hidden');
      this.$el.find('.csui-pagination').addClass('binf-hidden');
      this.$el.find('.csui-total-container-items').addClass('csui-pagination-top-bottom-padding');
      this.triggerMethod("tabable:not", this);
    },

    _getTotalDisplayCount: function () {
      var collection   = this.collection,
          totalCount   = this._getTotalCount(),
          displayCount = '';

      if (totalCount > 0) {
        displayCount = totalCount === 1 ? lang.PageNavBarSingleItem :
                       totalCount === collection.skipCount + collection.length ?
                       lang.PageNavBarTotalItems : publicLang.PageNavBarAboutItems;

        displayCount = _.str.sformat(displayCount, totalCount);
      }

      return displayCount;
    },

    _setPageSizeMenu: function () {
      var totalCount = this.totalCount;
      if (totalCount > this.options.pageSize) {
        if (this.ddList.length > 1) {
          this._addPageSizeOptions(totalCount);
          this.ui.pageSizeMenu.removeClass('binf-hidden');
        }
        else {
          this.ui.pageSizeMenu.addClass('binf-hidden');
        }
      }
    },

    _addPageSizeOptions: function (tt) {
      var html      = '',
          listArray = [],
          ddList    = this.ddList,
          pageSize  = this.pageSize;

      this.ui.dropDownList[0].innerHTML = '';
      for (var i = ddList.length - 1; i >= 0; i--) {
        var ddListItem = ddList[i],
          txt = (ddListItem === tt) ? lang.PageNavBarShowAll : _.str.sformat(lang.PageNavBarItemsPerPage, ddListItem),
          ariaTxt = _.str.sformat(lang.PageSizeChoiceAria, ddListItem),
          className = (ddListItem === pageSize) ? 'csui-select' : '',
          ariaCurrent = (ddListItem === pageSize) ? ' aria-current="true" ' : '',
          str = '<li role="menuitem">' +
            '<a href="#" class="' +
            className + '" data-pagesize=' + ddListItem + ariaCurrent +
            ' aria-label="' + ariaTxt + '"><span class="csui-pagination-checked icon-listview-checkmark"></span>' +
            txt + '</a></li>';

        listArray.push(str);
        html += str;
      }

      this.ui.dropDownList.append(html);
      return true;
    },

    _initializePageTabMenu: function (forceReset, activateMenu, activeMenu) {
      this.$el.parent().attr('role', 'navigation').attr('aria-label', lang.PaginationLandmarkAria);

      var minPageTabWidth   = this._getPageTabMinWidth(),
          overflowIconWidth = this._getOverflowIconWidth();
      this._setPageTabMenu(minPageTabWidth, overflowIconWidth, forceReset, activateMenu,
          activeMenu);
    },
    _setPageTabMenu: function (minPageTabWidth, nextIconWidth, forceReset, activateMenu,
        activeMenu) {
      var numPages = this.numPages = Math.ceil(this.totalCount / this.pageSize);
      var pageTabsPerMenu = this._getPageTabsPerSlideMenu(minPageTabWidth, nextIconWidth, numPages);
      this.numSlideMenus = Math.ceil(numPages / pageTabsPerMenu);

      if (forceReset || (pageTabsPerMenu !== this.pageTabsPerMenu)) {
        this.pageTabsPerMenu = pageTabsPerMenu;
        activateMenu && this.ui.navPagingMenu.html('');
        this._addSideMenu(this.numSlideMenus, pageTabsPerMenu, numPages, activateMenu, activeMenu);
      }
    },

    _getPageTabsPerSlideMenu: function (minPageTabWidth, nextIconWidth, numPages) {
      var navMenuWidth = this.ui.navPagingMenu.width(),
          pageTabs     = Math.floor(navMenuWidth / minPageTabWidth);
      if (pageTabs < numPages) {
        pageTabs = Math.floor((navMenuWidth - nextIconWidth) / minPageTabWidth);
        pageTabs = (pageTabs * 2 < numPages ) ? pageTabs - 1 : pageTabs;
        (pageTabs <= 0) && (pageTabs = 1);
      }
      return pageTabs;
    },

    _addSideMenu: function (numSlideMenus, pageTabsPerMenu, numPages, activate, currSlideMenu) {

      var navPagingMenu = this.ui.navPagingMenu,
          skipCount     = this.collection.skipCount,
          totalCount    = this.totalCount,
          pageSize      = this.pageSize,
          currPage      = skipCount > totalCount ? numPages - 1 : skipCount / pageSize;

      currSlideMenu = currSlideMenu == null ? Math.floor(currPage / pageTabsPerMenu) :
                      currSlideMenu;
      var startPageNum = currSlideMenu * pageTabsPerMenu;

      var html     = '',
          slideBar = $(
              '<ul class="binf-nav expanded-pager pager-tabs csui-pages csui-pages-' +
              currSlideMenu + '"></ul>');

      if (currSlideMenu > 0) {
        html += '<li class="csui-overflow"><a href="#" tabindex="-1" class="csui-overflow-left" data-slidePage="'
                + (currSlideMenu - 1) +
                '" aria-label="' + this.previousPagesAria + '" title="' + this.previousPagesAria +'"><span class="csui-icon goto_previous_page"></span></a></li>';
      }

      html += this._addPageTabs(startPageNum, currPage, pageTabsPerMenu, numPages);
      if (activate) {
        slideBar.addClass('csui-active');
      }

      if (currSlideMenu < numSlideMenus - 1) {
        html += '<li class="csui-overflow"><a href="#" tabindex="-1" class="csui-overflow-right" data-slidePage="'
                + (currSlideMenu + 1) +
                '" aria-label="' + this.nextPagesAria + '" title="' + this.nextPagesAria + '"><span class="csui-icon goto_next_page"></span></a></li>';
      }
      if (currSlideMenu === numSlideMenus - 1) {
        this.$el.find(".csui-pagination").find(".csui-paging-navbar").addClass(
            "csui-last-slidePage");
      } else {
        this.$el.find(".csui-pagination").find(".csui-paging-navbar").removeClass(
            "csui-last-slidePage");
      }

      slideBar.append(html);
      navPagingMenu.html(slideBar);
    },

    _addPageTabs: function (startPage, currPage, pageTabsPerMenu, numPages) {
      var retVal = false;
      var endPage = ((startPage + pageTabsPerMenu) >= numPages) ? numPages :
                    startPage + pageTabsPerMenu;
      var html = '';

      for (var pageNum = startPage; pageNum < endPage; pageNum++) {
        var txt = pageNum + 1;
        html += '<li><a href="#" tabindex="-1" class="';

        if (( pageNum ) === currPage) {
          html += 'csui-activePage" aria-current="page';
        }

        var showAria = _.str.sformat(lang.ShowPageNAria, txt);
        html += '" data-pageid="' + pageNum + '" aria-label="' + showAria + '" title="' + showAria +'"><span>' + txt + '</span></a></li>';
      }

      return html;

    },

    _reCalculatePageSizes: function () {
      this._calculateSelectPageSize();
      this._reCalculatePageSize();
    },
    _calculateSelectPageSize: function () {

      var selectedPageSize = this.selectedPageSize,
          collectionTotal  = this._getTotalCount(),
          sizeList         = this.defaultDDList;

      this.selectedPageSize = _.indexOf(sizeList, selectedPageSize) > -1 ? selectedPageSize :
                              (selectedPageSize >= collectionTotal) ? collectionTotal :
                              _.find(sizeList, function (size) {
                                return selectedPageSize < size;
                              });
    },

    _reCalculatePageSize: function () {
      var defaultPageSize = this.options.pageSize,
          collectionCount = this._getTotalCount();

      this.pageSize = collectionCount === 0 ? defaultPageSize :
                      ((this.selectedPageSize > collectionCount) ? collectionCount :
                       this.selectedPageSize);
    },
    _maintainPageSize: function (model, collection, trigger) {
      if (model.get('csuiIsSelected')) { model.set('csuiIsSelected', false);}
      this._updateTotalCount(trigger);

      this.resetRenderFlags();
      this._initializeDDList(false);

      if (!this.skipPaginationUpdateRequest &&
          this.collection.models.length > this.selectedPageSize) {
        this.stopListening(this.collection, 'remove');
        this.collection.pop();
        this.listenTo(this.collection, 'remove', this._maintainPageSize); // render after a delete item
      } else if (this.skipPaginationUpdateRequest && !!this.collection.allModels &&
                 this.collection.allModels.length === this.collection.skipCount) {
        this.collection.skipCount = this.collection.skipCount - this.collection.topCount;
      }
      this.skipCollectionRequest = true;
      this._reCalculatePageSizes();
      this.render();
      return true;
    },

    _getTotalCount: function (collection) {
      var totalCount = 0;
      if (!collection) {
        collection = this.collection;
      }
      if (collection) {
        totalCount = collection.filteredCount;
        if (totalCount == null) {
          totalCount = collection.totalCount;
        }
        if (totalCount == null) {
          totalCount = collection.length;
        }
      }
      return totalCount;
    },

    _updateTotalCount: function (trigger) {
      var difference = trigger.add ? 1 : -1;
      this.totalCount += difference;
      if (this.collection.filteredCount != null) {
        this.collection.filteredCount += difference;
      }
      if (this.collection.totalCount != null) {
        this.collection.totalCount += difference;
      }
    }
  });

  _.extend(NodesPaginationView.prototype, KeyEventNavigation);
  _.extend(NodesPaginationView.prototype, GlobalAlertMixin);
  return NodesPaginationView;
});
