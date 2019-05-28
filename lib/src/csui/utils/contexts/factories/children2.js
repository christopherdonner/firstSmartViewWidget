/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/node',
  'csui/models/node.children2/node.children2', 'csui/utils/commands'
], function (module, _, Backbone, CollectionFactory, NodeModelFactory,
    NodeChildren2Collection, allCommands) {
  'use strict';

  var Children2CollectionFactory = CollectionFactory.extend({
    propertyPrefix: 'children2',

    constructor: function Children2CollectionFactory(context, options) {
      options || (options = {});
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var children = this.options.children2 || {},
          commands = children.options && children.options.commands ||
                     allCommands;
      if (!(children instanceof Backbone.Collection)) {
        var node   = context.getModel(NodeModelFactory, options),
            config = module.config();
        children = new NodeChildren2Collection(children.models,
            _.defaults({
                  autoreset: true,
                  fields: {
                    properties: [],
                    'versions.element(0)': ['owner_id']
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

  return Children2CollectionFactory;
});
