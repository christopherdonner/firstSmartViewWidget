# ClientSideBrowsableMixin

Implements paging, sorting and filtering on the client side using the
collection state of the `BrowsableMixin`.  The `BrowsableMixin` is
included in this mixin and applied too.

The first `fetch` fills an internal buffer at first, then it populates
the collection according to the browsing state properties.  Following
fetches are served from the internal buffer.

Request URL formatting and response parsing is supposed to be added
by other mixins, according to the specifics of the server resource.

### Example

```
var MyCollection = Backbone.Collection.extend({

  constructor: function MyCollection(models, options) {
    Backbone.Collection.prototype.constructor.apply(this, arguments);

    this.makeClientSideBrowsable(options);
  },

  url: function () {
    // format the request URL fetching the complete collection
  },

  parse: function (response, options) {
    // return the response containing the complete collection
  }

});

ClientSideBrowsableMixin.mixin(MyCollection.prototype);
```

## makeClientSideBrowsable(options) : this

Must be called in the constructor to initialize the mixin functionality.
Expects the Backbone.Collection constructor options passed in.  It calls
`makeBrowsable` from `BrowsableMixin` too.

## fetch(options) : promise

Behaves like the original method, just populating the collection from an
internal buffer, filled on the very first fetch, according to the current
browsing state.  If the `reload: true` option is set, the internal buffer
is refreshed by a server call.

A special scenario - continuously fetching the next page - can be implemented
by incrementing the `skipCount` and fetching the items for appending them
to the collection only:

```
collection.setSkip(collection.skipCount + collection.topCount, false);
collection.fetch({
  remove: false,
  merge: false
});
```

If the continuous fetching reached its end should be checked by testing the
collection length, for example:

```
if (collection.length < collection.totalCount) {
  ... // fetch the next page
}
```

The `totalCount` is available first after the very first `fetch` call.

If you want to start fresh from the beginning in the middle of continuous
fetching, change paging, sorting and filtering parameters and force removing
the existing models:

```
collection.setSkip(0, false);
collection.fetch({
  remove: true,
  merge: false
});
```

You could add `reset: true` to optimize UI refresh; instead of multiple `add`
events you would get a single `reset` event.  You would drop the `remove` and
`merge` parameters then, because the collection would be emptied.

## populate(models, options) : promise

Behaves like the `fetch` method, but populates the collection from
an explicit array of objects or models. All models will be pushed
to the internal buffer and the collection will be populated according
to its filtering, sorting and paging parameters.

You could add `reset: true` to optimize UI refresh; instead of multiple `add`
events you would get a single `reset` event.

## add(models, options) : models
## remove(models, options) : models
## reset(models, options) : models
## set(models, options) : models

Behave like original methods, just affecting both the collection
and the internal buffer. The `reset` method can be used to fill
the collection without a server-side `fetch`. Subsequential `fetch`
will use the internal buffer to populate the collection.

A special scenario - emptying the collection, but not the internal buffer -
can be performed by calling `reset` with the `populate` set to `false`.

You could add `reset: true` to optimize UI refresh; instead of multiple `add`
events you would get a single `reset` event.

## compareObjectsForSort(property, left, right) : -1|0|1

Can be overridden to modify the default ordering implementation, which handles
JavaScript primitive values by applying the comparison operators to them.
Strings are compared using grammar rules of the selected locale (i18n).

The `left` and `right` parameters contain `Backbone.Model`s to compare and
the `property` contains the attribute name from the models. The result has to
be implemented according to `strcmp`:

* -1 if left < right
* 1 if left > right
* 0 if left = right

The overridden method can handle only special attributes and can rely on the
original implementation for the rest. For example:

```js
var originalCompare = MyCollection.prototype.compareObjectsForSort;
MyCollection.prototype.compareObjectsForSort = function (property, left, right) {
  if (property === 'name') {
    left = left.get(property);
    right = right.get(property);
    if (left < right) {
      return -1;
    } else if (left > right) {
      return 1;
    }
    return 0;
  }
  return originalCompare.call(this, property, left, right);
};
```

## See Also

`BrowsableMixin`
