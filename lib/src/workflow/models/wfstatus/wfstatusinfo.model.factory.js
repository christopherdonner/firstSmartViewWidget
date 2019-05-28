/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/utils/contexts/factories/factory',
  'csui/utils/contexts/factories/connector',
  'workflow/models/wfstatus/wfstatusinfo.model'
], function ($, _, Backbone, ModelFactory, ConnectorFactory, WFStatusInfoModel) {
  'use strict';

  var WFStatusInfoModelFactory = ModelFactory.extend({

    propertyPrefix: 'wfstatusinfo',

    constructor: function WFStatusInfoModelFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);
      var connector = context.getObject(ConnectorFactory, options);
      this.context = context;
      this.property = new WFStatusInfoModel(options, {
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

  return WFStatusInfoModelFactory;

});
