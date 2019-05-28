# StatefulListItem (controls/listitem/listitemstateful.view)

  Shows a StatefulListItem. The StatefulListItem provides a simple list item, to be used in [ListView](#),
  which comprises an icon and a title, as description and a state. All these properties are configurable and usually
  set by the list. All properties allow also a dynamic binding against a Backbone.Model given in the constructor.
  If text, description or state are too long for the available space, they are cut off and provided with ellipsis.
  The info can have a state which is set through the property infoState.

  When clicked, the item throws an event 'click:item'.


### Example

      var item = new Backbone.Model({
            name: 'John Doe',
            remark: 'A good guy.'
          }),
      slItem = new StatefulListItem({
        model: item,
        text: '{name}',
        description: '{remark}',
        info: 'active',
        infoState: 'Success',
        icon: 'icon-folder'
      });

      slItem.on("click:item", function () { alert('click:item raised')});
      slItem.render();

## Constructor Summary

### constructor(options)

  Creates a new StatefulListItem.

#### Parameters:
* `options` - *Object* The view's options object.
* `options.model` - *Backbone.Model* to evaluate a dynamic binding.
* `options.text` - *String* The text. It can be a static string or a binding expression of the form {<model attribute>},
which is tried to evaluate against the model given as 'model' parameter.
* `options.description` - *String* The description. It can be a static string or a binding expression of the form {<model attribute>},
which is tried to evaluate against the model given as 'model' parameter.
* `options.info` - *String* The info. It can be a static string or a binding expression of the form {<model attribute>},
which is tried to evaluate against the model given as 'model' parameter.
* `options.infoState` - *String* The infoSate. It can have the values 'None', 'Success' and 'Warning'. In case of
infoState 'Success', the info appears in green, in case of 'Warning' it appears bold and in red.
* `options.icon` - *String* A css class desribing an icon (as a background-image to a div).

#### Returns:

  The newly created object instance.

#### Example:

  See the [StatefulListItem](#) object for an example.

## Events Summary

## click:item(event)

The event is fired if the authentication against the connection was successful.

### Parameters
* `event` - *Object* The event object


