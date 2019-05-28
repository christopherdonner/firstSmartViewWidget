/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery',
  'csui/dialogs/node.picker/start.locations/location.base.factory',
  'i18n!csui/dialogs/node.picker/start.locations/impl/nls/lang',
  'csui/dialogs/node.picker/start.locations/favorites/impl/favorite.collection'
], function (_, $, LocationBaseFactory, lang, FavoriteCollection) {
  "use strict";

  var FavoritesFactory = LocationBaseFactory.extend({

    updateLocationModel: function (model) {
      model.set({
        name: lang.labelFavorites,
        icon: 'favorites'
      });
      return $.Deferred().resolve().promise();
    },

    getLocationParameters: function () {
      var favorites = new FavoriteCollection(undefined, {
        connector: this.options.connector,
        autoreset: true,
        expand: ['node']
      });
      return {
        container: null,
        collection: favorites,
        locationName: lang.labelFavorites
      };
    }

  });

  return FavoritesFactory;

});
