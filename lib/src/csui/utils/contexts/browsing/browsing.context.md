BrowsingContext
===============

Extends the basic context, which can include and fetch models and collections,
with the ability to drill down to container hierarchy. If you use widgets,
which browse container content and do it recursively for child containers, 
this context will reload models and collections on entering such a container.
Typically, this context is used with tables and lists, which need to show
container children, when you click on that container. If the selected node
is not a container, it is opened in a new browser window.

```javascript
// TODO: Introduce starting node parameter for the nodestable widget
// and support both IDs and subtypes
csui.require.config({
  config: {
    'csui/utils/contexts/factories/node': {
      attributes: {id: 2000}
    }
  }
});

csui.require([
  'csui/widgets/nodestable/nodestable.view',
  'csui/utils/contexts/browsing/browsing.context',
  'csui/lib/marionette'
], function (NodesTableView, BrowsingContext, Marionette) {
  'use strict';

  var context = new BrowsingContext(),
      region = new Marionette.Region({
        el: '#content'
      }),
      view = new NodesTableView({
        context: context
      });

  region.show(view);
  context.fetch();

});
```

Plugins
-------

Plugins descended from `ContextPlugin` (csui/utils/contexts/context.plugin) can be registered. They will be constructed and stored with the context instance. They can override the constructor and the method `isFetchable(factory)`.