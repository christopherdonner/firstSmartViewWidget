/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore',
  'csui/controls/toolbar/toolitems.mask',
  'csui/utils/toolitem.masks/global.toolitems.mask'
], function (module, _, ToolItemMask, GlobalMenuItemsMask) {
  'use strict';
  var toolbars = ['otherToolbar', 'inlineToolbar'];

  function ToolbarItemsMasks() {
    var config = module.config(),
        globalMask = new GlobalMenuItemsMask();
    this.toolbars = _.reduce(toolbars, function (toolbars, toolbar) {
      var mask = new ToolItemMask(globalMask, {normalize: false});
      _.each(config, function (source, key) {
        source = source[toolbar];
        if (source) {
          mask.extendMask(source);
        }
      });
      mask.storeMask();
      toolbars[toolbar] = mask;
      return toolbars;
    }, {});
  }

  ToolbarItemsMasks.toolbars = toolbars;

  return ToolbarItemsMasks;

});
