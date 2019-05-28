/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/marionette',
  'csui/utils/contexts/page/page.context',
  'csui/widgets/favorites/impl/favorites2.table.view',
  'csui/models/favorites2',
  'csui/utils/contexts/factories/favorites2',
  'csui/utils/contexts/factories/favorite2groups',
  'csui/models/favorite2columns',
  './favorites2.mock.data3.js',
  'csui/lib/jquery.mockjax'
], function ($, _, Marionette, PageContext, Favorites2TableView, Favorite2Collection,
    Favorite2CollectionFactory, Favorite2GroupsCollectionFactory, Favorite2ColumnCollection,
    mockData3) {
  xdescribe("The Expanded Favorites Widget with server specified columns", function () {

    var context, ftv, el;

    beforeAll(function () {

      context = new PageContext({
        factories: {
          connector: {
            connection: {
              url: '//server/otcs/cs/api/v2',
              supportPath: '/support',
              session: {
                ticket: 'dummy'
              }
            }
          }
        }
      });

      el = $('<div style="background-color: white; width: 1024px;height: 600px">', {id: 'target'});
      ftv = new Favorites2TableView({
        context: context,
        showGroupsRegion: false  // don't show Groups region
      });

    });

    afterAll(function () {
      mockData3.disable();
      $('body').empty();
    });

    describe("the favorites table view can be rendered and", function () {

      it("hidden Groups region shows unsorted group and table shows 7 favorites", function (done) {

        var c0, c1, c2;

        mockData3.enable();
        ftv.listenTo(ftv.tableView.collection.delayedActions, 'sync', function () {
          if (!c0) {
            c0 = true;
            callback();
          }
        });

        ftv.listenToOnce(ftv, 'show', function () {

          c1 = 0;
          ftv.listenTo(ftv.tableView, 'render', function () {
            if (ftv.tableView.collection.length > 0 && c1++ === 1) {
              expect(ftv.$el.hasClass('csui-fav2-table')).toBeTruthy();
              expect(ftv.tableView.collection.length).toEqual(7);
              expect(ftv.$('tbody').length).toEqual(1);
              var $tbody = $(ftv.$('tbody')[0]);
              expect($tbody.find('tr').length).toBeGreaterThanOrEqual(1);
              expect($tbody.find('tr > td.dataTables_empty').length).toEqual(0);

              expect($tbody.find('tr').length).toBeGreaterThan(0);
              var $tbodyTr = $(ftv.$('tbody > tr')[0]);
              expect($tbodyTr.find('td').length).toEqual(7);
              expect($tbodyTr.find('td.csui-table-cell-_select').length).toEqual(1);
              expect($tbodyTr.find('td.csui-table-cell-type').length).toEqual(1);
              expect($tbodyTr.find('td.csui-table-cell-name').length).toEqual(1);
              expect($tbodyTr.find('td.csui-table-cell-node-state').length).toEqual(1);
              expect($tbodyTr.find('td.csui-table-cell-parent_id').length).toEqual(1);
              expect($tbodyTr.find('td.csui-table-cell-size').length).toEqual(1);
              expect($tbodyTr.find('td.csui-table-cell-favorite').length).toEqual(1);

              callback();
            }
          });
          ftv.listenTo(ftv.groupsView.rowsView, 'render', function () {
            if (ftv.groups.length > 0 && !c2) {
              c2 = true;

              expect(ftv.groups.length).toEqual(1);
              expect(ftv.$('.csui-favorite-groups-view').is(':hidden')).toBeTruthy();

              callback();
            }
          });

        });

        var callback = _.after(3, function () { // wait until callback was called x times
          done();
        });

        ftv.render(); // this fetches the groups collection and the favorite2collection too
        el.append(ftv.$el);
        $('body').append(el);
        ftv.trigger('show');
        ftv.trigger('dom:refresh');
      });

    });

  });
});
