/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/backbone'
], function (Backbone) {
  'use strict';

  var FacetTopicModel = Backbone.Model.extend({
    idAttribute: 'value',

    constructor: function FacetTopicModel() {
      Backbone.Model.prototype.constructor.apply(this, arguments);
    }
  });

  return FacetTopicModel;
});
