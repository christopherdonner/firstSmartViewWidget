# FetchableMixin

Makes the calls to the `fetch` method more robust by:

* preventing multiple server calls when the `fetch` is called quickly
  one call after another
* setting the `reset` option automatically to optimize collections
  loading (if requested)
* checking, if the model has already been fetched and ensuring, that
  a model has always been fetched before it is used

## Remarks

This mixin overrides the `fetch` method and calls the original
implementation from it.  If you supply your own custom implementation
of this method, or use another mixin which overrides it, you should apply
this mixin after yours.

When the `fetch` method is called and the previous call has not ended yet, **the new call
will not be made**.  The promise returned by the previous call will be returned instead.
If you specified different options than for the previous call, they will not be reflected.

### How to apply the mixin to a collection

```
var MyCollection = Backbone.Collection.extend({

  constructor: function MyCollection(models, options) {
    Backbone.Collection.prototype.constructor.apply(this, arguments);
    this
      .makeConnectable(options)
      .makeFetchable(options);
  }
  
});

ConnectableMixin.mixin(MyCollection.prototype);
FetchableMixin.mixin(MyCollection.prototype);
```

This mixin us usually combined together with the `ConnectableMixin`
or with another cumulated mixin which includes it.

### How use the mixin

```
// Set the `reset` option for the future `fetch` calls automatically
var collection = new MyCollection(undefined, {
      connector: connector,
      autoreset: true
    });
collection.fetch();

// Ensure that the collection has been fetched and process it (I)
collection
  .ensureFetched()
  .done(function () {
    ...
  });
```

## makeFetchable(options) : this

Must be called in the constructor to initialize the mixin functionality.
Expects the Backbone.Model or Backbone.Collection constructor options passed in.

Recognized option properies:

autoreset
: If set to `true`, the `reset` option for the future `fetch` calls will be set to `true`
  automatically, unless this option is not set by the caller (boolean, `undefined` by default)

## fetching

Can be checked to test whether the model or collection is currently being fetched.
When fetching is in progress, it contains the promise returned by the most recent
`fetch` call.  When no fetching is in proress it is `false`. (promise or boolean,
read-only)

## fetched

Can be checked to test whether the most recent `fetch` call has succeeded or not
on this model or collection; it is set to `true` on the first occurrence 
and never changed afterwards (boolean, read-only)

## error

Contains an error if the most recent `fetch` call failed.  It is `undefined`
if the most recent `fetch` call succeeded (Error, read-only)

## ensureFetched(options) : promise

Returns a promise resolved as soon as the model is fetched.  It fetches the model,
if it has not been fetched yet, or it returns immediately, when the model has already
been fetched.

## See Also

`ConnectableMixin`, `ResourceMixin`
