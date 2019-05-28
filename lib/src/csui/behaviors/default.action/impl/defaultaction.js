/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/behaviors/default.action/impl/command',
  'csui/models/nodes', 'csui/utils/defaultactionitems'
], function (_, CommandController, NodeCollection, defaultActionItems) {
  'use strict';

  var DefaultActionController = CommandController.extend({

    constructor: function DefaultActionController(options) {
      CommandController.prototype.constructor.apply(this, arguments);
      options || (options = {});
      this.actionItems = options.actionItems || defaultActionItems;
    },

    executeAction: function (node, options) {
      var fakedActions;
      if (node.original && node.original.get('id') > 0) {
        fakedActions = this._fakeActions(node.original);
        if (node.get('type') === 1) {
          node = node.original;
        }
      }
      var action = this.getAction(node),
          status = {nodes: new NodeCollection([node])};
      if (fakedActions) {
        this._resetFakedActions(node);
      }
      return action && CommandController.prototype.executeAction.call(
              this, action, status, options);
    },

    getAction: function (node) {
      var type = node.get('type'),
          fakedActions;
      if ((type === 1 || ((!window.csui || !window.csui.mobile) && type === 2))
          && node.original && node.original.get('id') > 0) {
        node = node.original;
        fakedActions = this._fakeActions(node);
      }
      var status = {nodes: new NodeCollection([node])},
          enabled = false,
          action = this.actionItems.find(function (actionItem) {
            if (actionItem.enabled(node)) {
              var command = this.commands.findWhere({
                signature: actionItem.get("signature")
              });
              enabled = command && command.enabled(status);
              return true;
            }
          }, this);
      if (fakedActions) {
        this._resetFakedActions(node);
      }
      return enabled && action;
    },

    hasAction: function (node) {
      return !!this.getAction(node);
    },

    _fakeActions: function (node) {
      if (!node.actions.length) {
        var actions = _.map(
            this.actionItems.getAllCommandSignatures(this.commands),
            function (signature) {
              return {signature: signature};
            });
        node.actions.reset(actions, {silent: true});
        return true;
      }
    },

    _resetFakedActions: function (node) {
      node.actions.reset([], {silent: true});
    }

  });

  DefaultActionController.version = "1.0";

  return DefaultActionController;

});
