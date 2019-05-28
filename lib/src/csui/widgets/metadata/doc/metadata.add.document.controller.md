# MetadataAddDocumentController (widgets/metadata)

  The 'MetadataAddDocumentController' allows the adding of document(s) with complete metadata
  that the user can edit and change values of general metadata, categories and other roles.  It
  detects if the container has enforced empty required category attributes and automatically
  shows the metadata view for the user to enter values.  If the container has no enforced required
  category attributes, the controller will resolve the deferred object so that file upload can
  proceed as normal.

  By default this controller will show the add item metadata view in a modal dialog.
  To-be-done if needed later: if the caller wants to embed the view in some page, it can pass
  the 'originatingView' object similar to the metadata view.  

### Example

      var metadataController = new MetadataAddDocumentController();
      var options = {
        container: container_node,
        addableType: 144
      };
      metadataController.addItemsRequiredMetadata(files, options)
          .done(function () {
            this.addToUpload(files);
          })
          .fail(function () {
            this.close();
          });


## Constructor Summary

### constructor ()

  Creates a new `MetadataAddDocumentController`.

#### Returns:

  *Object* The newly created object instance.

## Methods

### addItemsRequiredMetadata (fileUploadCollection, options)

  If there are required metadata, shows the add item metadata view in a modal dialog by default 
  unless the 'orginatingView' is passed in to swap the view (this is future work to be added when
  needed). 

#### Parameters:

* `fileUploadCollection` - *Object* backbone collection of fileUpload models.
* `options` - *Object* The options object.

#### Returns:

  A jquery deferred object that the caller code can handle after the controller finishes with
  checking for required metadata and setting metadata on the files after the required metadata
  was filled out by the user.
