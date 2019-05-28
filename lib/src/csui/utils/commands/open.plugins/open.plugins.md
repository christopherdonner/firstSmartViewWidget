OpenPluginCollection
====================

Open Plugin supports opening document content, which is usually performed,
when a link to the document is clicked. Opening can be implemented as:

1. Navigating to the viewer URL in the current or new window.
2. Showing the viewer widget on the current page.

The plugin can support either of the two scenarios, or both of them.

The collection contains rules to detect the best plugin for a particular
node.

Methods
-------

: findByNode(node, options) : plugin

Finds the best fitting plugin by the using the first rule, which matches
atributes of the particular node. The following options can be specified:

* openInNewTab : true|false|null

Choose only plugins, which support opening in a new window (`true`), or
which support opening in the same window (`false`) or any plugin (`null`;
the default).

* widgetOnly : true|false|null

Choose only plugins, which support opening in the same window inside a
widget (`true`), or any plugin (`null`; the default).

Default Content
---------------

The `sequence` number specified the order of pugin matching. The first plugin,
which rule matches the specified node, will be used.

```javascript
[
  // Brava Viewer implements both Widget and page URL
  {
    sequence: 200,
    plugin: BravaPlugin,
    decides: BravaPlugin.isSupported
  },
  // Content Suite Viewer implements both Widget and page URL
  {
    sequence: 400,
    plugin: ContentSuiteViewerPlugin,
    decides: ContentSuiteViewerPlugin.isSupported
  },
  // Native Browser implements page URL only
  {
    sequence: 600,
    plugin: BrowserPlugin,
    decides: BrowserPlugin.isSupported
  }
]
```

Adding a Plugin
---------------

A plugin is exposed as a funtion object from a RequireJS module.

```javascript
define([
  'csui/lib/jquery', 'csui/models/version'
], function ($, VersionModel) {
  'use strict';

  function PDFPlugin() {}

  // If the viewer provides a widget, point to its RequireJS module
  PDFPlugin.prototype.widgetView = '...';

  // If the viewer provides a page, compose its URL asynchronously
  PDFPlugin.prototype.getUrl = function (node) {
    var url = node instanceof VersionModel ? ... : ...;
    return $.Deferred()
            .resolve(url)
            .promise();
  };

  return PDFPlugin;
});
```

One or more plugins are registered by one or more rules in a plugin rule
listing RequireJS module.

```javascript
define([
  'sample/open.plugins/impl/pdf.plugin'
], function (PDFPlugin) {
  'use strict';

  return [
    // Check the plugin after Brava and Content Suite viewers,
    // but before the native browser capabilities are checked
    {
      sequence: 500,
      plugin: PDFPlugin,
      equals: {mime_type: 'application/pdf'}
    },
    ...
  ];
});
```

RequireJS modules with one or more rules are registered in the component
extensions JSON file for the extension point
"csui/utils/commands/open.plugins/open.plugins".

```json
{
  "csui/utils/commands/open.plugins/open.plugins": {
    "extensions": {
      "sample": [
        "sample/sample/open.plugins/open.plugins"
      ]
    }
  },
  ...
}
```

Navigating to the viewer URL in the current or new window
---------------------------------------------------------

The plugin has to implement either of the following two methods:

: getUrl(node|version) : promise(string)

Returns a promise, which will resolve to an absolute URL. The URL should be
used for setting the location of a window, which is supposed to show the
viewer.

: getUrlQuery(node|version) : promise(string or object)

Returns a promise, which will resolve to a URL query. The URL query can be
represented as a final string, or as an object, which is meant to be
stringified by `$.param`. The URL query is supposed to be appended to the
CGI URL to get a complete URL. The complete URL should be handled in the
same way as in the case of the `getUrl` method.

The `getUrl` method takes priority, if both are detected on the plugin.

The methods have to be able to consume either of `NodeModel` or
`VersionModel` to support opening both default and specific versions of
the document content.

Showing the viewer widget on the current page
---------------------------------------------

The plugin has to implement the following property:

: widgetView : string

Returns the name of the RequireJS module, which exports the main widget view.
The module should be required and the view handled in a usual way; shown by
`Marinette.Region`, for example.

Usage Example: Open the document in a new window
------------------------------------------------

```javascript
var node    = ...,
    plugin  = openPlugins.findByNode(node, {openInNewTab: true});
if (plugin) {
  openWindow(plugin, node);
}

function openWindow(plugin, node) {
  var hasUrl  = plugin.getUrl,
      promise = hasUrl && plugin.getUrl(node) ||
                plugin.getUrlQuery(node),
      content = window.open('');
  promise.done(function (url) {
          // If the URL-query-only-retrieving method was used,
          // prepend the CGI URL base to complete the URL
          if (!hasUrl) {
            url = Url.appendQuery(
                    new Url(node.connector.connection.url).getCgiScript(),
                    Url.combineQueryString(url));
          }
          content.location = url;
        })
        .fail(, function (error) {
          content.close();
        });
}
```

Usage Example: Open the document in the same window
---------------------------------------------------

```javascript
var context = ...,
    node    = ...,
    plugin  = openPlugins.findByNode(node);
if (plugin) {
  if (plugin.widgetView) {
    openWidget(plugin.widgetView, node, context);
  } else {
    openWindow(plugin, node);
  }
}

function openWidget(viewModule, node, context) {
  require([viewModule], function (WidgetView) {
    var viewer = new WidgetView({
          context: context,
          model: node
        }),
        reqion = new Marinette.Region({el: '#viewer'});
    region.show(viewer);
  });
}
```