/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'require', 'csui/lib/jquery', 'csui/lib/underscore',
  'csui/models/command', 'csui/integration/folderbrowser/commands/nls/localized.strings'
], function (module, require, $, _, CommandModel, lang) {
  'use strict';

  var visitedNodesByContext = {};

  var GoToNodeHistoryCommand = CommandModel.extend({

    defaults: {
      signature: 'Back',
      name: lang.GoToHistory
    },

    enabled: function (status, options) {
      var config = _.extend({
            enabled: false
          }, module.config()),
          context = status.context || options && options.context,
          visitedNodes;
      if (!context) {
        return false;
      }
      if (config.enabled) {
        this._ensureGoBackList(context);
      }
      visitedNodes = visitedNodesByContext[context.cid] || [];
      return config.enabled && visitedNodes.length > 1;
    },

    execute: function (status, options) {
      var deferred = $.Deferred();
      require(['csui/utils/contexts/factories/next.node'
      ], function (NextNodeModelFactory) {
        var context = status.context || options && options.context,
            nextNode = context.getModel(NextNodeModelFactory),
            visitedNodes = visitedNodesByContext[context.cid] || [];
        if (visitedNodes.length > 1) {
          visitedNodes.pop();
          nextNode.set('id', visitedNodes[visitedNodes.length - 1]);
        }
        deferred.resolve();
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise();
    },

    clearHistory: function (context) {
      delete visitedNodesByContext[context.cid];
    },

    _ensureGoBackList: function (context) {
      var visitedNodes = visitedNodesByContext[context.cid];
      if (visitedNodes) {
        return;
      }
      visitedNodes = visitedNodesByContext[context.cid] = [];
      require(['csui/utils/contexts/factories/node',
        'csui/utils/contexts/factories/next.node'
      ], function (NodeModelFactory, NextNodeModelFactory) {
        var nextNode = context.getModel(NextNodeModelFactory);
        visitCurrentNode(NodeModelFactory);
        context.on('request', function () {
          visitCurrentNode(NodeModelFactory);
        });
        nextNode.on('change:id', function () {
          visitCurrentNode(NextNodeModelFactory);
        });
        function visitCurrentNode(Factory) {
          var node = context.getModel(Factory),
              nodeId = node.get('id');
          if (nodeId && visitedNodes[visitedNodes.length - 1] !== nodeId) {
            visitedNodes.push(nodeId);
          }
        }
      });
    }

  });

  return GoToNodeHistoryCommand;

});
