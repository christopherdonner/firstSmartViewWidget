/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory',   'workflow/models/wfstatus/wfstatus.collection.factory'
], function (module, _, Backbone, CollectionFactory, WFStatusCollectionFactory) {

  "use strict";

  var WFStatusColumnsCollectionFactory = CollectionFactory.extend({

    propertyPrefix: 'wfstatus_columns',

    constructor: function WFStatusColumnsCollectionFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var columns = this.options.columns || {};
      if (!(columns instanceof Backbone.Collection)) {
        var children = context.getCollection(WFStatusCollectionFactory, options);
        columns = children.columns;
      }
      this.property = columns;
    }

  });

  return WFStatusColumnsCollectionFactory;

});
