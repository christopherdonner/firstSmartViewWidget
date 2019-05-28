ParentScrollbarUpdatingBehavior
===============================

Helps updating the custom scrollbar maintained by `PerfectScrollingBehavior`
on a parent view from a (deeply nested) child view, when it resizes.

*Child view* means here a view, which does not use `PerfectScrollingBehavior`,
but it may be placed in other *parent view* (optionally across multiple
levels), which does use it to provide custom scrolling.

Whenever the child view modifies its HTML content, so that its width or
height may change, it should notify its parent about it, so that it can
update the custom scrollbar.  This behavior automates scenarios, where
Marionette view methods are used to add or remove the HTML content.

For any view:

* The child view re-renders itself

For `CollectionView`:

* A view gets added to the `CollectionView`
* A view gets removed to the `CollectionView`
* The `CollectionView` gets emptied
* The `CollectionView` gets re-populated (after collection reset)

For `LayoutView`:

* A view is shown in a region of the LayoutView
* A region of the LayoutView is emptied

If the child view modifies its HTML content by other means, than listed
above, it needs to trigger the 'update:scrollbar' event, when HTML content
has changed.

`ParentScrollbarUpdatingBehavior` *needs not* be applied to a child view, if:

* The child view is inserted directly to the parent `CollectionView` or
  `LauoutView`
* The child view changes its HTML content only by Marionette methods
* The child view is `LayoutView` and uses the default `Marionette.Region`
  for regions

`PerfectScrollingBehavior` can detect child view updates caused by Marionette
methods automatically, if these happen in direct children of `CollectionView`
and `LauoutView`.  That is why you do not need `ParentScrollbarUpdatingBehavior`
for usual two-level parent-child composite views.

If you write a child view, which changes dynamically its content, either
explicitly, or it is `CollectionView` or `LauoutView`, and you are not
sure, if it can be owned by some ancestor view, which will provide scrolling
for its entire content, use `ParentScrollbarUpdatingBehavior`.

### Example

```javascript
// Create an inner view, which modifies its HTML content dynamically
// on user interaction without re-rendering itself
DynamicView = Marionette.ItemView.extend({
  // call this.triggerMethod('update:scrollbar'), whenever the HTML content
  // changes in a way, which can affect width or height of this view
  behaviors: {
    ParentScrollbarUpdating: {
      behaviorClass: ParentScrollbarUpdatingBehavior
    }
  }
});

// Create a collection view, which is supposed to be nested (indirectly) in a
//  scrollable parent and which should inform that ancestor about its changes
DynamicView = Marionette.CollectionView.extend({
  behaviors: {
    ParentScrollbarUpdating: {
      behaviorClass: ParentScrollbarUpdatingBehavior
    }
  }
});

// Create a layout view, which is supposed to be nested (indirectly) in a
//  scrollable parent and which should inform that ancestor about its changes
DynamicView = Marionette.LayoutView.extend({
  regionClass: ParentScrollbarUpdatingBehavior.Region,
  behaviors: {
    ParentScrollbarUpdating: {
      behaviorClass: ParentScrollbarUpdatingBehavior
    }
  }
});

// Create a scrollable outer view
ScrollableView = Marionette.LayoutView.extend({
  // Just show the child views without any additional code
  behaviors: {
    PerfectScrolling: {
      behaviorClass: PerfectScrollingBehavior
    }
  }
});
```

### Options

`updateOnWindowResize` (boolean)
: If set to `true`, the child view will inform the parent view, that it may
  need to be resized after every window browser resize.  The default value
  is `false`.  You can set it to `true`, if you resize the child view by CSS
  using viewport extents or media queries, so that it could become bigger,
  than the parent view extents.

## ParentScrollbarUpdatingBehavior.Region

If the child view is `LayoutView`, use this region class together with
`ParentScrollbarUpdatingBehavior`.
