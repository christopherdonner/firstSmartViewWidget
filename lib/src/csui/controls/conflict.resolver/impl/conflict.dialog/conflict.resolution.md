# NodePicker

**Module: csui/controls/conflict.resolver/impl/conflict.dialog/conflict.dialog**

Queries server on given files to see if there are any naming conflicts. If there are, and option "resolve = true" ,
a dialog to resolve conflicts will be presented. If option "resolve = false", then the options file array is updated,
with each file given a new parameter 'conflict = true/false';

### Examples

```
//Check for naming conflicts on newly added files. If conflicts exist then resolve them.
 var conflictResolver = new ConflictResolver({files: files, resolve: true});
     conflictResolver.run()
        .done(_.bind(uploadFiles, this))
        .fail(_.bind(this.close, this));

 //Deferred returns an updated array of files to perform an upload on. The file list will either be the entire
 //selected list resolved of any conflicts, or a subset of files resolved of conflicts.
 function uploadFiles(files, conflicts){}
 function close(files){}
```

---
## FileNameQuery(options)

Creates a new instance.

#### Options

***files***
: Array of files. Each file must have its name as a model attribute, or direct parameter.
  (i.e. file.get('name') or file.name)

***resolve***
: Boolean value indicating if naming conflicts are to be resolved or conflict information returned.

---
## run()

Runs query to see if there are any naming conflicts. If there are and 'resolve = true', then a dialog
is presented to resolve conflicts. If 'resolve = false', the files in the 'files' option are updated with a
boolean 'conflict' parameter indicating if a conflict exists or not.

### Returns

Promise, completed when naming query is complete or conflicts are all resolved.


```
