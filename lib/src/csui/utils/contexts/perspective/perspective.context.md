PerspectiveContext
==================

Extends the basic context, which can include and fetch models and collections,
with the ability to trigger perspective change.  If you show configurable
perspectives, which are supposed to show different content depending on the
context state (different layout, different widgets) this context will maintain
changes in the perspective model.  Typically, this context is used together
with the perspective panel, which loads the fitting perspective view, populates
it with widgets and fetches the context content.

```javascript
csui.require([
  'csui/utils/contexts/perspective/perspective.context',
  'csui/lib/marionette'
], function (PerspectiveContext, Marionette) {
  'use strict';

  var context = new PerspectiveContext(),

      PerspectivePanelView = Marionette.ItemView.extend({
        template: false,

        constructor: function PerspectivePanelView() {
          Marionette.View.prototype.constructor.apply(this, arguments);
          this.listenTo(context, 'change:perspective', function () {
            // 1. Use the context.perspective model to create
            //    and render the fitting perspective view
            // 2. Fetch context
          });
        }
      }),

      view = new PerspectivePanelView({
        context: context
      }),

      region = new Marionette.Region({
        el: '#content'
      });

  region.show(view);
  context.fetch();

});
```

Plugins
-------

Plugins descended from `PerspectiveContextPlugin` (csui/utils/contexts/perspective/perspective.context.plugin) can be registered. They will be constructed and stored with the context instance. They can override the constructor and methods `isFetchable(factory)`, `onClear` and `onRefresh`.