# HtmlEditorView (csui/widgets/html.editor/html.editor.view)

  Shows a HTML editor view. HTML editor view allows user to write html in that view.


### Example
```js
var contentRegion = new Marionette.Region({
    el: '#content'
  }),
  pageContext = new PageContext(),
  htmlEditorView = new HtmlEditorView({
    titlefield: 'HTML Widget',
    context: pageContext,
    wikipageid: wikipageid
  });
contentRegion.show(favoritesView);
pageContext.fetch();
```

## Constructor Summary

### constructor(options)

Creates a new HtmlEditorView.

#### Parameters:
* `options` - The view's options object.
* `options.context` - Page context
* `options.wikipageid` - Id of wiki page,
* `options.titlefield` - Optional titlefield for HTML Widget