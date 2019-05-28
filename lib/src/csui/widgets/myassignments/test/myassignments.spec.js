/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/marionette',
  'csui/widgets/myassignments/myassignments.view',
  'csui/utils/contexts/page/page.context',
  'csui/controls/listitem/listitemstateful.view',
  './myassignments.mock.data.manager.js',
  'csui/lib/jquery.mockjax'
], function ($, _, Marionette, MyAssignmentsView, PageContext, StatefulListItem, DataManager) {

  describe("The MyAssignments Widget", function () {

    var sTitle, sIcon, id100From, id100To, s100Name, context, w;

    beforeEach(function () {
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

      w = new MyAssignmentsView({
        data: {
          title: sTitle,
          titleBarIcon: sIcon
        },
        context: context
      });

      expect(w).toBeDefined();
      expect(w.$el.length > 0).toBeTruthy();
      expect(w.el.childNodes.length === 0).toBeTruthy();

      w.render();
    });

    it("can be instantiated and rendered", function () {
      expect(w.$el.length > 0).toBeTruthy();
      expect(w.el.childNodes.length > 0).toBeTruthy();
    });

    describe("as part of the framework", function () {

      it("applies the stateful list item control as item type", function () {
        expect(w.childView.name).toEqual(StatefulListItem.name);
      });

      it("applies the generic list", function () {
        var rgClasses = w.$el[0].classList;
        expect(rgClasses.length).toBeGreaterThan(1);
        expect(rgClasses[0]).toEqual('cs-list');
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
              console.log("fetched 0");
              expect(w.completeCollection.length).toEqual(0);
              expect(w.$('div.cs-emptylist-container').length === 1).toBeTruthy();

              DataManager.test0.disable();
              done();
            })
            .fail(function () {
              expect(fetching.state()).toBe('resolved', 'Data fetch timed out');

              DataManager.test0.disable();
              done();
            });

      });

      it("allows to show 1 item", function (done) {
        expect(w.collection.length === 0).toBeTruthy();
        expect(w.completeCollection.length === 0).toBeTruthy();
        expect(w.$('.binf-list-group .cs-emptylist-container').length === 1).toBeTruthy();

        DataManager.test1.enable();

        var fetching = w.completeCollection.fetch({reload: true})
            .then(function () {
              console.log("fetched 1");
              expect(w.completeCollection.length).toBeGreaterThan(0);
              expect(w.completeCollection.length).toEqual(1);
              expect(w.$('div.binf-list-group')[0].childNodes.length).toEqual(1);

              DataManager.test1.disable();
              done();
            })
            .fail(function () {
              expect(fetching.state()).toBe('resolved', 'Data fetch timed out');

              DataManager.test1.disable();
              done();
            });

      });

      describe("with data", function () {

        beforeEach(function (done) {
          DataManager.mockData.enable(id100From, id100To, s100Name);

          w.completeCollection.fetch({reload: true}).then(done);
        });

        afterEach(function () {
          DataManager.mockData.disable();
        });

        it("allows to show 100 items", function () {
          expect(w.completeCollection.length).toBeGreaterThan(0);
          expect(w.completeCollection.length).toEqual(100);
          expect(w.$('div.binf-list-group')[0].childNodes.length).toEqual(100); // limited list
        });

        it("has a header, a viewport/content and a footer", function () {
          expect(w.$('div.tile-header').length).toBeGreaterThan(0);
          expect(w.$('div.tile-content').length).toBeGreaterThan(0);
          expect(w.$('div.tile-footer').length).toBeGreaterThan(0);
        });

        describe("for each individual item", function () {

          it("shows the file name of the list item as item text", function () {
            var rgModelCollection = w.completeCollection.models;
            expect(rgModelCollection.length).toBeGreaterThan(0);
            var sModelItemName0 = rgModelCollection[0].get('name');
            var nModelId = rgModelCollection[0].get('id');
            var sViewItemName0 = w.$('.SLI:first-child .SLITitle span').html();
            expect(sModelItemName0).toEqual(sViewItemName0);
          });

        });
      });
    });
  });
});
