# NodesTableView (csui/widgets/nodestable)

Shows a table with child nodes of a node container, offering rich functionality for browsing, sorting, filtering, inspecting and other actions.

If you want to get drill-down to child containers supported automatically, use a context object, which implements it; `BrowsingContext`, for example.

### Example

Show the widget on the full page:

```javascript
var region = new Marionette.Region({el: '#content'}),
    context = new BrowsingContext(),
    view = new NodesTableView({
      context: context,
      data: {
        containerId: 2000
      }
    });

region.show(view);
```

```html
<div id="content" class="binf-widgets"></div>
```

```css
#content {
  width: 100vw;
  height: 100vh;
}
```

## Options

### data.containerId (integer, undefined by default)

Node ID of the container to enter. The contextual node will be entered by default.

### data.orderBy (string, 'name' by default)

Name of the node property, which the children will be ordered by. The REST API resource, which backs up the collection has to support sorting by this property. Srtale core propeprties are: 'modify_date', 'name', 'size' and 'type'.

### data.pageSize (integer, 30 by default)

Maximum number of children (rows) shown on a page in the table. Other childrne will be accessible by pagination.

### data.pageSizes (array of integers, [30, 50, 100] by default)

Available page sizes to choose from. If `pageSize` is not explicitly included, it will be added automatically.
