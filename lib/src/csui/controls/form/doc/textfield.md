# TextFieldView (controls/form/fields/textfield.view)

  Shows a `TextFieldView`. The `TextFieldView` view shows a standalone single line input 
  control. The model behind expects a field `data` holding the textual value.
  `TextFieldView` is derived from [FormFieldView](./formfield.md) and inherits its behavior.
  The text field is implemented as a button in read state and as a html input field in write state.

### Example

    var model = new Backbone.Model({ data: 'Text' }),
        contentRegion = new Marionette.Region({el: '#content'}),
        field = new TextFieldView({ 
          id: 'id1',
          model: model 
        });
    
    field.on("field:changed", function (event) {
        alert(event.fieldid + ' field:changed, new value: ' + event.fieldvalue);
    });
    
    contentRegion.show(field);

## Constructor Summary

### constructor(options)

  Creates a new `TextFieldView`.

#### Parameters:
* `options` - *Object* The view's options object.
* `options.model` - *Backbone.Model* holding the model used by the view.

#### Returns:

  The newly created object instance.

#### Example:

  See the [TextFieldView](#) object for an example.


