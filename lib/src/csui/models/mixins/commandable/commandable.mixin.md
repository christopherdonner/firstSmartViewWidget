# CommandableMixin

Provides support for the setting `commands` URL query parameter as introduced
by the `api/v1/nodes/:id/nodes` (V1) resource.

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
      .makeCommandable(options);
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
CommandableMixin.mixin(MyModel.prototype);
```

This mixin us usually combined together with the `ConnectableMixin`
or with another cumulated mixin which includes it.

### How to use the mixin

Set up the URL parameters by calling `setCommands` and `resetCommands` and fetch the model:

```
// Set the commands for requesting when creating the model
var model = new MyModel(undefined, {
      connector: connector,
      commands: ['delete', 'reserve']
    });
model.fetch();

// Set the commands for requesting after creating the model
model.setCommands(['delete', 'reserve']);
model.fetch();
```

## makeCommandable(options) : this

Must be called in the constructor to initialize the mixin functionality.
Expects the Backbone.Model or Backbone.Collection constructor options passed in.

Recognized option properties:

commands
: One or more command signatures to be requested for being checked.  The value
is handled the same way as the `setCommands` method does it.  An empty array
is the default.

## commands

Command signatures to be requested for being checked (array of strings, empty
by default, read-only).

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

## getRequestedCommandsUrlQuery() : string

Formats the URL query parameters for the command investigation.  They can be concatenated
with other URL query parts (both object literals and strings) by `Url.combineQueryString`.

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

`ConnectableMixin`
