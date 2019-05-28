# SimpleTreeListItemView (controls/listitem/simpletreelistitem.view)

  Shows a SimpleTreeListItemView. The SimpleTreeListItemView provides a simple 2-level tree list 
  structure: a root node and leaf items. Root node comprises an icon, text and a dropdown icon 
  that when clicked will expand or collapse the sub-tree view. Leaf item comprises an icon 
  and a text. Leaf item has the defaultAction support.

  The SimpleTreeListItemView can be used as child view in [ListView](#), SimpleTreeListView, or 
  any collection/composite view.

### Example

      var childrenCollection = new Backbone.Collection([
        {id: 11112, name: "Tree List Item 1 Folder", type: 0},
        {id: 11113, name: "Tree List Item 2.pdf", type: 144, mime_type: "application/pdf"},
        {id: 11114, name: "Tree List Item 4.doc", type: 144, mime_type: "application/msword"}
      ]);
      var connection = {
        url: "//server/otcs/cs/api/v1",
        supportPath: "/otcssupport"
      };
      var connector = new Connector({connection: connection});
      var i;
      for (i = 0; i < childrenCollection.length; i++) {
        childrenCollection.models[i].connector = connector;
      }
      var treeModel = new Backbone.Model({
        id: 11111,
        icon: 'mime_fav_group32',
        name: "Tree List with icon"
      });
      treeModel.childrenCollection = childrenCollection;

      var view = new SimpleTreeListItemView({model: treeModel});
      view.on("childview:click:item", function () { alert('click:item raised')});
      view.render();

## Constructor Summary

### constructor(options)

  Creates a new SimpleTreeListItemView.

#### Parameters:
* `options` - *Object* The view's options object.
* `options.model` - *Backbone.Model* to evaluate a dynamic binding. This is the tree root node.
The options.model[i].childrenCollection is for the tree leaf items. 

#### Returns:

  The newly created object instance.

#### Example:

  See the [SimpleTreeListItemView](#) object for an example.

## Events Summary

## childview:click:tree:header(event)

The event is fired when the tree node is clicked on.

## childview:click:item(event)

The event is fired when a tree leaf item is clicked on.

### Parameters
* `event` - *Object* The event object
