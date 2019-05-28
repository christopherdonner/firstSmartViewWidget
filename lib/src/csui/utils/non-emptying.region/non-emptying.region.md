NonEmptyingRegion
=================

Shows a Marionette view currectly (inluding all events) without emptying
the region element before attaching the view element to it.  This can be
used if multiple views should be appended to the region element as siblings
and just the Marionette lifecycle support should be preserved.  Other options
of `Marionette.Region.show()` are supported.

```javascript
var topView = new TopView(),
    centerView = new CenterView(),
    bodyRegion;

appendView(topView);
appendView(centerView);

function appendView(view) {
  var bodyRegion = new NonEmptyingRegion({el: document.body});
  bodyRegion.show(view);
}
```
