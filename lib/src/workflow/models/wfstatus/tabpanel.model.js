/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone'
   
  ], function ($, _, Backbone) {
  'use strict';

  var TabpanelModel = Backbone.Model.extend({

    constructor: function TabpanelModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
    }

  });

  var TabpanelCollection = Backbone.Collection.extend({
    model: TabpanelModel,

    constructor: function TabpanelCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
    }
  });

  return TabpanelCollection;

});
