# Alpaca.Fields.CsuiNodePickerField (controls/form/fields/alpaca/alpcsuinodepickerfield)

  Shows a `Alpaca.Fields.CsuiNodePickerField`. The `Alpaca.Fields.CsuiNodePickerField` view shows a 
  csui nodepicker field to be used within the Alpaca forms framework. 
  The field is a alpaca-conform wrapper of the csui standalone nodepicker form field, and as such
  allows for inplace editing (see [FormFieldView](./formfield.md]), 
  [NodepickerFieldView](./nodepickerfield.md)).
  
  The field is validated by Alpaca means. I.e. if an required field is empty or if an invalid
  value is set (acc. to the field description in options and schema), an inline message is shown,
  which indicates the type of error.


### Example

    var formDescr = {
          data: {
            shortcut: 69321
          },
          options: {
            fields: {
              shortcut: {
                anchorTitle: "Enterprise>Classic 3000/3 Jet",
                label: "Location (nodepicker)",
                type: "otcs_node_picker",
                url: "#nodes/69321"
              }
            }
          },
          schema: {
            properties: {
              shortcut: {
                format: "uri",
                type: "string"
              }
            }
          }
        };

    var contentRegion = new Marionette.Region({el: '#content'}),
        formModel = new Backbone.Model(formDescr),
        formView = new FormView({model: formModel});

    contentRegion.show(formView);

## Constructor Summary

### constructor(options)

  Creates a new `Alpaca.Fields.CsuiNodePickerField`.

#### Parameters:
* `options` - *Object* The view's options object.
* `options.model` - *Backbone.Model* holding the model used by the view.

#### Returns:

  The newly created object instance.

#### Example:

  See the [Alpaca.Fields.CsuiNodePickerField](#) object for an example.


