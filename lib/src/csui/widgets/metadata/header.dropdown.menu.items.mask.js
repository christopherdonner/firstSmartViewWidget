/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore',
  'csui/controls/toolbar/toolitems.mask',
  'csui/utils/toolitem.masks/global.toolitems.mask'
], function (module, _, ToolItemMask, GlobalMenuItemsMask) {
  'use strict';

  var DropdownMenuItemsMask = ToolItemMask.extend({

    constructor: function DropdownMenuItemsMask() {
      var config = module.config(),
          globalMask = new GlobalMenuItemsMask();
      ToolItemMask.prototype.constructor.call(this, globalMask, {normalize: false});
      _.each(config, function (source, key) {
        this.extendMask(source);
      }, this);
      this.storeMask();
    }

  });

  return DropdownMenuItemsMask;

});
