/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette', 'csui/widgets/nodestable/impl/facet.bar/facet.bar.view',
  'csui/models/nodefacets', "csui/models/node/node.model", "csui/lib/jquery.simulate"
], function (_,$, Marionette, FacetBarView,  FacetModelCollection, NodeModel) {
  "use strict";

  xdescribe('Facet Bar Spec', function () {

    var facetBarView, factBarRegion, facetCollection;

    it('create a facet bar display with single select items', function(){
      var node = new NodeModel();
        facetCollection = new FacetModelCollection(undefined, {node:node});

      var facetView  = $('<div id="facetview" style="height:50px; width:700px">');
      $('body').append(facetView);

      factBarRegion = new Marionette.Region({
          el: "#facetview"
        });
      facetBarView = new FacetBarView({collection:facetCollection});
      factBarRegion.show(facetBarView);
    });

    it('show 4 single select items', function(){

      runs(function(){
        facetCollection.filters = [{
          id: '2224',
          facetName: 'Content type',
          values: [
            {
              topicName: 'document',
              id: '144'
            }
          ]
        },
          {
            id: '2227',
            facetName: 'Application',
            values: [
              {
                topicName: 'Microsoft word',
                id: '23'
              }
            ]
          },
          {
            id: '2225',
            facetName: 'Modify Date',
            values: [
              {
                topicName: 'two weeks ago',
                id: 're10'
              }
            ]
          },
          {
            id: '2225',
            facetName: 'Modify Date',
            values: [
              {
                topicName: '09/23/2015',
                id: 're100'
              }
            ]
          }
        ];

        facetCollection.trigger('reset');

        expect($('.csui-facet-list .csui-facet-item').length).toBe(2);
        expect($('.dropdown-facet-list > ul > li').length).toBe(2);
      });

    });

    it('show 4 multi select items', function(){

      runs(function() {
        facetCollection.filters = [{
          id: '2224',
          facetName: 'Content type',
          values: [
            {
              topicName: 'document',
              id: '144'
            },
            {
              topicName: 'Microsoft word',
              id: '23'
            },
            {
              topicName: 'two weeks ago',
              id: 're10'
            },
            {
              topicName: '09/23/2015',
              id: 're100'
            }
          ]
        }];

        facetBarView.render();

        expect($('.csui-facet-list .csui-facet-item').length).toBe(2);
        expect($('.dropdown-facet-list > ul > li').length).toBe(2);
      });

    });

    it('remove second filter', function () {

      var reset = false;

        facetBarView.on('remove:filter', function (filter) {
          facetCollection.removeFilter(filter.facetIndex, filter.filterIndex, false);
          facetCollection.trigger('reset');
        reset = true;
        });

        $($('.csui-facet-list .binf-close')[1]).trigger('click');

      waitsFor(function () {
        return reset;
      }, 2000, 'Filter collection not created');
      runs(function() {
        expect($('.csui-facet-list .csui-facet-item').length).toBe(2);
        expect($('.dropdown-facet-list > ul > li').length).toBe(1);
        expect($('.csui-facet-list .csui-facet-item .csui-label')[1].innerText).toBe('Content type : two weeks ago');
      });
    });

    it('end of test reached', function () {
      waitsFor(function(){
        return facetCollection;
      }, 2000, 'Filter collection not created');

      runs(function() {
        facetBarView.destroy();
      });
    });

  });
});


