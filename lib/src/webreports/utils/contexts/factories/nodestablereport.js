/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/connector',
  'webreports/models/nodestablereport/nodestablereport.model', 'csui/utils/commands',
  'csui/utils/deepClone/deepClone','csui/utils/contexts/factories/node'
], function (module, _, Backbone, CollectionFactory, ConnectorFactory, NodesTableReportCollection, commands) {
  'use strict';

  var NodesTableReportCollectionFactory = CollectionFactory.extend({

    propertyPrefix: 'nodestablereport',

    constructor: function NodesTableReportCollectionFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var nodestablereport = this.options.nodestablereport || {};

      if (!(nodestablereport instanceof Backbone.Collection)) {
		var connector = context.getObject(ConnectorFactory, options);
        var config = module.config();
        nodestablereport = new NodesTableReportCollection(nodestablereport.models, _.extend({
        connector: connector}, nodestablereport.attributes, config.options,
            NodesTableReportCollectionFactory.getDefaultResourceScope(),
		{
          autoreset: true
        }));
      }
      this.property = nodestablereport;
    },

    fetch: function (options) {
      return this.property.fetch(options);
    }

  }, {

    getDefaultResourceScope: function () {
      return _.deepClone({
        fields: {
          properties: [],
          'versions.element(0)': []
        },
        includeResources: ['metadata'],
        commands: commands.getAllSignatures()
      });
    }

  });

  return NodesTableReportCollectionFactory;

});
