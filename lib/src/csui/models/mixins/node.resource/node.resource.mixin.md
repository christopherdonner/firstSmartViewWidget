# NodeResourceMixin

Helps implementing a model or collection for a typical server resource,
which is related to a node (represented by the `NodeModel`, its descendant
or by other class with the `ConnectableMixin` applied), by combining the
following three mixins: `NodeConnectableMixin`, `FetchableMixin` and
`NodeAutoFetchableMixin`.

### How to apply the mixin to a collection

```
var MyCollection = Backbone.Collection.extend({

  constructor: function MyCollection(models, options) {
    Backbone.Collection.prototype.constructor.apply(this, arguments);
    this.makeNodeResource(options);
  },

  urlRoot: function () {
    return Url.combine(this.node.urlBase(), 'mysubresources');
  }
  
});

NodeResourceMixin.mixin(MyCollection.prototype);
```

## Remarks

The included `FetchableMixin` overrides the `fetch` method and calls the original
implementation from it.  If you supply your own custom implementation of this method,
or use another mixin which overrides it, you should apply this mixin after yours.

### How use the mixin

Specify the related node and fetch the collection:

```
// Specify the node attributes when creating the node
var connector = new Connector(...),
    model = new MyModel({
      id: 2000
    }, {
      connector: connector
    }),
    collection = new MyCollection(undefined, {
      node: node
    });
collection.fetch();

// Set the node attributes after creating it
node.set('id', 2000);
collection.fetch();
```

## makeNodeResource(options) : this

Must be called in the constructor to initialize the mixin functionality.
Expects the Backbone.Model constructor options passed in.

See the `make` methods of `NodeConnectableMixin`, `FetchableMixin` and
`NodeAutoFetchableMixin` for the properties recognized by this method.

See also the properties and methods exposed by these three mixins to learn
what this convenience mixin provides

## See Also

`NodeConnectableMixin`, `FetchableMixin`, `NodeAutoFetchableMixin`
