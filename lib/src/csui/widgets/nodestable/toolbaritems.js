/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'i18n!csui/controls/tabletoolbar/nls/localized.strings',
  'i18n!csui/controls/tabletoolbar/impl/nls/localized.strings',
  'csui/controls/toolbar/toolitems.factory',
  'csui/controls/toolbar/toolitem.model',
  'csui/widgets/favorites/favorite.star.view',
  'csui-ext!csui/widgets/nodestable/toolbaritems'
], function (_, publicLang, lang, ToolItemsFactory, TooItemModel, FavoriteStarView, extraToolItems) {
  'use strict';
  var toolbarItems = {

    filterToolbar: new ToolItemsFactory({
          filter: [
            {signature: "Filter", name: lang.ToolbarItemFilter, icon: "icon icon-toolbarFilter",
              toolItemAria: lang.ToolbarItemFilterAria, toolItemAriaExpand: false}
          ]
        },
        {
          maxItemsShown: 2, // force toolbar to immediately start with a drop-down list
          dropDownIcon: "icon icon-toolbar-more",
          dropDownText: lang.ToolbarItemMore,
          addTrailingDivider: false
        }),
    addToolbar: new ToolItemsFactory({
          add: []
        },
        {
          maxItemsShown: 0, // force toolbar to immediately start with a drop-down list
          dropDownIcon: "icon icon-toolbarAdd",
          dropDownText: lang.ToolbarItemAddItem,
          addTrailingDivider: false
        }),
    leftToolbar: new ToolItemsFactory(
        {
          main: [
            {
              signature: "CollectionCanCollect",
              name: lang.ToolbarItemAddItem,
              icon: "icon icon-toolbarAdd"
            }
          ]
        },
        {
          maxItemsShown: 2,
          dropDownIcon: "icon icon-toolbar-more",
          dropDownText: lang.ToolbarItemMore,
          addTrailingDivider: false
        }),
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
            {signature: "InlineEdit", name: lang.ToolbarItemRename, onlyInTouchBrowser: true},
            {signature: "permissions", name: lang.ToolbarItemPermissions},
            {signature: "Download", name: lang.ToolbarItemDownload},
            {signature: "ReserveDoc", name: publicLang.ToolbarItemReserve},
            {signature: "UnreserveDoc", name: publicLang.ToolbarItemUnreserve},
            {signature: "Copy", name: lang.ToolbarItemCopy},
            {signature: "Move", name: lang.ToolbarItemMove},
            {signature: "AddVersion", name: lang.ToolbarItemAddVersion},
            {signature: "Delete", name: lang.ToolbarItemDelete},
            {signature: "RemoveCollectedItems", name: lang.ToolbarItemRemoveCollectionItems}
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
            {signature: "OriginalDownload", name: lang.ToolbarItemOriginalDownload},
            {signature: "OriginalDelete", name: lang.ToolbarItemOriginalDelete}
          ]
        },
        {
          maxItemsShown: 15,
          dropDownIcon: "icon icon-toolbar-more",
          dropDownText: lang.ToolbarItemMore,
          addGroupSeparators: false,
          lazyActions: true
        }),
    captionMenuToolbar: new ToolItemsFactory({
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
            {
              signature: "InlineEdit", name: lang.ToolbarItemRename,
              icon: "icon icon-toolbar-rename"
            },
            {
              signature: "permissions",
              name: lang.ToolbarItemPermissions,
              icon: "icon icon-toolbar-permissions"
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
            },
            {signature: "Delete", name: lang.ToolbarItemDelete, icon: "icon icon-toolbar-delete"},
            {
              signature: "RemoveCollectedItems",
              name: lang.ToolbarItemRemoveCollectionItems,
              icon: "icon icon-toolbar-remove-collection-items"
            }
          ]
        },
        {
          maxItemsShown: 5,
          dropDownText: lang.ToolbarItemMore,
          dropDownIcon: "icon icon-toolbar-more",
          addGroupSeparators: false
        }),
    rightToolbar: new ToolItemsFactory({
      main: [
        {
          signature: "Thumbnail",
          name: lang.ToolbarItemThumbnail,
          icon: "icon icon-switch_thumbnails24",
          commandData: {useContainer: true},
          title: lang.ThumbnailTitle
        },
        {
          signature: "ToggleDescription",
          name: lang.ToolbarItemShowDescription,
          icon: "icon icon-description-toggle",
          commandData: {useContainer: true}
        },
        {
          signature: "Comment",
          name: lang.ToolbarItemComment,
          icon: "icon icon-socialComment",
          className: "esoc-socialactions-comment",
          customView: true,
          commandData: {useContainer: true}
        },
        {
          signature: "Favorite2",
          enabled: true,
          viewClass: FavoriteStarView,
          customView: true,
          commandData: {
            useContainer: true,
            viewOptions: {
              focusable: false
            }
          }
        },
        {
          signature: "RestoreWidgetViewSize",
          name: lang.ToolbarItemRestoreWidgetViewSize,
          icon: "icon icon-tileCollapse",
          commandData: {useContainer: true}
        },
        {
          signature: "MaximizeWidgetView",
          name: lang.ToolbarItemMaximizeWidgetView,
          icon: "icon icon-tileExpand",
          commandData: {useContainer: true}
        }
      ]
    }, {
      hAlign: "right",
      maxItemsShown: 5,
      dropDownIcon: "icon icon-toolbar-more",
      dropDownText: lang.ToolbarItemMore,
      addTrailingDivider: false
    })
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
