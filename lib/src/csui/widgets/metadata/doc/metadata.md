# MetaDataView (widgets/metadata)

  Shows a `MetaDataView`. The `MetaDataView` view provides an overview of the metadata of node given through the context.
  It allows for navigation in the different types of metadata.


### Example

      var contentRegion = new Marionette.Region({el: '#content'}),
          pageContext   = new PageContext(), // holds the model
          currentNode   = pageContext.getModel(NodeModelFactory, {attributes: {id: 11111}});
          metaDataView = new MetaDataView({
            context: pageContext,
            model: currentNode, 
            showCloseIcon: true,
            showBackIcon: true,
            showRequiredFieldsSwitch: true
          });

      contentRegion.show(metaDataView);
      pageContext.fetch();

## Constructor Summary

### constructor(options)

  Creates a new `MetaDataView`.

#### Parameters:
* `options` - *Object* The view's options object.
* `options.connection` - *Connection* to authenticate against.
* `options.connection.url` - *String* url to authenticate against.
* `options.connection.supportPath` - *String* support path directory.
* `options.showCloseIcon` - *Boolean* flag to show the close icon.  Default: false.
* `options.showBackIcon` - *Boolean* flag to show the go-back icon.  Default: false.
* `options.showRequiredFieldsSwitch` - *Boolean* flag to show the only-required-fields icon. 
Default: false.

#### Returns:

  The newly created object instance.

#### Example:

  See the [MetaDataView](#) object for an example.

## Localizations Summary

The following localization keys are used

* `Properties` -  title for the widget's Properties tab
* `Versions` - title for the widget's Versions tab
* `Activities` -  title for the widget's Activities tab
* `General` - title for the widget's General tab
