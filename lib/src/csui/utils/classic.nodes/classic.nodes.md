ClassicNodeCollection
=====================

Assigns Classic UI page URL to nodes. The assignment is done by matching
conditions in a list rules. The first matching rule will choose the URL.

Specifying a Classic Page for a Node
------------------------------------

Classic Page URLs for one or more nodes can be specified by one or more
matching rules in a RequireJS module.

```javascript
define(function () {
  'use strict';

  return [
    // Discussion
    {
      equals: {type: 215},
      forced: true,
      urlQuery: function (node) {
        return {
          func: 'll',
          objAction: 'view',
          objId: node.get('id'),
          nexturl: location.href
        };
      }
    },
    ...
  ];
});
```

The following properties control the node behaviour:

: forced: true|false
Specifies, if the classic page should be forced to open, when the node
is navigated to in Smart UI.

: urlQuery: string or function
Specifies the URL query of the classic page for the node. The value will be
appended to the server CGI URL.

RequireJS modules with one or more rules are registered in the component
extensions JSON file for the extension point
"csui/utils/classic.nodes/classic.nodes".

```json
{
  "csui/utils/classic.nodes/classic.nodes": {
    "extensions": {
      "sample": [
        "sample/utils/sample.classic.nodes"
      ]
    }
  },
  ...
}
```

Usage Examples
--------------

Render a hyperlink to the classic page for the specified node, if it is
available.

```javascript
var node = ...,
    url  = classicNodes.getUrl(node);
if (url) {
  ...
}
```

Prevent Smart UI from handling a node, if it should be forced to be displayed
in a classic page.

```javascript
var node = ...;
if (classicNodes.isForced(node)) {
  ...
}
```

Get complete information about a node; its classic page URL and if it needs to
be always displaayed by it.

```javascript
var node = ...,
    classic = classicNodes.findByNode(node);
if (classic) {
  // Use classic.url and classic.forced
}
```
