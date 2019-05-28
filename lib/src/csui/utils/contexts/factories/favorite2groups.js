/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory',
  'csui/utils/contexts/factories/connector',
  'csui/utils/contexts/factories/favorites2',
  'csui/models/favorite2groups', 'csui/utils/commands',
  'csui/utils/deepClone/deepClone'
], function (module, _, Backbone, CollectionFactory, ConnectorFactory,
    Favorite2CollectionFactory, Favorite2GroupsCollection, commands) {
  'use strict';

  var Favorite2GroupsCollectionFactory = CollectionFactory.extend({
    propertyPrefix: 'favorites2groups',

    constructor: function Favorite2GroupsCollectionFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var favoriteGroups = this.options.favoriteGroups || {};

      if (!(favoriteGroups instanceof Backbone.Collection)) {

        var config = module.config();
        var connector = context.getObject(ConnectorFactory, options);
        var favorites = context.getCollection(Favorite2CollectionFactory, options);

        favoriteGroups = new Favorite2GroupsCollection(favoriteGroups.models,
            _.extend({
                  favorites: favorites,
                  connector: connector,
                  autoreset: true,
                  commands: commands.getAllSignatures()
                },
                favoriteGroups.options,
                config.options,
                Favorite2GroupsCollectionFactory.getDefaultResourceScope()
            )
        );
      }
      this.property = favoriteGroups;
    },

    fetch: function (options) {
      return this.property.fetch(options);
    }
  }, {
    getDefaultResourceScope: function () {
      return _.deepClone({
        fields: {
          properties: []
        }
      });
    }
  });

  return Favorite2GroupsCollectionFactory;
});
