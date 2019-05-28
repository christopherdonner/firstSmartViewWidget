/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore',
  'csui/utils/base',
  'csui/controls/toolbar/toolitems.factory',
  'i18n!csui/integration/folderbrowser/impl/nls/folderbrowser.manifest',
  'css!csui/integration/folderbrowser/impl/icons'
], function (_, base, ToolItemsFactory, FolderBrowseLang) {
  var toolbarItems = {
    leftToolbar: [
      {
        signature: "Back",
        name: FolderBrowseLang.BackButtonToolItem,
        icon: "icon arrow_back csui-icon-go-previous-node csui-no-hover-effect"
      }
    ],
    rightToolbar: [
      {
        signature: "Page",
        name: FolderBrowseLang.PageWidgetToolItem,
        icon: "icon csui-icon-open-full-page",
        group: 'main',
        options: {
          hAlign: "right"
        }
      }
    ]
  };

  return toolbarItems;

});
