# NodeAddableTypeCollection

Loads types of nodes, which can be added to the specified container by the
authenticated user.  When creating a new instance, you need to pass an
instance of the `[NodeModel](node.children.md) to the constructor to specify
the target container.

## AddableTypeModel Attributes

type (integer)
: Subtype number of the node type

type_name (string)
: Displayable name of the node type

## Examples

```
// Fetch node types which can be added to the specific container
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
    addableTypes = new NodeAddableTypeCollection(undefined, {
      node: parent
    });
addableTypes.fetch()
    .done(function () {
      console.log(addableTypes.pluck('type_name'));
    });
```

### See Also

[Node Model](node.model.md),
