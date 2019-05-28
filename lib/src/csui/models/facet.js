/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/backbone', 'csui/models/facettopics'
], function (Backbone, FacetTopicCollection) {
  'use strict';

  var FacetModel = Backbone.Model.extend({
    constructor: function FacetModel(attributes) {
      Backbone.Model.prototype.constructor.apply(this, arguments);

      this.topics = new FacetTopicCollection(attributes && attributes.topics);
    },

    parse: function (response, options) {
      if (this.topics) {
        this.topics.reset(response.topics);
      }
      return response;
    }
  });

  return FacetModel;
});
