/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory', 'csui/utils/contexts/factories/connector',
  'csui/models/widget/myassignments.model',
  'csui/utils/deepClone/deepClone'
], function (module, _, Backbone, CollectionFactory, ConnectorFactory, MyAssignmentCollection) {
  'use strict';

  var MyAssignmentCollectionFactory = CollectionFactory.extend({

    propertyPrefix: 'myassignments',

    constructor: function MyAssignmentCollectionFactory(context, options) {
      CollectionFactory.prototype.constructor.apply(this, arguments);

      var myassignments = this.options.myassignments || {};
      if (!(myassignments instanceof Backbone.Collection)) {
        var connector = context.getObject(ConnectorFactory, options),
            config = module.config();
        myassignments = new MyAssignmentCollection(myassignments.models, _.extend(
            {connector: connector}, myassignments.options, config.options,
            MyAssignmentCollectionFactory.getDefaultResourceScope(),
            {autoreset: true}));
      }
      this.property = myassignments;
    },

    fetch: function (options) {
      return this.property.fetch(options);
    },

    isFetchable: function(){
      if (window.csui && window.csui.mobile) {
        return !this.property.fetched;
      }
      return true;
    }

  }, {

    getDefaultResourceScope: function () {
      return _.deepClone({
        fields: {
          assignments: []
        },
        includeResources: ['metadata']
      });
    }

  });

  return MyAssignmentCollectionFactory;

});
