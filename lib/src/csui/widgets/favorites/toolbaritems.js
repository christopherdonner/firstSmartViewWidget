/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'i18n!csui/controls/tabletoolbar/nls/localized.strings',
  'i18n!csui/controls/tabletoolbar/impl/nls/localized.strings',
  'csui/controls/toolbar/toolitems.factory',
  'csui/controls/toolbar/toolitem.model',
  'csui-ext!csui/widgets/favorites/toolbaritems'
], function (_, publicLang, lang, ToolItemsFactory, TooItemModel, extraToolItems) {
  'use strict';

  var toolbarItems = {
    tableHeaderToolbar: new ToolItemsFactory({
        info: [
          {
            signature: "Properties",
            name: lang.ToolbarItemInfo,
            icon: "icon icon-toolbar-metadata"
          }
        ],
        share: [
          {signature: "CopyLink", name: lang.ToolbarItemCopyLink},
          {
            signature: 'Share',
            name: lang.ToolbarItemShare,
            flyout: 'share',
            group: 'share'
          },
          {
            signature: 'EmailLink',
            name: lang.ToolbarItemEmailLink,
            flyout: 'share',
            promoted: true,
            group: 'share'
          }
        ],
        edit: [
          {signature: "Edit", name: lang.ToolbarItemEdit, flyout: "edit", promoted: true},
          {signature: "EditActiveX", name: "EditActiveX", flyout: "edit"},
          {signature: "EditOfficeOnline", name: "EditOfficeOnline", flyout: "edit"},
          {signature: "EditWebDAV", name: "EditWebDAV", flyout: "edit"}
        ],
        main: [
          {
            signature: "FavoriteRename",
            name: lang.ToolbarItemRename,
            onlyInTouchBrowser: true
          },
          {signature: "permissions", name: lang.ToolbarItemPermissions},
          {signature: "Download", name: lang.ToolbarItemDownload},
          {signature: "ReserveDoc", name: publicLang.ToolbarItemReserve},
          {signature: "UnreserveDoc", name: publicLang.ToolbarItemUnreserve},
          {signature: "Copy", name: lang.ToolbarItemCopy},
          {signature: "Move", name: lang.ToolbarItemMove},
          {signature: "AddVersion", name: lang.ToolbarItemAddVersion}
        ],
        shortcut: [
          {signature: "OriginalCopyLink", name: lang.ToolbarItemOriginalCopyLink},
          {signature: "OriginalEdit", name: lang.ToolbarItemOriginalEdit},
          {signature: "OriginalEmailLink", name: lang.ToolbarItemOriginalShare},
          {signature: "OriginalReserveDoc", name: publicLang.ToolbarItemOriginalReserve},
          {signature: "OriginalUnreserveDoc", name: publicLang.ToolbarItemOriginalUnreserve},
          {signature: "OriginalCopy", name: lang.ToolbarItemOriginalCopy},
          {signature: "OriginalMove", name: lang.ToolbarItemOriginalMove},
          {signature: "OriginalAddVersion", name: lang.ToolbarItemAddVersion},
          {signature: "OriginalDownload", name: lang.ToolbarItemOriginalDownload}
        ]
      },
      {
        maxItemsShown: 15,
        dropDownText: lang.ToolbarItemMore,
        dropDownIcon: "icon icon-toolbar-more",
        addGroupSeparators: false,
        lazyActions:true
      }),

    inlineActionbar: new ToolItemsFactory({
        info: [
          {
            signature: "Properties", name: lang.ToolbarItemInfo,
            icon: "icon icon-toolbar-metadata"
          }
        ],
        share: [
          {
            signature: "CopyLink", name: lang.ToolbarItemCopyLink,
            icon: "icon icon-toolbar-copylink"
          }
        ],
        edit: [
          {signature: "Edit", name: lang.ToolbarItemEdit, icon: "icon icon-toolbar-edit"}
        ],
        other: [
          {signature: "permissions", name: lang.ToolbarItemPermissions, icon: "icon" +
          " icon-toolbar-permissions"},
          {
            signature: "FavoriteRename",
            name: lang.ToolbarItemRenameFavorite,
            icon: "icon icon-toolbar-rename"
          },
          {
            signature: "Download", name: lang.ToolbarItemDownload,
            icon: "icon icon-toolbar-download"
          },
          {
            signature: "ReserveDoc", name: publicLang.ToolbarItemReserve,
            icon: "icon icon-toolbar-reserve"
          },
          {
            signature: "UnreserveDoc",
            name: publicLang.ToolbarItemUnreserve,
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
        dropDownIcon: "icon icon-toolbar-more",
        addGroupSeparators: false
      }),
    dropdownMenuListInProperties: new ToolItemsFactory({
        main: [
          {signature: "Properties", name: lang.ToolbarItemInformation},
          {signature: "CopyLink", name: lang.ToolbarItemCopyLink},
          {signature: "Edit", name: lang.ToolbarItemEdit},
          {signature: "EmailLink", name: lang.ToolbarItemShare},
          {signature: "Download", name: lang.ToolbarItemDownload},
          {signature: "ReserveDoc", name: publicLang.ToolbarItemReserve},
          {signature: "UnreserveDoc", name: publicLang.ToolbarItemUnreserve},
          {signature: "Copy", name: lang.ToolbarItemCopy},
          {signature: "Move", name: lang.ToolbarItemMove},
          {signature: "AddVersion", name: lang.ToolbarItemAddVersion},
          {signature: "permissions", name: lang.ToolbarItemPermissions}
        ],
        shortcut: [
          {signature: "OriginalCopyLink", name: lang.ToolbarItemOriginalCopyLink},
          {signature: "OriginalEdit", name: lang.ToolbarItemOriginalEdit},
          {signature: "OriginalEmailLink", name: lang.ToolbarItemOriginalShare},
          {signature: "OriginalReserveDoc", name: publicLang.ToolbarItemOriginalReserve},
          {signature: "OriginalUnreserveDoc", name: publicLang.ToolbarItemOriginalUnreserve},
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

  if (extraToolItems) {
    _.each(extraToolItems, function (moduleToolItems) {
      _.each(moduleToolItems, function (toolItems, key) {
        var targetToolbar = toolbarItems[key];
        if (!targetToolbar && key === 'otherToolbar') {
          targetToolbar = toolbarItems['tableHeaderToolbar'];
        }
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
