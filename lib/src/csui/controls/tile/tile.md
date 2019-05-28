TileView
========

Shows a tile consisting of a header and body.  The header can contain an icon
and title, the body should be filled by other view.  This control is usually
used to implement tile widgets.

### Example

```javascript
// Sample content view used from other samples
ContentView = Marionette.View.extend({
  render: function () {
    this.$el.text('Hello, world!');
    return this;
  }
});

// Create a tile view wrapping the ContentView to render
simpleTileView = new TileView({
  icon: 'title-favourites',
  title: 'Simple Tile',
  contentView: ContentView
});

// Create a reusable "Hello" tile view class and instance to render
HelloTileView = TileView.extend({
  icon: 'icon-hello',
  title: 'Hello',
  contentView: ContentView,
  behaviors: {
    Scrolling: {
      behaviorClass: PerfectScrollingBehavior,
      suppressScrollX: true
    }
  }
});
helloTileView = new HelloTileView();
```

### Options

`icon` (string)
: CSS class placing an icon to the top-left corner

`imageUrl` (string)
: An alternative way to place an icon to the top-left corner; an image URL

`imageClass` (string)
: Can customize the styling of the image if `imageUrl` is used

`title` (string)
: The title of the tile to be rendered in the tile header

`contentView` (Backbone.View)
: The class of the view to be instantiated and shown in the tile body

`contentViewOptions` (object)
: The `options` parameter to be passed to the constructor when a new instance
  of the `contentView` is created
