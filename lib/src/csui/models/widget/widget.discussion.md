Widget identifiers
------------------

Module directory names are used for compactness:

    csui/widgets/shortcut
    csui/widgets/favorites
    social/widgets/comments
    conws/widgets/workspace.header

The directory must contain a file withthe main view controller
of the widget, named by the directory name and ".view.js" suffix,
which is used to require the Require.js module in the code:

    csui/widgets/shortcut/shortcut.view
    csui/widgets/favorites/favorites.view
    social/widgets/comments/comments.view
    conws/widgets/workspace.header/workspace.header.view

Widget manifest samples
-----------------------

    shortcut.manifest.json
      {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "title": "Shortcut",
        "description": "Tile representing a hyperlink to an object; navigates to its default page when clicked",
        "tags": ["Small"],
        "schema": {
          "type": "object",
          "properties": {
            "id": {
              "title": "Node ID",
              "description": "Numeric node identifier of the object to point to",
              "type": "integer"
            },
            "type": {
              "title": "Volume subtype",
              "description": "Subtype number of the global volume to point to",
              "type": "integer",
              "default": 141
            },
            "icon": {
              "title": "Icon CSS class",
              "description": "CSS class supplying the icon in the middle of the shortcut tile",
              "type": "string"
            },
            "background": {
              "title": "Background CSS class",
              "description": "CSS class supplying the background below the shortcut tile",
              "type": "string"
            }
          },
          "oneOf":
            [{
              "required": ["id"]
            }, {
              "required": ["type"]
            }]
        }
      }

    workspace.header.manifest.json
      {
        "title": "Connected Workspace Header",
        "description": "Header for the tabbed perspective showing a connected workspace",
        "tags": ["Node Bound", "Tabbed Header", "Connected Workspaces"],
        "schema": {
          ...
        }
      }

UPDATED WIDGET MANIFEST SAMPLE FOR LOCALIZATION
--------------------------------------

Any data that needs to be localized should be replaced with "{{keyname}}" placeholder
Below is sample for manifest that requires localization

      shortcut.manifest.json
      {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "title": "{{title}}",
        "description": "{{descritpion}}",
        "tags": ["{{placeholder}}"],
        "schema": {
          "type": "object",
          "properties": {
            "id": {
              "title": "{{title}}",
              "description": "{{description}}",
              "type": "integer"
            },
            "type": {
              "title": "{{title}}",
              "description": "{{description}}",
              "type": "integer",
              "default": 141
            },
            "icon": {
              "title": "{{title}}",
              "description": "{{description}}",
              "type": "string"
            },
            "background": {
              "title": "{{title}}",
              "description": "{{description}}",
              "type": "string"
            }
          },
          "oneOf":
            [{
              "required": ["id"]
            }, {
              "required": ["type"]
            }]
        }
      }

    workspace.header.manifest.json
      {
        "title": "{{title}}",
        "description": "{{description}}",
        "tags": ["{{placeholder}}", "{{placeholder}}", "{{placeholder}}"],
        "schema": {
          ...
        }
      }


