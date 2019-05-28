# FormFieldView (controls/form/fields/impl/formfield.view)

  The `FormFieldView` is the private superclass for all csui form field views. It comprises the 
  functionality realizing the editability of a csui form field. And csui form field can be set 
  editable either interactively by the user or through code. Some special csui form fields are e.g. 
  [BooleanFieldView](./booleanfield.md), [TextFieldView](#), [TextAreaFieldView](#), 
  [SelectFieldView](#), [UserFieldView](#).
  
  A form field view knows two different states, which are *read* and *write*. In state *read* the
   user can only read the controls value. In state *write* the user can change the control's 
   value. A parameter `mode`, given at field instantiation, controls how these states can be changed. 
   The `mode` parameter can have four values: `'readonly'`, `'read'`, `'writeonly'` and `'write'`. 
   In modes `'read'` and `'write'` the control's state can be changed by the user interactively, 
   either using the mouse or using the keyboard. When the state is changed from *write* to *read*,
   after having change the control's value, an Event is thrown, indicating the change and giving 
   the new value. Mode `'read'` indicates that the control is first shown in state *read*. Mode 
   `'write'` indicates that the control is first shown in state *write*.
   In modes `'readonly'` or `'writeonly' the state cannot be changed by the user.
  

### Example

    var booleanModel = new Backbone.Model({ data: true }),
        contentRegion = new Marionette.Region({el: '#content'}),
        booleanField = new BooleanFieldView({ 
          id: 'id1',
          model: booleanModel 
          mode: 'writeonly' });

    booleanField.on("field:changed", function (event) {
        alert(event.fieldid + ' field:changed, new value: ' + event.fieldvalue);
    });

    contentRegion.show(booleanField);

## Constructor Summary

### constructor(options)

  Creates a new `FormFieldView`.

#### Parameters:
* `options` - *Object* The view's options object.
* `options.mode` - *String* giving the control's editing mode, which can be one of 'readonly', 
'read', 'writeonly' and 'write'.

#### Methods: 
* `getEditValue` - Gives the control's current value in edit state.

#### Returns:

  The newly created object instance.
  
#### Events: 

  If the control is in state *write* and its value has been changed, then, on going to state 
  *read*, an Backbone Event `field:changed` is thrown, with event data `{ fieldid: <field id>, 
  fieldvalue: <new field value }`
  

#### Example:

  See the [FormFieldView](#) object for an example.

## How to access the form and context objects from a field


The Alpaca custom field can send additional objects to the field view,
which are passed there by the `FormView`.  Typically, the `context`
and/or `formView`.  The `context` is useful, if the field will make
a CS REST API call.  The `formView` is useful, if the field will access
other fields in the form.

    constructor: function MyFieldView(options) {
      FormFieldView.prototype.constructor.apply(this, arguments);
      var connector = this.options.context.getObject(ConnectorFactory);
      // Use the connector to initialize objects accessing the server
    });

    setValue: function (value, validate) {
      var valid = FormFieldView.prototype.setValue.apply(this, arguments);
      if (valid) {
        var name = this.options.formView.getValues((‘/name’);
        // Use the value of the "name" field from the first-level fields
        // in the form to perform some extra validation
      }
      return valid;
    },
