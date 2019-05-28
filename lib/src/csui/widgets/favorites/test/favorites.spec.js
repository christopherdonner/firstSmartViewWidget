/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/marionette',
  'csui/widgets/favorites/favorites.view', 'csui/utils/contexts/page/page.context',
  'csui/controls/listitem/listitemstandard.view',
  './favorites.mock.data.manager.js', "../../../utils/testutils/async.test.utils.js"
], function ($, _, Marionette, FavoritesView, PageContext, StandardListItem, DataManager,
    AsyncUtils) {

  describe("The Favorites Widget", function () {

    var sTitle, sIcon, id100From, id100To, s100Name, context, w;

    beforeAll(function (done) {
      sTitle = 'testTitle';
      sIcon = "title-icon";
      id100From = 21;
      id100To = 120;
      s100Name = '100name';

      if (!context) {
        context = new PageContext({
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

      if (!w) {
        w = new FavoritesView({
          data: {
            title: sTitle,
            titleBarIcon: sIcon
          },
          context: context
        });
      }

      done();
    });

    it("can be instantiated and rendered", function (done) {
      DataManager.mockData.enable(id100From, id100To, s100Name);
      expect(w).toBeDefined();
      expect(w.$el.length > 0).toBeTruthy();
      expect(w.el.childNodes.length === 0).toBeTruthy();
      w.render();
      expect(w.$el.length > 0).toBeTruthy();
      expect(w.el.childNodes.length > 0).toBeTruthy();
      var region = new Marionette.Region({
        el: $('<div id="cs-favorites-view"></div>').appendTo(document.body)
      });
      region.show(w);
      done();
    });

    it('mouseover to show inline actions for listItem', function (done) {
      var listItem = w.$el.find('.cs-list-group a:first-child');
      listItem.trigger('mouseenter');
      AsyncUtils.asyncElement(listItem,
          '.csui-tileview-more-btn > div.csui-table-actionbar').done(function (el) {
        expect(el.length).toEqual(1);
        el.find('a.binf-dropdown-toggle').trigger('click');
        AsyncUtils.asyncElement(el, '.binf-dropdown-menu').done(function (ele) {
          expect(ele.length).toEqual(1);
          done();
        });
        done();
      });
      done();
    });

    describe("as part of the framework", function () {

      xit("applies the standard list item control as item type", function () {
        expect(w.childView.name).toEqual(StandardListItem.name);
      });

      it("applies the generic list header", function () {
      });

      it("applies the generic list footer", function () {
      });

    });

    describe("in collapsed state", function () {

      it("allows to show 101 items", function (done) {

        var fetching = w.completeCollection.fetch({reload: true})
            .then(function () {
              expect(w.completeCollection.length).toBeGreaterThan(0);
              expect(w.completeCollection.length).toEqual(101);
              expect(w.$('div.binf-list-group')[0].childNodes.length).toEqual(101); // limited list

              DataManager.mockData.disable();
              done();
            })
            .fail(function () {
              expect(fetching.state()).toBe('resolved', "Data fetch timed out");
              done();
            });
      });

      it("toggles search field on clicking magnifier", function () {
        expect(w.$('input.search').css('display')).toEqual('none');
        w.$('span.icon-search').trigger('click');
        expect(w.$('input.search').css('display')).toMatch('block');

      });

      xit("allows to show 1 item", function (done) {
        var fetching = w.completeCollection.fetch({reload: true})
            .then(function () {
              expect(w.completeCollection.length).toBeGreaterThan(0);
              expect(w.completeCollection.length).toEqual(1);
              expect(w.$('div.binf-list-group')[0].childNodes.length).toEqual(1);
              DataManager.test1.disable();
              done();
            })
            .fail(function () {
              expect(fetching.state()).toBe('resolved', "Data fetch timed out");
              done();
            });
      });

      xit("shows placeholder in case of 0 items", function (done) {
        DataManager.test0.enable();
        expect(w.collection.length === 0).toBeTruthy();
        expect(w.completeCollection.length === 0).toBeTruthy();
        expect(w.$('div.binf-list-group')[0].childNodes.length === 0).toBeTruthy();

        var fetching = w.completeCollection.fetch()
            .then(function () {
              expect(w.completeCollection.length).toEqual(0);
              expect(w.$('div.cs-emptylist-container').length === 1).toBeTruthy();

              DataManager.mockData.disable();
              done();
            })
            .fail(function () {
              expect(fetching.state()).toBe('resolved', "Data fetch timed out");
              done();
            });
      });

      it("has a header, a viewport/content and a footer", function () {
        expect(w.$('div.tile-header').length).toBeGreaterThan(0);
        expect(w.$('div.tile-content').length).toBeGreaterThan(0);
        expect(w.$('div.tile-footer').length).toBeGreaterThan(0);

      });

      it("has a configurable title, which is set as the header title", function () {
        expect(w.$('div.tile-title>.csui-heading').html()).toEqual(sTitle);
      });

      it("has a configurable icon, which is set as the header icon", function () {
        var $iconSpan = w.$('div.tile-type-icon>span.icon');
        expect($iconSpan[0].classList.length).toBeGreaterThan(1);
        expect($iconSpan[0].classList[1]).toEqual(sIcon);
      });

    });

    describe("for each individual item", function () {

      it("shows the file name of the list item as item text", function () {
        var rgModelCollection = w.completeCollection.models;
        expect(rgModelCollection.length).toBeGreaterThan(0);
        var sModelItemName0 = rgModelCollection[0].get('name');
        var nModelId = rgModelCollection[0].get('id');
        var sViewItemName0 = w.$('a[href$=' + nModelId + '] span.list-item-title').html();
        expect(sModelItemName0).toEqual(sViewItemName0);

      });

    });

  });
});
