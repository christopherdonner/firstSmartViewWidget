# NodePicker

**Module: csui/dialogs/node.picker/node.picker**

Shows a dialog with a form for selecting one or multiple nodes (documents,
containers, categories or other object types).

### Examples

```
// Pick a single node of any type and show its name
var context = new PageContext(),
    nodePicker = new NodePicker({
      context: context
    });

nodePicker
  .show()
  .done(function (args) {
    var node = args.nodes[0];
    alert(node.get('name'));
  });
```

---
## NodePicker(options)

Creates a new instance.

#### Options

context
: Application context (optional; it can provide connector and current location)

connector
: Provides the server connection (optional; can be passed by context or container)

initialContainer
: Container to start looking for the node to select in (object literal or node
  model, empty by default)

initialSelection
: List of nodes to pre-select when the picker is opened (array of object literals,
  or node models, empty by default)

selectMultiple
: Enables selecting more than a single item (boolean, `false` by default)

selectableTypes
: List of object types to show and thus make selectable (array of integers,
  empty by default)

showAllTypes
: Boolean option to show all container items whether selectable or not. Only the items
that match the provided "selectableTypes" will be enabled for selection. (boolean, `false` by default)

orderBy
: Indicates the order contents are to be sorted. Default sort is by 'name'
in ascending order. Example: orderBy: "type asc,name desc"

propertiesSeletor
: Boolean value that determines if an option to set source properties should be provided

includeCombineProperties
: Boolean value that determines if option, "Combine all properties" (both original and
destination properties) is provided

#### Note
 Currently the new UI only supports one sort request.

dialogTitle
: Text to show in the dialog caption (string, a general text by default)

selectButtonLabel
: Text to display on the action button (string, a general text by default)

startLocation
: Id of the start location the target browser is to open up in (string: `current.location`,
`recent.containers`, `favorites`, `enterprise.volume`, `personal.volume`, `perspective.assets.volume`). If startLocation
is provided and valid, the target browser will start at the specified location, else it
will revert to using the intialContainer location or next location specified in the location rules.
#### Note

If `context`, `initialContainer`, `initialSelection`, and `connector` are all missing from the Node 
Picker constructor, an Error will be thrown.

### Examples

```
// Pick multiple documents from the personal volume
var nodePicker = new NodePicker(_.defaults({
      context: context,
      initialContainer: {
        id: 'volume',
        type: 142
      },
      selectMultiple: true
    }, NodePicker.defaults.documents));

// Pick a single shortcut
var context = new PageContext(),
    nodePicker = new NodePicker({
      context: context,
      selectableTypes: [1, 2],
      dialogTitle: 'Select a Shortcut'
    });

// Pick a category to add
var context = new PageContext(),
    nodePicker = new NodePicker({
      connector: connector,
      initialContainer: {
        id: 'volume',
        type: 133
      },
      selectableTypes: [131],
      dialogTitle: 'Add a Category',
      selectButtonLabel: 'Add'
    });
```

---
## show()

Shows the dialog.

### Returns

Promise completed when the dialog closes; resolved by `function(args)` when a node was
selected, rejected when the dialog has been closed without selecting anything.

#### Resolved args

nodes
: List of selected nodes (array of node models)

### Examples

```
// Show names of all picked nodes
nodePicker
  .show()
  .done(function (args) {
    var names = args.nodes.map(function (node) {
      return node.get('name');
    });
    alert(names.join(','));
  });

// Warns the user if the selection was cancelled
nodePicker
  .show()
  .fail(function () {
    alert('At least one node must be selected');
  });
```
