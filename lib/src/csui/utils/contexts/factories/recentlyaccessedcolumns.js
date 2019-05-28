/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/recentlyaccessed'
], function (module, _, Backbone, CollectionFactory, RecentlyAccessedCollectionFactory) {

  var RecentlyAccessedColumnsCollectionFactory = CollectionFactory.extend({

    propertyPrefix: 'recentlyaccessed_columns',

    constructor: function RecentlyAccessedColumnsCollectionFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var columns = this.options.columns || {};
      if (!(columns instanceof Backbone.Collection)) {
        var children = context.getCollection(RecentlyAccessedCollectionFactory, options);
        columns = children.columns;
      }
      this.property = columns;
    }

  });

  return RecentlyAccessedColumnsCollectionFactory;

});
