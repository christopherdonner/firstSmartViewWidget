/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/marionette',
  'csui/widgets/recentlyaccessed/recentlyaccessed.view', '../../../utils/testutils/async.test.utils.js',
  'csui/utils/contexts/page/page.context',
  'csui/controls/listitem/listitemstandard.view',
  './recentlyaccessed.mock.data.manager.js',
  'csui/lib/jquery.mockjax'

], function ($, _, Marionette, RecentlyAccessedView, testUtil, PageContext, StandardListItem,
    DataManager) {

  describe("The Recently Accessed Widget", function () {

    var sTitle, sIcon, id100From, id100To, s100Name, context, w;

    beforeEach(function (done) {
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
        w = new RecentlyAccessedView({
          data: {
            title: sTitle,
            titleBarIcon: sIcon
          },
          context: context
        });
      }
      done();
    });

    it("can be instantiated and rendered", function () {
      expect(w).toBeDefined();
      expect(w.$el.length > 0).toBeTruthy();
      expect(w.el.childNodes.length === 0).toBeTruthy();
      w.render();
      expect(w.$el.length > 0).toBeTruthy();
      expect(w.el.childNodes.length > 0).toBeTruthy();
    });

    describe("as part of the framework", function () {

      it("applies the standard list item control as item type", function () {
        expect(w.childView.name).toEqual(StandardListItem.name);
      });

      it("applies the generic list header", function () {
      });

      it("applies the generic list footer", function () {
      });

    });

    describe("in collapsed state", function () {

      it("shows placeholder in case of 0 items", function (done) {
        expect(w.collection.length === 0).toBeTruthy();
        expect(w.completeCollection.length === 0).toBeTruthy();
        expect(w.$('.binf-list-group .cs-emptylist-container').length === 1).toBeTruthy();

        DataManager.test0.enable();

        var fetching = w.completeCollection.fetch()
            .then(function () {
              expect(w.completeCollection.length).toEqual(0);
              expect(w.$('div.cs-emptylist-container').length === 1).toBeTruthy();

              DataManager.test0.disable();
              done();
            })
            .fail(function () {
              expect(fetching.state()).toBe('resolved', "Data fetch timed out");
              DataManager.test0.disable();
              done();
            });
      });

      it("allows to show 1 item", function (done) {

        DataManager.test1.enable();

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
              DataManager.test1.disable();
              done();
            });
      });

      it("allows to show 100 items", function (done) {

        DataManager.mockData.enable(id100From, id100To, s100Name);

        var fetching = w.completeCollection.fetch({reload: true})
            .then(function () {
              expect(w.completeCollection.length).toBeGreaterThan(0);
              expect(w.completeCollection.length).toEqual(100);
              expect(w.$('div.binf-list-group')[0].childNodes.length).toEqual(100); // limited list

              DataManager.mockData.disable();
              done();
            })
            .fail(function () {
              expect(fetching.state()).toBe('resolved', "Data fetch timed out");
              DataManager.mockData.disable();
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

      xit("toggles search field on clicking magnifier", function () {
      });

      xit("has a content which is shown if there are no items", function () {
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
      it("hover on the listItem, renders inlineactionbar", function (done) {
        var rgModelCollection = w.completeCollection.models;
        expect(rgModelCollection.length).toBeGreaterThan(0);
        var nModelId = rgModelCollection[0].get('id');
        var listItem =  w.$('a[href$=' + nModelId + ']').closest('.csui-item-standard.binf-list-group-item');
        listItem.trigger('mouseenter');
        testUtil.asyncElement(listItem,
            '.csui-tileview-more-btn > div.csui-table-actionbar').done(
            function (el) {
              expect(el.length).toEqual(1);
              done();
            });
      });

      it("shows the file name truncated with a '...' if the filename is too long",
          function () {
          });

      it("shows the MIME type as (standard list) item icon", function () {
      });

      describe("on left-clicking the item", function () {
        it("executes the default action for that type", function () {
        });
      });

      describe("on right-clicking the item", function () {
        it("shows the function menu, which is not restricted by the size of the viewport",
            function () {
            });
      });

    });

    describe("when text is entered in the search field", function () {

      it("ensure search field is shown");

      it("the items list is filtered *by filename only*",
          function () {
          });

      it("the filtered list only shows list items that contain the entered string",
          function () {
          });

      it("filtering searches through all recently accessed items, not just ones that are loaded in the tile",
          function () {
          });
    });

  });

});
