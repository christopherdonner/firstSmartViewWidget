/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/backbone', 'csui/utils/url',
  'csui/models/mixins/rules.matching/rules.matching.mixin',
  'csui-ext!csui/utils/node.links/node.links'
], function (_, Backbone, Url, RulesMatchingMixin, rules) {
  'use strict';
  var config            = window.csui.requirejs.s.contexts._.config
                              .config['csui/pages/start/impl/perspective.router'] || {},
      routesWithSlashes = !config.developmentPage;

  var NodeLinkModel = Backbone.Model.extend({
    defaults: {
      sequence: 100,
      url: null
    },

    constructor: function NodeLinkModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
      this.makeRulesMatching(options);
    }
  });

  RulesMatchingMixin.mixin(NodeLinkModel.prototype);

  var NodeLinkCollection = Backbone.Collection.extend({
    model: NodeLinkModel,
    comparator: 'sequence',

    constructor: function NodeLinkCollection(models, options) {
      Backbone.Collection.prototype.constructor.call(this, models, options);
    },

    getUrl: function (node) {
      var type = node.get('type');
      if (type === 1 && node.original && node.original.get('id') > 0) {
        node = node.original;
      }
      var rule = this.find(function (item) {
        return item.matchRules(node, item.attributes);
      });
      if (rule) {
        var url = rule.get('getUrl')(node);
        return this.completeUrl(node, url);
      }
    },

    completeUrl: function (node, url) {
      var serverUrl = new Url(node.connector && node.connector.connection.url ||
                              location.href);
      if (!url) {
        url = location.href;
      } else if (url.charAt(0) === '/') {
        if (url.charAt(1) === '/') {
          url = serverUrl.getProtocol() + ':' + url;
        } else {
          url = Url.combine(serverUrl.getOrigin(), url);
        }
      } else if (url.match(/^\?func=[a-z0-9]/i)) {
        url = serverUrl.getCgiScript() + url;
        node.attributes.absoluteUrl = url;
      } else if (url.indexOf('//') < 0) {
        url = this._getApplicationUrlPrefix(serverUrl) + url;
      }
      return url;
    },

    _getApplicationUrlPrefix: function (serverUrl) {
      var applicationUrlPrefix;
      if (routesWithSlashes) {
        applicationUrlPrefix = Url.combine(serverUrl.getCgiScript(), '/app/');
      } else {
        applicationUrlPrefix = location.origin + location.pathname +
                               location.search + '#';
      }
      return applicationUrlPrefix;
    }
  });

  var nodeLinks = new NodeLinkCollection();

  if (rules) {
    nodeLinks.add(_.flatten(rules, true));
  }

  return nodeLinks;
});
