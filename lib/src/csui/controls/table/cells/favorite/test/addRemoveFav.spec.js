/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
      "module",
      "csui/lib/jquery",
      "csui/lib/underscore",
      "csui/lib/marionette",
      "csui/utils/log",
      "csui/utils/base",
      "csui/lib/backbone",
      "csui/controls/table/table.view",
      'csui/controls/table/table.columns',
      'csui/utils/contexts/page/page.context',
      "csui/controls/table/cells/favorite/favorite.view",
      'csui/utils/contexts/factories/children',
      "./addRemoveFav.mock.data.js",
      "csui/lib/jquery.simulate"
    ],
    function (module, $, _, Marionette, log, base, Backbone,
        TableView, tableColumns, PageContext, Favorites,
        ChildrenCollectionFactory,
        AddRemoveFavMockData) {

      describe("Favorite Table Column", function () {

        var tableViewControl,
            mockDataTest   = AddRemoveFavMockData.test1;

        beforeEach(function () {
          mockDataTest.enable();
        });

        afterEach(function () {
          mockDataTest.disable();
        });

        it('table initialized', function (done) {
          var context = new PageContext({
            factories: {
              connector: {
                connection: {
                  url: '//server/otcs/cs/api/v1',
                  supportPath: '/support',
                  session: {
                    ticket: 'dummy'
                  }
                }
              },
              node: {
                attributes: {
                  id: 1099,
                  container_size: 20
                }
              }
            }
          });

          var el = $('<div>', {id: 'target'});
          $('body').append(el);

          var collection = context.getCollection(ChildrenCollectionFactory);

          var options = {
            el: el,
            tableColumns: tableColumns.deepClone(), // table.view needs columns
            context: context,
            collection: collection
          };
          tableViewControl = new TableView(options);
          context.fetch().then(function () {
            done();
          });

        });

        xdescribe('viewer displayed', function () {

          it('favorite column available for all items', function (done) {
            var numFavorites = tableViewControl.$el.find('.socialFav').length;
            expect(numFavorites).toBe(tableViewControl.collection.length);
            done();
          });

          it('half are selected as a favorite, half are not', function (done) {
            var numFavorites = tableViewControl.$el.find('.socialFav.selected').length;
            expect(numFavorites).toBe(tableViewControl.collection.length / 2);
            done();
          });
          xdescribe('clicking on Favorite icon', function () {
            it('clicking on selected changes to non-selected', function (done) {
              var favoriteItem = tableViewControl.$el.find('span.icon-socialFav')[0];
              $(favoriteItem).trigger('click');
              var numFavorites = tableViewControl.$el.find('.socialFav.selected').length;
              expect(numFavorites).toBe((tableViewControl.collection.length / 2) - 1);
              done();
            });

            it('clicking on non-selected changes to selected', function (done) {
              var favoriteItem = tableViewControl.$el.find('span.icon-socialFavOpen')[0];
              $(favoriteItem).trigger('click');
              var numFavorites = tableViewControl.$el.find('.socialFav.selected').length;
              expect(numFavorites).toBe(tableViewControl.collection.length / 2);
              done();
            });
          });

        });

      });
    }
);
