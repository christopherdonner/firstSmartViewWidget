/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'webreports/utils/contexts/factories/nodestablereport'
], function (module, _, Backbone, CollectionFactory, NodesTableReportCollectionFactory) {

  var NodesTableReportColumnsCollectionFactory = CollectionFactory.extend({

    propertyPrefix: 'nodestablereport_columns',

    constructor: function NodesTableReportColumnsCollectionFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var columns = this.options.columns || {};
      var nodestablereport_columns = this.options.nodestablereport_columns || {};
      if (!(columns instanceof Backbone.Collection)) {
        var children = context.getCollection(NodesTableReportCollectionFactory, { attributes: nodestablereport_columns.attributes });
        columns = children.columns;
      }
      this.property = columns;
    }

  });

  return NodesTableReportColumnsCollectionFactory;

});
