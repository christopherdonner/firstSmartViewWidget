/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
    'webreports/widgets/visual.data.filtered.count/impl/controls/visualdata/impl/facet.bar/facet.bar.view',
    'webreports/widgets/visual.data.filtered.count/impl/controls/visualdata/impl/facet.panel/facet.panel.view',
    'webreports/widgets/visual.data.filtered.count/impl/controls/visualdata/visual.data.overlay.view',
    'i18n!webreports/widgets/visual.data.filtered.count/impl/controls/visualdata/impl/nls/visual.data.lang',
    'hbs!webreports/widgets/visual.data.filtered.count/impl/controls/visualdata/impl/visual.data.expanded',
    'css!webreports/widgets/visual.data.filtered.count/impl/controls/visualdata/impl/visual.data.expanded'
], function (_, $, Backbone, Marionette, FacetBarView, FacetPanelView, VisualDataControls, lang, template) {

    var VisualDataExpandedView = Marionette.LayoutView.extend({

        className: 'expanded-visualization-container',

        template: template,

        regions: {
            chicklets: '.facetbarview',
            facetRegion: '#facetview',
            visualizationControls: '.visual-data-controls-parent', // these are the same setting controls as used in the overlay in tile view, but shown differently
            visualization: '.visual-data-visualization'
        },

        constructor: function VisualDataExpandedView(options) {
            var filters;
            Marionette.LayoutView.prototype.constructor.apply(this, arguments);

            this.contentView = options.data.expandedContentView; //FIXME maybe some error checking here
            this.facetFilters = this.contentView.collection.facetFilters;
            filters = this.contentView.collection.getFilters();
            if ((this.facetFilters.filters.length === 0) && (filters.length > 0)) {
                this.facetFilters.filters = this.contentView.collection.mapFilterData(filters);
            }
        },

        callBackAlreadyHit: false,

        onDomRefresh: function() {

            if (this.callBackAlreadyHit) {
                this._renderFacetBar();
                this._renderFacetPanel();
                this._renderExpandedControls();
                this._renderChart();
            }
            this.callBackAlreadyHit = true;

        },

        _clearFilters: function(){
            this.facetFilters.clearFilters();
            this.contentView.collection.clearFilters();
        },

        _addToFacetFilter: function(filter){

            this.facetFilters.addFilter(filter);
            this.contentView.collection.addFilter(filter);
            this._renderFacetBar();
            this._renderExpandedControls();
            this._renderFacetPanel();
        },

        _renderChart: function(){
            this.getRegion('visualization').show(this.contentView);
            this.contentView.resetAndRender();
        },

        _renderFacetBar: function(){
                this.facetBarView = new FacetBarView({
                    collection: this.facetFilters
                });

                this.listenTo(this.facetBarView, 'remove:filter', this._removeFacetFilter, this)
                    .listenTo(this.facetBarView, 'remove:all', this._removeAll, this)
                    .listenTo(this.contentView, 'apply:filter', this._addToFacetFilter, this);

                if (this.facetFilters.filters.length > 0){
                    this.getRegion('chicklets').show(this.facetBarView);
                }
        },

        _renderFacetPanel: function(){

            this.getRegion('facetRegion').empty();
            this._setFacetView();
            this.getRegion('facetRegion').show(this.facetView);

         },

        _setFacetView: function () {
            this.facetView = new FacetPanelView({
                collection: this.facetFilters,
                enableCheckBoxes: true,
                blockingLocal: true
            });

            this.listenTo(this.facetView, 'apply:filter', this._addToFacetFilter);
        },

        _renderExpandedControls: function(){
            this.expandedControls = new VisualDataControls({
                overlayModel: this.contentView.collection.overlayModel
            });
            this.getRegion('visualizationControls').show(this.expandedControls);
        },

        _removeFacetFilter: function (filter) {
          var facetName = this.contentView.collection.getActiveColumnByFormattedName(this.facetFilters.filters[filter.facetIndex].facetName),
              valueToRemove = this.facetFilters.filters[filter.facetIndex].values[filter.filterIndex].id,
              newFacetFilters = this.facetFilters.removeFilter(filter.facetIndex, filter.filterIndex);
            if (newFacetFilters.length === 0){
                this.contentView.collection.clearFilters(facetName, valueToRemove);
                this.getRegion('chicklets').empty();
            } else {
                this.contentView.collection.updateFilters(facetName, valueToRemove);
            }
            this._renderExpandedControls();
        },

        _removeAll: function () {
            this._clearFilters();
            this.getRegion('chicklets').empty();
            this._renderExpandedControls();
        }
    });

    return VisualDataExpandedView;

});
