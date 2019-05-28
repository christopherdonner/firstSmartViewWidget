/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/connector',
  'csui/models/nodescount'
], function (module, _, $, Backbone, ModelFactory, ConnectorFactory, NodesCountModel) {
  'use strict';

  var NodesCountModelFactory = ModelFactory.extend({
    propertyPrefix: 'nodesCount',

    constructor: function NodesCountModelFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);

      var nodesCount = this.options.nodesCount || {},
          config = module.config();
      if (!(nodesCount instanceof Backbone.Model)) {
        var connector = context.getObject(ConnectorFactory, options);
        nodesCount = new NodesCountModel(
            nodesCount.attributes,
            _.defaults({
                  connector: connector,
                  node: this.options.node
                }, nodesCount.options, config.options
            )
        );
      }
      this.property = nodesCount;
    },

    fetch: function (options) {
      return this.property.fetch(options);
    }
  });
  return NodesCountModelFactory;
});