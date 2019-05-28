# Alpaca.Fields.CsuiTextField (controls/form/fields/alpaca/alpcsuitextfield)

  Shows a `Alpaca.Fields.CsuiTextField`. The `Alpaca.Fields.CsuiTextField` view shows a 
  text field to be used within the Alpaca forms framework. 
  The field is a alpaca-conform wrapper of the csui standalone text form field, and as such
  allows for inplace editing (see [FormFieldView](./formfield.md]), 
  [TextFieldView](./textfield.md)).
  
  The field is validated by Alpaca means. I.e. if an required field is empty or if an invalid
  value is set (acc. to the field description in options and schema), an inline message is shown,
  which indicates the type of error.


### Example

    var formDescr = {
      "data": {
        "name": "Final Report"
      },
      "options": {
        "fields": {
          "name": {
            "label": "Name",
            "type": "text"
          }
        }
      },
      "schema": {
        "properties": {
          "name": {
            "type": "string"
          }
        },
        "type": "object"
      }
    };

    var contentRegion = new Marionette.Region({el: '#content'}),
        formModel = new Backbone.Model(formDescr),
        formView = new FormView({model: formModel});

    contentRegion.show(formView);

## Constructor Summary

### constructor(options)

  Creates a new `Alpaca.Fields.CsuiTextField`.

#### Parameters:
* `options` - *Object* The view's options object.
* `options.model` - *Backbone.Model* holding the model used by the view.

#### Returns:

  The newly created object instance.

#### Example:

  See the [Alpaca.Fields.CsuiTextField](#) object for an example.


