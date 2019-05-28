# FormView (controls/form/form.view)

  Shows a `FormView`. The `FormView` view shows a form acc. to the form model given on 
  construction. The form model is built from a form description which is set set in
  Alpaca format (i.e. the same format as the open source forms library [Alpaca](http://www.alpacajs.org) 
  uses for describing forms).


### Example

    var formDescr = {
      "data": {
        "name": "Enterprise"
      },
      "options": {
        "fields": {
          "name": {
            "hidden": false,
            "hideInitValidationError": true,
            "label": "Name",
            "readonly": false,
            "type": "text"
          }
        }
      },
      "schema": {
        "properties": {
          "name": {
            "maxLength": 248,
            "minLength": 1,
            "readonly": false,
            "required": true,
            "title": "Name",
            "type": "string"
          }
        },
        "type": "object"
      }
    };

      var contentRegion = new Marionette.Region({el: '#content'}),
          formModel = new FormModel(formDescr),
          formView = new FormView({model: formModel});

      contentRegion.show(formView);

## Constructor Summary

### constructor(options)

  Creates a new `FormView`.

#### Parameters:

***options***: Construction parameters (object literal)

***options.model***: Form model with the form specification
  (Backbone.Model instance with attributes like `{data, schema, options}`)

***options.context***: Context to provide the server connection or other contextual objects
  (Context instance)

#### Returns:

  The newly created object instance.

#### Example:

  See the [FormView](#) object for an example.

## Events

### change:field

Triggered when a field value was edited by the user.
  
**Arguments:**

***targetField***:
The (single) field, which was edited (object literal)

***parentField***:
If the outermost complex field, which contains the edited field.
  If the edited field was a part of an object (filedset) it will
  be the object field.  If the edited field was a part of an array
  (multivalue) it will be the array field.  If the edited field was
  a part of an array of objects (multivalue fieldset) it will be
  the (outer) array field and so on if there was a deeper nesting.
  (optional)

**Field parameters:**

***path***: The XPath-like path of the value in the `data` JSON object (string)

***name***: The last part of the `path` (string)

***value***: The current (just edited) value (any)

If you need to implement immediate saving in the form editing mode, whenever
a field value changes, you should check, if the form is not in the creation
mode.  The creation mode expects a "Save" button to get all changes and send
them to the server together:

````javascript
this.listenTo(this, 'change:field', function (args) {
  if (this.mode === 'create') {
    return;
  }
  // save the changes
});
````

## How to let a field access the form and context objects

Alpaca field constructor obtains the `connector` object, which can carry
custom configuration passed from the form:

    constructor: function MyField(container, data, options, schema,
                                  view, connector, onError) {
      this.base(container, data, options, schema, view, connector, onError);
    },

The `connector` object is saved by the base Alpaca constructor to the field
instance and the custom configuration can be accessed `this.connecto.config`.
The following properties added by the `FormView` are available there:

***context***: 
The data-managing context passed down by the scenario-owning component;
  usually the widget.  It is available from the beginning; in the constructor
  already.

***formView***:
The `FormView`, which owns the field.  It is available from the beginning;
  in the constructor already.

***form***:
The Alpaca form object.  It is available after the entire form was rendered.
  **Warning:** You cannot access it in the constructor and in the `postRender`
  callback.  It is useful only in field changing event handlers, when the user
  interacts with the form.

If you implement the field content using a descendant of `FormFieldView`, you
may need to pass the `context` and/or `formView` to the field view.
The `context` is useful, if the field will make a CS REST API call.
The `formView` is useful, if the field will access other fields in the form.

    var fieldConfig = this.connector.config,
        fieldView = new MyFieldView({
          context: fieldConfig.context,
          formView: fieldConfig.formView,
          model: new Backbone.Model({
            data: this.data,
            options: this.options,
            schema: this.schema
          }),
          ...
        });
