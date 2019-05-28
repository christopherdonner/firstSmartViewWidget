/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore',
  'i18n!csui/widgets/navigation.header/impl/nls/lang',
  'csui/controls/toolbar/toolitems.factory',
  'csui/controls/toolbar/toolitem.model',
  'csui-ext!csui/widgets/navigation.header/profile.menuitems'
], function (_, lang, ToolItemsFactory, TooItemModel, extraToolItems) {
  'use strict';

  var menuItems = {
    profileMenu: new ToolItemsFactory({
        profile: [
          {signature: 'UserProfile', name: lang.profileMenuItemLabel}
        ],
        others: [
          {signature: 'SwitchToClassic', name: lang.switchToClassicMenuItemLabel},
          {signature: 'EditPerspective', name: lang.EditPerspective},
          {signature: 'CreatePerspective', name: lang.CreatePerspective}
       ],
        signout: [
          {signature: 'SignOut', name: lang.signOutMenuItemLabel}
        ]
      },
      {
        maxItemsShown: 0, // force toolbar to immediately start with a drop-down list
        dropDownIcon: 'icon icon-expandArrowDown'
      }
    )
  };

  if (extraToolItems) {
    _.each(extraToolItems, function (moduleToolItems) {
      _.each(moduleToolItems, function (toolItems, key) {
        var targetToolbar = menuItems[key];
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

  return menuItems;
});
