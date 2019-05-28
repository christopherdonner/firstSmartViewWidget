# NodeAutoFetchableMixin

Makes use of the identifier of the related node to:

* check if the model or collection can be fetched; it checks only if the
  related node is fetchable by default 
* fetch the model or collection automatically when the identifier of the
  related node changes (if requested); the default event to listen to is
  'change:id'

### How to apply the mixin to a model

```
var MyCollection = Backbone.Collection.extend({

  constructor: function MyCollection(models, options) {
    Backbone.Collection.prototype.constructor.apply(this, arguments);
    this
      .makeNodeConnectable(options)
      .makeFetchable(options)
      .makeNodeAutoFetchable(options);
  }
  
});

NodeConnectableMixin.mixin(MyCollection.prototype);
FetchableMixin.mixin(MyCollection.prototype);
NodeAutoFetchableMixin.mixin(MyCollection.prototype);
```

This mixin us usually comined together with the `NodeConnectableMixin`
or with another cumulated mixin which includes it and also with the
with the `FetchableMixin` to prevent parallel fetches.  If you need
all these three mixins, have a look at the `NodeResourceMixin`, which
combines these three together.

### How use the mixin

```
// Enable watching for the model identifier changes
var connector = new Connector(...),
    node = new NodeModel({id: 2000}, {connector: connector}),
    collection = new MyCollection(undefined, {
      node: node,
      autofetch: true
    });

// A fetch of the collection will take place, notifying the event
// listeners about its progress
node.set('id', 2000);
```

## makeNodeAutoFetchable(options) : this

Must be called in the constructor to initialize the mixin functionality.
Expects the Backbone.Model constructor options passed in.

Recognized option properies:

autofetch
: If set to `true`, it executes the `fetch` method whenever the node model identifier changes
  (boolean, `undefined` is the default)

autofetchEvent
: Can override the event to listen to on the node model for the automatic fetching
  (string, 'change:id' by default)

## automateFetch(boolean) : void

Truns on or off the automatic fetching depending if you pass `true` or `false` in.
It can be used to change the behaviour set up by the constructor.

## isFetchable() : boolean

Returns `true` if the model or collection is fetchable, otherwise `false`.
It requires the related node not only fetchable, but also having the 'id'
property set.  (While nodes can be fetched using other properties, like
volumes by 'type', for example, other resources related to the node may
not.)  If the model or collection is not fetchable, the automatic fetching
will not take place.

## See Also

`NodeConnectableMixin`, `FetchableMixin`, `NodeResourceMixin`
