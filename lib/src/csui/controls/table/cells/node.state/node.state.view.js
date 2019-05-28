/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/utils/log', 'csui/utils/base', 'csui/controls/table/cells/cell/cell.view',
  'csui/controls/table/cells/cell.registry',
  'csui/controls/table/cells/node.state/node.state.icons',
  'csui/models/mixins/v2.fields/v2.fields.mixin',
  'i18n!csui/controls/table/cells/node.state/impl/nls/lang',
  'css!csui/controls/table/cells/node.state/impl/node.state'
], function (module, _, $, Marionette, log, base, CellView,
    cellViewRegistry, nodeStateIcons, FieldsV2Mixin, lang) {
  'use strict';

  var accessibleTable = /\baccessibleTable\b(?:=([^&]*)?)?/i.exec(location.search);
  accessibleTable = accessibleTable && accessibleTable[1] !== 'false';

  log = log(module.id);

  var NodeStateCollectionView = Marionette.CollectionView.extend({
    tagName: 'ul',

    attributes: {
      'aria-label': lang.stateListAria
    },

    getChildView: function (iconModel) {
      return iconModel.get('iconView');
    },

    childViewOptions: function (iconModel) {
      return _.extend({
        context: this.options.context,
        model: this.options.node,
        tableView: this.options.tableView
      }, iconModel.get('iconViewOptions'));
    }
  });

  var NodeStateCellView = CellView.extend({
    needsAriaLabel: true,

    events: {
      focus: '_disengageKeyTrap',
      keydown: '_handleKeys',
      keyup: '_trapKeys'
    },

    constructor: function NodeStateCellView(options) {
      CellView.prototype.constructor.apply(this, arguments);
      this.cellRegion = new Marionette.Region({el: this.el});
      this.listenTo(this, 'before:render', this._rememberFocus)
          .listenTo(this, 'before:render', this._disengageKeyTrap)
          .listenTo(this, 'before:render', this._destroyStateIcons)
          .listenTo(this, 'render', this._restoreFocus)
          .listenTo(this, 'before:destroy', this._disengageKeyTrap)
          .listenTo(this, 'before:destroy', this._destroyStateIcons);
    },

    _destroyStateIcons: function () {
      this.cellRegion.empty();
    },

    _getEnabledNodeStateIcons: function() {
      var nodeStateIconsPrototype;
      var enabledNodeStateIcons;

      nodeStateIconsPrototype = Object.getPrototypeOf(nodeStateIcons);
      enabledNodeStateIcons = new nodeStateIconsPrototype.constructor(
          nodeStateIcons.filter(function (iconModel) {
            var IconView = iconModel.get('iconView');
            return IconView && (!IconView.enabled || IconView.enabled({
                context: this.options.context,
                node: this.model
              }));
          }, this));

      return enabledNodeStateIcons;
    },

    renderValue: function () {
      var enabledStateIcons = this._getEnabledNodeStateIcons();
      if (enabledStateIcons.length) {
        var iconsView = new NodeStateCollectionView({
            context: this.options.context,
            node: this.model,
            tableView:this.options.tableView,
            collection: enabledStateIcons
         });
        this.cellRegion.show(iconsView);
      } else {
        this._renderEmpty();
      }
    },

    getAriaLabel: function () {
      var hasState = this.cellRegion.currentView;
      return hasState ? lang.someStateIconsAria : lang.noStateIconsAria;
    },

    getAttributes: function() {
      var self = this;
      var attributes = [];
      this._getEnabledNodeStateIcons().each(function(iconModel) {
        var IconView = iconModel.get('iconView');
        var tmpView = new IconView({
          context: self.options.context,
          model: self.model
        });
        if (_.isFunction(tmpView.getAttributes)) {
          attributes = attributes.concat(tmpView.getAttributes());
        }
      });
      _.each(attributes, function(attribute) {
        if (_.isBoolean(attribute.value)) {
          attribute.value = (attribute.value === true ? lang.bool_value_true : lang.bool_value_false);
        }
      });

      return attributes;
    },

    _renderEmpty: function () {
      if (accessibleTable) {
        $('<span>', {title: lang.noStateIconsAria})
            .text(lang.noStateIconsAria)
            .appendTo(this.$el);
      }
    },

    _handleKeys: function (event) {
      if (event.key === 'Enter') {
        if (event.target === this.el) {
          this._disengageKeyTrap();
          this._engageKeyTrap();
        }
      } else if (this._hasEngagedKeyTrap()) {
        if (event.key === 'Escape') {
          this._disengageKeyTrap();
          this.el.focus();
        } else if (event.key === 'ArrowLeft') {
          event.preventDefault(); // stop browser from scrolling
          event.stopPropagation();
          this._moveFocus(-1);
        } else if (event.key === 'ArrowRight') {
          event.preventDefault(); // stop browser from scrolling
          event.stopPropagation();
          this._moveFocus(1);
        } else {
          this._trapKeys(event);
        }
      }
    },

    _trapKeys: function (event) {
      if (this._hasEngagedKeyTrap() && (event.key === 'ArrowUp' ||
          event.key === 'ArrowDown' || event.key === 'Tab')) {
        event.preventDefault(); // Stop browser from tabbing
        event.stopPropagation();
      }
    },

    _rememberFocus: function () {
      this._focusTrapped = this.el.contains(document.activeElement) &&
                           this._hasEngagedKeyTrap();
    },

    _restoreFocus: function () {
      if (this._focusTrapped) {
        this._engageKeyTrap();
      }
    },

    _engageKeyTrap: function () {
      var elements = base.findFocusables(this.el);
      if (elements.length) {
        this._keysTrapped = true;
        elements[0].focus();
      }
    },

    _disengageKeyTrap: function () {
      if (this._hasEngagedKeyTrap()) {
        this._keysTrapped = false;
      }
    },

    _hasEngagedKeyTrap: function () {
      return this._keysTrapped;
    },

    _moveFocus: function (direction) {
      var elements = base.findFocusables(this.el),
          lastElement = elements.length - 1,
          activeElement = elements.index(document.activeElement) + direction;
      if (activeElement < 0) {
        activeElement = lastElement;
      } else if (activeElement > lastElement) {
        activeElement = 0;
      }
      activeElement = elements[activeElement];
      if (activeElement) {
        activeElement.focus();
      } else {
        log.warn('Focusable elements were unexpectedly removed from {0} ({1}).',
            log.getObjectName(this), this.cid) && console.warn(log.last);
      }
    }
  }, {
    columnClassName: 'csui-table-cell-node-state',

    flexibleWidth: true,

    getModelFields: function (options) {
      return nodeStateIcons.reduce(function (fields, iconModel) {
        var IconView = iconModel.get('iconView');
        if (IconView && IconView.getModelFields) {
          var field = IconView.getModelFields(options);
          if (field) {
            FieldsV2Mixin.mergePropertyParameters(fields, field);
          }
        }
        return fields;
      }, {});
    },

    getModelExpand: function (options) {
      return nodeStateIcons.reduce(function (expands, iconModel) {
        var IconView = iconModel.get('iconView');
        if (IconView && IconView.getModelExpand) {
          var expand = IconView.getModelExpand(options);
          if (expand) {
            FieldsV2Mixin.mergePropertyParameters(expands, expand);
          }
        }
        return expands;
      }, {});
    }
  });
  cellViewRegistry.registerByColumnKey('reserved', NodeStateCellView);
  cellViewRegistry.registerByOtherColumnKey('reserved_user_id', NodeStateCellView);

  return NodeStateCellView;
});
