# Toolbar Items (widgets/nodestable/toolbaritems)

  Has the definition of toolbars used in the nodestable.view.


### Example on how to add additional toolbar items from code

 The following code extract is an example on how a module could add additional toolbar items into
 the "Add"-Toolbar divided from the existing items by using a unique group identifier for those
 items.
 
    define(["module",
      "csui/lib/jquery",
      "csui/lib/underscore",
      ...
      'csui/widgets/nodestable/toolbaritems',
      ...
      ], function (module, $, _,
        ...
        toolbarItems,	// instance of toolbarItems for 4 toolbars: filterToolbar, addToolbar, otherToolbar, rightToolbar
        ...
          ) {
        
        ...
    
        // add an additional item to the add toolbar;
        // register the following code on the 'reset'
        // event of the addable node type collection
        
        var addToolbarItemFactory = toolbarItems.addToolbar;
    
        // Notes:
        // For a toolbar item to be displayed the associated command must exist and
        // the enabled function of that command must return true.
        // When adding additional items to the toolbar factory it will be sorted into
        // the specified group. Not existing groups are added at the end.
        // Groups are separated by a divider.
        
        var toolItem = new ToolItemModel({
              signature: 'AddConnectedWorkspace',	// must match with a command
              name: "Sales Workspace",
              type: 0,
              group: 'conws'
            });
          addToolbarItemFactory.addItem(toolItem);
    
        ...
    });

## Toolbar options

 **suppressGroupSeparators:** Maintains a list of group names. If a group's name is in this list,
 a separator will not be added between that group and the one before it.

 Example (ToolItemsFactory is for csui/controls/toolbar/toolitems.factory):

 exampleToolbar: new ToolItemsFactory({
         group1: [
             {signature: "ExampleSignature",
                 ...other attributes...
             },
             ...other toolbar items...
         ],
         group2: [
             ...
         ],
         group3: [
             ...
         ]
     },
     {
         ...other options...,
         suppressGroupSeparators: ['group3'],
         ...other options...
     })

 The menu will then look like the following:

 Group 1 Menu Item 1
 Group 1 Menu Item 2
 ...
 Separator
 Group 2 Menu Item 1
 Group 2 Menu Item 2
 ...
 Group 3 Menu Item 1
 Group 3 Menu Item 2
 ...

 Any number of group names can be listed in suppressGroupSeparators. This example just shows the case
 that 1 group is listed. suppressGroupSeparators can be useful when some menu items do not show as
 rows in the menu. For example, in the mobile app's bottom-up action menu, the user can open the
 Properties page of an item by tapping an icon in the menu header. Though this action is listed,
 it does not show as a row in the menu, and so the group that the action is in should be listed
 in suppressGroupSeparators. For instance, if the action to open the Properties page were listed
 in group3 in the above example, and the developer did not list group3 in suppressGroupSeparators,
 an extra separator would show at the bottom of the menu.
