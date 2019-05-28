# Add Command

**Module: csui/utils/commands**

Will launch dialogs, either for uploading files, adding short-cuts, or adding URLs. When uploading files,
a 'new:file' event is triggered off the provided parent collection for every successful file upload.


### Examples

```
// Launch file upload dialog
var status = {
   container: collection.node,
   collection: collection,
   }

var options = {
    multiple: true,
    addableType: [144]  //type for adding documents
   }

var addCommand = commands.findWhere({
        signature: 'Add'
      });

addCommand.execute(status, options);

```

---
## AddCommand.execute(status, options)

Processes an add command for URL, Short-cut, Documents, and Folder.
  When adding documents, a reference to a fileUpload object is returned, allowing one to monitor upload status.

#### Status

container
: Container whose connection parameter is used to set upload file connections.
(node model)

collection
: Container collection that will be updated with newly added files. Each successfully
uploaded file will trigger an 'add' and 'new:file' event off the collection. (node collection)

#### Options

addableType
:  server file type identifying whether a new folder [0], short-cut [1], URL [140] or document [144] is to be added.


```
