(function () {
  'use strict';

  window.define = window.csui.define;
  window.require = window.requirejs = undefined;
  window.csui.supportPath = '/lib/release';

  // Include the BINF stylesheet and mark body as parent of BINF widgets
  define('prepare-test-page', function () {
    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/base/lib/release/csui/themes/carbonfiber/theme.css';
    document.head.appendChild(link);
    document.body.classList.add('binf-widgets');
  });

  window.csui.require.config({
    // Minimum from the application config - module paths
    paths: {
      csui: 'lib/release/csui',
      'donner': 'out-release',
      'csui/lib/bililiteRange': 'lib/src/csui/lib/bililiteRange',
      'csui/lib/jquery.simulate': 'lib/src/csui/lib/jquery.simulate',
      'csui/lib/jquery.simulate.ext': 'lib/src/csui/lib/jquery.simulate.ext',
      'csui/lib/jquery.simulate.key-sequence': 'lib/src/csui/lib/jquery.simulate.key-sequence'
    }
  });
}());
