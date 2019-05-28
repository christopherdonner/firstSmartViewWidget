# NodeTypeIconView

Renders an icon of a node, which should be passed to the constructor as the `node` option.

The icon consists of a *main icon* decided mainly by the node `type` and
`mime_type` for documents and by *overlay icons*, which may indicate some
node characteristics.


```javascript
var node = new NodeModel(...),
    region = new Marionette.Region(...),
    iconView = new NodeTypeIconView({node: node});
region.show(iconView);
```
