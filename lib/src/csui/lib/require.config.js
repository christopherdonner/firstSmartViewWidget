/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

// Loads JSON file, parses it to an object and passes it to require.config
//
// https://gist.github.com/prantlf/a7972320307580573eb715ed65e85a2b
// Copyright (c) 2016 Ferdinand Prantl
// Licensed under the MIT license.
//
// If you have a couple of pages and apply the same RequireJS configuration
// on them, you would like to maintain the configuration content at a single
// place.  You could put the require.config statement to a script file and
// load it on the page by the script element before your main application
// starts.  If you have the configuration object stored in a JSON file, you
// would need to write some code to get it loaded and applied.  This RequireJS
// plugin takes care of it.
//
// You can have the configuration loaded before any application module by
// including it in the 'deps' configuration property:
//
// require.config({
//   paths: {'require.config': 'lib/require.config'}
//   deps:  ['require.config!app/settings.json',
//           'require.config!test/settings.json']
// });
//
// If you load the configuration by the main require call, mMake sure, that
// it is applied before any application is loaded by nesting the require
// calls; the order of module loading is not the order of the array items:
//
// require(['require.config!app/settings.json'], function () {
//   require([...,], function (...) {
//     ...
//   });
// });
//
// The module name 'txt' should point to the RequireJS'text' plugin, e.g.:
//
// require.config({
//   paths: {text: 'lib/text'}
// });
define(['txt'], function (text) {

  return {

    load: function (name, _require, onLoad, config) {
      var url = _require.toUrl(name);
      // Ignore modules, which were excluded from the dependency processing
      if (url.indexOf('empty:') === 0) {
        onLoad(null);
      } else {
        // Load the JSON file with the configuration as plain text
        text.get(url, function (data) {
          var parsed;
          if (config.isBuild) {
            // Just remember the text content for later writing during
            // the r.js build phase
            buildMap[name] = data;
            onLoad(data);
          } else {
            // Parse the expected JSON content
            try {
              parsed = JSON.parse(data);
            } catch (error) {
              onLoad.error(error);
            }
            // If there is no 'config' key present, expect the object to be
            // passed within the 'config' key as the most usual case;
            // otherwise pass the content as-is to require.config
            if (!parsed.config) {
              parsed = {config: parsed};
            }
            require.config(parsed);
            onLoad(parsed);
          }
        }, onLoad.error, {
          accept: 'application/json'
        });
      }
    },

    // write method based on RequireJS official text plugin by James Burke
    // https://github.com/jrburke/requirejs/blob/master/text.js
    write: function (pluginName, moduleName, write) {
      if (buildMap.hasOwnProperty(moduleName)) {
        var content = buildMap[moduleName];
        write.asModule(pluginName +'!'+ moduleName,
          'define('+ content +');\n');
      }
    }

  };

});
