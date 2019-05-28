# RulesMatchingMixin

Helps implementing a collection of rule models. which are supposed to select
one model, which rules match the input object. For example, choose an icon
or the default click-action for a particular node.

### How to apply the mixin to a model

```javascript
var NodeActionSelectingModel = Backbone.Model.extend({

  idAttribute: 'signature',

  defaults: {
    sequence: 100,
    signature: null
  },

  constructor: function NodeActionSelectingModel(attributes, options) {
    Backbone.Model.prototype.constructor.apply(this, arguments);
    this.makeRulesMatching(options);
  },

  enabled: function (node) {
    return this.matchRules(node, this.attributes);
  }
  
});

RulesMatchingMixin.mixin(NodeActionSelectingModel.prototype);

var NodeActionSelectingCollection = Backbone.Collection.extend({

  model: NodeActionSelectingModel,

  comparator: 'sequence',

  constructor: function NodeActionSelectingCollection(models, options) {
    Backbone.Collection.prototype.constructor.apply(this, arguments);
  },

  findByNode: function (node) {
    return this.find(function (model) {
      return model.enabled(node);
    });
  }
  
});
```

### How use the mixin

Populate a collection of rule models. Whenever you need to find, which rule
models matches the object of the selection, use the method exposed for this:

```javascript
var nodeActions = new NodeActionSelectingCollection([
  {
    equals: {
      container: true
    },
    signature: 'Browse'
  },
  {
    equals: {
      type: [144, 749]
    },
    signature: 'Open'
  },
  {
    and: [
      equals: {
        type: 144
      },
      containsNoCase: {
        mime_type: [
          "application/msword",
          "application/vnd.ms-word",
          "application/vnd.msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "application/vnd.wordprocessing-openxml",
          "application/vnd.ces-quickword",
          "application/vnd.ms-word.document.macroEnabled.12",
          "application/vnd.ms-word.document.12",
          "application/mspowerpoint",
          "application/vnd.ms-powerpoint",
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          "application/vnd.ces-quickpoint",
          "application/vnd.presentation-openxml",
          "application/vnd.presentation-openxmlm",
          "application/vnd.ms-powerpoint.presentation.macroEnabled.12",
          "application/msexcel",
          "application/vnd.ms-excel",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ces-quicksheet",
          "application/vnd.spreadsheet-openxml",
          "application/vnd.ms-excel.sheet.macroEnabled.12",
        ]
      }
    },
    signature: 'Edit',
    sequence: 50
  },
  {
    and: {
      equals: {
        type: 144
      },
      or: {
        startsWithNoCase: {
          mime_type: 'image/'
        },
        equalsNoCase: {
          mime_type: ['application/pdf', 'application/x-pdf']
        }
      }
    },
    signature: 'Convert',
    sequence: 50
  },
  {
    and: [
      {
        equals: {
          type: 144
        }
      },
      {
        equalsNoCase: {
          mime_type: 'text/plain'
        }
      }
    ],
    signature: 'Read',
    sequence: 50
  },
  {
    signature: 'Properties',
    sequence: 200
  }
]);

var node = new NodeModel(...),
    action = nodeActions.findByNode(node);
```

## makeRulesMatching(options) : this

Must be called in the constructor to initialize the mixin functionality.
Expects the Backbone.Model constructor options passed in.

## Conditions

Conditions from `equals` to `includes` below are case-sensitive, if their
operands are strings. They have their case-insensitive couterparts ending
with "NoCase". For example, `equalsNoCase` or `includesNoCase`. 

*equals* - the value of the selected property has to equal at least one
of the specified values. Strings comparisons are case-insensitive.

*contains* - the value of the selected property has to be a part of at least
one of the specified values. String case-insensitive "indexOf" operation is
applied.

*startsWith* - the value of the selected property has to be at the beginning
of at least one of the specified values. String case-insensitive "startsWith"
operation is applied.

*endsWith* - the value of the selected property has to be at the end of
at least one of the specified values. String case-insensitive "endsWith"
operation is applied.

*matches* - the regular expression has to match at least one of the specified
values. The operation is case-insensitive.

*includes* - if the value of the selected property is an object, it has to
include at least one the specified keys; if the value of the selected property
is an array, it has to include at least one the specified items. The standard
equal operator is applied when comparing keys and items.

*has* - at least one of the specified properties must exist and not be null.

*decides* - the function has to return `true` at least for one of the
specified values.

*or* - at least one of the sub-conditions in the arry or object has to return
`true`.

*all* - all of the sub-conditions in the arry or object has to return `true`.

*not* - negates the result of the sub-condition.

## Properties

Conditions are performed on properties of the scenario-controlling object -
on attributes of the controlling model. Property name is the key in the
object, which is the value of the operation: 

```javascript
{
  equals: {
    type: 144
  },
  signature: 'Open'
}

```

The key can be a dot-separated expression, which would evaluate like when
a nested object is accessed in JavaScript:

```javascript
{
  equals: {
    'id_expand.type': 5574
  },
  signature: 'OpenWikiPageVersion'
}

```

The object passed to `matchRules` can be either an object literal,
which will become the direct source of the properties to test,
or a `Backbone.Model` instance, which `aatributes` will be used of.
