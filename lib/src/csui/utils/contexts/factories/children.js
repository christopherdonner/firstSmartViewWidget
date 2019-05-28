/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/node',
  'csui/models/nodechildren', 'csui/utils/commands'
], function (module, _, Backbone, CollectionFactory, NodeModelFactory,
    NodeChildrenCollection, allCommands) {
  'use strict';

  var ChildrenCollectionFactory = CollectionFactory.extend({

    propertyPrefix: 'children',

    constructor: function ChildrenCollectionFactory(context, options) {
      options || (options = {});
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var children = this.options.children || {},
          commands = children.options && children.options.commands ||
                     allCommands;
      if (!(children instanceof Backbone.Collection)) {
        var node   = context.getModel(NodeModelFactory, options),
          config = module.config();
        children = new NodeChildrenCollection(children.models,
          _.defaults({
              autoreset: true,
              fields: {
                properties: []
              },
              expand: {
                properties: ['original_id']
              },
              commands: commands.getAllSignatures()
            },
            config.options,
            children.options,
            {node: node}
          ));
      }
      this.property = children;
    },

    isFetchable: function () {
      return this.property.isFetchable();
    },

    fetch: function (options) {
      return this.property.fetch(options);
    }

  });

  return ChildrenCollectionFactory;

});
