# Metadata Property Panels

The Property Panel of the Metadata Widget shows multiple (inner) panels with
information, which are selectable by a tab control.  They are populated
dynamically, based on the configuration of their controllers:

```javascript
{
  sequence: 100,            // Order of the panel tab
  controller: MyController, // Controller of the tab panels
  controllerOptions: {...}  // Optional controller construction options
}
```

The default construction options for the `controller` are:

: model
 `NodeModel` for the selected node
: context
  the current application context

The `controller` has to provide the following interface:

```javascript
  MyController.prototype.getPropertyPanels = function () {
    var deferred = $.Deferred();
    // Once you have enough information, resolve the promise
    // with an array of objects: 
    // {
    //   model: model for the tab, including the 'title' attribute
    //   contentView: function object of the view to instantiate
    //   contentViewOptions: optional construction options for the view
     to instantiate
    // }
    return deferred.promise();
  }
```

The default construction options for the `contentView` are:

: model
  the model instance specified in `getPropertyPanels`
: context
  the current application context

The built-in panels are configured like this:

```javascript
[
  {
    sequence: 10,
    controller: MetadataPropertyGeneralController
    // 'csui/widgets/metadata/property.panels/general/metadata.property.general.controller'
  },
  {
    sequence: 50,
    controller: MetadataPropertyCategoryController
    // 'csui/widgets/metadata/property.panels/category/metadata.property.category.controller'
  }
]
```

Additional panels can be added by registering a module extension, which
returns an array of panel controller specifications in the format as shown
above.

The extension point is supposed to be used like this:

```json
"csui/widgets/metadata/metadata.property.panels": {
  "extensions": {
    "greet": [
      "greet/widgets/metadata/metadata.property.panels"
    ]
  }
}
```
