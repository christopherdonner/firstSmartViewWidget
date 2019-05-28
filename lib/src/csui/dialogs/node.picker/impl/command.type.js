/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module',
  'csui/lib/underscore', 'i18n!csui/dialogs/node.picker/impl/nls/lang'
], function (module, _, lang) {

  var config = module.config();
  _.defaults(config, {addable_types: {899: [899, 480, 146]}});

  var CommandTypes = function (options) {
    var node = options.initialContainer;

    this.actionNodes = options.initialSelection ?
                       (_.isArray(options.initialSelection) ? options.initialSelection :
                        options.initialSelection.models) : [];
    this.unselectableNodes = options.unselectableNodes;
    this.invalidNodes = options.invalidNodes;
    this.selectableTypes = options.selectableTypes || [];
    this.unselectableTypes = options.unselectableTypes || [];
    this.showAllTypes = options.showAllTypes || false;
    this.multiSelect = !!options.selectMultiple;
    this.action = options.command;
    this.parentId = node != null ? node.get('id') : -1;
    this.selectButtonLabel = options.selectButtonLabel || lang.selectButtonLabel;
    switch (this.action) {
    case 'copy':
      this.selectButtonLabel = options.selectButtonLabel || lang.copyButtonLabel;
      break;
    case 'move':
      this.selectButtonLabel = options.selectButtonLabel || lang.moveButtonLabel;
      break;
    case 'addCategories':
      this.selectableTypes = options.selectableTypes || [131];
      this.multiSelect = true;
      this.actionNodes = [];
      break;
    case 'savefilter':
      this.selectButtonLabel = options.selectButtonLabel || lang.saveFilterButtonLabel;
      this.actionNodes = [];
      break;
    case 'collect':
      this.selectableTypes = options.selectableTypes;
      this.multiSelect = true;
      this.actionNodes = [];
      break;
    default:
      this.actionNodes = [];
    }

  };

  _.extend(CommandTypes.prototype, {

    getSelectableNodeTypes: function () {
      if (this.showAllTypes) {
        return [];
      }

      return this.selectableTypes;
    },
    validateTarget: function (targetNode) {
      var targetId     = targetNode.data ? targetNode.data.id : targetNode.get('id'),
          targetType   = targetNode.get('type'),
          addableTypes = config.addable_types[targetType],
          retVal       = _.every(this.unselectableNodes, function (id) {
            return (targetId !== id);
          });

      if (this.browseAllowed(targetNode)) {
        retVal = _.every(this.unselectableTypes, function (type) {
          return targetType !== type;
        });
      }
      if (addableTypes) {
        retVal = _.every(this.actionNodes, function (node) {
          return _.contains(addableTypes, node.get('type'));
        });
      }

      if (retVal) {
        switch (this.action) {
        case 'copy':
          retVal = this.isVirtualNode(targetNode) ? false : this.validateNode(targetNode);
          break;
        case 'move':
          retVal = this.isVirtualNode(targetNode) ? false : this.validId(targetNode);
          if (retVal) {
            retVal = this.validateAddableTypes(targetNode);
          }
          break;
        case 'savefilter':
          retVal = !(this.isVirtualNode(targetNode));
          break;
        }
      }
      return retVal;
    },
    validId: function (targetNode) {
      var targetId = targetNode.data ? targetNode.data.id : targetNode.get('id');
      return (targetId !== this.parentId);
    },

    validateAddableTypes: function (targetNode) {

      var addable_types = targetNode.addable_types;

      if (!addable_types) {
        return true;
      }
      return _.every(this.actionNodes, function (actionNode) {
        return _.some(addable_types, function (type) {
          return (type.type === actionNode.get('type'));
        });
      });
    },

    isSelectableType: function (targetNode) {
      var targetType = targetNode.get('type');
      var retVal = _.every(this.unselectableTypes, function (type) {
        return (targetType !== type);
      });
      if (retVal && !_.isEmpty(this.selectableTypes)) {
        retVal = _.indexOf(this.selectableTypes, targetType) !== -1;
        if (!retVal && this.browseAllowed(targetNode) &&
            _.indexOf(this.selectableTypes, -1) > -1) {
          retVal = true;
        }
      }
      return retVal;
    },
    isSelectable: function (targetNode) {
      var targetId     = targetNode.data ? targetNode.data.id : targetNode.get('id'),
          targetType   = targetNode.get('type'),
          addableTypes = config.addable_types[targetType];
      if (targetNode.get('unselectable')) {
        return false;
      }

      var retVal = this.isSelectableType(targetNode);
      if (retVal && addableTypes) {
        retVal = _.every(this.actionNodes, function (node) {
          return _.contains(addableTypes, node.get('type'));
        });
      }
      retVal && (retVal = _.every(this.unselectableNodes, function (id) {
        return (targetId !== id);
      }));
      retVal && (retVal = !this.isActionNode(targetNode));
      if (retVal) {
        switch (this.action) {
        case 'copy':
          retVal = this.isVirtualNode(targetNode) ? false : this.validateNode(targetNode);
          break;
        case 'move':
          retVal = this.isVirtualNode(targetNode) ? false : this.validId(targetNode);
          break;
        case 'addCategories':
          retVal = !this.browseAllowed(targetNode);
          break;
        case 'savefilter':
          retVal = !this.isVirtualNode(targetNode);
          break;
        }
      }

      return retVal;
    },
    browseAllowed: function (node) {
      var openAction = node.actions && _.find(node.actions.models, function (action) {
        return action.id === 'open';
      });
      return node.get('container') && (node.get('perm_see_contents') !== false || openAction);
    },
    validateNode: function (node) {
      var valid = this._hasValidId(node);
      if (valid && !this.showAllTypes) {
        if (!this.browseAllowed(node)) {
          if ((this.selectableTypes.length > 0) &&
              (this.selectableTypes.indexOf(node.get('type')) === -1)) {
            valid = false;
          }
        }
        else if ((this.action === 'move' || this.action === 'copy') &&
                 this.isActionNode(node)) {
          valid = false;
        }
      }
      return valid;
    },

    isActionNode: function (node) {
      var nodeId   = node.get('id'),
          parentId = node.get('parent_id');

      return _.any(this.actionNodes, function (actionNode) {
        var actionNodeId = actionNode.get('id');
        var retVal = actionNodeId === nodeId;
        return (!retVal) ? actionNodeId === parentId : retVal;
      });
    },

    isVirtualNode: function (node) {
      var nodeType = node.get('type'),
          retVal   = false;
      if (nodeType === 899) {
        retVal = true;
      }
      return retVal;
    },

    _hasValidId: function (node) {
      return _.every(this.invalidNodes, function (invalidNode) {
        return invalidNode.get('id') !== node.get('id');
      });
    },

    shouldResolveShortcut: function (node) {
      return node.get('type') === 1 && (typeof node.get('original_id') === 'number');
    }

  });

  return CommandTypes;

});
