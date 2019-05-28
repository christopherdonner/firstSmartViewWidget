# GridPerspectiveView

**Module: csui/perspectives/grid/grid.perspective.view**

Renders a perspective with a responsive grid, where the columns are filled by
widgets.

### Examples

```javascript
// Create a grid perspective and when the widgets from
// its configuration are resolved, show it in the page
// body and fetch the widget data from the server
var context = new PageContext(),
    perspectiveRegion = new Marionette.Region({el: 'body'}),
    perspectiveView = new GridPerspectiveView({
      context: context,
      rows: [...]
    });

perspectiveView.widgetsResolved
  .always(function () {
    perspectiveRegion.show(perspectiveView);
    context.fetch();
  });
```

---
## GridPerspectiveView(options)

Creates a new instance.

#### Options

context
: Application context

rows
: List of rows in the grid (array of object literals)

#### Row

The object literal representing a row contains `columns` describing the columns
within the row (array of object literals).  Single column contains properties
controlling the layout of the grid cell and an extra property `widget` specifying
the widget placed inside the grid cell.

```json
{
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
// Create a grid perspective; see below for the rows examples
var perspectiveView = new GridPerspectiveView({
      context: context,
      rows: [...]
    });
```

```json
// MyAssignments, RecentlyAccessed and Favorites changing their widths
// to fit 1-3 of them to the viewport width and letting the default
// height be assigned
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
// Medium and wider:
// +-----+ +-----+ +-----+
// |     | |     | |     |
// +-----+ +-----+ +-----+
//
[
  {
    "columns: [
      {
        "sizes": {
          "sm": 6,
          "md": 4
        },
        "widget": {
          "type": "csui/widgets/myassignments"
        }
      },
      {
        "sizes": {
          "sm": 6,
          "md": 4
        },
        "widget": {
          "type": "csui/widgets/recentlyaccessed"
        }
      },
      {
        "sizes": {
          "sm": 6,
          "md": 4
        },
        "widget": {
          "type": "csui/widgets/favorites"
        }
      }
    ]
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
    "columns": [
      {
        "sizes": {
          "xs": 12
        },
        "heights: {
          "xs": "full"
        },
        "widget": {
          "type": "csui/widgets/nodestable"
        }
      }
    ]
  }
]

// NodesTable and Favorites next to each other filling the full
// container width and height
//
// Extra small:
// +---------------------+
// |                     |
// |                     |
// |                     |
// |                     |
// +---------------------+
// +---------------------+
// |                     |
// |                     |
// |                     |
// |                     |
// +---------------------+
//
// Small: 
// +-----------+ +-------+
// |           | |       |
// |           | |       |
// |           | |       |
// |           | |       |
// +-----------+ +-------+
//
// Medium and large: 
// +-------------+ +-----+
// |             | |     |
// |             | |     |
// |             | |     |
// |             | |     |
// +-------------+ +-----+
//
// Extra large: 
// +---------------+ +---+
// |               | |   |
// |               | |   |
// |               | |   |
// |               | |   |
// +---------------+ +---+
//
// Super extra large and wider: 
// +-----------------+ +-+
// |                 | | |
// |                 | | |
// |                 | | |
// |                 | | |
// +-----------------+ +-+
//
[
  {
    "columns": [
      {
        "sizes": {
          "sm":   7,
          "md":   8,
          "xl":   9,
          "xxl": 10,
        },
        "heights: {
          "xs": "full"
        },
        "widget": {
          "type": "csui/widgets/nodestable"
        }
      },
      {
        "sizes": {
          "sm":  5,
          "md":  4,
          "xl":  3,
          "xxl": 2
        },
        "heights: {
          "xs": "full"
        },
        "widget": {
          "type": "csui/widgets/favorites"
        }
      }
    ]
  }
]

// Two shortcuts pointing to the Enterprise and Personal Volumes
// at the top with the NodesTable filling the rest
//
// Extra small and wider:
// +---------+ +---------+
// |         | |         |
// +---------+ +---------+
// +---------------------+
// |                     |
// |                     |
// |                     |
// +---------------------+
//
[
  {
    "columns": [
      {
        "sizes": {
          "xs": 6
        },
        "heights: {
          "xs": "quarter"
        },
        "widget": {
          "type": "csui/widgets/shortcut",
          "options": {
            "type": 141,
            "background": "cs-tile-background2"
          }
        }
      },
      {
        "sizes": {
          "xs": 6
        },
        "heights: {
          "xs": "quarter"
        },
        "widget": {
          "type": "csui/widgets/shortcut",
          "options": {
            "type": 142,
            "background": "cs-tile-background3"
          }
        }
      },
      {
        "sizes": {
          "xs": 12
        },
        "heights: {
          "xs": "three-quarters"
        },
        "widget": {
          "type": "csui/widgets/nodestable"
        }
      }
    ]
  }
]

// Four shortcuts pointing to the Enterprise, Personal, Personal E-mail
// and Public E-mail Volumes at the top, using 1-4 rows to fit different
// viewports with the NodesTable filling the rest
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
// |                     |
// |                     |
// |                     |
// +---------------------+
//
// Small:
// +---------+ +---------+
// |         | |         |
// +---------+ +---------+
// +---------+ +---------+
// |         | |         |
// +---------+ +---------+
// +---------------------+
// |                     |
// |                     |
// +---------------------+
//
// Medium and wider:
// +-----+ +-----+ +-----+
// |     | |     | |     |
// +-----+ +-----+ +-----+
// +-----+
// |     |
// +-----+
// +---------------------+
// |                     |
// |                     |
// +---------------------+
//
// Large and wider:
// +---+ +---+ +---+ +---+
// |   | |   | |   | |   |
// +---+ +---+ +---+ +---+
// +---------------------+
// |                     |
// |                     |
// |                     |
// +---------------------+
//
[
  {
    "columns": [
      {
        "sizes": {
          "sm": 6,
          "md": 4,
          "lg": 3
        },
        "heights: {
          "xs": "quarter"
        },
        "widget": {
          "type": "csui/widgets/shortcut",
          "options": {
            "type": 141,
            "background": "cs-tile-background2"
          }
        }
      },
      {
        "sizes": {
          "sm": 6,
          "md": 4,
          "lg": 3
        },
        "heights: {
          "xs": "quarter"
        },
        "widget": {
          "type": "csui/widgets/shortcut",
          "options": {
            "type": 142,
            "background": "cs-tile-background3"
          }
        }
      },
      {
        "sizes": {
          "sm": 6,
          "md": 4,
          "lg": 3
        },
        "heights: {
          "xs": "quarter"
        },
        "widget": {
          "type": "csui/widgets/shortcut",
          "options": {
            "type": 143
          }
        }
      },
      {
        "sizes": {
          "sm": 6,
          "md": 4,
          "lg": 3
        },
        "heights: {
          "xs": "quarter"
        },
        "widget": {
          "type": "csui/widgets/shortcut",
          "options": {
            "type": 144
          }
        }
      },
      {
        "sizes": {
          "xs": 12
        },
        "heights: {
          "xs": "full",
          "sm": "half",
          "lg": "three-quarters"
        },
        "widget": {
          "type": "csui/widgets/nodestable"
        }
      }
    ]
  }
]
```

### See Also

[Grid Control](../../controls/grid/grid.md),
[Flow Perspective](../flow/flow.perspective.md)
