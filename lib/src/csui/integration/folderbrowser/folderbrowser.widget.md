# FolderBrowserWidget

Widget for the Content Server content browsing. Presents a container
object using a table where each row represents a child and each column shows
a property of the child.

Typically, you create a new instance of FolderBrowserWidget with options
passed to the constructor to customize its look and features, attach
to provided events and call the display method to place it on the page.

### Example:

```javascript
// Create the widget attached to the placeholder HTML element.
var browser = new FolderBrowserWidget({
  // The connection is mandatory to initialize the widget model.
  connection: {
    url: "http://server/otcs/cs/api/v1",
    supportPath: "/otcssupport"
  }
});
// Display the widget.
browser.show({
  // Placeholder is mandatory, but can be passed to the show
  // method first, because it is needed first for rendering.
  placeholder: "#browser",
});
```

---
## Constructor FolderBrowserWidget(options)

Creates a new widget and attaches it to the HTML DOM.  It does not
render the content nor loads the data from the server yet; those
operations take place when the `show` method is called.

### Parameters:

    options     - object literal with initial settings

### Properties of `options`:

    placeholder - selector, DOM object or a jQuery object pointing
                  to a HTML element which should contain the widget
    connection  - object with the API url and other parameters of
                  the server connection
    connector   - object providing the server connection and communication;
                  it can be created internally from the `connection`
                  (either `connection` or `connector` must be provided)
    start       - object containing the starting container reference
                  (the Enterprise Volume is the default)
    breadcrumb  - object controlling the presence and behaviour of the
                  breadcrumb navigation
    facetPanel  - object controlling the presence and behaviour of the
                  facet panel
    pageSize    - an integer with count of items to show on a page
                  (30, 50 or 100)
    resetLimitOnChange - if the page size should be reset when another
                         container has been entered
    resetOrderOnChange - if sorting should be reset when another
                         container has been entered
    filter        - object with properties to filter the children by; the
                    property `name` uses the name filtering text box
    clearFilterOnChange - if the filter text should be cleared when another
                          container has been entered


The parameters `placeholder` and `connection`/`connector` are mandatory,
but the placeholder can be omitted in the constructor and passed only to the
show method, because it is first needed for rendering.

The optional parameters have the following defaults:

    {
      start: { type: 141 },
      breadcrumb: true,
      facetPanel: true,
      pageSize: 30,
      resetLimitOnChange: false,
      resetOrderOnChange: false,
      filter: {}, // see selectable at TargetPickerWidget for a sample
      clearFilterOnChange: true
    }


See the Connector documentation about the `connection` and `connector`
properties.

### Properties of `start`:
  
    id   - the (numeric) node ID of the container to enter on start
    type - the (numeric) subtype of the volume to enter on start

You can use a node ID you were provided by a URL parameter, e.g.:

    start: {
      id: 7611
    }

Enterprise Workspace should be opened by its subtype because its
node ID may vary:

    start: {
      type: 141
    }

### Properties of `breadcrumb`:
  
    stop  - object with the `id` property to stop the path of ancestors
            going down to the root at a specific node; the path below
            it will not be accessible via the breadcrumb

A page dedicated to browse a single container may want to limit the
accessible ancestors in the breadcrumb; you usually use the `start`
option for the `FolderBrowserWidget` in addition with this:

    breadcrumb: {
      stop: { id: 7611 }
    }

Breadcrumb can be hidden by setting the property value to `false`.

Facet panel can be hidden by setting the property value to `false`.

### Returns:

The newly created object instance.

### Example:

See the FolderBrowserWidget object for an example.
 
---
## Events

## childSelected

This event is triggered when a single child or multiple children
were selected. The complete selection can be obtained by the
getSelectedChildren method.

### Arguments:

    sender - the FolderBrowserWidget instance sending this event
    nodes  - the list of nodes which were added to the current selection

### Example:

See the `getSelectedChildren` method for an example.

## childUnselected

This event is triggered when a single child or multiple children
were unselected. The complete selection can be obtained by the
getSelectedChildren method.

