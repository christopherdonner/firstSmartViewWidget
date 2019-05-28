# Metadata Panels

The Metadata Widget shows multiple panels with node information, which are
selectable by a dropdown control and specified like this:

```javascript
{
  title: 'My panel',        // Title of the panel selection item
  sequence: 100,            // Order in the panel selection list
  contentView: MyView,      // View rendering the panel
  contentViewOptions: {...} // Optional view construction options
}
```

The default construction options for the `contentView` are:

: model
 `NodeModel` for the selected node
 
: context
  the current application context

The `contentView` can have an optional static method to check if the panel
should be enabled (made visible) for the node opened in the metadata widget:

```javascript
  MyView.enabled = function (options) {
    // options.context: the context of the metadata widget
    // options.node:    the node which the metadata is shown for
    return true; // Enable the panel
  }
```

The built-in panels are configured like this:

```javascript
[
  {
    title: lang.properties, // 'Properties'
    sequence: 10,
    contentView: MetadataPropertiesContentView
    // 'csui/widgets/metadata/impl/metadata.properties.content.view'
  },
  {
    title: lang.versions, // 'Versions'
    sequence: 20,
    contentView: MetadataVersionsContentView
    // 'csui/widgets/metadata/impl/metadata.versions.content.view'
  }
]
```

Additional panels can be added by registering a module extension, which
returns an array of panel specifications in the format as shown above.
The additional panels will be available for selecting from the dropdown
control too.

The extension point is supposed to be used like this:

```json
"csui/widgets/metadata/metadata.panels": {
  "extensions": {
    "greet": [
      "greet/widgets/metadata/metadata.panels"
    ]
  }
}
```
