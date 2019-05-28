PerspectiveRouter
=================

Extends `Backbone.Router` to help the descended routers cooperate with
`PerspectiveRouting` objects, which gathers all routers controlling
a perspective panel.

## Example

```javascript
var MyPerspectiveRouter = PerspectiveRouter.extend({

  routes: {
    // usual route declarations
  },

  constructor: function MyPerspectiveRouter(options) {
    PerspectiveRouter.prototype.constructor.apply(this, arguments);

    // listen to changes of context modules which control the URL
    // to update the URL according to their attributes
  },

  onOtherRoute: function () {
    // silently clean up context modules owned by this router
  }

});
```

## Properties

### context

An instance of `PerspectiveContext` shared by objects around the perspective
panel.

## Methods

### onOtherRoute

Can be overridden to perform tasks before other router executes its callback.
Usually it means cleaning up models, which reflect URL content for the
scenario handled by this router.
