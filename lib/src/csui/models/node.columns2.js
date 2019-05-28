/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/backbone'], function (Backbone) {
  'use strict';

  var NodeColumn2Model = Backbone.Model.extend({
    id: 'column_key',

    constructor: function NodeColumn2Model(attributes, options) {
      Backbone.Model.prototype.constructor.call(this, attributes, options);
    }
  });

  var NodeColumn2Collection = Backbone.Collection.extend({
    model: NodeColumn2Model,

    constructor: function NodeColumn2Collection(models, options) {
      Backbone.Collection.prototype.constructor.call(this, models, options);
    }
  });

  return NodeColumn2Collection;
});
