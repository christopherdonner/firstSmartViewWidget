/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/models/facets'
], function (FacetCollection) {
  'use strict';

  var SearchFacetCollection = FacetCollection.extend({
    constructor: function SearchFacetCollection(models, options) {
      FacetCollection.prototype.constructor.apply(this, arguments);
    }
  });

  return SearchFacetCollection;
});
