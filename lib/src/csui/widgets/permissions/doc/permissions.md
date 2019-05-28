# PermissionsView (widgets/permissions)

  Shows a `PermissionsView`. The `PermissionsView` view provides an overview of the user permissions
  of a node given through the context.

### Example

      var contentRegion = new Marionette.Region({el: '#content'}),
          pageContext   = new PageContext(), // holds the model
          currentNode   = pageContext.getModel(NodeModelFactory, {attributes: {id: 11111}});
          permissionsView = new PermissionsView({
            context: pageContext,
            model: currentNode, 
            showCloseIcon: true,
            showBackIcon: true,
            showRequiredFieldsSwitch: true
          });

      contentRegion.show(permissionsView);
      pageContext.fetch();

## Constructor Summary

### constructor(options)

  Creates a new `PermissionsView`.

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

  See the [PermissionsView](#) object for an example.