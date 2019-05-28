/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/connector',
  'csui/models/node/node.model'
], function (module, _, Backbone, ModelFactory, ConnectorFactory, NodeModel) {
  'use strict';

  var PreviousNodeModelFactory = ModelFactory.extend({

    propertyPrefix: 'previousNode',

    constructor: function PreviousNodeModelFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);

      var connector = context.getObject(ConnectorFactory, options),
          config = module.config();
      this.property = new NodeModel(undefined,
          _.defaults({
            connector: connector
          }, config.options));
    }

  });

  return PreviousNodeModelFactory;

});
