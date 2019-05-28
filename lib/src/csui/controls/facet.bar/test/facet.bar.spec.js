/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/controls/facet.bar/facet.bar.view', 'csui/models/nodefacets',
  'csui/lib/jquery.simulate'
], function (_, $, Marionette, FacetBarView, FacetModelCollection) {
  'use strict';

  describe('Facet Bar Spec', function () {
    var facetBarView, factBarRegion, facetCollection;

    beforeAll(function () {
      facetCollection = new FacetModelCollection([
        {
          id: '2224',
          name: 'Content type',
          topics: [
            {
              value: '144',
              name: 'document',
              selected: true
            },
            {
              value: '23',
              name: 'Microsoft word',
              selected: true
            },
            {
              value: 're10',
              name: 'two weeks ago',
              selected: true
            },
            {
              value: 're100',
              name: '09/23/2015',
              selected: true
            }
          ]
        },
        {
          id: '2225',
          name: 'Application',
          topics: [
            {
              value: '23',
              name: 'Microsoft word',
              selected: true
            }
          ]
        },
        {
          id: '2226',
          name: 'Modify Date',
          topics: [
            {
              value: 're10',
              name: 'two weeks ago',
              selected: true
            }
          ]
        },
        {
          id: '2227',
          name: 'Create Date',
          topics: [
            {
              value: 're100',
              name: '09/23/2015',
              selected: true
            }
          ]
        }
      ]);

      var facetView = $('<div class="csui-table-facetview" style="height:50px; width:700px">');
      $('body').append(facetView);

      factBarRegion = new Marionette.Region({
        el: ".csui-table-facetview"
      });
      facetBarView = new FacetBarView({collection: facetCollection});
      factBarRegion.show(facetBarView);
    });

    afterAll(function() {
      factBarRegion.empty();
    });

    it('show 4 single select items', function (done) {
      facetCollection.filters = [
        {
          id: '2224',
          values: [
            {id: '144'}
          ]
        },
        {
          id: '2225',
          values: [
            {id: '23'}
          ]
        },
        {
          id: '2226',
          values: [
            {id: 're10'}
          ]
        },
        {
          id: '2227',
          values: [
            {id: 're100'}
          ]
        }
      ];

      facetCollection.on('reset', function () {
        expect($('.csui-facet-list > .csui-facet-item').length).toBe(4);
        expect($('.csui-facet-list-area > ol > li').length).toBe(4);
        facetCollection.off('reset');
        done();
      });
      facetCollection.trigger('reset');
    }, 10000);

    it('show 4 multi select items', function (done) {
      facetCollection.filters = [{
        id: '2224',
        values: [
          {id: '144'},
          {id: '23'},
          {id: 're10'},
          {id: 're100'}
        ]
      }];

      facetBarView.on('render', function () {
        expect($('.csui-facet-list > .csui-facet-item').length).toBe(4);
        expect($('.csui-facet-list-area > ol > li').length).toBe(4);
        facetBarView.off('render');
        done();
      });
      facetBarView.render();
    });

    it('remove second filter value', function (done) {
      facetBarView.on('remove:filter', function (filter) {
        facetCollection.removeFilter(filter, false);
        var newFilters = JSON.parse(JSON.stringify(facetCollection.filters));
        facetBarView.facetBarItemsView.once('render', function () {
          expect(facetBarView.$('.csui-facet-list .csui-facet-item').length).toBe(3);
          expect(facetBarView.$('.csui-facet-list-area > ol > li').length).toBe(3);
          expect(facetBarView.$('.csui-facet-list .csui-facet-item .csui-label')[1].innerText).toBe('Content type: two weeks ago');
          done();
        });
        facetBarView.allTopicsCollection.reset(facetBarView._getAllTopics(facetCollection.filters));     // change internal collection to force render
      });
      facetBarView._filtersUpdated();
      var closeElem = facetBarView.$('.csui-facet-list .binf-close');
      $(closeElem[1]).trigger('click');       // triggers close on 2nd value
    }, 3000);
  });
});
