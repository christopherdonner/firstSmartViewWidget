# ResourceMixin

Helps implementing a model for a typical server resource, which has an identifier
(the property 'id' by default), by combining the following three mixins:
`ConnectableMixin`, `FetchableMixin` and `AutoFetchableMixin`.

### How to apply the mixin to a model

```
var MyModel = Backbone.Model.extend({

  constructor: function MyModel(attributes, options) {
    Backbone.Model.prototype.constructor.apply(this, arguments);
    this.makeResource(options);
  },

  urlRoot: function () {
    return Url.combine(this.connector.connection.url, 'myresources');
  }
  
});

ResourceMixin.mixin(MyModel.prototype);
```

## Remarks

The included `FetchableMixin` overrides the `fetch` method and calls the original
implementation from it.  If you supply your own custom implementation of this method,
or use another mixin which overrides it, you should apply this mixin after yours.

### How use the mixin

Specify the model attributes, the connector and fetch the model:

```
// Specify the attributes and the connector when creating the model
var connector = new Connector(...),
    model = new MyModel({
      id: 2000
    }, {
      connector: connector
    });
model.fetch();

// Set the attributes and the connector after creating the model
model.set('id', 2000);
connector.assignTo(model);
model.fetch();
```

## makeResource(options) : this

Must be called in the constructor to initialize the mixin functionality.
Expects the Backbone.Model constructor options passed in.

See the `make` methods of `ConnectableMixin`, `FetchableMixin` and
`AutoFetchableMixin` for the properties recognized by this method.

See also the properties and methods exposed by these three mixins to learn
what this convenience mixin provides

## See Also

`ConnectableMixin`, `FetchableMixin`, `AutoFetchableMixin`
