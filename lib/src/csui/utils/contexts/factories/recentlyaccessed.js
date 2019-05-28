/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/connector',
  'csui/models/widget/recentlyaccessed.model', 'csui/utils/commands',
  'csui/utils/defaultactionitems',
  'csui/utils/deepClone/deepClone'
], function (module, _, Backbone, CollectionFactory, ConnectorFactory,
    RecentlyAccessedCollection, commands, defaultActionItems) {
  'use strict';

  var RecentlyAccessedCollectionFactory = CollectionFactory.extend({

    propertyPrefix: 'recentlyaccessed',

    constructor: function RecentlyAccessedCollectionFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var recentlyAccessed = this.options.recentlyaccessed || {};
      if (!(recentlyAccessed instanceof Backbone.Collection)) {
        var connector = context.getObject(ConnectorFactory, options),
            config    = module.config();
        recentlyAccessed = new RecentlyAccessedCollection(recentlyAccessed.models, _.extend(
            {connector: connector, recentlyAccessedSubtypes: config.recentlyAccessedSubtypes},
            recentlyAccessed.options, config.options,
            RecentlyAccessedCollectionFactory.getDefaultResourceScope(),
            {autoreset: true}));
      }
      this.property = recentlyAccessed;
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
    },

    getLimitedResourceScope: function () {
      return _.deepClone({
        fields: {
          properties: ['container', 'id', 'name', 'original_id', 'type', 'type_name', 'parent_id',
            'reserved'],
          'versions.element(0)': ['mime_type']
        },
        expand: {
          properties: ['parent_id', 'reserved_user_id']
        },
        includeResources: [],
        commands: commands.getAllSignatures(),
        defaultActionCommands: defaultActionItems.getAllCommandSignatures(commands)
      });
    }

  });

  return RecentlyAccessedCollectionFactory;

});
