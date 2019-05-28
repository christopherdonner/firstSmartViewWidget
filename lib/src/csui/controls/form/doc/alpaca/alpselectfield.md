# Alpaca.Fields.CsuiSelectField (controls/form/fields/alpaca/alpcsuiselectfield)

  Shows a `Alpaca.Fields.CsuiSelectField`. The `Alpaca.Fields.CsuiSelectField` view shows a 
  dropdown field to be used within the Alpaca forms framework. 
  The field is a alpaca-conform wrapper of the csui standalone select form field, and as such
  allows for inplace editing (see [FormFieldView](./formfield.md]), 
  [SelectFieldView](./selectfield.md)).
  
  The field is validated by Alpaca means. I.e. if an required field is empty or if an invalid
  value is set (acc. to the field description in options and schema), an inline message is shown,
  which indicates the type of error.

  Only the values given in the schema enum are allowed values.

### Example

    var formDescr = {
      "data": {
        "type": "Flyer"
      },
      "options": {
        "type": {
          "name": {
            "label": "Document Type",
            "type": "select"
          }
        }
      },
      "schema": {
        "properties": {
          "type": {
            enum: [
              'Document',
              'Report',
              'Flyer'
            ]
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

  Creates a new `Alpaca.Fields.CsuiSelectField`.

#### Parameters:
* `options` - *Object* The view's options object.
* `options.model` - *Backbone.Model* holding the model used by the view.

#### Returns:

  The newly created object instance.

#### Example:

  See the [Alpaca.Fields.CsuiSelectField](#) object for an example.


