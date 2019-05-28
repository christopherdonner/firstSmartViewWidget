# FavoritesView (widgets/favorites)

  Shows a Favorites view. The Favorites view provides a list of favorites as given through the
  page context. It allows for filtering on the favorites by opening a search field and entering
  filter criteria. The favorites are filtered by name and sorted alphabetically ascending.
  Clicking on a single favorite opens the page's default action for the node behind.  Clicking on
  the expanded icon will show the expanded Favorites view with more columns.


### Example

      var contentRegion = new Marionette.Region({el: '#content'}),
          pageContext = new PageContext(), // holds the model
          favoritesView = new FavoritesView({context: pageContext});

      contentRegion.show(favoritesView);
      pageContext.fetch();

## Constructor Summary

### constructor(options)

  Creates a new FavoritesView.

#### Parameters:
* `options` - *Object* The view's options object.
* `options.connection` - *Connection* to authenticate against.
* `options.connection.url` - *String* url to authenticate against.
* `options.connection.supportPath` - *String* support path directory.

#### Returns:

  The newly created object instance.

#### Example:

  See the [FavoritesView](#) object for an example.

## Localizations Summary

The following localization keys are used

* `dialogTitle` -  for the widget's title
* `searchPlaceholder` - for the search field placeholder
