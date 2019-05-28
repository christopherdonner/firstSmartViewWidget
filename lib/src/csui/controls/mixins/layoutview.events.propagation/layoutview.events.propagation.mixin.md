# LayoutViewEventsPropagationMixin

Propagates (re-triggers) 'before:show', 'show' and 'dom:refresh' events
to the child views shown in the inner regions.

`Marionette.LayoutView` does not do this.  `Marionette.CollectionView` and
`Marionette.CompositeView` do this.  If you build a complex view based on the
`Marionette.LayoutView`, you usually need to re-trigger the 'before:show' and
'show' events to inform the view, that the view has been placed to a parent
HTML element and to re-trigger the 'dom-refresh' event to inform the view,
that it was placed into the HTML document.  (The latter is triggered after
every render too, as long as the view is in the HTML document.)

The `propagateEventsToRegions` should be called anytime after the parent
`Marionette.LayoutView` construction and before that view can be shown.
It is usually done right in the constructor.

## Example

```
var MyView = Marionette.LayoutView.extend({

  constructor: function MyView(options) {
    Marionette.LayoutView.prototype.constructor.apply(this, arguments);

    // Cause the show events triggered on the parent view re-triggered
    // on the views placed in the inner regions 
    this.propagateEventsToRegions();
  }
  
});

// Add the mixin functionality to the target view
LayoutViewEventsPropagationMixin.mixin(MyView.prototype);
```
