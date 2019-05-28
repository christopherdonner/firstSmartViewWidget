# BooleanFieldView (controls/form/fields/booleanfield.view)

  Shows a `BooleanFieldView`. The `BooleanFieldView` view shows a standalone boolean switch 
  control. The model behind expects a field `data` holding the boolean value.
  `BooleanFieldView` is derived from [FormFieldView](./formfield.md) and inherits its behavior.
  The boolean field is implemented as a Bootstrap switch.

### Example

    var model = new Backbone.Model({ data: true }),
        contentRegion = new Marionette.Region({el: '#content'}),
        field = new BooleanFieldView({ 
          id: 'id1',
          model: model 
        });
    
    field.on("field:changed", function (event) {
        alert(event.fieldid + ' field:changed, new value: ' + event.fieldvalue);
    });
    
    contentRegion.show(field);

## Constructor Summary

### constructor(options)

  Creates a new `BooleanFieldView`.

#### Parameters:
* `options` - *Object* The view's options object.
* `options.model` - *Backbone.Model* holding the model used by the view.

#### Returns:

  The newly created object instance.

#### Example:

  See the [BooleanFieldView](#) object for an example.


