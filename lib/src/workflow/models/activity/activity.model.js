/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone'
], function (_, $, Backbone) {
  'use strict';

  var ActivityModel = Backbone.Model.extend({

    constructor: function ActivityModel(attributes, options) {
      options || (options = {});
      this.connector = options.connector || options.collection.connector;
      Backbone.Model.prototype.constructor.apply(this, arguments);
    }
  });

  return ActivityModel;

});