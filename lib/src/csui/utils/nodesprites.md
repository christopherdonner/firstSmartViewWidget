# NodeSprites

Chooses a small icon for nodes displayed in lists and tables.  The icon
represents the type of the node and should fit to the visual theme.  The
icon is identified by a CSS class showing the image in the background.

The module `csui/utils/nodesprites` exports a Backbone.Collection instance
with *rules how to choose* the node icon and additional lookup methods, which
expect a node model to perform the icon lookup with.  When the icon is looked
up, the rules are procesed in a sequence and the first matching rule decides
the icon.

## Find the icon representing a node

### findByNode(node) : model

Returns a Backboone.Model with attributes identifying the node icon.  Only
the `className` attribute is currenly used.

### findClassByNode(node): string

Returns the CSS class identifying the node icon.

### Example:

```
define(['csui/lib/jquery', 'csui/utils/nodesprites'
], function ($, nodeSprites) {

  // Create a HTML element showing the node icon
  function createNodeIcon(node) {
    return $('<span>', {
      'class': nodeSprites.findClassByNode(node),
      'title': node.get('name')
    });
  }

});
```

## Register a new node icon

The new node icon registration is perfomed by adding a new rule selecting the
icon.  The rule is an object literal with properties:

### Rule properties

className
: The CSS class identifying the icon (string or function, mandatory; if a
  function is specified, it should be called with the node model to get the
  actual value )

sequence
: Weight of the rule to put it to a sequence with the others; rules with lower
  sequence numbers are processed earlier than rules with higher numbers
  (integer, 100 by default)

    10:    document MIME-type checking rules
    100:   node type checking rules
    1000:  generic node type checking rules (container, for example)
    10000: unrecognized node rule

<operation(s)>
: One or multiple operation names with parameters.  If at least one operation
  returns `true` and none returns `false`, the rule applies and is returned.
  If no operation is provided, the rule always applies and it will depend on
  its sequence if it would or would not be processed.
  (the value type depends on the operation)

### Rule operations

equals
: Compares a node property with one or more values by the `==` operator and
  returns true, if at least one value comparison is `true`.

    // Choose containers
    equals: {container: true}
    // Choose shortcuts and generations
    equals: {type: [1, 2]}
    // Choose reserved documents
    equals: {type: 144, reserved: true}
    // Choose ZIP archives
    equals: {mime_type: [
      'application/zip',
      'application/x-zip',
      'application/x-zip-compressed'
    ]}

contains
: Checks if a node property handled as a string contains at least one of the
  specified substrings.

    // Choose Microsoft office documents
    contains: {mime_type: 'vnd.openxmlformats-officedocument'}
    // Choose presentations
    contains: {mime_type: ['slideshow', 'powerpoint']}

startsWith
: Checks if a node property handled as a string starts at least with one of
  the specified substrings.

    // Choose images (image/png, image/jpg, ...)
    startsWith: { mime_type: 'image/'}

endsWidth
: Checks if a node property handled as a string ends at least with one of
  the specified substrings.

    // Choose XML documents (application/xml, text/xml, ...)
    endsWith: { mime_type: '/xml'}

matches
: Checks if a node property handled as a string is matched by at least one
  of the specified regular expressions.

    // Choose Microsoft office documents
    contains: {mime_type: 'vnd.openxmlformats-officedocument'}
    // Choose presentations
    contains: {mime_type: ['slideshow', 'powerpoint']}

decides
: Executes a custom method and if it returns `true`, the rule will apply.

    // Choose documents with non-empty content
    decides: function (node) {
      var size = node.get('size');
      if (size === undefined) {
        size = node.get('file_size');
      }
      return size > 0;
    }

### Examples

Add custom icons temporarily by using the `nodeSprites` collection directly:

```
define(['csui/utils/nodesprites'], function (nodeSprites) {

  var customIcons = nodeSprites.add([
        // Show one icon for e=all containers, which are not browsable
        {
          equals: {
            container: true,
            perm_see_contents: false
          },
          className: 'icon-inaccessible',
          sequence: 60
        }
      ]);

  // ... render HTML markup with custom icons

  nodeSprites.remove(customIcons);

});
```

Register custom icons permanently by creating a module exporting them:

```
define(function (nodeSprites) {

  return [
    {
      equals: {type: 848},
      className: function (node) {
        var workspaceType = node.get('workspace_type');
        return workspaceType ? 'conws-icon-workspace' : 'conws-icon-workspace-early';
      }
    },
    {
      equals: {type: 31066},
      className: 'conws-icon-binder'
    }
  ];

});
```

Modules with icons have to be registered as extensions of the
`csui/utils/nodesprites` module in the product extension file.
For example, the module above is packaged as `conws/utils/icons`
and the `conws-extensions.json` file refers to it:

```json
{
  "csui/utils/nodesprites": {
    "extensions": {
      "conws": [
        "conws/utils/icons"
      ]
    }
  }
}
```
