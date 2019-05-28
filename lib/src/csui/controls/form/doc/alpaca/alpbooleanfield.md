# Alpaca.Fields.CsuiBooleanField (controls/form/fields/alpaca/alpcsuibooleanfield)

  Shows a `Alpaca.Fields.CsuiBooleanField`. The `Alpaca.Fields.CsuiBooleanField` view shows a 
  boolean switch to be used within the Alpaca forms framework. 
  The field is a alpaca-conform wrapper of the csui standalone boolean form field, and as such
  allows for inplace editing (see [FormFieldView](./formfield.md]), 
  [BooleanFieldView](./booleanfield.md)).
  
  The field is validated by Alpaca means. I.e. if an required field is empty or if an invalid
  value is set (acc. to the field description in options and schema), an inline message is shown,
  which indicates the type of error.
  
  True and false are the only allowed values.

### Example

    var formDescr = {
      "data": {
        "reserved": true
      },
      "options": {
        "fields": {
          "reserved": {
            "label": "Reserved",
            "type": "checkbox"
          }
        }
      },
      "schema": {
        "properties": {
          "reserved": {
            "title": "Reserved",
            "type": "boolean"
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

  Creates a new `Alpaca.Fields.CsuiBooleanField`.

#### Parameters:
* `options` - *Object* The view's options object.
* `options.model` - *Backbone.Model* holding the model used by the view.

#### Returns:

  The newly created object instance.

#### Example:

  See the [Alpaca.Fields.CsuiBooleanField](#) object for an example.


