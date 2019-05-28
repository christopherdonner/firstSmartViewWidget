/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/utils/contexts/factories/factory',
  'csui/utils/contexts/factories/connector',
  'workflow/models/activity/activity.collection.model'
], function ($, _, ModelFactory, ConnectorFactory, ActivityCollectionModel) {
  'use strict';

  var ActivityCollectionModelFactory = ModelFactory.extend({
    propertyPrefix: 'activities',

    constructor: function ActivityCollectionModelFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);
      var connector = context.getObject(ConnectorFactory, options);
      this.context = context;
      this.property = new ActivityCollectionModel(undefined, {
        connector: connector
      });
    },

    isFetchable: function () {
      return this.property.isFetchable();
    },

    fetch: function (options) {
      return this.property.fetch(options);
    }

  });

  return ActivityCollectionModelFactory;
});
