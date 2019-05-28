SmartNodeCollection
===================

Determines, if a node supports opening in Smart UI. It means, that it supplies
a perspective, which allows reasobale usage without switching to Classic UI.
This perspective will be opened, when the user opens the node by clicking on a
link on an external page or in an email, or by clicking on a link within Smart
UI, when there is no explicit defautl action assigned to the node type.

Enabling a Node for Smart UI
----------------------------

One or more nodes can be specified by one or more matching rules in a RequireJS
module.

```javascript
define(function () {
  'use strict';

  return [
    // Wiki Page
    {
      equals: {type: [5574, 5573]}
    },
    ...
  ];
});
```

RequireJS modules with one or more rules are registered in the component
extensions JSON file for the extension point
"csui/utils/smart.nodes/smart.nodes".

```json
{
  "csui/utils/smart.nodes/smart.nodes": {
    "extensions": {
      "sample": [
        "sample/utils/sample.smart.nodes"
      ]
    }
  },
  ...
}
```

Usage Examples
--------------

Check, if the node supplies a reasonable perspective for Smart UI and thus
it makes sense to show a link to the "/app/:nodes/:id" page.

```javascript
var node = ...;
if (smartNodes.isSupported(node)) {
  ...
}
```
