/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/marionette',
  'csui/utils/contexts/page/page.context',
  'csui/widgets/favorites/impl/favorites2.table.view',
  'csui/models/favorites2',
  'csui/utils/contexts/factories/favorites2',
  'csui/utils/contexts/factories/favorite2groups',
  'csui/models/favorite2columns',
  './favorites2.mock.data0.js',
  './favorites2.mock.data1.js',
  './favorites2.mock.data2.js',
  'csui/lib/jquery.mockjax'
], function ($, _, Marionette, PageContext, Favorites2TableView, Favorite2Collection,
    Favorite2CollectionFactory, Favorite2GroupsCollectionFactory, Favorite2ColumnCollection,
    mockData0, mockData1, mockData2) {

  xdescribe("The Favorites Widget, Expanded", function () {

    var context, ftv, el;

    beforeEach(function () {

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
        context: context
      });

    });

    afterEach(function () {
      mockData0.disable();
      mockData1.disable();
      mockData2.disable();
      $('body').empty();
    });

    it("the favorites table view can be instantiated", function (done) {
      expect(ftv).toBeDefined();
      expect(ftv.$el.length > 0).toBeTruthy();
      expect(ftv.el.childNodes.length === 0).toBeTruthy();
      done();
    });

    describe("the favorites table view can be rendered and", function () {

      it("shows only unsorted group and no favorites", function (done) {
        expect(ftv.groups.length === 0).toBeTruthy();
        expect(ftv.collection.length === 0).toBeTruthy();

        mockData0.enable();

        ftv.listenToOnce(ftv, 'show', function () {

          ftv.listenToOnce(ftv.tableView, 'render', function () {
            expect(ftv.tableView.collection.length).toEqual(0);
            expect(ftv.$el.hasClass('csui-fav2-table')).toBeTruthy();
            expect(ftv.$('.csui-nodetable.csui-table-empty').length).toEqual(1); // only empty element.

            callback();
          });
          ftv.listenToOnce(ftv.groupsView.rowsView, 'render', function () {
            expect(ftv.groups.length).toEqual(1);
            callback();
          });

          var callback = _.after(2, function () { // wait until callback was called 2 times
            done();
          });
        });

        ftv.render(); // this fetches the groups collection and the favorite2collection too
        el.append(ftv.$el);
        $('body').append(el);
        ftv.trigger('show');
        ftv.trigger('dom:refresh');
      });

      it("shows 4 favorite groups and no favorites", function (done) {

        mockData1.enable();

        ftv.listenToOnce(ftv.tableView, 'render', function () {
          expect(ftv.tableView.collection.length).toEqual(0);
          ftv.listenToOnce(ftv.tableView, 'render', function () {
            expect(ftv.tableView.collection.length).toEqual(0);
            expect(ftv.$el.hasClass('csui-fav2-table')).toBeTruthy();
            expect(ftv.$('.csui-nodetable.csui-table-empty').length).toEqual(1); // only empty element.
            callback();
          });
          ftv.listenToOnce(ftv.groupsView.rowsView, 'render', function () {
            var groupsView = ftv.$('.csui-favorite-groups-view');
            expect(groupsView.length).toEqual(1);

            var groupsHeaderView = ftv.$('.csui-favorite-groups-view .csui-favorite-groups-header');
            expect(groupsHeaderView.length).toEqual(1);

            var groupsRowsView = ftv.$('.csui-favorite-groups-view .csui-favorite-groups-rows');
            expect(groupsRowsView.length).toEqual(1);

            var groupViews = ftv.$('.csui-favorite-groups-view .csui-favorite-groups-rows' +
                                   ' .csui-favorite-group');
            expect(groupViews.length).toEqual(4);
            expect(ftv.groups.length).toEqual(4);
            callback();
          });

          var callback = _.after(2, function () { // wait until callback was called 2 times
            done();
          });
        });

        ftv.render(); // this fetches the groups collection and the favorite2collection too
        el.append(ftv.$el);
        $('body').append(el);
        ftv.trigger('show');
        ftv.trigger('dom:refresh');
      });

      it("shows 3 favorite groups and some favorites", function (done) {
        mockData2.enable();
        ftv.listenTo(ftv.tableView.collection.delayedActions, 'sync', callback);
        ftv.listenToOnce(ftv, 'show', function () {
          ftv.listenTo(ftv.tableView, 'render', callback);
          ftv.listenTo(ftv.groupsView.rowsView, 'render', callback);
        });

        function callback () {
          if (!(ftv.tableView.collection.delayedActions.fetched &&
                $(ftv.$('tbody')[0]).find('tr').length &&
                ftv.groups.length)) {
            return;
          }

          expect($(ftv.$('tbody')[0]).find('tr').length).toBeGreaterThanOrEqual(1);
          expect($(ftv.$('tbody')[0]).find('tr > td.dataTables_empty').length).toEqual(0);

          expect($(ftv.$('tbody')[0]).find('tr').length).toEqual(2);
          expect($(ftv.$('tbody > tr')[0]).find('td').length).toEqual(6);
          expect($(ftv.$('tbody > tr')[0]).find('td.csui-table-cell-_select').length).toEqual(
              1);
          expect($(ftv.$('tbody > tr')[0]).find('td.csui-table-cell-type').length).toEqual(1);
          expect($(ftv.$('tbody > tr')[0]).find('td.csui-table-cell-name').length).toEqual(1);
          expect(
              $(ftv.$('tbody > tr')[0]).find('td.csui-table-cell-node-state').length).toEqual(
              1);
          expect($(ftv.$('tbody > tr')[0]).find('td.csui-table-cell-parent_id').length).toEqual(
              1);
          expect($(ftv.$('tbody > tr')[0]).find('td.csui-table-cell-favorite').length).toEqual(
              1);

          expect(ftv.groups.length).toEqual(4);

          done();
        }

        ftv.render(); // this fetches the groups collection and the favorite2collection too
        el.append(ftv.$el);
        $('body').append(el);
        ftv.trigger('show');
        ftv.trigger('dom:refresh');
      });

    });

  });
});
