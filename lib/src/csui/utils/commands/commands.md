# Commands

Commands implement an *action* which can be executed by a *trigger*.
An action can be an operation like deleting a folder, opening a dialog
with document properties etc. The trigger can be a button, a context menu
item etc.

## Writing Commands

Commands should inherit from `CommandModel` to get basic implementation:

```javascript
var SomeCommand = CommandModel.extend({

  defaults: {
    signature:   'SomeCommand',    // stable for the client interface
    name:        'Some Command',   // default for the UI
    command_key: 'some-command',   // server identifier for enabling
    scope:       'single|multiple' // command capabilities
  },

  // Optional; if the command_key and scope is not enough to
  // decide, override this method to apply additional logic
  enabled: function (status) {
    return true | false;
  },

  // Mandatory: Require the necessary modules and return
  // a promise for the command result state
  execute: function (status, options) {
    var deferred = $.Deferred();
    require(['some/module'], function (SomeModuleExport) {
      // ... perform the action and either of the following:
      deferred.resolve() | deferred.reject();
    }, function (error) {
      deferred.reject(error);
    });
    return deferred.promise();
  },

});
```

Commands should follow this best practice:

* Rely on the `command_key` returned by the server to enable/disable the
  command based on the current user's role.
* Declare only minimum dependencies statically; the dependencies for the
  command execution, which can be substantial, should be required dynamically
  in the `execute` method first.
* The `enabled` method has to return the result synchronously; the scenario
  must ensure, that the node or other models needed for the decision have got
  enough data from the first server call.
* Return a promise from the `execute` method which resolves or rejects
  when the command is finished.

### Attributes of a command

signature (string)
: Identifier unique among all commands (mandatory)

command_key (string)
: Permitted action identifier returned by the server to enable/disable the
  command; every input item has to permit it, otherwise the command should
  be disabled (optional; the descendant command should implement its own
  enabling logic if not specified)

If the same command is represented by multiple identifiers, this attribute
can be an array.  The v2 identifier should be the first then, because the
v2 URLs can include the action identifiers as query parameters.

name (string)
: Label to show in the UI by default (optional; the trigger would have
  to rely on its own label if not provided)

scope (string)
: How many items can be handled by the command: `single|multiple` (optional; 
  the descendant command should handle none, single and multiple items by
  its own enabling logic if not specified)

### Methods of a command

enabled(status, options) : boolean
: Returns `true` if this command should be enabled (optional; the default
  implementation is based on the `scope` and `command_key` attributes)

execute(status, options) : promise
: Executes the command end returns a promise to watch for the command (mandatory)

### Examples

Unreserves documents:

```javascript
var UnreserveCommand = CommandModel.extend({

  defaults: {
    signature: 'UnreserveDocuments',
    name: 'Unreserve',
    // Command enabling can be based on the permitted
    // command_key returned by the server and command
    // scope; v1 resources return 'UnreserveDoc'
    command_key: ['unreserve', 'UnreserveDoc'],
    scope: 'multiple'
  },

  execute: function (status, options) {
    // Get the node selection to process
    var nodes = CommandHelper.getAtleastOneNode(status);
    // Unreserve every node and gather promises for the results
    var promises = nodes.map(function (node) {
      return node.save({reserved_user_id: null}, {wait: true});
    });
    // Return a promise for all files having been processed
    return $.when.apply($, promises);
  },

});
```

Scans documents and uploads them as new files into a container:

```javascript
var ScanHereCommand = CommandModel.extend({

  defaults: {
    signature: 'ScanHere',
    name: 'Scan Here'
    // No attributes to specify scope or command_key; this
    // command does not apply to a selection and has no permitted
    // action assigned for enabling/disabling
  },

  enabled: function (status) {
    // Enable the command if the scenario provides a container
    // and the document can be added by the current user
    return status.container &&
           status.container.addableTypes.any(function (addableType) {
             return addableType.get('type') === 144;
           });
  },

  execute: function (status, options) {
    // Deferred command state to return promise for
    var deferred = $.Deferred();
    // Require the scanning controller dynamically when needed; not
    // statically in this command module
    require(['scan/controllers/scan.upload.controller'
    ], function (ScanUploadController) {
      // Create the file uploading controller
      var uploader = new ScanUploadController({
            container: status.container,
            collection: status.collection
          });
      // Add the scanned files to the collection to process
      uploader
        .enqueFiles()
        .then(function () {
          // Display progress of every file at the top of the page
          GlobalMessage.showFileUploadProgress(uploader.fileUploads);
          // Wait until every file has finished to continue
          var filePromises = uploader.fileUploads.invoke('promise');
          return $.when.apply($, filePromises);
        })
        // Notify the listeners that this command has ended
        .done(_.bind(deferred.resolve, deferred))
        .fail(_.bind(deferred.reject, deferred));
    }, function (error) {
      // Fail if the scanning module is not available
      deferred.reject.call(deferred, error);
    });
    // Return the promise for the command state
    return deferred.promise();
  },

});
```

## Using Commands

A command can be used to implement a shared functionality, which is complex
and may need some UI interaction with the rest of the application; status
and error handling, for example.

The `CommandCollection` collects the commands by their `signature`, which
are supposed to be a stable interface and a command can be looked up by it.

### Examples

Deletes a document or other node:

```javascript
    // Get a NodeModel representing a real node
var context   = new PageContext(),
    connector = context.getObject(ConnectorFactory),
    node      = new NodeModel({id: 123}, {connector: connector}),
    // Get the deleting command and execute it for the specific node
    deleter   = commands.get('Delete');
    promise   = deleter.execute({
                  context: context,
                  nodes: new Backbone.Collection(node)
                });
// Wait until the deletion is done and log the result on the console
promise.always(function () {
  var succeeded = promise.state() === 'resolved';
  console.log('deletion', succeeded ? 'succeeded' : 'failed');
});
```

To extend the language bundle for pagination:
 1. Create module specific pagination file like:
     <module name>/localization/commands/nls/lang:
        EmailLinkSubject: 'I want to share the following links with you',
        EmailLinkDesktop: "Link for Desktop and Android",
        EmailAppleLinkFormat: "Link for iOS Mobile"

 2. Add lang file in their bundles file:

     <module name>/bundles/<module>-all:
        ...,
        '<module name>/localization/commands/nls/lang'

 3. Map it to csui pagination public language bundle in the config file:

     /app:
         require.config({
           map: {
             '*': {
               'csui/utils/commands/nls/lang': '<module name>/localization/commands/nls/lang'
             }
           }
         });