/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/models/facets',
  'csui/models/mixins/node.resource/node.resource.mixin',
  'csui/models/node.facets/server.adaptor.mixin',
  'csui/utils/deepClone/deepClone'
], function (_, FacetCollection, NodeResourceMixin, ServerAdaptorMixin) {
  'use strict';

  var NodeFacetCollection = FacetCollection.extend({
    constructor: function NodeFacetCollection(models, options) {
      FacetCollection.prototype.constructor.apply(this, arguments);
      this.makeNodeResource(options)
          .makeServerAdaptor(options);
    },

    clone: function () {
      return new this.constructor(this.models, {
        node: this.node,
        filters: _.deepClone(this.filters)
      });
    }
  });

  NodeResourceMixin.mixin(NodeFacetCollection.prototype);
  ServerAdaptorMixin.mixin(NodeFacetCollection.prototype);

  return NodeFacetCollection;
});
