# NodeModel

Provides read/write access to CS nodes.  When creating a new instance, you
need to pass an instance of the `Connector` to the constructor to connect it
to the server.

Nodes can be fetched single or within a collection like container children,
for example.  The `NodeModel` supports initialization from the server
responses, which have the same response format as the core CS REST API.
finishes.

### Examples

```
// Fetch a concrete node and print its name on the console
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
node.fetch()
    .done(function () {
      console.log(node.get('name'));
    });

// Create a model for the Enterprise Volume by its subtype
var enterpriseVolume = new NodeModel({
      id: 'volume',
      type: 141
    }, {
      connector: connector
    });
```
