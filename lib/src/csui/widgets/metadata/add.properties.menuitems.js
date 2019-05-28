/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/utils/base',
  'i18n!csui/widgets/metadata/impl/nls/lang',
  'csui/controls/toolbar/toolitems.factory',
  'csui/controls/toolbar/toolitem.model',
  'csui-ext!csui/widgets/metadata/add.properties.menuitems',
  'csui-ext!csui/widgets/metadata/add.properties/toolbaritems'
], function (_, base, lang, ToolItemsFactory, TooItemModel,
    extraToolItems, oldExtraToolItems) {
  'use strict';

  var toolbarItems = {

    addPropertiesToolbar: new ToolItemsFactory(
        {
          add: [
            {
              signature: "AddCategory",
              name: lang.addNewCategory
            }
          ]
        },
        {
          maxItemsShown: 0 // force toolbar to immediately start with a drop-down list
        }
    )

  };

  if (oldExtraToolItems) {
    addExtraToolItems(oldExtraToolItems);
  }

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
