# TabbedPerspectiveView

**Module: csui/perspectives/tabbed/tabbed.perspective.view**

Renders a perspective with a top navigation header and a tab control below.
The header is made of a widget and the tabs switch among grid columns
filled by widgets.

The widget height is dynamically computed to fit the rest of the page below
the expanded or collapsed header.

### Examples

```javascript
// Create a tabbed perspective and when the widgets from
// its configuration are resolved, show it in the page
// body and fetch the widget data from the server
var context = new PageContext(),
    perspectiveRegion = new Marionette.Region({el: 'body'}),
    perspectiveView = new TabbedPerspectiveView({
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
## TabbedPerspectiveView(options)

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

columns
: List of the single-row grid columns making the tab content (array of object literals).
  Single column contains properties controlling the layout of the grid cell and an extra
  property `widget` specifying the widget placed inside the grid cell.

```json
{
  "title": "Overview",
  "columns": [
    {
      "sizes": {...},
      "heights": {...},
      "widget": {...}
    },
    ...
  ]
}
```

##### Widget

type
: Type of the widget; RequireJS module path to the directory with the widget's main
  view (string, mandatory)

options
: Initialization data for the widget, passed as `options.data` to the widget's main
  view (any type, optional)

### Examples

```javascript
// Create a tabbed perspective; see below for the header and tab examples
var perspectiveView = new TabbedPerspectiveView({
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
  "columns": [
    {
      "sizes": {
        "md": 6,
        "xl": 4
      },
      "widget": {
        "type": "prototypes/widgets/related.workspaces",
        "options": {
          "title": "Sales Opportunities",
          "icon": "cs-icon-bulletlist",
          "workspaceType": "sales_opportunity",
          "itemProperties": {...}
        }
      }
    },
    {
      "sizes": {
        "md": 6,
        "xl": 4
      },
      "widget": {
        "type": "prototypes/widgets/related.workspaces",
        "options": {
          "title": "Products",
          "icon": "cs-icon-cube",
          "workspaceType": "product",
          "itemProperties": {...}
        }
      }
    },
    {
      "sizes": {
        "md": 6,
        "xl": 4
      },
      "widget": {
        "type": "prototypes/widgets/related.workspaces",
        "options": {
          "title": "Sales Orders",
          "icon": "cs-icon-checklist",
          "workspaceType": "sales_order",
          "itemProperties": {...}
        }
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
  "columns": [
    {
      "sizes": {
        "md": 12
      },
      "widget": {
        "type": "samples/widgets/nodestable"
      }
    }
  ]
}
```

### See Also

[Grid Control](../../controls/grid/grid.md),
[Tab Panel](../../controls/tab.panel/tab.panel.md),
[Grid Perspective](../grid/grid.perspective.md)
