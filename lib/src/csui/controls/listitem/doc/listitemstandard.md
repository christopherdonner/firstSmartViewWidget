# StandardListItem (controls/listitem/listitemstandard.view)

  Shows a StandardListItem. The StandardListItem provides a simple list item, to be used in [ListView](#),
  which comprises an icon and a text. Both icon and text are configurable and usually set by the list.
  If the text ist too long for the available space, it is cut off and provided with ellipsis. When
  clicked, the item throws an event 'click:item'.


### Example

      var item = new Backbone.Model({
            name: 'John Doe'
          }),
      slItem = new StandardListItem({
          model: item,
          text: '{name}',
          icon: 'icon-folder'
        });

      slItem.on("click:item", function () { alert('click:item raised')});
      slItem.render();

## Constructor Summary

### constructor(options)

  Creates a new StandardListItem.

#### Parameters:
* `options` - *Object* The view's options object.
* `options.model` - *Backbone.Model* to evaluate a dynamic binding.
* `options.text` - *String* The text. It can be a static string or a binding expression of the form {<model attribute>},
which is tried to evaluate against the model given as 'model' parameter.
* `options.icon` - *String* A css class desribing an icon (as a background-image to a div).

#### Returns:

  The newly created object instance.

#### Example:

  See the [StandardListItem](#) object for an example.

## Events Summary

## click:item(event)

The event is fired if the authentication against the connection was successful.

### Parameters
* `event` - *Object* The event object


