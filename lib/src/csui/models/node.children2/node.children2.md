# NodeChildren2Collection

Loads children of a CS node container using the V2 REST API. When creating
a new instance, you need to pass an instance of the `[NodeModel](node.model.md)
to the constructor to specify the parent node.

### Examples

```
// Fetch children of a concrete node and print their count on the console
var connector = new Connector({
      connection: {
        url: '//server/instance/cs/api/v1',
        supportPath: '/instancesupport'
      }
    }),
    parent = new NodeModel({
      id: 12345
    }, {
      connector: connector
    }),
    children = new NodeChildren2ollection(undefined, {
      node: parent
    });
children.fetch()
        .done(function () {
          console.log(children.length);
        });
```

### See Also

[Node Model](node.model.md),
[Browsable Interface](../browsable/browsable.md)
