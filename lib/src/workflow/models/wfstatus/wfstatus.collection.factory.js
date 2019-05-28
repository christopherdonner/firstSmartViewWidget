/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/connector',
  'workflow/models/wfstatus/wfstatus.table.model', 'csui/utils/deepClone/deepClone'
], function (module, _, Backbone, CollectionFactory, ConnectorFactory, WFStatusCollection) {
  'use strict';

  var WFStatusCollectionFactory = CollectionFactory.extend({

    propertyPrefix: 'wfstatus-list',

    constructor: function WFStatusCollectionFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var wfstatus = this.options.wfstatus || {};
      if (!(wfstatus instanceof Backbone.Collection)) {
        var connector = context.getObject(ConnectorFactory, options),
            config    = module.config();
        wfstatus = new WFStatusCollection(wfstatus.models, _.extend(
            {connector: connector}, this.options, config.options,
            WFStatusCollectionFactory.getDefaultResourceScope(),
            {autoreset: true}));
      }
      this.property = wfstatus;
    },

    fetch: function (options) {
      return this.property.fetch(options);
    },

    isFetchable: function () {
      if (window.csui && window.csui.mobile) {
        return !this.property.fetched;
      }
      return true;
    }

  }, {

    getDefaultResourceScope: function () {
      return _.deepClone({
        fields: {
          wfstatus: []
        },
        includeResources: ['metadata']
      });
    }

  });

  return WFStatusCollectionFactory;

});
