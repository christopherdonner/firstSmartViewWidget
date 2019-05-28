/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/lib/marionette',
  'csui/utils/contexts/page/page.context',
  'csui/utils/contexts/factories/ancestors',
  'csui/utils/contexts/factories/node',
  'csui/utils/contexts/factories/next.node',
  'csui/controls/breadcrumbs/breadcrumbs.view',
  './breadcrumbs.mock.data.js', 'csui/lib/jquery.mockjax'
], function ($, Marionette, PageContext, AncestorsCollectionFactory,
    NodeModelFactory, NextNodeModelFactory, BreadCrumbsView, DataManager) {
  'use strict';

  describe("BreadCrumbCollectionView", function () {
    var pageContext, breadcrumbs, collection;

    beforeAll(function () {
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
          },
          node: {
            attributes: {id: 3333}
          }
        }
      });

      DataManager.test.enable();
    });

    afterAll(function () {
      DataManager.test.disable();
    });

    beforeEach(function () {
      collection = pageContext.getCollection(AncestorsCollectionFactory);
      breadcrumbs = new BreadCrumbsView({
        context: pageContext,
        collection: collection
      });
    });

    it('can be instantiated and rendered', function () {
      expect(breadcrumbs).toBeDefined();
      expect(breadcrumbs.$el.length > 0).toBeTruthy();
      breadcrumbs.render();
      expect(breadcrumbs.$el.length > 0).toBeTruthy();
    });

    it('can load ancestors for current node', function (done) {
      pageContext
          .fetch()
          .then(function () {
            expect(breadcrumbs.completeCollection.length).toEqual(3);
            done();
          });
    });

    describe('if the parent element is not wide enough', function () {

      var parent, region;

      beforeEach(function (done) {
        parent = $('<div>', {
          style: 'width: 624px'
        });
        region = new Marionette.Region({el: parent[0]});
        $(document.body).append(parent);
        region.show(breadcrumbs);

        var node = pageContext.getModel(NodeModelFactory);
        node.set('id', 1111);
        pageContext
            .fetch()
            .then(function () {
              breadcrumbs.refresh();
            })
            .done(done);
      });

      afterEach(function () {
        region.empty();
        parent.remove();
      });

      it('collapses a part of the breadcrumb to "..." popup menu', function () {
        expect(breadcrumbs.completeCollection.length)
            .not.toEqual(breadcrumbs.collection.length,
            'Some ancestors were collapsed to dropdown menu.');
      });

      it('renders URL of the target container in a collapsed link', function () {
        var href = breadcrumbs
            .$('li > ul.binf-dropdown-menu > li > a')
            .first()
            .attr('href');
        expect(/nodes\/\d+$/.test(href)).toBeTruthy();
      });

      it('navigates, when clicked on a collapsed link', function () {
        var link = breadcrumbs
                .$('li > ul.binf-dropdown-menu > li > a')
                .first(),
            nextId = parseInt(/nodes\/(\d+)$/.exec(link.attr('href'))[1]),
            nextNode = pageContext.getModel(NextNodeModelFactory);
        link.click();
        expect(nextNode.get('id')).toEqual(nextId);
      });

    });

  });

});
