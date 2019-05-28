# SelectFieldView (controls/form/fields/selectfield.view)

  Shows a `SelectFieldView`. The `SelectFieldView` view shows a standalone dropdown 
  control. It expects a model and a collection as contructor options. The model behind expects a 
  field `id` holding the selected values key. The collection holds the possible selection values, 
  each single selection model being of the form `{id: <key>, name:<value>}`. The model parameter
  is optional. Omitting the model shows the control without preset selection.
  `SelectFieldView` is derived from [FormFieldView](./formfield.md) and inherits its behavior.
  The text field is implemented as a Bootstrap dropdown field.

### Example

    var model = new Backbone.Model({ id: 1 }) // show first item selected
        collection = new Backbone.Collection([
          { id: 1, value: 'First' },
          { id: 2, value: 'Second' }
        ]),
        contentRegion = new Marionette.Region({el: '#content'}),
        field = new SelectFieldView({ 
          id: 'id1',
          model: model,
          collection: collection
        });
    
    field.on("field:changed", function (event) {
        alert(event.fieldid + ' field:changed, new value: ' + event.fieldvalue);
    });
    
    contentRegion.show(field);

## Constructor Summary

### constructor(options)

  Creates a new `SelectFieldView`.

#### Parameters:
* `options` - *Object* The view's options object.
* `options.model` - *Backbone.Model* holding the model used by the view.
* `options.collection` - *Backbone.Collection* holding the collection used by the view.

#### Returns:

  The newly created object instance.

#### Example:

  See the [SelectFieldView](#) object for an example.


