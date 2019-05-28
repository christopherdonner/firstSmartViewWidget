# ServerModuleCollection

Lists the CS modules, which register a CS UI extension. The collection
can be fetched to get teh full module list.  A subset of modules can be
fetched by adding models with the `id` attribute only to the collection
and then the fetch.  Or fetching just the ServerModuleModel alone.

The following attributes are defined by the core implementation:

id (string)
: The Require.js module prefix used by the particular module.  It can be
  used as a unique identifier of the CS module.

title (string)
: The displayable name of the CS module.  It comes from the `Module` object
  in OScript and can be overridden later.

version (string)
: The module version formatted "<major>.<minor>.<patch>".

helpDocId (string)
: The unique identifier for the entrance page in the on-line
  documentation of this module.

## About the helpDocId

It is the product ID or the PI ID, containing the embedded version.
The format should be "nnnnnVVVVVV-h-dddd", where:

nnnnn
: Product/PI name

VVVVV
: Version

-h
: Help document (Optional)

-dddd
: Document type (User guide, Installation, etc...) (Optional)

## How to define a helpDocId for a CS module

The CS module contains a descriptor file with CS UI extensions:
`<prefix>-extensions.json` in the `.../support/<module>` directory.  The
property `helpDocId` should be specified there under the key
"csui/models/server.module/server.module.collection" -> "modules":

```json
{
  "csui/models/server.module/server.module.collection": {
    "modules": {
      "greet": {
        "helpDocId": "greetings160000-h-ugd"
      }
    }
  }
}
```

## How to get all modules, which have an on-line help

```javascript
require(['csui/models/server.module/server.module.collection'
], function (ServerModuleCollection) {

  var serverModules = new ServerModuleCollection();

  serverModules
      .fetch()
      .then(function () {
        var modulesWithHelp = serverModules.filter(function (serverModule) {
          return !!serverModule.get('helpDocId');
        });
      });

});
```
