# ExpandableMixin

Provides support for the setting `expand` URL query parameter as introduced by the 
`api/v1/nodes/:id` or `api/v1/nodes/:id/nodes` (V1) resources.

Server responses can contain references to other resources; typically IDs or URLs.
The *expansion* means replacing them with object literals containing the resource
information, so that the caller does not have to request every associated resource
by an additional server call.

Expandable resource types:

node
: nodes and volumes (`original_id`, `parent_id`, `volume_id` etc.)

user
: users or user groups (`create_user_id`, `modify_user_id`, `owner_user_id` etc.)

### How to apply the mixin to a model

```
var MyModel = Backbone.Model.extend({

  constructor: function MyModel(attributes, options) {
    Backbone.Model.prototype.constructor.apply(this, arguments);
    this
      .makeConnectable(options)
      .makeExpandable(options);
  },

  url: function () {
    var url = Url.combine(this.connector.connection.url, 'myresource'),
        query = Url.combineQueryString(
          this.getExpandableResourcesUrlQuery()
        );
    return query ? url + '?' + query : url;
  }
  
});

ConnectableMixin.mixin(MyModel.prototype);
ExpandableMixin.mixin(MyModel.prototype);
```

This mixin us usually combined together with the `ConnectableMixin`
or with another cumulated mixin which includes it.

### How to use the mixin

Set up the URL parameters by calling `setExpand` and `resetExpand` and fetch the model:

```
// Set the expansion when creating the model
var model = new MyModel(undefined, {
      connector: connector,
      expand: ['node', 'user']
    });
model.fetch();

// Set the expansion after creating the model
model.setExpand(['node', 'user']);
model.fetch();
```

## makeExpandable(options) : this

Must be called in the constructor to initialize the mixin functionality.
Expects the Backbone.Model or Backbone.Collection constructor options passed in.

Recognized option properties:

expand
: One or more resource types expanded.  The value is handled the same way as the
  `setExpand` method does it.  An empty array is the default.

## expand

Resource types to get expanded in the response (array of strings, empty by default,
read-only).

## setExpand(name) : void

Makes one or more resource types expanded.  The `name` parameter can be either
string, or an array of strings.  The string can contain a comma-delimited list,
in which case it will be split to an array.

```
// Have two resource types expanded, option 1
model.setExpand(['node', 'user']);
// Have two resource types expanded, option 2
model.setExpand('node');
model.setExpand('user');
// Have two resource types expanded, option 3
model.setExpand('node,user');
```

## resetExpand(name) : void

Prevents one or more resource types from being expanded.  The `name` parameter can be either
string, or an array of strings, or nothing.  The string can contain a comma-delimited list,
in which case it will be split to an array.  If nothing is specified, all expansions will
be removed (disabled).

```
// Cancel all expansions and fetch the fresh data
model.resetExpand();
model.fetch();
```

## getExpandableResourcesUrlQuery() : string

Formats the URL query parameters for the resource expansion.  They can be concatenated
with other URL query parts (both object literals and strings) by `Url.combineQueryString`.

```
var url = ...,
    query = Url.combineQueryString(
      ...,
      this.getExpandableResourcesUrlQuery()
    );
if (query) {
  url = Url.appendQuery(url, query);
}
```

## See Also

`ConnectableMixin`, `ResourceMixin`
