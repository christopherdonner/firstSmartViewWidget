BlockingBehavior
================

Blocks user interaction with the view when the model or collection behind it
is being fetched or saved.  It uses the `BlockingView` and binds it to the
model and/or collection events accordingly.
 
### Example

```javascript
// Create a list, which will show a pregress loading graphics and b lock user
// interaction while the data are being ferched from the server
ListView = Marionette.CollectionView.extend({
  childView: ListItemView,
  behaviors: {
    Blocking: {
      behaviorClass: BlockingBehavior
    }
  }
});
```
