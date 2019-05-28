(function () {
  'use strict';

  window.csui.require = require;
  window.csui.requirejs = requirejs;
  window.csui.supportPath = '/lib/src';

  // Include the BINF stylesheet and mark body as parent of BINF widgets
  define('prepare-test-page', function () {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/base/lib/src/csui/themes/carbonfiber/theme.css';
    document.head.appendChild(link);
    document.body.classList.add('binf-widgets');
  });

  require.config({
    // Minimum from the application config - module paths
    paths: {
      csui: 'lib/src/csui',
      'donner': 'src'
    }
  });
}());
