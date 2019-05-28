# UploadableMixin

Enables creating and modifying the resource behind a `Backbone.Model`.
Simplifies requests with multi-part content, enables mocking by mockjax
and supports pasing the JSON body as form-encoded parameter "body".
Also introduces the `prepare` method to "massage" request body similarly
to the `parse` method for the response body.

### How to apply the mixin to a model

```
var MyModel = Backbone.Model.extend({
  constructor: function MyModel(attributes, options) {
    Backbone.Model.prototype.constructor.apply(this, arguments);
    this.makeConnectable(options)
        .makeUploadable(options);
  },

  url: function () {
    return Url.combine(this.connector.connection.url, 'myresource')
  }
});

ConnectableMixin.mixin(MyModel.prototype);
UploadableMixin.mixin(MyModel.prototype);
```

This mixin us usually combined together with the `ConnectableMixin`
or with another cumulated mixin which includes it.

### How to use the mixin

It just works whenever you call the `save` method of the model.

## makeUploadable(options) : this

Must be called in the constructor to initialize the mixin functionality.
Expects the Backbone.Model or Backbone.Collection constructor options passed in.

## prepare(data, options) : object

Can be overridden to "massage" the data, which are going to be sent to the
server in the request body. If not overridden, the unchanged input of the
`save` method, or `this.attributes`, will be sent to the server as-is.
The `prepare` method converts model attributes to the request body object,
so that the server accepts it, like the `parse` method converts the response
body object to model attributes, so that the client understands them.

```
// For example, the server sends and receives resource attributes wrapped
// in an object with a `data` property.
var MyModel = Backbone.Model.extend({
  constructor: function MyModel(attributes, options) {
    Backbone.Model.prototype.constructor.apply(this, arguments);
    this.makeUploadable(options);
  },

  prepare: function (data, options) {
    return {data: data};
  },

  parse: function (response, options) {
    return response.data;
  }
});

UploadableMixin.mixin(MyModel.prototype);
```

Calling the `prepare` method can be prevented by setting the `prepare`
option to `false`, similarly to preventing the `parse` method from being
called by setting the `parse` option to `false`.

## See Also

`ConnectableMixin`, `ResourceMixin`

## Motivation

### PATCH Semantics Support

The CS REST API implements neither PUT nor PATCH semantics correctly, which
makes usage of high-level JavaScript frameworks like Backbone impossible.
The resource modification request has to be built in a custom way, so that
it follows the PATCH semantics, but uses the PUT verb.  This mixin allows
usage of the Backbone in the usual way - with patch-mode for modifications.

```javascript
// Rename a concrete node
var connector = new Connector({
      connection: {
        url: '//server/instance/cs/api/v1',
        supportPath: '/instancesupport'
      }
    }),
    node = new NodeModel({
      id: 12345
    }, {
      connector: connector
    });
node.save({
      // properties to change on the server and in the model
      name: 'New name'
    }, {
      patch: true, // send only properties specified above;
                   // not everything from this.attributes
      wait: true   // set the properties to this.attributes
                   // only if and after the request succeeds
    })
    .done(function () {
      console.log('New name:', node.get('name'));
    })
    .fail(function () {
      console.log('Renaming the node failed.',
        'Old name:', node.get('name'));
    });
```

Another missing feature in the CS REST API is returning the created and
modified properties from the POST and PUT responses.  If you need the
model complete after a modification, you need to fetch it again, wasting
a server call:

```javascript
// Rename a concrete node and refresh other properties like `modify_date`
node.save({
      name: 'New name'
    }, {
      patch: true,
      wait: true
    })
    .then(function () {
      return node.fetch();
    })
    .done(function () {
      console.log('New name:', node.get('name'));
    })
    .fail(function () {
      console.log('Renaming the node failed.');
    });
```

### File Upload Support

If the newly created resource needs a raw file content, you can pass the
fields of the file type via options and let the mixin build the right request
payload and set ist content type.

```javascript
// Upload a new document
var connector = new Connector({
      connection: {
        url: '//server/instance/cs/api/v1',
        supportPath: '/instancesupport'
      }
    }),
    node = new NodeModel({
      type: 144
    }, {
      connector: connector
    }),
    file = ...; // a File or Blob object
node.save({
      name: 'New document',
      parent_id: 2000
    }, {
      files: {
        file: file
      }
    })
    .done(function () {
      console.log('New document ID:', node.get('id'));
    })
    .fail(function (request) {
      var error = new base.Error(request);
      console.log('Uploading document failed:', error);
    });
```

Because the CS REST API is not friendly to clients expecting RESTful APIs,
you will need to fetch the newly created node to get all properties,
wasting another server call:

```javascript
// Upload a new document and get all common properties
var node = new NodeModel(undefined, {connector: connector}),
    file = ...; // a File or Blob object
node.save({
      type: 144,
      name: 'New document',
      parent_id: 2000
    }, {
      files: {
        file: file
      }
    })
    .then(function () {
      return node.fetch();
    })
    .done(function () {
      console.log('New document ID:', node.get('id'));
    })
    .fail(function (request) {
      var error = new base.Error(request);
      console.log('Uploading document failed:', error);
    });
```
