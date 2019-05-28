# Alpaca.Fields.CsuiUrlField (controls/form/fields/alpaca/alpcsuiurlfield)

  Shows a `Alpaca.Fields.CsuiUrlField`. The `Alpaca.Fields.CsuiUrlField` view shows a 
  url field to be used within the Alpaca forms framework. 
  The field is a alpaca-conform wrapper of the csui standalone text form field, and as such
  allows for inplace editing (see [FormFieldView](./formfield.md]), 
  [TextFieldView](./textfield.md)).
  
  The field is validated by Alpaca means. I.e. if an required field is empty or if an invalid
  value is set (acc. to the field description in options and schema), an inline message is shown,
  which indicates the type of error.

  Only URLs are allowed as field value.

### Example

    var formDescr = {
      "data": {
        "origin": "http://www.opentext.com"
      },
      "options": {
        "fields": {
          "origin": {
            "label": "Origin",
            "type": "url"
          }
        }
      },
      "schema": {
        "properties": {
          "origin": {
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

  Creates a new `Alpaca.Fields.CsuiUrlField`.

#### Parameters:
* `options` - *Object* The view's options object.
* `options.model` - *Backbone.Model* holding the model used by the view.

#### Returns:

  The newly created object instance.

#### Example:

  See the [Alpaca.Fields.CsuiUrlField](#) object for an example.


