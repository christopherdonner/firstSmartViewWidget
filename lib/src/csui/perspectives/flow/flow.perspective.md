# FlowPerspectiveView

**Module: csui/perspectives/flow/flow.perspective.view**

Renders a perspective with a simplified responsive grid, where the columns
are filled by widgets.  The grid is limited to a single row only. The cell
size is decided by the widget kind from the widget manifest:

widget kind | width               | height
------------|---------------------|---------
fullpage    | xs: 12              | xs: full
header      | md: 8, xl: 6        |
widetile    | lg: 6               |
tile        | sm: 6, md: 4, xl: 3 |

The default height is dynamically computed to fit 1-4 rows of tiles on the
page, depending on the viewport height.

### Examples

```javascript
// Create a flow perspective and when the widgets from
// its configuration are resolved, show it in the page
// body and fetch the widget data from the server
var context = new PageContext(),
    perspectiveRegion = new Marionette.Region({el: 'body'}),
    perspectiveView = new FlowPerspectiveView({
      context: context,
      widgets: [...]
    });

perspectiveView.widgetsResolved
  .always(function () {
    perspectiveRegion.show(perspectiveView);
    context.fetch();
  });
```

---
## FlowPerspectiveView(options)

Creates a new instance.

#### Options

context
: Application context

widgets
: List of widgets in the grid row (array of object literals)

##### Widget

type
: Type of the widget; RequireJS module path to the directory with the widget's main
  view (string, mandatory)

kind
: Kind of the widget, which desiced its size; overrides the widget kind from its
  manifest (string, optional: 'tile', 'widetile', 'header', 'fullpage')

options
: Initialization data for the widget, passed as `options.data` to the widget's main
  view (any type, optional)

### Examples

```javascript
// Create a flow perspective; see below for the layout examples
var perspectiveView = new FlowPerspectiveView({
      context: context,
      widgets: [...]
    });
```

```json
// MyAssignments, RecentlyAccessed and Favorites changing their widths
// to fit 1-3 of them to the viewport width
//
// Extra small:
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
// Small:
// +---------+ +---------+
// |         | |         |
// +---------+ +---------+
// +---------+
// |         |
// +---------+
//
// Medium and large:
// +-----+ +-----+ +-----+
// |     | |     | |     |
// +-----+ +-----+ +-----+
//
// Extra large and wider:
// +---+ +---+ +---+
// |   | |   | |   |
// +---+ +---+ +---+
//
[
  {
    "type": "csui/widgets/myassignments"
  },
  {
    "type": "csui/widgets/recentlyaccessed"
  },
  {
    "type": "csui/widgets/favorites"
  }
]

// NodesTable filling the full container width and height
//
// Extra small and wider:
// +---------------------+
// |                     |
// |                     |
// |                     |
// |                     |
// +---------------------+
//
[
  {
    "type": "csui/widgets/nodestable"
  }
]

// Welcome header and four shortcuts pointing to the Enterprise, Personal,
// Personal E-mail and Public E-mail Volumes below it, using 1-4 rows to
// fit different viewports.
//
// Extra small:
// +---------------------+
// |                     |
// +---------------------+
// +---------------------+
// |                     |
// +---------------------+
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
// Small:
// +---------------------+
// |                     |
// +---------------------+
// +---------+ +---------+
// |         | |         |
// +---------+ +---------+
// +---------+ +---------+
// |         | |         |
// +---------+ +---------+
//
// Medium and large:
// +---------------------+
// |                     |
// +---------------------+
// +-----+ +-----+ +-----+
// |     | |     | |     |
// +-----+ +-----+ +-----+
// +-----+
// |     |
// +-----+
//
// Extra large and wider:
// +---------------------+
// |                     |
// +---------------------+
// +---+ +---+ +---+ +---+
// |   | |   | |   | |   |
// +---+ +---+ +---+ +---+
//
[
  {
    "type": "csui/widgets/welcome.placeholder"
  },
  {
    "type": "csui/widgets/shortcut",
    "options": {
      "type": 141,
      "background": "cs-tile-background2"
    }
  },
  {
    "type": "csui/widgets/shortcut",
    "options": {
      "type": 142,
      "background": "cs-tile-background3"
    }
  },
  {
    "type": "csui/widgets/shortcut",
    "options": {
      "type": 143
    }
  },
  {
    "type": "csui/widgets/shortcut",
    "options": {
      "type": 144
    }
  }
]
```

### See Also

[Grid Control](../../controls/grid/grid.md),
[Grid Perspective](../grid/grid.perspective.md)
