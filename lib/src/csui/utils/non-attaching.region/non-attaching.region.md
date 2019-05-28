NonAttachingRegion
==================

Shows a Marionette view currectly (inluding all events) without emptying
the region element and without attaching the view element to the region
element.  This can be used if the view has been constructed with an existing
element and just the Marionette lifecycle support should be preserved.
Other options of `Marionette.Region.show()` are supported.

```javascript
var myView = new MyView({el: document.body}),
    bodyRegion = new NonAttachingRegion({el: document.body});

bodyRegion.show(myView);
```
