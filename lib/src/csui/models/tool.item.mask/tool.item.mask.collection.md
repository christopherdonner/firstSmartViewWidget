ToolItemMaskCollection
======================

Lists all registered tool item masks. The models are initialized with the `id`
attribute pointing to the module name, which provides the tool item mask
and accepts Require.js configuration to populate the mask.

```javascript
var toolItemMasks = new ToolItemMaskCollection();
toolItemMasks.each(function (mask) {
  console.log(mask.id);
});
```

The collection is populated by Require.js configuration from the extension
configuratoin (`prefix-extension.json` files).

```json
{
  "csuic/models/tool.item.mask/tool.item.mask.collection": {
    "masks": {
      "csui": [
        "csui/widgets/nodestable/toolbaritems.masks",
        "csui/widgets/nodestable/headermenuitems.mask"
      ],
      "conws": [
        "conws/widgets/related.workspaces/toolbaritems.masks"
      ]
    }
  }
}
```
