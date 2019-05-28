/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/node',
  'csui/models/node/node.addable.type.collection'
], function (module, _, Backbone, CollectionFactory, NodeModelFactory, NodeAddableTypeCollection) {

  var AddableTypeCollectionFactory = CollectionFactory.extend({

    propertyPrefix: 'addableTypes',

    constructor: function AddableTypeCollectionFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var addableTypes = this.options.addableTypes || {};
      if (!(addableTypes instanceof Backbone.Collection)) {
        var node   = context.getModel(NodeModelFactory, options),
            config = module.config();
        addableTypes = new NodeAddableTypeCollection(addableTypes.models,
            _.defaults(
                {
                  autoreset: true
                },
                addableTypes.options,
                config.options,
                {node: node}
            ));
      }
      this.property = addableTypes;
    },

    fetch: function (options) {
      return this.property.fetch(options);
    }

  });

  return AddableTypeCollectionFactory;

});
