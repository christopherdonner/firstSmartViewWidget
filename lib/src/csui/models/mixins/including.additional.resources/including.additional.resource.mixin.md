# IncludingAdditionalResourcesMixin

Provides support for the setting URL query parameter flags as introduced by the
`api/v1/nodes/:id` (V1) resource.

Server responses can contain associated resources to avoid requesting every
associated resource by an additional server call, or other data, which may
not be needed every time.  For example:

actions
: Include permitted actions.

### How to apply the mixin to a model

```
var MyModel = Backbone.Model.extend({

  constructor: function MyModel(attributes, options) {
    Backbone.Model.prototype.constructor.apply(this, arguments);
    this
      .makeConnectable(options)
      .makeIncludingAdditionalResources(options);
  },

  url: function () {
    var url = Url.combine(this.connector.connection.url, 'myresource'),
        query = Url.combineQueryString(
          this.getAdditionalResourcesUrlQuery()
        );
    return query ? url + '?' + query : url;
  }
  
});

ConnectableMixin.mixin(MyModel.prototype);
IncludingAdditionalResourcesMixin.mixin(MyModel.prototype);
```

This mixin us usually combined together with the `ConnectableMixin`
or with another cumulated mixin which includes it.

### How to use the mixin

Set up the URL parameters by calling `includeResources` and
`excludeResources` and fetch the model:

```
// Set the inclusion when creating the model
var model = new MyModel(undefined, {
      connector: connector,
      includeResources: ['perspective']
    });
model.fetch();

// Set the inclusion after creating the model
model.includeResources('perspective');
model.fetch();
```

## makeIncludingAdditionalResources(options) : this

Must be called in the constructor to initialize the mixin functionality.
Expects the Backbone.Model or Backbone.Collection constructor options passed in.

Recognized option properties:

includeResources
: One or more resources to include.  The value is handled the same way as the
  `includeResources` method does it.  An empty array is the default.

## _additionalResources

Resources to get included in the response in the response (array of strings,
empty by default, read-only).

## includeResources(names) : void

Makes one or more resources included.  The `names` parameter can be either
string, or an array of strings.  The string can contain a comma-delimited list,
in which case it will be split to an array.

```
// Have a resources included, option 1
model.includeResources('perspective');
// Have a resource included, option 2
model.includeResources(['perspective']);
```

## excludeResources(names) : void

Prevents one or more resources from being included.  The `names` parameter can be either
string, or an array of strings, or nothing.  The string can contain a comma-delimited list,
in which case it will be split to an array.  If nothing is specified, all inclusions will
be removed (disabled).

```
// Cancel all inclusions and fetch the fresh data
model.excludeResources();
model.fetch();
```

## getAdditionalResourcesUrlQuery() : string

Formats the URL query parameters for the resource inclusion.  They can be concatenated
with other URL query parts (both object literals and strings) by `Url.combineQueryString`.

```
var url = ...,
    query = Url.combineQueryString(
      ...,
      this.getAdditionalResourcesUrlQuery()
    );
if (query) {
  url = Url.appendQuery(url, query);
}
```

## See Also

`ConnectableMixin`, `ResourceMixin`
