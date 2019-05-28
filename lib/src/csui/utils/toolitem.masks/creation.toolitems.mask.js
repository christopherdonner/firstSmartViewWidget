/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/controls/toolbar/toolitems.mask',
  'csui/utils/toolitem.masks/global.toolitems.mask',
  'csui-ext!csui/utils/toolitem.masks/creation.toolitems.mask'
], function (module, ToolItemMask, GlobalMenuItemsMask, dynamicMasks) {
  'use strict';

  dynamicMasks || (dynamicMasks = []);
  var CreationToolItemsMask = ToolItemMask.extend({

    constructor: function CreationToolItemsMask(options) {
      var staticMasks = module.config(),
          globalMask = new GlobalMenuItemsMask();
      ToolItemMask.prototype.constructor.call(this, globalMask, {normalize: false});
      Object
          .keys(staticMasks)
          .forEach(function (key) {
            if (key != 'extensions') {
              this.extendMask(staticMasks[key]);
            }
          }, this);
      this.storeMask();
      this.context = options.context;
      this.node = options.node;
      this._updateMask();
      this.listenTo(this.node, 'change:id', this._updateMask);
    },

    _updateMask: function () {
      var modified = this.restoreMask({silent: true});
      dynamicMasks.forEach(function (mask) {
        mask = mask({
          context: this.context,
          node: this.node
        });
        if (mask) {
          modified = this.extendMask(mask, {silent: true}) || modified;
        }
      }, this);
      if (modified) {
        this.trigger('update', this);
      }
    },
    _normalizeRule: function (rule) {
      if (typeof rule !== 'object') {
        if (typeof rule === 'string') {
          rule = {signature: rule};
        } else {
          rule = {type: rule};
        }
      }
      if (!rule.commandData) {
        rule = {commandData: rule};
      }
      if (rule.type != null) {
        rule.commandData.type = rule.type;
        delete rule.type;
      }
      if (!rule.signature) {
        rule.signature = 'Add';
      }
      return rule;
    }

  });

  return CreationToolItemsMask;

});
