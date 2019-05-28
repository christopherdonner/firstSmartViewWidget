/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore',
  'i18n!csui/controls/tabletoolbar/impl/nls/localized.strings',
  'csui/controls/toolbar/toolitems.factory',
  'csui/controls/toolbar/toolitem.model',
  'csui-ext!csui/widgets/nodestable/headermenuitems'
], function (_, lang, ToolItemsFactory, TooItemModel, extraMenuItems) {

  var toolbarItems = {
    headerMenuToolbar: new ToolItemsFactory({
          other: [
            {signature: "Properties", name: lang.MenuItemInformation},
            {signature: "CopyLink", name: lang.MenuItemCopyLink},
            {signature: "EmailLink", name: lang.MenuItemShare},
            {signature: "permissions", name: lang.ToolbarItemPermissions},
            {signature: "Rename", name: lang.MenuItemRename},
            {signature: "Copy", name: lang.MenuItemCopy},
            {signature: "Move", name: lang.MenuItemMove},
            {signature: "Delete", name: lang.MenuItemDelete}
          ]
        },
        {
          maxItemsShown: 0, // force toolbar to immediately start with a drop-down list
          dropDownIcon: "icon icon-expandArrowDown"
        }
    )
  };

  if (extraMenuItems) {
    _.each(extraMenuItems, function (moduleMenuItems) {
      _.each(moduleMenuItems, function (menuItems, key) {
        var targetToolbar = toolbarItems[key];
        if (!targetToolbar) {
          throw new Error('Invalid target toolbar: ' + key);
        }
        _.each(menuItems, function (menuItem) {
          menuItem = new TooItemModel(menuItem);
          targetToolbar.addItem(menuItem);
        });
      });
    });
  }

  return toolbarItems;

});
