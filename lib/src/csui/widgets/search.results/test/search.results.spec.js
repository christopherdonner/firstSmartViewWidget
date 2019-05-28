/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/lib/underscore', 'csui/widgets/search.results/search.results.view',
  'csui/utils/contexts/page/page.context',
  'csui/utils/contexts/factories/search.results.factory',
  'csui/utils/contexts/factories/search.query.factory',
  'csui/utils/contexts/factories/search.metadata.factory',
  'csui/widgets/search.box/search.box.view',
  './search.results.mock.js'
], function ($, _, SearchResultsView, PageContext, SearchResultsCollectionFactory,
    SearchQueryModelFactory, SearchMetadataFactory, SearchBoxView, mock) {

  xdescribe('SearchResultsView', function () {

    describe('given empty configuration', function () {

      var pageContext, searchResultsView, collection, searchBoxView, query;

      beforeEach(function () {
        mock.enable();
        if (!pageContext) {
          pageContext = new PageContext({
            factories: {
              connector: {
                connection: {
                  url: '//server/otcs/cs/api/v1',
                  supportPath: '/support',
                  session: {
                    ticket: 'dummy'
                  }
                }
              }
            }
          });
        }
        var params                   = {},
            searchQueryModel         = pageContext.getModel(SearchQueryModelFactory),
            searchMetadataCollection = pageContext.getCollection(SearchMetadataFactory);
        params['where'] = "*";
        searchQueryModel.set(params, {silent: true});
        searchBoxView = new SearchBoxView({
          context: pageContext
        });
        searchBoxView.render();
        searchResultsView = new SearchResultsView({
          context: pageContext
        });
        searchResultsView.render();
        pageContext.fetch();
        this.searchMetadata = searchMetadataCollection;
        this.view = searchResultsView;
        this.row = searchResultsView.$el.find(".csui-search-item-complete-row").first().parent();
        this.alternateHeaderRow = searchResultsView.$el.find(".csui-otherToolbar");
      });

      afterEach(function () {
        mock.disable();
      });

      it('can be constructed', function () {
        expect(searchResultsView instanceof SearchResultsView).toBeTruthy();
      });

      it('assigns right classes', function () {
        var className = searchResultsView.$el.attr('class');
        expect(className).toBeDefined();
        var classes = className.split(' ');
        expect(classes).toContain('csui-search-results');
      });

      it("click search icon", function () {
        expect(searchBoxView.isSearchInputVisible()).toBeFalsy();
        searchBoxView.ui.searchIcon.click();
      });

      it('should fetch the model from SearchResultsCollection[Low]', function () {
        var searchResultsCollection = pageContext.getModel(
            SearchResultsCollectionFactory);
        expect(searchResultsCollection.isFetchable()).toBeTruthy();
      });

      it('validate search results header title displayed with backend response', function (done) {
        searchBoxView.ui.searchIcon.click();
        setTimeout(function () {
          collection = searchResultsView.collection;
          var searchHeaderTitle = collection.searching ? collection.searching.result_title : "";
          var headerTitle = searchResultsView.headerView.$el.find("#resultsTitle").text();
          expect(searchHeaderTitle).toEqual(headerTitle);
          done();
        }, 400);
      });

      it('validate pagination page size displayed with backend response[Medium]', function () {
        var searchPageSize = searchResultsView.options.pageSize;
        var pageSize = searchResultsView.paginationRegion.$el.find(".csui-pageSize").text();
        pageSize = parseInt((pageSize.match(/\d/g)).join(""));
        expect(searchPageSize).toEqual(pageSize);
      });

      it('validate search results metadata', function () {
        var metadataCollectionLength = this.searchMetadata.models.length;
        expect(metadataCollectionLength).toBeGreaterThan(0);
      });

      it('validate Search results total count displayed at Search Results Header and Footer with' +
         ' backend' +
         ' response[Medium]', function () {
        var searchHeaderTotalCount = searchResultsView.collection.totalCount;
        var headerTotalCount = searchResultsView.$el.find("#headerCount").text();
        headerTotalCount = parseInt((headerTotalCount.match(/\d/g)).join(""));
        var footerTotalCount = searchResultsView.$el.find(".csui-total-container-items").text();
        footerTotalCount = parseInt((footerTotalCount.match(/\d/g)).join(""));
        expect(searchHeaderTotalCount).toEqual(headerTotalCount);
        expect(searchHeaderTotalCount).toEqual(footerTotalCount);
      });

      it('should render the folder node properly[High]', function () {
        var itemView = searchResultsView.$el.find(".csui-search-item-row").first();
        var itemName = itemView.find(".csui-search-item-name").length;
        expect(itemName).toEqual(1);
        var searchItemName = searchResultsView.collection.models[0].attributes.name;
        itemName = (itemView.find(".csui-search-item").text()).trim();
        expect(searchItemName).toEqual(itemName);
        var breadCrumb = itemView.find(".binf-breadcrumb").length;
        expect(breadCrumb).toEqual(1);
        var mimeIcon = itemView.find(".csui-search-item-icon").length;
        expect(mimeIcon).toEqual(1);
        var favIcon = itemView.find(".csui-search-item-fav").length;
        expect(favIcon).toEqual(1);
        var checkBox = itemView.find(
            ".csui-selected-checkbox.csui-checkbox-primary").length;
        expect(checkBox).toEqual(1);
        var searchCreated = searchResultsView.collection.models[0].attributes.create_date;
        var created = "2016-06-16T04:17:57";
        expect(searchCreated).toEqual(created);
        var searchModify = searchResultsView.collection.models[0].attributes.modify_date;
        var modified = "2017-04-28T01:10:27";
        expect(searchModify).toEqual(modified);

      });

      it('should show open Expand all in SearchResultsView for a single Item View[Medium]',
          function () {
            var itemView = searchResultsView.$el.find(".csui-search-item-row").first();
            var expandArrowDown = itemView.find(
                ".search-results-item-expand.icon-expandArrowDown").length;
            var expandArrowUp = itemView.find(
                ".search-results-item-expand.icon-expandArrowUp").length;
            expect(expandArrowDown).toEqual(1);
            expect(expandArrowUp).toEqual(0);
            itemView.find(
                ".search-results-item-expand.icon-expandArrowDown").trigger("click");
            expandArrowDown = itemView.find(
                ".search-results-item-expand.icon-expandArrowDown").length;
            expandArrowUp = itemView.find(
                ".search-results-item-expand.icon-expandArrowUp").length;
            expect(expandArrowUp).toEqual(1);
            expect(expandArrowDown).toEqual(0);
          });

      it('should show Expand all at Search toolbar in SearchResultsView[Medium]', function () {
        var searchToolBar = searchResultsView.$el.find(".csui-search-tool-container");
        var expandAll = searchToolBar.find(".csui-expand-all").length;
        expect(expandAll).toEqual(1);
        var expandAllIcon = searchToolBar.find(
            ".csui-search-header-expand-all.icon-expandArrowDown").length;
        var collapseAllIcon = searchToolBar.find(
            ".csui-search-header-expand-all.icon-expandArrowUp").length;
        expect(expandAllIcon).toEqual(1);
        expect(collapseAllIcon).toEqual(0);
      });

      it('should open Search sort dropdown options at Search toolbar in SearchResultsView[Medium]',
          function () {
            var sortLinks = searchResultsView.$el.find(".cs-sort-links").length;
            expect(sortLinks).toEqual(1);
            var sortDropdown = searchResultsView.$el.find(".csui-search-sort-options").length;
            var sortDropdownOpen = searchResultsView.$el.find(
                ".csui-search-sort-options.binf-open").length;
            expect(sortDropdown).toEqual(1);
            expect(sortDropdownOpen).toEqual(0);
            searchResultsView.sortingView.ui.toggle.trigger('click');
            sortDropdown = searchResultsView.$el.find(".csui-search-sort-options").length;
            sortDropdownOpen = searchResultsView.$el.find(
                ".csui-search-sort-options.binf-open").length;
            expect(sortDropdown).toEqual(1);
            expect(sortDropdownOpen).toEqual(1);
          });

      it('should show select all checkbox at Search toolbar in SearchResultsView[Medium]',
          function () {
            var selectAllCheckBox = searchResultsView.$el.find(
                ".csui-selected-checkbox.csui-checkbox-primary.csui-checkbox-selectAll").length;
            expect(selectAllCheckBox).toEqual(1);
          });

    });

  });

});
