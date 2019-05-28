/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory',
  'csui/widgets/search.custom/impl/search.customview.factory',
  'csui/widgets/search.custom/impl/search.customquery.model',
  'csui/utils/contexts/factories/connector'
], function (module, _, Backbone, CollectionFactory, CustomViewFactory,
    SearchCustomQueryCollection, ConnectorFactory) {

  var CustomQueryCollectionFactory = CollectionFactory.extend({

    propertyPrefix: 'customQuery',
    widgetID: '',

    constructor: function CustomQueryCollectionFactory(context, options) {
      options || (options = {});
      CollectionFactory.prototype.constructor.apply(this, arguments);
      this.options.customQuery = this.options[this.widgetID] || {};

      var customQuery = this.options.customQuery || {};
      if (!(customQuery instanceof Backbone.Collection)) {
        var connector = context.getObject(ConnectorFactory, options),
            config    = module.config();
        customQuery = new SearchCustomQueryCollection(customQuery.models, _.extend({
          savedSearchQueryId: options.customQuery.savedSearchQueryId,
          connector: connector
        }, customQuery.options, config.options));
      }
      this.property = customQuery;
    },

    fetch: function (options) {
      return this.property.fetch(this.options);
    }

  });

  return CustomQueryCollectionFactory;

});
