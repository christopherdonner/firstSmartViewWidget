/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/controls/toolbar/toolitems.mask',
  'csui-ext!csui/utils/toolitem.masks/children.toolitems.mask'
], function (ToolItemMask, masks) {
  'use strict';

  masks || (masks = []);

  var ChildrenToolItemsMask = ToolItemMask.extend({

    constructor: function ChildrenToolItemsMask(options) {
      ToolItemMask.prototype.constructor.apply(this);
      this.context = options.context;
      this.node = options.node;
      this._updateMask();
      this.listenTo(this.node, 'change:id', this._updateMask);
    },

    _updateMask: function () {
      var modified = this.restoreMask({silent: true});
      masks.forEach(function (mask) {
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
    }

  });

  return ChildrenToolItemsMask;

});
