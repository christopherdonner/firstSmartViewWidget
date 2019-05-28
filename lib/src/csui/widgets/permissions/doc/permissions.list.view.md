# PermissionsListView

**Module: csui/widgets/permissions/impl/permissions.list/permissions.list.view**

Renders a list of user permissions with respect to a NodeModel. It renders a permission list in 2
subsections - Default access and Assigned access. It uses CellView to render cells inside a row
of user permission list

### DOM Structure

```
List View                     <div id="permissionslist" class="csui-permissionslist">

Default Accessed group          <div class="csui-permission-default-group-list">

PermissionsCollectionView         <div class="csui-permissions-collection">

PermissionsItemView                 <div class="csui-permission-item-row">

                                      <div class="csui-permission-item-row-main">

CellViewRegion                          <div class="csui-permission-item">

CellView                                  ...

                                        </div>

                                      </div>

More columns                          ........

                                    </div>

                                  </div>

                                </div>

                              </div>
```

---
## Constructor Summary

### constructor(options)

  Creates a new `PermissionsListView`.

#### Parameters:

***options***: Construction parameters (object literal)

***options.model***: NodeModel with the node properties
  (csui/models/node/node.model instance)

***options.context***: Context to provide the server connection or other contextual objects
  (Context instance)

***options.memberFilter***: MemberModel with the member id to be used to filter the permission list
  (csui/models/member instance)

#### Returns:

  The newly created object instance.

## Localizations Summary

The following localization keys are used

* `defaultAccessLabel` -  title for the header of default access sub-section in the list
* `assignedAccessLabel` - title for the header of assigned access sub-section in the list

## Extension Summary
  Extension is supported for columns and column's cell view

### Columns
  Use 'csui/widgets/permissions/table.columns' csui-extension to provide extra columns. Extra
  columns should be provided in the form of array.

#### Example

```
    var tableColumns = [
      {
        key: 'security_clearance',
        sequence: 31,
        column_key: <property name in the rest api response>,
        column_name: <name of table column>,
        permanentColumn: true
      },
      {
        key: 'supplemental_markings',
        sequence: 32,
        column_key: <property name in the rest api response>,
        column_name: <name of table column>,
        permanentColumn: true
      }];
```

---
  Add below entry in csui-extension.js to include above extra columns using extension, where
  permission.table.columns.js is a file used to define and return above extra columns.
```
    "csui/widgets/permissions/table.columns": {
        "extensions": {
          "greet": [
            "greet/permission/table/permission.table.columns"
          ]
        }
      },
```

---
### Cell View
  View to render in the content of a cell (Backbone.View or a function returning a Backbone.View,
  mandatory). Customized cell view can be provided to render the cell data of a column.
  Custom CellView must be registered with 'csui/controls/table/cells/cell.registry' either by
  using column key or by using data type of column's data. Custom CellView can also be provided
  by using csui-extension 'csui/controls/table/cells/cell.factory'

#### Example

```
  var SecurityPermissionCellView = CellView.extend({

    renderValue: function () {
      var value = this.getValueText();
      // adding the css class csui-table-cell-default-action lets the table.view.js select
      // this cell too when ataching a click handler for the default action
      if (value === 'true') {
        this.$el.append('<span class="csui-icon icon-true"></span>');
      } else if (value === 'false') {
        this.$el.append('<span class="csui-icon icon-false"></span>');
      } else {
        this.$el.text("");
      }
    }
  }, {
    hasFixedWidth: true
  });

  cellViewRegistry.registerByColumnKey('security_clearance', SecurityPermissionCellView);
  cellViewRegistry.registerByColumnKey('supplemental_markings', SecurityPermissionCellView);
```

---
  Add below entry in csui-extension.js to include above SecurityPermissionCellView using
  extension, where security.permission.cell.js is a file used to define/implement this custom
  cell view.
```
  "csui/controls/table/cells/cell.factory":{
      "extensions": {
        "greet": [
          "greet/permission/cell/security.permission.cell"
        ]
      }
    }
```
