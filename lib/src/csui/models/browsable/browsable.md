# Browsable Support for Backbone.Collections

Browsing means paging, sorting and filtering through a collection of items.
These can be large and thus the Backbone.Collection might contain only a part
of it in memory at a time.  The Backbone.View showing the collection is
supposed to use an extended interface to get the right "window" on the
full collection.

Paging can be *discreet*, where the window is limited by a starting item
index and an item count.  The view usually presents a pagination control
to set up the browsing state, dealing either in items or pages - "batches"
of items with the same size.

Paging can also be *continuous*, which starts at the beginning and
continues by loading a specified item count at a time and appending the
items to the growing in-memory collection.  The view usually calls the
next fetch when the scrollbar hits the item threshold, performing an
apparent "infinite scrolling".

The collection browsing support provided by the modules below works like this:

1. Set up the browsing state
2. Listen for the standard Backbone Collection and Model events to get notified
   when the (part of the) collection has been fetched
3. Fetch the collection; the specified part will be placed in the collection
4. Adjust the browsing state and repeat the step 3

This browsing support is based on the standard `fetch` method and the
standard events (`add`, `remove`, `reset`, `sync`).  Depending on the server
capabilities, the fetched items may or may not be up-to-date when the fetch
finishes.  The `reload: true` option can be passed to the `fetch` call if
fresh data are needed and the possible performance penalty is acceptable.

Samples of discreet fetching; if your collection uses concept of pages,
you have to convert them to item indexes for the collection interface:

```
// Fetch the first page of 10 items
collection.setSkip(0, false);
collection.setTop(10, false);
collection.fetch();

// Fetch only the second page of 10 items
collection.setSkip(10, false);
collection.fetch();

// Fetch only another page of 10 items
collection.setSkip(collection.skipCount + 10, false);
collection.fetch();

// Fetch only another page of top items
collection.setSkip(collection.skipCount + collection.topCount, false);
collection.fetch();

// Check if more pages are available for fetching
if (collection.length < collection.totalCount) {
  ...
}

// Reload the collection and start browsing from the beginning
collection.setSkip(0, false);
collection.fetch({reload: true});
```

Samples of continuous fetching:

```
// Fetch the first 10 items
collection.setSkip(0, false);
collection.setTop(10, false);
collection.fetch();

// Fetch and append the second 10 items
collection.setSkip(10, false);
collection.fetch({
  remove: false,
  merge: false
});

// Fetch and append another 10 items
collection.setSkip(collection.skipCount + 10, false);
collection.fetch({
  remove: false,
  merge: false
});

// Fetch and append another top items
collection.setSkip(collection.skipCount + collection.topCount, false);
collection.fetch({
  remove: false,
  merge: false
});

// Check if more items are available for fetching
if (collection.length < collection.totalCount) {
  ...
}

// Reload the collection and start from the first 10 items again
collection.setSkip(0, false);
collection.fetch({reload: true});
```

## Browsing Support Modules

**csui/models/browsable/browsable.mixin**
: extends the interface of Backbone.Collection with properties and methods
  supporting the browsing functionality
  
**csui/models/browsable/client-side.mixin**
: overrides the interface of Backbone.Collection, which can be fetched
  only completely, to support the browsing functionality on the client side

**csui/models/browsable/v1.request.mixin**
: provides serialization of the URL parameters for the browsing functionality
  using the concepts of the `/api/v1/nodes/:id/nodes`

**csui/models/browsable/v1.response.mixin**
: provides deserialization of the collection state and collection items
  using the concepts of the `/api/v1/nodes/:id/nodes`

**csui/models/browsable/v2.response.mixin**
: provides deserialization of the collection state and collection items
  using the concepts of the `/api/v2/members/favorites`

## Examples

Collection of node (container) children returned by `/api/v1/nodes/:id/nodes`,
which supports paging, sorting and filtering:

