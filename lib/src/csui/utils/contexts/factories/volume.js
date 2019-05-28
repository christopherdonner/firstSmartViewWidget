/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/node',
  'csui/models/node/node.model'
], function (module, _, Backbone, ModelFactory, NodeModelFactory, NodeModel) {

  var VolumeModelFactory = ModelFactory.extend({

    propertyPrefix: 'volume',

    constructor: function VolumeModelFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);

      var volume = this.options.volume || {};
      if (!(volume instanceof Backbone.Model)) {
        var node = context.getModel(NodeModelFactory, options),
            config = module.config();
        node.setExpand('properties', 'volume_id');
        volume = new NodeModel(
            _.extend({}, node.get('volume_id'), volume.attributes || config.attributes),
            _.extend({
              connector: node.connector
            }, volume.options, config.options));

        this.listenTo(node, 'change:volume_id', function () {
          volume.set(node.get('volume_id'));
        });
      }
      this.property = volume;
    }

  });

  return VolumeModelFactory;

});
