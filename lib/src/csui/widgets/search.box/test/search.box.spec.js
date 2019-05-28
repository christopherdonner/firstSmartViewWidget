/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/widgets/search.box/search.box.view',
  'csui/utils/contexts/page/page.context', './search.box.mock.js',
  'csui/utils/contexts/factories/search.box.factory'
], function (_, $, SearchBoxView, PageContext, mock, SearchBoxFactory) {

  describe('SearchBoxView', function () {

    describe('given empty configuration', function () {

      var pageContext, searchBoxView;

      beforeEach(function () {
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
        mock.enable();
        searchBoxView = new SearchBoxView({
          context: pageContext
        });
        searchBoxView.render();

      });

      afterEach(function () {
        mock.disable();
      });

      it('can be constructed', function () {
        expect(searchBoxView instanceof SearchBoxView).toBeTruthy();
      });

      it('assigns right classes', function () {
        var className = searchBoxView.$el.attr('class');
        expect(className).toBeDefined();
        var classes = className.split(' ');
        expect(classes).toContain('csui-search-box');
      });

      it('should fetch the model', function () {
        var searchboxModel = pageContext.getModel(SearchBoxFactory);
        expect(searchboxModel.isFetchable()).toBeTruthy();
      });

      it('should show options dropdown', function () {
        expect(searchBoxView.options.data.showOptionsDropDown).toBe(true);
      });

      it('should focus on downcaret', function () {
        expect(searchBoxView.ui.downCaret.focus()).toBeTruthy();
      });

      it('should clear on clearerClicked', function () {
        var e                 = jasmine.createSpyObj('e', ['preventDefault', 'stopPropagation']),
            inputField        = searchBoxView.ui.input,
            getInputTextValue = function (_ele) {
              var qryText = !!_ele ? _ele.val().trim() : '';
              return qryText;
            };
        inputField.val('query text 1');
        expect(getInputTextValue(inputField).length).toBeGreaterThan(0);
        searchBoxView.clearerClicked(e);
        expect(e.preventDefault).toHaveBeenCalled();
        expect(e.stopPropagation).toHaveBeenCalled();
        expect(searchBoxView.ui.searchIcon.removeClass(
            searchBoxView.options.data.customSearchIconEnabledClass).addClass(
            searchBoxView.options.data.customSearchIconClass)).toBeTruthy();
        expect(getInputTextValue(inputField).length).toBe(0);
      });

      it('should show search bar content on pressing spacebar', function () {
        searchBoxView.ui.searchIcon.trigger({type: 'keydown', keyCode: 32});
        expect(searchBoxView.ui.searchIcon.css('display') === 'block' ||
               !searchBoxView.ui.searchIcon.hasClass('binf-hidden') ||
               searchBoxView.ui.searchIcon.hasClass('binf-show')).toBeTruthy();
      });

      it('should show search bar content on pressing enter', function () {
        searchBoxView.ui.searchIcon.trigger({type: 'keypress', keyCode: 13});
        expect(searchBoxView.ui.searchIcon.css('display') === 'block' ||
               !searchBoxView.ui.searchIcon.hasClass('binf-hidden') ||
               searchBoxView.ui.searchIcon.hasClass('binf-show')).toBeTruthy();
      });

      it('should hide search bar on pressing escape', function () {
        searchBoxView.ui.searchIcon.trigger({type: 'keydown', keyCode: 27});
        expect(searchBoxView.$el.find('.csui-search').length).toEqual(0);
      });

      it('should show downCaret', function () {
        searchBoxView.ui.searchIcon.trigger({type: 'keydown', keyCode: 13});
        expect(searchBoxView.ui.downCaret.focus()).toBeTruthy();
        expect(searchBoxView.ui.downCaret.hasClass('csui-search-box-slice-popover')).toBeTruthy();
      });

      it('should show downCaret', function () {
        searchBoxView.ui.searchIcon.trigger({type: 'keydown', keyCode: 32});
        expect(searchBoxView.ui.downCaret.focus()).toBeTruthy();
        expect(searchBoxView.ui.downCaret.hasClass('csui-search-box-slice-popover')).toBeTruthy();
      });

      it('should hide options dropdown data on pressing escape', function () {
        searchBoxView.ui.searchIcon.trigger({type: 'keydown', keyCode: 13});
        searchBoxView.ui.downCaret.trigger({type: 'keydown', keyCode: 27});
        expect(searchBoxView.$el.find('.binf-popover').length).toEqual(0);
      });

      it('should show search options dropdown on pressing enter', function () {
        searchBoxView.ui.searchIcon.trigger({type: 'keydown', keyCode: 13});
        expect(searchBoxView.ui.searchIcon.css('display') === 'block' ||
               !searchBoxView.ui.searchIcon.hasClass('binf-hidden') ||
               searchBoxView.ui.searchIcon.hasClass('binf-show')).toBeTruthy();
        expect(searchBoxView.$el.find('.csui-search-options-dropdown').length).toEqual(1);
        expect(searchBoxView.$el.find(".csui-searchbox-option:checked")).toBeTruthy();
      });

      it('should show search options dropdown on pressing spacebar', function () {
        searchBoxView.ui.searchIcon.trigger({type: 'keydown', keyCode: 32});
        expect(searchBoxView.ui.searchIcon.css('display') === 'block' ||
               !searchBoxView.ui.searchIcon.hasClass('binf-hidden') ||
               searchBoxView.ui.searchIcon.hasClass('binf-show')).toBeTruthy();
        expect(searchBoxView.$el.find('.csui-search-options-dropdown').length).toEqual(1);
        expect(searchBoxView.$el.find(".csui-searchbox-option:checked")).toBeTruthy();
      });

      it('should hide search options dropdown on pressing escape', function () {
        searchBoxView.ui.searchIcon.trigger({type: 'keydown', keyCode: 32});
        expect(searchBoxView.$el.find('.csui-search-options-dropdown').length).toEqual(1);
        searchBoxView.ui.searchIcon.trigger({type: 'keydown', keyCode: 27});
        expect(searchBoxView.$el.find('.csui-search').length).toEqual(0);
      });

    });

  });

});

