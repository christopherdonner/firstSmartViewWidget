/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

/*
 * Require-CSS RequireJS css! loader plugin
 * 0.1.8
 * Guy Bedford 2014
 * MIT
 */

/*
 *
 * Usage:
 *  require(['css!./mycssFile']);
 *
 * Tested and working in (up to latest versions as of March 2013):
 * Android
 * iOS 6
 * IE 6 - 10
 * Chome 3 - 26
 * Firefox 3.5 - 19
 * Opera 10 - 12
 * 
 * browserling.com used for virtual testing environment
 *
 * Credit to B Cavalier & J Hann for the IE 6 - 9 method,
 * refined with help from Martin Cermak
 * 
 * Sources that helped along the way:
 * - https://developer.mozilla.org/en-US/docs/Browser_detection_using_the_user_agent
 * - http://www.phpied.com/when-is-a-stylesheet-really-loaded/
 * - https://github.com/cujojs/curl/blob/master/src/curl/plugin/css.js
 *
 */

define(['i18n'], function(i18n) {
//>>excludeStart('excludeRequireCss', pragmas.excludeRequireCss)
  if (typeof window == 'undefined')
    return { load: function(n, r, load){ load() } };

  var head = document.getElementsByTagName('head')[0];
  var linkWithCustomThemeFlag = head.querySelector('link[data-csui-use-custom-theme]');
  var linkWithThemeOverridesFlag = head.querySelector('link[data-csui-theme-overrides]') ||
                                   head.querySelector('style[data-csui-theme-overrides]');

  if (linkWithCustomThemeFlag) {
    console.warn('The attribute "data-csui-use-custom-theme" has been deprecated.  ' +
                 'Instead of creating a theme for all modules in single directory, ' +
                 ' use styling overrides with the attribute "data-csui-theme-overrides".');
  }

  var engine = window.navigator.userAgent.match(/Trident\/([^ ;]*)|AppleWebKit\/([^ ;]*)|Opera\/([^ ;]*)|rv\:([^ ;]*)(.*?)Gecko\/([^ ;]*)|MSIE\s([^ ;]*)|AndroidWebKit\/([^ ;]*)/) || 0;

  // use <style> @import load method (IE < 9, Firefox < 18)
  var useImportLoad = false;
  
  // set to false for explicit <link> load checking when onload doesn't work perfectly (webkit)
  var useOnload = true;

  // trident / msie
  if (engine[1] || engine[7])
    useImportLoad = parseInt(engine[1]) < 6 || parseInt(engine[7]) <= 9;
  // webkit
  else if (engine[2] || engine[8])
    useOnload = false;
  // gecko
  else if (engine[4])
    useImportLoad = parseInt(engine[4]) < 18;

//>>excludeEnd('excludeRequireCss')
  //main api object
  var cssAPI = {};

//>>excludeStart('excludeRequireCss', pragmas.excludeRequireCss)
  cssAPI.pluginBuilder = 'csui/lib/css-builder';

  // <style> @import load method
  var curStyle, curSheet;
  var createStyle = function () {
    curStyle = document.createElement('style');
    curStyle.setAttribute('data-csui-required', 'true');
    if (linkWithThemeOverridesFlag) {
      head.insertBefore(curStyle, linkWithThemeOverridesFlag);
    } else {
      head.appendChild(curStyle);
    }
    curSheet = curStyle.styleSheet || curStyle.sheet;
  }
  var ieCnt = 0;
  var ieLoads = [];
  var ieCurCallback;
  
  var createIeLoad = function(url) {
    curSheet.addImport(url);
    curStyle.onload = function(){ processIeLoad() };
    
    ieCnt++;
    if (ieCnt == 31) {
      createStyle();
      ieCnt = 0;
    }
  }
  var processIeLoad = function() {
    ieCurCallback();
 
    var nextLoad = ieLoads.shift();
 
    if (!nextLoad) {
      ieCurCallback = null;
      return;
    }
 
    ieCurCallback = nextLoad[1];
    createIeLoad(nextLoad[0]);
  }
  var importLoad = function(url, callback) {
    if (!curSheet || !curSheet.addImport)
      createStyle();

    if (curSheet && curSheet.addImport) {
      // old IE
      if (ieCurCallback) {
        ieLoads.push([url, callback]);
      }
      else {
        createIeLoad(url);
        ieCurCallback = callback;
      }
    }
    else {
      // old Firefox
      curStyle.textContent = '@import "' + url + '";';

      var loadInterval = setInterval(function() {
        try {
          curStyle.sheet.cssRules;
          clearInterval(loadInterval);
          callback();
        } catch(e) {}
      }, 10);
    }
  }

  // <link> load method
  var linkLoad = function(url, callback) {
    var link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.setAttribute('data-csui-required', 'true');
    if (useOnload)
      link.onload = function() {
        link.onload = function() {};
        // for style dimensions queries, a short delay can still be necessary
        setTimeout(callback, 7);
      }
    else
      var loadInterval = setInterval(function() {
        for (var i = 0; i < document.styleSheets.length; i++) {
          var sheet = document.styleSheets[i];
          if (sheet.href == link.href) {
            clearInterval(loadInterval);
            return callback();
          }
        }
      }, 10);
    link.href = url;
    if (linkWithThemeOverridesFlag) {
      head.insertBefore(link, linkWithThemeOverridesFlag);
    } else {
      head.appendChild(link);
    }
  }

//>>excludeEnd('excludeRequireCss')
  cssAPI.normalize = function(name, normalize) {
    if (name.substr(name.length - 4, 4) == '.css')
      name = name.substr(0, name.length - 4);

    return normalize(name);
  }

//>>excludeStart('excludeRequireCss', pragmas.excludeRequireCss)
  cssAPI.load = function(cssId, req, load, config) {

    (useImportLoad ? importLoad : linkLoad)(req.toUrl(cssId + '.css'), load);

  }

  // Enable loading separate stylesheets for module bundles:
  //   // Append this to the module bundle built by r.js
  //   require(['require', 'css'], function (require, css) {
  //     css.styleLoad(require, '<module bundle name built by r.js>');
  //   });
  cssAPI.styleLoad = function (require, moduleName, moduleLevelRTLEnabled) {
    var cssFilePostfix = i18n.settings.rtl && moduleLevelRTLEnabled ? '-rtl.css' : '.css',
        styleSheetUrl,
        moduleUrl = require.toUrl(moduleName),
        urlQueryIndex = moduleUrl.indexOf('?');
    // TODO: Remove support for data-csui-theme-overrides as soon as we decide.
    if (linkWithCustomThemeFlag) {
      styleSheetUrl = linkWithCustomThemeFlag.getAttribute('href');
      var slashIndex = styleSheetUrl.lastIndexOf('/');
      styleSheetUrl = (slashIndex < 0 ? '' : styleSheetUrl.substr(0, slashIndex + 1)) +
                      moduleName + '.css' ;
      if (urlQueryIndex >= 0) {
        styleSheetUrl += moduleUrl.substring(urlQueryIndex);
      }
    } else {
      // Trim URL query which was added by require.toUrl from urlArgs to
      // bust browser cache and add it after the stylesheet extension
      styleSheetUrl = urlQueryIndex < 0 ? moduleUrl + cssFilePostfix :
                      moduleUrl.substring(0, urlQueryIndex) + cssFilePostfix +
                      moduleUrl.substring(urlQueryIndex);
    }
    linkLoad(styleSheetUrl, function () {});
  }

//>>excludeEnd('excludeRequireCss')
  return cssAPI;
});
