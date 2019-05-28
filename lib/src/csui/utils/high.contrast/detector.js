/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(function () {
  'use strict';

  var highContrast;

  function detectHighContrast() {
    var div = document.createElement('div');
    var style = div.style;
    style.borderWidth = '1px';
    style.borderStyle = 'solid';
    style.borderTopColor = '#F00';
    style.borderRightColor = '#0FF';
    style.position = 'absolute';
    style.left = '-9999px';
    style.width = div.style.height = '2px';
    var body = document.body;
    body.appendChild(div);
    style = window.getComputedStyle(div);
    highContrast = style.borderTopColor === style.borderRightColor;
    body.removeChild(div);
    var method = highContrast ? 'add' : 'remove';
    document.documentElement.classList[method]('csui-highcontrast');
  }

  return {
    load: function (name, _require, onLoad, config) {
      function ensureHighContrastDetection() {
        if (document.readyState === 'complete') {
            if (highContrast === undefined) {
            detectHighContrast();
          }
          onLoad(highContrast);
          return true;
        }
      }

      if (config.isBuild) {
        onLoad(null);
      } else {
        if (!ensureHighContrastDetection()) {
          document.addEventListener('readystatechange',
              ensureHighContrastDetection);
        }
      }
    }
  };
});
