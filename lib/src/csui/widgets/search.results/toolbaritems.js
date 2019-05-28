/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'i18n!csui/widgets/search.results/nls/lang',
  'i18n!csui/controls/tabletoolbar/impl/nls/localized.strings',
  'csui/controls/toolbar/toolitems.factory',
  'csui/controls/toolbar/toolitem.model',
  'csui-ext!csui/widgets/search.results/toolbaritems',
  'csui/widgets/search.results/impl/toolbaritems'
], function (_, publicLang, lang, ToolItemsFactory, TooItemModel, extraToolItems,
             oldExtraToolItems) {
  'use strict';
  var toolbarItems = {

    filterToolbar: new ToolItemsFactory({
        filter: [
          {signature: "Filter", name: lang.ToolbarItemFilter, icon: "icon icon-toolbarFilter"}
        ]
      },
      {
        addTrailingDivider: false
      }),
    otherToolbar: new ToolItemsFactory({
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
          {signature: "permissions", name: lang.ToolbarItemPermissions},
          {signature: "Download", name: lang.ToolbarItemDownload},
          {signature: "ReserveDoc", name: publicLang.ToolbarItemReserve},
          {signature: "UnreserveDoc", name: publicLang.ToolbarItemUnreserve},
          {signature: "Copy", name: lang.ToolbarItemCopy},
          {signature: "Move", name: lang.ToolbarItemMove},
          {signature: "AddVersion", name: lang.ToolbarItemAddVersion},
          {signature: "Delete", name: lang.ToolbarItemDelete}
        ]
      },
      {
        maxItemsShown: 5,
        dropDownText: lang.ToolbarItemMore,
        dropDownIcon: "icon icon-toolbar-more",
        addGroupSeparators: false,
        lazyActions:true
      }),
    inlineToolbar: new ToolItemsFactory({
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
          {signature: "permissions", name: lang.ToolbarItemPermissions, icon: "icon icon-toolbar-permissions"},
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
          },
          {signature: "Delete", name: lang.ToolbarItemDelete, icon: "icon icon-toolbar-delete"}
        ]
      },
      {
        maxItemsShown: 6,
        dropDownText: lang.ToolbarItemMore,
        dropDownIcon: "icon icon-toolbar-more",
        addGroupSeparators: false
      }),
    versionToolItems : ['properties', 'open', 'download', 'delete']
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
