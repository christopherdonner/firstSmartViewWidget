FileUploadHelper
================

Performs upload of a file to CS.  Client specifies where to upload, what file
to upload and what metadata to assign to the new document.  The helper
supplies the complete user interface: correct subtype computation, name
conflict resolution, required metadada enquiry and status messages.

How to require FileUploadHelper
-------------------------------

```javascript
require(['csui/controls/fileupload/fileupload'
], function (fileUploadHelper) {
  // Use fileUploadHelper
});
```

How to use FileUploadHelper
---------------------------

The `fileUploadHelper` object is a static object. It exposes a single method:
`newUpload`.  It returns an instance of an uploading controller, which allows
adding one or more files to the upload queue.  The upload takes place as soon
as possible.

Upload a single file:

```javascript
  var container = ..., // NodeModel
      file = ...,     // File
      fileUploadController = fileUploadHelper.newUpload({
        container: container
      });
  fileUploadController.addFilesToUpload([file]);
````

Upload multiple files:

```javascript
  var container = ..., // NodeModel
      file1 = ...,     // File
      file2 = ...,     // File
      fileUploadController = fileUploadHelper.newUpload({
        container: container
      });
  fileUploadController.addFilesToUpload([file1, file2]);
````

Upload a single file with a different name or upload a `Blob`,
which does not have the `name` property:

```javascript
  var container = ..., // NodeModel
      file = ...,      // Blob or File
      fileUploadController = fileUploadHelper.newUpload({
        container: container
      });
  fileUploadController.addFilesToUpload([
    {
      newName: 'new file.txt',
      file: file
  ]);
````

Upload a file with required category attributes:

```javascript
  var container = ..., // NodeModel
      file = ...,      // File
      fileUploadController = fileUploadHelper.newUpload({
        container: container
      });
  fileUploadController.addFilesToUpload([
    {
      file: file,
      data: {
        roles: {
          categories: {
            '2003': {
              '2003_1': 12,
              '2003_2': 'male'
            } 
          }
        }
      }
    }
  ]);
````

Upload a file and once it succeeds, add the new document to a node collection,
which lets it displayed in a collection view:

```javascript
  var container = ..., // NodeModel
      children = ...,  // NodeCollection
      file = ...,      // File
      fileUploadController = fileUploadHelper.newUpload({
        container: container,
        collection: children
      });
  fileUploadController.addFilesToUpload([file]);
````

Wait, until all files have been processed:

```javascript
  var container = ..., // NodeModel
      children = ...,  // NodeCollection
      files = [...],      // Array of Files
      fileUploadController = fileUploadHelper.newUpload({
        container: container
      });
  fileUploadController.addFilesToUpload(files);
  $.whenAll(fileUploadController.uploadFiles.invoke('promise'))
   .always(function () {
     // All files were processed
   });
````
