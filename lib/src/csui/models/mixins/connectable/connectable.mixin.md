# ConnectableMixin

Provides support for the server connection using the `Connector` to update
the target model or collection.

## Remarks

This mixin overrides the `_prepareModel` method and calls the original
implementation afterwards.  If you supply your own custom implementation
of this method, or use another mixin which overrides it, you should apply
this mixin after yours.

### How to apply the mixin to a model

```
var MyModel = Backbone.Model.extend({

  constructor: function MyModel(attributes, options) {
    Backbone.Model.prototype.constructor.apply(this, arguments);
    this.makeConnectable(options);
  },

  url: function () {
    return Url.combine(this.connector.connection.url, 'myresource');
  }
  
});

ConnectableMixin.mixin(MyModel.prototype);
```

### How use the mixin

Specify the connector and fetch the model:

```
// Specify the connector when creating the model
var connector = new Connector(...),
    model = new MyModel(undefined, {connector: connector});
model.fetch();

// Set the connector after creating the model
connector.assignTo(model);
model.fetch();
```

## makeConnectable(options) : this

Must be called in the constructor to initialize the mixin functionality.
Expects the Backbone.Model or Backbone.Collection constructor options passed in.

Recognized option properies:

connector
: The `Connector` instance to use.  If it is not provided, the connector has to
  be assigned at latest before the server is accessed or resource URL is computed.
  (object, `undefined` by default)

## connector

The `Connector` instance assigned to this model or collection (object, read-only)

## See Also

`ResourceMixin`
