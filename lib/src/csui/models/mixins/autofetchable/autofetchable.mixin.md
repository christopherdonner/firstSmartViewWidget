# AutoFetchableMixin

Makes use of the module identifier to:

* check if the model can be fetched; the default property to check is 'id'
* fetch the model automatically when the identifier changes (if requested);
  the default event to listen to is 'change:id'

### How to apply the mixin to a model

```
var MyModel = Backbone.Model.extend({

  constructor: function MyModel(attributes, options) {
    Backbone.Model.prototype.constructor.apply(this, arguments);
    this
      .makeConnectable(options)
      .makeFetchable(options)
      .makeAutoFetchable(options);
  }
  
});

ConnectableMixin.mixin(MyModel.prototype);
FetchableMixin.mixin(MyModel.prototype);
AutoFetchableMixin.mixin(MyModel.prototype);
```

This mixin us usually comined together with the `ConnectableMixin`
or with another cumulated mixin which includes it and also with the
with the `FetchableMixin` to prevent parallel fetches.  If you need
all these three mixins, have a look at the `ResourceMixin`, which
combines these three together.

### How use the mixin

```
// Enable watching for the model identifier changes
var model = new MyModel(undefined, {
      connector: connector,
      autofetch: true
    });

// A fetch will take place, notifying the event listeners about its progress
model.set('id', 2000);
```

## makeAutoFetchable(options) : this

Must be called in the constructor to initialize the mixin functionality.
Expects the Backbone.Model constructor options passed in.

Recognized option properies:

autofetch
: If set to `true`, it executes the `fetch` method whenever the model identifier changes
  (boolean, `undefined` is the default)

autofetchEvent
: Can override the event to listen to for the automatic fetching (string, 'change:id' by default)

## automateFetch(boolean) : void

Truns on or off the automatic fetching depending if you pass `true` or `false` in.
It can be used to change the behaviour set up by the constructor.

## isFetchable() : boolean

Returns `true` if the model is fetchable, otherwise `false`.  If the model is not fetchable, 
the automatic fetching will not take place.

## See Also

`ConnectableMixin`, `FetchableMixin`, `ResourceMixin`
