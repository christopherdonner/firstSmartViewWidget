/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore',
  'i18n!csui/controls/tabletoolbar/impl/nls/localized.strings',
  'csui/controls/toolbar/toolitems.factory',
  'csui/controls/toolbar/toolitem.model',
  'csui-ext!csui/widgets/permissions/impl/permissions.list/permissions.dropdown.menu.items'
], function (_, lang, ToolItemsFactory, TooItemModel, extraToolItems)
{
  'use strict';

  var toolbarItems = {
    dropdownMenuList: new ToolItemsFactory({
          main: [
            {signature: "adduserorgroup", name: lang.AddUserOrGroups},
            {signature: "addownerorgroup", name: lang.AddOwnerOrGroup},
            {signature: "restorepublicaccess", name: lang.RestorePublicAccess}
          ]
        },
        {
          maxItemsShown: 0, // force toolbar to immediately start with a drop-down list
          dropDownIcon: "icon icon-expandArrowDown"
        }
    )
  };

  if (extraToolItems) {
    addExtraToolItems(extraToolItems);
  }

  function addExtraToolItems(extraToolItems) {
    _.each(extraToolItems, function (moduleToolItems) {
      _.each(moduleToolItems, function (toolItems, key) {
        var targetToolbar = toolbarItems[key];
        if (!targetToolbar) {
          throw new Error('Invalid target toolbar: ' + key);
        }
        _.each(toolItems, function (toolItem) {
          toolItem = new TooItemModel(toolItem);
          targetToolbar.addItem(toolItem);
        });
      });
    });
  }

  return toolbarItems;

});
