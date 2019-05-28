# DelayedCommandableMixin

Provides support for fetching permitted actions by an extra call after
the primary node collection has been fetched.  It depends on setting the
`commands` URL query parameter as introduced by the `api/v1/nodes/:id/nodes`
(V1) resource to specify just the default actions. The it issues an additional
`api/v2/actions/nodes` call to enquire about the rest of the actions.

Server responses can contain *permitted actions* to be able to support
enabling and disabling in the corresponding UI; how many and which ones
should be checked by the server can be specified.

### How to apply the mixin to a model

```
var MyModel = Backbone.Model.extend({

  constructor: function MyModel(attributes, options) {
    Backbone.Model.prototype.constructor.apply(this, arguments);
    this
      .makeConnectable(options)
      .makeDelayedCommandable(options);
  },

  url: function () {
    var url = Url.combine(this.connector.connection.url, 'myresource'),
        query = Url.combineQueryString(
          this.getRequestedCommandsUrlQuery()
        );
    return query ? url + '?' + query : url;
  }

});

ConnectableMixin.mixin(MyModel.prototype);
DelayedCommandableMixin.mixin(MyModel.prototype);
```

This mixin us usually combined together with the `ConnectableMixin`
or with another cumulated mixin which includes it.

### How to use the mixin

Set up the URL parameters by calling `setDefaultActionCommands`,
`resetDefaultActionCommands`, `setCommands` and `resetCommands` and
fetch the model:

```
// Set the commands for requesting when creating the model
var model = new MyModel(undefined, {
      connector: connector,
      commands: ['download', 'delete', 'reserve']
      defaultActionCommands: ['download'],
      delayRestCommands: true
    });
model.fetch();

// Set the commands for requesting after creating the model
model.setCommands(['download', 'delete', 'reserve']);
model.setDefaultActionCommands(['download']);
model.fetch();
```

## makeDelayedCommandable(options) : this

Must be called in the constructor to initialize the mixin functionality.
Expects the Backbone.Model or Backbone.Collection constructor options passed in.

Recognized option properties:

commands
: One or more command signatures to be requested for being checked.  The value
is handled the same way as the `setCommands` method does it.  An empty array
is the default.

defaultActionCommands
: One or more command signatures to be requested for being checked immediately
by the first call.  The rest of commands specified by the `commands` parameter
will be fetched later by the second call.  The value is handled the same way as
the `setDefaultActionCommands` method does it.  An empty array is the default.

delayRestCommands
: Enables delayed fetching of the non-default actions by a second server call.
`False` is the default.

delayRestCommandsForModels
: Enables delayed fetching of the non-default actions by a second server call
  for child models, which are created automatically by adding attribute objects
  to the collection; if the mixin is aplied to a collection, the parameter
  `delayRestCommands` does not apply to the child models; the
  `delayRestCommandsForModels` does. `False` is the default.

## commands

Command signatures to be requested for being checked (array of strings, empty
by default, read-only).

## defaultActionCommands

Command signatures for being checked to be requested immediately by the first
server call (array of strings, empty by default, read-only).

## delayRestCommands
: Says, if delayed fetching of the non-default actions by a second server call
is enabled (boolean, `false` by default, read-only).

## delayRestCommandsForModels
: Says, if delayed fetching of the non-default actions by a second server call
  is enabled for child models, which are created automatically by adding
  attribute objects to the collection; if the mixin is aplied to a collection,
  the parameter `delayRestCommands` does not apply to the child models; the
  `delayRestCommandsForModels` does (boolean, `false` by default, read-only).

## delayedActions

A collection fetching the rest of non-default actions. If you need to wait until
all permitted actions are received, you need to check the `fetched` status of this
collection, or listen to the 'sync' even of this collection.  The target collection,
which you applied this mixin too will report that it is fetched immediately after
the first server call is finished with the default actions only.

```
var model = new MyModel(undefined, {
      connector: connector,
      commands: ['download', 'delete', 'reserve']
      defaultActionCommands: ['download'],
      delayRestCommands: true
    });
model
    .once('sync', function () {
      // nodes with permitted default actions are available
    })
    .delayedActions.once('sync', function () {
      // nodes with all permitted actions are available
    })
    .fetch();
```

## setCommands(names) : void

Asks for one or more commands to be checked.  The `names` parameter can be
either string, or an array of strings.  The string can contain a comma-delimited
list, in which case it will be split to an array.

```
// Have two commands checked, option 1
model.setCommands(['delete', 'reserve']);
// Have two commands checked, option 2
model.setCommands('delete');
model.setCommands('reserve');
// Have two commands checked, option 3
model.setCommands('delete,reserve');
```

## resetCommands(names) : void

Prevents one or more commands from being checked.  The `names` parameter can be either
string, or an array of strings, or nothing.  The string can contain a comma-delimited list,
in which case it will be split to an array.  If nothing is specified, all commands will
be removed (not to be checked).

```
// Cancel all command checks and fetch the fresh data
model.resetCommands();
model.fetch();
```

## setDefaultActionCommands(names) : void

Asks for one or more commands to be checked immediately by the first server
call.  The `names` parameter can be either string, or an array of strings.
The string can contain a comma-delimited list, in which case it will be split
to an array.  The rest of commands specified by the `setCommands` method
will be fetched later by the second call.

```
// Have two commands checked, option 1
model.setCommands(['browse', 'download']);
// Have two commands checked, option 2
model.setCommands('browse');
model.setCommands('download');
// Have two commands checked, option 3
model.setCommands('browse,download');
```

## resetDefaultActionCommands(names) : void

Prevents one or more commands from being checked immediatley by the first
server call.  The `names` parameter can be either string, or an array of
strings, or nothing.  The string can contain a comma-delimited list, in
which case it will be split to an array.  If nothing is specified, all
commands will be removed (not to be checked by the first server call).

```
// Have all commands fetched delayed by the second server call
model.setCommands(['browse', 'download']);
model.resetDefaultActionCommands();
model.fetch();
```

## getRequestedCommandsUrlQuery() : string

Formats the URL query parameters for the command investigation.  They can be concatenated
with other URL query parts (both object literals and strings) by `Url.combineQueryString`.
If delayed action fetching is enabled, only the default actions will be returned by this
method; the rest of specified actions fill be fetched by an additional server call later.

```
var url = ...,
    query = Url.combineQueryString(
      ...,
      this.getRequestedCommandsUrlQuery()
    );
if (query) {
  url = Url.appendQuery(url, query);
}
```

## See Also

`ConnectableMixin`, `CommandableMixin`
