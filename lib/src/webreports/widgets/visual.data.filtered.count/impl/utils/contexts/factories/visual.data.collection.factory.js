/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/utils/contexts/factories/factory',
  'csui/utils/contexts/factories/connector',
  'webreports/widgets/visual.data.filtered.count/impl/models/visualdata/visual.data.collection'
], function (module,_, Backbone, CollectionFactory, ConnectorFactory, VisualDataCollection) {

  var VisualDataCollectionFactory = CollectionFactory.extend({
    propertyPrefix: 'visualdata',

    constructor: function VisualDataCollectionFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);
      var connector = context.getObject(ConnectorFactory, options);
      options.connector = connector;
      var visualdata = this.options.visualdata || {};

      if (!(visualdata instanceof Backbone.Collection)) {
        var config = module.config();
        visualdata = new VisualDataCollection(visualdata.models, _.extend({
          connector: connector}, visualdata.attributes, config.options, {
          autoreset: true
        }));
      }
      this.property = visualdata;
    },

    fetch: function (options) {
      return this.property.fetch(options);
    }

  });

  return VisualDataCollectionFactory;

});
