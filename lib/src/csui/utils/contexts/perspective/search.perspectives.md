# SearchPerspectives

Provides a search results perspectivenode, based on the search query
attributes, like saved query_id.  The client-side perspectives are
modules returning the JSON perspective definition.

The module `csui/utils/contexts/perspective/search.perspectives` exports a
Backbone.Collection instance with *rules how to choose* the search perspective
and a lookup method `findByQuery`, which expect a query model to perform the
perspective lookup with.  When the perspective is looked up, the rules are
processed in a sequence and the first matching rule decides the perspective.

## Find the perspective for a specific search query

### findByQuery(query) : model

Returns a Backboone.Model with attributes providing the search perspective.
The `module` attribute points to the module with the perspective
definition and should be loaded by `require`.

### Example:

```
define(['require', 'csui/utils/search.perspectives'
], function (require, searchPerspectives) {

  var query = ...,
      perspective = searchPerspectives.findByQuery(query);
  return require([perspective.get('module')], function (perspective) {
    var model = new Backbone.Model({perspective: perspective});
    ...
  }, function (error) {
    ModalAlert.showError(error.toString());
  });

});
```

## Register a search perspective

The search perspective registration is performed by adding a new rule
pointing to the perspective module.  The rule is an object literal with
properties:

### Rule properties

####module
The require.js module returning the JSON perspective definition (string or 
  function, mandatory; if a function is specified, it should be called with
  the node model to get the actual value )

####sequence
Weight of the rule to put it to a sequence with the others; rules with lower
  sequence numbers are processed earlier than rules with higher numbers
  (integer, 100 by default)

    100:   usual checking rules
    10000: unrecognized search query rule

####<operation(s)>
One or multiple operation names with parameters.  If at least one operation
  returns `true` and none returns `false`, the rule applies and is returned.
  If no operation is provided, the rule always applies and it will depend on
  its sequence if it would or would not be processed.
  (the value type depends on the operation)

### Rule operations

####equals
Compares a query property with one or more values by the `==` operator and
  returns true, if at least one value comparison is `true`.  If multiple
  properties are specified, each one will be processed and all of them must
  return `true`.

    // Choose a specific saved query
    equals: {query_id: 123}

####decides
Executes a custom method and if it returns `true`, the rule will apply.

    // Choose a specific saved query
    decides: function (query) {
      return query.get('query_is') === 123;
    }

### Examples

Register custom perspective by creating a module exporting its reference:

```
define(function () {

  return [
    {
      equals: {query_id: 123},
      module: 'json!conws/utils/perspectives/custom.search.json'
    }
  ];

});
```

Modules with perspectives have to be registered as extensions of the
`csui/utils/contexts/perspective/search.perspectives` module in the product
extension file.  For example, the module above is packaged as
`conws/utils/search.perspectives` and the `conws-extensions.json` file refers
to it:

```json
{
  "csui/utils/contexts/perspective/search.perspectives": {
    "extensions": {
      "conws": [
        "conws/utils/search.perspectives"
      ]
    }
  }
}
```
