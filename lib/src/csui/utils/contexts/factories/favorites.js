/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/connector',
  'csui/models/widget/favorites.model', 'csui/utils/commands',
  'csui/utils/deepClone/deepClone'
], function (module, _, Backbone, CollectionFactory, ConnectorFactory, FavoritesCollection,
    commands) {
  'use strict';

  var FavoriteCollectionFactory = CollectionFactory.extend({

    propertyPrefix: 'favorites',

    constructor: function FavoritesCollectionFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var favorites = this.options.favorites || {};
      if (!(favorites instanceof Backbone.Collection)) {
        var connector = context.getObject(ConnectorFactory, options),
            config = module.config();
        favorites = new FavoritesCollection(favorites.models, _.extend(
            {connector: connector}, favorites.options, config.options,
            FavoritesCollectionFactory.getDefaultResourceScope(),
            {autoreset: true}));
      }
      this.property = favorites;
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

  return FavoriteCollectionFactory;

});
