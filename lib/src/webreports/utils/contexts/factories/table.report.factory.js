/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/connector',
  'webreports/models/tablereport/tablereport.model','csui/utils/contexts/factories/node'
], function (module, _, Backbone, CollectionFactory, ConnectorFactory, TableReportCollection) {

  var TableReportCollectionFactory = CollectionFactory.extend({

    propertyPrefix: 'tablereport',

    constructor: function TableReportCollectionFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var connector = context.getObject(ConnectorFactory, options);
      options.connector = connector;
      var tablereport = this.options.tablereport || {};

      if (!(tablereport instanceof Backbone.Collection)) {
        var config = module.config();
        tablereport = new TableReportCollection(tablereport.models, _.extend({
        connector: connector}, tablereport.attributes, config.options, {
          autoreset: true
        }));
      }
      this.property = tablereport;
    },

    fetch: function (options) {
      return this.property.fetch(options);
    }

  });

  return TableReportCollectionFactory;

});
