/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory',
  'csui/models/widget/offline.collection'
], function (module, _, Backbone, CollectionFactory, OfflineCollection) {

  var OfflineCollectionFactory = CollectionFactory.extend({

    propertyPrefix: 'offline',

    constructor: function OfflineCollectionFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var offlineFiles = this.options.offlinefiles || [];
      if (!(offlineFiles instanceof Backbone.Collection)) {
        offlineFiles = new OfflineCollection(offlineFiles.models, offlineFiles.options);
      }
      this.property = offlineFiles;
    },

    fetch: function (options) {
      return this.property.fetch(options);
    }

  });

  return OfflineCollectionFactory;

});
