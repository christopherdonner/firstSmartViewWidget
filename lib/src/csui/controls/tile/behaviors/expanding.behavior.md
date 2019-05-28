ExpandingBehavior
=================

Renders an "Expand" button on the view, which triggers an "expand" event
and shows a modal dialog with a new view showing the same content with more
information.
 
### Example

```javascript
// Create a tile with an expand icon, which shows the same view;
// the view is supposed to adapt when more space is available
RecentlyAccessedView = TileView.extend({
  icon: 'title-recentlyaccessed',
  title: 'Recently Accessed',
  contentView: ContentView,
  behaviors: {
    Expanding: {
      behaviorClass: ExpandingBehavior,
      expandedView: ContentView,
      titleBarIcon: 'title-recentlyaccessed',
      actionTitleBarIcon: 'icon-toolbarFilter',
      dialogTitle: 'Recently Accessed'
    }
  }
}),

// Create a tile with an expand icon, which shows the same starting
// content, but uses its own independent collection
FavoritesView = TileView.extend({
  icon: 'title-favorites',
  title: 'Favourites',
  contentView: ContentView,
  behaviors: {
    Expanding: {
      behaviorClass: ExpandingBehavior,
      expandedView: ExpandedContentView,
      expandedViewOptions: function () {
        return {
          collection: this.collection.clone()
        };
      },
      titleBarIcon: 'title-favorites',
      dialogTitle: 'Favourites'
    }
  }
}),
```

### Options

`expandButton` (selector; '.tile-footer' by default)
: The parent element to place the expanding button to

`expandedView` (Backbone.View)
: The class of the view to be instantiated and shown in the body
  of the modal dialog

`expandedViewOptions` (object)
: The `options` parameter to be passed to the constructor when a new instance
  of the `expandedView` is created

`titleBarIcon` (string)
: CSS class placing an icon to the top-left corner of the modal dialog

`actionTitleBarIcon` (string)
: CSS class placing an extar-icon to the top-left corner of the modal dialog

 `titleBarImageUrl` (string)
 : An alternative way to place an icon to the top-left corner of the modal
   dialog; an image URL

 `titleBarImageClass` (string)
 : Can customize the styling of the image if `titleBarImageUrl` is used
 
 `dialogTitle` (string)
 : The title of the dialog to be rendered in the modal dialog caption

 `dialogTitleIconRight` (string; 'cs-icon-cross' by default)
: CSS class placing an icon to the top-right corner of the modal dialog;
  this icon is supposed to close or hide the modal dialog
 
`dialogClassName` (string)
: Additional CSS class to be assigned to the modal dialog root element
