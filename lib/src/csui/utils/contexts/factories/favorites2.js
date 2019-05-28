/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory',
  'csui/utils/contexts/factories/connector',
  'csui/models/favorites2', 'csui/utils/defaultactionitems',
  'csui/utils/commands', 'csui/utils/deepClone/deepClone'
], function (module, _, Backbone, CollectionFactory, ConnectorFactory,
    Favorites2Collection, defaultActionItems, commands) {
  'use strict';

  var Favorite2CollectionFactory = CollectionFactory.extend({

    propertyPrefix: 'favorites2',

    constructor: function Favorite2CollectionFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var favorites = this.options.favorites || {};

      if (!(favorites instanceof Backbone.Collection)) {

        var connector = context.getObject(ConnectorFactory, options);
        var config = module.config();

        favorites = new Favorites2Collection(favorites.models,
            _.extend({
                connector: connector,
                autoreset: true
              },
              favorites.options,
              config.options,
              Favorite2CollectionFactory.getDefaultResourceScope()
            )
        );
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
          favorites: ['name', 'tab_id'],
          'versions.element(0)': ['mime_type','owner_id']
        },
        expand: {
          properties: ['original_id', 'parent_id', 'reserved_user_id']
        },
        includeResources: [],
        commands: commands.getAllSignatures()
      });
    },

    getLimitedResourceScope: function () {
      return _.deepClone({
        fields: {
          properties: ['container', 'id', 'name', 'original_id', 'type', 'type_name', 'parent_id', 'container'],
          favorites: ['name', 'tab_id'],
          'versions.element(0)': ['mime_type']
        },
        expand: {
          properties: ['original_id', 'parent_id']
        },
        includeResources: [],
        commands: commands.getAllSignatures(),
        defaultActionCommands: defaultActionItems.getAllCommandSignatures(commands)
      });
    },

    getDefaultsOnlyResourceScope: function () {
      return _.deepClone({
        fields: {
          properties: [],
          favorites: ['name', 'tab_id'],
          'versions.element(0)': []
        },
        expand: {
          properties: ['original_id', 'parent_id', 'reserved_user_id']
        },
        includeResources: [],
        commands: defaultActionItems.getAllCommandSignatures(commands)
      });
    }

  });

  return Favorite2CollectionFactory;
});
