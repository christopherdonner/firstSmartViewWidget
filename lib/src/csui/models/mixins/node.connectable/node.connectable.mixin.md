# NodeConnectableMixin

Provides support for the server connection via a node, represented by `NodeModel`,
its descendant or by other class with the `ConnectableMixin` applied.

Many resources are associated with a node, which can be a parent, for example, or
in other relation.  The node provides the `Connector` to update the target model
or collection and its identifier usually takes part in the resource URL.

## Remarks

This mixin overrides the `_prepareModel` method and calls the original
implementation afterwards.  If you supply your own custom implementation
of this method, or use another mixin which overrides it, you should apply
this mixin after yours.

### How to apply the mixin to a model

```
var MyCollection = Backbone.Collection.extend({

  constructor: function MyCollection(models, options) {
    Backbone.Collection.prototype.constructor.apply(this, arguments);
    this.makeNodeConnectable(options);
  },

  url: function () {
    return Url.combine(this.node.urlBase(), 'mysubresources');
  }
  
});

NodeConnectableMixin.mixin(MyCollection.prototype);
```

### How use the mixin

```
// Specify the connector when creating the model
var connector = new Connector(...),
    node = new NodeModel({id: 2000}, {connector: connector}),
    collection = new MyCollection(undefined, {node: node});
collection.fetch();
```

## makeNodeConnectable(options) : this

Must be called in the constructor to initialize the mixin functionality.
Expects the Backbone.Model or Backbone.Collection constructor options passed in.

Recognized option properies:

node
: The `NodeModel` instance to use (object, mandatory)

## node

The `NodeModel` instance assigned to this model or collection in the constructor
(object, read-only)

## connector

The `Connector` instance assigned to this model or collection via the related node
(object, read-only)

## See Also

`NodeResourceMixin`, `NodeModel`
