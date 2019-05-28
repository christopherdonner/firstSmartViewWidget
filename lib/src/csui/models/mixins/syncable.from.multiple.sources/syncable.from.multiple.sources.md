# SyncableFromMultipleSourcesMixin

Simplifies implementing models and collections, which have to be fetched
by issuing multiple asynchronous calls. Either by executing multiple `$.ajax`
statements, or by feching multiple models or collections and merging their
content.

### How to apply the mixin to a model

```javascript
var MyModel = Backbone.Model.extend({

  constructor: function MyModel(attributes, options) {
    Backbone.Model.prototype.constructor.apply(this, arguments);
    this.makeSyncableFromMultipleSources(options);
  },

  sync: function (method, model, options) {
    return this.syncFromMultipleSources(
      [...promises], this._mergeSources,
      this._convertError, options);
  },

  _mergeSources: function (...results) {
    return merged response;
  },

  _convertError: function (result) {
    return {
      status: ...,
      statusText: '...',
      responseJSON: ...
    };
  }
  
});

SyncableFromMultipleSources.mixin(MyModel.prototype);
```

### How to combine multiple `$.ajax` calls

```javascript
  sync: function (method, model, options) {
    var first = $.ajax(this.connector.extendAjaxOptions({
                   url: '...'
                 })
                 .then(function (response) {
                   return response;
                 }),
        second = $.ajax(this.connector.extendAjaxOptions({
                    url: '...'
                  })
                  .then(function (response) {
                    return response;
                  });
    return this.syncFromMultipleSources(
        [first, second], this._mergeSources, options);
  },

  _mergeSources: function (first, second) {
    return merged response to be parsed;
  }
```

### How to combine multiple model/collection fetches

```javascript
  sync: function (method, model, options) {
    var first = new FirstModel(...),
        second = new SecondCollection(...);
    first = first.fetch(options)
                 .then(function () {
                   return first.toJSON()
                 }),
    second = second.fetch(options)
                   .then(function () {
                     return second.toJSON()
                   }),
    options.parse = false;
    return this.syncFromMultipleSources(
        [first, second], this._mergeSources, options);
  },

  _mergeSources: function (first, second) {
    return already parsed merged response;
  }
```

## makeSyncableFromMultipleSources(options) : this

Must be called in the constructor to initialize the mixin functionality.
Expects the Backbone.Model or Backbone.Collection constructor options passed in.

## syncFromMultipleSources(promises, mergeSources, convertError, options) : promise

Implements the interface (events, callbacks and promise) of `Backbone.sync`
by waiting on the source promises and by resolving the target promise with
the merged response returned by the caller's callback, which receives results
of the source promises to merge them.

If one of the source promises fails, the rejected result will be passed
to `convertError`, which is an optional parameter. (A function expecting
rejected result from $.ajax will be used by default.) If specified, it
has to return an object simulating the jQuery AJAX object:

```javascript
    {
      statusText: '...',
      responseJSON: {...}
    }
```
