# TabbedFlowPerspectiveView

**Module: csui/perspectives/tabbed-flow/tabbed-flow.perspective.view**

Renders a perspective with a top navigation header and a tab control below.
The header is made of a widget and the tabs switch among simplified grid
columns filled by widgets.  The grid is limited to a single row only.  The
cell size is decided by the widget kind from the widget manifest:

widget kind | width       
------------|-------------
fullpage    | xs: 12      
tile        | md: 6, xl: 4

The widget height is dynamically computed to fit the rest of the page below
the expanded or collapsed header.

### Examples

```javascript
// Create a tabbed perspective and when the widgets from
// its configuration are resolved, show it in the page
// body and fetch the widget data from the server
var context = new PageContext(),
    perspectiveRegion = new Marionette.Region({el: 'body'}),
    perspectiveView = new TabbedFlowPerspectiveView({
      context: context,
      header: {...},
      tabs: [...]
    });

perspectiveView.widgetsResolved
  .always(function () {
    perspectiveRegion.show(perspectiveView);
    context.fetch();
  });
```

---
## TabbedFlowPerspectiveView(options)

Creates a new instance.

### Options

context
: Application context

header
: Specifies the widget inside the `widget` property (object literal, mandatory)

tabs
: List of tab definitions (array of object literals, mandatory)

#### Tab

title
: Title of the tab link to switch to the tab content (string, mandatory)

widgets
: List of the widgets in the grid row making the tab content (array of object literals)

```json
{
  "title": "Overview",
  "widgets": [
    {...},
    ...
  ]
}
```

##### Widget

type
: Type of the widget; RequireJS module path to the directory with the widget's main
  view (string, mandatory)

kind
: Kind of the widget, which desiced its size; overrides the widget kind from its
  manifest (string, optional: 'tile', 'fullpage')

options
: Initialization data for the widget, passed as `options.data` to the widget's main
  view (any type, optional)

### Examples

```javascript
// Create a tabbed perspective; see below for the header and tab examples
var perspectiveView = new TabbedFlowPerspectiveView({
      context: context,
      header: {...},
      tabs: [...]
    });
```

```json
// Tab with tree different configurations of RelatedWorkspaces
//
// Extra small and small:
// +---------------------+
// |                     |
// +---------------------+
// +---------------------+
// |                     |
// +---------------------+
// +---------------------+
// |                     |
// +---------------------+
//
// Medium and large:
// +---------+ +---------+
// |         | |         |
// +---------+ +---------+
// +---------+
// |         |
// +---------+
//
// Extra large:
// +-----+ +-----+ +-----+
// |     | |     | |     |
// +-----+ +-----+ +-----+
//
{
  "title": "Related",
  "widgets": [
    {
      "type": "prototypes/widgets/related.workspaces",
      "options": {
        "title": "Sales Opportunities",
        "icon": "cs-icon-bulletlist",
        "workspaceType": "sales_opportunity",
        "itemProperties": {...}
      }
    },
    {
      "type": "prototypes/widgets/related.workspaces",
      "options": {
        "title": "Products",
        "icon": "cs-icon-cube",
        "workspaceType": "product",
        "itemProperties": {...}
      }
    },
    {
      "type": "prototypes/widgets/related.workspaces",
      "options": {
        "title": "Sales Orders",
        "icon": "cs-icon-checklist",
        "workspaceType": "sales_order",
        "itemProperties": {...}
      }
    }
  ]
}

// Tab with the NotesTable to its full extent
//
// Extra small and wider:
// +---------------------+
// |                     |
// |                     |
// |                     |
// |                     |
// +---------------------+
//
{
  "title": "Documents",
  "widgets": [
    {
      "type": "samples/widgets/nodestable"
    }
  ]
}
```

### See Also

[Grid Control](../../controls/grid/grid.md),
[Tab Panel](../../controls/tab.panel/tab.panel.md),
[Flow Perspective](../flow/flow.perspective.md)
