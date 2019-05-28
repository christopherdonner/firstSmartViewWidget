/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/controls/toolbar/toolitems.factory',
  'csui/controls/toolbar/toolitem.model',
  'i18n!csui/controls/tabletoolbar/impl/nls/localized.strings'
], function (_, ToolItemsFactory, ToolItemModel, lang) {
  'use strict';

  var toolbarItems = {
    inlineActionbar: new ToolItemsFactory({
          other: [
            {
              signature: "Properties",
              name: lang.ToolbarItemInfo,
              icon: "icon icon-toolbar-metadata"
            },
            {
              signature: "Edit",
              name: lang.ToolbarItemEdit,
              icon: "icon icon-toolbar-edit"
            },
            {
              signature: "Download",
              name: lang.ToolbarItemDownload,
              icon: "icon icon-toolbar-download"
            },
            {
              signature: "OpenShortlink",
              name: lang.ToolbarItemOpen,
              icon: "icon icon-toolbar-shortcut"
            },
            {
              signature: "InlineEdit",
              name: lang.ToolbarItemRename,
              icon: "icon icon-toolbar-rename"
            },
            {
              signature: "Delete",
              name: lang.ToolbarItemDelete,
              icon: "icon icon-toolbar-delete"
            }
          ]
        },
        {
          maxItemsShown: 4,
          dropDownText: lang.ToolbarItemMore,
          dropDownIcon: "icon icon-toolbar-more"
        })
  };

  return toolbarItems;
});
