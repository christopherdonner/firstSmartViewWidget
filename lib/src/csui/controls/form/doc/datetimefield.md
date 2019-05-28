# DatetimeFieldView (controls/form/fields/datetimefield.view)

  Shows a `DatetimeFieldView`. The `DatetimeFieldView` view shows a standalone date
  control. The model behind expects a field `data` holding the textual date value.
  `DatetimeFieldView` is derived from [FormFieldView](./formfield.md) and inherits its behavior.
  The text field is implemented as a button in read state and as a html input field in write state.
  The date field is provided with a datetimepicker. It accepts the construction parameter
  `dateFormat`, which is used as a format for the datetimepicker. If no format is given, a 
  default format determined by the current locale (set in `base`) is taken.

### Example

    var model = new Backbone.Model({ data: 'Text' }),
        contentRegion = new Marionette.Region({el: '#content'}),
        field = new DatetimeFieldView({ 
          id: 'id1',
          model: model,
          dateFormat: 'DD/MM/YYYY hh:mm:ss'
        });
    
    field.on("field:changed", function (event) {
        alert(event.fieldid + ' field:changed, new value: ' + event.fieldvalue);
    });
    
    contentRegion.show(field);

## Constructor Summary

### constructor(options)

  Creates a new `DatetimeFieldView`.

#### Parameters:
* `options` - *Object* The view's options object.
* `options.model` - *Backbone.Model* holding the model used by the view.
* `options.dateFormat` - *String* holding the date format used by the datetime picker.

#### Returns:

  The newly created object instance.

#### Example:

  See the [DatetimeFieldView](#) object for an example.


