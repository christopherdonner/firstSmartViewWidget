/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/node',
  'csui/models/nodeancestors'
], function (module, _, Backbone, CollectionFactory, NodeModelFactory, NodeAncestorCollection) {
  'use strict';

  var prefetch = /\bprefetch(?:=([^&]*)?)/i.exec(location.search);
  prefetch = !prefetch || prefetch[1] !== 'false';

  var initialResourceFetched;

  var AncestorCollectionFactory = CollectionFactory.extend({
    propertyPrefix: 'ancestors',

    constructor: function AncestorsCollectionFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var ancestors = this.options.ancestors || {},
          config = module.config();
      if (prefetch) {
        this.initialResponse = ancestors.initialResponse || config.initialResponse;
      }
      if (!(ancestors instanceof Backbone.Collection)) {
        var node = context.getModel(NodeModelFactory, options);
        ancestors = new NodeAncestorCollection(ancestors.models,
          _.defaults({
            node: node
          }, ancestors.options, config.options));
      }
      this.property = ancestors;
    },

    isFetchable: function () {
      return this.property.isFetchable();
    },

    fetch: function (options) {
      if (this.initialResponse && !initialResourceFetched) {
        var promise = this.property.prefetch(this.initialResponse, options);
        initialResourceFetched = true;
        return promise;
      } else {
        return this.property.fetch(options);
      }
    }
  });

  return AncestorCollectionFactory;
});
