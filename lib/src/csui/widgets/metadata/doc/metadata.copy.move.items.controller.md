# MetadataCopyMoveItemsController (widgets/metadata)

  The 'MetadataCopyMoveItemsController' allows the copying/moving of item(s) with complete metadata
  that the user can edit and change values of general metadata, categories and other roles.

  By default this controller will show the metadata view in a modal dialog.
  To-be-done if needed later: if the caller wants to embed the view in some page, it can pass
  the 'originatingView' object similar to the metadata view.  

### Example

      var metadataCopyMoveItemsController = new MetadataCopyMoveItemsController();
      var promise = metadataCopyMoveItemsController.displayForm(status, options);

## Constructor Summary

### constructor ()

  Creates a new `MetadataCopyMoveItemsController`.

#### Returns:

  *Object* The newly created object instance.

## Methods

### CopyMoveItemsWithMetadata (items, options)

  Call this method always show the metadata view for copying/moving one or multiple items.

#### Parameters:

* `items` - *Object* containing the node(s) to be copied or moved.
* `options` - *Object* options object.

#### Returns:

  A jquery deferred object that the caller code can watch and continue with the process.
  
### CopyMoveItemsRequiredMetadata (items, options)

  Call this method to copy/move one or multiple items.  This method automatically detects whether
  the destination has required attributes and then shows the metadata view for the user to fill 
  in values.  Otherwise, it will resolves the deferred promise so the caller code can just proceed.

#### Parameters:

* `items` - *Object* containing the node(s) to be copied or moved.
* `options` - *Object* options object.

#### Returns:

  A jquery deferred object that the caller code can watch and continue with the process.
