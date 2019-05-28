/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/models/browsing.state/browsing.states'
], function (module, $, Backbone, CollectionFactory, BrowsingStateCollection) {
  'use strict';

  var BrowsingStateCollectionFactory = CollectionFactory.extend({

    propertyPrefix: 'browsingStates',

    constructor: function BrowsingStateCollectionFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var browsingStates = this.options.browsingStates || {};
      if (!(browsingStates instanceof Backbone.Collection)) {
        var config          = module.config(),
            creationOptions = $.extend({}, config.options, browsingStates.options);
        browsingStates = new BrowsingStateCollection(browsingStates.models, creationOptions);
      }
      this.property = browsingStates;
    }

  });

  return BrowsingStateCollectionFactory;

});
