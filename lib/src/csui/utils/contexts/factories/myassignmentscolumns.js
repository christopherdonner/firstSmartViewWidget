/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/myassignments'
], function (module, _, Backbone, CollectionFactory, MyAssignmentsCollectionFactory) {

  var MyAssignmentsColumnsCollectionFactory = CollectionFactory.extend({

    propertyPrefix: 'myassignments_columns',

    constructor: function MyAssignmentsColumnsCollectionFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var columns = this.options.columns || {};
      if (!(columns instanceof Backbone.Collection)) {
        var children = context.getCollection(MyAssignmentsCollectionFactory, options);
        columns = children.columns;
      }
      this.property = columns;
    }

  });

  return MyAssignmentsColumnsCollectionFactory;

});
