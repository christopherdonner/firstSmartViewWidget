/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/backbone',
  'csui/models/mixins/rules.matching/rules.matching.mixin',
  'csui-ext!csui/utils/commands/open.plugins/open.plugins'
], function (_, Backbone, RulesMatchingMixin, rules) {
  'use strict';

  var OpenPluginModel = Backbone.Model.extend({
    defaults: {
      sequence: 100,
      plugin: null
    },

    constructor: function OpenPluginModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
      this.makeRulesMatching(options);
    }
  });

  RulesMatchingMixin.mixin(OpenPluginModel.prototype);

  var OpenPluginCollection = Backbone.Collection.extend({
    model: OpenPluginModel,
    comparator: 'sequence',

    constructor: function OpenPluginCollection(models, options) {
      Backbone.Collection.prototype.constructor.call(this, models, options);
    },

    findByNode: function (node, options) {
      var openInNewTab, widgetOnly;
      if (options) {
        openInNewTab = options.openInNewTab;
        widgetOnly = options.widgetOnly;
      }
      var rule = this.find(function (item) {
        var plugin = item.get('plugin');
        return (widgetOnly !== true &&
                (plugin.openWindow || plugin.getUrl ||
                plugin.getUrlQuery) ||
                widgetOnly !== false && openInNewTab !== true &&
                (plugin.openWidget || plugin.createWidget)
               ) && item.matchRules(node, item.attributes);
      });
      return rule && rule.get('plugin');
    }
  });

  var openPlugins = new OpenPluginCollection();

  if (rules) {
    openPlugins.add(_.chain(rules)
                     .flatten(true)
                     .map(function (rule) {
                       return _.defaults({
                         plugin: new rule.plugin()
                       }, rule);
                     })
                     .value());
  }

  return openPlugins;
});
