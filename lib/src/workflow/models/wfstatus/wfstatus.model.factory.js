/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/utils/contexts/factories/factory',   // Factory base to inherit from
  'csui/utils/contexts/factories/connector', // Factory for the server connector
  'workflow/models/wfstatus/wfstatus.model'     // Model to create the factory for
], function ($, _, Backbone, ModelFactory, ConnectorFactory, WfstatusModel) {
  'use strict';

  var WFStatusModelFactory = ModelFactory.extend({
    propertyPrefix: 'wfstatus',

    constructor: function WFStatusModelFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);
      var connector = context.getObject(ConnectorFactory, options);
      this.context = context;
      this.property = new WfstatusModel(options, {
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

  return WFStatusModelFactory;

});
