/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery'
], function (_, $) {
  'use strict';

  var FacetQueryMixin = {
    mixin: function (prototype) {
      return _.extend(prototype, {
        makeFacetQuery: function (options) {
          return this;
        },

        getFilterQuery: function (filters) {
          return getFilterQuery(filters || this.filters,
              this.filterQueryParameterName);
        },

        getFilterQueryValue: function (filters) {
          return getFilterQueryValue(filters || this.filters);
        }
      });
    }
  };

  function getFilterQuery(filters, parameterName) {
    var value = getFilterQueryValue(filters);
    if (value.length) {
      var parameters = {};
      parameters[parameterName] = value;
      return $.param(parameters, true);
    }
    return '';
  }

  function getFilterQueryValue(filters) {
    return filters && _.map(filters, getFilterValue) || [];
  }

  function getFilterValue(filter) {
    return filter.id + ':' +
        _.reduce(filter.values, function (result, value) {
         if (result) {
           result += '|';
         }
         return result + value.id.toString();
        }, '');
  }

  return FacetQueryMixin;
});
