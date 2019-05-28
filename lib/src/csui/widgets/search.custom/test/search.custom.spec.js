/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(
    ['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/jquery.when.all', 'csui/lib/backbone',
      'csui/lib/marionette',
      'csui/lib/handlebars', 'csui/widgets/search.custom/search.custom.view',
      'csui/widgets/search.results/search.results.view',
      'csui/utils/contexts/page/page.context',
      './search.custom.mock.data.js',
      '../../../utils/testutils/async.test.utils.js'
    ], function (_, $, whenAll, Backbone, Marionette, Handlebars, CustomSearchView,
        SearchResultsView, PageContext, mock, testUtils) {

      xdescribe('SearchCustomResults', function () {

        describe('given empty configuration', function () {

          var pageContext, searchResultsView, cvsView, el;

          beforeAll(function (done) {
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
            cvsView = new CustomSearchView({
              context: pageContext,
              savedSearchQueryId: 43996 // Provide existing saved search query's object id
            });
            new Marionette.Region({
              el: $('<div></div>').appendTo(document.body)
            }).show(cvsView);
            searchResultsView = new SearchResultsView({
              context: pageContext
            });
            new Marionette.Region({
              el: $('<div></div>').appendTo(document.body)
            }).show(searchResultsView);
            pageContext.fetch();
            testUtils.asyncElement(cvsView.$el, 'input').done(function (elm) {
              el = elm;
              done();
            });
          });

          afterAll(function () {
            mock.disable();
            el.remove();
            searchResultsView.destroy();
            cvsView.destroy();
            $('body').empty();
          });

          it('search results view can be constructed', function () {
            expect(searchResultsView instanceof SearchResultsView).toBeTruthy();
          });

          it('assigns right classes', function () {
            var className = searchResultsView.$el.attr('class');
            expect(className).toBeDefined();
            var classes = className.split(' ');
            expect(classes).toContain('csui-search-results');
          });

          it('custom search view can be constructed', function () {
            expect(cvsView instanceof CustomSearchView).toBeTruthy();
          });

          it('should show search button in disabled state when input fields are empty',
              function () {
                el.eq(1).val('').blur();
                el.eq(2).val('').blur();
                expect(cvsView.$el.find(".csui-custom-search-form-submit").hasClass(
                    "binf-disabled")).toBeTruthy();
              });

          it('should show search button in enabled state when input is given to the field',
              function () {
                el.eq(1).val('').blur();
                el.eq(2).val('a').blur();
                expect(cvsView.$el.find(".csui-custom-search-form-submit").hasClass(
                    "binf-disabled")).toBeFalsy();
              });

          it('should enable and initiate the search, hitting ENTER from any of the input field',
              function (done) {
                var e = $.Event('keydown', {keyCode: 13, bubbles: true});
                el.eq(2).trigger(e);
                testUtils.asyncElement(searchResultsView.$el, '.csui-no-result-message-wrapper',
                    true).done(function () {
                  expect(cvsView.$el.find(".csui-custom-search-form-submit").hasClass(
                      "binf-disabled")).toBeFalsy();
                  expect(searchResultsView.$el.find(
                      '.csui-no-result-message-wrapper').length).toEqual(0);
                  done();
                });
              });

          it('should show the results count as per the value entered in the text field',
              function (done) {
                el.eq(2).val('a').blur();
                cvsView.$el.find('#csui-custom-search-form-submit').click();
                testUtils.asyncElement(searchResultsView.$el, '.csui-no-result-message-wrapper',
                    true).done(function () {
                  expect(searchResultsView.$el.find(
                      '.csui-no-result-message-wrapper').length).toEqual(0);
                  expect(searchResultsView.$el.find(
                      '.csui-no-result-message-wrapper').length).toEqual(0);
                  expect(parseInt(
                      searchResultsView.headerView.$el.find('#headerCount').text().match(
                          /\d/g).join(''))).toEqual(searchResultsView.collection.totalCount);
                  done();
                });
              });

          it('should show no results when entered input value is not in the search results',
              function (done) {
                el.eq(2).val('abc').blur();
                cvsView.$el.find('#csui-custom-search-form-submit').click();
                testUtils.asyncElement(searchResultsView.$el,
                    '.csui-no-result-message-wrapper').done(function () {
                  expect(searchResultsView.$el.find(
                      '.csui-no-result-message-wrapper').length).toEqual(1);
                  done();
                });
              });
        });
      });
    });

