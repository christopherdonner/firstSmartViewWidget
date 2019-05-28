/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["module", "require", "csui/lib/underscore", "csui/lib/backbone",
  "csui/utils/log", "csui/utils/commandhelper"
], function (module, require, _, Backbone, log, CommandHelper) {

  var CommandModel = Backbone.Model.extend({

    idAttribute: "signature",

    constructor: function CommandModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
    },

    enabled: function (status, options) {
      var scope      = this.get("scope"),
          nodes      = this._getNodesByScope(status, scope),
          signatures = this.get("command_key");

      return this._checkPermittedActions(nodes, signatures, status.container);
    },

    isNonPromoted: function (status) {
      var scope         = this.get("scope"),
          nodes         = this._getNodesByScope(status, scope),
          signatures    = this.get("command_key"),
          isNonPromoted = false;
      if (nodes && nodes.length) {
        var checkFn = this._getNonPromotedCheckFunctionsForSignatures(signatures);
        if (checkFn) {
          _.find(nodes, function (node) {
            var action = checkFn(node);
            if (action && action.get('csuiNonPromotedAction') === true) {
              isNonPromoted = true;
              return true;
            }
          });
        }
      }
      return isNonPromoted;
    },

    _getNodesByScope: function (status, scope) {
      var nodes;
      switch (scope) {
      case "single":
        nodes = CommandHelper.getJustOneNode(status);
        nodes && (nodes = [nodes]);
        break;
      default: // without a specific scope, use case "multiple"
        nodes = CommandHelper.getAtLeastOneNode(status).models;
        break;
      }
      return nodes;
    },

    _getCheckFunctionsForSignatures: function (signatures) {
      var checkNode;
      if (signatures) {
        if (_.isArray(signatures) && signatures.length) {
          checkNode = function (node) {
            return _.any(signatures, function (signature) {
              return node.actions && node.actions.findRecursively(signature);
            });
          };
        } else if (_.isString(signatures)) {
          checkNode = function (node) {
            return node.actions && node.actions.findRecursively(signatures);
          };
        }
      }
      return checkNode;
    },

    _getNonPromotedCheckFunctionsForSignatures: function (signatures) {
      var checkFn;
      if (signatures) {
        if (_.isArray(signatures) && signatures.length) {
          checkFn = function (node) {
            var action;
            _.find(signatures, function (signature) {
              action = node.actions && node.actions.findRecursively(signature);
              return !!action;
            });
            return action;
          };
        } else if (_.isString(signatures)) {
          checkFn = function (node) {
            return node.actions && node.actions.findRecursively(signatures);
          };
        }
      }
      return checkFn;
    },

    _checkPermittedActions: function (nodes, signatures, container) {
      if (nodes && nodes.length) {
        var checkNode = this._getCheckFunctionsForSignatures(signatures);
        return !checkNode || _.all(nodes, checkNode);
      }
      return false;
    },

    _getNodeActionForSignature: function (node, signatures) {
      var action;
      if (node) {
        var checkNode = this._getCheckFunctionsForSignatures(signatures);
        if (!!checkNode) {
          action = checkNode.call(this, node);
        }
      }
      return action;
    }

  });

  return CommandModel;

});
