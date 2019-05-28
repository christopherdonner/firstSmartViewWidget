InfiniteScrollingBehavior
=========================

Adds support for fetching additional content when the user scrolls the
displayed view further and gets near to the end of available content.
When a specified threshold of the scrollable space is exceeded, the
`fetch` method is called on the model or collection behind the view.

This is usually used for collection views.  The collection must provide
 the interface of `BrowsableMixin`.

### Example

```javascript
// Create an infinitely scrollable list
ListView = Marionette.CollectionView.extend({
  childView: ListItemView,
  behaviors: {
    InfiniteScrolling: {
      behaviorClass: InfiniteScrollingBehavior
    }
  }
});
```

### Options

`contentParent` (selector)
: The parent element of the scrollable content within the view; if not
  specified, the root element of the view (`this.$el`) is considered
  the parent.  If it is specified, the first child of this parent is
  considered the scrollable content, unless overridden by `content`

`content` (selector)
: The scrollable content within the view; if not specified, the first
  child of the `contentParent` element is considered the content, and
  if no `contentParent` is specified, then the view (`this.$el`) itself

`fetchMoreItemsThreshold` (integer; 95 by default)
: Percentage of the scrollable are, which when reached, more data will be
  fetched from the server
