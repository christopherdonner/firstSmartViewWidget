/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/models/facets'
], function (_, $, FacetCollection) {
  'use strict';

  var FilteredCountFacetCollection = FacetCollection.extend({

      constructor: function FilteredCountFacetCollection(models, options) {
        FacetCollection.prototype.constructor.apply(this, arguments);
        this.filters = options && options.filters || [];
      },

      addFilter: function (filter) {
        this.filters.push(filter);
        return JSON.parse(JSON.stringify(this.filters));
      },

      removeFilter: function (filterIndex, valueIndex) {
        var filter = this.filters[filterIndex];
        filter.values.splice(valueIndex, 1);

        if (filter.values.length === 0) {
          this.filters.splice(filterIndex, 1);
        }
        return JSON.parse(JSON.stringify(this.filters));
      },

      clearFilters: function () {
        if (this.filters && this.filters.length > 0) {
          this.filters = [];
        }
        return [];
      }

  });

  return FilteredCountFacetCollection;

});
