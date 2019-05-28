/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/marionette',
  'csui/utils/contexts/page/page.context',
  'csui/widgets/myassignments/impl/myassignmentstable.view',
  'csui/utils/contexts/factories/myassignments',
  './myassignments.mock.data.manager.js', 'csui/lib/jquery.mockjax'
], function ($, _, Marionette, PageContext, MyAssignmentsTableView, MyAssignmentsCollectionFactory,
    DataManager) {
  xdescribe("The My Assignments Widget, Expanded", function () {

    var context, w, el;

    beforeEach(function (done) {

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

      w = new MyAssignmentsTableView({
        context: context,
        collection: context.getCollection(MyAssignmentsCollectionFactory),
        pageSize: 100
      });
      el = $('<div style="background-color: white; width: 1024px;height: 600px">', {id: 'target'});

      done();
    });

    afterEach(function () {
      DataManager.test0.disable();
      DataManager.test1.disable();
      DataManager.mockData.disable();
      $('body').empty();
    });

    it("the my assignments table view can be instantiated", function (done) {
      expect(w).toBeDefined();
      expect(w.$el.length > 0).toBeTruthy();
      expect(w.el.childNodes.length === 0).toBeTruthy();
      done();
    });

    describe("the my assignements table view can be rendered and", function () {

      it("shows 0 items and has a table and a navigation", function (done) {
        expect(w.collection.length === 0).toBeTruthy();

        DataManager.test0.enable();

        var fetching = w.collection.fetch({reload: true})
            .then(function () {
              expect(w.collection.length).toEqual(0);
              expect(w.$('div.csui-myassignmentstable')).toBeDefined();
              expect(w.$('table').length).toEqual(0);  // no table
              expect(w.$('.csui-nodetable .csui-table-empty').length).toEqual(1); // only empty element.

              expect(w.$('div#tableviewMA')[0].childNodes.length > 0).toBeTruthy();
              expect(w.$('div#paginationviewMA')[0].childNodes.length > 0).toBeTruthy();

              done();
            })
            .fail(function () {
              expect(fetching.state()).toBe('resolved', "Data fetch timed out");
              DataManager.test0.disable();
              done();
            }, 2000);

        w.render();
        el.append(w.$el);
        $('body').append(el);
        w.trigger('show');
        w.trigger('dom:refresh');

      });

      it("shows 1 item and correct data", function (done) {

        DataManager.test1.enable();

        var fetching = w.collection.fetch({reload: true})
            .then(function () {
              expect(w.collection.length).toEqual(1);
              expect(w.$('div.csui-myassignmentstable')).toBeDefined();

              expect($(w.$('tbody')[0]).find('tr').length).toEqual(2);
              expect($(w.$('tbody > tr')[0]).find('td').length).toEqual(7);
              expect($(w.$('tbody > tr')[0]).find('td.csui-table-cell-type').length).toEqual(1);
              expect($(w.$('tbody > tr')[0]).find('td.csui-table-cell-name').length).toEqual(1);
              expect($(w.$('tbody > tr')[0]).find('td.csui-table-cell-location_id').length).toEqual(
                  1);
              expect($(w.$('tbody > tr')[0]).find('td.csui-table-cell-date').length).toEqual(1);
              expect($(w.$('tbody > tr')[0]).find('td.csui-table-cell-priority').length).toEqual(1);
              expect($(w.$('tbody > tr')[0]).find('td.csui-table-cell-status').length).toEqual(1);
              expect(
                  $(w.$('tbody > tr')[0]).find('td.csui-table-cell-from_user_name').length).toEqual(
                  1);

              var model0Name = w.collection.models[0].get('name');
              var row0Name = w.$('tbody > tr > td.csui-table-cell-name a').html();
              expect(model0Name).toEqual(row0Name);

              done();
            })
            .fail(function () {
              expect(fetching.state()).toBe('resolved', "Data fetch timed out");
              done();
            });

        w.render();
        el.append(w.$el);
        $('body').append(el);
        w.trigger('show');
        w.trigger('dom:refresh');
      });

      it("shows 100 items correctly", function (done) {

        var id100From = 21;
        var id100To = 120;
        var s100Name = '100name';
        DataManager.mockData.enable(id100From, id100To, s100Name);

        var fetching = w.collection.fetch({reload: true})
            .then(function () {
              expect(w.collection.length).toEqual(100);
              expect(w.$('div.csui-myassignmentstable')).toBeDefined();

              expect($(w.$('tbody')[0]).find('tr').length).toEqual(200);
              expect($(w.$('tbody > tr')[0]).find('td').length).toEqual(7);
              expect($(w.$('tbody > tr')[0]).find('td.csui-table-cell-type').length).toEqual(1);
              expect($(w.$('tbody > tr')[0]).find('td.csui-table-cell-name').length).toEqual(1);
              expect($(w.$('tbody > tr')[0]).find('td.csui-table-cell-location_id').length).toEqual(
                  1);
              expect($(w.$('tbody > tr')[0]).find('td.csui-table-cell-date').length).toEqual(1);
              expect($(w.$('tbody > tr')[0]).find('td.csui-table-cell-priority').length).toEqual(1);
              expect($(w.$('tbody > tr')[0]).find('td.csui-table-cell-status').length).toEqual(1);
              expect(
                  $(w.$('tbody > tr')[0]).find('td.csui-table-cell-from_user_name').length).toEqual(
                  1);

              var model50Name = w.collection.models[50].get('name');
              var row50Name = $(w.$('tbody > tr')[100]).find('td.csui-table-cell-name a').html();
              expect(model50Name).toEqual(row50Name);

              DataManager.mockData.disable();
              done();
            })
            .fail(function () {
              expect(fetching.state()).toBe('resolved', "Data fetch timed out");
              DataManager.mockData.disable();
              done();
            });

        w.render();
        el.append(w.$el);
        $('body').append(el);
        w.trigger('show');
        w.trigger('dom:refresh');
      });

    });

  });
});
