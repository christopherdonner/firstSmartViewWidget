# NodePickerFieldView (controls/form/fields/nodepickerfield.view)

  Shows a `NodePickerFieldView`. The `NodePickerFieldView` view shows a standalone nodepicker 
  control. The mandatory model behind expects a field `data` holding the node id of the initially 
  selected node, and a mandatory context through which the selected node can be fetched (via the 
  context's connector), both initially and after editing. 
  Clicking on the selected node navigates to the default action node url.
  
  The control behaves differently in `read` mode and `writeonly` mode. In `writeonly` mode, it shows
  an input field, clicking on which starts the node picker dialog. After selection, a (suitably 
  shortened) path is written into the field. In the other modes, clicking on the read view directly 
  opens the node picker dialog, which allows to navigate to the respository and select a node. If
  the selection is taken over, the field raises the `field:changed` event.
  
  `NodePickerFieldView` is derived from [FormFieldView](./formfield.md) and inherits its behavior.
  The text field is implemented as a button in read state and as a html input field in write state.

### Example

    var context = new PageContext(),
        model = new Backbone.Model({ data: 2000 }), // node 2000 initially selected
        contentRegion = new Marionette.Region({el: '#content'}),
        field = new NodePickerFieldView({ 
          id: 'id1',
          model: model,
          context: context
        });
    
    field.on("field:changed", function (event) {
        alert(event.fieldid + ' field:changed, new value: ' + event.fieldvalue);
    });
    
    contentRegion.show(field);

## Constructor Summary

### constructor(options)

  Creates a new `NodePickerFieldView`.

#### Parameters:
* `options` - *Object* The view's options object.
* `options.context` - *Context* Mandatory, holding the context through which nodes are resolved.
* `options.model` - *Backbone.Model* Optional, holding the model used by the view.
* `options.model.data` - *Integer* Optional, holding the id of the initially selected node.

#### Returns:

  The newly created object instance.

#### Example:

  See the [NodePickerFieldView](#) object for an example.


