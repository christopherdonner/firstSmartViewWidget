/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/backbone', 'csui/models/facet',
  'csui/utils/deepClone/deepClone'
], function (_, Backbone, FacetModel) {
  'use strict';

  var FacetCollection = Backbone.Collection.extend({
    model: FacetModel,

    constructor: function FacetCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
      this.filters = options && options.filters || [];
    },

    clone: function () {
      return new this.constructor(this.models, {
        filters: _.deepClone(this.filters)
      });
    },

    setFilter: function (filters, fetch, options) {
      if (!_.isEqual(this.filters, filters)) {
        this.filters = filters;
        if (fetch !== false && areFacetsFetchable(this)) {
          this.fetch(options);
        }
        return true;
      }
    },

    addFilter: function (filters, fetch, options) {
      var existingFilters = this.filters,
          newFilters = [],
          modified;
      if (!Array.isArray(filters)) {
        filters = [filters];
      }
      filters.forEach(function (filter) {
        var existingFilter = _.findWhere(existingFilters, {id: filter.id});
        if (existingFilter) {
          var existingValues = existingFilter.values,
              newValues = filter.values.filter(function (value) {
                return !_.findWhere(existingValues, {id: value.id});
              });
          if (newValues.length) {
            existingValues.push.apply(existingValues, newValues);
            modified = true;
          }
        } else {
          if (filter.values.length) {
            newFilters.push(filter);
          }
        }
      });
      if (newFilters.length) {
        existingFilters.push.apply(existingFilters, newFilters);
        modified = true;
      }
      if (modified) {
        if (fetch !== false && areFacetsFetchable(this)) {
          this.fetch(options);
        }
        return true;
      }
    },

    removeFilter: function (filters, fetch, options) {
      var modified;
      if (!Array.isArray(filters)) {
        filters = [filters];
      }
      this.filters = _.reject(this.filters, function (existingFilter) {
        var filter = _.findWhere(filters, {id: existingFilter.id});
        if (filter) {
          var values = filter.values,
              newValues = _.reject(existingFilter.values, function (existingValue) {
                if (_.findWhere(values, {id: existingValue.id})) {
                  modified = true;
                  return true;
                }
              });
          if (!newValues.length) {
            modified = true;
            return true;
          }
          existingFilter.values = newValues;
        }
      });
      if (modified) {
        if (fetch !== false && areFacetsFetchable(this)) {
          this.fetch(options);
        }
        return true;
      }
    },

    clearFilter: function (fetch, options) {
      if (this.filters.length > 0) {
        this.filters = [];
        if (fetch !== false && areFacetsFetchable(this)) {
          this.fetch(options);
        }
        return true;
      }
    },

    getAvailableFacets: function () {
      return getSomeFacets(this, false);
    },

    getSelectedFacets: function () {
      return getSomeFacets(this, true);
    }
  });

  function areFacetsFetchable(facets) {
    return facets.isFetchable && facets.isFetchable();
  }

  function getSomeFacets(facets, selected) {
    selected = !!selected;
    return facets
      .filter(function (facet) {
        return facet.topics.some(function (topic) {
          var isSelected = !!topic.get('selected');
          return selected === isSelected;
        });
      })
      .map(function (facet) {
        facet = facet.toJSON();
        facet.topics = facet.topics.filter(function (topic) {
          var isSelected = !!topic.selected;
          return selected === isSelected;
        });
        return facet;
      });
  }

  return FacetCollection;
});
