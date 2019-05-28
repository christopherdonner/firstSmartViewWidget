# MyAssignmentsView (widgets/myassignments)

  Shows a MyAssignmentsView. The MyAssignmentsView provides a list of assignments as given through
  the page context. It allows for filtering on the assignments by opening a search field and 
  entering filter criteria. The assignments are filtered by name and sorted alphabetically 
  ascending. Clicking on a single assignment opens the page's default action for the node behind.
   Clicking on the expanded icon will show the expanded My Assignments view with more columns.


### Example

      var contentRegion = new Marionette.Region({el: '#content'}),
          pageContext = new PageContext(), // holds the model
          assignmentsView = new MyAssignmentsView({context: pageContext});

      contentRegion.show(assignmentsView);
      pageContext.fetch();

## Constructor Summary

### constructor(options)

  Creates a new MyAssignmentsView.

#### Parameters:
* `options` - *Object* The view's options object.
* `options.connection` - *Connection* to authenticate against.
* `options.connection.url` - *String* url to authenticate against.
* `options.connection.supportPath` - *String* support path directory.

#### Returns:

  The newly created object instance.

#### Example:

  See the [MyAssignmentsView](#) object for an example.

## Localizations Summary

The following localization keys are used

* `dialogTitle` -  for the widget's title
* `searchPlaceholder` - for the search field placeholder


