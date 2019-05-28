# ViewEventsPropagationMixin

Propagates (re-triggers) the 'dom:refresh' event to the child views.

If you build a complex view and maintain the child views on your own, you
usually need to re-trigger the 'dom-refresh' event to inform the views, that
the parent view was placed into the HTML document.

Every created child view should be passed into the `propagateEventsToViews`;
anytime between their construction and showing the parent view.  It usually
means right after constructing the child views; either in the the parent view
constructor or in its render method or 'render' event handler.

If you remove the child view later, you should cancel the event propagation
by passing the child view into the `cancelEventsToViewsPropagation`.

## Example

```
var MyView = Marionette.View.extend({

  render: function () {
    this.firstView = new FirstView(...);
    this.secondView = new SecondView(...);
    
    // Register the two child views, so that they get the events propagated 
    this.propagateEventsToViews(this.firstView, this.secondView);
    
    this.$el
      .html('')
      .append(this.firstView.render().el)
      .append(this.secondView.render().el);
  }
  
});

// Add the mixin functionality to the target view
ViewEventsPropagationMixin.mixin(MyView.prototype);
```
