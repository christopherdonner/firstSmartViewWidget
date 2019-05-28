# Versions Toolbar Items (widgets/metadata/versions.toolbaritems)

  Has the definition of toolbars used in the metadata.versions.view.


### Example on how to add additional toolbar items from code

 The following code extract is an example on how a module could add additional toolbar items into
 the versions toolbar header items.

    define( function () {
      'use strict';
      return {
        tableHeaderToolbar: [
          {
            signature: "VersionCompare",
            name: 'compare',
            group: "main"
          }
        ]
      };

    });

