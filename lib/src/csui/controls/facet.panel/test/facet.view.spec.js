/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/utils/contexts/page/page.context',
  'csui/controls/facet.panel/facet.panel.view',
  "csui/utils/contexts/factories/node",
  'csui/utils/contexts/factories/connector',
  'csui/models/node/node.facet.factory',
  './facet.mock.data.js',
  "csui/lib/jquery.simulate"
], function (_, $, Marionette, PageContext, FacetPanelView, NodeFactory,
             ConnectorFactory, FacetFilterCollectionFactory, mockData) {
  "use strict";

  describe('Facet View Spec', function () {

    var facetPanelView;

    beforeEach(function (done) {
      mockData.enable();

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
            attributes: {id: 2000}
          }
        }
      });

      var facetCollection = context.getCollection(FacetFilterCollectionFactory),
        facetFetching = facetCollection.fetch()
          .then(function () {
            var facetView = $('<div class="csui-table-facetview" style="height:400px; width:200px">');
            $('body').append(facetView);

            var factPanelRegion = new Marionette.Region({
              el: ".csui-table-facetview"
            });
            facetPanelView = new FacetPanelView({
              collection: facetCollection
            });
            factPanelRegion.show(facetPanelView);
            done();
          })
          .fail(function () {
            expect(facetFetching.state()).toBe('resolved', "facet fetch did not complete");
          });
    });

    afterEach(function () {
      facetPanelView.destroy();

      mockData.disable();
    });

    it('show 1 facet with 6 filters and 1 with 5', function (done) {
      expect($('.csui-facet').length).toBe(2);
      expect($($('.csui-facet')[0]).find('.csui-facet-item').length).toBe(6);
      expect($($('.csui-facet')[1]).find('.csui-facet-item').length).toBe(5);
      expect($($('.csui-facet .header-label')[0]).text()).toBe('Content Type');
      done();
    });

    describe('test more options', function () {

      it('facet with 6 plus filters has a more options', function (done) {
        expect($($('.csui-facet')[0]).find('.csui-more-text').length).toBe(1);
        expect($($('.csui-facet')[1]).find('.csui-more-text').length).toBe(0);
        done();
      });

      it('click on more shows all items', function (done) {
        expect($($('.csui-facet')[0]).find('.csui-facet-item.more.binf-hidden').length).toBe(1);
        expect($($('.csui-facet')[0]).find('.csui-more-text').text()).toBe('Show more');
        $($('.csui-facet')[0]).find('.csui-filter-more').click();
        expect($($('.csui-facet')[0]).find('.csui-more-text').text()).toBe('Show less');
        expect($($('.csui-facet')[0]).find('.csui-facet-item.more.binf-hidden').length).toBe(0);
        done();
      });

      it('click on Less shows only 5 items', function (done) {
        $($('.csui-facet')[0]).find('.csui-filter-more').click();

        expect($($('.csui-facet')[0]).find('.csui-facet-item.more.binf-hidden').length).toBe(0);
        $($('.csui-facet')[0]).find('.csui-filter-more').click();
        expect($($('.csui-facet')[0]).find('.csui-more-text').text()).toBe('Show more');
        expect($($('.csui-facet')[0]).find('.csui-facet-item.more.binf-hidden').length).toBe(1);
        done();
      });
    });

    describe('test clicking on checkbox', function () {
      var itFlags = [false, false, false, false, false];

      it('click on checkbox displays apply/control options and disables all other facets',
        function (done) {
          expect($('.csui-facet-content.facet-disabled').length).toBe(0);
          expect($($('.csui-facet')[0]).find(
            '.csui-facet-controls.csui-multi-select').length).toBe(0);
          $($($('.csui-facet')[0]).find('input')[0]).click();
          expect($($('.csui-facet')[0]).find(
            '.csui-facet-controls.csui-multi-select').length).toBe(1);
          expect($('.csui-facet-content.facet-disabled').length).toBe(1);
          done();
        });

      it('selecting 5 checkboxes disables remaining facet filters', function (done) {
        $($($('.csui-facet')[0]).find('input')[0]).click();
        for (var i = 1; i < 5; i++) {
          $($($('.csui-facet')[0]).find('input')[i]).click();
        }
        expect($($('.csui-facet')[0]).find('.csui-facet-item.more.binf-disabled').length).toBe(1);
        done();
      });

      it('de-selecting one of 5 items re-enables remaining facet filters', function (done) {
        $($($('.csui-facet')[0]).find('input')[0]).click();
        for (var i = 1; i < 5; i++) {
          $($($('.csui-facet')[0]).find('input')[i]).click();
        }

        $($($('.csui-facet')[0]).find('input')[4]).click();
        expect($($('.csui-facet')[0]).find('.csui-facet-item.more.binf-disabled').length).toBe(0);
        itFlags[2] = true;
        done();
      });
    });

  });
});
