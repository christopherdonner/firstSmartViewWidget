/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/children'
], function (module, _, Backbone, CollectionFactory, NodeChildrenFactory) {

  var ColumnCollectionFactory = CollectionFactory.extend({

    propertyPrefix: 'columns',

    constructor: function ColumnsCollectionFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var columns = this.options.columns || {};
      if (!(columns instanceof Backbone.Collection)) {
        var children = context.getModel(NodeChildrenFactory, options),
            config = module.config();
        columns = children.columns;
      }
      this.property = columns;
    }

  });

  return ColumnCollectionFactory;

});
