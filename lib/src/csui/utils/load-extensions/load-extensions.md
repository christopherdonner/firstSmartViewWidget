load-extensions
===============

Require.js plugin to load extension modules listed in the module config
of the specified module.  The extension modules are supposed to perform
self-registration as expected by the extensible module.

How to configure extra cell views to show custom columns in the table, which
is supported by te extensible module `csui/controls/table/cells/cell.factory`:

    require.config({
      config: {
        'csui/controls/table/cells/cell.factory': {
          extensions: {
            // Module array should be wrapped in a map key to allow merging
            // of extensions from multiple calls to require.config; arrays
            // are not merged
            'samples': [
              'samples/cells/reserved/reserved.view'
              'samples/cells/social/social.view'
            ]
          }
        }
      }
    });

How the extensible module `csui/controls/table/cells/cell.factory` loads all
configured extensions:

    define([
      ..., 'csui-ext!csui/controls/table/cells/cell.factory'
    ], function (...) {
      // Before the callback is executed, 'samples/cells/reserved/reserved.view'
      // and 'samples/cells/social/social.view' are loaded and executed
      ...
    });
