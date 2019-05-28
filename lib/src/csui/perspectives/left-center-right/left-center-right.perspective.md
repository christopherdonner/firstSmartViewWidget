# LeftCenterRightPerspectiveView

**Module: csui/perspectives/left-center-right/left-center-right.perspective.view**

Renders a perspective with a responsive grid, where the cells are pre-configured
for a mandatory central widget and two optional sidebar widgets.

Layout on different viewport sizes for all `left`, `center` and `right` zones filled:

```text
xxl, xl and md                     sm                 xs
+-------------------------------+  +---------------+  +---------+
|       |               |       |  |               |  |         |
| left  | center        | right |  | center        |  | center  |
|       |               |       |  |               |  |         |
|       |               |       |  |               |  |         |
|       |               |       |  |               |  |         |
|       |               |       |  |               |  |         |
|       |               |       |  |               |  +---------+
|       |               |       |  |               |  |         |
|       |               |       |  |               |  | left    |
+-------------------------------+  +-------+-------+  |         |
                                   |       |       |  |         |
                                   | left  | right |  |         |
                                   |       |       |  |         |
                                   |       |       |  +---------+
                                   |       |       |  |         |
                                   |       |       |  | right   |
                                   |       |       |  |         |
                                   |       |       |  |         |
                                   |       |       |  |         |
                                   +-------+-------+  |         |
                                                      +---------+
```

Layout on different viewport sizes for only `left` and `center` zones filled:

```text
xxl, xl, md and sm         xs
+-------+---------------+  +---------+
|       |               |  |         |
| left  | center        |  | center  |
|       |               |  |         |
|       |               |  |         |
|       |               |  |         |
|       |               |  |         |
|       |               |  +---------+
|       |               |  |         |
|       |               |  | left    |
+-------+---------------+  |         |
                           |         |
                           |         |
                           |         |
                           +---------+
```

Layout on different viewport sizes for only `center` and `right` zones filled:

```text
xxl, xl, md and sm         xs
+---------------+-------+  +---------+
|               |       |  |         |
| center        | right |  | center  |
|               |       |  |         |
|               |       |  |         |
|               |       |  |         |
|               |       |  |         |
|               |       |  +---------+
|               |       |  |         |
|               |       |  | right   |
+---------------+-------+  |         |
                           |         |
                           |         |
                           |         |
                           +---------+
```

Layout on different viewport sizes for only `center` zone filled:

```text
xxl, xl, md, sm and xs
+---------------+
|               |
| center        |
|               |
|               |
|               |
|               |
|               |
|               |             
|               |             
+---------------+             
```

### Examples

```javascript
// Create a left-center-right perspective and when the widgets
// from its configuration are resolved, show it in the page
// body and fetch the widget data from the server
var context = new PageContext(),
    perspectiveRegion = new Marionette.Region({el: 'body'}),
    perspectiveView = new LeftCenterRightPerspectiveView({
      context: context,
      left: {...},
      center: {...},
      right: {...}
    });

perspectiveView.widgetsResolved
  .always(function () {
    perspectiveRegion.show(perspectiveView);
    context.fetch();
  });
```

---
## LeftCenterRightPerspectiveView(options)

Creates a new instance.

#### Options

context
: Application context

left
: Specifies the widget in the left sidebar (object literal, optional)

center
: Specifies the widget in the center (object literal, mandatory)

right
: Specifies the widget in the right sidebar (object literal, optional)

##### Widget

type
: Type of the widget; RequireJS module path to the directory with the widget's main
  view (string, mandatory)

options
: Initialization data for the widget, passed as `options.data` to the widget's main
  view (any type, optional)

### Examples

```javascript
// Create a left-center-right-zones perspective; see below for the layout examples
var perspectiveView = new LeftCenterRightPerspectiveView({
      context: context,
      left: {...},
      center: {...},
      right: {...}
    });
```

```json
// Favorites, NodesTable and RecentlyAccessed
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
// +---------------------+
// |                     |
// +---------------------+
// +---------+ +---------+
// |         | |         |
// +---------+ +---------+
//
// Medium and wider:
// +----+ +-------+ +----+
// |    | |       | |    |
// +----+ +-------+ +----+
//
"left": {
  "type": "csui/widgets/favorites"
}
"center": {
  "type": "csui/widgets/nodestable"
}
"right": {
  "type": "csui/widgets/recentlyaccessed"
}

// Favorites and RecentlyAccessed
//
// Small and narrower:
// +---------------------+
// |                     |
// +---------------------+
// +---------------------+
// |                     |
// +---------------------+
//
// Medium and wider:
// +-----+ +-------------+
// |     | |             |
// +-----+ +-------------+
//
"left": {
  "type": "csui/widgets/recentlyaccessed"
}
"center": {
  "type": "csui/widgets/nodestable"
}

// NodesTable and RecentlyAccessed
//
// Small and narrower:
// +---------------------+
// |                     |
// +---------------------+
// +---------------------+
// |                     |
// +---------------------+
//
// Medium and wider:
// +-------------+ +-----+
// |             | |     |
// +-------------+ +-----+
//
"center": {
  "type": "csui/widgets/nodestable"
}
"right": {
  "type": "csui/widgets/recentlyaccessed"
}

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
"center": {
  "type": "csui/widgets/nodestable"
}
```

### See Also

[Grid Control](../../controls/grid/grid.md),
[Grid Perspective](../grid/grid.perspective.md)
