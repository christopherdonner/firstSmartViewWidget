PortalContext
=============

Extends the basic context, which can include and fetch models and collections,
with the ability to open nodes in a new browser window. If you use widgets,
which show links or other controls to switch the contextual node to another
one, this context will open a new window with the selected node. Typically,
this context is used on portal home pages, which serve as a guidepost for
further browsing.

```javascript
csui.require([
  'csui/widgets/favorites/favorites.view',
  'csui/utils/contexts/portal/portal.context',
  'csui/lib/marionette'
], function (FavoritesView, PortalContext, Marionette) {
  'use strict';

  var context = new PortalContext(),
      region = new Marionette.Region({
        el: '#content'
      }),
      view = new FavoritesView({
        context: context
      });

  region.show(view);
  context.fetch();

});
```

Plugins
-------

Plugins descended from `ContextPlugin` (csui/utils/contexts/context.plugin) can be registered. They will be constructed and stored with the context instance. They can override the constructor and the method `isFetchable(factory)`.