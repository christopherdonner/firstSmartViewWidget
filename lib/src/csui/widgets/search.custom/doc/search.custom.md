# CustomSearchWidgetView (csui/widgets/search.custom)

Shows custom search tile view with configured custom search options of ContentServer.

### Example
```javascript
var customRegion = new Marionette.Region({el: '#customView'}),
    pageContext = new PageContext(),
    customSearchView = new CustomSearchWidgetView({
      context: pageContext,
      savedSearchQueryId: ''
    });

customRegion.show(customSearchView);
pageContext.fetch();
```

#### Parameters:
* `savedSearchQueryId` - *String* Any existing saved search query's object id.