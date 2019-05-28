/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory',
  'csui/utils/contexts/factories/favorites2'
], function (module, _, Backbone, CollectionFactory, Favorite2CollectionFactory) {

  var Favorite2ColumnsCollectionFactory = CollectionFactory.extend({

    propertyPrefix: 'favorites2_columns',

    constructor: function Favorite2ColumnsCollectionFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var columns = this.options.columns || {};
      if (!(columns instanceof Backbone.Collection)) {
        var children = context.getCollection(Favorite2CollectionFactory, options);
        columns = children.columns;
      }
      this.property = columns;
    }

  });

  return Favorite2ColumnsCollectionFactory;
});
