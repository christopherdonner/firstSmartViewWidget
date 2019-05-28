/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/backbone',
  'csui/models/mixins/rules.matching/rules.matching.mixin',
  'csui-ext!csui/utils/smart.nodes/smart.nodes'
], function (_, Backbone, RulesMatchingMixin, rules) {
  'use strict';

  var SmartNodeModel = Backbone.Model.extend({
    defaults: {
      sequence: 100
    },

    constructor: function SmartNodeModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
      this.makeRulesMatching(options);
    }
  });

  RulesMatchingMixin.mixin(SmartNodeModel.prototype);

  var SmartNodeCollection = Backbone.Collection.extend({
    model: SmartNodeModel,
    comparator: "sequence",

    constructor: function SmartNodeCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
    },

    isSupported: function (node, options) {
      return this.some(function (item) {
        return item.matchRules(node, item.attributes);
      });
    }
  });

  var smartNodes = new SmartNodeCollection();

  if (rules) {
    smartNodes.add(_.flatten(rules, true));
  }

  return smartNodes;
});
