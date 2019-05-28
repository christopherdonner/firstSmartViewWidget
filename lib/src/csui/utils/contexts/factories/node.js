/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/connector',
  'csui/models/node/node.model', 'csui/utils/commands'
], function (module, $, Backbone, ModelFactory, ConnectorFactory,
    NodeModel, commands) {
  'use strict';

  var NodeModelFactory = ModelFactory.extend({
    propertyPrefix: 'node',

    constructor: function NodeModelFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);

      var node = this.options.node || {},
          config = module.config();
      if (!(node instanceof Backbone.Model)) {
        var connector = context.getObject(ConnectorFactory, options),
            creationOptions = $.extend(true, {
              connector: connector,
              fields: {
                properties: []
              },
              expand: {
                properties: ['original_id']
              },
              commands: commands.getAllSignatures()
            }, config.options, node.options);
        node = new NodeModel(node.attributes || config.attributes,
            creationOptions);
      }
      this.property = node;
    },

    isFetchable: function () {
      return this.property.isFetchable();
    },

    fetch: function (options) {
      return this.property.fetch(options);
    }
  });

  return NodeModelFactory;
});
