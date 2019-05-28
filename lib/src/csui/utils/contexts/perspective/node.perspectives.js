/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/backbone',
  'csui/models/mixins/rules.matching/rules.matching.mixin',
  'csui-ext!csui/utils/contexts/perspective/node.perspectives'
], function (_, Backbone, RulesMatchingMixin, extraPerspectives) {

  var NodePerspectiveModel = Backbone.Model.extend({

    defaults: {
      sequence: 100,
      important: false,
      module: null
    },

    constructor: function NodePerspectiveModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
      this.makeRulesMatching(options);
    }

  });

  RulesMatchingMixin.mixin(NodePerspectiveModel.prototype);

  var NodePerspectiveCollection = Backbone.Collection.extend({

    model: NodePerspectiveModel,
    comparator: "sequence",

    constructor: function NodePerspectiveCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
    },

    findByNode: function (node) {
      return this.find(function (item) {
        return item.matchRules(node, item.attributes);
      });
    }

  });

  var nodePerspectives = new NodePerspectiveCollection([
    {
      equals: {type: 258},
      module: 'json!csui/utils/contexts/perspective/impl/perspectives/saved.query.json',
      sequence: 100
    },
    {
      equals: {type: 144},
      important: true,
      module: 'json!csui/utils/contexts/perspective/impl/perspectives/document.overview.json',
      sequence: 100
    },
    {
      equals: {container: true},
      module: 'json!csui/utils/contexts/perspective/impl/perspectives/container.json',
      sequence: 1000
    },
    {
      module: 'json!csui/utils/contexts/perspective/impl/perspectives/metadata.json',
      sequence: 10000
    }
  ]);

  if (extraPerspectives) {
    nodePerspectives.add(_.flatten(extraPerspectives, true));
  }

  return nodePerspectives;

});
