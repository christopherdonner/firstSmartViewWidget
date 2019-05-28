# FavoriteStarView (widgets/favorites)

  This view shows the favorite star view that can be inserted anywhere such as a row cell in the
  nodes table row, the table header item name's toolbar, etc.
  If the node model is already favorited, the star will be solid; otherwise, a non-solid star.
  Clicking on the star will un-favorite the node model or show a simple add favorite form.

### Example

      var contentRegion = new Marionette.Region({el: '#content'}),
          pageContext = new PageContext(),
          node = new NodeModel(),  // the CS node model
          favoritesView = new FavoritesView({context: pageContext, model: node});

      contentRegion.show(favoritesView);
      pageContext.fetch();

## Constructor Summary

### constructor(options)

  Creates a new FavoriteStarView.

#### Parameters:

* 'options' - *Object* The view's options object.
* 'options.model' - required. The node model.
* 'options.context' - required. The application context.
* 'options.checkVisible' - optional. True/false to check Add Favorite form visibility and adjust 
its top position.
* 'options.formPopoverPlacement' - optional. Values are: 'left' or 'right'. The default is placing 
the form popover on the left of the star.
* 'options.popoverAtBodyElement' - optional. True/false for popover created and appended to the 
'body' element; The default is false.

#### Returns:

  The newly created object instance.

#### Example:

  See the [FavoriteStarView](#) object for an example.
