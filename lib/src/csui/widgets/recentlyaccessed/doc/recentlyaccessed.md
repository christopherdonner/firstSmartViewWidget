# RecentlyAccessedView (widgets/recentlyaccessed)

  Shows a Recently Accessed view. The Recently Accessed view provides a list of recently accessed
   items as given through the page context. It allows for filtering on the items by opening a
    search field and entering filter criteria. The itemns are filtered by name and sorted
    by age ascending. Clicking on a single item opens the page's default action for
    the node behind. Clicking on the expanded icon will show the expanded Recently Accessed view 
    with more columns.

### Example

      var contentRegion = new Marionette.Region({el: '#content'}),
          pageContext = new PageContext(), // holds the model
          recentlyAccessedView = new RecentlyAccessedView({context: pageContext});

      contentRegion.show(recentlyAccessedView);
      pageContext.fetch();

## Constructor Summary

### constructor(options)

  Creates a new RecentlyAccessedView.

#### Parameters:
* `options` - *Object* The view's options object.
* `options.connection` - *Connection* to authenticate against.
* `options.connection.url` - *String* url to authenticate against.
* `options.connection.supportPath` - *String* support path directory.

#### Returns:

  The newly created object instance.

#### Example:

  See the [RecentlyAccessedView](#) object for an example.

## Localizations Summary

The following localization keys are used

* `dialogTitle` -  for the widget's title
* `searchPlaceholder` - for the search field placeholder


