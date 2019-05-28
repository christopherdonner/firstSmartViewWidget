/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/backbone', 'csui/utils/url',
  'csui/models/mixins/rules.matching/rules.matching.mixin',
  'csui-ext!csui/utils/classic.nodes/classic.nodes'
], function (_, Backbone, Url, RulesMatchingMixin, rules) {
  'use strict';

  var ClassicNodeModel = Backbone.Model.extend({
    defaults: {
      sequence: 100,
      url: null,
      urlQuery: null,
      force: false
    },

    constructor: function ClassicNodeModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
      this.makeRulesMatching(options);
    }
  });

  RulesMatchingMixin.mixin(ClassicNodeModel.prototype);

  var ClassicNodeCollection = Backbone.Collection.extend({
    model: ClassicNodeModel,
    comparator: 'sequence',

    constructor: function ClassicNodeCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
    },

    findByNode: function (node, options) {
      var model = this.find(function (item) {
        return item.matchRules(node, item.attributes);
      });
      if (model) {
        return {
          url: this._getUrl(model, node, options),
          forced: model.get('forced')
        };
      }
    },

    isForced: function (node, options) {
      return this.some(function (item) {
        return item.get('forced') &&
               item.matchRules(node, item.attributes);
      });
    },

    isSupported: function (node, options) {
      return this.some(function (item) {
        return item.matchRules(node, item.attributes);
      });
    },

    getUrl: function (node, options) {
      var model = this.find(function (item) {
        return item.matchRules(node, item.attributes);
      });
      if (model) {
        return this._getUrl(model, node, options);
      }
    },

    _getUrl: function (model, node, options) {
      var url = model.get('url');
      if (url) {
        if (typeof url === 'string') {
          url = this._replaceParameters(url, node.attributes);
        } else if (typeof url === 'function') {
          url = url(node);
        }
      } else {
        var urlQuery = model.get('urlQuery');
        if (urlQuery) {
          if (typeof urlQuery === 'string') {
            urlQuery = this._replaceParameters(urlQuery, node.attributes);
          } else if (typeof urlQuery === 'function') {
            urlQuery = urlQuery(node);
          }
          var connector = options && options.connector || node.connector;
          if (connector) {
            url = new Url(connector.connection.url).getCgiScript();
          } else {
            url = '';
          }
          urlQuery = Url.combineQueryString(urlQuery);
          url = Url.appendQuery(url, urlQuery);
        }
      }
      return url;
    },

    _replaceParameters: function (expression, node) {
      var attributes = node.attributes,
          parameter = /{([^}]+)}/g,
          match, names, value, index;
      while ((match = parameter.exec(expression))) {
        names = match[1].split('.');
        value = attributes;
        _.find(names, function (name) {
          value = value[name];
          if (value == null) {
            value = '';
            return true;
          }
        });
        index = match.index;
        expression = expression.substring(0, index) +
                     encodeURIComponent(value) +
                     expression.substring(index + match[0].length);
      }
      return expression;
    }
  });

  var classicNodes = new ClassicNodeCollection();

  if (rules) {
    classicNodes.add(_.flatten(rules, true));
  }

  return classicNodes;
});
