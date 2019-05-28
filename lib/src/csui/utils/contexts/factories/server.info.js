/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/backbone',
  'csui/utils/contexts/factories/factory',
  'csui/models/server.info'
], function (Backbone, ModelFactory, ServerInfoModel) {

  var ServerInfoFactory = ModelFactory.extend({

    propertyPrefix: 'serverInfo',

    constructor: function ServerInfoFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);

      var serverInfoModel = this.options.serverInfoModel || {};
      if (!(serverInfoModel instanceof Backbone.Model)) {
        serverInfoModel = new ServerInfoModel(undefined, {connector: options.connector});
      }
      this.property = serverInfoModel;
    },

    fetch: function (options) {
      return this.property.fetch(options);
    },

    isFetchable: function(){
      return (this.property.get('hostAddress') === undefined);
    }


  });

  return ServerInfoFactory;

});
