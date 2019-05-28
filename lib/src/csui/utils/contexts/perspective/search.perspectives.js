/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module',
  'csui/lib/underscore', 'csui/lib/backbone',
  'csui/models/mixins/rules.matching/rules.matching.mixin',
  'csui-ext!csui/utils/contexts/perspective/search.perspectives'
], function (module, _, Backbone, RulesMatchingMixin, extraPerspectives) {

  var config = module.config();
  _.defaults(config, {
    perspectiveCollection:[{
      module: 'json!csui/utils/contexts/perspective/impl/perspectives/search.json',
      sequence: 10000
    }]
  });

  var SearchPerspectiveModel = Backbone.Model.extend({

    defaults: {
      sequence: 100,
      module: null
    },

    constructor: function SearchPerspectiveModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
      this.makeRulesMatching(options);
    }

  });

  RulesMatchingMixin.mixin(SearchPerspectiveModel.prototype);

  var SearchPerspectiveCollection = Backbone.Collection.extend({

    model: SearchPerspectiveModel,
    comparator: "sequence",

    constructor: function SearchPerspectiveCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
    },

    findByQuery: function (query) {
      return this.find(function (item) {
        return item.matchRules(query, item.attributes);
      });
    }

  });

  var searchPerspectives = new SearchPerspectiveCollection(config.perspectiveCollection);

  if (extraPerspectives) {
    searchPerspectives.add(_.flatten(extraPerspectives, true));
  }

  return searchPerspectives;

});
