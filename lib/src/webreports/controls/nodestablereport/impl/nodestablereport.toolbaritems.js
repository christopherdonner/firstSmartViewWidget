/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore',
  'i18n!csui/controls/tabletoolbar/impl/nls/localized.strings',
  'csui/controls/toolbar/toolitems.factory'
], function (_, lang, ToolItemsFactory) {

  var toolbarItems = {
    tableHeaderToolbar: new ToolItemsFactory({
      main: [
        {
          signature: "Properties",
          name: lang.ToolbarItemInfo,
          icon: "icon icon-toolbar-metadata"
        },
        {signature: "Edit", name: lang.ToolbarItemEdit},
        {signature: "EmailLink", name: lang.ToolbarItemShare},
        {signature: "Download", name: lang.ToolbarItemDownload},
        {signature: "ReserveDoc", name: lang.ToolbarItemReserve},
        {signature: "UnreserveDoc", name: lang.ToolbarItemUnreserve},
        {signature: "Copy", name: lang.ToolbarItemCopy},
        {signature: "Move", name: lang.ToolbarItemMove},
        {signature: "AddVersion", name: lang.ToolbarItemAddVersion}
      ],
      shortcut: [
        {signature: "OriginalEdit", name: lang.ToolbarItemOriginalEdit},
        {signature: "OriginalEmailLink", name: lang.ToolbarItemOriginalShare},
        {signature: "OriginalReserveDoc", name: lang.ToolbarItemOriginalReserve},
        {signature: "OriginalUnreserveDoc", name: lang.ToolbarItemOriginalUnreserve},
        {signature: "OriginalCopy", name: lang.ToolbarItemOriginalCopy},
        {signature: "OriginalMove", name: lang.ToolbarItemOriginalMove},
        {signature: "OriginalAddVersion", name: lang.ToolbarItemAddVersion},
        {signature: "OriginalDownload", name: lang.ToolbarItemOriginalDownload}
      ]
    }),

    inlineActionbar: new ToolItemsFactory({
          other: [
            {
              signature: "Properties", name: lang.ToolbarItemInfo,
              icon: "icon icon-toolbar-metadata"
            },
            {signature: "Edit", name: lang.ToolbarItemEdit, icon: "icon icon-toolbar-edit"},
            {signature: "EmailLink", name: lang.ToolbarItemShare, icon: "icon icon-toolbar-share"},
            {
              signature: "Download", name: lang.ToolbarItemDownload,
              icon: "icon icon-toolbar-download"
            },
            {
              signature: "ReserveDoc", name: lang.ToolbarItemReserve,
              icon: "icon icon-toolbar-reserve"
            },
            {
              signature: "UnreserveDoc",
              name: lang.ToolbarItemUnreserve,
              icon: "icon icon-toolbar-unreserve"
            },
            {signature: "Copy", name: lang.ToolbarItemCopy, icon: "icon icon-toolbar-copy"},
            {signature: "Move", name: lang.ToolbarItemMove, icon: "icon icon-toolbar-move"},
            {
              signature: "AddVersion",
              name: lang.ToolbarItemAddVersion,
              icon: "icon icon-toolbar-add-version"
            }
          ]
        },
        {
          maxItemsShown: 5,
          dropDownText: lang.ToolbarItemMore,
          dropDownIcon: "icon icon-toolbar-more"
        }),
    dropdownMenuListInProperties: new ToolItemsFactory({
          main: [
            {signature: "Edit", name: lang.ToolbarItemEdit},
            {signature: "EmailLink", name: lang.ToolbarItemShare},
            {signature: "Download", name: lang.ToolbarItemDownload},
            {signature: "ReserveDoc", name: lang.ToolbarItemReserve},
            {signature: "UnreserveDoc", name: lang.ToolbarItemUnreserve},
            {signature: "Copy", name: lang.ToolbarItemCopy},
            {signature: "Move", name: lang.ToolbarItemMove},
            {signature: "AddVersion", name: lang.ToolbarItemAddVersion}
          ],
          shortcut: [
            {signature: "OriginalEdit", name: lang.ToolbarItemOriginalEdit},
            {signature: "OriginalEmailLink", name: lang.ToolbarItemOriginalShare},
            {signature: "OriginalReserveDoc", name: lang.ToolbarItemOriginalReserve},
            {signature: "OriginalUnreserveDoc", name: lang.ToolbarItemOriginalUnreserve},
            {signature: "OriginalCopy", name: lang.ToolbarItemOriginalCopy},
            {signature: "OriginalMove", name: lang.ToolbarItemOriginalMove},
            {signature: "OriginalAddVersion", name: lang.ToolbarItemAddVersion},
            {signature: "OriginalDownload", name: lang.ToolbarItemOriginalDownload}
          ]
        },
        {
          maxItemsShown: 0, // force toolbar to immediately start with a drop-down list
          dropDownIcon: "icon icon-expandArrowDown"
        }
    )

  };

  return toolbarItems;

});
