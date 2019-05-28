# SearchBoxView (csui/widgets/search.box)

Shows a text-box to enter a simple full-text search query.

A control waiting for the search query to be set and executing it is expected
to be placed on the page, otherwise there would be no effect.

### Example

```javascript
var queryRegion = new Marionette.Region({el: '#query'}),
    resultsRegion = new Marionette.Region({el: '#results'}),
    pageContext = new PageContext(),
    searchBoxView = new SearchBoxView({context: pageContext}),
    searchResultsView = new SearchResultsView({context: pageContext});

queryRegion.show(searchBoxView);
resultsRegion.show(searchResultsView);
```