### Arguments:

    sender - the FolderBrowserWidget instance sending this event
    nodes  - the list of nodes which were removed from the current selection

### Example:

See the `getSelectedChildren` method for an example.
 
## containerOpened

This event is triggered when a container has been entered
and its data (properties) have been obtained from the server.

### Arguments:

    sender - the FolderBrowserWidget instance sending this event
    node   - the container information

### Example:

```javascript
browser.on("containerOpened", function (args) {
  // Keep the page title equal to the current container name
  $("head title").text("Current Container: " + args.node.name);
});
```
 
## executingDefaultAction

This event is triggered when the default action for a node has been
fired (by clicking on its name, for example) but not executed yet.

### Input Arguments:

    sender - the FolderBrowserWidget instance sending this event
    node   - the node that is the subject of the action

### Output Arguments:

    cancel - if set to true, the action execution will be cancelled

### Example:
 
```javascript
browser.on("executingDefaultAction", function (args) {
  // Prevent the immediate default action execution
  args.cancel = true;
  // Execute other operation
  performOtherOperation(args.node);
});
```

## tableBodyRendered

This event is triggered when the `tbody` element of the table has
been rendered, which happens when a page of children is displayed.

### Arguments:

    sender - the FolderBrowserWidget instance sending this event
    target - the `tbody` element

---
## Methods

## close

Removes the widget from the HTML DOM and silently clears the model objects
it owned. You won't be able to use the object instace after calling
this method.

This method can be used to "start from the scratch" when you want to
authenticate as other user and initialize the UI once more, e.g.

### Returns:

This object itself to allow call chaining.

### Example:

```javascript
browser = new FolderBrowserWidget(...);
browser.show();
// Destroy and re-create the widget
browser.close();
browser = new FolderBrowserWidget(...);
browser.show();
```

## enterContainer

Changes the currently opened container.

### Parameters:

    node   - the container to enter (node `id` or an object with the
                                     `id` property)

### Returns:

This object itself to allow call chaining.

### Example:

```javascript
// Open a particular container node.
browser.enterContainer(7611);
```

## getContainer

Gets the currently opened container.

### Returns:

A node object.

### Example:

```javascript
var container = browser.getContainer();
alert(container.name);
```

## getSelectedChildren

Gets the current selection of children as an array of objects.

### Returns:

Array of node objects.

### Example:

```javascript
// Attach to the event fired when additional children were selected.
browser.on("childSelected", function (args) {
  // Do something with the newly selected children: args.nodes.
  ...
})
.on("childUnselected", function (args) {
  // Do something with the unselected children: args.nodes.
  ...
  // Do something with the remaining selected children:
  var selection = browser.getSelectedChildren();
  ...
});
```

## on(event, func)

binds a widget event to a given function

### Parameters

* `event` -	*String* representing the event to bind to.
* `func` -	*Object* representing the function to run once the event is triggered.

### Example:

See example of getSelectedChildren().

## show(options)

Displays the widget initially or refreshes an already displayed one.

This is supposed to be called after creating a new widget by the
FolderBrowserWidget constructor. Before calling it to actually show
the widget on the HTML page you can modify its settings or attach
to its events.

### Parameters:

    options - optoins needed to render the widget, which were not passed
              into the constructor

### Returns:

This object itself to allow call chaining.

### Example:

See the FolderBrowserWidget object for an example.

---
## Additional actions

If breadcrumb is hidden, navigation to the previously visited container
(usually the parent container) can be enabled by showing the
"go.to.node.history" button:

    csui.require.config({
      config: {
        'csui/integration/folderbrowser/commands/go.to.node.history': {
          enabled: true
        }
      }
    });

If the widget is placed to a smaller part of the page, some actions will
be difficult to use.  opening a new window showing the current container
using CS Smart UI perspective can be enabled by showing the
"open.full.page.container" button:

    csui.require.config({
      config: {
        'csui/integration/folderbrowser/commands/open.full.page.container': {
          enabled: true,
          scenario: 'fiori'
        }
      }
    });

When adding these, make sure that they are also configured as extensions to 
`csui/utils/commands` and `csui/widgets/nodestable/toolbaritems`. 