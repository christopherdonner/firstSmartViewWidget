/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/utils/contexts/factories/factory',
  'csui/utils/connector'
], function (module, _, ObjectFactory, Connector) {

  var ConnectorFactory = ObjectFactory.extend({

    propertyPrefix: 'connector',

    constructor: function ConnectorFactory(context, options) {
      ObjectFactory.prototype.constructor.apply(this, arguments);

      var connector = this.options.connector || {};
      if (!(connector instanceof Connector)) {
        var config = module.config(),
            connection = connector.connection || config.connection || {};
        _.defaults(connection, connector.connection, config.connection);
        connector = new Connector(_.defaults({
          connection: connection
        }, connector, config));
      }
      this.property = connector;
    }

  });

  return ConnectorFactory;

});
