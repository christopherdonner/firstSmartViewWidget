/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/backbone', 'csui/models/facettopic'
], function (Backbone, FacetTopicModel) {
  'use strict';

  var FacetTopicCollection = Backbone.Collection.extend({
    model: FacetTopicModel,

    constructor: function FacetTopicCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
    }
  });

  return FacetTopicCollection;
});
