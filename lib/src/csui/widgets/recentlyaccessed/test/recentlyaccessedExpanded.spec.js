/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/marionette',
  'csui/utils/contexts/page/page.context',
  'csui/widgets/recentlyaccessed/impl/recentlyaccessedtable.view',
  'csui/utils/contexts/factories/recentlyaccessed',
  './recentlyaccessed.mock.data.manager.js', 'csui/lib/jquery.mockjax'
], function ($, _, Marionette, PageContext, RecentlyAccessedTableView,
    RecentlyAccessedCollectionFactory, DataManager) {
  xdescribe("The Recently Accessed Widget, Expanded", function () {

    var context, w, region;

    beforeEach(function () {
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

      var el = $('<div style="background-color: white; width: 1024px;height: 600px">',
          {id: 'target'});
      $(document.body).append(el);
      region = new Marionette.Region({el: el});

      w = new RecentlyAccessedTableView({
        context: context,
        collection: context.getCollection(RecentlyAccessedCollectionFactory),
        pageSize: 100
      });
      expect(w).toBeDefined();
      expect(w.$el.length > 0).toBeTruthy();
      expect(w.el.childNodes.length === 0).toBeTruthy();
    });

    afterEach(function () {
      region.empty();
      $(document.body).empty();
      DataManager.test0.disable();
      DataManager.test1.disable();
      DataManager.mockData.disable();
    });

    describe("the recently accessed table view can be rendered and", function () {

      it("shows 0 items and has a toolbar, a table and a navigation", function (done) {
        expect(w.collection.length === 0).toBeTruthy();

        DataManager.test0.enable();
        region.show(w);

        w.listenTo(w.tableView, 'render', callback);

        function callback() {
          if (!$(w.$('tbody')[0]).find('tr').length) {
            return;
          }
          expect(w.collection.length).toEqual(0);
          expect(w.$('div.csui-recentlyaccessedtable').length > 0).toBeTruthy();
          expect(w.$('.csui-nodetable .csui-table-empty').length).toEqual(1); // only empty element.

          expect(w.$('div#tableviewRA')[0].childNodes.length > 0).toBeTruthy();
          expect(w.$('div#paginationviewRA')[0].childNodes.length > 0).toBeTruthy();

          done();
        }

        w.collection.fetch({reload: true});
      });

      it("shows 1 item and correct data", function (done) {

        DataManager.test1.enable();
        region.show(w);

        var fetching = w.collection.fetch({reload: true})
            .then(function () {
              expect(w.collection.length).toEqual(1);
              expect(w.$('div.csui-recentlyaccessedtable').length > 0).toBeTruthy();

              expect($(w.$('tbody')[0]).find('tr').length).toEqual(1);
              expect($(w.$('tbody > tr')[0]).find('td').length).toEqual(5);
              expect($(w.$('tbody > tr')[0]).find('td.csui-table-cell-_select').length).toEqual(1);
              expect($(w.$('tbody > tr')[0]).find('td.csui-table-cell-type').length).toEqual(1);
              expect($(w.$('tbody > tr')[0]).find('td.csui-table-cell-name').length).toEqual(1);
              expect($(w.$('tbody > tr')[0]).find('td.csui-table-cell-date').length).toEqual(2);

              var model0Name = w.collection.models[0].get('name');
              var row0Name = w.$('tbody > tr .csui-table-cell-name-value').html();
              expect(model0Name).toEqual(row0Name);

              done();
            })
            .fail(function () {
              expect(fetching.state()).toBe('resolved', "Data fetch timed out");
              done();
            });
      });

      it("shows 100 items correctly", function (done) {

        var id100From = 21;
        var id100To = 120;
        var s100Name = '100name';
        DataManager.mockData.enable(id100From, id100To, s100Name);
        region.show(w);

        var fetching = w.collection.fetch({reload: true})
            .then(function () {
              expect(w.collection.length).toEqual(100);
              expect(w.$('div.csui-recentlyaccessedtable').length > 0).toBeTruthy();

              expect($(w.$('tbody')[0]).find('tr').length).toEqual(100);
              expect($(w.$('tbody > tr')[0]).find('td').length).toEqual(5);
              expect($(w.$('tbody > tr')[0]).find('td.csui-table-cell-_select').length).toEqual(1);
              expect($(w.$('tbody > tr')[0]).find('td.csui-table-cell-type').length).toEqual(1);
              expect($(w.$('tbody > tr')[0]).find('td.csui-table-cell-name').length).toEqual(1);
              expect($(w.$('tbody > tr')[0]).find('td.csui-table-cell-date').length).toEqual(2);

              var model50Name = w.collection.models[50].get('name');
              var row50Name = $(w.$('tbody > tr')[50]).find('.csui-table-cell-name-value').html();
              expect(model50Name).toEqual(row50Name);

              done();
            })
            .fail(function () {
              expect(fetching.state()).toBe('resolved', "Data fetch timed out");
              done();
            });
      });
    });

    describe("presence of action commands in recently accessed table", function () {

      beforeAll(function (done) {
        DataManager.test1.enable();
        w.render();

        var self = this;
        var fetching = w.collection.fetch({reload: true})
            .then(function () {
              w.render();
            }).then(function () {
              self.view = w;
              var attempt = 0;
              var interval = setInterval(function () {
                var row = w.$el.find(".csui-saved-item[role='row']").first().parent();
                if (row.length > 0 || attempt > 9) {
                  self.row = w.$el.find(".csui-saved-item[role='row']").first().parent();
                  clearInterval(interval);
                  done();
                }
                attempt++;
              }, 100);
            })
            .fail(function () {
              expect(fetching.state()).toBe('resolved', "Data fetch timed out");
              done();
            });

      });

    });
  });
});
