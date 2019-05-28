# Alpaca.Fields.CsuiTextAreaField (controls/form/fields/alpaca/alpcsuitextareafield)

  Shows a `Alpaca.Fields.CsuiTextAreaField`. The `Alpaca.Fields.CsuiTextAreaField` view shows a 
  textarea field to be used within the Alpaca forms framework. 
  The field is a alpaca-conform wrapper of the csui standalone textarea form field, and as such
  allows for inplace editing (see [FormFieldView](./formfield.md]), 
  [TextAreaFieldView](./textareafield.md)).
  
  The field is validated by Alpaca means. I.e. if an required field is empty or if an invalid
  value is set (acc. to the field description in options and schema), an inline message is shown,
  which indicates the type of error.


### Example

    var formDescr = {
      "data": {
        "description": "The Final Report\nof the case investigation."
      },
      "options": {
        "fields": {
          "description": {
            "label": "Description",
            "type": "textarea"
          }
        }
      },
      "schema": {
        "properties": {
          "description": {
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

  Creates a new `Alpaca.Fields.CsuiTextAreaField`.

#### Parameters:
* `options` - *Object* The view's options object.
* `options.model` - *Backbone.Model* holding the model used by the view.

#### Returns:

  The newly created object instance.

#### Example:

  See the [Alpaca.Fields.CsuiTextAreaField](#) object for an example.


