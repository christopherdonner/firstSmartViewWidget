# Permissions Header Right Panel

The Header Right Panel of the Permission Widget shows multiple (inner) panels with
information.  They are populated dynamically, based on the configuration of their views:

Additional panels can be added by registering a module extension, which
returns a view in the format as shown below.

The extension point is supposed to be used like this:

```json
"csui/widgets/permissions/impl/header/rightview/header.rightbar.view": {
  "extensions": {
    "greet": [
      "greet/permission.header/permission.header.view"
    ]
  }
}
```

# permission.header.view: is either an item view or a layout view.


