# MetadataAddItemController (widgets/metadata)

  The 'MetadataAddItemController' allows the adding of item with complete metadata
  that the user can edit and change values of general metadata, categories and other roles.

  By default this controller will show the add item metadata view in a modal dialog.
  To-be-done if needed later: if the caller wants to embed the view in some page, it can pass
  the 'originatingView' object similar to the metadata view.  

### Example

      var metadataAddItemController = new MetadataAddItemController();
      var promise = metadataAddItemController.displayForm(status, options);

## Constructor Summary

### constructor ()

  Creates a new `MetadataAddItemController`.

#### Returns:

  *Object* The newly created object instance.

## Methods

### displayForm (status, options)

  Show the add item metadata view in a modal dialog by default unless the 'orginatingView' is
  passed in to swap the view (this is future work to be added when needed). 
  This method is usually called from the execute() method of the 'command' class that has 'status'
  and 'options' parameters.

#### Parameters:

* `status` - *Object* The command's status object containing the node(s) and container where 
the new object will be created.
* `options` - *Object* The command's options object.

#### Returns:

  A jquery deferred object that the caller code can handle scenario when the add item is 
  done successfully or failed.
