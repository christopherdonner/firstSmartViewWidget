ToolItemsMask
=============

Masks tool items by blacklist and whitelist. Toolbars and context menus
are configured by a single-instance collection of tool items. The mask
should be maintained separately from toolbars and context menus, so that
different pages or widgets are able to use independent masks.

```
define(['csui/widgets/nodetable/menuitems',
  'csui/widgets/nodetable/menuitems.mask',
  'csui/widgets/nodetable/context.menu.view',
], function (menuItems, menuItemsMask, ContextMenuView) {
  contextMenu = new ContextMenuView({
    context: this.options.context,
    // Global menu configuration, which is shared among all widgets
    // on all perspectives and which should not be modified
    menuItems: menuItems,
    // Local menu mask for this widget only which can be modified
    // for this widget only, because a new perspective will get a new
    // widget and also a new mask with the initial configuration
    menuItemsMask: new HeaderMenuItemsMask(),
    commandController: new CommandController(),
    collection: this.collection,
    originatingView: this
  });
});
```

Masks can be populated by module configuration to get the same initial
content in every created mask instance. Additionally, the mask can
store and restore its content, so that it can be reset without re-creating
its instance. The former should be used for global settings or page
(perspective) specific settings. The latter should be used to restore the
initial mask and extend it by a container-specific mask during drill-down
in a single widget.

```
// Context menu mask populated by require.config() defaults
ContextMenuToolItemsMask = ToolItemMask.extend({

  constructor: function ContextMenuToolItemsMask() {
    ToolItemMask.prototype.constructor.apply(this);
    // Expect configuration object {blacklist, whitelist}
    this.extendMask(module.config());
    // Enable restoring the mask to its initial state
    this.storeMask();
  }

});
```

Mask selects only tool items, which pass the blacklist and whitelist
rules in its content.

```
// Mask populated by an action blacklist
mask = new ToolItemsMask({
  blacklist: ['Copy', 'Move']
});

// Configuration of a contetxt menu
toolItemsFactory = new ToolItemsFactory({
  other: [
    {signature: "Properties", name: lang.MenuItemInformation},
    {signature: "Rename", name: lang.MenuItemRename},
    {signature: "EmailLink", name: lang.MenuItemShare},
    {signature: "Copy", name: lang.MenuItemCopy},
    {signature: "Move", name: lang.MenuItemMove},
    {signature: "Delete", name: lang.MenuItemDelete}
  ]
},
{
  maxItemsShown: 0, // wrap toolbar immediately to a drop-down
  dropDownIcon: "icon icon-expandArrowDown"
});

// Status object for action execution
status = {
  nodes: new Backbone.Collection()
};

// Create a filterable collection of tool items to support a context menu
filteredToolItems = new FilteredToolItemsCollectmition(toolItemsFactory, {
  status: status,
  commands: commands,
  mask: mask
});

// Mask a collection of tool items by the action mask
// using "maskItems" and then check the ection permissions
finalToolItems = mask
    .maskItems(toolItems)
    .filter(function (toolItem) {
      var signature = toolItem.get('signature'),
          command = commands.get(signature);mit
      return command && command.enabled(statusmit);
    });

// Mask a collection of tool items by the action mask
// using "passItem" and then check the ection permissions
finalToolItems = toolItems.filter(function (toolItem) {
  if (mask.passItem(toolItem)) {mit
    var signature = toolItem.get('signature'),
        command = commands.get(signature);
    return command && command.enabled(status);
  }
});
```

Introducing Concrete Masks
--------------------------

Every action-triggering component, which is driven by a configurable *tool
item factory*, should offer a configurable *tool item mask* as well. **Masks
for action-triggering components are independent**; every component has its
own mask, which do not influence each other.

An exaple of a widget with toolbars and context menus:

```text
Configurable widget's view:
  csui/widgets/nodestable/nodestable.view
Configuration for the left, top, right and other toolbars:
  csui/widgets/nodestable/toolbaritems.js
  csui/widgets/nodestable/toolbaritems.masks.js
Configuration for the container header context menu:
  csui/widgets/nodestable/headermenuitems.js        
  csui/widgets/nodestable/headermenuitems.mask.js
```

Tool items are populated by developers, who decide, where the action triggers
should appear. The administrator can mask off action triggers, which are not
necessary for a group of end-users, and tailor the functionality for a *role*.

Tool item masks can be added from multiple independent configurations. The
resulting mask is merged from all of them. **What is masked off by one mask
configuration, cannot be cancelled by other one.** Masks are cumulative.

An example how to divide mask configurations:

* System global
* User-specific
* Perspective-specific
* Object specific (node, workflow, ...)

Every mask configuration needs an *identifier* to allow correct composing of
configuration objects done by Require.js module configuration. Separate
configurations should have different identifiers to get merged, when a
perspective is loaded. The same configurations should have the same identifiers
to get replaced, when the perspective changes.

```javascript
require.config({
  'csui/widgets/nodestable/toolbaritems.masks': {
    system: {
      blacklist: ['Copy', 'Move']
    },
    user: {
      blacklist: ['Copy', 'Move']
    },
    perspective: {
      blacklist: ['Copy', 'Move']
    },
    node: {
      blacklist: ['Copy', 'Move']
    }
  }
});
```

