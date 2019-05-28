/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/favorites'
], function (module, _, Backbone, CollectionFactory, FavoriteCollectionFactory) {

  var FavoritesColumnsCollectionFactory = CollectionFactory.extend({

    propertyPrefix: 'favorites_columns',

    constructor: function FavoritesColumnsCollectionFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var columns = this.options.columns || {};
      if (!(columns instanceof Backbone.Collection)) {
        var children = context.getCollection(FavoriteCollectionFactory, options);
        columns = children.columns;
      }
      this.property = columns;
    }

  });

  return FavoritesColumnsCollectionFactory;

});
