# TargetPicker

Shows a dialog with a form for selecting one or multiple nodes (documents,
containers, categories or other object types).

### Examples

```
// Pick a single node of any type and show its name
var targetPicker = new TargetPicker({
      done: function (args) {
        if (args.nodes.length) {
          var node = args.nodes[0];
          alert(node.name);
        }
      }
    });
targetPicker.show();
```

---
## TargetPicker(options)

Creates a new instance.

#### Options

    connection - Connects to other server than the default one (object literal, empty by default)

    done       - Callback function called when the dialog is closed to receive the selected nodes.    

    start      - Container to start looking for the node to select in (object literal, empty by default)

    selectRows - 'multiple' enables selecting more than a single item (string, 'single' by default)

    selectable - Filters the nodes to show and select (object literal, empty by default). '.type' contains the lists of types to filter with. 
    
    ui         - Sets texts to be rendered (object literal, empty by default)
     
    '.TargetPickerDialogTitle' contains the text to show in the dialog caption. 


#### done(args)

nodes
: List of selected nodes (array of object literals or an empty array if the dialog
  was closed without selecting anything)

```
// Pick a single node of any type
var targetPicker = new TargetPicker({
      done: function (args) {
        if (args.nodes.length) {
          var node = args.nodes[0];
          alert(node.name);
        }
      }
    });

// Pick multiple documents from the personal volume
var targetPicker = new TargetPicker(_.defaults({
      start: {type: 142},
      selectRows: "multiple",
      done: function (args) {
        if (args.nodes.length) {
          var names = _.pluck(args.nodes, 'name');
          alert(names.join(','));
        }
      }
    }, TargetPicker.defaults.documents));

// Pick a single shortcut
var targetPicker = new TargetPicker({
      selectable: {
        type: [1, 2]
      },
      ui: {
        TargetPickerDialogTitle: 'Select a Shortcut'
      },
      done: function (args) {
        if (args.nodes.length) {
          var node = args.nodes[0];
          alert(node.name);
        }
      }
    });
```

---
## show(options)

Shows the dialog.  The options are merged with the options passed to the constructor.

### Returns

This instance to allow chaining.

## Examples

```
// Show the target picker dialog
targetPicker.show();
```
