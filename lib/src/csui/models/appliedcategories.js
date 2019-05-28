/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/backbone', 'csui/utils/url',
  'csui/models/mixins/node.resource/node.resource.mixin',
  'csui/models/appliedcategory'
], function (_, Backbone, Url, NodeResourceMixin, AppliedCategoryModel) {
  'use strict';

  var AppliedCategoryCollection = Backbone.Collection.extend({

    model: AppliedCategoryModel,

    constructor: function AppliedCategoryCollection(models, options) {
      options || {};
      this.sortInitially = !!options.sortInitially ? options.sortInitially :
                           this.sortInitially;

      Backbone.Collection.prototype.constructor.apply(this, arguments);

      this.makeNodeResource(options);
    },

    clone: function () {
      return new this.constructor(this.models, {node: this.node});
    },

    url: function () {
      return Url.combine(this.node.urlBase(), 'categories');
    },

    parse: function (response, options) {
      return this.sortInitially(response.data);
    },

    sortInitially: function (data) {
      return _.isArray(data) ? _.sortBy(data, function (ele) {return ele.name.toLowerCase()}) :
             data;
    }

  });

  NodeResourceMixin.mixin(AppliedCategoryCollection.prototype);

  return AppliedCategoryCollection;

});
