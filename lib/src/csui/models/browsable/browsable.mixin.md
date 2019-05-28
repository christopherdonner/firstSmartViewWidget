# BrowsableMixin

Defines the interface of collection paging, sorting and filtering and
provides an implementation of the collection state supporting them.

Using the browsing state properties to populate the collection is
supposed to be added on your own or provided by other mixins.

### Example

```
var MyCollection = Backbone.Collection.extend({

  constructor: function MyCollection(models, options) {
    Backbone.Collection.prototype.constructor.apply(this, arguments);

    this.makeBrowsable(options);
  }

  // use the browsing properties to maintain the collection content

});

BrowsableMixin.mixin(MyCollection.prototype);
```

## makeBrowsable(options) : this

Must be called in the constructor to initialize the mixin functionality.
Expects the Backbone.Collection constructor options passed in.

## Browsing State Properties

skipCount
: how many items should be skipped from the beginning of the collection;
  zero-based index of the first item (integer, 0 by default)

topCount
: how many items should be fetched from top of the collection, starting
  from the `skipCount`; all the rest of the collection will be returned
  if not specified (integer, undefined by default)

orderBy
: how to sort the fetched items; comma-delimited list of space-delimited
  sort criteria consisting of the property name and an optional
  sort direction, which defaults to ascending: `<name> [asc|desc], ...`
  (string, undefined by default)

filters
: how to filter the fetched items; map of filer criteria with property names
  as keys and filert operands as values (object literal; empty by default)
  name: 'pro', type: [144, 848])

actualSkipCount
: how many items were actually skipped when the server handled the request
  the caller should check this value and optionally correct the `skipCount`
  for future calls (integer, output only, set after fetching)

totalCount
: how many total items are available for paging through (integer, output only,
  set after fetching)

## Browsing State Changing Methods

```
setSkip(skip, fetch)            : boolean
setTop(top, fetch)              : boolean
setLimit(skip, top, fetch)      : boolean
resetLimit(fetch)               : boolean
setOrder(orderBy, fetch)        : boolean
resetOrder(fetch)               : boolean
setFilter(name, value, options) : boolean
clearFilter(fetch)              : boolean
```

Set the browsing state properties to the specified value or reset it to
their default.  The last `fetch` argument makes the collection fetch
automatically if not set to `false` (`true` is the  default).  If the
new browsing state requires calling a `fetch` to update  the collection,
`true` is returned, otherwise `false`.

The `setLimit` with `resetLimit` and `setOrder` with `resetOrder` work
as pairs - the first sets (or overwrites) the current value, the second
resets it to the default one.  The `setFilter` with `clearFilter` work
as a pair - the first sets (adds or overwrites) a property to the filter,
the second clears all filters.  The `options` parameter in `setFilter`
can be either a `boolean` with the meaning of the `fetch` parameter of the
other methods, or an object literal with `fetch` and `clear` properties.
The `clear` property clears the existing filters beforeit sets the new. 

#  Browsing Methods

These methods are supposed to be reused from Backbone, implemented on your
own or by other mixin, like `ClientSideBrowsableMixin`.

## fetch(options) : promise

Populates the collection according to the current browsing state.  If the
`reload: true` option is set, the fresh content is ensured by forcing a
server call, if the method did not need to perform one.

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

## See Also

`ClientSideBrowsableMixin`
