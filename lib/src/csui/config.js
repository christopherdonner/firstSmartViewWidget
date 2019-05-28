/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


(function () {
  'use strict';
  var csui = window.csui || (window.csui = {});
  if (!csui.requirejs && window.requirejs) {
    csui.requirejs = window.requirejs;
    csui.require = window.require;
    csui.define = window.define;
  }
  var currentScript = document.currentScript || (function() {
        var scripts = document.getElementsByTagName('script');
        return scripts[scripts.length - 1];
      })();
  if (!currentScript) {
    throw new Error('Cannot detect the CS UI path');
  }
  var csuiPath = currentScript.getAttribute('data-csui-path');
  if (!csuiPath) {
    csuiPath = currentScript.src;
    var queryStart = csuiPath.indexOf('?');
    if (queryStart > 0) {
      csuiPath = csuiPath.substring(0, queryStart);
    }
    var anchorStart = csuiPath.indexOf('#');
    if (anchorStart > 0) {
      csuiPath = csuiPath.substring(0, anchorStart);
    }
    var lastSlash = csuiPath.lastIndexOf('/');
    csuiPath = lastSlash > 0 ? csuiPath.substring(0, lastSlash) : '.';
  }
  require.config({
    paths: {
      csui: csuiPath,
      css:  csuiPath + '/lib/css',
      'csui-ext': csuiPath + '/utils/load-extensions/load-extensions',
      hbs:  csuiPath + '/lib/hbs',
      i18n: csuiPath + '/lib/i18n',
      json: csuiPath + '/lib/json',
      less: csuiPath + '/lib/less',
      txt:  csuiPath + '/lib/text'
    },
    urlArgs: '',

    hbs: {
      disableI18n: true,
      disableHelpers: true,
      templateExtension: "hbs"
    },

    waitSeconds: 30
  });
}());
