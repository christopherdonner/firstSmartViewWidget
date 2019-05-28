# DocumentOverviewView (widgets/document.overview)

  Shows a Documentoverview view. The Documentoverview view displays a document's details and
  properties. It allows for viewing the contents of the document, opening the document properties
   and opening the container where the document is stored.


### Example


      var contentRegion = new Marionette.Region({el: '#content'}),
          pageContext   = new PageContext(), // holds the model
          currentNode   = pageContext.getModel(NodeModelFactory, {attributes: {id: 11111}});
          documentOverviewView = new DocumentOverviewView({
            context: pageContext,
            model: currentNode
          });

      contentRegion.show(documentOverviewView);
      pageContext.fetch();

## Constructor Summary

### constructor(options)

  Creates a new DocumentOverviewView.

#### Parameters:
* `options` - *Object* The view's options object.
* `options.connection` - *Connection* to authenticate against.
* `options.connection.url` - *String* url to authenticate against.
* `options.connection.supportPath` - *String* support path directory.

#### Returns:

  The newly created object instance.

#### Example:

  See the [DocumentOverviewView](#) object for an example.

## Localizations Summary

The following localization keys are used

* `dialogTitle` -  for the widget's title
* `searchPlaceholder` - for the search field placeholder