Widget Localization Data Sample
--------------------------
With the manifest sample above, A corresponding localization data should be created with matching
 keys.

     shortcut.manifest.js
      define({
        {
          "title": "Shortcut",
          "description": "Tile representing a hyperlink to an object; navigates to its default page when clicked",
          "tags": ["Small"],
          "schema": {
            "properties": {
              "id": {
                "title": "Node ID",
                "description": "Numeric node identifier of the object to point to"
              },
              "type": {
                "title": "Volume subtype",
                "description": "Subtype number of the global volume to point to"
              },
              "icon": {
                "title": "Icon CSS class",
                "description": "CSS class supplying the icon in the middle of the shortcut tile"
              },
              "background": {
                "title": "Background CSS class",
                "description": "CSS class supplying the background below the shortcut tile"
              }
            }
          }
        })

     workspace.header.manifest.js
      define({
        "title": "Connected Workspace Header",
        "description": "Header for the tabbed perspective showing a connected workspace",
        "tags": ["Node Bound", "Tabbed Header", "Connected Workspaces"],
        "schema": {
          ...
        }
      })


Widget Localisation config sample
---------------------------------
A config should be created for the widget to turn on the default language

      shortcut.manifest.js
        define({
          "root": true,
          "en-us": false,
          "en": false
        })



Widget manifest placement
-------------------------

In the widget directory, ".manifest.json" suffix:

    widgets/
      shortcut/
        shortcut.view.js
        shortcut.manifest.json
      workspace.header/
        workspace.header.view.js
        workspace.header.manifest.json



Widget localized data placement
-------------------------------

    widgets/
      shortcut/
        impl/
          nls/
            root/
              shortcut.manifest.js
            de/
              shortcut.manifest.js


Widget localized config placement
----------------------------------

     widgets/
          shortcut/
            impl/
              nls/
                shortcut.manifest.js




Widget registration
-------------------

In <prefix>-extensions.json

    require.config({
      config: {
        "csui/models/widget/widget.collection": {
          "widgets": {
            "csui": [
              "csui/widgets/favorites",
              "csui/widgets/shortcut"
            ]
          }
        }
      }
    });

    require.config({
      config: {
        "csui/models/widget/widget.collection": {
          "widgets": {
            "conws": [
              "conws/widgets/related.workspaces",
              "conws/widgets/workspace.header"
            ]
          }
        }
      }
    });

    require.config({
      config: {
        "csui/controls/table/cells/cell.factory": {
          "extensions": {
            "social": [
              "social/controls/cells/comments",
              "social/controls/cells/likes"
            ]
          }
        },
        "csui/models/widget/widget.collection": {
          "widgets": {
            "social": [
              "social/widgets/activities",
              "social/widgets/comments"
            ]
          }
        }
      }
    });

Possible automation
-------------------

    widgetIndex:
      widgets/**/*.manifest.json

    csui/bundles/csui-app-index.json
    csui/csui-widgets.json

    conws/bundles/conws-index.json
    conws/conws-widgets.json

    social/bundles/social-index.json
    social/social-extensions.json
    social/social-widgets.json

Only list of names
------------------

    [ "csui/widgets/favorites" , "csui/widgets/shortcut" ]

    require(['csui/models/widget/widget.names'
    ], function (widgetNames) {
      ...
    });

Additional list of manifests
----------------------------

    {
      "csui/widgets/favorites": {
        "title": ...
      },
      "csui/widgets/shortcut": {
        "title": ...
      }
    ]

    require(['csui/models/widget/widget.manifests'
    ], function (widgetManifests) {
      ...
    });

Additional list of widget views
-------------------------------

    {
      "csui/widgets/favorites": FavoritesView,
      "csui/widgets/shortcut": ShortcutView
    ]

    require(['csui/models/widget/widget.views'
    ], function (widgetViews) {
      ...
    });

Combined list of widget data
----------------------------

    {
      "csui/widgets/favorites": {
        "view": FavoritesView,
        "manifest": {
          "title" : ...
        }
      },
      "csui/widgets/shortcut": {
        "view": ShortcutView,
        "manifest": {
          "title" : ...
        }
      }
    ]

    require(['csui/models/widget/widget.data'
    ], function (widgetViews) {
      ...
    });

Standalone JSON manifest
------------------------

    workspace.header.manifest.json
      {
        "title": "Connected Workspace Header",
        "description": "Header for the tabbed perspective showing a connected workspace",
        "tags": ["Node Bound", "Tabbed Header", "Connected Workspaces"],
        "schema": {
          ...
        }
      }

Require.js bundling module:

    define([
      ...
      'csui/widgets/favorites/favorites.view',
      'json!csui/widgets/favorites/favorites.manifest.json',
      'csui/widgets/shortcut/shortcut.view',
      'json!csui/widgets/shortcut/shortcut.manifest.json'
    ], {});

    // Read single widget manifest
    require(['json!csui/widgets/shortcut/shortcut.manifest.json'
    ], function (shortcutManifest) {
      ...
    });

    // Get all widget titles
    require(['csui/models/widget.manifest/widget.manifest.collection'
    ], function (WidgetManifestCollection) {
      var widgetNames = WidgetCollection.AvailableWidgets,
          widgets = new WidgetManifestCollection();
      widgets.fetch()
        .done(function () {
          var titles = widgets.pluck('title');
          console.log(titles);
        });
    });

    // Create a widget
    require(['require', 'csui/models/widget.manifest/widget.manifest.collection'
    ], function (require, WidgetManifestCollection) {
      var widgetManifests = new WidgetManifestCollection();
      widgetManifests.fetch()
        .done(function () {
          var widgetManifest = widgetManifests.first(),
              widgetModule = widgetManifest.get('id').replace(/^.+\/([^\/]+$/, '$1');
          require([widgetModule], function (View) {
            var view = new View({
                  context: ...
                });
            view.render();
          }, function (error) {
            console.log(error);
          });
        });
    });

    + no code needed in the widget sources
      (but the module reference needs to be added to some bundle)
    + manifests do not need to be packed in the bundle with code
      (but they may not be so big and they could be used to validate
       the initialization settings)
    + non-intrusive, minimum API addition
      (but loading of widgets is not provided)
    - no localization

Standalone JS manifest
----------------------

    workspace.header.manifest.js
      define({
        "title": "Connected Workspace Header",
        "description": "Header for the tabbed perspective showing a connected workspace",
        "tags": ["Node Bound", "Tabbed Header", "Connected Workspaces"],
        "schema": {
          ...
        }
      })'

Require.js bundling module:

    define([
      ...
      'csui/widgets/favorites/favorites.view',
      'csui/widgets/favorites/favorites.manifest',
      'csui/widgets/shortcut/shortcut.view',
      'csui/widgets/shortcut/shortcut.manifest'
    ], {});

    // Read single widget manifest
    require(['csui/widgets/shortcut/shortcut.manifest'
    ], fun=imqction (shortcutManifest) {
      ...
    });

    // Get all widget titles
    (the same)

    // Create a widget
    (the same)

    + no code needed in the widget sources
      (but the module reference needs to be added to some bundle)
    + manifests do not need to be packed in the bundle with code
      (but they may not be so big and they could be used to validate
       the initialization settings)
    + non-intrusive, minimum API addition
      (but loading of widgets is not provided)
    + localization possible

Manifest attached to the widget view
------------------------------------

    // Read single widget manifest
    require(['csui/widgets/shortcut/shortcut.view'], function (ShortcutView) {
      var shortcutManifest = ShortcutView.manifest;
      ...
    });

    // Get all widget titles
    require(['csui/models/widget/widget.collection'
    ], function (WidgetCollection) {
      var widgets = new WidgetCollection();
      widgets.fetch()
        .done(function () {
          var titles = widgets.map(function (View) {
                return View.manifest.title;
              });
          console.log(titles);
        });
    });

    // Create a widget
    require(['csui/models/widget/widget.collection'
    ], function (WidgetCollection) {
      var widgets = new WidgetCollection();
      widgets.fetch()
        .done(function () {
          var View = widgets.first(),
              view = new View({
                context: ...
              });
          view.render();
        });
    });

    - widget source must require and expose the manifest
    - manifest gets packed into the bundle with code
    - intrusively adds an API to the view controller
    o localization possible

Wrapper of view and manifest
----------------------------

    defaults: {
      id: null,       // Require.js module ID
      view: null,     // Resolved function object of the widget's view controller
      manifest: null, // Resolved meta-data describing the widget
      error: null     // Error from the widget's resolution if it failed
    }

    // Read single widget manifest
    require(['csui/models/widget/widget.model'
    ], function (WidgetModel) {
      var widget = new WidgetModel({
            id: 'csui/widgets/shortcut'
          });
      widget.fetch()
        .done(function () {
          var title = widget.get('manifest').title;
          console.log(title);
        });
    });

    // Get all widget titles
    require(['csui/models/widget/widget.collection'
    ], function (WidgetCollection) {
      var widgetNames = WidgetCollection.AvailableWidgets,
          widgets = new WidgetCollection();
      widgets.fetch()
        .done(function () {
          var titles = widgets.map(function (model) {
                return model.get('manifest').title;
              });
          console.log(titles);
        });
    });

    // Create a widget
    require(['csui/models/widget/widget.collection'
    ], function (WidgetCollection) {
      var widgets = new WidgetCollection();
      widgets.fetch()
        .done(function () {
          var widget = widgets.first(),
              View = widget.get('view');
          if (View) {
            var view = new View({
              context: ...
            });
            view.render();
          } else {
            var error = widget.get('error');
            console.log(error);
          }
        });
    });

    + no code needed in the widget sources
      (but the module reference needs to be added to some bundle)
    + manifests do not need to be packed in the bundle with code
      (but they may not be so big and they could be used to validate
       the initialization settings)
    + non-intrusive, independent API for both manifests and widgets
    o localization possible

Links
-----

The home of JSON Schema
http://json-schema.org/

An Introduction to JSON Schema
http://crypt.codemancers.com/posts/2014-02-11-An-introduction-to-json-schema/

Understanding JSON Schema
http://spacetelescope.github.io/understanding-json-schema/index.html

JSON Schema Lint
http://jsonschemalint.com/draft4/

Alpaca Form Fields Documentation
http://www.alpacajs.org/documentation.html
