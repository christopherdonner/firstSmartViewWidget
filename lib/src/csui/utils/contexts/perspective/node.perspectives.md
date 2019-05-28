# NodePerspectives

Provides a perspective for a node, based on the node attributes, like type.
This perspective should be used if the server does not return any perspective
or to override the server perspective, if it is incorrect.  The client-side
perspectives are modules returning the JSON perspective definition.

The module `csui/utils/contexts/perspective/node.perspectives` exports a
Backbone.Collection instance with *rules how to choose* the node perspective
and a lookup method `findByNode`, which expect a node model to perform the
perspective lookup with.  When the perspective is looked up, the rules are
processed in a sequence and the first matching rule decides the perspective.

## Find the perspective for a specific node

### findByNode(node) : model

Returns a Backboone.Model with attributes providing the node perspective.
The `module` attribute points to the module with the perspective
definition and should be loaded by `require`.

### Example:

```
define(['require', 'csui/utils/node.perspectives'
], function (require, nodePerspectives) {

  var node = ...,
      perspective = nodePerspectives.findByNode(node);
  return require([perspective.get('module')], function (perspective) {
    node.set('perspective', perspective);
    ...
  }, function (error) {
    ModalAlert.showError(error.toString());
  });

});
```

## Register a node perspective

The node perspective registration is performed by adding a new rule
pointing to the perspective module.  The rule is an object literal with
properties:

### Rule properties

####module
The require.js module returning the JSON perspective definition (string or 
  function, mandatory; if a function is specified, it should be called with
  the node model to get the actual value )

####important
If the perspective should be preferred to the one returned by the server
  (boolean, optional; false by default) - this is needed for overriding
  container browsing perspectives, which are returned by the server, although
  the respective node is not a container (task, for example)

####sequence
Weight of the rule to put it to a sequence with the others; rules with lower
  sequence numbers are processed earlier than rules with higher numbers
  (integer, 100 by default)

     100:   node type checking rules
     10000: unrecognized node rule

####<operation(s)>
One or multiple operation names with parameters.  If at least one operation
  returns `true` and none returns `false`, the rule applies and is returned.
  If no operation is provided, the rule always applies and it will depend on
  its sequence if it would or would not be processed.
  (the value type depends on the operation)

### Rule operations

####equals
Compares a node property with one or more values by the `==` operator and
  returns true, if at least one value comparison is `true`.  If multiple
  properties are specified, each one will be processed and all of them must
  return `true`.

     // Choose containers
     equals: {container: true}
     // Choose shortcuts and generations
     equals: {type: [1, 2]}

####decides
Executes a custom method and if it returns `true`, the rule will apply.

     // Choose workspaces with a business object
     decides: function (node) {
       return node.get('type') === 848 && node.get('business_object_id') > 0;
     }

### Examples

Register custom perspective by creating a module exporting its reference:

```
define(function () {

  return [
    {
      equals: {type: 848},
      module: 'json!conws/utils/perspectives/workspace.json'
    }
  ];

});
```

Modules with perspectives have to be registered as extensions of the
`csui/utils/contexts/perspective/node.perspectives` module in the product
extension file.  For example, the module above is packaged as
`conws/utils/node.perspectives` and the `conws-extensions.json` file refers
to it:

```json
{
  "csui/utils/contexts/perspective/node.perspectives": {
    "extensions": {
      "conws": [
        "conws/utils/node.perspectives"
      ]
    }
  }
}
```
