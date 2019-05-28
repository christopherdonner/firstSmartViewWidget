# TextAreaFieldView (controls/form/fields/textareafield.view)

  Shows a `TextAreaFieldView`. The `TextAreaFieldView` view shows a standalone multiline textarea 
  control. The model behind expects a field `data` holding the textual value.
  `TextAreaFieldView` is derived from [FormFieldView](./formfield.md) and inherits its behavior.
  The textarea field is implemented as a button in read state and as a html textare field in write 
  state.

### Example

    var model = new Backbone.Model({ data: 'Text' }),
        contentRegion = new Marionette.Region({el: '#content'}),
        field = new TextAreaFieldView({ 
          id: 'id1',
          model: model 
        });
    
    field.on("field:changed", function (event) {
        alert(event.fieldid + ' field:changed, new value: ' + event.fieldvalue);
    });
    
    contentRegion.show(field);

## Constructor Summary

### constructor(options)

  Creates a new `TextAreaFieldView`.

#### Parameters:
* `options` - *Object* The view's options object.
* `options.model` - *Backbone.Model* holding the model used by the view.

#### Returns:

  The newly created object instance.

#### Example:

  See the [TextAreaFieldView](#) object for an example.


