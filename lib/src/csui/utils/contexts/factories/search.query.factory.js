/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/contexts/factories/factory'
], function (module, _, Backbone, ModelFactory) {

  var SearchQueryModel = Backbone.Model.extend({

    constructor: function SearchQueryModel(attributes, options) {
      SearchQueryModel.__super__.constructor.apply(this, arguments);
    },

    toJSON: function () {
      return SearchQueryModel.__super__.toJSON.apply(this, arguments);
    }

  });

  var SearchQueryModelFactory = ModelFactory.extend({

    propertyPrefix: 'searchQuery',

    constructor: function SearchQueryModelFactory(context, options) {
      ModelFactory.prototype.constructor.apply(this, arguments);

      var searchQuery = this.options.searchQuery || {};
      if (!(searchQuery instanceof Backbone.Model)) {
        var config = module.config();
        searchQuery = new SearchQueryModel(searchQuery.models, _.extend({},
            searchQuery.options, config.options));
      }
      this.property = searchQuery;
    }

  });

  return SearchQueryModelFactory;

});