```
var NodeChildrenCollection = Backbone.Collection.extend(_.defaults({

  model: NodeModel,

  constructor: function NodeChildrenCollection(models, options) {
    Backbone.Collection.prototype.constructor.apply(this, arguments);

    this.makeNodeResource(options)
        .makeBrowsable(options)
        .makeBrowsableV1Request(options)
        .makeBrowsableV1Response(options);
  },

  url: function () {
    var query = this.getBrowsableUrlQuery();
    return Url.combine(this.node.urlBase(),
        query ? '/nodes?' + query : '/nodes');
  },

  parse: function (response, options) {
    this.parseBrowsedState(response, options);
    return response.data;
  }

}, NodeResourceModel(Backbone.Collection)));

BrowsableMixin.mixin(NodeChildrenCollection.prototype);
BrowsableV1RequestMixin.mixin(NodeChildrenCollection.prototype);
BrowsableV1ResponseMixin.mixin(NodeChildrenCollection.prototype);
```

Collection of favourite nodes returned by `/api/v2/members/favorites`,
which does not support paging, sorting and filtering:

```
var FavoritesCollection = Backbone.Collection.extend(_.defaults({

  model: NodeModel,

  constructor: function FavoritesCollection(models, options) {
    Backbone.Collection.prototype.constructor.apply(this, arguments);

    this.makeConnectable(options)
        .makeFetchable(options)
        .makeClientSideBrowsable(options);
  },

  url: function () {
    var url = this.connector.connection.url.replace('/v1', '/v2');
    return Url.combine(url, 'members/favorites');
  },

  parse: function (response, options) {
    return response.results;
  }

}, ConnectableModel(Backbone.Collection), FetchableModel(Backbone.Collection)));

ClientSideBrowsableMixin.mixin(NodeChildrenCollection.prototype);
BrowsableV2ResponseMixin.mixin(NodeChildrenCollection.prototype);
```

Continuous paging through favorites by "batches" of 10 items and
logging the current collection length:

```
var connector = ...,
    favorites = new FavoriteNodeCollection(undefined, {
      connector: connector,
      top: 10
    });

// The top parameter can be set by `favorites.setTop(10, false)` too

favorites
  .fetch()
  .then(fetchNext);

function fetchNext() {
  console.log(favorites.length);
  if (favorites.length < favorites.totalCount) {
    return favorites
      .fetch({
        remove: false,
        merge: false
      })
      .then(fetchNext);
  }
}
```

Loading 10 children from the position 20 in their parent container
and logging the actual collection length:

```
var node = ...,
    children = new NodeChildrenCollection(undefined, {
      node: node,
      skip: 20,
      top: 10
    });

// The skip and top parameters can be set by `children.setSkip(20, false)`
// and `children.setTop(10, false)` too

children
  .fetch()
  .done(function () {
    console.log(children.length);
  });

// Other "window" to the collection can be fetched by adjusting the limit
// using `children.setSkip(..., false)` and `children.setTop(..., false)`
// and repeating the `fetch` call.
```

Getting the most recent 5 documents from a folder, which means filtering
the node (container) children by type including only documents and e-mails,
sorting them by the last modification time in the descending direction (and
by name, ascending if multiple were modified at the same time), limiting
them just to the first 5 and logging their names:

```
var node = ...,
    children = new NodeChildrenCollection(undefined, {
      node: node,
      filter: {
        type: [144, 748]
      },
      orderBy: 'modify_date desc, name'
      top: 5
    });

// The parameters can be set by `setFilter, `setOrder` and `setTop` too

children
  .fetch()
  .done(function () {
    console.log(children.pluck('name').join(', '));
  });

// Another 5 items can be fetched by `fetch({remove: false, merge: false})`.  The
// item count to fetch can be adjusted by `children.setTop(..., false)` before it.
```

## Remarks

Collections extended by either `BrowsableMixin` or `ClientSideBrowsableMixin`
offer the same interface for both discreet and continuous paging.  You can use them
interchangingly without knowing which one you have.

`ClientSideBrowsableMixin` fetches the complete collection to an internal
buffer at first, then it populates the collection according to the browsing
state properties.  Following fetches are served from the internal buffer.
`BrowsableMixin` needs to be supported by the REST API on the server side.
If you need to refresh the collection from the server independently on the
client-side and server-side collection, pass the `reload: true` option to the
`fetch` method.  You usually start from the beginning too, by calling
`setSkip(0, false)` right before the `fetch({reload: true})`.
