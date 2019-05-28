PerfectScrollingBehavior
========================

Makes the view scrollable by a custom scrollbar looking like the native
scrollbar on Macintosh.  It should be used for every scrollable view for
consistency.

Scrolling is usually forced by setting up the HTML element like this:

```html
<div class="content">
  ...
</div>
```

```css
.content {
  height: ...;    /* limit the height */
  overflow: auto; /* show scrollbar if the actual content is taller */
}
```

However, the perfect scrollbar integration needs an extra parent HTML element
to wrap the element you want to scroll:

```html
<div class="parent">
  <div class="content">
    ...
  </div>
</div>
```

```css
.parent {
  height: ...;        /* limit the height */
}
.content {
}
```

You are supposed to render the parent and child elements and set the right
height to the parent element.  The rest of the styling is performed by this
behaviour.  Additionally, your view should trigger before:render, render,
dom:refresh and before:destroy events, which this behaviour uses to maintain
the perfect scrollbar.  Their order should be as documented and implemented
for built-in Marionette views.  If you need to update the scrollbar, when no
dom:refresh event was triggered, you can trigger the update:scrollbar event.

The perfect scrollbar plugin is used on desktop (non-touch) devices only.
This behavior lets the built-in scrollbar show on touch devices by applying
only the necessary styling, so that the parent element becomes scrollable.

### Example

```javascript
// Create a scrollable list
ListView = Marionette.CollectionView.extend({
  childView: ListItemView,
  behaviors: {
    PerfectScrolling: {
      behaviorClass: PerfectScrollingBehavior
    }
  }
});

// Create a scrollable composite
ParentView = Marionette.LayoutView.extend({
  regionClass: PerfectScrollingBehavior.Region,
  behaviors: {
    PerfectScrolling: {
      behaviorClass: PerfectScrollingBehavior
    }
  }
});

// Create a tile with scrollable content
HelloTileView = TileView.extend({
  icon: 'icon-hello',
  title: 'Hello',
  contentView: ContentView,
  behaviors: {
    PerfectScrolling: {
      behaviorClass: PerfectScrollingBehavior,
      // Make just the body part of the tile scrollable
      contentParent: '.tile-content',
      // never make the view scrollable horizontally; if this is needed,
      // there is probably a bug in the markup & styling which causes
      // the undesired overflow
      suppressScrollX: true,
      // height delta threshold to exceed before the scrollbar shows up;
      // the list has a padding, which would make the scrollbar show up
      scrollYMarginOffset: 15
    }
  }
});
```

### Options

`contentParent` (jQuery object, HTML element or selector)
: The parent element of the scrollable content within the view; if not
  specified, the root element of the view (`this.$el`) is considered
  the parent to make scrollable

`scrollingDisabled` (boolean)
: Makes the view not scrollable by applying an additional styling.

See the perfect scrollbar web site to learn about other parameters:
`scrollXMarginOffset`, `scrollYMarginOffset`, `suppressScrollX`,
and `suppressScrollY`.

`updateOnWindowResize` (boolean)
: If set to `true`, the child view will inform the parent view, that it may
  need to be resized after every window browser resize.  The default value
  is `true`.  You can set it to `false`, if you process the 'resize' event
  on your own in the child view and re-render the view afterwards.

## Scrollbar Updates

Using a custom scrollbar ensures the same look and feel on all platforms, but
makes bad user and developer experience:

* Scrolling becomes choppy, because of the excessive number of re-rendering
  requests, which cannot use the native smooth scrolling in the browser.
* Changes in the HTML markup need extra code to update the custom scrollbar
  explicitly across nested element hierarchies, while the native scrollbar
  updates automatically.

This behavior recognizes `CollectionView` and `LayoutView` and if their
children are added and removed using Backbone & Marionette methods,
scrollbar updates will take place automatically.

## PerfectScrollingBehavior.Region

If the scrollable view is `LayoutView`, use this region class together with
`PerfectScrollingBehavior`, if views are shown and hidden in the regions
dynamically outside the `render` method.  You will not need explicit scrollbar
updates.