/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore',
  'i18n!csui/widgets/metadata/impl/nls/lang',
  'csui/controls/toolbar/toolitems.factory',
  'csui-ext!csui/widgets/metadata/versions.toolbaritems',
  'csui/controls/toolbar/toolitem.model'
], function (_, lang, ToolItemsFactory, extraToolItems, TooItemModel) {

  var toolbarItems = {

    tableHeaderToolbar: new ToolItemsFactory(
        {
          main: [
            {
              signature: "VersionProperties",
              name: lang.ToolbarItemVersionInfo,
              icon: "icon icon-toolbar-metadata"
            },
            {
              signature: "VersionDownload",
              name: lang.ToolbarItemVersionDownload
            },
            {
              signature: "VersionDelete",
              name: lang.ToolbarItemVersionDelete
            }
          ]
        },
        {
          maxItemsShown: 5,
          dropDownIcon: "icon icon-toolbar-more"
        }),
    rightToolbar: new ToolItemsFactory(
        {
          main: [
            {
              signature: "PurgeAllVersions",
              name: lang.ToolbarItemVersionPurgeAll
            }
          ]
        },
        {
          hAlign: "right"
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
