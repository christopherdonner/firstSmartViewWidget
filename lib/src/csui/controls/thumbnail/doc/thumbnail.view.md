# ThumbnailView

**Module: csui/controls/thumbnail/thumbnail.view**

 Displays a Grid View (Thumbnail View) with child nodes of a node container, offering rich functionality for sorting, searching and other actions.
 By default the content view is List View,the end-user can switch between views.

### Example

```region 
  thumbnailRegion: '.cs-thumbnail-wrapper'
```

```javascript
      var thumbnail = new ThumbnailView({
        originatingView: this,
        context: this.context,
        collection: this.collection,
        columns: this.columns,
        thumbnailColumns: this.tableView.columns,
        columnsWithSearch: ["name"],
        orderBy: this.options.data.orderBy || this.options.orderBy,
        filterBy: this.options.filterBy,
        selectedChildren: new NodeCollection(),
        actionItems: this.defaultActionController.actionItems,
        commands: this.defaultActionController.commands,
        tableColumns: thumbnailColumns,
        inlineBar: this.tableView.options.inlineBar,
        displayedColumns: this.tableView.displayedColumns

  this.thumbnailRegion.show(this.thumbnail);
```

```html
<div class="cs-thumbnail-wrapper"></div>
```
## Constructor Summary

### constructor(options)

  Creates a new `ThumbnailView`.

#### Parameters:

#### Parameters:
* `options` - *Object* The view's options object.
* `options.context` -  Context to provide the server connection or other contextual objects(Context instance).
* `options.collection` - *Backbone.Collection* holding the collection used by the view.
* `options.column` - *Backbone.Column.Collection* holding the columns used by the view.
* `options.thumbnailColumns` - External configurable columns.

#### Returns:

  The newly created object instance.

#### Example:

  See the [ThumbnailView](#) object for an example.

## Extension Summary

External content view can be loaded by registering a module extension, which
returns a view in the format as shown below.

The extension point is supposed to be used like this:

```json
 "csui/controls/thumbnail/content/content.factory": {
    "extensions": {
      "greet": [
        "greet/widgets/tablecell/comment.content.view"
      ]
    }
  },
```



