/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  'module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/marionette', 'csui/utils/url', 'csui/utils/log',
  'csui/utils/contexts/factories/next.node',
  'csui/utils/contexts/factories/search.query.factory',
  'csui/behaviors/default.action/impl/defaultaction',
  'csui/utils/node.links/node.links'
], function (module, _, $, Backbone, Marionette, Url, log,
    NextNodeModelFactory, SearchQueryModelFactory, DefaultActionController,
    nodeLinks) {
  'use strict';

  log = log(module.id);

  var DefaultActionBehavior = Marionette.Behavior.extend({
    constructor: function DefaultActionBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);
      var context = view.options.context;
      this.view = view;
      this._nextNode = context && context.getModel(NextNodeModelFactory);
      this._searchQuery = context && context.getModel(SearchQueryModelFactory);
      view.defaultActionController = this.options.defaultActionController ||
                                     new DefaultActionController();
    },

    onExecuteDefaultAction: function (node) {
      if (node instanceof Backbone.View) {
        node = node.model;
      }
      var action = this.view.defaultActionController.getAction(node);
      if (action) {
        this.view.defaultActionController.executeAction(node, {
          context: this.view.options.context,
          originatingView: this.view
        });
      } else {
        log.can('WARN') && log.warn('No default action was enabled for {0}.',
            JSON.stringify(_.pick(node.attributes, 'name', 'id', 'type'))) &&
        console.warn(log.last);
      }
    }
  }, {
    getDefaultActionNodeUrl: function (node) {
      var url = nodeLinks.getUrl(node),
          hash = url.lastIndexOf('#');
      if (hash >= 0) {
        return url.substr(hash);
      }
      return url;
    }
  });

  return DefaultActionBehavior;
});
