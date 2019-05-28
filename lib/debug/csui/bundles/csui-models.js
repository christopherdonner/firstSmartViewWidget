csui.define('csui/utils/log/console.re.appender',['csui/lib/log4javascript'], function (log4javascript) {
  'use strict';

  function ConsoleReAppender() {}

  ConsoleReAppender.prototype = Object.create(log4javascript.Appender.prototype);
  ConsoleReAppender.prototype.layout = new log4javascript.NullLayout();
  ConsoleReAppender.prototype.threshold = log4javascript.Level.DEBUG;

  ConsoleReAppender.prototype.append = function(loggingEvent) {
    var Level = log4javascript.Level,
        appender = this;

    var getFormattedMessage = function() {
      var layout = appender.getLayout();
      var formattedMessage = layout.format(loggingEvent);
      if (layout.ignoresThrowable() && loggingEvent.exception) {
        formattedMessage += loggingEvent.getThrowableStrRep();
      }
      return formattedMessage;
    };

    if (window.console && window.console.re && window.console.re.log) {
      var formattedMesage = getFormattedMessage();
      // Log to Firebug using its logging methods or revert to the console.log
      // method in Safari
      if (window.console.re.debug && Level.DEBUG.isGreaterOrEqual(loggingEvent.level)) {
        window.console.re.debug(formattedMesage);
      } else if (window.console.re.info && Level.INFO.equals(loggingEvent.level)) {
        window.console.re.info(formattedMesage);
      } else if (window.console.re.warn && Level.WARN.equals(loggingEvent.level)) {
        window.console.re.warn(formattedMesage);
      } else if (window.console.re.error && loggingEvent.level.isGreaterOrEqual(Level.ERROR)) {
        window.console.re.error(formattedMesage);
      } else {
        window.console.re.log(formattedMesage);
      }
    }
  };

  ConsoleReAppender.prototype.group = function(name) {
    if (window.console && window.console.re && window.console.re.group) {
      window.console.re.group(name);
    }
  };

  ConsoleReAppender.prototype.groupEnd = function() {
    if (window.console && window.console.re && window.console.re.groupEnd) {
      window.console.re.groupEnd();
    }
  };

  ConsoleReAppender.prototype.toString = function() {
    return 'ConsoleReAppender';
  };

  return ConsoleReAppender;

});
csui.define('csui/utils/log',['module', 'csui/lib/jquery', 'csui/lib/underscore',
  'csui/lib/log4javascript', 'csui/utils/log/console.re.appender'
], function (module, $, _, log4javascript, ConsoleReAppender) {
  'use strict';

  var config = module.config();
  _.defaults(config, {
    console: true,
    consoleRe: false,
    level: 'WARN',
    page: false,
    performanceTimeStamp: false,
    moduleNameStamp: false,
    server: false,
    window: false,
    modules: {}
  });

  var consoleEnabled = typeof console !== 'undefined' && config.console,
      loggerEnabled = config.window || config.page || config.server ||
                      config.consoleRe,
      enabled = consoleEnabled || loggerEnabled,
      thresholds = {
        ERROR: 4,
        WARN: 3,
        INFO: 2,
        DEBUG: 1,
        ALL: 1
      },
      threshold = getThreshold(config.level);

  log4javascript.setDocumentReady();
  var logger = log4javascript.getLogger(),
      appender;
  if (loggerEnabled) {
    logger = log4javascript.getLogger();
    //~ if (config.console) {
    //~ var appender = new log4javascript.BrowserConsoleAppender();
    //~ appender.setLayout(new log4javascript.PatternLayout(
    //~ '%d{HH:mm:ss.SSS} %-5p - %m{1}%n'));
    //~ logger.addAppender(appender);
    //~ }
    if (config.window) {
      appender = new log4javascript.PopUpAppender();
      appender.setNewestMessageAtTop(false);
      appender.setScrollToLatestMessage(true);
      //~ appender.setShowHideButton(true);
      //~ appender.setShowCloseButton(true);
      appender.setLayout(new log4javascript.PatternLayout(
          '%d{HH:mm:ss.SSS} %-5p - %m{1}'));
      logger.addAppender(appender);
    }
    if (config.page) {
      //~ var placeholderID = config.placeholder || 'csui_log';
      //~ var placeholder = $(placeholderID);
      //~ if (placeholder.length == 0)
      //~ placeholder = $('<div id='' + placeholder + ''></div>')
      //~ .appendTo($(document.body));
      appender = new log4javascript.InPageAppender(config.placeholder);
      appender.setNewestMessageAtTop(false);
      appender.setScrollToLatestMessage(true);
      appender.setShowHideButton(true);
      appender.setShowCommandLine(true);
      appender.setLayout(new log4javascript.PatternLayout(
          '%d{HH:mm:ss.SSS} %-5p - %m{1}'));
      logger.addAppender(appender);
    }
    if (config.consoleRe) {
      appender = new ConsoleReAppender();
      appender.setLayout(new log4javascript.PatternLayout(
          '%d{HH:mm:ss.SSS} %-5p - %m{1}'));
      logger.addAppender(appender);
    }
    if (config.server) {
      appender = new log4javascript.AjaxAppender(config.server.url);
      appender.setLayout(new log4javascript.JsonLayout());
      appender.setTimed(true);
      appender.setTimerInterval(500);
      appender.setSendAllOnTimer(true);
      appender.setBatchSize(10);
      appender.setWaitForResponse(false);
      appender.setSendAllOnUnload(true);
      var headers = _.extend({
        'content-type': 'application/json'
      }, config.server.headers);
      _.each(_.keys(headers), function (name) {
        appender.addHeader(name, headers[name]);
      });
      logger.addAppender(appender);
    }
  }
  logger.setLevel(log4javascript.Level.DEBUG);

  function log(target) {
    if (!(this instanceof log)) {
      return new log(target);
    }
    this._target = target;
    _.find(config.modules, function (settings, pattern) {
      if (matchModule(pattern, target) && settings.level) {
        this._threshold = getThreshold(settings.level);
      }
    }, this);
  }

  var prototype = {

    _threshold: threshold,

    config: config,

    enabled: enabled,

    last: undefined,

    can: function (level) {
      return this._threshold <= getThreshold(level);
    },

    debug: function () {
      if (enabled && this._threshold === thresholds.DEBUG) {
        var message = formatMessage.apply(this, arguments);
        if (loggerEnabled) {
          logger.debug(message);
        }
        if (consoleEnabled) {
          this.last = 'DBG  ' + message;
          return true;
        }
      }
      return false;
    },

    info: function () {
      if (enabled && this._threshold <= thresholds.INFO) {
        var message = formatMessage.apply(this, arguments);
        if (loggerEnabled) {
          logger.info(message);
        }
        if (consoleEnabled) {
          this.last = 'INF  ' + message;
          return true;
        }
      }
      return false;
    },

    warn: function () {
      if (enabled && this._threshold <= thresholds.WARN) {
        var message = formatMessage.apply(this, arguments);
        if (loggerEnabled) {
          logger.warn(message);
        }
        if (consoleEnabled) {
          this.last = 'WRN  ' + message;
          return true;
        }
      }
      return false;
    },

    error: function () {
      if (enabled) {
        var message = formatMessage.apply(this, arguments);
        if (loggerEnabled) {
          logger.error(message);
        }
        if (consoleEnabled) {
          this.last = 'ERR  ' + message;
          return true;
        }
      }
      return false;
    },

    getObjectName: function (object) {
      return object != null ? Object.getPrototypeOf(object).constructor.name :
             object === undefined ? 'undefined' : object === null ? 'null' : '';
    },

    getStackTrace: function (frameCountToSkip) {
      var stack;
      try {
        throw new Error();
      } catch (error) {
        stack = error.stack;
      }
      if (stack) {
        var lines = stack.split('\n');
        if (lines && lines.length>0) {
          if (!lines[0].match(/\.js/)) {
            lines = lines.slice(1);
          }
          stack = lines.slice(frameCountToSkip === 0 ? 0 : (frameCountToSkip || 1)).join('\n');
        }
      } else {
        stack = 'at unknown place (no stack trace available)';
      }
      return stack;
    }

  };

  function matchModule(pattern, target) {
    // Handle alone wildcards separately; they are handled depending on their
    // combination with slash (module path separator) below
    if (pattern === '**') {
      pattern = '.*';
    } else if (pattern === '*') {
      pattern = '[^/]*';
    } else {
      pattern = pattern.replace(/^\*(?!\*)/g, '#'); // '*some...'
      pattern = pattern.replace(/([^*])\*$/g, '$1#'); // '...some*'
      pattern = pattern.replace(/\/\*(?!\*)/g, '/#'); // '.../*some'
      pattern = pattern.replace(/([^*])\*\//g, '$1#/'); // 'some*/...'
      pattern = pattern.replace(/\/\*\*/g, '(?:/.*)?'); // '.../**'
      pattern = pattern.replace(/\*\*\//g, '(?:.*/)?'); // '**/...'
      // If we put the pattern with asterisks at once there, following
      // replacements would process it again and it would be too complicated
      // to avoid it; for example, JavaScript knows no look-behind assertions
      pattern = pattern.replace(/#/g, '[^/]*'); // '[^/]+' -> '[^/]*'
    }
    pattern = '^' + pattern + '$';
    return new RegExp(pattern).test(target);
  }

  function getThreshold(level) {
    var threshold = thresholds[(level || 'WARN').toUpperCase()];
    if (!threshold) {
      throw new Error('invalid log level: "' + level + '".');
    }
    return threshold;
  }

  function formatMessage(message) {
    if (message !== undefined) {
      if (typeof message === 'string') {
        message = _.str.sformat.apply(this, arguments);
      } else {
        message = message !== null ? message.toString() : 'null';
      }
      if (config.performanceTimeStamp) {
        message = getTimePerformanceStamp() + message;
      }
      if (config.moduleNameStamp && this._target) {
        message += ' (' + this._target + ')';
      }
    } else {
      message = '';
    }
    return message;
  }

  function getTimePerformanceStamp() {
    var seconds = (window.performance.now() / 1000 % 10).toFixed(3);
    return '[' + seconds + '] ';
  }

  _.extend(log, prototype);
  _.extend(log.prototype, prototype);

  return log;

});

csui.define('csui/utils/url',[
  'csui/lib/underscore', 'csui/lib/jquery'
], function (_, $) {
  'use strict';

  function Url(url) {
    this.raw = url;
  }

  Url.prototype = {
    raw: undefined,

    isValid: function () {
      return this.raw ? this.raw.match(Url.re_weburl) : false;
    },

    isAbsolute: function () {
      return this.raw ? this.raw.match(/^.*\/\//) : false;
    },

    getAbsolute: function () {
      return this.isAbsolute() ? this.raw :
             Url.combine(window.location.origin, this.raw);
    },

    getProtocol: function () {
      var url = this.isAbsolute() && this.raw.indexOf('//') !== 0 ?
                this.raw : window.location.href;
      return url.toLowerCase().substring(0, url.indexOf(':'));
    },

    getHost: function () {
      var match = this.getAbsolute().match(/^.*\/\/([^:\/]+)/);
      return match && match[1];
    },

    getPort: function () {
      var url = this.getAbsolute().toLowerCase(),
          start = url.match(/^.*\/\/([^\/]+)/),
          port = start && start[1].match(/:([^\/]+)/);
      return port ? parseInt(port[1], 10) : url.indexOf('https') === 0 ? 443 : 80;
    },

    getOrigin: function () {
      var match = this.getAbsolute().match(/^.*\/\/[^\/]+/);
      return match && match[0];
    },

    getPath: function () {
      var match = this.getAbsolute().match(/^.*\/\/[^\/]+(\/[^?]+)/);
      return match && match[1];
    },

    getVirtualDirectory: function () {
      var match = this.getAbsolute().match(/^.*\/\/[^\/]+\/[^\/]+/);
      return match && match[0];
    },

    getCgiScript: function () {
      var url = this.getAbsolute();
      // find the index of the "/api/v1" suffix in the URL.
      var apiSuffix = url.length - 7;
      if (url.charAt(this.raw.length - 1) === '/') {
        --apiSuffix;
      }
      if (url.lastIndexOf('/api/v1') === apiSuffix) {
        return url.substr(0, apiSuffix);
      }
      // Original functionality expecting always
      // "/folder/script" before "/api/v1" on the URL path.
      var match = url.match(/^.*\/\/[^\/]+\/[^\/]+\/[^\/]+/);
      return match && match[0];
    },

    getQuery: function () {
      var match = this.getAbsolute().match(/\?(.+)/);
      return match && match[1];
    },

    getApiBase: function (version) {
      version || (version = 'v1');
      typeof version === 'number' && (version = 'v' + version);
      return this.getCgiScript() + '/api/' + version + '/';
    },

    toString: function () {
      return this.raw;
    }
  };
  Url.version = '1.0';

  Url.combine = function () {
    var url = '';
    for (var i = 0; i < arguments.length; ++i) {
      var part = arguments[i],
          path = part !== undefined && part !== null ? part.toString() : '';
      // IE8 does not support accessing string characters as an array (path[0]).
      if (path.charAt(0) == '/') {
        url += url && url.charAt(url.length - 1) == '/' ? path.substring(1) :
               path;
      } else {
        if (i > 0 && !(url && url.charAt(url.length - 1) == '/') &&
            path.length > 0) {
          url += '/';
        }
        url += path;
      }
    }
    return url;
  };

  Url.makeMultivalueParameter = function (name, values) {
    if (values && values.length) {
      values = _.map(values, encodeURIComponent);
      return name + '=' + values.join('&' + name + '=');
    }
    return '';
  };

  // Supports either object literals {param: value, ...}
  // or already serialized strings 'param=value[&...]'
  Url.combineQueryString = function () {
    var query = {},
        i, part;
    for (i = 0; i < arguments.length; ++i) {
      part = arguments[i];
      if (_.isObject(part)) {
        _.extend(query, part);
      }
    }
    // Use traditional array serialization - without appending
    // the '[]' at the end of the property name
    query = $.param(query, true);
    for (i = 0; i < arguments.length; ++i) {
      part = arguments[i];
      if (_.isString(part) && part) {
        if (query) {
          query += '&';
        }
        query += part;
      }
    }
    return query;
  };

  Url.appendQuery = function (url, query) {
    if (url.indexOf('?') >= 0) {
      var lastCharacter = url[url.length - 1];
      if (lastCharacter !== '?' && lastCharacter !== '&') {
        url += '&';
      }
    } else {
      url += '?';
    }
    url += query;
    return url;
  };

  //
  // Regular Expression for URL validation
  //
  // Author: Diego Perini
  // Updated: 2010/12/05
  // License: MIT
  //
  // Copyright (c) 2010-2013 Diego Perini (http://www.iport.it)
  //
  // Permission is hereby granted, free of charge, to any person
  // obtaining a copy of this software and associated documentation
  // files (the "Software"), to deal in the Software without
  // restriction, including without limitation the rights to use,
  // copy, modify, merge, publish, distribute, sublicense, and/or sell
  // copies of the Software, and to permit persons to whom the
  // Software is furnished to do so, subject to the following
  // conditions:
  //
  // The above copyright notice and this permission notice shall be
  // included in all copies or substantial portions of the Software.
  //
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
  // EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
  // OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
  // NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
  // HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
  // WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
  // FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
  // OTHER DEALINGS IN THE SOFTWARE.
  //
  // the regular expression composed & commented
  // could be easily tweaked for RFC compliance,
  // it was expressly modified to fit & satisfy
  // these test for an URL shortener:
  //
  //   http://mathiasbynens.be/demo/url-regex
  //
  // Notes on possible differences from a standard/generic validation:
  //
  // - utf-8 char class take in consideration the full Unicode range
  // - TLDs have been made mandatory so single names like "localhost" fails
  // - protocols have been restricted to ftp, http and https only as requested
  //
  // Changes:
  //
  // - IP address dotted notation validation, range: 1.0.0.0 - 223.255.255.255
  //   first and last IP address of each class is considered invalid
  //   (since they are broadcast/network addresses)
  //
  // - Added exclusion of private, reserved and/or local networks ranges
  //
  // - Made starting path slash optional (http://example.com?foo=bar)
  //
  // - Allow a dot (.) at the end of hostnames (http://example.com.)
  //
  // Compressed one-line versions:
  //
  // Javascript version
  //
  // /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i
  //
  // PHP version
  //
  // _^(?:(?:https?|ftp)://)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\x{00a1}-\x{ffff}0-9]-*)*[a-z\x{00a1}-\x{ffff}0-9]+)(?:\.(?:[a-z\x{00a1}-\x{ffff}0-9]-*)*[a-z\x{00a1}-\x{ffff}0-9]+)*(?:\.(?:[a-z\x{00a1}-\x{ffff}]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$_iuS
  //
  Url.re_weburl = new RegExp(
      '^' +
      // protocol identifier
      '(?:(?:https?|ftp)://)' +
      // user:pass authentication
      '(?:\\S+(?::\\S*)?@)?' +
      '(?:' +
      // IP address exclusion
      // private & local networks
      '(?!(?:10|127)(?:\\.\\d{1,3}){3})' +
      '(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})' +
      '(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})' +
      // IP address dotted notation octets
      // excludes loopback network 0.0.0.0
      // excludes reserved space >= 224.0.0.0
      // excludes network & broacast addresses
      // (first & last IP address of each class)
      '(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])' +
      '(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}' +
      '(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))' +
      '|' +
      // host name
      '(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)' +
      // domain name
      '(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*' +
      // TLD identifier
      '(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))' +
      // TLD may end with dot
      '\\.?' +
      ')' +
      // port number
      '(?::\\d{2,5})?' +
      // resource path
      '(?:[/?#]\\S*)?' +
      '$', 'i'
  );

  return Url;
});

csui.define('csui/utils/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/utils/impl/nls/root/lang',{

  // base
  ColumnMemberName2: "{1} {0}",
  ColumnMemberName3: "{1} {2} {0}",
  sizeInBytes: "{0} bytes",

  // errormessage, messagehelper
  ErrorUnknown: "Unknown error.",
  InvalidResponse: "Invalid response received.",
  ErrorStatiNice: ["Confirm", "Error", "Warning", "Hint", "Information"],
  ErrorHtmlTpl: "<span class='msgIcon <%= statusPlain %>Icon'><%= statusNice %>: <%= msg %></span><br>",
  ErrorStringTpl: "<%= statusNice %>: <%= msg %>;\n",

  // connector
  AuthenticationFailureDialogTitle: "Authentication failure",
  SessionExpiredDialogTitle: "Session expired",
  AuthenticationFailureDialogText: "The page will be reloaded and you may need to sign in again.",

  // nodesprites - node types
  NodeTypeSearchQuery: 'Search',
  NodeTypeURL: 'Web address',
  // nodesprites - general formats
  NodeTypeAudio: 'Audio',
  NodeTypeCompressed: 'Compressed File',
  NodeTypeImage: 'Image',
  NodeTypeText: 'Text Document',
  NodeTypeHtml: 'Html Document',
  NodeTypeUnknown: 'Unknown',
  NodeTypeVideo: 'Video',
  // nodesprites - application formats
  NodeTypeDOC: 'Microsoft Word',
  NodeTypePDF: 'Portable Document Format',
  NodeTypePPT: 'Microsoft Powerpoint',
  NodeTypePresentation: 'Presentation',
  NodeTypeXLS: 'Microsoft Excel',
  NodeTypeSpreadsheet: 'Spreadsheet',
  NodeTypeFormula: 'Formula',
  NodeTypePublisher: 'Microsoft Publisher',
  NodeTypeVisio: 'Microsoft Visio',
  NodeTypeMPP: 'Microsoft Project',
  NodeTypeONE: 'Microsoft OneNote',

  NoConnectivity: "No connectivity",
  NetworkError: "Network communication failed.",
  Home: 'Home'
});


csui.define('csui/utils/errormessage',["module", "csui/lib/jquery", "csui/lib/underscore",
  "csui/lib/backbone", "csui/utils/log", "csui/utils/url",
  'i18n!csui/utils/impl/nls/lang'
], function (module, $, _, Backbone, log, Url, lang) {
  "use strict";

  // MessageType
  // -----------

  var Type = {
    Confirm: 0,
    Error: 1,
    Warning: 2,
    Hint: 3,
    Info: 4
  };

  // Message
  // -------

  var Message = Backbone.Model.extend({

    constructor: function Message(attributes) {
      //debugger;
      Backbone.Model.prototype.constructor.apply(this, arguments);
      if (attributes instanceof Error) {
        this.attributes.message = attributes.message;
        this.attributes.name = attributes.name;
      }
    },

    defaults: {
      type: Type.Error,
      name: '',
      message: lang.ErrorUnknown
    },

    getType: function () {
      return this.get('type');
    },

    getName: function () {
      return this.get('name');
    },

    getMessage: function () {
      return this.get('message');
    }
  });

  // ErrorMessage
  // ------------

  var ErrorMessage = Message.extend({
    constructor: function ErrorMessage(attributes) {
      Message.Message.prototype.constructor.apply(this, arguments);
    },

    defaults: {
      type: Type.Error,
      message: lang.ErrorUnknown
    }
  });

  // RequestErrorMessage
  //--------------------

  var RequestErrorMessage = ErrorMessage.extend({
    defaults: {
      statusCode: undefined,
      statusText: undefined,
      errorDetails: undefined
    },

    constructor: function RequestErrorMessage(error) {
      Message.ErrorMessage.prototype.constructor.apply(this, arguments);
      if (error) {
        if (error.status != null) {
          // Allow passing in a jQuery request object for convenience.
          this.statusCode = error.status;
          this.statusText = error.statusText;
          if (error.responseText) {
            try {
              error.responseJSON = JSON.parse(error.responseText);
            } catch (failure) {
              log.warn("Parsing error response failed: {0}.", failure)
              && console.warn(log.last);
            }
          }
          if (error.responseJSON) {
            var data = error.responseJSON;
            this.message = data && data.error;
            if (!this.message) {
              this.message = error.responseText;
            }
            this.errorDetails = data && data.errorDetail;
          }
          if (!this.message) {
            if (this.statusCode === 0) {
              this.message = lang.NetworkError;
            } else {
              this.message = lang.InvalidResponse;
            }
          }
          if (error.settings && error.settings.url) {
            this.method = error.settings.type;
            this.url = error.settings.url;
          }
        } else if (typeof error.error === 'object') {
          // Allow passing in a data object with error description for convenience.
          this.message = error.error;
          this.errorDetails = error.errorDetail;
        } else if (error instanceof Backbone.Model) {
          // Allow passing an Model for convenience, but this is filled with Error data. weird.
          this.message = error.message || error.get('error');
          this.errorDetails = error.errorDetails || error.errorDetail || error.get('errorDetails') || error.get('errorDetail');
        } else if (error instanceof Error) {
          // Allow passing an Error instance for convenience.
          this.message = error.message;
        } else {
          // Expect the attributes of this error object passed in.
          _.extend(this, error);
        }
      }
    }

  });

  RequestErrorMessage.prototype.toString = function () {
    var punctuation = /[.!?:;,]$/;
    var trim = /\s+$/;
    var message = "";
    if (this.message) {
      message = this.message;
      message.replace(trim, "");
      if (!message.match(punctuation)) {
        message += ".";
      }
    }
    if (this.errorDetails) {
      if (message) {
        message += "\r\n";
      }
      message += this.errorDetails;
      message.replace(trim, "");
      if (!message.match(punctuation)) {
        message += ".";
      }
    }
    if (!message) {
      if (this.statusText) {
        if (message) {
          message += "\r\n";
        }
        message += this.statusText;
      }
      if (this.statusCode > 0) {
        if (message) {
          message += "\r\n ";
        }
        message += "(" + this.statusCode + ")";
      }
    }
    if (!message) {
      message = lang.ErrorUnknown;
    }
    return message;
  };

  RequestErrorMessage.version = '1.0';

  // Exports
  // -------

  Message = {
    verion: '1.0',
    Type: Type,
    Message: Message,
    ErrorMessage: ErrorMessage,
    RequestErrorMessage: RequestErrorMessage
  };

  return Message;

});

csui.define('csui/utils/messagehelper',["module", "csui/lib/jquery", "csui/lib/underscore", "csui/lib/backbone",
  "csui/utils/log", "csui/utils/errormessage", 'i18n!csui/utils/impl/nls/lang'
], function (module, $, _, Backbone, log, Message, Lang) {
  "use strict";

  log = log(module.id);

  // MessageHelper
  // ------------

  var ts = "0.3s";
  // as we implement animation fix for top property, we use styles here and not css classes.
  var animationShow = {"-webkit-transition": "top " + ts, "transition": "top " + ts};
  var animationHide = {"-webkit-transition": "top " + ts, "transition": "top " + ts};
  var animationNone = {"-webkit-transition": "", "transition": ""};
  var animationFadeOut = {
    "-webkit-transition": "opacity " + ts,
    "transition": "opacity " + ts
  };

  var MessageHelper = Backbone.Collection.extend({
    model: Message.Message,
    title: '',

    showMessages: function (reset, show) {
      log.warn(
          'This method has been deprecated and will be removed in future. ' +
          'Please, use MoalAler or GlobalMessaage to report errors.')
      && console.warn(log.last);

      var title = Lang.ErrorStatiNice[this.getStatus()],
          showit = (show !== undefined) ? show : true;

      this.trigger("showErrors", this.groupBy('type'), this.toHtml(), title,
          showit);
      reset && this.reset();
    },

    addMessage: function (txt, type, title) {
      this.title = title || '';
      type = type || Message.Type.Error;
      var msg = new Message.Message({
        type: type,
        message: txt
      });
      return this.add([msg]);
    },

    showErrors: function (reset, show) {
      return this.showMessages(reset, show);
    },

    addError: function (error) {
      var errmsg = new Message.ErrorMessage();
      errmsg.message = error.message;
      return this.add([errmsg]);
    },

    addErrorMessage: function (errorts) {
      return this.add([errorts]);
    },

    getStatus: function () {
      return this.sortBy('type')[0].get('type');
    },

    clear: function () {
      return this.reset();
    },

    hasMessages: function () {
      return (this.length > 0);
    },

    getMessages: function () {
      return this.groupBy('type');
    },

    toHtml: function () {
      var template = _.template(Lang.ErrorHtmlTpl),
          html = [];

      _.each(this.groupBy('type'), function (msgType) {
        _.each(msgType.reverse(), function (msg) {
          html += template({
            statusPlain: _.keys(Message.Type)[msg.get('type')],
            statusNice: Lang.ErrorStatiNice[msg.get('type')],
            msg: msg.get('message')
          });
        });
      });

      return html;
    },

    removeField: function (viewel, selector, values) {
      var elem = viewel.find(selector);
      values.forEach(function (oldval) {
        var oldclass = selector + "-" + oldval;
        var oldel = elem.find(oldclass);
        if (!oldel.hasClass("binf-hidden")) {
          oldel.addClass("binf-hidden");
        }
      });
    },
    switchField: function (viewel, selector, value, values) {
      var elem = viewel.find(selector);
      var newclass = selector + "-" + value;
      var newel = elem.find(newclass);
      var changed = false;
      if (newel.hasClass("binf-hidden")) {
        values.forEach(function (oldval) {
          var oldclass = selector + "-" + oldval;
          if (newclass != oldclass) {
            var oldel = elem.find(oldclass);
            if (!oldel.hasClass("binf-hidden")) {
              oldel.addClass("binf-hidden");
            }
          }
        });
        newel.removeClass("binf-hidden");
        changed = true;
      }
      return {changed: changed, element: newel};
    },

    transitionEnd: _.once(
        function () {
          var transitions = {
                transition: 'transitionend',
                WebkitTransition: 'webkitTransitionEnd',
                MozTransition: 'transitionend',
                OTransition: 'oTransitionEnd otransitionend'
              },
              element = document.createElement('div'),
              transition;
          for (transition in transitions) {
            if (typeof element.style[transition] !== 'undefined') {
              return transitions[transition];
            }
          }
        }
    ),

    createPanel: function (globals, Panel, options, oldPanel) {
      var newPanel = new Panel(options);
      newPanel.$el.removeClass("binf-panel binf-panel-default");
      newPanel.$el.addClass("csui-global-message");
      globals.classNames && newPanel.$el.addClass(globals.classNames);

      // render panel
      newPanel.render();

      // take state from old panel
      if (oldPanel) {
        if (oldPanel.$el.hasClass("binf-hidden") !=
            newPanel.$el.hasClass("binf-hidden")) {
          newPanel.$el.toggleClass("binf-hidden");
        }
        var collapsed = oldPanel.$el.hasClass("csui-collapsed");
        if (collapsed != newPanel.$el.hasClass("csui-collapsed")) {
          if (collapsed) {
            newPanel.doCollapse(false);
          } else {
            newPanel.doExpand(false);
          }
        }
      }
      return newPanel;
    },

    activatePanel: function (newPanel, relatedView, parentView, oldPanel) {
      if (!oldPanel && !newPanel.$el.hasClass("binf-hidden")) {
        // if we need to animate, add it hidden and then show it animated
        newPanel.$el.addClass("binf-hidden");
        newPanel.$el.appendTo(parentView.el);
        newPanel.doShow(relatedView, parentView);
      } else {
        if (relatedView) {
          this.resizePanel(newPanel, relatedView);
        }
        newPanel.$el.appendTo(parentView.el);
        if (oldPanel) {
          oldPanel.destroy();
        }
      }
      return newPanel;
    },

    showPanel: function (view, relatedView, parentView) {
      if (view.$el.hasClass("binf-hidden")) {
        var self = this,
            slideSize = this.getTargetSizes(parentView.$el);
        var panel = _.extend({
          csuiBeforeShow: function () {
            if (relatedView) {
              var panelSize = self.getTargetSizes(relatedView.$el);
              self.setPanelHeight(view, panelSize);
            }
          }
        }, view);
        this.slidedown(panel, view.$el, view.$el, slideSize);
      }
    },

    slidedown: function (view, elem, hidden, sizes) {
      // Do not slide the element from too far; at most the element height
      var distance, elemHeight;
      hidden = hidden || elem;

      view.$el === elem || view.$el.removeClass("csui-collapsed");
      view.$el.removeClass(view.$el === elem ? "csui-hiding" : "csui-collapsing");
      view.$el.addClass(view.$el === elem ? "csui-showing" : "csui-expanding");
      if (view.csuiBeforeShow) {
        view.csuiBeforeShow();
      }

      var position = elem.css("position");
      if (hidden.hasClass("binf-hidden")) {
        // first be sure, that no animation delays any settings, while panel is hidden
        elem.css(animationNone);
        elem.addClass('position-hidden');
        // prepare view for animation
        if (elem !== hidden) {
          elemHeight = elem.height();
          distance = Math.min(sizes.height - sizes.top, elemHeight);
          elem.css({
            "bottom": "calc(100% - " + (sizes.top + distance) + "px)"
          });
        }
        // when now making the element visible, the browser layouts the element but the bottom is
        // forced where it was before
        hidden.removeClass("binf-hidden");
        elemHeight = elem.height();
        // now switch to set the top property without moving the element.
        var rect = this.getTargetSizes(elem);
        if (position === "relative") {
          distance = Math.min(sizes.height - rect.height, elemHeight);
          elem.css({
            "top": distance + "px"
          });
        } else /* if (position==="absolute") */ {
          distance = Math.min(rect.top, sizes.top + elemHeight);
          elem.css({
            "top": distance + "px"
          });
        }
        elem.removeClass('position-hidden');
        elem.addClass('position-show');
        var pos = elem.position(); // just access property, so browser updates element
      }
      elem.one(this.transitionEnd(), function () {
        if (view.$el === elem ? "csui-showing" : "csui-expanding") {
          elem.css(animationNone);
          view.$el.removeClass(view.$el === elem ? "csui-showing" : "csui-expanding");
          if (view.csuiAfterShow) {
            view.csuiAfterShow();
          }
        }
      });
      // trigger animation by setting the top property to its initial value
      if (position === "relative") {
        elem.css(_.extend({"top": "0px"}, animationShow));
      } else /* if (position==="absolute") */ {
        elem.css(_.extend({"top": sizes.top + "px"}, animationShow));
      }

      return view;
    },

    expandPanel: function (view, details, hidden, animated) {
      hidden = hidden || details;
      if (view.$el.hasClass("csui-collapsed") || hidden.hasClass("binf-hidden") ||
          view.$el.hasClass("csui-collapsing")) {
        animated = (animated === true || animated === undefined) ? true : false;
        if (animated) {
          this.slidedown(view, details, hidden, this.getTargetSizes(details));
        }
        else {
          view.$el.removeClass("csui-collapsed");
          hidden.removeClass("binf-hidden");
        }
      }
    },

    hidePanel: function (view) {
      if (!view.$el.hasClass("binf-hidden")) {
        this.slideup(view, view.$el, view.$el);
      }
    },

    slideup: function (view, elem, hidden) {

      hidden = hidden || elem;
      // hide panel with slide up animation. does only make sense if element is not hidden.
      var position = elem.css("position");
      view.$el.removeClass(view.$el === elem ? "csui-showing" : "csui-expanding");
      view.$el.addClass(view.$el === elem ? "csui-hiding" : "csui-collapsing");
      if (view.csuiBeforeHide) {
        view.csuiBeforeHide();
      }
      elem.one(this.transitionEnd(), function () {
        if (view.$el.hasClass(view.$el === elem ? "csui-hiding" : "csui-collapsing")) {
          hidden.addClass("binf-hidden");
          elem.css(_.extend({"top": "", "bottom": ""}, animationNone));
          view.$el.removeClass(view.$el === elem ? "csui-hiding" : "csui-collapsing");
          view.$el === elem || view.$el.addClass("csui-collapsed");
          if (view.csuiAfterHide) {
            view.csuiAfterHide();
          }
        }
      });
      var rect = this.getTargetSizes(elem);
      if (position === "relative") {
        elem.css({"top": "0px"});
      } else /* if (position==="absolute") */ {
        elem.css({"top": rect.top + "px"});
      }
      var pos = elem.position(); // just access property, so browser updates element
      // check whether wie have a minimum height, where we should stop the slideup
      var min_top = 0;
      var idattr = elem.attr("id");
      if (idattr && elem.hasClass("csui-minheight")) {
        var heightSource = elem.find("." + idattr + "-heightsource");
        if (heightSource.length > 0) {
          min_top = heightSource.outerHeight();
        }
      }
      // trigger animation by setting the property
      elem.css(
          _.extend({"top": (parseInt(min_top) - rect.height) + "px"}, animationHide));
      return elem;
    },

    collapsePanel: function (view, details, hidden, animated) {
      hidden = hidden || view.$el;
      if (!view.$el.hasClass("csui-collapsed") || !hidden.hasClass("binf-hidden") ||
          view.$el.hasClass("csui-expanding")) {
        animated = (animated === true || animated === undefined) ? true : false;
        if (animated) {
          this.slideup(view, details, hidden);
        }
        else {
          view.$el.addClass("csui-collapsed");
          hidden.addClass("binf-hidden");
        }
      }
    },

    fadeoutPanel: function (view) {

      // hide panel with fade out animation. does only make sense if element is not hidden.
      var opacity = view.$el.css("opacity") || "1";
      view.$el.css({"opacity": opacity});
      // prepare view for animation
      view.$el.one(this.transitionEnd(), function () {
        view.$el.addClass("binf-hidden");
        view.$el.css(_.extend({"opacity": ""}, animationNone));
        if (view.csuiAfterHide) {
          view.csuiAfterHide();
        }
      });
      var opq = view.$el.css("opacity"); // just access property, so browser updates element
      // trigger animation by setting the property
      view.$el.css(_.extend({"opacity": "0.0"}, animationFadeOut));
      return view;
    },

    resizePanel: function (view, location) {
      if (location) {
        var sizes = this.getTargetSizes(location.$el);
        this.setPanelHeight(view, sizes);
      }
      view.doResize && view.doResize();
    },

    getTargetSizes: function (location) {
      if (location) {
        var rect = location[0].getBoundingClientRect();
        return _.extend({width: rect.width, height: rect.height}, location.position());
      } else {
        return {left: 0, top: 0, width: 333, height: 63};
      }
    },

    setPanelHeight: function (view, sizes) {
      view.$el.find(".csui-height-target").height(sizes.height);
      return view;
    }

  });

  MessageHelper.prototype.toString = function () {
    var template = _.template(Lang.ErrorStringTpl),
        html = [];

    _.each(this.groupBy('type'), function (msgType) {
      _.each(msgType, function (msg) {
        html += template({
          statusPlain: _.keys(Message.Type)[msg.get('type')],
          statusNice: Lang.ErrorStatiNice[msg.get('type')],
          msg: msg.get('message')
        });
      });
    });

  };

  MessageHelper.version = '1.0';

  // activate eventing on error handler
  _.extend(MessageHelper, Backbone.Events);

  // Exports
  // -------

  return MessageHelper;

});

csui.define('csui/utils/types/date',[
  'module', 'csui/lib/underscore', 'csui/lib/moment',
  'csui/lib/moment-timezone'
], function (module, _, moment) {
  'use strict';

  var config = window.csui.requirejs.s.contexts._.config
    .config['csui/utils/base'] || {};
  config = _.extend({
    friendlyDateTime: true,
    friendlyTime: true,
    friendlyDate: true,
    formatIsoDateTimeInUtc: false,
    formatIsoDateTimeInTimeZone: undefined
  }, config, module.config());

  var momentDateFormat     = 'L',
      momentTimeFormat     = 'LTS',
      momentDateTimeFormat = momentDateFormat + ' ' + momentTimeFormat,
      exactDateFormat      = getExactFormat(momentDateFormat),
      exactTimeFormat      = getExactFormat(momentTimeFormat),
      exactDateTimeFormat  = getExactFormat(momentDateTimeFormat);

  // Moment's longDateFormat need the formatting parts like "L" otr "LTS"
  // separately; it does not accept a combined string
  function getExactFormat(momentFormat) {
    var formatters     = /\w+/g,
        explicitFormat = momentFormat,
        shift          = 0,
        match, part, partFormat, index;
    while ((match = formatters.exec(momentFormat))) {
      part = match[0];
      partFormat = moment.localeData().longDateFormat(part);
      // Skip words in the format, which are not moment's tokens
      if (partFormat) {
        index = match.index + shift;
        explicitFormat = explicitFormat.substring(0, index) + partFormat +
                         explicitFormat.substring(index + part.length);
        shift += partFormat.length - part.length;
      }
    }
    // If the format was expanded, try it once more, in case moment
    // placeholders were used recursively like "LT:ss"
    return explicitFormat !== momentFormat ?
      getExactFormat(explicitFormat) : explicitFormat;
  }

  // static helper methods

  function pad(n) {
    return n < 10 ? '0' + n : n;
  }

  // Creates a new moment object in the local (client) time zone
  // from a string in the ISO 8601 format sent by the server, or
  // from a Date object instance, or from a Moment instance.
  function createMoment(text) {
    // Checks if the text, which should be in the ISO 8601 format,
    // ends with the UTC identifier or a time zone offset.
    function includesTimeZone(text) {
      var length = text.length;
      if (length > 19) {
        if (text.charAt(length - 1) === 'Z') {
          return true;
        }
        var direction = text.charAt(length - 5);
        if (direction === '+' || direction === '-') {
          return true;
        }
      }
    }

    if (text instanceof moment) {
      return text;
    }
    if(text instanceof Date) {
      return moment(text);
    }
    return config.formatIsoDateTimeInTimeZone && !includesTimeZone(text) ?
           moment.tz(text, config.formatIsoDateTimeInTimeZone) : moment(text);
  }

  // Parses the text in the ISO 8601 format as sent by the server
  // to a Date object instance in the local (client) time zone.
  function deserializeDate(text) {
    return text && createMoment(text).toDate();
  }

  // Formats the date in the local (client) time zone to a sub-set
  // of ISO 8601 for the server.
  function serializeDateTime(date, format, callback) {
    function formatDateTime(date, suffix) {
      // CS does not accept te standard ISO value returned
      // by toISOString, which includes milliseconds.
      return date.year() + '-'
             + pad((date.month() + 1)) + '-'
             + pad(date.date()) + 'T'
             + pad(date.hours()) + ':'
             + pad(date.minutes()) + ':'
             + pad(date.seconds()) + suffix;
    }

    format || (format = exactDateTimeFormat);
    var parsed = moment(date, format, true);
    if (!parsed.isValid()) {
      if (!!callback) {
        callback();
      } else {
        throw new Error('Parsing date value "' + date +
                        '" as "' + format + '" failed.');
      }
    }

    if (config.formatIsoDateTimeInUtc) {
      return formatDateTime(parsed.utc(), 'Z');
    }

    if (config.formatIsoDateTimeInTimeZone) {
      return formatDateTime(parsed.tz(config.formatIsoDateTimeInTimeZone), '');
    }

    return formatDateTime(parsed, '');
  }

  // Formats the date to a sub-set of ISO 8601 - only the date part.
  function serializeDate(date, format, callback) {
    format || (format = exactDateFormat);
    var parsed = moment(date, format, true);
    if (!parsed.isValid()) {
      if (!!callback) {
        callback();
      } else {
        throw new Error('Parsing date value "' + date +
                        '" as "' + format + '" failed.');
      }
    }
    return parsed.year() + '-'
           + pad((parsed.month() + 1)) + '-'
           + pad(parsed.date());
  }

  function validateDate(date, format) {
    return moment(date, format || exactDateFormat, true).isValid();
  }

  function validateDateTime(date, format) {
    return moment(date, format || exactDateTimeFormat, true).isValid();
  }

  function formatDate(date) {
    return config.friendlyDate ? formatFriendlyDate(date) : formatExactDate(date);
  }

  function formatDateTime(date) {
    return config.friendlyDateTime ? formatFriendlyDateTime(date) :
           formatExactDateTime(date);
  }

  function formatExactDate(date) {
    return date ? createMoment(date).format(exactDateFormat) : '';
  }

  function formatExactTime(date) {
    return date ? createMoment(date).format(exactTimeFormat) : '';
  }

  function formatExactDateTime(date) {
    return date ? createMoment(date).format(exactDateTimeFormat) : '';
  }

  function formatFriendlyDate(date) {
    return date ? createMoment(date).calendar() : "";
  }

  function formatFriendlyDateTime(date) {
    return date ? createMoment(date).calendar() : "";
  }

  function formatFriendlyDateTimeNow(date) {
    return date ? createMoment(date).fromNow() : "";
  }

  function formatISODate(date) {
    return date ? moment.utc(date).toISOString() : "";
  }

  function formatISODateTime(date) {
    return date ? moment(date).toISOString() : "";
  }

  return {
    exactDateFormat: exactDateFormat,
    exactTimeFormat: exactTimeFormat,
    exactDateTimeFormat: exactDateTimeFormat,

    deserializeDate: deserializeDate,
    serializeDate: serializeDate,
    serializeDateTime: serializeDateTime,

    validateDate: validateDate,
    validateDateTime: validateDateTime,

    formatDate: formatDate,
    formatDateTime: formatDateTime,
    formatExactDate: formatExactDate,
    formatExactTime: formatExactTime,
    formatExactDateTime: formatExactDateTime,
    formatFriendlyDate: formatFriendlyDate,
    formatFriendlyDateTime: formatFriendlyDateTime,
    formatFriendlyDateTimeNow: formatFriendlyDateTimeNow,
    formatISODateTime: formatISODateTime,
    formatISODate: formatISODate,
  };
});

csui.define('csui/utils/types/number',[
  'module', 'csui/lib/underscore', 'csui/lib/numeral',
  'i18n!csui/utils/impl/nls/lang'
], function (module, _, numeral, lang) {
  'use strict';

  var config = window.csui.requirejs.s.contexts._.config
    .config['csui/utils/base'] || {};
  config = _.extend({
    friendlyFileSize: true
  }, config, module.config());

  function formatInteger(value, format) {
    format || '0';
    return numeral(value).format(format);
  }

  function formatIntegerWithCommas(value) {
    return formatInteger(value, '0,0');
  }

  function formatFileSize(size) {
    return config.friendlyFileSize ? formatFriendlyFileSize(size) :
           formatExactFileSize(size);
  }

  function formatFriendlyFileSize(size) {
    if (!_.isNumber(size)) {
      return '';
    }
    return size >= 1024 ? numeral(size).format('0 b') :
           formatExactFileSize(size);
  }

  function formatExactFileSize(size) {
    if (!_.isNumber(size)) {
      return '';
    }
    size = formatIntegerWithCommas(size);
    return _.str.sformat(lang.sizeInBytes, size);
  }

  return {
    formatInteger: formatInteger,
    formatIntegerWithCommas: formatIntegerWithCommas,

    formatFileSize: formatFileSize,
    formatFriendlyFileSize: formatFriendlyFileSize,
    formatExactFileSize: formatExactFileSize
  };
});

csui.define('csui/utils/types/member',[
  'csui/lib/underscore', 'csui/lib/backbone',
   'i18n!csui/utils/impl/nls/lang'
], function (_, Backbone, lang) {
  'use strict';

  function formatMemberName(member) {
    if (!member) {
      return '';
    }
    if (_.isNumber(member) || _.isString(member)) {
      return member.toString();
    }
    if (member instanceof Backbone.Model) {
      member = member.attributes;
    }
    if (member.display_name) {
      return member.display_name;
    }
    if (member.name_formatted) {
      return member.name_formatted;
    }
    var firstName  = member.first_name,
        lastName   = member.last_name,
        middleName = member.middle_name,
        name;
    if (firstName) {
      if (middleName) {
        name = _.str.sformat(lang.ColumnMemberName3, lastName, firstName, middleName);
      } else if (lastName) {
        name = _.str.sformat(lang.ColumnMemberName2, lastName, firstName);
      } else {
        name = firstName;
      }
    } else {
      name = lastName;
    }
    return name || member.name_formatted || member.name
           || member.id && member.id.toString() || '';
  }

  return {
    formatMemberName: formatMemberName
  };
});

csui.define('csui/utils/types/localizable',[
  'csui/lib/underscore', 'i18n' 
], function (_, i18n) {
  'use strict';

  var locale = i18n.settings.locale,
      language = locale.replace(/[-_]\w+$/, ''),
      defaultLocale = i18n.settings.defaultLocale,
      defaultLanguage = defaultLocale.replace(/[-_]\w+$/, '');

  function getClosestLocalizedString(value, fallback) {
    if (_.isObject(value)) {
      // Normalize locale keys to 'll-cc' to be able to look up the right one;
      // the CS REST API uses non-standard 'll_CC' in multilingual metadata
      value = _.reduce(value, function (result, text, locale) {
        locale = locale.toLowerCase().replace('_', '-');
        result[locale] = text;
        return result;
      }, {});
      value = value[locale] || value[language] ||
              value[defaultLocale] || value[defaultLanguage] || fallback;
    }
    return value != null && value.toString() || '';
  }

  function localeCompareString(left, right, options) {
    options || (options = {});
    // Default is the search usage - ignore case, recognize transliterations
    var usage = options.usage || 'search',
        // Do not accept everything; this method ensures a consistent
        // behaviour of the product - it should not be freely customizable
        filteredOptions = {
          // Passing an undefined usage would even ignore differences in
          // accents, improving the search usage to the Google behaviour.
          // However, it stops the transliteration support, at least in
          // Chrome, unfortunately.  Transliteration is more important,
          // because it is needed by grammar, while omitting accents is
          // a workaround only, if you cannot type the characters with
          // accents on the keyboard.
          usage: usage,
          // Default for the search usage should be always base sensitivity,
          // but it depends on locale, which would confuse the user
          sensitivity: usage === 'search' ? 'base' : 'variant',
          // Number digits should not be normalized in string excerpts, when
          // searching, but when sorting, they should be handled as numbers
          numeric: usage !== 'search'
        };

    if (!left || !right) {
      return !left ? (!right ? 0 : 1) : -1;
    }

    if (left.localeCompare) {
      try {
        return left.localeCompare(right, locale, filteredOptions);
      } catch (error) {}
    }

    left = left.toLowerCase();
    right = right.toLowerCase();
    return left < right ? -1 : left > right ? 1 : 0;
  }

  function localeContainsString(hay, needle) {
    return localeIndexOfString(hay, needle) >= 0;
  }

  function localeEndsWithString(full, end) {
    // FIXME: How many maximum characters can the transliteration add?
    var fullLength = full.length,
        maxLength  = Math.min(fullLength, end.length * 3),
        i;
    for (i = 1; i <= maxLength; ++i) {
      if (localeCompareString(full.substring(fullLength - i), end) === 0) {
        return true;
      }
    }
  }

  function localeIndexOfString(hay, needle) {
    var difference = hay.length - needle.length + 1,
        i;
    for (i = 0; i <= difference; ++i) {
      if (localeStartsWithString(hay.substring(i), needle)) {
        return i;
      }
    }
    return -1;
  }

  function localeStartsWithString(full, start) {
    // FIXME: How many maximum characters can the transliteration add?
    var maxLength = Math.min(full.length, start.length * 3),
        i;
    for (i = 1; i <= maxLength; ++i) {
      if (localeCompareString(full.substring(0, i), start) === 0) {
        return true;
      }
    }
  }

  // After the formats parameter there can be additionally parameters specified. They must be of type "string"!
  //
  // We need for each message type 3 or 4 sentences. In many languages for multiple items there is an additional sentence required,
  // that means we need a sentence for one item ("ForOne"), for up to four items ("ForTwo") and for more items ("ForFive"). In english and german
  // the "ForTwo" and "ForFive" sentences are normally the same. We need also a "ForNone" sentence, if nothing is processed.
  //
  // For example czech (item = soubor):
  //    žádný soubor        => none (s0, optional)
  //    ---
  //    1 soubor            => one  (s1)
  //    ---
  //    2 soubory           => some (s2)
  //    3 soubory
  //    4 soubory
  //    ---
  //    5 souborů           => many (s5)
  //    6 souborů
  //    ...
  //    n souborů
  //    ---
  //    0 souborů           => manu (s5, fallback)
  //
  // formats[success].none = žádný soubor ... succeeded.
  // formats[success].one = 1 soubor ... succeeded.
  // formats[success].two = 3 soubory ... succeeded.
  // formats[success].five = 8 souborů ... succeeded.
  //
  // formats[failure].one = 1 soubor ... failed.
  // formats[failure].two = 3 soubory ... failed.
  // formats[failure].five = 8 souborů ... failed.
  // formats[failure].five = 0 souborů ... failed.
  //
  // formats[partial].two = 1 soubor ze 3 souborů ... failed.
  // formats[partial].five = 2 soubory z 15 souborů ... failed.
  //
  // Returns formatted message string.

  function formatMessage(count, messagesObj) {
    var SUCCESS_TYPE = "success";
    var ERROR_TYPE = "error";

    // get all additional parameters, except promises, options and formats
    var params = Array.prototype.slice.call(arguments, 2);
    var formatStr;

    if (count > 4) {
      formatStr = messagesObj.formatForFive;
    } else if (count > 1) {
      formatStr = messagesObj.formatForTwo;
    } else if (count > 0) {
      formatStr = messagesObj.formatForOne;
    } else {
      formatStr = messagesObj.formatForNone || messagesObj.formatForFive;
    }

    params.splice(0, 0, count.toString()); // insert count into params at index 0
    params.splice(0, 0, formatStr);        // insert formatStr into params at index 0
    var msg = _.str.sformat.apply(_.str, params);

    return msg;
  }

  return {
    getClosestLocalizedString: getClosestLocalizedString,

    localeCompareString: localeCompareString,
    localeContainsString: localeContainsString,
    localeEndsWithString: localeEndsWithString,
    localeIndexOfString: localeIndexOfString,
    localeStartsWithString: localeStartsWithString,

    formatMessage: formatMessage
  };
});

csui.define('csui/utils/base',[
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/url',
  'csui/utils/errormessage', 'csui/utils/messagehelper',
  'csui/utils/types/date', 'csui/utils/types/number',
  'csui/utils/types/member', 'csui/utils/types/localizable', 'i18n'
], function (_, $, Url, Message, MessageHelper, date, number, member,
    localizable, i18n) {
  'use strict';

  var $window = $(window);

  // handler as singleton, bind dialog to handler
  var messageHelper = new MessageHelper();
  // TODO: Implement a component showing the errors
  messageHelper.on("showErrors", function (errors, html, title, showit) {
    alert($(html).text());
  });

  var escapeHtmlHelper = $("<p></p>");

  function escapeHtml(text, preserveLineBreaks) {
    // There's no HTML escaping function which would return a text to be
    // concatenated with the rest of the raw HTML markup so that the text
    // value would be the same and not interpreted as HTML markup.
    // Let's use an artificial DOM element for this, wrapped with jQuery.
    var html = escapeHtmlHelper.text(text).html();
    if (preserveLineBreaks) {
      html = html.replace(/\r?\n/g, "\r\n<br>");
    }
    return html;
  }

  function isBackbone(value) {
    // descendant of Backbone.Events
    return value && value.once;
  }

  function isPlaceholder(value) {
    // string selector, DOM object or jQuery object
    return value && (_.isString(value) || _.isElement(value) || value instanceof $);
  }

  function isTouchBrowser() {
    return !!(('ontouchstart' in window) || (navigator.maxTouchPoints) ||
              (navigator.msMaxTouchPoints));
  }

  function isAppleMobile() {
    if (navigator && navigator.userAgent != null) {
      var appleMatches = navigator.userAgent.match(/(iPhone |iPad)/i);
      return (appleMatches != null);
    }
    return true;
  }

  function isMacintosh() {
    return navigator.platform.indexOf('Mac') > -1;
  }

  function isLandscape() {
    return isAppleMobile() && (window.matchMedia("(orientation: landscape)").matches);
  }

  function isPortrait() {
    return isAppleMobile() && (window.matchMedia("(orientation: portrait)").matches);
  }

  function isIE11() {
    if (navigator && navigator.userAgent) {
      var isInternetExplorer11 = /Trident.*11/i.test(navigator.userAgent);
      return isInternetExplorer11;
    }
  }

  function isMozilla() {
    if (navigator && navigator.userAgent) {
      var isMozilla = /Mozilla/.test(navigator.userAgent);
      return isMozilla;
    }
  }

  function isEdge() {
    if (navigator && navigator.userAgent) {
      var isEdge = /Edge/.test(navigator.userAgent);
      return isEdge;
    }
  }

  function isFirefox() {
    if (navigator && navigator.userAgent) {
      var isFirefox = /Firefox/.test(navigator.userAgent);
      return isFirefox;
    }
  }

  /**
   * returns true if the current browser is either IE11
   * or Edge (from Windows 10).
   *
   @returns {}
   */
  function isMSBrowser() {
    return isIE11() || isEdge();
  }

  function isChrome() {
    // please note,
    // that IE11 now returns undefined again for window.chrome
    // and new Opera 30 outputs true for window.chrome
    // and new IE Edge outputs to true now for window.chrome
    // and if not iOS Chrome check
    // so use the below updated condition
    var isChromium  = window.chrome,
        winNav      = window.navigator,
        vendorName  = winNav.vendor,
        isOpera     = winNav.userAgent.indexOf("OPR") > -1,
        isIEedge    = winNav.userAgent.indexOf("Edge") > -1,
        isIOSChrome = winNav.userAgent.match("CriOS"),
        retVal      = false;
    if (isIOSChrome ||
        (isChromium != null && vendorName === "Google Inc." && isOpera === false &&
         isIEedge === false)) {
      retVal = true;
    }
    return retVal;
  }

  function isSafari() {
    if (navigator && navigator.userAgent) {
      //it excludes Chrome and all Android browsers that include the Safari name in their user agent.
      var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      return isSafari;
    }
  }

  // This shared function is used to compute the number characters can fit in a container.
  // Input:
  // - container width in pixels
  // - element width in pixels
  // Return:
  // - number of elements to fill the container
  function px2em(pxContainerWidth, pxElemWidth) {
    var pxInEms = 0;
    if (pxElemWidth > 0) {
      pxInEms = Math.floor(2 * pxContainerWidth / pxElemWidth);
    }
    return pxInEms;
  }

  function isVisibleInWindowViewport(el) {
    var $el = el instanceof $ ? el : $(el);
    if (!$el.is(':visible')) {
      return false;
    }
    var position = $el.offset(),
        offset   = {
          left: window.pageXOffset,
          top: window.pageYOffset
        },
        extents  = {
          width: $window.width(),
          height: $window.height()
        };
    return position.left >= offset.left && position.left - offset.left < extents.width &&
           position.top >= offset.top && position.top - offset.top < extents.height;
  }

  function isVisibleInWindowViewportHorizontally(el) {
    if (el === undefined) {
      return false;
    }
    var elem = el instanceof $ ? el[0] : el;
    if (!elem || !elem.getBoundingClientRect) {
      return false;
    }
    var elRect = elem.getBoundingClientRect();
    return elRect.left >= window.pageXOffset && elRect.right - window.pageXOffset < $window.width();
  }

  function isVisibleInWindowViewportVertically(el) {
    if (el === undefined) {
      return false;
    }
    var elem = el instanceof $ ? el[0] : el;
    if (!elem || !elem.getBoundingClientRect) {
      return false;
    }
    var elRect = elem.getBoundingClientRect();
    return elRect.top >= window.pageYOffset &&
           elRect.bottom - window.pageYOffset < $window.height();
  }

  // Params:
  // - el: element
  // - levels: for performance, only check parents up to number of levels. Default: 5.
  // - iPercentX: visible percentage X.  Default: 100% for full visibility.
  // - iPercentY: visible percentage Y.  Default: 100% for full visibility.
  // Return: true/false
  // Note: credit to a guy on stackoverflow for his original code
  function isElementVisibleInParents(el, levels, iPercentX, iPercentY) {
    if (el === undefined) {
      return false;
    }
    var elem = el instanceof $ ? el[0] : el;
    if (!elem || !elem.getBoundingClientRect) {
      return false;
    }
    // needed because the rects returned by getBoundingClientRect have up to 10 decimals
    var tolerance = 0.01;
    var percentX = iPercentX !== undefined ? iPercentX : 100;
    var percentY = iPercentY !== undefined ? iPercentY : 100;
    var elemRect = elem.getBoundingClientRect();
    var parentRects = [];
    var maxLevels = levels || 5;
    var curLevel = 0;
    while (elem.parentElement != null && curLevel < maxLevels) {
      parentRects.push(elem.parentElement.getBoundingClientRect());
      elem = elem.parentElement;
      curLevel++;
    }

    var visibleInAllParents = parentRects.every(function (parentRect) {
      var visiblePixelX = Math.min(elemRect.right, parentRect.right) -
                          Math.max(elemRect.left, parentRect.left);
      var visiblePixelY = Math.min(elemRect.bottom, parentRect.bottom) -
                          Math.max(elemRect.top, parentRect.top);
      var visiblePercentageX = visiblePixelX / elemRect.width * 100;
      var visiblePercentageY = visiblePixelY / elemRect.height * 100;
      return visiblePercentageX + tolerance > percentX &&
             visiblePercentageY + tolerance > percentY;
    });
    return visibleInAllParents;
  }

  // Similar to isElementVisibleInParents above but this function only checks a particular parent.
  // Params:
  // - el: element
  // - parent: parent element
  // - iPercentX: visible percentage X.  Default: 100% for full visibility.
  // - iPercentY: visible percentage Y.  Default: 100% for full visibility.
  // Return: true/false
  function isElementVisibleInParent(el, parent, iPercentX, iPercentY) {
    if (el === undefined || parent === undefined) {
      return false;
    }
    var elem = el instanceof $ ? el[0] : el;
    if (!elem || !elem.getBoundingClientRect) {
      return false;
    }
    var container = parent instanceof $ ? parent[0] : parent;
    if (!container || !container.getBoundingClientRect) {
      return false;
    }
    // needed because the rects returned by getBoundingClientRect have up to 10 decimals
    var tolerance = 0.01;
    var percentX = iPercentX !== undefined ? iPercentX : 100;
    var percentY = iPercentY !== undefined ? iPercentY : 100;
    var elemRect = elem.getBoundingClientRect();
    var contRect = container.getBoundingClientRect();
    var visiblePixelX = Math.min(elemRect.right, contRect.right) -
                        Math.max(elemRect.left, contRect.left);
    var visiblePixelY = Math.min(elemRect.bottom, contRect.bottom) -
                        Math.max(elemRect.top, contRect.top);
    var visiblePercentageX = visiblePixelX / elemRect.width * 100;
    var visiblePercentageY = visiblePixelY / elemRect.height * 100;
    return visiblePercentageX + tolerance > percentX &&
           visiblePercentageY + tolerance > percentY;
  }

  function checkAndScrollElemToViewport(elem) {
    var $elem            = $(elem),
        scrollSelector   = $elem.closest('.csui-perfect-scrolling').length > 0 ?
                           '.csui-perfect-scrolling' : '.csui-normal-scrolling',
        elemScrollParent = $elem.closest(scrollSelector),
        stickyHeader     = elemScrollParent.siblings(".csui-tab-contents-header-wrapper");
    if (!!stickyHeader[0]) {
      var elemTop       = $elem.offset().top,
          viewportTop   = elemScrollParent[0].getBoundingClientRect().top + stickyHeader.height(),
          isElemVisible = elemTop > viewportTop;
      if (!isElemVisible) {
        var currScrollTop = elemScrollParent.scrollTop();
        elemScrollParent.scrollTop(currScrollTop - (viewportTop - elemTop));
      }
    }

  }

  function setScrollHandler(e) {
    var eventArg = e.data;
    var inputElement      = eventArg.inputElement,
        view              = eventArg.view,
        dropdownContainer = eventArg.dropdownContainer,
        callback          = eventArg.callback;
    //When dropdown is closed
    inputElement.parents(".csui-normal-scrolling").css("overflow", "auto");
    //close respective drop-downs using callback
    if (dropdownContainer.length > 0 && dropdownContainer[0] !== e.target &&
        dropdownContainer.is(":visible") && callback) {
      callback(view);
    }
  }

  function adjustDropDownField(inputElement, dropdownContainer, applyWidth, view, callback,
      scrollableDropdownContainer) {
    var scrollEl;
    var eventArg = {
      inputElement: inputElement,
      view: view,
      dropdownContainer: dropdownContainer,
      callback: callback
    };

    var isIEBrowser    = this.isIE11(),
        isTouchBrowser = this.isTouchBrowser();

    if (isTouchBrowser &&
        !inputElement.closest('.csui-scrollable-writemode').hasClass('csui-dropdown-open')) {
      inputElement.closest('.csui-scrollable-writemode').addClass('csui-dropdown-open');
    }

    // for scrollable set
    if (inputElement.parents(".csui-scrollablecols").length > 0 &&
        inputElement.parents(".cs-form-set-container").length >
        0) {
      scrollEl = inputElement.parents(".csui-scrollablecols").parents(".cs-form-set-container").find
      (".ps-container.ps-active-x");
      var isRtl            = i18n && i18n.settings.rtl,
          inputElementLeft = inputElement.offset().left,
          leftShadow       = inputElement.parents(".csui-scrollablecols").siblings(
              ".csui-lockedcols").find(".csui-shadowleft-container"),
          leftShadowLeft   = leftShadow.offset().left,
          currentLeft,
          scrollUpdate;
      if (isRtl) {
        var inputElementRight = inputElementLeft + inputElement.outerWidth();
        scrollUpdate = inputElementRight - leftShadowLeft;
      }
      else {
        var leftShadowRight = leftShadowLeft + leftShadow.outerWidth();
        scrollUpdate = leftShadowRight - inputElementLeft;
      }
      // for partially visible dropdownfield
      if (scrollUpdate > 0) {
        scrollEl.unbind('scroll', setScrollHandler);
        scrollEl.one('set:scrolled', function () {
          if (!!scrollEl) {
            scrollEl.bind('scroll', eventArg, setScrollHandler);
          }
          autoAlignDropDowns(inputElement, dropdownContainer, applyWidth,
              scrollableDropdownContainer, isIEBrowser);
          hideDropDowns(inputElement, dropdownContainer, view, callback);
        });
        if (isRtl) {
          currentLeft = scrollEl.scrollLeftRtl();
          scrollEl.scrollLeftRtl(currentLeft + scrollUpdate);
        }
        else {
          currentLeft = scrollEl.scrollLeft();
          scrollEl.scrollLeft(currentLeft - scrollUpdate);
          var that = this;
          setTimeout(function () {
            if (that.isTouchBrowser && !inputElement.closest('.csui-scrollable-writemode').hasClass(
                '.csui-dropdown-open')) {
              inputElement.closest('.csui-scrollable-writemode').addClass('csui-dropdown-open');
            }
          }, 100);
        }
        return;
      }
    }

    if (!!scrollEl) {
      scrollEl.bind('scroll', eventArg, setScrollHandler);
    }
    autoAlignDropDowns(inputElement, dropdownContainer, applyWidth, scrollableDropdownContainer,
        isIEBrowser);
    hideDropDowns(inputElement, dropdownContainer, view, callback);

  }

  //This function is used to display drop-downs either top or bottom based on available space
  function autoAlignDropDowns(inputElement, dropdownContainer, applyWidth,
      scrollableDropdownContainer, isIEBrowser) {
    var isRtl                 = i18n && i18n.settings.rtl,
        elTop                 = inputElement.offset().top,
        elPositionX           = inputElement.offset().left,
        scrollSelector        = inputElement.closest('.csui-perfect-scrolling').length > 0 ?
                                '.csui-perfect-scrolling' : '.csui-normal-scrolling',
        form                  = inputElement.closest(scrollSelector),
        modalContentElem      = isIEBrowser ? [] :
                                (form.length > 0 ? form.parents(".binf-modal-content") :
                                 inputElement.closest(".binf-modal-content")), /*For
         IE, left & top position is calculated with respect to document*/
        modalContentPositionX = modalContentElem.length > 0 ? (isRtl ?
                                                               (modalContentElem.outerWidth() +
                                                                modalContentElem.offset().left) :
                                                               modalContentElem.offset().left) :
                                (isRtl ? $(document).width() : 0),
        modalContentTop       = modalContentElem.length > 0 ? modalContentElem.offset().top : 0,
        controlheight         = inputElement.outerHeight(),
        dropdownWidth         = inputElement.outerWidth(),
        perspectivePanel      = $(".cs-perspective-panel"),
        perspective           = inputElement.closest(".cs-perspective"),
        perspectiveHeight     = perspective.length > 0 ?
                                perspective.outerHeight() : $(document).height(),
        perspectiveTop        = perspective.length > 0 ?
                                perspective.offset().top : 0,
        elemBoundingRect      = inputElement[0].getBoundingClientRect(),
        contextBottom, contextTop;

    if (applyWidth) {
      dropdownContainer.css({
        "width": dropdownWidth
      });
    }
    //When dropdown is opened
    if (scrollSelector != '.csui-normal-scrolling') {
      inputElement.parents(".csui-normal-scrolling").css("overflow", "hidden");
    }

    var perspectivePanelClientTop = perspectivePanel.length > 0 ?
                                    perspectivePanel[0].getBoundingClientRect().top : 0;
    if (perspectivePanelClientTop < 0) {
      perspectivePanelClientTop = 0;
    }
    var spaceOnTop           = elemBoundingRect.top - perspectivePanelClientTop,
        spaceOnBottom        = window.innerHeight - elemBoundingRect.top,
        isDropdownShownOnTop = spaceOnTop > spaceOnBottom;

    if (!!scrollableDropdownContainer) {
      scrollableDropdownContainer.css({
        'max-height': Math.abs((isDropdownShownOnTop ? spaceOnTop : spaceOnBottom) * 0.9) + 'px'
      });
    }
    // below code used to display dropdown at top of the field.
    if (isDropdownShownOnTop) {

      if (isIEBrowser) {
        contextBottom = document.documentElement.offsetHeight + document.documentElement.scrollTop -
                        elTop;
      } else {
        if (modalContentElem.length > 0) {
          contextBottom = modalContentElem.outerHeight() + modalContentTop - elTop;
        } else {
          if (perspective.length > 0 || isSafari()) {
            contextBottom = perspectiveHeight + perspectiveTop - elTop;
          } else {
            contextBottom = document.documentElement.offsetHeight  -  elTop;
          }
        }
      }
      if (isRtl) {
        dropdownContainer.css({
          "-webkit-transform": "translate3d(0, 0, 0)",
          "position": "fixed",
          "right": modalContentPositionX - (elPositionX + dropdownWidth),
          "top": "auto",
          "bottom": contextBottom
        });
      } else {
        dropdownContainer.css({
          "-webkit-transform": "translate3d(0, 0, 0)",
          "position": "fixed",
          "left": elPositionX - modalContentPositionX,
          "top": "auto",
          "bottom": contextBottom
        });
      }
      if (dropdownContainer.hasClass('binf-datetimepicker-widget')) {
        dropdownContainer.addClass('binf-top').removeClass('binf-bottom');
      }
      // below code used to display dropdown at bottom of the field.
    } else {
      if (isIEBrowser) {
        contextTop = elTop + controlheight - document.documentElement.scrollTop;
      } else {
        if (modalContentElem.length > 0) {
          contextTop = elTop + controlheight - modalContentTop;
        } else {
          if (perspective.length > 0) {
            contextTop = elTop + controlheight - perspectiveTop;
          } else {
            contextTop = elemBoundingRect.top + elemBoundingRect.height - perspectiveTop;
          }

        }
      }
      if (isRtl) {
        dropdownContainer.css({
          "-webkit-transform": "translate3d(0, 0, 0)",
          "position": "fixed",
          "right": modalContentPositionX - (elPositionX + dropdownWidth),
          "top": contextTop,
          "bottom": "auto"
        });
      } else {
        dropdownContainer.css({
          "-webkit-transform": "translate3d(0, 0, 0)",
          "position": "fixed",
          "left": elPositionX - modalContentPositionX,
          "top": contextTop,
          "bottom": "auto"
        });
      }
      if (dropdownContainer.hasClass('binf-datetimepicker-widget')) {
        dropdownContainer.addClass('binf-bottom').removeClass('binf-top');
      }
    }
  }

  function hideDropDowns(inputElement, dropdownContainer, view, callback) {
    var scrollSelector = inputElement.closest('.csui-perfect-scrolling').length > 0 ?
                         '.csui-perfect-scrolling' : '.csui-normal-scrolling',
        form           = inputElement.closest(scrollSelector),
        scrollableSet;
    form.bind('scroll', view, function (e) {
      //When dropdown is closed
      inputElement.parents(".csui-normal-scrolling").css("overflow", "auto");
      //close respective drop-downs using callback
      if (dropdownContainer.is(":visible") && callback) {
        callback(view);
      }
    });
    // called when the window is scrolled.
    $(window).bind('scroll', function () {
      //When dropdown is closed
      inputElement.parents(".csui-normal-scrolling").css("overflow", "auto");
      if (dropdownContainer.is(":visible") && callback) {
        callback(view);
      }
    });

    // called when the window is resized.
    $(window).bind('resize', function () {
      //When dropdown is closed
      inputElement.parents(".csui-normal-scrolling").css("overflow", "auto");
      if (dropdownContainer.is(":visible") && callback) {
        callback(view);
      }
    });
  }

  // TODO: Deprecate and remove this method
  function stringifyDate(date) {
    return JSON.stringify(date);
  }

  // TODO: Deprecate and remove this method
  function dateToLocalIsoString(date, format) {
    if (format === 'YYYY-MM-DD') {
      return date.serializeDate(date);
    }
    return date.serializeDateTime(date);
  }

  function findFocusables(element) {
    return $(element).find('a[href], area[href], input, select, textarea, button,' +
                           ' iframe, object, embed, *[tabindex], *[contenteditable]')
    // Only visible and enabled
        .filter(':visible:not([disabled])');
  }

  return {
    MessageHelper: messageHelper,
    ErrorHandler: messageHelper,

    MessageType: Message.Type,
    Message: Message.Message,
    RequestErrorMessage: Message.RequestErrorMessage,

    ErrorStatus: Message.Type,
    ErrorToShow: Message.Message,
    ErrorMessage: Message.ErrorMessage,
    Error: Message.RequestErrorMessage,

    exactDateFormat: date.exactDateFormat,
    exactTimeFormat: date.exactTimeFormat,
    exactDateTimeFormat: date.exactDateTimeFormat,

    parseDate: date.deserializeDate,
    stringifyDate: stringifyDate,
    dateToLocalIsoString: dateToLocalIsoString,
    deserializeDate: date.deserializeDate,
    serializeDate: date.serializeDate,
    serializeDateTime: date.serializeDateTime,
    formatDate: date.formatDate,
    formatDateTime: date.formatDateTime,
    formatExactDate: date.formatExactDate,
    formatExactTime: date.formatExactTime,
    formatExactDateTime: date.formatExactDateTime,
    formatFriendlyDate: date.formatFriendlyDate,
    formatFriendlyDateTime: date.formatFriendlyDateTime,
    formatFriendlyDateTimeNow: date.formatFriendlyDateTimeNow,
    formatISODateTime: date.formatISODateTime,
    formatISODate: date.formatISODate,

    getReadableFileSizeString: number.formatFileSize,
    formatFileSize: number.formatFileSize,
    formatFriendlyFileSize: number.formatFriendlyFileSize,
    formatExactFileSize: number.formatExactFileSize,

    formatInteger: number.formatInteger,
    formatIntegerWithCommas: number.formatIntegerWithCommas,

    formatMemberName: member.formatMemberName,

    getClosestLocalizedString: localizable.getClosestLocalizedString,

    localeCompareString: localizable.localeCompareString,
    localeContainsString: localizable.localeContainsString,
    localeEndsWithString: localizable.localeEndsWithString,
    localeIndexOfString: localizable.localeIndexOfString,
    localeStartsWithString: localizable.localeStartsWithString,

    formatMessage: localizable.formatMessage,

    escapeHtml: escapeHtml,

    isBackbone: isBackbone,
    isPlaceholder: isPlaceholder,
    Url: Url,
    isTouchBrowser: isTouchBrowser,
    isAppleMobile: isAppleMobile,
    isMacintosh: isMacintosh,
    isIE11: isIE11,
    isEdge: isEdge,
    isMozilla: isMozilla,
    isFirefox: isFirefox,
    isSafari: isSafari,
    isLandscape: isLandscape,
    isPortrait: isPortrait,
    isMSBrowser: isMSBrowser,
    isChrome: isChrome,
    px2em: px2em,
    isVisibleInWindowViewport: isVisibleInWindowViewport,
    isVisibleInWindowViewportHorizontally: isVisibleInWindowViewportHorizontally,
    isVisibleInWindowViewportVertically: isVisibleInWindowViewportVertically,
    isElementVisibleInParents: isElementVisibleInParents,
    isElementVisibleInParent: isElementVisibleInParent,
    checkAndScrollElemToViewport: checkAndScrollElemToViewport,
    setScrollHandler: setScrollHandler,
    adjustDropDownField: adjustDropDownField,
    autoAlignDropDowns: autoAlignDropDowns,
    hideDropDowns: hideDropDowns,
    findFocusables: findFocusables
  };
});

csui.define('csui/models/action',[ "module", "require", "csui/lib/jquery", "csui/lib/underscore",
  "csui/lib/backbone", "csui/utils/log", "csui/utils/base"
], function (module, _require, $, _, Backbone, log, base) {
  "use strict";

  // {
  //   signature:  unique identifier of the action to refer to
  //   name:       title of the action
  //   children:   array of action to appear as the submenu
  // }

  // ActionCollection to be filled on the first usage, preventing circular
  // dependency between ActionCollection and ActionModel.
  var ActionCollection;

  var ActionModel = Backbone.Model.extend({

    idAttribute: 'signature',

    constructor: function ActionModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
      options && options.connector && options.connector.assignTo(this);
      // Require the ActionCollection on the first use to prevent a circular
      // dependency between ActionCollection and ActionModel.
      if (!ActionCollection) {
        ActionCollection = _require("csui/models/actions");
      }
      // TODO: make the REST API return array or nothing; the children
      // property is supposed top be a collection.  It returns an empty
      // object literal if there are no children, while the clients like
      // Backbone.Collection expect an array or nothing.
      var children = _.isArray(attributes && attributes.children) &&
                     attributes.children || [];
      this.children = new ActionCollection(children);
    },

    // not yet working
    url: function () {
      return base.Url.combine(this.connector.connection.url,
        "actions", this.get("signature"));
    },

    fetch: function (options) {
      log.debug("Fetching action with the ID {0}.", this.get("signature")) &&
      console.log(log.last);
      return Backbone.Model.prototype.fetch.call(this, options);
    },

    parse: function (response) {
      var action = response;

      //if (log.debug("Parsing action \"{0}\" ({1}).", action.name, action.url)) {
      //  console.log(log.last);
      //  console.log(response);
      //}

      if (this.children) {
        // TODO: make the REST API return array or nothing; the children
        // property is supposed top be a collection.  It returns an empty
        // object literal if there are no children, while the clients like
        // Backbone.Collection expect an array or nothing.
        var children = _.isArray(action.children) && action.children || [];
        this.children.reset(children);
      }

      return action;
    }

  });

  return ActionModel;

});

csui.define('csui/models/actions',["module", "csui/lib/jquery", "csui/lib/underscore", "csui/lib/backbone",
  "csui/utils/log", "csui/utils/base", "csui/models/action"
], function (module, $, _, Backbone, log, base, ActionModel) {
  "use strict";

  // ActionCollection
  // ----------------

  var ActionCollection = Backbone.Collection.extend({

    model: ActionModel,

    constructor: function ActionCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
      this.options = options || {};
    },

    // Finds an action by its cid or signature (id) recursively; if the
    // action doesn't exist in the models of this collection, it will be
    // looked for in children of those models recursively.
    findRecursively: function (id) {
      // search the terminal actions in the collection first
      var action = this.get({ cid: id }) || this.find(function (item) {
        return item.get('signature') === id;
      });
      // if not found, try all the submenus
      if (!action)
      // make an array of all action finding results produced
      // recursively and pick the first action found
      {
        action = _.find(this.map(function (item) {
          // if the submenu isn't empty handle it as another action
          // collection recursively - get the action or undefined
          // if it wasn't found
          return item.children.findRecursively(id);
          // pick the first action which is not undefined
        }), function (item) {
          return item;
        });
      }
      return action;
    }

  });

  // Module
  // ------

  _.extend(ActionCollection, {
    version: '1.0'
  });

  return ActionCollection;

});

csui.define('csui/models/mixins/rules.matching/rules.matching.mixin',[
  'module', 'csui/lib/underscore', 'csui/lib/backbone', 'csui/utils/log'
], function (module, _, Backbone, log) {
  'use strict';

  log = log(module.id);

  var RulesMatchingMixin = {

    mixin: function (prototype) {

      return _.extend(prototype, {

        makeRulesMatching: function (options) {
          return this;
        },

        rulesToMatch: [
          'equals', 'contains', 'startsWith', 'endsWith', 'matches',
          'includes', 'equalsNoCase', 'containsNoCase', 'startsWithNoCase',
          'endsWithNoCase', 'matchesNoCase', 'includesNoCase',  'has',
          'decides', 'or', 'and', 'not'
        ],

        matchRules: function (model, operations, combine) {
          var results = _.chain(this.rulesToMatch)
                         .map(function (operation) {
                           var operands = operations[operation];
                           return operands === undefined ? undefined :
                                  this['_evaluate-' + operation](model, operands);
                         }, this)
                         .filter(function (result) {
                           return result !== undefined;
                         })
                         .value();
          return !results.length ||
                 _[combine || 'any'](results, function (result) {
                   return result === true;
                 });
        },

        _getRulingPropertyValue: function (model, name) {
          if (typeof name !== 'string') {
            if (name == null) {
              name = 'null';
            }
            log.warn('Invalid property name in the action rule specification: {0}',
                name) && console.warn(log.last);
            return null;
          }
          var names = name.split('.'),
              value = model instanceof Backbone.Model ?
                      model.attributes : model || {};
          _.find(names, function (name) {
            value = value[name];
            if (value == null) {
              value = null;
              return true;
            }
          });
          return value;
        },

        '_evaluate-or': function (model, operations) {
          if (_.isArray(operations)) {
            return _.any(operations, function (operation) {
              return this.matchRules(model, operation);
            }, this);
          }
          return this.matchRules(model, operations, 'any');
        },

        '_evaluate-and': function (model, operations) {
          if (_.isArray(operations)) {
            return _.all(operations, function (operation) {
              return this.matchRules(model, operation);
            }, this);
          }
          return this.matchRules(model, operations, 'all');
        },

        '_evaluate-not': function (model, operations) {
          return !this.matchRules(model, operations);
        },

        '_evaluate-equals': function (model, operands) {
          return this._evaluateEquals(model, operands, false);
        },

        '_evaluate-equalsNoCase': function (model, operands) {
          return this._evaluateEquals(model, operands, true);
        },

        _evaluateEquals: function (model, operands, noCase) {
          return _.any(operands, function (values, key) {
            var actual = this._getRulingPropertyValue(model, key);
            _.isArray(values) || (values = [values]);
            if (noCase) {
              var normalized = this._normalizeCase(actual, values);
              actual = normalized.actual;
              values = normalized.values;
            }
            return _.any(values, function (value) {
              return value == actual;
            });
          }, this);
        },

        '_evaluate-contains': function (model, operands) {
          return this._evaluateContains(model, operands, false);
        },

        '_evaluate-containsNoCase': function (model, operands) {
          return this._evaluateContains(model, operands, true);
        },

        _evaluateContains: function (model, operands, noCase) {
          return _.any(operands, function (values, key) {
            var actual = this._getRulingPropertyValue(model, key) || '';
            actual && (actual = actual.toString()) || (actual = []);
            _.isArray(values) || (values = [values]);
            if (noCase) {
              var normalized = this._normalizeCase(actual, values);
              actual = normalized.actual;
              values = normalized.values;
            }
            return _.any(values, function (value) {
              return actual.indexOf(value) >= 0;
            });
          }, this);
        },

        '_evaluate-startsWith': function (model, operands) {
          return this._evaluateStartsWith(model, operands, false);
        },

        '_evaluate-startsWithNoCase': function (model, operands) {
          return this._evaluateStartsWith(model, operands, true);
        },

        _evaluateStartsWith: function (model, operands, noCase) {
          return _.any(operands, function (values, key) {
            var actual = this._getRulingPropertyValue(model, key) || '';
            actual && (actual = actual.toString()) || (actual = '');
            _.isArray(values) || (values = [values]);
            if (noCase) {
              var normalized = this._normalizeCase(actual, values);
              actual = normalized.actual;
              values = normalized.values;
            }
            return _.any(values, function (value) {
              return actual.indexOf(value) === 0;
            });
          }, this);
        },

        '_evaluate-endsWith': function (model, operands) {
          return this._evaluateEndsWith(model, operands, false);
        },

        '_evaluate-endsWithNoCase': function (model, operands) {
          return this._evaluateEndsWith(model, operands, true);
        },

        _evaluateEndsWith: function (model, operands, noCase) {
          return _.any(operands, function (values, key) {
            var actual = this._getRulingPropertyValue(model, key) || '';
            actual && (actual = actual.toString()) || (actual = '');
            _.isArray(values) || (values = [values]);
            if (noCase) {
              var normalized = this._normalizeCase(actual, values);
              actual = normalized.actual;
              values = normalized.values;
            }
            return _.any(values, function (value) {
              return _.str.endsWith(actual, value);
            });
          }, this);
        },

        '_evaluate-matches': function (model, operands) {
          return this._evaluateMatches(model, operands, false);
        },

        '_evaluate-matchesNoCase': function (model, operands) {
          return this._evaluateMatches(model, operands, true);
        },

        _evaluateMatches: function (model, operands, noCase) {
          return _.any(operands, function (values, key) {
            var actual = this._getRulingPropertyValue(model, key) || '';
            actual && (actual = actual.toString()) || (actual = '');
            _.isArray(values) || (values = [values]);
            if (noCase) {
              var normalized = this._normalizeCase(actual, values);
              actual = normalized.actual;
              values = normalized.values;
            }
            return _.any(values, function (value) {
              if (typeof value === 'string') {
                value = new RegExp(value);
              }
              return value.test(actual);
            });
          }, this);
        },

        '_evaluate-includes': function (model, operands) {
          return this._evaluateIncludes(model, operands, false);
        },

        '_evaluate-includesNoCase': function (model, operands) {
          return this._evaluateIncludes(model, operands, true);
        },

        _evaluateIncludes: function (model, operands, noCase) {
          return _.any(operands, function (values, key) {
            var actual = this._getRulingPropertyValue(model, key) || [];
            if (!_.isArray(actual)) {
              if (_.isObject(actual)) {
                actual = Object.keys(actual);
              } else {
                actual = [actual];
              }
            }
            if (!_.isArray(values)) {
              values = [values];
            }
            if (noCase) {
              var normalized = this._normalizeCase(actual, values);
              actual = normalized.actual;
              values = normalized.values;
            }
            return _.any(values, function (value) {
              return _.contains(actual, value);
            });
          }, this);
        },

        '_evaluate-has': function (model, operands) {
          _.isArray(operands) || (operands = [operands]);
          return _.any(operands, function (name) {
            return this._getRulingPropertyValue(model, name) != null;
          }, this);
        },

        '_evaluate-decides': function (model, methods) {
          _.isArray(methods) || (methods = [methods]);
          return _.any(methods, function (method) {
            return method(model);
          });
        },

        _normalizeCase: function (actual, values) {
          if (typeof actual === 'string') {
            actual = actual.toLowerCase();
          }
          values = _.map(values, function (value) {
            return typeof value === 'string' ? value.toLowerCase() : value;
          });
          return {
            actual: actual,
            values: values
          };
        }
      });
    }

  };

  return RulesMatchingMixin;

});

csui.define('csui/models/actionitem',[
  'csui/lib/underscore', 'csui/lib/backbone',
  'csui/models/mixins/rules.matching/rules.matching.mixin'
], function (_, Backbone, RulesMatchingMixin) {
  'use strict';

  // {
  //   type:        node type to work at (for compatibility only; use operations)
  //   <operation>: selects the action, if it evaluates to true; operations are
  //                equals, differs, includes, excludes, startsWith, endsWith,
  //                decides, or, and, not
  //   signature:   unique identifier of the command to refer to
  //   name:        optional title if the action appears on a label
  //   sequence:    number controlling the priority of processing
  //                this item during the default action evaluation
  // }

  var ActionItemModel = Backbone.Model.extend({

    idAttribute: null,

    defaults: {
      sequence: 100,
      signature: null
    },

    constructor: function ActionItemModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
      this.makeRulesMatching(options);
    },

    enabled: function (node) {
      // Compatibility with the previous forms with just type property;
      // not with boolean operations working on node properties
      var type = this.get('type');
      if (type !== undefined) {
        return type == node.get('type');
      }
      return this.matchRules(node, this.attributes);
    }

  });

  RulesMatchingMixin.mixin(ActionItemModel.prototype);

  return ActionItemModel;

});

csui.define('csui/models/actionitems',['csui/lib/underscore', 'csui/lib/backbone', 'csui/models/actionitem'
], function (_, Backbone, ActionItemModel) {
  'use strict';

  var ActionItemCollection = Backbone.Collection.extend({

    model: ActionItemModel,
    comparator: 'sequence',

    constructor: function ActionItemCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
    },

    findByNode: function (node) {
      return this.find(function (item) {
        return item.enabled(node);
      });
    },

    getAllSignatures: function () {
      return _.chain(this.pluck('signature'))
          .unique()
          .value();
    },

    getAllCommandSignatures: function (commands) {
      return _.chain(this.getAllSignatures())
          .map(function (signature) {
            var command = commands.get(signature);
            if (command) {
              signature = command.get('command_key');
              if (_.isArray(signature)) {
                // If there are multiple command keys to check, take just the
                // first one, which is the V2 one needed for the URL query
                var result = signature[0];
                // If the 'default' command key is requested, add the concrete
                // key too; v1 expects 'default' and v2 'open', while the
                // concrete action would be at the third place then.
                if (result === 'default') {
                  result = ['default', 'open', signature[2]];
                }
                return result;
              }
              return signature;
            }
          })
          .flatten()
          .compact()
          .unique()
          .value();
    },

    getPromotedCommandsSignatures: function () {
      return _.chain(this.getAllSignatures())
          .flatten()
          .compact()
          .unique()
          .value();
    }

  });

  return ActionItemCollection;

});

csui.define('csui/models/addabletype',["module", "csui/lib/backbone", "csui/utils/log"
], function (module, Backbone, log) {

  var AddableTypeModel = Backbone.Model.extend({

    constructor: function AddableTypeModel() {
      Backbone.Model.prototype.constructor.apply(this, arguments);
    },

    parse: function (response) {
      //~ if (log.debug("Parsing addableItem \"{0}\" ({1}, {2}).",
      //~ response.name, response.id, response.type)) {
      //~ console.log(log.last);
      //~ console.log(response);
      //~ }

      return response;
    }

  });
  AddableTypeModel.version = '1.0';
  AddableTypeModel.Hidden = -1;

  return AddableTypeModel;

});

csui.define('csui/models/addabletypes',["module", "csui/lib/backbone", "csui/utils/log", "csui/models/addabletype"
], function (module, Backbone, log, AddableTypeModel) {

  var AddableTypeCollection = Backbone.Collection.extend({

    model: AddableTypeModel,

    constructor: function AddableTypeCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);

      this.options = options || {};
    }

  });
  AddableTypeCollection.version = '1.0';

  return AddableTypeCollection;

});

csui.define('csui/models/mixins/connectable/connectable.mixin',['csui/lib/underscore'
], function (_) {
  "use strict";

  var ConnectableMixin = {

    mixin: function (prototype) {
      var originalPrepareModel = prototype._prepareModel;

      return _.extend(prototype, {

        makeConnectable: function (options) {
          options && options.connector && options.connector.assignTo(this);
          return this;
        },

        _prepareModel: function (attrs, options) {
          options || (options = {});
          if (!options.connector) {
            options.connector = this.connector;
          }
          return originalPrepareModel.call(this, attrs, options);
        }

      });
    }

  };

  return ConnectableMixin;

});

csui.define('csui/models/ancestor',['module', 'csui/lib/backbone',
  'csui/models/mixins/connectable/connectable.mixin'
], function (module, Backbone, ConnectableMixin) {

  var AncestorModel = Backbone.Model.extend({

    constructor: function AncestorModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);

      this.makeConnectable(options);
    },

    idAttribute: null,

    clone: function () {
      return new this.constructor(this.attributes, {
        connector: this.connector
      });
    }

  });

  ConnectableMixin.mixin(AncestorModel.prototype);

  return AncestorModel;

});

csui.define('csui/models/ancestors',["module", "csui/lib/backbone", "csui/utils/log", "csui/models/ancestor"
], function (module, Backbone, log, AncestorModel) {

  var AncestorCollection = Backbone.Collection.extend({

    model: AncestorModel,

    constructor: function AncestorCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);

      this.options = options || {};
    }

  });
  AncestorCollection.version = '1.0';

  return AncestorCollection;

});

csui.define('csui/models/mixins/expandable/expandable.mixin',['csui/lib/underscore', 'csui/utils/url'
], function (_, Url) {
  "use strict";

  var ExpandableMixin = {

    mixin: function (prototype) {
      return _.extend(prototype, {

        makeExpandable: function (options) {
          var expand = options && options.expand;
          if (typeof expand === 'string') {
            expand = expand.split(',');
          }
          this.expand = expand || [];
          return this;
        },

        setExpand: function (name) {
          if (!_.isArray(name)) {
            name = name.split(",");
          }
          _.each(name, function (name) {
            if (!_.contains(this.expand, name)) {
              this.expand.push(name);
            }
          }, this);
        },

        resetExpand: function (name) {
          if (name) {
            if (!_.isArray(name)) {
              name = name.split(",");
            }
            _.each(name, function (name) {
              var index = _.indexOf(this.expand, name);
              if (index >= 0) {
                this.expand.splice(index, 1);
              }
            }, this);
          } else {
            this.expand.splice(0, this.expand.length);
          }
        },

        getExpandableResourcesUrlQuery: function () {
          return {expand: this.expand};
        }

      });
    }

  };

  return ExpandableMixin;

});

csui.define('csui/models/mixins/fetchable/fetchable.mixin',[
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/utils/base'
], function (_, $, Backbone, base) {
  'use strict';

  var FetchableMixin = {
    mixin: function (prototype) {
      var originalFetch = prototype.fetch;

      return _.extend(prototype, {
        makeFetchable: function (options) {
          this.autoreset = options && options.autoreset;
          // Workaround for change/add/reset events, which are fired before
          // the caller is informed by sync that fetch successed.
          return this.on('reset', this._beforeFetchSucceeded, this)
              .on('add', this._beforeFetchSucceeded, this)
              .on('remove', this._beforeFetchSucceeded, this)
              .on('change', this._beforeFetchSucceeded, this);
        },

        _beforeFetchSucceeded: function () {
          this._fetchingOriginal && this._fetchSucceeded();
        },

        _fetchSucceeded: function () {
          this._fetchingOriginal = this.fetching = false;
          this.fetched = true;
          this.error = undefined;
        },

        _fetchFailed: function (jqxhr) {
          this._fetchingOriginal = this.fetching = false;
          this.error = new base.Error(jqxhr);
        },

        fetch: function (options) {
          var fetching = this.fetching;
          if (!fetching) {
            options = _.defaults(options || {}, {
              cache: true,
              urlBase: this.urlCacheBase? this.urlCacheBase(): undefined
            });

            this.fetched = false;
            this.error = null;
            options = this._prepareFetch(options);
            // Ensure that the model is marked fetched before other events are
            // triggered.  If fetching is not silent, change/add/reset will be
            // triggered earlier: change/add/reset, options.*, sync, promise.
            var self = this,
                success = options.success,
                error = options.error;
            options.success = function () {
              self._fetchSucceeded();
              success && success.apply(this, arguments);
            };
            options.error = function (model, jqxhr, options) {
              self._fetchFailed(jqxhr);
              error && error.apply(this, arguments);
            };
            this._fetchingOriginal = true;
            fetching = originalFetch.call(this, options);
            // If the fetch or sync method are implemented synchronously,
            // model or collection changing events are fired earlier than
            // the original fetch call returns the promise
            if (this._fetchingOriginal) {
              this.fetching = fetching;
            }
          }
          return fetching;
        },

        _prepareFetch: function (options) {
          // Trigger just one item adding operation after fetching if wanted.
          options || (options = {});
          options.reset === undefined && this.autoreset && (options.reset = true);
          return options;
        },

        ensureFetched: function (options) {
          if (this.fetched) {
            if (options && options.success) {
              options.success(this);
            }
            return $.Deferred()
                .resolve(this, {}, options)
                .promise();
          }
          return this.fetch(options);
        },

        prefetch: function (response, options) {
          var deferred = $.Deferred().resolve();
          options = _.extend({parse: true}, options);
          options = this._prepareFetch(options);
          this.error = null;
          this.fetched = false;
          this.fetching = deferred.promise();
          this.trigger('request', this, response, options);
          setTimeout(function () {
            this._fetchSucceeded();
            if (this instanceof Backbone.Model) {
              var attributes = options.parse ? this.parse(response, options) :
                                               response;
              this.set(attributes, options);
            } else {
              var method = options.reset ? 'reset' : 'set';
              this[method](response, options);
            }
            if (options.success) {
              options.success.call(options.context, this, response, options);
            }
            this.trigger('sync', this, response, options);
            deferred.resolve();
          }.bind(this));
          return this.fetching;
        }
      });
    }
  };

  return FetchableMixin;
});

csui.define('csui/models/mixins/autofetchable/autofetchable.mixin',['csui/lib/underscore'
], function (_) {
  "use strict";

  var AutoFetchableMixin = {
    mixin: function (prototype) {
      return _.extend(prototype, {
        makeAutoFetchable: function (options) {
          var autofetchEvent = options && options.autofetchEvent;
          if (autofetchEvent) {
            this._autofetchEvent = options.autofetchEvent;
          }
          var autofetch = options && options.autofetch;
          if (autofetch) {
            this.automateFetch(autofetch);
          }
          return this;
        },

        automateFetch: function (enable) {
          var event = _.result(this, '_autofetchEvent'),
              method = enable ? 'on' : 'off';
          this.autofetch = !!enable;
          this[method](event, _.bind(this._fetchAutomatically, this, enable));
        },

        isFetchable: function () {
          return !!this.get('id');
        },

        _autofetchEvent: 'change:id',

        _fetchAutomatically: function (options) {
          this.isFetchable() && this.fetch(_.isObject(options) && options);
        }
      });
    }
  };

  return AutoFetchableMixin;
});

csui.define('csui/models/mixins/resource/resource.mixin',['csui/lib/underscore', 'csui/models/mixins/connectable/connectable.mixin',
  'csui/models/mixins/fetchable/fetchable.mixin',
  'csui/models/mixins/autofetchable/autofetchable.mixin'
], function (_, ConnectableMixin, FetchableMixin, AutoFetchableMixin) {
  'use strict';

  var ResourceMixin = {

    mixin: function (prototype) {
      ConnectableMixin.mixin(prototype);
      FetchableMixin.mixin(prototype);
      AutoFetchableMixin.mixin(prototype);

      return _.extend(prototype, {

        makeResource: function (options) {
          return this.makeConnectable(options)
              .makeFetchable(options)
              .makeAutoFetchable(options);
        }

      });
    }

  };

  return ResourceMixin;

});

csui.define('csui/models/mixins/including.additional.resources/including.additional.resources.mixin',['csui/lib/underscore', 'csui/lib/jquery'
], function (_, $) {

  var IncludingAdditionalResourcesMixin = {

    mixin: function (prototype) {

      return _.extend(prototype, {

        makeIncludingAdditionalResources: function (options) {
          this._additionalResources = [];
          if (options && options.includeResources) {
            this.includeResources(options.includeResources);
          }
          return this;
        },

        includeResources: function (names) {
          if (!_.isArray(names)) {
            names = names.split(',');
          }
          this._additionalResources = _.union(this._additionalResources, names);
        },

        excludeResources: function (names) {
          if (names) {
            if (!_.isArray(names)) {
              names = names.split(',');
            }
            this._additionalResources = _.reject(this._additionalResources, names);
          } else {
            this._additionalResources.splice(0, this._additionalResources.length);
          }
        },

        getAdditionalResourcesUrlQuery: function () {
          return _.reduce(this._additionalResources, function (result, parameter) {
            result[parameter] = 'true';
            return result;
          }, {});
        }

      });

    }

  };

  return IncludingAdditionalResourcesMixin;

});

csui.define('csui/models/authenticated.user/server.adaptor.mixin',[
  'csui/lib/underscore', 'csui/utils/url'
], function (_, Url) {
  'use strict';

  var ServerAdaptorMixin = {
    mixin: function (prototype) {
      return _.extend(prototype, {
        makeServerAdaptor: function (options) {
          return this;
        },

        url: function () {
          var apiBase = new Url(this.connector.connection.url).getApiBase('v1'),
              url = Url.combine(apiBase, '/auth'),
              query = Url.combineQueryString(
                this.getExpandableResourcesUrlQuery(),
                this.getAdditionalResourcesUrlQuery()
              );
          return query ? url + '?' + query : url;
        },
    
        parse: function (response) {
          var user = response.data || {};
          user.perspective = response.perspective;
          return user;
        }
      });
    }
  };

  return ServerAdaptorMixin;
});

csui.define('csui/models/authenticated.user',[
  'csui/lib/backbone', 'csui/models/mixins/expandable/expandable.mixin',
  'csui/models/mixins/resource/resource.mixin',
  'csui/models/mixins/including.additional.resources/including.additional.resources.mixin',
  'csui/models/authenticated.user/server.adaptor.mixin'
], function (Backbone, ExpandableMixin, ResourceMixin,
    IncludingAdditionalResourcesMixin, ServerAdaptorMixin) {
  'use strict';

  var AuthenticatedUserModel = Backbone.Model.extend({
    constructor: function AuthenticatedUserModel(attributes, options) {
      Backbone.Model.prototype.constructor.call(this, attributes, options);

      this.makeResource(options)
          .makeIncludingAdditionalResources(options)
          .makeExpandable(options)
          .makeServerAdaptor(options);
    },

    clone: function () {
      return new this.constructor(this.attributes, {
        connector: this.connector
      });
    }
  });

  IncludingAdditionalResourcesMixin.mixin(AuthenticatedUserModel.prototype);
  ExpandableMixin.mixin(AuthenticatedUserModel.prototype);
  ResourceMixin.mixin(AuthenticatedUserModel.prototype);
  ServerAdaptorMixin.mixin(AuthenticatedUserModel.prototype);

  return AuthenticatedUserModel;
});

csui.define('csui/models/mixins/uploadable/uploadable.mixin',[
  'module', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/backbone', 'csui/utils/log'
], function (module, _, $, Backbone, log) {
  'use strict';

  log = log(module.id);

  var config = _.extend({
    useJson: false,
    useMock: false,
    usePatch: false,
    metadataPartName: 'body'
  }, module.config());

  var UploadableMixin = {

    mixin: function (prototype) {
      var originalSync = prototype.sync;

      // Mixins are applied after the prototype has been defined. This
      // method is supposed to be overridden in the original prototype.
      if (!prototype.prepare) {
        prototype.prepare = function (data, options) {
          return data;
        };
      }

      // Let model's prototype prepare formData to post otherwise, have a default impl.
      if (!prototype.prepareFormData) {
        prototype.prepareFormData = function (data, options) {
          return {body: JSON.stringify(data)};
        };
      }

      return _.extend(prototype, {
        makeUploadable: function (options) {
          return this;
        },

        sync: function (method, model, options) {
          var useJson          = UploadableMixin.useJSON,
              useMock          = UploadableMixin.mock,
              usePatch         = UploadableMixin.usePatch,
              metadataPartName = UploadableMixin.metadataPartName,
              data             = options.data || options.attrs || this.attributes;

          // Allow data "massage", before sending them to the server.
          if (options.prepare !== false) {
            data = this.prepare(data, options);
          }

          // Make sure, that POST and PUT urls do not contain the URL query
          // part.  It is not possible to ensure it inside the url function.
          function currectUpdatingUrl() {
            var url = options.url || _.result(model, 'url');
            return url.replace(/\?.*$/, '');
          }

          if (method === 'create') {
            log.debug('Creating {0} ({1}).',
                log.getObjectName(this), this.cid) && console.log(log.last);
            if (useMock) {
              // append file, if there is
              _.each(_.keys(options.files || {}), function (key) {
                var files = options.files[key], i;
                if (_.isArray(files) && files.length > 1) {
                  // TODO: Adapt this according to the server support;
                  // currently the server can consume only one file
                  for (i = 0; i < files.length; ++i) {
                    var name = i ? key + i : key;
                    data[name] = files[i];
                  }
                } else if (files) {
                  data[key] = files;
                }
              });

              _.extend(options, {
                data: data,
                contentType: 'application/json',
                url: currectUpdatingUrl()
              });
            } else if (!_.isEmpty(options.files)) {
              var formData = new FormData();
              data = JSON.stringify(data);
              if (useJson) {
                formData.append(metadataPartName,
                    new Blob([data], {type: 'application/json'}));
              } else {
                formData.append(metadataPartName, data);
              }

              // append file, if there is
              _.each(_.keys(options.files || {}), function (key) {
                var files = options.files[key], i;
                if (_.isArray(files) && files.length > 1) {
                  // TODO: Adapt this according to the server support;
                  // currently the server can consume only one file
                  for (i = 0; i < files.length; ++i) {
                    var name = i ? key + i : key;
                    formData.append(name, files[i]);
                  }
                } else if (files) {
                  formData.append(key, files, files.name);
                }
              });

              _.extend(options, {
                data: formData,
                contentType: false,
                url: currectUpdatingUrl()
              });
            } else {
              if (useJson) {
                _.extend(options, {
                  data: JSON.stringify(data),
                  contentType: 'application/json',
                  url: currectUpdatingUrl()
                });
              } else {
                data = this.prepareFormData(data);
                _.extend(options, {
                  data: $.param(data),
                  contentType: 'application/x-www-form-urlencoded',
                  url: currectUpdatingUrl()
                });
              }
            }
          } else if (method === 'update' || method === 'patch') {
            log.debug('Updating {0} ({1}).',
                log.getObjectName(this), this.cid) && console.log(log.last);
            if (!usePatch) {
              method = 'update';
            }
            if (useMock) {
              _.extend(options, {
                data: data,
                contentType: 'application/json',
                url: currectUpdatingUrl()
              });
            } else if (useJson) {
              _.extend(options, {
                data: JSON.stringify(data),
                contentType: 'application/json',
                url: currectUpdatingUrl()
              });
            } else {
              data = this.prepareFormData(data);
              _.extend(options, {
                data: $.param(data),
                contentType: 'application/x-www-form-urlencoded',
                url: currectUpdatingUrl()
              });
            }
          }
          return originalSync.call(this, method, model, options);
        }
      });
    },

    // Set to true to enable tests of PUT and PATCH; once the server
    // accepts application/json content type, change the default to true
    useJSON: config.useJson,

    // Set to true to enable unit tests of POST, PUT and PATCH; files
    // have to be looked up in the jqxhr settings object
    mock: config.useMock,

    // Set to true to enable usage of the PATCH verb, if the server
    // supports it
    usePatch: config.usePatch,

    // Set to true to enable usage of the PATCH verb, if the server
    // supports it
    metadataPartName: config.metadataPartName
  };

  return UploadableMixin;
});

csui.define('csui/models/member/server.adaptor.mixin',[
  'csui/lib/underscore', 'csui/utils/url'
], function (_, Url) {
  'use strict';

  var ServerAdaptorMixin = {
    mixin: function (prototype) {
      return _.extend(prototype, {
        makeServerAdaptor: function (options) {
          return this;
        },

        urlRoot: function () {
          var apiBase = new Url(this.connector.connection.url).getApiBase('v1');
          return Url.combine(apiBase, '/members');
        },

        url: function () {
          var query = Url.combineQueryString(this.getExpandableResourcesUrlQuery()),
              id = this.get('id'),
              url;
          if (id) {
            url = Url.combine(this.urlRoot(), id);
          } else {
            var apiBase = new Url(this.connector.connection.url).getApiBase('v1');
            url = Url.combine(apiBase, '/auth');
          }
          return query ? url + '?' + query : url;
        },

        parse: function (response) {
          return response.user || response.data || response;
        }
      });
    }

  };

  return ServerAdaptorMixin;
});

csui.define('csui/models/member',['csui/lib/backbone',
'csui/models/mixins/expandable/expandable.mixin',
'csui/models/mixins/resource/resource.mixin',
'csui/models/mixins/uploadable/uploadable.mixin',
'csui/models/mixins/including.additional.resources/including.additional.resources.mixin',
'csui/models/member/server.adaptor.mixin'
], function (Backbone, ExpandableMixin, ResourceMixin,
  UploadableMixin, IncludingAdditionalResourcesMixin, ServerAdaptorMixin) {
    'use strict';

  var MemberModel = Backbone.Model.extend({
    constructor: function MemberModel(attributes, options) {
      Backbone.Model.prototype.constructor.call(this, attributes, options);

      this.makeResource(options)
          .makeIncludingAdditionalResources(options)
          .makeUploadable(options)
          .makeExpandable(options)
          .makeServerAdaptor(options);
    },

    clone: function () {
      return new this.constructor(this.attributes, {
        connector: this.connector
      });
    }
  });

  IncludingAdditionalResourcesMixin.mixin(MemberModel.prototype);
  ExpandableMixin.mixin(MemberModel.prototype);
  UploadableMixin.mixin(MemberModel.prototype);
  ResourceMixin.mixin(MemberModel.prototype);
  ServerAdaptorMixin.mixin(MemberModel.prototype);

  return MemberModel;
});

csui.define('csui/models/authentication',['csui/lib/underscore', 'csui/lib/backbone', 'csui/utils/url',
  'csui/models/member', 'csui/models/mixins/connectable/connectable.mixin',
  'csui/models/mixins/fetchable/fetchable.mixin', 'csui/models/mixins/expandable/expandable.mixin',
  'csui/models/mixins/including.additional.resources/including.additional.resources.mixin'
], function (_, Backbone, Url, MemberModel, ConnectableMixin, FetchableMixin,
    ExpandableMixin, IncludingAdditionalResourcesMixin) {
  'use strict';

  var AuthenticationModel = Backbone.Model.extend({

    constructor: function AuthenticationModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);

      this.makeConnectable(options)
          .makeIncludingAdditionalResources(options)
          .makeFetchable(options)
          .makeExpandable(options);

      this.user = new MemberModel(this.get("user"), options);
    },

    idAttribute: null,

    url: function () {
      var url = Url.combine(this.connector.connection.url, "auth"),
          query = Url.combineQueryString(
              this.getExpandableResourcesUrlQuery(),
              this.getAdditionalResourcesUrlQuery()
          );
      return query ? url + '?' + query : url;
    },

    parse: function (response) {
      // Normalize the response to have always an user there.
      var user = response.user || (response.user = response.data);

      // Properties out of data are not passed to the constructor.  This
      // may yet get its own sub-model.
      _.defaults(user, {
        perspective: response.perspective
      });

      // Parse can be called from the parent constructor, before the
      // of this functional object has finished.  In that case, the
      // raw data will be returned in the parsed object; otherwise
      // they will be set to the existing nested collections.
      if (this.user) {
        this.user.set(user);
      }

      return response;
    }

  });

  IncludingAdditionalResourcesMixin.mixin(AuthenticationModel.prototype);
  ExpandableMixin.mixin(AuthenticationModel.prototype);
  ConnectableMixin.mixin(AuthenticationModel.prototype);
  FetchableMixin.mixin(AuthenticationModel.prototype);

  return AuthenticationModel;

});

csui.define('csui/models/browsing.state/browsing.state',['csui/lib/underscore', 'csui/lib/backbone'
], function (_, Backbone) {
  'use strict';

  //
  // Base Model containing browsing state data for the URL. Subclass this one.
  // Structure:
  // - model.attributes.id <string> : browsing state id. E.g. 'browse', 'metadata', 'version', etc.
  // - model.attributes.path <object> : browsing state URL path.
  // - model.attributes.query <object> : browsing state URL query.
  //
  var BrowsingStateModel = Backbone.Model.extend({

    idAttribute: null,

    constructor: function BrowsingStateModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
    },

    // this method can be overriden in derived class
    setData: function (attributes, options) {
      this.set(attributes, options);
    },

    // to be overriden by subclass
    getBaseUrlPath: function () {
      // base implementation, do not change this method
      return '';
    }

  });


  return BrowsingStateModel;

});

csui.define('csui/models/browsing.state/nodes/nodes.browsing.state',['csui/lib/underscore', 'csui/models/browsing.state/browsing.state'
], function (_, BrowsingStateModel) {
  'use strict';

  //
  // Model containing browsing state data for CSUI Node.
  // Browsing state id: 'browse' or property state 'metadata'/'version'
  //
  var NodeBrowsingStateModel = BrowsingStateModel.extend({

    metadataParams: ['perspective', 'panel', 'container_id'],

    constructor: function NodeBrowsingStateModel(attributes, options) {
      var attrs = _.clone(attributes);
      var state = 'browse';
      if (_.has(attributes.query, 'perspective')) {
        state = (attrs.path && attrs.path.version_num !== undefined) ? 'version' : 'metadata';
      }
      attrs.query = this._trimQuery(attributes.query);

      BrowsingStateModel.prototype.constructor.call(this, attrs, options);
      this.set('id', state, {silent: true});
    },

    // override base method
    setData: function (attributes, options) {
      var query = this._trimQuery(attributes.query);
      this.set({path: attributes.path, query: query}, options);
    },

    // override base method
    getBaseUrlPath: function () {
      var pathStr = '';
      if (this.attributes.path) {
        if (this.attributes.path.node_id !== undefined) {
          pathStr += 'nodes/' + this.attributes.path.node_id;
          if (this.attributes.path.version_num !== undefined) {
            pathStr += '/versions/' + this.attributes.path.version_num;
          }
        }
      }
      return pathStr;
    },

    // utility method: trim query to omit metadata parameters
    _trimQuery: function (query) {
      var qr = query;
      if (_.has(query, 'perspective') !== true) {
        qr = _.omit(query, this.metadataParams);
      }
      return qr;
    }

  });

  return NodeBrowsingStateModel;

});

csui.define('csui/models/browsing.state/browsing.states',['csui/lib/underscore', 'csui/lib/backbone', 'csui/models/browsing.state/browsing.state',
  'csui/models/browsing.state/nodes/nodes.browsing.state'
], function (_, Backbone, BrowsingStateModel, NodeBrowsingStateModel) {
  'use strict';

  //
  // A stack represents the collection of browsing states for the URL.
  // Use 'push' and 'pop' method to add and remove a browsing state.
  //
  var BrowsingStateCollection = Backbone.Collection.extend({

    model: BrowsingStateModel,

    constructor: function BrowsingStateCollection(models, options) {
      this.options = options || {};
      Backbone.Collection.prototype.constructor.apply(this, arguments);
    },

    resetAll: function (options) {
      this.updateBrowserTitleAfterPageLoaded = false;
      this.triggerStateChangeOnStateRemoval = false;
      this.allowUrlUpdate = false;
      this.reset(null, options);
    },

    clearMetadataParamsInUrlQuery: function (query) {
      var queryStr = query;
      if (this.allowUrlUpdate && this._routeWithSlashes()) {
        if (queryStr && queryStr.length > 0) {
          var metaParams = ['perspective', 'panel', 'container_id'];
          queryStr.charAt(0) === '?' && (queryStr = queryStr.substring(1));
          var queryObj = _.omit(this._convertQuerystringToObject(queryStr), metaParams);
          queryStr = this._convertQueryObjectToQueryString(queryObj);
        }
      }
      return queryStr;
    },

    // add appropriate browsing state(s) based on input parameters:
    // - path: <object>; e.g. {node_id: id [, version_num: num]}
    // - query: <string> the URL querystring after question mark (?)
    setBrowsingStates: function (path, query) {
      if (path && path.node_id !== undefined) {
        this._setNodeBrowsingStates(path, query);
      } else {  // add new browsing state type when needed
        throw new Error("Not yet supported browsing state. Please add a new type.");
      }
    },

    _setNodeBrowsingStates: function (path, query) {
      var currentBrowsingState;
      var addNewState = true;
      if (this.length > 0) {
        var nodeStateIds = ['browse', 'metadata', 'version'];
        currentBrowsingState = this.at(this.length - 1);
        if (_.indexOf(nodeStateIds, currentBrowsingState.get('id')) !== -1) {
          addNewState = false;
        }
      }

      // with nextNode change:id event, there is no query sent. Check location.
      var queryStr = query;
      if (queryStr === undefined && this._routeWithSlashes()) {
        var locationQuery = location.search;  // location.hash will be added on later
        if (locationQuery.length > 0) {
          var prevAllowUrlUpdate = this.allowUrlUpdate;
          this.allowUrlUpdate = true;  // temporary
          queryStr = this.clearMetadataParamsInUrlQuery(locationQuery);
          queryStr.charAt(0) === '?' && (queryStr = queryStr.substring(1));
          this.allowUrlUpdate = prevAllowUrlUpdate;  // reset back to previous value
        }
      }

      var queryObj = this._convertQuerystringToObject(queryStr);
      var attributes = {path: path, query: queryObj};
      if (addNewState) {
        // metadata perspective: add a 'metadata' node browsing state
        if (queryObj.perspective === 'metadata' || queryObj.perspective === 'metadata.navigation') {
          this.push(new NodeBrowsingStateModel(attributes), {silent: true});
          // Only allow URL update when the Route includes metadata perspective override
          // because the user can navigate to another object while in perspective override mode
          this.allowUrlUpdate = true;
          // flag to update browser's title after the page is rendered and node info is loaded
          this.updateBrowserTitleAfterPageLoaded = true;
        } else {
          // normal default 'node' browsing state
          this.push(new NodeBrowsingStateModel(attributes), {silent: true});
        }
      } else {
        currentBrowsingState.setData(attributes, {silent: true});
      }
    },

    getUrlPathWithQuery: function () {
      // This method accumulatively includes query params of ALL browsing states.
      // It is useful in scenarios such as the previous browsing state is 'browse' that its query
      // params should be included so that the next browsing state like 'metadata' can have enough
      // parameters to build navigational list and go back to the exact browse table state later.
      var urlPath = '';
      if (this.length > 0) {
        var currentBrowsingState = this.at(this.length - 1);
        if (currentBrowsingState) {
          urlPath = currentBrowsingState.getBaseUrlPath();
          urlPath += this._getCurrentStateAccumulatedQueryParamsString();
        }
      }

      if (this._routeWithSlashes()) {
        return urlPath + location.hash;
      } else {
        return urlPath;
      }
    },

    _getCurrentStateAccumulatedQueryParamsString: function () {
      var i, queryObj = {};
      for (i = this.length - 1; i >= 0; i--) {
        queryObj = _.defaults(queryObj, this.at(i).get('query') || {});
      }
      return this._convertQueryObjectToQueryString(queryObj);
    },

    // utility method: convert query object to query string
    _convertQueryObjectToQueryString: function (query) {
      var queryStr = '';
      if (query) {
        _.each(query, function (value, key) {
          queryStr += queryStr.length === 0 ? '?' : '&';
          queryStr += key + '=' + value;
        });
      }
      return queryStr;
    },

    // utility method: convert query string to query object
    _convertQuerystringToObject: function (queryStr) {
      var params = {};
      if (queryStr && _.isString(queryStr)) {
        var match,
            pl = /\+/g,  // Regex for replacing addition symbol with a space
            search = /([^&=]+)=?([^&]*)/g,
            decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); };
        while ((match = search.exec(queryStr)) !== null) {
          params[decode(match[1])] = decode(match[2]);
        }
      }
      return params;
    },

    _routeWithSlashes: function () {
      return /\/app(?:\/.*)?$/.test(location.pathname);
    }

  });

  return BrowsingStateCollection;

});

csui.define('csui/models/clientsidecollection',['csui/lib/underscore', 'csui/lib/backbone', 'csui/utils/base'
], function (_, Backbone, base) {
  'use strict';

  function ClientSideCollection() {
    var prototype = {

      clone: function () {
        // Provide the options; they may include connector and other parameters
        var clone = new this.constructor(this.models, this.options);
        // Clone sub-models not covered by Backbone
        if (this.columns) {
          clone.columns.reset(this.columns.toJSON());
        }
        // Clone properties about the full (not-yet fetched) collection
        clone.actualSkipCount = this.actualSkipCount;
        clone.totalCount = this.totalCount;
        clone.filteredCount = this.filteredCount;
        return clone;
      },

      _cacheCollection: function () {
        if (this.selfReset !== true) {
          this.selfReset = false;
          this.cachedCollection = this.clone();
        }
      },

      parse: function (response) {
        this.actualSkipCount = 0;
        this.totalCount = response.results.length;
        this.filteredCount = this.totalCount;

        this._limitResponse(response.results);

        this.columns && this.columns.resetColumnsV2(response, this.options);
        return response.results;
      },

      _limitResponse: function (elements) {
        if (elements && this.skipCount) {
          if (elements.length > this.skipCount) {
            elements.splice(0, this.skipCount);
          } else {
            this.actualSkipCount = 0;
          }
        }
        if (elements && this.topCount) {
          if (elements.length > this.topCount) {
            elements.splice(this.topCount);
          }
        }
      },

      _resetCollection: function () {
        if (!this.cachedCollection) {
          this._cacheCollection();
        }
        this.workingModels = _.clone(this.cachedCollection.models);
        this.totalCount = this.workingModels.length;
        this.filteredCount = this.workingModels.length;
      },

      _runAllOperations: function (reset) {
        this._resetCollection();
        this._sortCollection();
        this._filterCollection();
        this._limitCollection();
        this._triggerCollectionResetEvent(reset);
      },

      _triggerCollectionResetEvent: function (reset) {
        this.models = _.clone(this.workingModels);
        this.length = this.models.length;
        if (reset) {
          this.selfReset = true;
          this.trigger("reset", this);
        }
      },

      // client-side paging
      setLimit: function (skip, top, fetch) {
        if (this.skipCount != skip || this.topCount != top) {
          this.skipCount = skip;
          this.actualSkipCount = skip;
          this.topCount = top;

          this._runAllOperations(true);

          return true;
        }
      },

      _limitCollection: function () {
        this._limitResponse(this.workingModels);
      },

      resetLimit: function (fetch) {
        if (this.skipCount) {
          this.skipCount = 0;
          this.topCount = 0;
          this.actualSkipCount = 0;

          this._resetCollection();
          this._triggerCollectionResetEvent(true);

          return true;
        }
      },

      // client-side filtering
      setFilter: function (filterObj) {
        this.filterObj || (this.filterObj = {});
        if (_.isEmpty(filterObj)) {
          this.filterObj = {};
        } else {
          _.extend(this.filterObj, filterObj);
        }
        this._runAllOperations(true);
        return true;
      },

      clearFilter: function (fetch) {
        if (this.filterObj) {
          this.filterObj = undefined;
          this._resetCollection();
          this._triggerCollectionResetEvent(true);
          return true;
        }
      },

      _filterCollection: function () {
        for (var name in this.filterObj) {
          if (_.has(this.filterObj, name)) {
            var values = this.filterObj[name];
            if (values != null && values !== '') {
              _.isArray(values) || (values = [values]);
              this.workingModels = _.filter(this.workingModels, function (node) {
                var hay = parseValue(name, node.get(name));
                return _.any(values, function (value) {
                  var needle = parseValue(name, value);
                  if (name === 'type' && needle == -1) {
                    return node.get('container');
                  }
                  return containsValue(hay, needle);
                });
              });
            }
          }
        }
        this.totalCount = this.workingModels.length;
        this.filteredCount = this.workingModels.length;
      },

      // client-side sorting
      setOrder: function (attributes, fetch) {
        if (this.orderBy != attributes) {
          this.orderBy = attributes;
          this._runAllOperations();
          return true;
        }
      },

      resetOrder: function (fetch) {
        if (this.orderBy) {
          this.orderBy = undefined;
          this._resetCollection();
          this._triggerCollectionResetEvent();
          return true;
        }
      },

      _sortCollection: function () {
        if (this.orderBy) {
          var criteria = _.map(this.orderBy.split(','), function (criterium) {
            var parts = criterium.trim().split(' ');
            return {
              property: parts[0],
              descending: parts[1] === 'desc'
            };
          });

          this.workingModels.sort(function (left, right) {
            var result = 0;
            _.find(criteria, function (criterium) {
              left = parseValue(criterium.property, left.get(criterium.property));
              right = parseValue(criterium.property, right.get(criterium.property));

              result = compareValues(left, right);
              if (result) {
                if (criterium.descending) {
                  result *= -1;
                }
                return true;
              }
            });
            return result;
          });
        }
      }

    };
    prototype.ClientSideCollection = _.clone(prototype);

    return prototype;
  }

  // TODO: ClientSideBrowsableMixin should be used
  // and ClientSideCollection module disused

  function compareValues(left, right) {
    if (typeof left === 'string' && typeof right === 'string') {
      // FIXME: Implement the locale-specific comparison only for localizable strings;
      // not for values with internal system constants, which can be case-sensitive
      return base.localeCompareString(left, right, {usage:'sort'});
    }
    if (left != right) {
      if (left > right || right === void 0) {
        return 1;
      }
      if (left < right || left === void 0) {
        return -1;
      }
    }
    return 0;
  }

  function containsValue(hay, needle) {
    if (typeof hay === 'string' && typeof needle === 'string') {
      // FIXME: Implement the locale-specific comparison only for localizable strings;
      // not for values with internal system constants, which can be case-sensitive
      return base.localeContainsString(hay, needle.toString());
    }
    return hay == needle;
  }

  // FIXME: Use metadata to get the correct value type for parsing
  function parseValue(property, value) {
    if (value != null) {
      if (property === 'type') {
        return +value;
      }
      if (property.indexOf('date') >= 0) {
        return new Date(value);
      }
    }
    return value;
  }

  return ClientSideCollection;

});

csui.define('csui/models/column',["module", "csui/lib/underscore", "csui/lib/backbone", "csui/utils/url",
  "csui/utils/log"
], function (module, _, Backbone, Url, log) {

  var ColumnModel = Backbone.Model.extend({

    constructor: function ColumnModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
    },

    idAttribute: null,

    parse: function (response) {
      //~ if (log.debug("Parsing column \"{0}\" ({1}, {2}).",
      //~ response.name, response.column_key, response.id)) {
      //~ console.log(log.last);
      //~ console.log(response);
      //~ }

      // TODO: support these attributes on the server too.
      switch (response.column_key) {
      case "name":
        response = _.extend(response, {
          default_action: true,
          contextual_menu: false,
          editable: true,
          filter_key: "name"
        });
        break;
      case "type":
        response = _.extend(response, {
          default_action: true
        });
        break;
      }

      return response;
    }

  });
  ColumnModel.version = '1.0';

  return ColumnModel;

});

csui.define('csui/models/columns',["module", "csui/lib/backbone",
  "csui/utils/log", "csui/models/column"
], function (module, Backbone, log, ColumnModel) {

  var ColumnCollection = Backbone.Collection.extend({

    model: ColumnModel,

    constructor: function ColumnCollection() {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
    }

  });
  ColumnCollection.version = '1.0';

  return ColumnCollection;

});

csui.define('csui/models/datadefinition',[ "module", "csui/lib/backbone", "csui/utils/log"
],  function ( module, Backbone, log )
  {
    "use strict";

    //
    // Data-Definition Model.
    //
    var DataDefinitionModel = Backbone.Model.extend({

      constructor: function DataDefinitionModel() {
        Backbone.Model.prototype.constructor.apply(this, arguments);
      },

      idAttribute: null,

      parse: function (response) {
        return response;
      }

    });

    DataDefinitionModel.version = '1.0';

    return DataDefinitionModel;

  });

csui.define('csui/models/datadefinitions',[ "module", "csui/lib/underscore", "csui/lib/backbone",
         "csui/utils/log", "csui/utils/base", "csui/models/datadefinition"
], function( module, _, Backbone,
             log, base, DataDefinitionModel )
  {
    "use strict";

    //
    // Generic Data-Definition Collection.
    //
    // Params in constructor:
    // - models: can be passed in or undefined
    // - options:
    //   Two possible ways with the 'options' in constructor as in the following examples:
    //   1) options = {
    //        connector: connector,
    //        url: "api/v1/nodes/2000"
    //      }
    //   2) options = {
    //        node: node,
    //        [nodeResource: "actions"]  // optional
    //      }
    //
    var DataDefinitionCollection = Backbone.Collection.extend({

      model: DataDefinitionModel,

      constructor: function DataDefinitionCollection( models, options ) {
        Backbone.Collection.prototype.constructor.apply(this, arguments);
        this.setOptions( options );
      },

      // public
      setOptions: function( options ) {
        this.options = options ? options : {};
        this.options.connector && this.options.connector.assignTo(this);
        this.options.node && this.options.node.connector && this.options.node.connector.assignTo(this);
      },

      url: function() {
        var url;
        if( this.options.url ) {
          var cgiPath = new base.Url(this.connector.connection.url).getCgiScript(true);
          url = base.Url.combine( cgiPath, this.options.url );
        } else {
          url = this.options.node && this.options.node.urlBase();
          if( this.options.nodeResource ) {
            url = base.Url.combine( url, this.options.nodeResource );
          }
        }
        return url;
      },

      fetch: function( options ) {
        log.debug( "Fetching data-definitions for url '{0}'.", this.url()) &&
          typeof console !== 'undefined' && console.log( log.last );

        options || (options = {});
        if( options.reset === undefined ) {
          options.reset = true;
        }

        return Backbone.Collection.prototype.fetch.call( this, options );
      },

      parse: function( response, options ) {
        this.data = response.data || {};
        this.definitions = response.definitions || {};
        this.definitions_map = response.definitions_map || {};
        this.definitions_order = response.definitions_order || {};

        // construct a flat structure
        this.definitions_flat = {};
        _.each( this.definitions, function( def, key ) {
          var definition = _.extend(
            {
              signature: key,
              href: this.data[key]
            },
            def
          );
          this.definitions_flat[key] = definition;
        }, this);

        return Backbone.Collection.prototype.parse.call( this,
          this.definitions_flat, options);
      },

      // public
      GetDefinitionsOrder: function() {
        return this.definitions_order;
      },

      // public
      GetDefinitionMap: function() {
        return this.definitions_map;
      },

      // public
      GetDefinition: function( signature ) {
        return this.definitions[signature];
      },

      // public: get the flat definitions structure of data-definitions
      GetFlatCollection: function() {
        return this.definitions_flat || {};
      },

      // public: return a flat definition based on the requested definition key
      GetFlatDefinition: function( def ) {
        return this.definitions_flat[def];
      }

    });

    _.extend( DataDefinitionCollection, { version: '1.0' } );

    return DataDefinitionCollection;

  });

csui.define('csui/models/mixins/v2.fields/v2.fields.mixin',['csui/lib/underscore'], function (_) {
  'use strict';

  var FieldsV2Mixin = {
    mixin: function (prototype) {
      return _.extend(prototype, {
        makeFieldsV2: function (options) {
          this.fields = options && options.fields || {};
          return this;
        },

        setFields: function (role, names) {
          if (_.isObject(role)) {
            _.each(role, function (value, key) {
              this._setOneFieldSet(key, value);
            }, this);
          } else {
            this._setOneFieldSet(role, names);
          }
        },

        resetFields: function (role, names) {
          if (_.isObject(role)) {
            _.each(role, function (value, key) {
              this._resetOneFieldSet(key, value);
            }, this);
          } else {
            this._resetOneFieldSet(role, names);
          }
        },

        getResourceFieldsUrlQuery: function () {
          return _.reduce(this.fields, function (result, names, role) {
            var fields = result.fields || (result.fields = []),
                encodedNames = _.map(names, encodeURIComponent),
                field = encodeURIComponent(role);
            if (encodedNames.length) {
              var dot = field.indexOf('.');
              if (dot > 0) {
                // versions.element(0) -> versions{mime_type}.element(0)
                field = field.substring(0, dot) + '{' + encodedNames.join(',') + '}' +
                        field.substring(dot);
              } else {
                // properties -> properties{name}
                field += '{' + encodedNames.join(',') + '}';
              }
            }
            fields.push(field);
            return result;
          }, {});
        },

        _setOneFieldSet: function (role, names) {
          var fields = this.fields[role] || (this.fields[role] = []);
          if (names) {
            if (!_.isArray(names)) {
              names = names.split(',');
            }
            _.each(names, function (name) {
              if (!_.contains(fields, name)) {
                fields.push(name);
              }
            }, this);
          }
        },

        _resetOneFieldSet: function (role, names) {
          if (names) {
            var fields = this.fields[role] || (this.fields[role] = []);
            if (!_.isArray(names)) {
              names = names.split(',');
            }
            _.each(names, function (name) {
              var index = _.indexOf(fields, name);
              if (index >= 0) {
                fields.splice(index, 1);
              }
            }, this);
          } else if (role) {
            delete this.fields[role];
          } else {
            _.chain(this.fields)
             .keys()
             .each(function (key) {
               delete this.fields[key];
             }, this);
          }
        }
      });
    },

    mergePropertyParameters: function (output, input) {
      if (typeof input === 'string') {
        input = input.split(',');
      }
      if (Array.isArray(input)) {
        input = input.reduce(function (result, name) {
          var value = result[name];
          // If all fields or expands in a scope were requested, ensure,
          // that an empty array is assigned to it to include app properties
          if (!value || value.length) {
            result[name] = [];
          }
          return result;
        }, {});
      }
      output || (output = {});
      _.each(input, function (values, name) {
        var target = output[name];
        if (target) {
          _.each(values, function (value) {
            if (!_.contains(target, value)) {
              target.push(value);
            }
          });
        } else {
          output[name] = values;
        }
      });
      return output;
    }
  };

  return FieldsV2Mixin;
});

csui.define('csui/models/mixins/v2.expandable/v2.expandable.mixin',[
  'csui/lib/underscore', 'csui/models/mixins/v2.fields/v2.fields.mixin'
], function (_, FieldsV2Mixin) {
  'use strict';

  var ExpandableV2Mixin = {
    mixin: function (prototype) {
      return _.extend(prototype, {
        makeExpandableV2: function (options) {
          this.expand = options && options.expand || {};
          return this;
        },

        setExpand: function (role, names) {
          if (_.isObject(role)) {
            _.each(role, function (value, key) {
              this._setOneExpand(key, value);
            }, this);
          } else {
            this._setOneExpand(role, names);
          }
        },

        resetExpand: function (role, names) {
          if (_.isObject(role)) {
            _.each(role, function (value, key) {
              this._resetOneExpand(key, value);
            }, this);
          } else {
            this._resetOneExpand(role, names);
          }
        },

        getExpandableResourcesUrlQuery: function () {
          return _.reduce(this.expand, function (result, names, role) {
            var expand = result.expand || (result.expand = []),
                encodedNames = _.map(names, encodeURIComponent),
                expandable = encodeURIComponent(role);
            if (encodedNames.length) {
              expandable += '{' + encodedNames.join(',') + '}';
            }
            expand.push(expandable);
            return result;
          }, {});
        },

        _setOneExpand: function (role, names) {
          var expand = this.expand[role] || (this.expand[role] = []);
          if (names) {
            if (!_.isArray(names)) {
              names = names.split(',');
            }
            _.each(names, function (name) {
              if (!_.contains(expand, name)) {
                expand.push(name);
              }
            }, this);
          }
        },

        _resetOneExpand: function (role, names) {
          if (names) {
            var expand = this.expand[role] || (this.expand[role] = []);
            if (!_.isArray(names)) {
              names = names.split(',');
            }
            _.each(names, function (name) {
              var index = _.indexOf(expand, name);
              if (index >= 0) {
                expand.splice(index, 1);
              }
            }, this);
          } else if (role) {
            delete this.expand[role];
          } else {
            _.chain(this.expand)
             .keys()
             .each(function (key) {
               delete this.expand[key];
             }, this);
          }
        }
      });
    },

    mergePropertyParameters: FieldsV2Mixin.mergePropertyParameters
  };

  return ExpandableV2Mixin;
});

csui.define('csui/models/mixins/v2.commandable/v2.commandable.mixin',['csui/lib/underscore', 'csui/utils/url'
], function (_, Url) {
  "use strict";

  var CommandableV2Mixin = {

    mixin: function (prototype) {
      return _.extend(prototype, {

        makeCommandableV2: function (options) {
          var commands = options && options.commands;
          if (typeof commands === 'string') {
            commands = commands.split(',');
          }
          this.commands = commands || [];
          return this;
        },

        setCommands: function (name) {
          if (!_.isArray(name)) {
            name = name.split(",");
          }
          _.each(name, function (name) {
            if (!_.contains(this.commands, name)) {
              this.commands.push(name);
            }
          }, this);
        },

        resetCommands: function (name) {
          if (name) {
            if (!_.isArray(name)) {
              name = name.split(",");
            }
            _.each(name, function (name) {
              var index = _.indexOf(this.commands, name);
              if (index >= 0) {
                this.commands.splice(index, 1);
              }
            }, this);
          } else {
            this.commands.splice(0, this.commands.length);
          }
        },

        getRequestedCommandsUrlQuery: function () {
          return this.commands.length && {actions: this.commands};
        }

      });
    }

  };

  return CommandableV2Mixin;

});

csui.define('csui/models/node.actions/server.adaptor.mixin',[
  'csui/lib/underscore', 'csui/utils/url'
], function (_, Url) {
  'use strict';

  var ServerAdaptorMixin = {
    mixin: function (prototype) {
      return _.extend(prototype, {
        makeServerAdaptor: function (options) {
          return this;
        },

        url: function () {
          var query;
          if (!!this.parent_id) {
            query = Url.combineQueryString({
                  reference_id: this.parent_id,
                  ids: this.nodes
                },
                this.getRequestedCommandsUrlQuery()
            );
          }
          else {
            query = Url.combineQueryString({
                  ids: this.nodes
                },
                this.getRequestedCommandsUrlQuery()
            );
          }


          return Url.combine(this.connector.connection.url.replace('/v1', '/v2'),
            '/nodes/actions') + '?' + query;
        },

        parse: function (response, options) {
          // FIXME: Remove this, as soon as all servers support GET v2/nodes/actions.
          if (_.isArray(response)) {
            return response;
          }
          // from { node_id: { data: { command_key: { ... }, ... }, ... }
          // to [ { id: node_id, actions: [ { signature: command_key, ... }, ... ] }, ... ]
          return _.map(response.results, function (value, key) {
            return {
              id: key,
              actions: _.map(value.data, function (value, key) {
                value.signature = key;
                return value;
              })
            };
          }, {});
        }

      });
    }
  };

  return ServerAdaptorMixin;
});

csui.define('csui/models/node.actions',['csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/url', 'csui/models/actions',
  'csui/models/mixins/connectable/connectable.mixin',
  'csui/models/mixins/fetchable/fetchable.mixin',
  'csui/models/mixins/v2.commandable/v2.commandable.mixin',
  'csui/models/node.actions/server.adaptor.mixin'
], function (_, Backbone, Url, ActionCollection,
    ConnectableMixin, FetchableMixin, CommandableMixin, ServerAdaptorMixin) {
  'use strict';

  var NodeActionModel = Backbone.Model.extend({

    constructor: function NodeActionModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);

      this.actions = new ActionCollection(attributes && attributes.actions);
    }

  });

  var NodeActionCollection = Backbone.Collection.extend({

    model: NodeActionModel,

    constructor: function NodeActionCollection(attributes, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);

      var nodes = options && options.nodes;
      if (typeof nodes === 'string') {
        nodes = nodes.split(',');
      }
      this.nodes = nodes || [];

      this.makeConnectable(options)
          .makeFetchable(options)
          .makeCommandableV2(options)
          .makeServerAdaptor(options);
    },

    setNodes: function (nodes) {
      if (!_.isArray(nodes)) {
        nodes = nodes.split(',');
      }
      _.each(nodes, function (node) {
        if (!_.contains(this.nodes, node)) {
          this.nodes.push(node);
        }
      }, this);
    },

    resetNodes: function (nodes) {
      if (nodes) {
        if (!_.isArray(nodes)) {
          nodes = nodes.split(',');
        }
        _.each(nodes, function (node) {
          var index = _.indexOf(this.nodes, node);
          if (index >= 0) {
            this.nodes.splice(index, 1);
          }
        }, this);
      } else {
        this.nodes = [];
      }
    },

    clone: function () {
      return new this.constructor(this.models, {
        connector: this.connector,
        nodes: _.clone(this.nodes),
        commands: _.clone(this.includeCommands)
      });
    }

  });

  ConnectableMixin.mixin(NodeActionCollection.prototype);
  FetchableMixin.mixin(NodeActionCollection.prototype);
  CommandableMixin.mixin(NodeActionCollection.prototype);
  ServerAdaptorMixin.mixin(NodeActionCollection.prototype);

  return NodeActionCollection;

});


csui.define('csui/utils/promoted.actionitems',[
  'csui/lib/underscore', 'csui/models/actionitems',
  // Load and register external default action rules
  'csui-ext!csui/utils/promoted.actionitems'
], function (_, ActionItemCollection, extraActions) {
  'use strict';

  var promotedActionItems = new ActionItemCollection([
    // Default for versions is always version open command
    {
      signature: 'properties',
      sequence: 10
    },
    {
      signature: 'unreserve',
      sequence: 10
    },
    {
      signature: 'permissions',
      sequence: 10
    },
    {
      signature: 'reserve',
      sequence: 10
    },
    {
      signature: 'rename',
      sequence: 10
    },
    {
      signature: 'edit',
      sequence: 10
    },
    {
      signature: 'copy',
      sequence: 10
    },
    {
      signature: 'move',
      sequence: 10
    },
    {
      signature: 'download',
      sequence: 10
    },
    {
      signature: 'comment',
      sequence: 10
    },
    {
      signature: 'open',
      sequence: 10
    },
    {
      signature: 'delete',
      sequence: 10
    },
    {
      signature: 'browse',
      sequence: 10
    },
    {
      signature: 'addversion',
      sequence: 10
    }
  ]);

  if (extraActions) {
    promotedActionItems.add(_.flatten(extraActions, true));
  }

  return promotedActionItems;

});

// Adds the deepClone method to _, Backbone.Model and Backbone.Collection
csui.define('csui/utils/deepClone/deepClone',['csui/lib/underscore', 'csui/lib/backbone'], function (_, Backbone) {

  // See https://gist.github.com/prantlf/6d134475af24d4b2f7de

  // Performs a deep clone of primitive values, arrays, object literals,
  // and arbitrary objects, if requested.  It is supposed to clone object
  // literals, which are going to be modified, but the original should
  // stay intact.
  //
  // The default behaviour works well with JSON REST API responses and
  // and other objects, which contain only values of native types.
  // If functions or HTML elements are encountered, they will not be
  // actually cloned; they will be just copied, which works well with
  // the typical options objects for Backbone constructors.
  // If arbitrary objects can be encountered, additional options can
  // be used to specify the result:
  //
  // default behaviour
  // : Throws an error
  // cloneCloneableObjects: true
  // : Uses deepClone or clone method, if available.
  // cloneArbitraryObjects: true
  // : Creates new objects with clones own properties of the original.
  // copyArbitraryObjects
  // : Copies the original.
  //
  // This function depends on Underscore.js.
  function deepClone(source, options) {
    var result = {},
        key;
    if (!source || typeof source !== 'object' || source instanceof HTMLElement ||
        _.isBoolean(source) || _.isNumber(source) || _.isString(source)) {
      return source;
    }
    if (_.isDate(source) || _.isRegExp(source)) {
      return new source.constructor(source.valueOf());
    }
    if (_.isArray(source)) {
      return _.map(source, function (obj) {
        return _.deepClone(obj);
      });
    }
    if (source.constructor !== Object) {
      if (options) {
        if (options.cloneCloneableObjects) {
          if (source.deepClone) {
            return source.deepClone();
          }
          if (source.clone) {
            return source.clone();
          }
        }
        if (options.copyArbitraryObjects) {
          return source;
        }
        if (!options.cloneArbitraryObjects) {
          throw new Error('Cannot clone an arbitrary function object instance');
        }
      } else {
        throw new Error('Cannot clone an arbitrary function object instance');
      }
    }
    return _.reduce(source, function (result, value, key) {
      result[key] = deepClone(value);
      return result;
    }, {});
  }

  // Expose deepClone among the Underscore.js methods
  _.mixin({deepClone: deepClone});

  // Add deepClone to the Backbone.Model prototype
  Backbone.Model.prototype.deepClone = function (options) {
    return new this.constructor(deepClone(this.attributes, options));
  };

  // Add deepClone to the Backbone.Collection prototype
  Backbone.Collection.prototype.deepClone = function (options) {
    return new this.constructor(this.map(function (model) {
      return deepClone(model.attributes, options);
    }));
  };

  return deepClone;

});

csui.define('csui/models/mixins/v2.delayed.commandable/v2.delayed.commandable.mixin',[
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/models/node.actions',
  'csui/models/mixins/v2.commandable/v2.commandable.mixin', 'csui/utils/promoted.actionitems',
  'csui/utils/deepClone/deepClone'
], function (_, $, Backbone, NodeActionCollection, CommandableV2Mixin, promotedActionItems) {
  'use strict';

  var DelayedCommandableV2Mixin = {
    mixin: function (prototype) {
      CommandableV2Mixin.mixin(prototype);

      var originalPrepareModel = prototype._prepareModel;

      return _.extend(prototype, {
        makeDelayedCommandableV2: function (options) {
          options || (options = {});
          var defaultActionCommands = options.defaultActionCommands;
          var promotedActionCommands = promotedActionItems.getPromotedCommandsSignatures();
          var nonPromotedActionCommands = [];
          if (typeof defaultActionCommands === 'string') {
            defaultActionCommands = defaultActionCommands.split(',');
          }
          this.defaultActionCommands = defaultActionCommands || [];
          this.promotedActionCommands = promotedActionCommands;
          this.nonPromotedActionCommands = nonPromotedActionCommands || [];
          this.delayedActions = new NodeActionCollection(undefined, {
            connector: options.connector
          });

          this.nonPromotedActions = new NodeActionCollection(undefined, {
            isNonPromoted: true,
            connector: options.connector
          });

          this.setEnabledDelayRestCommands(options.delayRestCommands);

          this.delayRestCommandsForModels = options.delayRestCommandsForModels;

          this.promotedActionItemsFromControler = promotedActionItems;

          return this.makeCommandableV2(options);
        },

        setEnabledDelayRestCommands: function (enable) {
          if (enable) {
            this._enableDelayRestCommands();
          } else {
            this._disableDelayRestCommands();
          }
        },

        setEnabledLazyActionCommands: function (enable) {
          var deferred = $.Deferred();
          if (enable) {
            this._enableNonPromotedRestCommands();
            this._requestsNonPromotedRestActions().done(function (node) {
              deferred.resolve(node);
            }).fail(function () {
                  deferred.reject();
                }
            );

          } else {
            this._disableNonPromotedRestCommands();
          }
          return deferred.promise();
        },

        _enableDelayRestCommands: function () {
          if (!this.delayRestCommands) {
            this.delayRestCommands = true;
            this.on('sync', this._requestRestActions, this);
          }
        },

        _disableDelayRestCommands: function () {
          if (this.delayRestCommands) {
            this.delayRestCommands = false;
            this.off('sync', this._requestRestActions, this);
          }
        },

        _enableNonPromotedRestCommands: function () {
          if (!this.enableNonPromotedCommands) {
            this.enableNonPromotedCommands = true;
            this.on('sync', this._requestsNonPromotedRestActions, this);
          }
        },

        _disableNonPromotedRestCommands: function () {
          this.enableNonPromotedCommands = false;
          this.off('sync', this._requestsNonPromotedRestActions, this);
        },

        _requestRestActions: function (model, resp, options) {
          // Guard against propagated sync event: if this mixin has been
          // applied to a collection, only fetch of the collection should
          // be handled here; fetching of models should not re-fetch actions
          // for the whole collection.
          // Also do nothing if the collection is empty.
          if (model !== this || this instanceof Backbone.Collection && !this.length) {
            return;
          }
          // request delayed actions only when fetching
          if (options.xhr && options.xhr.settings.type !== 'GET') {
            return;
          }
          var defaultActionCommands  = this.defaultActionCommands,
              promotedActionCommands = this.promotedActionCommands;

          //NonPromotedActionCommands = allCommands - defaultActionCommnads - promotedActionCommands
          //DelayActions = (allCommands - defaultActionCommnads) Intersect promotedActionCommands;
          var restCommands        = _.reject(this.commands, function (command) {
                return _.contains(defaultActionCommands, command);
              }),
              promotedCommands    = [],
              nonPromotedCommands = [];
          _.each(restCommands, function (command) {
            if (_.contains(promotedActionCommands, command)) { //CurrentPromotedActions
              promotedCommands.push(command); // Delay Commands
            }
            else {
              nonPromotedCommands.push(command); // nonpromoted Commands
            }
          });

          this.promotedActionCommands = promotedCommands;
          this.nonPromotedActionCommands = nonPromotedCommands;
          ///remove other commands which are not declared in toolbarItems
          if (promotedCommands.length) {
            var delayedActions = this.delayedActions;
            delayedActions.resetCommands();
            delayedActions.setCommands(promotedCommands);
            delayedActions.resetNodes();
            if (this instanceof Backbone.Collection) {
              var restNodes = [];
              this.each(function (model) {
                //update node model with promoted and nonpromoted commands list, Since we are
                // not fetching every node info individually
                model.nonPromotedActionCommands = nonPromotedCommands;
                model.promotedActionCommands = promotedCommands;
                if (!model.get('csuiDelayedActionsRetrieved')) {
                  restNodes.push(model.get('id'));
                }
              });
              delayedActions.setNodes(restNodes);
            } else {
              model.nonPromotedActionCommands = nonPromotedCommands;
              model.promotedActionCommands = promotedCommands;
              delayedActions.setNodes([this.get('id')]);
            }
            delayedActions.parent_id = !!this.node ? this.node.get("id") : this.get("id");
            if (delayedActions.nodes.length > 0) {
              if (!delayedActions.connector) {
                this.connector.assignTo(delayedActions);
              }
              delayedActions
                  .fetch({
                    reset: true,
                    // Update the actions as soon as possible; event
                    // and promise can be watched by someone else
                    success: _.bind(this._updateOriginalActions, this)
                  });
            }
          } else {
            //update node with promoted and non-promoted commands list If there are no promoted
            // commands
            if (this instanceof Backbone.Collection) {
              this.each(function (model) {
                model.nonPromotedActionCommands = nonPromotedCommands;
                model.promotedActionCommands = promotedCommands;
              });
            } else {
              model.nonPromotedActionCommands = nonPromotedCommands;
              model.promotedActionCommands = promotedCommands;
            }
          }
        },

        _requestsNonPromotedRestActions: function () {
          var deferred = $.Deferred();
          var nonPromotedActions        = this.nonPromotedActions,
              nonPromotedActionCommands = this.nonPromotedActionCommands.length ?
                                          this.nonPromotedActionCommands :
                                          this.collection.nonPromotedActionCommands;
          nonPromotedActions.resetCommands();
          nonPromotedActions.setCommands(nonPromotedActionCommands);
          nonPromotedActions.resetNodes();
          if (this instanceof Backbone.Collection) {
            var restNodes = [];
            this.each(function (model) {
              if (!model.get('csuiLazyActionsRetrieved') && !model.isLocallyCreated) {
                restNodes.push(model.get('id'));
              }
            });
            nonPromotedActions.parent_id = this.length && this.models[0].get("reference_id");
            nonPromotedActions.setNodes(restNodes);
          } else {
            nonPromotedActions.setNodes([this.get('id')]);
            nonPromotedActions.parent_id = this.get("reference_id");
          }

          if (!nonPromotedActions.connector) {
            this.connector.assignTo(nonPromotedActions);
          }
          if (nonPromotedActions.commands.length && nonPromotedActions.nodes.length) {
            nonPromotedActions
                .fetch({
                  reset: true,
                  // Update the actions as soon as possible; event
                  // and promise can be watched by someone else
                  success: _.bind(function () {
                    this._updateOriginalActionsAfterLazyActions();
                    //this.attributes.csuiLazyActionsRetrieved =  true;
                    deferred.resolve(this);
                  }, this),
                  fail: function () {
                    this.attributes.csuiLazyActionsRetrieved = true;
                    deferred.reject();
                  }
                });
          } else {
            this.set('csuiLazyActionsRetrieved', true);
            deferred.resolve(this);
          }
          return deferred.promise();
        },

        _updateOriginalActions: function () {
          var delayedActions = this.delayedActions;

          function updateNodeActions(node) {
            var actionNode = delayedActions.get(node.get('id'));
            if (actionNode) {
              node.actions.add(actionNode.actions.models);
              node.set('csuiDelayedActionsRetrieved', true);
            }
          }

          if (this instanceof Backbone.Collection) {
            this.each(updateNodeActions);
          } else {
            updateNodeActions(this);
          }
        },

        _updateOriginalActionsAfterLazyActions: function () {
          var nonPromotedActions = this.nonPromotedActions,
              updateNodeActions  = function (node) {
                node.attributes.csuiLazyActionsRetrieved = true;
                var actionNode = nonPromotedActions.get(node.get('id'));
                if (actionNode) {
                  _.each(actionNode.actions.models, function (action) {
                    action.attributes.csuiNonPromotedAction = true;
                  });
                  node.actions.add(actionNode.actions.models);
                }
              };

          if (this instanceof Backbone.Collection) {
            this.each(updateNodeActions);
          } else {
            updateNodeActions(this);
          }
        },

        setDefaultActionCommands: function (name) {
          if (!_.isArray(name)) {
            name = name.split(',');
          }
          _.each(name, function (name) {
            if (!_.contains(this.defaultActionCommands, name)) {
              this.defaultActionCommands.push(name);
            }
          }, this);
        },

        resetDefaultActionCommands: function (name) {
          if (name) {
            if (!_.isArray(name)) {
              name = name.split(',');
            }
            _.each(name, function (name) {
              var index = _.indexOf(this.defaultActionCommands, name);
              if (index >= 0) {
                this.defaultActionCommands.splice(index, 1);
              }
            }, this);
          } else {
            this.defaultActionCommands.splice(0, this.defaultActionCommands.length);
          }
        },

        getRequestedCommandsUrlQuery: function () {
          var commands = this.delayRestCommands ?
                         this.defaultActionCommands : this.commands;
          return commands.length && {actions: commands};
        },

        getAllCommandsUrlQuery: function () {
          var commands = this.commands;
          return commands.length && {actions: commands};
        },

        // Stop the delayed action enabling for child models and collections.
        // If they want it, they can do so in the constructors, which creates
        // them. Immediate child models of this collection can be enabled by
        // the delayRestCommandsForModels option.
        _prepareModel: function (attrs, options) {
          var delayRestCommands, delayRestCommandsForModels;
          options || (options = {});
          // If the collection is populated after the constructor has
          // finished, we can use parameters passed to the constructor
          // as defaults, if the population options are empty.
          if (this.delayedActions) {
            delayRestCommands = options.delayRestCommands;
            if (delayRestCommands === undefined) {
              delayRestCommands = this.delayRestCommands;
            }
            delayRestCommandsForModels = options.delayRestCommandsForModels;
            if (delayRestCommandsForModels === undefined) {
              delayRestCommandsForModels = this.delayRestCommandsForModels;
            }
          } else {
            delayRestCommands = options.delayRestCommands;
            delayRestCommandsForModels = options.delayRestCommandsForModels;
          }
          options.delayRestCommands = delayRestCommandsForModels;
          options.delayRestCommandsForModels = false;
          var model = originalPrepareModel.call(this, attrs, options);
          options.delayRestCommands = delayRestCommands;
          options.delayRestCommandsForModels = delayRestCommandsForModels;
          return model;
        }
      });
    }
  };

  return DelayedCommandableV2Mixin;
});

csui.define('csui/models/mixins/v2.additional.resources/v2.additional.resources.mixin',['csui/lib/underscore', 'csui/lib/jquery'
], function (_, $) {

  var AdditionalResourcesV2Mixin = {

    mixin: function (prototype) {

      return _.extend(prototype, {

        makeAdditionalResourcesV2Mixin: function (options) {
          this._additionalResources = [];
          if (options && options.includeResources) {
            this.includeResources(options.includeResources);
          }
          return this;
        },

        includeResources: function (names) {
          if (names && !_.isArray(names)) {
            names = names.split(',');
          }
          this._additionalResources = _.union(this._additionalResources, names);
        },

        excludeResources: function (names) {
          if (names) {
            if (!_.isArray(names)) {
              names = names.split(',');
            }
            this._additionalResources = _.reject(this._additionalResources, names);
          } else {
            this._additionalResources.splice(0, this._additionalResources.length);
          }
        },

        getAdditionalResourcesUrlQuery: function () {
          return _.reduce(this._additionalResources, function (result, parameter) {
            result[parameter] = '';
            return result;
          }, {});
        }

      });

    }

  };

  return AdditionalResourcesV2Mixin;

});

csui.define('csui/models/node.columns2',['csui/lib/backbone'], function (Backbone) {
  'use strict';

  var NodeColumn2Model = Backbone.Model.extend({
    id: 'column_key',

    constructor: function NodeColumn2Model(attributes, options) {
      Backbone.Model.prototype.constructor.call(this, attributes, options);
    }
  });

  var NodeColumn2Collection = Backbone.Collection.extend({
    model: NodeColumn2Model,

    constructor: function NodeColumn2Collection(models, options) {
      Backbone.Collection.prototype.constructor.call(this, models, options);
    }
  });

  return NodeColumn2Collection;
});

csui.define('csui/models/node/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/models/node/impl/nls/root/lang',{
  sizeColumnTitle: 'Size'
});


csui.define('csui/models/utils/v1tov2',[],function () {
  'use strict';

  var nodeExpands = ['original_id', 'parent_id', 'volume_id'],
      userExpands = ['create_user_id', 'modify_user_id', 'owner_user_id',
                     'reserved_user_id'],
      groupExpands = ['owner_group_id'],
      memberExpands = userExpands.concat(groupExpands);

  // Returns a v2 expand scope string or an object with key-array pairs.
  function includeExpandsV1toV2(expands) {
    // An array can be converted to an object with key-array pairs.
    if (Array.isArray(expands)) {
      return expands.reduce(function (result, expand) {
        if (expand === 'node') {
          mergeProperties(result, nodeExpands);
        } else if (expand === 'member') {
          mergeProperties(result, memberExpands);
        } else if (expand === 'user') {
          mergeProperties(result, userExpands);
        } else if (expand === 'group') {
          mergeProperties(result, groupExpands);
        } else {
          result[expand] || (result[expand] = []);
        }
        return result;
      }, {});
    // A v1 string can be converted an object with a single key-array pair.
    } else if (expands === 'node') {
      return {
        properties: nodeExpands.slice()
      };
    // A v1 string can be converted an object with a single key-array pair.
    } else if (expands === 'member') {
      return {
        properties: memberExpands.slice()
      };
    } else if (expands === 'user') {
      return {
        properties: userExpands.slice()
      };
    } else if (expands === 'group') {
      return {
        properties: groupExpands.slice()
      };
    }
    // Leave an object or a v2 string intact.
    return expands;

    function mergeProperties(result, expands) {
      var properties = result.properties || (result.properties = []);
      expands.forEach(function (property) {
        if (properties.indexOf(property) < 0) {
          properties.push(property);
        }
      });
    }
  }

  // Returns a v2 expand scope string or an array of them.
  function excludeExpandsV1toV2(expands) {
    if (Array.isArray(expands)) {
      return expands.reduce(function (result, expand) {
        if (expand === 'node' || expand === 'user'  || expand === 'group' ||
            expand === 'member') {
          expand = 'properties';
        }
        if (result.indexOf(expand) < 0) {
          result.push(expand);
        }
        return result;
      }, []);
    } else if (expands === 'node') {
      return nodeExpands.slice();
    } else if (expands === 'member') {
      return memberExpands.slice();
    } else if (expands === 'user' || expands === 'member') {
      return userExpands.slice();
    } else if (expands === 'group') {
      return groupExpands.slice();
    }
    return expands;
  }

  // Returns a v1 expand scope string or an array with them.
  function expandsV2toV1(expands) {
    // An array can be converted to an array.
    if (Array.isArray(expands)) {
      return expands.reduce(function (result, expand) {
        if (nodeExpands.indexOf(expand) >= 0) {
          result.push('node');
        } else if (userExpands.indexOf(expand) >= 0) {
          result.push('user');
        } else if (groupExpands.indexOf(expand) >= 0) {
          result.push('group');
        }
        return result;
      }, []);
    // An object can be converted to an array with v1 scopes.
    } else if (typeof expands === 'object') {
      var properties = expands.properties;
      if (properties) {
        if (!properties.length) {
          return ['node', 'member'];
        }
        return properties.reduce(function (result, expand) {
          if (nodeExpands.indexOf(expand) >= 0) {
            expand = 'node';
          } else if (userExpands.indexOf(expand) >= 0) {
            expand = 'user';
          } else if (groupExpands.indexOf(expand) >= 0) {
            expand = 'group';
          }
          if (result.indexOf(expand) < 0) {
            result.push(expand);
          }
          return result;
        }, []);
      }
      return [];
    // A v2 string can be converted to a v1 string.
    } else if (expands === 'properties') {
      return ['node', 'member'];
    }
    // Leave a v1 string intact.
    return expands;
  }

  return {
    includeExpandsV1toV2: includeExpandsV1toV2,
    excludeExpandsV1toV2: excludeExpandsV1toV2,
    expandsV2toV1: expandsV2toV1,
    nodeExpands: nodeExpands,
    userExpands: userExpands
  };
});

csui.define('csui/models/node/server.adaptor.mixin',[
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/url',
  'i18n!csui/models/node/impl/nls/lang', 'csui/models/utils/v1tov2'
], function (_, $, Url, lang, v1tov2) {
  'use strict';

  var ServerAdaptorMixin = {
    mixin: function (prototype) {
      return _.extend(prototype, {
        makeServerAdaptor: function (options) {
          return this;
        },

        isFetchableDirectly: function () {
          return this.get('id') > 0;
        },

        // TODO: Remove this method and make the cache layer aware of node URLs.
        urlCacheBase: function () {
          var url = this.urlBase();
          if (url.indexOf('/volumes') < 0) {
            url = url.replace('/api/v1/', '/api/v2/');
          }
          return url + '?';
        },

        urlBase: function () {
          var id  = this.get('id'),
              url = this.connector.connection.url;
          if (!id) {
            // Create a new node by POST /nodes
            url = Url.combine(url, 'nodes');
          } else if (id === 'volume') {
            // Access an existing volume by VERB /volumes/:type
            url = Url.combine(url, 'volumes', this.get('type'));
          } else if (!_.isNumber(id) || id > 0) {
            // Access an existing node by VERB /nodes/:id
            url = Url.combine(url, 'nodes', id);
          } else {
            throw new Error('Unsupported id value');
          }
          if (this.options.apiVersion) {
            url.getApiBase(this.options.apiVersion);
          }
          return url;
        },

        url: function () {
          var url = this.urlBase(),
              query;
          if (!this.isNew()) {
            if (this.get('id') === 'volume') {
              var expands = v1tov2.expandsV2toV1(this.expand);
              if (expands.length) {
                query = $.param({expand: expands}, true);
              }
            } else {
              if (this.collection) {
                query = this._getCombinedUrlQuery();
              } else {
                query = Url.combineQueryString(
                    this.getExpandableResourcesUrlQuery(),
                    this.getAdditionalResourcesUrlQuery(),
                    this.getResourceFieldsUrlQuery(),
                    this.getRequestedCommandsUrlQuery()
                );
              }
              // Request just common properties by default; do not waste server
              // resources, because it would return all it could by default.
              // If somebody set fields to a subset of properties already, they
              // are responsible for including all needed information.
              if (!/\bfields=properties\b/.test(query)) {
                query = Url.combineQueryString(query, 'fields=properties');
              }
            }
          }

          return query ? url + '?' + query : url;
        },

        _getCombinedUrlQuery: function () {
          var collection     = this.getV2ParameterSource(),
              queryParts     = [
                'getExpandableResourcesUrlQuery',
                'getAdditionalResourcesUrlQuery',
                'getResourceFieldsUrlQuery'
              ].map(function (method) {
                var parameters = this[method]();
                if (_.isEmpty(parameters)) {
                  // If no data limits were specified in the node
                  // model, try to inherit them from the collection
                  method = collection[method];
                  if (method) {
                    return method.call(collection);
                  }
                }
                return parameters;
              }, this),
              method         = this.delayRestCommands ?
                               'getRequestedCommandsUrlQuery' :
                               'getAllCommandsUrlQuery',
              commands       = this[method](),
              commandOptions = {};
          if (_.isEmpty(commands)) {
            // No delayed actions could be enabled for the node
            // model, unless specifying the default action command.
            // The collection can give non-delayed commands only;
            // if it supports delayed actions or not.
            method = collection.getAllCommandsUrlQuery ||
                     collection.getRequestedCommandsUrlQuery;
            if (method) {
              commands = method.call(collection);
            }
          }
          // TODO: Remove this horrible code breaking componentisation.
          if (!!this.refernce_id || !!this.attributes.reference_id) {
            commandOptions.reference_id = this.refernce_id || this.attributes.reference_id;
          }
          return Url.combineQueryString.apply(Url, queryParts.concat(commands, commandOptions));
        },

        parse: function (response) {
          // A node obtained from a collection has the properties directly
          // in the object, while if obtained by a single call, they are
          // nested in the data sub-object.
          // node from v2/nodes/:id or v1/nodes/:id
          var results    = response.results || response,
              // If node attributes are re-parsed, they will contain the "data"
              // object with properties from additional roles. Detect only "data"
              // from a v1 or a v2 response here.
              resultData = results.data,
              data       = resultData && (resultData.id || resultData.properties) && resultData,
              // node from v2/nodes/:id or v2/nodes
              // node from v1/nodes/:id or v1/nodes
              node       = data && data.properties || data || response;

          // However, some properties are scattered in the response object
          // directly, or even in artificial sub-objects like type_info,versions;
          // speak about developing API serving clients' needs, sigh.
          if (response.type !== undefined) {
            node.type = response.type;
          }
          if (response.type_name !== undefined) {
            node.type_name = response.type_name;
          }
          if (data && data.versions) {
            node.versions = data.versions;
          }
          _.extend(node, response.type_info);
          if (node.versions) {
            var version = node.versions;
            if (_.isArray(version)) {
              version = version[version.length - 1];
            }
            if (version) {
              _.extend(node, _.pick(version, ['file_size', 'mime_type',
                'version_id', 'version_number',
                'version_number_major',
                'version_number_minor']));
            }
          }

          // Properties out of data are not passed to the constructor.  This
          // may yet get its own sub-model.
          _.defaults(node, {
            perspective: results && results.perspective || response.perspective
          });

          // Normalize V1 actions and V2 commands to [{signature}, ...]
          this._parseActions(node, results, response);

          // Normalize actions in the shortcut target sub-node
          var original = node.original_id && node.original_id.id ?
                         node.original_id : node.original_id_expand;
          if (original) {
            this._parseActions(original, {}, {});
            // No faking default action permissions for shortcut originals;
            // only 'open' was not enough - all default acions are permitted
            // in DefaultActionController
          }

          // Normalize actions in the parent location sub-node
          var parent = node.parent_id && node.parent_id.id ?
                       node.parent_id : node.parent_id_expand;
          if (parent) {
            this._parseActions(parent, {}, {});
            if (!parent.actions.length) {
              // TODO: Remove this, as soon as the actions for parent
              // locations are returned by the server
              // Add (default) actions used for hyperlinks
              this._makeAccessible(parent);
            }
          }

          // V1 does not send the URL; if the 'default' command is available,
          // we can red it from there, otherwise it is not possible
          if (node.type === 140 && !node.url) {
            var defaultAction = _.findWhere(node.actions, {signature: 'default'});
            node.url = defaultAction && defaultAction.href;
          }

          // Make addable types available in the node constructor
          node.addable_types = response.addable_types;
          // Make columns available in the node constructor
          var columns = data && data.columns;
          if (columns) {
            node.columns = this._parseColumns(columns, response);
          }
          // Make definitions available in the node constructor
          var definitions = response.definitions || results.metadata &&
                                                    results.metadata.properties;
          if (definitions) {
            node.definitions = this._parseDefinitions(definitions, columns);
          }
          // Make additional v2 data accessible in the model attributes;
          // data.properties are accessible as the flat node attributes
          // and columns with metadata are pre-parsed by helper methods
          if (data && data.properties) {
            node.data = _.omit(data, 'columns', 'metadata', 'properties');
          } else {
            node.data = {};
          }

          // add reference_id to node for children under collection (ie., subtype 298) container.
          if (this.collection && this.collection.node && this.collection.node.get('type') === 298) {
            node.reference_id = this.collection.node.get('id');
          }
          // If node is getting updated by any of its actions, we are fetching entire node info
          // which includes promoted and non-promoted actions also. So to avoid re-fetch
          // nonpromoted actions from inline and toolbar setting 'csuiLazyActionsRetrieved'
          // attribute to node.
          if (this.get('csuiLazyActionsRetrieved') === undefined &&
              !!this.get('csuiDelayedActionsRetrieved') && !_.isEmpty(this.changed)) {
            node.csuiLazyActionsRetrieved = true;
          }
          return node;
        },

        _parseColumns: function (columns, response) {
          var columnKeys = response.definitions_order ||
                           columns && _.pluck(columns, 'key');
          return _.map(columnKeys, function (key) {
            return {key: key};
          });
        },

        _parseDefinitions: function (definitions, columns) {
          if (!definitions.size &&
              (definitions.container_size || definitions.file_size)) {
            definitions.size = definitions.container_size ||
                               definitions.file_size;
            definitions.size.key = 'size';
            definitions.size.name = lang.sizeColumnTitle;
          }
          if (columns) {
            _.each(columns, function (column) {
              var columnKey  = column.key,
                  definition = definitions[columnKey];
              if (!definition) {
                definition = definitions[columnKey] = {
                  name: column.name,
                  type: column.data_type,
                  sort: column.sortable
                };
              }

              // for all user related column attributes let's add definition type as 14.
              var supportedPersonas = ['user', 'group', 'member'];
              if ($.inArray(definition.persona, supportedPersonas) !== -1) {
                definition.type = 14;
              }

              // Take fileds=columns from v2 into account.
              var sortKey = column.sort_key;
              if (sortKey) {
                definition.sort_key = sortKey;
                definition.sort = true;
              }
            });
            // Update the real value-carrying column, which does not end with
            // "_formatted", if only the "_formatted" one is present and not
            // the real one. "_formatted"  columns should not be used, because
            // they do not provide the real value for sorting, filtering, saving
            // or other scenarios, where it is needed. Also the right formatting
            // is specified in Smart UI. "_formatted" columns are for AJAX calls
            // from Classic UI, because they for at according to its design.
            _.each(columns, function (column) {
              var columnKey      = column.key,
                  formattedIndex = columnKey.lastIndexOf('_formatted');
              if (formattedIndex >= 0) {
                var realColumnKey = columnKey.substr(0, columnKey.length - 10),
                    definition    = definitions[realColumnKey];
                if (!definition) {
                  definition = definitions[realColumnKey] = {
                    name: column.name,
                    type: column.data_type,
                    sort: column.sortable
                  };
                }
                // Take fileds=columns from v2 into account.
                var sortKey = column.sort_key;
                if (sortKey) {
                  definition.sort_key = sortKey;
                  definition.sort = true;
                }
              }
            });
          }
          return _.map(definitions, function (definition, key) {
            if (!definition.key) {
              definition.key = key;
            }
            return definition;
          });
        },

        _parseActions: function (node, results, response) {
          // Normalize V1 actions and V2 commands to [{signature}, ...]
          var actions = node.actions || response.actions ||
                        // v1/volumes/:type actions
                        response.available_actions,
              commands;
          if (_.isArray(actions)) {
            // v1 actions
            _.each(actions, function (action) {
              // normalize the v1/volumes/:type actions
              if (!action.signature) {
                action.signature = action.type;
                action.name = action.type_name;
                delete action.type;
                delete action.type_name;
              }
            });
            commands = _.reduce(actions, function (result, action) {
              result[action.signature] = {};
              return result;
            }, {});
            node.actions = actions;
          } else {
            // v2-like commands added to v1 and v2 commands
            commands = node.commands || response.commands || response.actions ||
                       // v2 actions
                       results && results.actions || {};
            // v2 moved the content of actions to actions.data and left
            // the actions object with the three keys only
            if (commands.data && commands.order && commands.map) {
              commands = commands.data;
            }
            node.actions = _.chain(commands)
                .keys()
                .map(function (key) {
                  var attributes = commands[key];
                  attributes.signature = key;
                  return attributes;
                })
                .value();
            delete node.commands;
            delete node.commands_map;
            delete node.commands_order;
          }
        },

        // TODO: Remove this, as soon as the actions for shortcut
        // targets, parents or other expanded nodes  are returned
        //  by the server
        _makeAccessible: function (original) {
          original.actions = [
            {signature: 'open'}
          ];
        }
      });
    }
  };

  return ServerAdaptorMixin;
});

csui.define('csui/models/node/node.model',[
  'module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/models/actions', 'csui/models/addabletypes',
  'csui/models/mixins/resource/resource.mixin',
  'csui/models/mixins/uploadable/uploadable.mixin',
  'csui/models/mixins/v2.fields/v2.fields.mixin',
  'csui/models/mixins/v2.expandable/v2.expandable.mixin',
  'csui/models/mixins/v2.delayed.commandable/v2.delayed.commandable.mixin',
  'csui/models/mixins/v2.additional.resources/v2.additional.resources.mixin',
  'csui/models/node.columns2', 'csui/models/node/server.adaptor.mixin',
  'i18n!csui/models/node/impl/nls/lang', 'csui/models/utils/v1tov2',
  'csui/utils/deepClone/deepClone'
], function (module, _, Backbone, ActionCollection, AddableTypesCollection,
    ResourceMixin, UploadableMixin, FieldsV2Mixin, ExpandableV2Mixin,
    DelayedCommandableV2Mixin, AdditionalResourcesV2Mixin,
    NodeColumn2Collection, ServerAdaptorMixin, lang, v1tov2) {
  'use strict';

  var config = _.extend({
    idAttribute: null,
    // ID should be always handles as a black box. The client should send
    // it to the server the same, as it was received. The server should send
    // IDs in object properties; it should not send URLs, which the client
    // would have to parse and extract the ID from them.
    //
    // This flag can be used in the code, that does not follow the best
    // practice and parses an integer ID out of some string.
    usesIntegerId: true
  }, module.config());

  var NodeDefinition2Collection = Backbone.Collection.extend({
    model: Backbone.Model.extend({
      id: 'key',
      constructor: function NodeDefinition2Model(attributes, options) {
        Backbone.Model.prototype.constructor.call(this, attributes, options);
      }
    }),
    constructor: function NodeDefinition2Collection(models, options) {
      Backbone.Collection.prototype.constructor.call(this, models, options);
    }
  });

  var NodeModel = Backbone.Model.extend({
    idAttribute: config.idAttribute,

    constructor: function NodeModel(attributes, options) {
      attributes || (attributes = {});
      options || (options = {});

      Backbone.Model.prototype.constructor.call(this, attributes, options);

      this.options = _.pick(options, ['connector']);

      this.makeResource(options)
          .makeAdditionalResourcesV2Mixin(options)
          .makeFieldsV2(options)
          .makeExpandableV2(options)
          .makeDelayedCommandableV2(options)
          .makeUploadable(options)
          .makeServerAdaptor(options);

      // Ensure sub-models; these set by _setCollectionProperty should
      // be always available, but this.set called from Backbone.Model
      // constructor creates them only, if they are in the attributes
      if (!attributes.actions) {
        this._setCollectionProperty('actions', ActionCollection,
            attributes, options);
      }
      if (!attributes.addable_types) {
        this._setCollectionProperty('addable_types', AddableTypesCollection,
            attributes, options);
      }
      if (!attributes.definitions) {
        this._setCollectionProperty('definitions', NodeDefinition2Collection,
            attributes, options);
      }
      if (!attributes.columns) {
        this._setCollectionProperty('columns', NodeColumn2Collection,
            attributes, options);
      }
      // Ensure sub-models; these set by _setNodeProperty are optional
      // and if this.set called from Backbone.Model didn't create them,
      // because they are not in the attributes, we won't do it here
    },

    clone: function () {
      var clone = new this.constructor(this.attributes, {
        connector: this.connector,
        fields: _.deepClone(this.fields),
        expand: _.deepClone(this.expand),
        includeResources: _.clone(this._additionalResources),
        commands: _.clone(this.commands),
        defaultActionCommands: _.clone(this.defaultActionCommands),
        delayRestCommands: this.delayRestCommands
      });
      clone.actions.reset(this.actions.models);
      clone.fetching = this.fetching;
      clone.fetched = this.fetched;
      clone.error = this.error;
      return clone;
    },

    isNew: function () {
      return !this.has('id');
    },

    isFetchable: function () {
      return !!this.get('id');
    },

    getV2ParameterSource: function () {
      var collection = this.collection;
      // If the collection suports v2 REST API, use it directly
      // as a URL query source
      if (collection && collection.makeFieldsV2) {
        return collection;
      }
      // Otherwise use a v2 node node model as a URL query source
      // and include parameters from the v1 collection there
      var node = this.clone();
      if (collection) {
        var additionalResources = collection._additionalResources;
        if (additionalResources) {
          node.includeResources(additionalResources);
        }
        var defaultActionCommands = collection.defaultActionCommands;
        if (defaultActionCommands) {
          node.setDefaultActionCommands(defaultActionCommands);
        }
        var commands = collection.includeCommands;
        if (commands) {
          node.setCommands(commands);
        }
        var expand = collection.expand;
        if (expand) {
          node.setExpand(v1tov2.includeExpandsV1toV2(expand));
        }
      }
      return node;
    },

    set: function (key, val, options) {
      var attrs;
      if (key == null) {
        return this;
      }

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      options || (options = {});
      // Using 'skipSetValue' to skip "sync" call in case of rename for Grid-view
      if (val && val.skipSetValue) {
        return;
      }

      // TODO: Support sub-models and sub-collections in general
      if (attrs.actions) {
        this._setCollectionProperty('actions', ActionCollection, attrs, options);
      }
      if (attrs.addable_types) {
        this._setCollectionProperty('addable_types', AddableTypesCollection, attrs,
            options);
      }
      if (attrs.definitions) {
        this._setCollectionProperty('definitions', NodeDefinition2Collection, attrs, options);
      }
      if (attrs.columns) {
        this._setCollectionProperty('columns', NodeColumn2Collection, attrs, options);
      }
      if (attrs.original_id !== undefined) {
        this._setNodeProperty('original', attrs, options);
      }
      if (attrs.parent_id !== undefined) {
        this._setNodeProperty('parent', attrs, options);
      }
      if (attrs.volume_id !== undefined) {
        this._setNodeProperty('volume', attrs, options);
      }

      // do the usual set
      return Backbone.Model.prototype.set.call(this, attrs, options);
    },

    _setCollectionProperty: function (attribute, Class, attributes, options) {
      var property   = _.str.camelize(attribute),
          models     = attributes[attribute],
          collection = this[property];
      if (collection) {
        collection.reset(models);
      } else {
        this[property] = new Class(models, {
          // When this.set is called from the Backbome.Model constructor,
          // the current node hasn't been conected yet.  Sub-nodes would
          // be disconnected, if just this.connector would be used.  The
          // connector may be in the constructor options, if the caller
          // wanted to connect the node right away.
          connector: this.connector || options && options.connector
        });
      }
    },

    _setNodeProperty: function (name, source, options) {
      // v1 expands the _id property directly, v2 adds an additional
      // one _id_expand
      var value = source[name + '_id_expand'] || source[name + '_id'];
      // If the property was not expanded, initialize the model just
      // with the object identifier
      if (value && !_.isObject(value)) {
        value = {id: value};
      }
      if (_.isObject(value)) {
        if (this[name]) {
          this[name].set(value);
        } else {
          this[name] = new NodeModel(value, {
            // When this.set is called from the Backbome.Model constructor,
            // the current node hasn't been conected yet.  Sub-nodes would
            // be disconnected, if just this.connector would be used.  The
            // connector may be in the constructor options, if the caller
            // wanted to connect the node right away.
            connector: this.connector || options && options.connector
          });
        }
      } else {
        delete this[name];
      }
    },

    getResourceScope: function () {
      var parameterSource = this.getV2ParameterSource();
      return _.deepClone({
        fields: _.isEmpty(this.fields) ? parameterSource.fields : this.fields,
        expand: _.isEmpty(this.expand) ? parameterSource.expand : this.expand,
        includeResources: _.isEmpty(this._additionalResources) ?
                          parameterSource._additionalResources :
                          this._additionalResources,
        commands: _.isEmpty(this.commands) ? parameterSource.commands : this.commands,
        defaultActionCommands: this.defaultActionCommands
      });
    },

    setResourceScope: function (scope) {
      this.excludeResources();
      scope.includeResources && this.includeResources(scope.includeResources);
      this.resetFields();
      scope.fields && this.setFields(scope.fields);
      this.resetExpand();
      scope.expand && this.setExpand(scope.expand);
      this.resetCommands();
      scope.commands && this.setCommands(scope.commands);
      this.resetDefaultActionCommands();
      scope.defaultActionCommands && this.setDefaultActionCommands(scope.defaultActionCommands);
    },

    toString: function () {
      // Format a string for logging purposes
      var id = this.get('id');
      if (id === 'volume') {
        return 'volume:' + this.get('type');
      } else if (id != null) {
        return 'node:' + id;
      }
      return 'node:invalid';
    }
  }, {
    usesIntegerId: config.usesIntegerId
  });

  AdditionalResourcesV2Mixin.mixin(NodeModel.prototype);
  FieldsV2Mixin.mixin(NodeModel.prototype);
  ExpandableV2Mixin.mixin(NodeModel.prototype);
  DelayedCommandableV2Mixin.mixin(NodeModel.prototype);
  UploadableMixin.mixin(NodeModel.prototype);
  ResourceMixin.mixin(NodeModel.prototype);
  ServerAdaptorMixin.mixin(NodeModel.prototype);

  var originalFetch = NodeModel.prototype.fetch;
  NodeModel.prototype.fetch = function (options) {
    options || (options = {});

    // If not overridden, Use the v2 URL for GET requests.
    // If not overridden and the target collection has been specified,
    // let the url method use its data-limiting parameters.
    if (!options.url) {
      var originalCollection = this.collection,
          newCollection      = options.collection;
      if (newCollection) {
        this.collection = newCollection;
      }
      var url = _.result(this, 'url');
      if (newCollection) {
        this.collection = originalCollection;
      }
      if (url.indexOf('/volumes') < 0) {
        url = url.replace('/api/v1/', '/api/v2/');
      }
      options.url = url;
    }

    return originalFetch.call(this, options);
  };

  return NodeModel;
});

csui.define('csui/models/server.adaptors/favorite2.mixin',[
  'csui/lib/underscore', 'csui/utils/url'
], function (_, Url) {
  'use strict';

  var ServerAdaptorMixin = {
    mixin: function (prototype) {
      var superParseMethod = prototype.parse;
      var superSyncMethod = prototype.sync;

      return _.extend(prototype, {
        makeServerAdaptor: function (options) {
          return this;
        },

        parse: function (response, options) {
          if (response.results) {
            response = response.results;
          }
          if (_.isEmpty(response)) {
            return {};
          } else {
            if (options.attrs) {
              var updatedAttributes = {};
              _.each(_.keys(options.attrs), function (attr) {
                updatedAttributes['favorite_' + attr] = options.attrs[attr];
              }, this);
              return updatedAttributes;
            } else {
              if (response.data && response.data.properties && response.data.favorites) {
                response.data.properties.favorite_name = response.data.favorites.name;
                response.data.properties.favorite_tab_id = response.data.favorites.tab_id;
              }

              var m = superParseMethod.call(this, response);

              if (m.actions) {
                m.actions = _.reject(m.actions,
                  function (action) {
                    return action.signature == 'rename' || action.signature == 'delete';
                  });
                m.actions.push({signature: 'favorite_rename'});

                // console.log("NODE ACTIONS");
                // _.each(m.actions, function(a) {
                //   console.log(a.signature);
                // });
              }
              return m;
            }
          }
        },

        sync: function (method, model, options) {
          var useFavoritesUrl = false;
          if (method === 'update' || method === 'patch') {

            // if attr key starts with 'favorite_' do the update on the /members/favorites url but
            // remove the prefix to have the original attribute-name from the favorite model
            // otherwise, just pass the attribute-to-update as it is and use the url from he
            // original node model
            var prefix = 'favorite_';
            var attributesToUpdate = {};
            _.each(_.keys(options.attrs), function (k) {
              var newKey = k;
              if (k.indexOf(prefix) === 0) {
                useFavoritesUrl = true;
                newKey = k.substr(prefix.length);
              }
              attributesToUpdate[newKey] = options.attrs[k];
            });
            options.attrs = attributesToUpdate;
            if (useFavoritesUrl) {
              var url = this.connector.connection.url.replace('/v1', '/v2');
              url = Url.combine(url, '/members/favorites');
              url = Url.combine(url, model.id);

              options.url = url;
            }
          }
          return superSyncMethod.call(this, method, model, options);
        }

      });
    }
  };

  return ServerAdaptorMixin;
});

csui.define('csui/models/favorite2',['csui/lib/underscore', 'csui/lib/backbone', 'csui/utils/url', 'csui/models/node/node.model',
  'csui/models/server.adaptors/favorite2.mixin', 'csui/utils/deepClone/deepClone'
], function (_, Backbone, Url, NodeModel, ServerAdaptorMixin) {
  'use strict';

  var Favorite2Model = NodeModel.extend({

    mustRefreshAfterPut: false,

    idAttribute: 'id',

    constructor: function Favorite2Model(attributes, options) {
      NodeModel.prototype.constructor.apply(this, arguments);
      this.makeServerAdaptor(options);
    }
  });

  ServerAdaptorMixin.mixin(Favorite2Model.prototype);

  return Favorite2Model;
});

csui.define('csui/models/browsable/browsable.mixin',['csui/lib/underscore', 'csui/lib/backbone', 'csui/utils/url'
], function (_, Backbone, Url) {

  var BrowsableMixin = {

    mixin: function (prototype) {
      return _.extend(prototype, {

        makeBrowsable: function (options) {
          options || (options = {});
          this.skipCount = options.skip || 0;
          this.topCount = options.top || 0;
          this.filters = options.filter || {};
          this.orderBy = options.orderBy;
          return this;
        },

        setFilter: function (value, attributes, options) {
          // TODO: Simplify filer merging and detection of changes.
          var filter = value,
              name, modified;
          if (_.isObject(value) && !_.isArray(value)) {
            options = attributes;
          } else {
            filter = {};
            filter[attributes] = value;
          }
          if (typeof options !== 'object') {
            options = {fetch: options};
          }
          if (!_.isEmpty(filter)) {
            for (name in filter) {
              if (_.has(filter, name)) {
                value = filter[name];
                if (makeFilterValue(this.filters[name], name) !==
                    makeFilterValue(value, name)) {
                  if (value !== undefined) {
                    this.filters[name] = value;
                  }
                  else {
                    delete this.filters[name];
                  }
                  modified = true;
                }
              }
            }
            if (options.clear) {
              for (name in this.filters) {
                if (_.has(this.filters, name) && !_.has(filter, name)) {
                  if (makeFilterValue(this.filters[name], name) !== undefined) {
                    delete this.filters[name];
                    modified = true;
                  }
                }
              }
            }
            if (modified) {
              if (options.fetch !== false) {
                this.fetch();
              }
              return true;
            }
          } else {
            if (options.clear) {
              return this.clearFilter(options.fetch);
            }
          }
        },

        clearFilter: function (fetch) {
          var modified;
          if (!_.isEmpty(this.filters)) {
            for (var name in this.filters) {
              if (_.has(this.filters, name)) {
                if (makeFilterValue(this.filters[name], name) !== undefined) {
                  delete this.filters[name];
                  modified = true;
                }
              }
            }
          }
          if (modified) {
            if (fetch !== false) {
              this.fetch();
            }
            return true;
          }
        },

        setOrder: function (attributes, fetch) {
          if (this.orderBy != attributes) {
            this.orderBy = attributes;
            if (fetch !== false) {
              this.fetch({skipSort: false});
            }
            return true;
          }
        },

        resetOrder: function (fetch) {
          if (this.orderBy) {
            this.orderBy = undefined;
            if (fetch !== false) {
              this.fetch();
            }
            return true;
          }
        },

        setSkip: function (skip, fetch) {
          if (this.skipCount != skip) {
            this.skipCount = skip;
            if (fetch !== false) {
              this.fetch();
            }
            return true;
          }
        },

        setTop: function (top, fetch) {
          if (this.topCount != top) {
            this.topCount = top;
            if (fetch !== false) {
              this.fetch();
            }
            return true;
          }
        },

        setLimit: function (skip, top, fetch) {
          if (this.skipCount != skip || this.topCount != top) {
            this.skipCount = skip;
            this.topCount = top;
            if (fetch !== false) {
              this.fetch();
            }
            return true;
          }
        },

        resetLimit: function (fetch) {
          if (this.skipCount) {
            this.skipCount = 0;
            if (fetch !== false) {
              this.fetch();
            }
            return true;
          }
        }

      });
    }

  };

  function makeFilterValue(value, name) {
    if (value !== undefined && value !== null && value !== '') {
      if (_.isArray(value)) {
        value = Url.makeMultivalueParameter('where_' + name, value);
      } else {
        value = 'where_' + name + '=' + encodeURIComponent(value.toString());
      }
      if (value.length > 0) {
        return value;
      }
    }
  }

  return BrowsableMixin;

});

csui.define('csui/models/browsable/client-side.mixin',[
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/utils/base',
  'csui/models/browsable/browsable.mixin'
], function (_, $, Backbone, base, BrowsableMixin) {

  var ClientSideBrowsableMixin = {

    mixin: function (prototype) {
      BrowsableMixin.mixin(prototype);

      var originalFetch = prototype.fetch;

      return _.extend(prototype, {

        makeClientSideBrowsable: function (options) {
          this.listenTo(this, 'add', this._modelAdded)
              .listenTo(this, 'remove', this._modelRemoved)
              .listenTo(this, 'reset', this._modelsReset);

          if (!this.allModels) {
            this.allModels = [];
          }
          this._filling = 0;

          return this.makeBrowsable(options);
        },

        setOrderOnRequest: function (arg) {
          this.orderOnRequest = arg;
        },

        getBrowsableUrlQuery: function () {
          var query = {};

          if (this.orderBy && this.orderOnRequest) {
            var first = this.orderBy.split(',')[0].split(' ');
            query.sort = (first[1] || 'asc') + '_' + first[0];
          }
          return $.param(query);
        },

        fetch: function (options) {
          options = options ? _.clone(options) : {};
          _.defaults(options, {skipSort: this.orderOnRequest});

          var self = this;
          var partialResponse;
          if (!options.reload && this.lastFilteredAndSortedModels !== undefined) {
            this.trigger('request', this, {}, options);
            // Make the rest of the client side fetch async to behave like real ajax call
            var deferred = $.Deferred();
            setTimeout(function () {
              partialResponse = self._fill(options);
              self._notify(partialResponse, options);
              deferred.resolve(partialResponse);
            }, 0);
            return deferred.promise();
          }

          var originalSilent = options.silent,
              originalReset  = options.reset;
          options.silent = true;
          options.reset = true;

          var originalSuccess = options.success,
              originalError   = options.error;
          options.success = function (collection, response, options) {
            self.allModels = _.clone(self.models);
            var originalParse = options.parse;
            options.parse = false;
            self.reset([], options);
            if (originalSilent !== undefined) {
              options.silent = originalSilent;
            } else {
              delete options.silent;
            }
            if (originalReset !== undefined) {
              options.reset = originalReset;
            } else {
              delete options.reset;
            }
            partialResponse = self._fill(options);
            --self._filling;
            if (originalParse !== undefined) {
              options.parse = originalParse;
            } else {
              delete options.parse;
            }
            options.success = originalSuccess;
            if (originalSuccess) {
              originalSuccess.call(options.context, collection, response, options);
            }
          };
          options.error = function (collection, response, options) {
            --self._filling;
            if (originalError) {
              originalError.call(options.context, collection, response, options);
            }
          };

          ++this._filling;
          this.lastFilteredAndSortedModels = undefined;
          this._lastFilterAndSortCriteria = undefined;
          var pr =  originalFetch.call(this, options).then(function () {
            return partialResponse;
          });
          return pr;
        },

        populate: function (models, options) {
          options = _.extend({parse: true}, options);
          var originalSilent = options.silent,
              originalReset  = options.reset;
          options.silent = true;
          options.reset = true;
          options.skipSort = this.orderOnRequest;

          ++this._filling;

          this.lastFilteredAndSortedModels = [];
          this._lastFilterAndSortCriteria = undefined;
          // Reset the filtering, sorting and paging parameters
          this.skipCount = 0;
          // this.topCount = 0;
          this.filters = {};
          this.orderBy = undefined;
          this.reset(models, options);
          this.allModels = _.clone(this.models);
          var originalParse = options.parse;
          options.parse = false;
          this.reset([], options);
          this.trigger('request', this, {}, options);
          options.silent = originalSilent;
          if (this.allModels.length === 0) {
            options.reset = true;
          } else {
            options.reset = originalReset;
          }
          var deferred = $.Deferred();
          var self = this;
          setTimeout(function () {
            self.fetched = true; // this prevents the table from doing a collection.fetch
            var partialResponse = self._fill(options);
            --self._filling;
            options.parse = originalParse;
            self._notify(partialResponse, options);
            deferred.resolve(partialResponse);
          });
          return deferred.promise();
        },

        // Set the allModels without doing a fetch or reset
        setAllModels: function (models) {
          // make the collection empty
          var options = {};
          options.parse = false;
          var topCount = this.topCount;
          this.reset([], options);
          this.topCount = topCount; // topCount gets lost in reset...

          this.allModels = _.clone(models);
          this.totalCount = this.allModels.length;
          // Mark this collection as "fetched" the actual content will be
          // populated first, when it is needed for the fetch method
          this.lastFilteredAndSortedModels = [];
          this._lastFilterAndSortCriteria = undefined;
          // Reset the filtering, sorting and paging parameters
          this.skipCount = 0;
          // this.topCount = 0;
          this.filters = {};
          this.orderBy = undefined;
        },

        compareObjectsForSort: function (property, left, right) {
          left = this._parseValue(property, left.get(property));
          right = this._parseValue(property, right.get(property));
          return this._compareValues(property, left, right);
        },

        _fill: function (options) {
          var filterAndSortCriteria = {
                orderBy: this.orderBy,
                filters: _.clone(this.filters)
              },
              models;
          if (this._lastFilterAndSortCriteria &&
              _.isEqual(this._lastFilterAndSortCriteria, filterAndSortCriteria)) {
            models = this.lastFilteredAndSortedModels;
          } else {
            models = _.clone(this.allModels);
            models = this._filter(models);
            models = options.skipSort ? models : this._sort(models);
            this.lastFilteredAndSortedModels = models;
            this._lastFilterAndSortCriteria = filterAndSortCriteria;
          }
          this.totalCount = this.allModels.length;
          this.filteredCount = models.length;
          models = this._limit(models);

          var method = options.reset ? 'reset' : 'set';
          // Prevent the 'add' and 'reset' event handlers triggered by
          // filling models from allModels here modify allModels again
          ++this._filling;
          this[method](models, options);
          --this._filling;

          return models;
        },

        _notify: function (response, options) {
          if (options.success) {
            options.success.call(options.context, this, response, options);
          }
          this.trigger('sync', this, response, options);
        },

        _limit: function (models) {
          if (this.skipCount) {
            this.actualSkipCount = Math.min(this.skipCount, models.length);
            models = models.slice(this.skipCount);
          } else {
            this.actualSkipCount = 0;
          }
          if (this.topCount) {
            models = models.slice(0, this.topCount);
          }
          return models;
        },

        _sort: function (models) {
          var self = this;
          if (this.orderBy) {
            var criteria = _.map(this.orderBy.split(','), function (criterion) {
              var parts = criterion.trim().split(' ');
              return {
                property: parts[0],
                descending: parts[1] === 'desc'
              };
            });

            models = models.sort(function (left, right) {
              var result = 0;
              _.find(criteria, function (criterion) {
                result = self.compareObjectsForSort(criterion.property, left, right);
                if (result) {
                  if (criterion.descending) {
                    result *= -1;
                  }
                  return true;
                }
              });
              return result;
            });
          }
          return models;
        },

        _filter: function (models) {
          var self = this;
          for (var name in this.filters) {
            if (_.has(this.filters, name)) {
              var values = this.filters[name];
              if (values != null && values !== '') {
                _.isArray(values) || (values = [values]);
                models = _.filter(models, function (node) {
                  var hay = self._parseValue(name, node.get(name));
                  return _.any(values, function (value) {
                    var needle = self._parseValue(name, value);
                    if (name === 'type' && needle == -1) {
                      return node.get('container');
                    }
                    return self._containsValue(name, hay, needle);
                  });
                });
              }
            }
          }
          return models;
        },

        _modelAdded: function (model, collection, options) {
          if (this._populate(options)) {
            this.allModels.push(model);
            ++this.totalCount;
            this._lastFilterAndSortCriteria = undefined;
          }
        },

        _modelRemoved: function (model, collection, options) {
          if (this._populate(options)) {
            var index = _.findIndex(this.allModels, model);
            if (index >= 0) {
              this.allModels.splice(index, 1);
              --this.totalCount;
              this._lastFilterAndSortCriteria = undefined;
            }
          }
        },

        _modelsReset: function (collection, options) {
          if (this._populate(options)) {
            this.allModels = _.clone(this.models);
            this.totalCount = this.allModels.length;
            // Mark this collection as "fetched" the actual content will be
            // populated first, when it is needed for the fetch method
            this.lastFilteredAndSortedModels = [];
            this._lastFilterAndSortCriteria = undefined;
            // Reset the filtering, sorting and paging parameters
            this.skipCount = this.topCount = 0;
            this.filters = {};
            this.orderBy = undefined;
          }
        },

        _populate: function (options) {
          return !(this._filling || options && options.populate === false);
        },

        _compareValues: function (property, left, right) {
          //STRING Comparision.
          if (typeof left === 'string' && typeof right === 'string') {
            // FIXME: Implement the locale-specific comparison only for localizable strings;
            // not for values with internal system constants, which can be case-sensitive
            return base.localeCompareString(left, right, {usage: 'sort'});
          } else if (_.isArray(left) || _.isArray(right)) { //ARRAY Comparision.
            if (!_.isArray(left)) {
              left = [left];
            } else if (!_.isArray(right)) {
              right = [right];
            }
            return this._compareArrays(left, right);
          }
          return this._compareObjects(left, right); //OBJECT Comparision.
        },
		
        _compareObjects: function (left, right) {
          if (left != right) {
            if (left > right || right === void 0) {
              return 1;
            }
            if (left < right || left === void 0) {
              return -1;
            }
          }
          return 0;
        },

        _compareArrays: function (left, right) {
          var result = 0,
            len = Math.min(left.length, right.length),
            i=0;
          while(i <= len) {
            if (i === left.length && i === right.length) {
              result = 0;
              break;
            } else if (i === left.length) {
              result = -1;
              break;
            } else if (i === right.length) {
              result = 1;
              break;
            } else {
              if (typeof left[i] === 'string' && typeof right[i] === 'string') {
                result = base.localeCompareString(left[i], right[i], {usage: 'sort'});
              } else {
                result = this._compareObjects(left[i], right[i]);
              }
              if (result !== 0) {
                break;
              }
            }
            i++;
          }
          return result;
        },
		
        _containsValue: function (property, hay, needle) {
          if (typeof hay === 'string' && typeof needle === 'string') {
            // FIXME: Implement the locale-specific comparison only for localizable strings;
            // not for values with internal system constants, which can be case-sensitive
            return base.localeContainsString(hay, needle.toString());
          } else if (_.isArray(hay) && typeof needle === 'string') {
            return _.some(hay, function (blade) {
              if (typeof blade === 'string') {
                return base.localeContainsString(blade, needle.toString());
              } else {
                return blade == needle;
              }
            });
          }


          return hay == needle;
        },

        // FIXME: Use metadata to get the correct value type for parsing
        _parseValue: function (property, value) {
          if (value != null) {
            if (property === 'type') {
              return +value;
            }
            if (property.indexOf('date') >= 0) {
              if (_.isArray(value)) {
                return value.map(function(val) {
                  return  new Date(val);
                });
              } else {
                return new Date(value);
              }
            }
          }
          return value;
        }

      });
    }

  };

  return ClientSideBrowsableMixin;

});

csui.define('csui/models/browsable/v2.response.mixin',['csui/lib/underscore'
], function (_) {
  'use strict';

  var BrowsableV2ResponseMixin = {

    mixin: function (prototype) {
      return _.extend(prototype, {

        makeBrowsableV2Response: function (options) {
          this.orderBy = options.orderBy;
          return this;
        },

        parseBrowsedState: function (response, options) {
          var collection = response.collection || response,
              paging = collection.paging,
              sorting = collection.sorting,
              searching = collection.searching;
          if (paging) {
            this.actualSkipCount = (paging.page - 1) * (paging.limit || 0);
            this.totalCount = paging.total_count;
            this.filteredCount = paging.filtered_count || paging.total_count;
          } else {
            // Support limited v2 collections like favorites
            this.actualSkipCount = 0;
            this.filteredCount = this.totalCount = response.results.length;
          }
          if (sorting) {
            this.sorting = sorting;
          }
          if (searching) {
            this.searching = searching;
          }
        },

        parseBrowsedItems: function (response, options) {
          return response.results;
        }

      });
    }

  };

  return BrowsableV2ResponseMixin;

});

csui.define('csui/models/impl/nls/lang',{
  // Always load the root bundle for the default locale (en-us)
  "root": true,
  // Do not load English locale bundle provided by the root bundle
  "en-us": false,
  "en": false
});

csui.define('csui/models/impl/nls/root/lang',{
  serverCallPrecheckFailedMissingConnector: 'Missing connector data for server call.',
  serverCallPrecheckFailedModelIsNew: 'Model is new.',

  fav_parent_id: 'Location',
  fav_size: 'Size',
  fav_ungrouped: 'Ungrouped'
});


csui.define('csui/models/favorite2column',['csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/url',
  'i18n!csui/models/impl/nls/lang'
], function (_, Backbone,
    Url,
    lang) {
  'use strict';

  var Favorite2ColumnModel = Backbone.Model.extend({

    idAttribute: null,

    constructor: function Favorite2ColumnModel(attributes, options) {
      if (attributes && !attributes.title) {
        var columnKey = 'fav_' + attributes.column_key;
        attributes.title = lang[columnKey];
      }
      Backbone.Model.prototype.constructor.call(this, attributes, options);
    }

  });

  return Favorite2ColumnModel;
});

csui.define('csui/models/favorite2columns',['csui/lib/underscore', 'csui/lib/backbone', 'csui/models/favorite2column'
], function (_, Backbone, Favorite2ColumnModel) {
  'use strict';

  var Favorite2ColumnCollection = Backbone.Collection.extend({

    model: Favorite2ColumnModel,

    // Reset the collection.  For performance purpose and prevent UI table redraw, this
    // method will not reset if the models is the same as the cached one.
    resetCollection: function (models, options) {
      if (this.cachedColumns && _.isEqual(models, this.cachedColumns)) {
        return;
      }
      // Make a clone of the model array for the cache to let it be equal even if attributes are
      // added to objects of the array
      this.cachedColumns = _.map(models, function (model) {
        return _.clone(model);
      });

      this.reset(models, options);
      this.fetched = true;
    },

    resetFavoritesCollection: function (response, options) {
      var models;
      if (response && response.columns && response.columns instanceof Array) {
        // columns from server
        models = _.map(response.columns, function (column) {
          return new Favorite2ColumnModel(column);
        });
      } else {
        // client-side columns
        models = [
          new Favorite2ColumnModel({
            "default_action": true,
            "column_key": "type",
            "key_value_pairs": false,
            "max_value": null,
            "min_value": null,
            "multi_value": false,
            "name": "Type",
            "required": false,
            "type": 2,
            "type_name": "Integer"
          }),
          new Favorite2ColumnModel({
            "default_action": true,
            "column_key": "favorite_name",
            "max_length": null,
            "min_length": null,
            "multi_value": false,
            "multiline": false,
            "multilingual": false,
            "name": "Name",
            "password": false,
            "required": false,
            "type": -1,
            "type_name": "String"
          }),
          new Favorite2ColumnModel({
            "column_key": "reserved",
            "key_value_pairs": false,
            "multi_value": false,
            "name": "Reserved",
            "required": false,
            "type": 5,
            "type_name": "Boolean"
          }),
          new Favorite2ColumnModel({
            "column_key": "parent_id",
            "key_value_pairs": false,
            "max_value": null,
            "min_value": null,
            "multi_value": false,
            "name": "Parent ID",
            "required": false,
            "type": 2,
            "type_name": "Integer"
          }),
          new Favorite2ColumnModel({
            "column_key": "favorite",
            "key_value_pairs": false,
            "multi_value": false,
            "name": "Favorite",
            "required": false,
            "type": 5,
            "type_name": "Boolean"
          })
        ];
      }

      this.resetCollection(models, options);
    }

  });

  return Favorite2ColumnCollection;
});

csui.define('csui/models/server.adaptors/favorites2.mixin',[
  'csui/lib/underscore', 'csui/utils/url'
], function (_, Url) {
  'use strict';

  var ServerAdaptorMixin = {
    mixin: function (prototype) {
      return _.extend(prototype, {
        makeServerAdaptor: function (options) {
          return this;
        },

        url: function () {
          // this.setExpand('favorites', 'tab_id');
          var url   = this.connector.connection.url.replace('/v1', '/v2'),
            query = Url.combineQueryString(
              this.getAdditionalResourcesUrlQuery(),
              this.getResourceFieldsUrlQuery(),
              this.getExpandableResourcesUrlQuery(),
              this.getRequestedCommandsUrlQuery(),
              this.getSortByOrderUrlQuery()
            );
          url = Url.combine(url, '/members/favorites');
          return query ? url + '?' + query : url;
        },

        getSortByOrderUrlQuery: function () {
          return {sort: 'order'};
        },

        parse: function (response, options) {
          this.parseBrowsedState({results: response}, options);
          this.columns && this.columns.resetFavoritesCollection(response, this.options);
          return this.parseBrowsedItems(response, options);
        }

      });
    }
  };

  return ServerAdaptorMixin;
});

csui.define('csui/models/favorites2',['csui/lib/underscore', 'csui/lib/backbone', 'csui/utils/url', 'csui/utils/base',
  'csui/models/mixins/connectable/connectable.mixin',
  'csui/models/mixins/fetchable/fetchable.mixin',
  'csui/models/mixins/v2.additional.resources/v2.additional.resources.mixin',
  'csui/models/mixins/v2.fields/v2.fields.mixin',
  'csui/models/mixins/v2.expandable/v2.expandable.mixin',
  'csui/models/mixins/v2.commandable/v2.commandable.mixin',
  'csui/models/browsable/client-side.mixin',
  'csui/models/browsable/v2.response.mixin',
  'csui/models/mixins/v2.delayed.commandable/v2.delayed.commandable.mixin',
  'csui/models/favorite2',
  'csui/models/favorite2columns',
  'csui/models/server.adaptors/favorites2.mixin',
  'csui/utils/deepClone/deepClone'
], function (_, Backbone, Url, base,
    ConnectableMixin,
    FetchableMixin,
    AdditionalResourcesV2Mixin,
    FieldsV2Mixin,
    ExpandableV2Mixin,
    CommandableV2Mixin,
    ClientSideBrowsableMixin,
    BrowsableV2ResponseMixin,
    DelayedCommandableV2Mixin,
    Favorite2Model,
    Favorite2ColumnCollection,
    ServerAdaptorMixin) {
  'use strict';

  var Favorite2Collection = Backbone.Collection.extend({

    model: Favorite2Model,

    constructor: function Favorite2Collection(attributes, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);

      this.callCounter = 0;

      // Support collection cloning
      if (options) {
        this.options = _.pick(options, ['connector', 'autoreset',
          'includeResources', 'fields', 'expand', 'commands']);
      }

      this.makeConnectable(options)
          .makeFetchable(options)
          .makeAdditionalResourcesV2Mixin(options)
          .makeFieldsV2(options)
          .makeExpandableV2(options)
          .makeCommandableV2(options)
          .makeClientSideBrowsable(options)
          .makeBrowsableV2Response(options)
          .makeDelayedCommandableV2(options)
          .makeServerAdaptor(options);

      this.columns = new Favorite2ColumnCollection(options.columns);
    },

    clone: function () {
      // Provide the options; they may include connector and other parameters
      var clone = new this.constructor(this.models, {
        connector: this.connector,
        fields: _.deepClone(this.fields),
        expand: _.deepClone(this.expand),
        includeResources: _.clone(this._additionalResources),
        skip: this.skipCount,
        top: this.topCount,
        filter: _.deepClone(this.filters),
        orderBy: this.orderBy,
        commands: _.clone(this.commands),
        defaultActionCommands: _.clone(this.defaultActionCommands),
        delayRestCommands: this.delayRestCommands
      });

      // Clone sub-models not covered by Backbone
      if (this.columns) {
        clone.columns.reset(this.columns.toJSON());
      }
      // Clone properties about the full (not-yet fetched) collection
      clone.actualSkipCount = this.actualSkipCount;
      clone.totalCount = this.totalCount;
      clone.filteredCount = this.filteredCount;
      return clone;
    },

    getResourceScope: function () {
      return _.deepClone({
        fields: this.fields,
        expand: this.expand,
        includeResources: this._additionalResources,
        commands: this.commands,
        defaultActionCommands: this.defaultActionCommands
      });
    },

    setResourceScope: function (scope) {
      this.excludeResources();
      scope.includeResources && this.includeResources(scope.includeResources);
      this.resetFields();
      scope.fields && this.setFields(scope.fields);
      this.resetExpand();
      scope.expand && this.setExpand(scope.expand);
      this.resetCommands();
      scope.commands && this.setCommands(scope.commands);
      this.resetDefaultActionCommands();
      scope.defaultActionCommands && this.setDefaultActionCommands(scope.defaultActionCommands);
    }

  });

  ClientSideBrowsableMixin.mixin(Favorite2Collection.prototype);
  BrowsableV2ResponseMixin.mixin(Favorite2Collection.prototype);
  ConnectableMixin.mixin(Favorite2Collection.prototype);
  FetchableMixin.mixin(Favorite2Collection.prototype);
  AdditionalResourcesV2Mixin.mixin(Favorite2Collection.prototype);
  FieldsV2Mixin.mixin(Favorite2Collection.prototype);
  ExpandableV2Mixin.mixin(Favorite2Collection.prototype);
  CommandableV2Mixin.mixin(Favorite2Collection.prototype);
  DelayedCommandableV2Mixin.mixin(Favorite2Collection.prototype);
  ServerAdaptorMixin.mixin(Favorite2Collection.prototype);

  return Favorite2Collection;

});

csui.define('csui/models/favorite2group',[
  'csui/lib/underscore', 'csui/lib/backbone', 'csui/utils/url',
  'csui/models/mixins/resource/resource.mixin',
  'csui/models/mixins/uploadable/uploadable.mixin',
  'csui/models/favorites2', 'csui/utils/deepClone/deepClone'
], function (_, Backbone, Url, ResourceMixin, UploadableMixin,
   Favorite2Collection) {
  'use strict';

  var Favorite2GroupModel = Backbone.Model.extend({
    mustRefreshAfterPut: false,

    idAttribute: 'tab_id',

    constructor: function Favorite2GroupModel(attributes, options) {
      Backbone.Model.prototype.constructor.call(this, attributes, options);

      this.makeResource(options);
      this.makeUploadable(options);

      // initialize favorites of this group with provided favorites and columns
      attributes || (attributes = {});

      this.favorites = new Favorite2Collection(attributes.favorites, {
        connector: options.connector,
        autoreset: true,
        tab_id: this.get('tab_id'),
        columns: attributes.favorite_columns,
        commands: options && options.commands
      });
    },

    urlRoot: function () {
      var v2Url = this.connector.connection.url.replace('/v1', '/v2');
      var url = Url.combine(v2Url, "/members/favorites/tabs/");
      return url;
    },

    parse: function (resp, options) {
      if (resp.results && resp.results.data) {
        return {tab_id: resp.results.data.tab_id};
      } else {
        return resp;
      }
    }
  });

  ResourceMixin.mixin(Favorite2GroupModel.prototype);
  UploadableMixin.mixin(Favorite2GroupModel.prototype);

  return Favorite2GroupModel;
});

csui.define('csui/models/mixins/syncable.from.multiple.sources/syncable.from.multiple.sources.mixin',[
  'csui/lib/underscore', 'csui/lib/jquery'
], function (_, $) {
  'use strict';

  var SyncableFromMultipleSources = {
    mixin: function (prototype) {
      return _.extend(prototype, {
        makeSyncableFromMultipleSources: function (options) {
          return this;
        },

        syncFromMultipleSources: function (promises, mergeSources,
            convertError, options) {
          // Convert $.ajax rejected value by default
          function convertAjaxError(result) {
            return Array.isArray(result) ? result[0] : result;
          }

          // The convertError parameter is optional
          if (options === undefined && typeof convertError === 'object') {
            options = convertError;
            convertError = convertAjaxError;
          } else if (convertError == null) {
            convertError = convertAjaxError;
          }

          var model = this,
              // Pick only jQuery objects, which support the abort() method,
              // from all promises.
              abortables = promises.filter(function (promise) {
                return promise.abort;
              }),
              deferred = $.Deferred(),
              promise = deferred.promise();
          // Propagate jQuery object aborting interface, if the promises
          // come from $.ajax calls; add inject the abort() method.
          if (abortables.length) {
            promise.abort = function (statusText) {
              statusText || (statusText = 'canceled');
              abortables.forEach(function (promise) {
                promise.abort(statusText);
              });
              return this;
            };
          }
          // Implement Backbone event flow - 'request', callback,
          // promise. (Populating the model and triggering 'sync' or
          // 'error' events takes place in the fetch method.)
          model.trigger('request', model, {}, options);
          $.when.apply($, promises)
           .done(function () {
             var response = mergeSources.apply(model, arguments),
                 success = options.success;
             if (success) {
               success.call(options.context, response, 'success', {});
             }
             deferred.resolve(response, 'success', {});
           })
           .fail(function () {
             var object = convertError.apply(model, arguments),
                 error = options.error;
             if (error) {
               error.call(options.context, object, 'error', object.statusText);
             }
             // Return only the first error for simplicity; the others
             // will be logged by the connector, if they come from
             // failing $.ajax calls.
             deferred.reject.call(deferred, object, 'error', object.statusText);
           });
          return promise;
        }
      });
    }
  };

  return SyncableFromMultipleSources;
});

csui.define('csui/models/server.adaptors/favorite2groups.mixin',[
  'csui/lib/jquery', 'csui/lib/underscore', 'csui/utils/url', 'i18n!csui/models/impl/nls/lang'
], function ($, _, Url, lang) {
  'use strict';

  var ServerAdaptorMixin = {
    mixin: function (prototype) {

      return _.extend(prototype, {
        makeServerAdaptor: function (options) {
          return this;
        },

        sync: function (method, model, options) {
          if (method !== 'read') {
            throw new Error('Only fetching groups with favorites is supported.');
          }
          var groups = $.ajax(this.connector.extendAjaxOptions({url: this.url()}))
            .then(function (response) {
              return response;
            });

          var favoritesCollection = this.favorites;
          var favoritesFetchOptions = _.omit(options, ['success', 'error']);
          var favorites = favoritesCollection.fetch(favoritesFetchOptions)
            .then(function (response) {
              return favoritesCollection; // need full object, including columns when merging
            });

          // Groups will be parsed by _createMergedResponse,
          // favorites were parsed by Favorite2Collection.
          options.parse = false;

          return this.syncFromMultipleSources([groups, favorites], this._createMergedResponse, options);
        },

        _createMergedResponse: function (groups, favoritesCollection, options) {
          var favorites = favoritesCollection.toJSON();
          var columns = favoritesCollection.columns;
          // add "Unspecified group"
          groups.results.push({data: {name: lang.fav_ungrouped, order: -1, tab_id: -1}});
          var merged = groups.results.map(function (group) {
            group = group.data;

            var tabId = group.tab_id;
            group.favorites = favorites.filter(function (favorite) {
              return favorite.favorite_tab_id === tabId || tabId === -1 && favorite.favorite_tab_id ===
                null;
            });
            group.favorite_columns = columns.toJSON(); //
            return group;
          });

          return merged;
        },

        parse: function (response, options) {
          return response;
        },

        url: function () {
          // this.setExpand('favorites', 'tab_id');
          var url = this.connector.connection.url.replace('/v1', '/v2'),
            query = Url.combineQueryString(
              this.getAdditionalResourcesUrlQuery(),
              this.getResourceFieldsUrlQuery(),
              this.getExpandableResourcesUrlQuery(),
              this.getSortByOrderUrlQuery()
              // this.getRequestedCommandsUrlQuery()
            );
          url = Url.combine(url, '/members/favorites/tabs');
          return query ? url + '?' + query : url;
        }

      });
    }
  };

  return ServerAdaptorMixin;
});

csui.define('csui/models/favorite2groups',['csui/lib/jquery',
  'csui/lib/underscore', 'csui/lib/backbone', 'csui/utils/url',
  'csui/utils/base',
  'csui/models/mixins/syncable.from.multiple.sources/syncable.from.multiple.sources.mixin',
  'csui/models/mixins/connectable/connectable.mixin',
  'csui/models/mixins/fetchable/fetchable.mixin',
  'csui/models/mixins/v2.additional.resources/v2.additional.resources.mixin',
  'csui/models/mixins/v2.fields/v2.fields.mixin',
  'csui/models/mixins/v2.expandable/v2.expandable.mixin',
  'csui/models/favorite2group', 'csui/models/favorites2',
  'csui/models/server.adaptors/favorite2groups.mixin',
  'i18n!csui/models/impl/nls/lang'
], function ($, _, Backbone, Url, base, ConnectableMixin, FetchableMixin,
    AdditionalResourcesV2Mixin, FieldsV2Mixin, ExpandableV2Mixin, SyncableFromMultipleSources,
    Favorite2GroupModel, Favorite2Collection, ServerAdaptorMixin, lang) {
  'use strict';

  var Favorite2GroupsCollection = Backbone.Collection.extend({
    model: Favorite2GroupModel,

    constructor: function Favorite2GroupsCollection(attributes, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);

      // Support collection cloning
      if (options) {
        this.options = _.pick(options, ['connector', 'autoreset',
          'includeResources', 'fields', 'expand' /*, 'commands'*/]);
      }

      this.makeConnectable(options)
          .makeFetchable(options)
          .makeAdditionalResourcesV2Mixin(options)
          .makeFieldsV2(options)
          .makeExpandableV2(options)
          .makeServerAdaptor(options);

      if (options) {
        this.favorites = options.favorites;
        this.commands = options.commands;
      }
      if (!this.favorites) {
        this.favorites = new Favorite2Collection(undefined, {
          connector: this.connector,
          autoreset: true,
          commands: this.commands
        });
      }
      this.on('sync', this._setupEventPropagation, this);
      this.on('add', this._propagateFavorite2CollectionOptions, this);
      this.on('reset', function (groups, options) {
        var self = this;
        groups.each(function (group) {
          self._propagateFavorite2CollectionOptions(group, groups, options);
        });
      }, this);
    },

    _fetch: function (options) {
      options || (options = {});
      options.originalSilent = options.silent;
      // make this fetch silent, because another fetch is done at then reset
      //  event is triggered
      options.silent = true;

      return this.originalFetch.call(this, options);
    },

    _prepareModel: function (attrs, options) {
      options || (options = {});
      options.commands = this.commands;
      return Backbone.Collection.prototype._prepareModel.call(this, attrs, options);
    },

    _setupEventPropagation: function () {
      var self = this;
      this.each(function (group) {
        group.favorites.listenTo(group.favorites, "reset update",
            function (favoritesCollection, options) {
              self.trigger('update', self, options);
            });

      }, this);
    },

    // Note: this.favorites is the collection that was used to set the resource scope and when group
    // plus the favorites are being merged, reset is triggered for all groups, which then
    // already have the favorites. Then the options get copied or cloned from the original
    // collection to each favorite collection of each group.
    // This is necessary, because if a model of those favorite collections is saved and fetched
    // again, the options from the collection are used if not set at the single model. Otherwise
    // a single favorite model would be fetched without commands, expands, etc.
    _propagateFavorite2CollectionOptions: function (group, collection, options) {
      group.favorites.setFilter(_.deepClone(this.favorites.filters), false);
      group.favorites.setOrder(this.favorites.orderBy, false);
      group.favorites.setExpand(_.deepClone(this.favorites.expand));
      if (this.favorites.commands) {
        group.favorites.setCommands(this.favorites.commands);
      }
    },

    clone: function () {
      var clone = new this.constructor(this.models, {
        // node: this.node,
        // skip: this.skipCount,
        // top: this.topCount,
        connector: this.connector,
        filter: _.deepClone(this.filters),
        orderBy: this.orderBy,
        expand: _.clone(this.expand),
        commands: _.clone(this.commands),
        favorites: this.favorites.clone()
      });

      return clone;
    },

    getSortByOrderUrlQuery: function () {
      return {sort: 'order'};
    },

    // private: reset the collection
    resetCollection: function (models, options) {
      this.reset(models, options);
      this.fetched = true;
    },

    // todo: this should be a PUT to /members/favorites/tabs with the following hierarchical
    // structure (and it should be moved to the favorites2groups model):

    // var tabs = [
    //   {
    //     name: "first group",
    //     favorites: [
    //       {
    //         name: "Document for review",
    //         size: 20099790,
    //         favorite_name: "Favorite of Document for review"
    //         // more attributes follow ...
    //       },
    //       {
    //         name: "Specification",
    //         size: 98898690,
    //         favorite_name: "Pump Specification"
    //         // more attributes follow ...
    //       }
    //     ]
    //   },
    //   {
    //     name: "second group",
    //     favorites: [
    //       {
    //         name: "My Presentation",
    //         size: 987078,
    //         favorite_name: "The Presentation for all Managers"
    //         // more attributes follow ...
    //       }
    //     ]
    //   }
    // ];

    saveAll: function () {
      var self = this;
      var tabs = this.map(function (group) {
        var groupName;
        var groupId = group.get('tab_id');
        if (groupId == -1) {
          groupName = null; // the ungrouped group has no name
        } else {
          groupName = group.get('name');
        }
        return {
          name: groupName, tab_id: groupId, favorites: group.favorites.map(function (favorite) {
            return {
              id: favorite.get('id'),
              name: favorite.get('favorite_name')
            };
          })
        };
      });

      // this makes a formdata request
      var putUrl = this.connector.connection.url.replace('/v1', '/v2');
      putUrl = Url.combine(putUrl, '/csui/favorites');

      // callCounter is for detecting parallel REST calls and to use only response from latest
      this.callCounter++;

      var options = {
        type: 'PUT',
        url: putUrl,
        data: {body: JSON.stringify(tabs)},
        beforeSend: function (request, settings) {
          request.counter = self.callCounter;
        }
      };
      this.connector.extendAjaxOptions(options);  // among others, add OTCS ticket to options

      var deferred = Backbone.$.Deferred();
      var jqxhr = Backbone.ajax(options);
      jqxhr.then(function (response) {
        if (jqxhr.counter < self.callCounter) {
          // let the caller ignore the results, because a new save operation was already started
          deferred.reject();
        } else {
          // get new tab_ids because with bulk update call, the server invalidates all tab_ids
          options = {
            type: 'GET',
            url: self.url()
          };
          self.connector.extendAjaxOptions(options);  // among others, add OTCS ticket to options
          var jqxhrTabs = Backbone.ajax(options)
              .then(function (tabsResp) {
                if (tabsResp.results && tabsResp.results instanceof Array) {
                  // merge the retrieved tab_id and order attributes with the existing models: the
                  // order of the returned list is the same as the order in this collection.
                  // Associate the models one by one, because the sequence is the same (if
                  // nothing changed them again in the meanwhile at the server)
                  // Note, this collection has at the end an additional group with tab_id = -1,
                  // which is the Ungrouped favorite group. This never changes. It's always at
                  // the end.

                  tabsResp.results.forEach(function (elem, index) {
                    if (elem.data) {
                      var group = self.at(index);
                      // must remove the group from the collection and add it again before
                      // changing the id (in this case tab_id) to let backbone update the byId
                      // structure correctly. this is a hack!
                      self.remove(group, {silent: true});
                      group.set('tab_id', elem.data.tab_id, {silent: true});
                      self.add(group, {at: index, silent: true});

                      group.set('order', elem.data.order, {silent: true});
                      // also update the tab_id stored in each favorite too, just in case
                      // anybody is using this...
                      for (var i = 0; i < group.favorites.length; i++) {
                        var favorite = group.favorites.at(i);
                        // do the hack also here to let backbone update the byId structure
                        group.favorites.remove(favorite, {silent: true});
                        favorite.set('favorite_tab_id', elem.data.tab_id, {silent: true});
                        group.favorites.add(favorite, {at: i, silent: true});
                      }
                    }
                  });

                }
                deferred.resolve(response);
                self.trigger('bulk:update:succeed');
              }, function (jqxhrTabs, statusText) {
                var errorTabs = new base.RequestErrorMessage(jqxhrTabs);
                deferred.reject(errorTabs);
                self.trigger('bulk:update:fail');
              });
        }
      }, function (jqxhr, statusText) {
        // if self.callCounter is already higher than the stored value of this request, then
        // a newer request was already started -> ignore the error in that case.
        if (jqxhr.counter < self.callCounter) {
          deferred.reject();
        } else {
          var error = new base.RequestErrorMessage(jqxhr);
          deferred.reject(error);
        }
        self.trigger('bulk:update:fail');
      });
      return deferred.promise();
    }
  });

  ConnectableMixin.mixin(Favorite2GroupsCollection.prototype);
  FetchableMixin.mixin(Favorite2GroupsCollection.prototype);
  AdditionalResourcesV2Mixin.mixin(Favorite2GroupsCollection.prototype);
  FieldsV2Mixin.mixin(Favorite2GroupsCollection.prototype);
  ExpandableV2Mixin.mixin(Favorite2GroupsCollection.prototype);
  SyncableFromMultipleSources.mixin(Favorite2GroupsCollection.prototype);
  ServerAdaptorMixin.mixin(Favorite2GroupsCollection.prototype);

  return Favorite2GroupsCollection;
});

csui.define('csui/models/server.adaptors/favorite.model.mixin',[
  'csui/lib/jquery', 'csui/lib/underscore', 'csui/utils/url', 'i18n!csui/models/impl/nls/lang'
], function ($, _, Url, lang) {
  'use strict';

  var ServerAdaptorMixin = {
    mixin: function (prototype) {

      return _.extend(prototype, {
        makeServerAdaptor: function (options) {
          return this;
        },

        url: function () {
          return Url.combine(this.options.connector.connection.url.replace('/v1', '/v2'),
            'members/favorites', this.get('id'));
        },

        _serverCallPreCheck: function () {
          if (this.isNew()) {
            return {error: lang.serverCallPrecheckFailedModelIsNew};
          }
          if (!this.options || !this.options.connector) {
            return {error: lang.serverCallPrecheckFailedMissingConnector};
          }
          return undefined;
        },

        _serverCallUpdateFavorite: function (ajaxMethod, deferred, selected) {
          var error = this._serverCallPreCheck();
          if (error !== undefined) {
            deferred.reject(error);
            return;
          }

          var options = {
            type: ajaxMethod,
            url: this.url()
          };
          this.options.connector.extendAjaxOptions(options);

          if (ajaxMethod === 'POST') {
            var tabId = this.get('tab_id');
            var name = this.get('name');
            // do this check for code backward compatibility
            if (tabId !== undefined || name !== undefined) {
              var data = {};
              name !== undefined && _.extend(data, {name: name});
              (tabId !== undefined && tabId !== -1) && _.extend(data, {tab_id: tabId});
              _.extend(options, {data: {body: JSON.stringify(data)}});
            }
          }

          $.ajax(options)
            .done(_.bind(function (resp) {
              this.set('selected', selected);
              if (window.csui && window.csui.mobile) {
                // LPAD-59888: update the favorites list properly by fetching the update node model
                // change does not affect Smart UI
                var selectedNode = this.get('node');
                selectedNode.fetch({
                  force: true
                });
              }
              deferred.resolve(resp);
            }, this))
            .fail(function (err) {
              deferred.reject(err);
            });
        }

      });
    }
  };

  return ServerAdaptorMixin;
});

csui.define('csui/models/favorite.model',['csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone', 'csui/utils/base',
  'csui/utils/url', 'csui/models/server.adaptors/favorite.model.mixin', 'i18n!csui/models/impl/nls/lang'
], function ($, _, Backbone, base, Url, ServerAdaptorMixin, lang) {
  "use strict";

  var FavoriteModel = Backbone.Model.extend({

    constructor: function FavoriteModel(attributes, options) {
      options || (options = {});
      this.options = options;
      Backbone.Model.prototype.constructor.apply(this, arguments);
      this.makeServerAdaptor(options);
    },

    isNew: function () {
      return this.get('id') === undefined;
    },

    addToFavorites: function () {
      var deferred = $.Deferred();
      this._serverCallUpdateFavorite('POST', deferred, true);
      return deferred.promise();
    },

    removeFromFavorites: function () {
      var deferred = $.Deferred();
      this._serverCallUpdateFavorite('DELETE', deferred, false);
      return deferred.promise();
    }

  });

  ServerAdaptorMixin.mixin(FavoriteModel.prototype);
  return FavoriteModel;

});

csui.define('csui/models/member/member.model',['csui/lib/underscore', 'csui/lib/backbone', 'csui/utils/url',
  'csui/models/mixins/resource/resource.mixin'
], function (_, Backbone, Url, ResourceMixin) {
  'use strict';

  var MemberModel = Backbone.Model.extend({
    constructor: function MemberModel(attributes, options) {
      Backbone.Model.prototype.constructor.call(this, attributes, options);
      this.groupId = attributes.groupId;
      this.makeResource(options);
    },

    clone: function () {
      return new this.constructor(this.attributes, {
        connector: this.connector
      });
    },
    url: function () {
      var id  = this.get("id"),
          url = this.connector.connection.url;
      url = url.replace('/api/v1', '/api/v2');
      if (id) {
        url = Url.combine(url, "members/" + id + "/members");
      } else {
        url = Url.combine(url, "members");
      }
      return url;
    },
    parse: function (response) {
      var that = this;
      if (response.data !== undefined) {
        var memberId = this.get("id");
        _.each(response.data, function (member) {
          member.parentId = memberId;
        });

        return response;
      }
      return response;
    }
  });

  ResourceMixin.mixin(MemberModel.prototype);

  return MemberModel;
});

csui.define('csui/models/browsable/v1.request.mixin',['csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/url'
], function (_, $, Url) {

  var BrowsableV1RequestMixin = {

    mixin: function (prototype) {
      return _.extend(prototype, {

        makeBrowsableV1Request: function (options) {
          return this;
        },

        getBrowsableUrlQuery: function () {
          var query = {};
          var limit = this.topCount || 0;
          if (limit) {
            query.limit = limit;
            query.page = Math.floor((this.skipCount || 0) / limit) + 1;
          }
          if (this.orderBy) {
            // TODO: Implement sorting by multiple columns on the server
            var first = this.orderBy.split(',')[0].split(' ');
            query.sort = (first[1] || 'asc') + '_' + first[0];
          }
          query = $.param(query);
          if (!$.isEmptyObject(this.filters)) {
            for (var name in this.filters) {
              if (_.has(this.filters, name)) {
                var value = makeFilterValue(this.filters[name], name);
                if (value !== undefined) {
                  if (query) {
                    query += '&';
                  }
                  query += value;
                }
              }
            }
          }
          return query;
        }

      });
    }

  };

  function makeFilterValue(value, name) {
    if (value !== undefined && value !== null && value !== "") {
      if ($.isArray(value)) {
        value = Url.makeMultivalueParameter("where_" + name, value);
      }
      else {
        value = "where_" + name + "=" + encodeURIComponent(value.toString());
      }
      if (value.length > 0) {
        return value;
      }
    }
  }

  return BrowsableV1RequestMixin;

});

csui.define('csui/models/member/membercollection',['csui/lib/underscore', 'csui/lib/backbone', 'csui/utils/url',
  'csui/models/mixins/resource/resource.mixin',
  'csui/models/browsable/browsable.mixin',
  'csui/models/browsable/v1.request.mixin', 'csui/models/member/member.model'
], function (_, Backbone, Url, ResourceMixin, BrowsableMixin, BrowsableV1RequestMixin,
    MemberModel) {
  'use strict';

  ////-------------- MemberCollection ---------------------------------
  var MemberCollection = Backbone.Collection.extend({

    model: MemberModel,

    searchTerm: "",

    constructor: function MemberCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);

      this.makeResource(options);
      this.makeBrowsable(options);

      if (options !== undefined && options.member !== undefined && options.member !== null) {
        this.parentId = options.member.get("id");
        this.nodeId = options.member.get("nodeId");
        this.categoryId = options.member.get("categoryId");
        this.groupId = options.member.get("groupId");
      } else {
        this.nodeId = options.nodeId;
        this.categoryId = options.categoryId;
        this.groupId = options.groupId;
      }
      this.query = options.query || "";
      this.type = options.type;
    },

    clone: function () {
      // Provide the options; they may include connector and other parameters
      var clone = new this.constructor(this.models, {
        connector: this.connector,
        parentId: this.parentId,
        nodeId: this.nodeId,
        categoryId: this.categoryId,
        groupId: this.groupId,
        query: this.query
      });
      // Clone properties about the full (not-yet fetched) collection
      clone.totalCount = this.totalCount;
      return clone;
    },

    url: function () {

      var url = this.connector.connection.url;
      var id = this.groupId;
      //var id = 1001;
      if (id === undefined || id === null) {
        id = this.parentId;
        //TODO: need to remove topCount once v2/members supports limit and pagination support
        this.topCount = 20;
      }

      if (!this.topCount) {
        this.topCount = 20;
      }

      var query = Url.combineQueryString(
          this.getBrowsableUrlQuery()
      );

      //TODO: 'where_name' is not supported for now hence replacing it with 'query'
      //TODO: Must be removed once 'where_name' is supported
      query = query.replace('where_name', 'query');

      url = url.replace('/api/v1', '/api/v2');

      if (this.type && this.type === 'GroupsOfCurrentUser') {
        url = Url.combine(url, "members/memberof?" + query);
      } else if (this.type === 1 && id) {
        url = Url.combine(url, "members/" + id + "/members?where_type=1&" + query);
      } else if (this.type === 1) {
        url = Url.combine(url, "members?where_type=1&" + query);
      } else if (id) {
        url = Url.combine(url, "members/" + id + "/members?" + query);
      } else {
        url = Url.combine(url, "members?" + query);
      }

      return url;
    },

    parse: function (response, options) {
      if (!_.isEmpty(response.results)) {
        var self = this;
        this.totalCount = (response.collection && response.collection.paging) ?
                          response.collection.paging.total_count :
                          response.results.length;
        _.each(response.results, function (member) {
          member.parentId = self.parentId;
          member = _.extend(member, member.data.properties);
        });

        return response.results;
      }
      this.totalCount = 0;
      return null;
    },

    search: function (term) {
      this.searchTerm = term;
      this.fetch();
    }

  });

  ResourceMixin.mixin(MemberCollection.prototype);
  BrowsableMixin.mixin(MemberCollection.prototype);
  BrowsableV1RequestMixin.mixin(MemberCollection.prototype);

  return MemberCollection;
});

csui.define('csui/models/members',['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/utils/url', 'csui/models/member', 'csui/models/mixins/resource/resource.mixin'
], function (_, $, Backbone, Url, MemberModel, ResourceMixin) {
  'use strict';

  var MemberCollection = Backbone.Collection.extend({

    constructor: function MemberCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);

      this.makeResource(options);

      options || (options = {});

      this.limit = options.limit || 10;
      this.query = options.query || "";
      this.expandFields = options.expandFields || [];
      if (options.memberFilter && options.memberFilter.type) {
        this.memberType = options.memberFilter.type;
      }
      // Default is to search users and groups
      this.memberType || (this.memberType = [0, 1]);
    },

    model: MemberModel,

    clone: function () {
      return new this.constructor(this.models, {
        connector: this.connector,
        limit: this.limit,
        query: this.query,
        expandFields: _.clone(this.expandFields),
        memberFilter: {type: this.memberType}
      });
    },

    urlRoot: function () {
      var apiBase = new Url(this.connector.connection.url).getApiBase('v2');
      return Url.combine(apiBase, "/members");
    },

    url: function () {
      var limitClause  = "limit=" + this.limit,
          // There can be many where_type clauses in the REST API call, add each.
          // Unsupported types will be ignored by the REST API if they are integers.
          memberClause = this.memberType.length &&
                         "where_type=" + this.memberType.join("&where_type=") || "",
          // Also multiple expand fields like group_id and leader_id can be configured in
          // one REST API call.
          expandClause = this.expandFields.length &&
                         "expand=properties{" + this.expandFields.join(",") + "}" ||
                         "",
          // The filter query.
          queryClause  = "query=" + encodeURIComponent(this.query),
          finalClauses = Url.combineQueryString(limitClause, memberClause,
              expandClause, queryClause);

      // Return the query
      return Url.appendQuery(_.result(this, "urlRoot"), finalClauses);
    },

    parse: function (response) {
      if (!_.isEmpty(response.results)) {
        _.each(response.results, function (member) {
          member = _.extend(member, member.data.properties);
          delete member.data;
        });
        return response.results;
      }
      return null;
    }

  });

  ResourceMixin.mixin(MemberCollection.prototype);

  return MemberCollection;

});

csui.define('csui/models/mixins/node.connectable/node.connectable.mixin',['csui/lib/underscore'
], function (_) {
  "use strict";

  var NodeConnectableMixin = {

    mixin: function (prototype) {
      var originalPrepareModel = prototype._prepareModel;

      return _.extend(prototype, {

        makeNodeConnectable: function (options) {
          if (options && options.node) {
            this.node = options.node;
            options.node.connector && options.node.connector.assignTo(this);
          }
          return this;
        },

        _prepareModel: function (attrs, options) {
          options || (options = {});
          var node = options.node || this.node;
          options.connector = node && node.connector;
          return originalPrepareModel.call(this, attrs, options);
        }

      });
    }

  };

  return NodeConnectableMixin;

});

csui.define('csui/models/mixins/node.autofetchable/node.autofetchable.mixin',['csui/lib/underscore'
], function (_) {
  "use strict";

  var NodeAutoFetchableMixin = {
    mixin: function (prototype) {
      return _.extend(prototype, {
        makeNodeAutoFetchable: function (options) {
          var autofetchEvent = options && options.autofetchEvent;
          if (autofetchEvent) {
            this._autofetchEvent = options.autofetchEvent;
          }
          var autofetch = options && options.autofetch;
          if (autofetch) {
            this.automateFetch(autofetch);
          }
          return this;
        },

        automateFetch: function (enable) {
          var event = _.result(this, '_autofetchEvent'),
              method = enable ? 'on' : 'off';
          this.autofetch = !!enable;
          this.node[method](event, _.bind(this._fetchAutomatically, this, enable));
        },

        isFetchable: function () {
          return this.node.isFetchableDirectly();
        },

        _autofetchEvent: 'change:id',

        _fetchAutomatically: function (options) {
          this.isFetchable() && this.fetch(_.isObject(options) && options);
        }
      });
    }
  };

  return NodeAutoFetchableMixin;
});

csui.define('csui/models/mixins/node.resource/node.resource.mixin',['csui/lib/underscore', 'csui/models/mixins/node.connectable/node.connectable.mixin',
  'csui/models/mixins/fetchable/fetchable.mixin',
  'csui/models/mixins/node.autofetchable/node.autofetchable.mixin'
], function (_, NodeConnectableMixin, FetchableMixin, NodeAutoFetchableMixin) {

  var NodeResourceMixin = {

    mixin: function (prototype) {
      NodeConnectableMixin.mixin(prototype);
      FetchableMixin.mixin(prototype);
      NodeAutoFetchableMixin.mixin(prototype);

      return _.extend(prototype, {

        makeNodeResource: function (options) {
          return this.makeNodeConnectable(options)
              .makeFetchable(options)
              .makeNodeAutoFetchable(options);
        }

      });
    }

  };

  return NodeResourceMixin;

});


csui.define('csui/utils/nodesprites',[
  'csui/lib/underscore', 'csui/lib/backbone',
  'csui/models/mixins/rules.matching/rules.matching.mixin',
  'i18n!csui/utils/impl/nls/lang',
  // Load and register external cell views
  'csui-ext!csui/utils/nodesprites'
], function (_, Backbone, RulesMatchingMixin, lang, extraIcons) {

  var NodeSpriteModel = Backbone.Model.extend({

    defaults: {
      sequence: 100,
      className: null
    },

    constructor: function NodeSpriteModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
      this.makeRulesMatching(options);
    }

  });

  RulesMatchingMixin.mixin(NodeSpriteModel.prototype);

  var NodeSpriteCollection = Backbone.Collection.extend({

    model: NodeSpriteModel,
    comparator: "sequence",

    constructor: function NodeSpriteCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
    },

    findClass: function (compareType, key, val) {
      var nodeSprite = this.find(function (item) {
        var values = item.get(compareType);
        if (values === undefined) {
          return undefined;
        }
        if (_.isArray(values[key])) {
          var keyValues = values[key];
          for (var i = 0; i < keyValues.length; i++) {
            if (keyValues[i] === val) {
              return true;
            }
          }
        }

        return (values[key] === val);
      });
      return nodeSprite ? nodeSprite.get('className') : undefined;
    },

    findTypeByNode: function (node) {
      var typeName = node.get('type_name') || lang.NodeTypeUnknown;

      var nodeSprite = this.findByNode(node);
      if (nodeSprite) {
        var spriteName = _.result(nodeSprite.attributes, 'mimeType');
        if (spriteName) {
          typeName = spriteName;
        }
      }

      return typeName;
    },

    findClassByNode: function (node) {
      var nodeSprite = this.findByNode(node);
      return nodeSprite && _.result(nodeSprite.attributes, 'className') || '';
    },

    findByNode: function (node) {
      // FIXME: Show the original icon with a shortcut overlay, as soon as agreed
      // If the node is a shortcut and the original_id is expanded to contain
      // the node data, we can show the original icon with a small arrow overlay.
      //if (node.original && node.original.has('type')) {
      //  node = node.original;
      //}
      return this.find(function (item) {
        return item.matchRules(node, item.attributes);
      });
    }

  });

  // MS Office: http://filext.com/faq/office_mime_types.php
  // OpenOffice: https://www.openoffice.org/framework/documentation/mimetypes/mimetypes.html

  var nodeSprites = new NodeSpriteCollection([
    {
      // excel
      equalsNoCase: {
        mime_type: [
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
          'application/vnd.ms-excel.sheet.macroEnabled.12',
          'application/vnd.ms-excel.template.macroEnabled.12',
          'application/vnd.ms-excel.addin.macroEnabled.12',
          'application/vnd.ms-excel.sheet.binary.macroEnabled.12'
        ]
      },
      className: 'csui-icon mime_excel',
      mimeType: lang.NodeTypeXLS,
      sequence: 50
    },
    {
      // visio
      equalsNoCase: {
        mime_type: [
          'application/visio',
          'application/x-visio',
          'application/vnd.visio',
          'application/visio.drawing',
          'application/vsd',
          'application/x-vsd',
          'image/x-vsd',
          'application/vnd.visio2013',
          'application/vnd.ms-visio.drawing',
          'application/vnd.ms-visio.viewer',
          'application/vnd.ms-visio.stencil',
          'application/vnd.ms-visio.template'
        ]
      },
      className: 'csui-icon mime_visio',
      mimeType: lang.NodeTypeVisio,
      sequence: 50
    },
    {
      // spreadsheets
      equalsNoCase: {
        mime_type: [
          'application/vnd.oasis.opendocument.spreadsheet',
          'application/vnd.oasis.opendocument.spreadsheet-template',
          'application/vnd.sun.xml.calc',
          'application/vnd.sun.xml.calc.template',
          'application/vnd.stardivision.calc',
          'application/x-starcalc'
        ]
      },
      className: 'csui-icon mime_spreadsheet',
      mimeType: lang.NodeTypeSpreadsheet,
      sequence: 50
    },
    {
      // powerpoint
      equalsNoCase: {
        mime_type: [
          'application/vnd.ms-powerpoint',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'application/vnd.openxmlformats-officedocument.presentationml.template',
          'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
          'application/vnd.ms-powerpoint.addin.macroEnabled.12',
          'application/vnd.ms-powerpoint.presentation.macroEnabled.12',
          'application/vnd.ms-powerpoint.template.macroEnabled.12',
          'application/vnd.ms-powerpoint.slideshow.macroEnabled.12'
        ]
      },
      className: 'csui-icon mime_powerpoint',
      mimeType: lang.NodeTypePPT,
      sequence: 50
    },
    {
      // presentations
      equalsNoCase: {
        mime_type: [
          'application/vnd.google-apps.presentation', // GSLIDE - Google Drive Presentation
          'application/x-iwork-keynote-sffkey', // KEY, KEYNOTE — Apple Keynote Presentation
          'application/vnd.wolfram.mathematica', // NB — Mathematica Slideshow
          'application/vnd.wolfram.player', // NBP — Mathematica Player slideshow
          'application/vnd.oasis.opendocument.presentation', // ODP — OpenDocument Presentation
          'application/vnd.oasis.opendocument.presentation-template', // OTP - ODP Template
          'application/vnd.sun.xml.impress',
          'application/vnd.sun.xml.impress.template',
          'application/vnd.stardivision.impress',
          'application/vnd.stardivision.impress-packed',
          'application/x-starimpress',
          'application/vnd.lotus-freelance', // PRZ — Lotus Freelance Graphics
          'application/vnd.stardivision.impress', // SDD - Star Office's StarImpress
          'application/vnd.corel-presentations', // SHW — Corel Presentations slide show creation
          'application/vnd.sun.xml.impress', // SXI — OpenOffice.org XML (obsolete) Presentation
          'application/vnd.ms-officetheme', // THMX — Microsoft PowerPoint theme template
          'application/vnd.sun.xml.impress.template '// STI — OpenOffice Impress template

          // the following extensions could not mapped to a mime-type
          // todo: intro mapping to file extensions
          // WATCH — Dataton Watchout Presentation
          // PEZ — Prezi Desktop Presentation
          // SHF — ThinkFree Show
          // SHOW — Haansoft(Hancom) Presentation software document
          // SLP — Logix-4D Manager Show Control Project
          // SSPSS — SongShow Plus Slide Show

        ]
      },
      className: 'csui-icon mime_presentation',
      mimeType: lang.NodeTypePresentation,
      sequence: 50
    },
    {
      // MS Office publisher
      equalsNoCase: {
        mime_type: [
          'application/vnd.ms-publisher',
          'application/x-mspublisher'
        ]
      },
      className: 'csui-icon mime_publisher',
      mimeType: lang.NodeTypePublisher,
      sequence: 50
    },
    {
      // formulas
      equalsNoCase: {
        mime_type: [
          'application/vnd.oasis.opendocument.formula',
          'application/vnd.sun.xml.math',
          'application/vnd.stardivision.math',
          'application/x-starmath'
        ]
      },
      className: 'csui-icon mime_formula',
      mimeType: lang.NodeTypeFormula,
      sequence: 50
    },
    {
      // pdf
      equalsNoCase: {
        mime_type: [
          'application/vnd.pdf',
          'application/x-pdf',
          'application/pdf'
        ]
      },
      className: 'csui-icon mime_pdf',
      mimeType: lang.NodeTypePDF,
      sequence: 50
    },
    {
      // word
      equalsNoCase: {
        mime_type: [
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
          'application/vnd.ms-word.document.macroEnabled.12',
          'application/vnd.ms-word.template.macroEnabled.12'
        ]
      },
      className: 'csui-icon mime_word',
      mimeType: lang.NodeTypeDOC,
      sequence: 50
    },
    {
      // MS OneNote
      equalsNoCase: {
        mime_type: [
          'application/onenote',
          'application/msonenote'
        ]
      },
      className: 'csui-icon mime_onenote',
      mimeType: lang.NodeTypeONE,
      sequence: 50
    },
    {
      // MS project
      equalsNoCase: {
        mime_type: [
          'application/vnd.ms-project',
          'application/msproj',
          'application/msproject',
          'application/x-msproject',
          'application/x-ms-project',
          'application/mpp'
        ]
      },
      className: 'csui-icon mime_project',
      mimeType: lang.NodeTypeMPP,
      sequence: 50
    },
    {
      // image
      startsWithNoCase: {mime_type: 'image/'},
      className: 'csui-icon mime_image',
      mimeType: lang.NodeTypeImage,
      sequence: 50
    },
    {
      // audio
      startsWithNoCase: {mime_type: 'audio/'},
      className: 'csui-icon mime_audio',
      mimeType: lang.NodeTypeAudio,
      sequence: 50
    },
    {
      // text
      startsWithNoCase: {mime_type: 'text/'},
      className: 'csui-icon mime_paper',
      mimeType: lang.NodeTypeText,
      sequence: 50
    },
    {
      // text
      equalsNoCase: {mime_type: 'text/html'},
      className: 'csui-icon mime_html',
      mimeType: lang.NodeTypeHtml,
      // startsWith 'text/' operation happens first, which would decide the icon otherwise;
      // it has the sequence number 50 in common
      // do not set sequence to 30 that would take over the 'type' that has this MIME type
      // and do not set to 50 because this object with this MIME type would have a different icon
      sequence: 40
    },
    {
      // video
      startsWithNoCase: {mime_type: 'video/'},
      className: 'csui-icon mime_video',
      mimeType: lang.NodeTypeVideo,
      sequence: 50
    },
    {
      // zip
      equalsNoCase: {
        mime_type: [
          'application/x-rar-compressed',
          'application/zip',
          'application/x-zip',
          'application/x-zip-compressed'
        ]
      },
      className: 'csui-icon mime_zip',
      mimeType: lang.NodeTypeCompressed,
      sequence: 50
    },
    {
      // compound document
      equals: {type: 136},
      className: 'csui-icon compound_document',
      sequence: 100
    },
    {
      // document
      equals: {type: 144},
      className: 'csui-icon mime_document',
      sequence: 100
    },
    {
      // CAD
      equals: {type: 736},
      className: 'csui-icon mime_drawing',
      sequence: 100
    },
    {
      // saved search query
      equals: {type: 258},
      className: 'csui-icon csui-icon-saved-search-query',
      mimeType: lang.NodeTypeSearchQuery,
      sequence: 100
    },
    {
      // URL link
      equals: {type: 140},
      className: 'csui-icon url1',
      mimeType: lang.NodeTypeURL,
      sequence: 100
    },
    {
      // shortcut
      equals: {type: 1},
      className: 'csui-icon shortcut1',
      sequence: 100
    },
    {
      // generation
      // note: since the RestAPI at the moment does not return the document version, showing the
      // latest document mime-type icon with the shortcut overlay is incorrect.  Use the
      // generation icon for now.  When the RestAPI and UI supports Generation, switch this to
      // generation-overlay.
      equals: {type: 2},
      className: 'csui-icon mime_generation',
      sequence: 100
    },
    {
      // category
      equals: {type: 131},
      className: 'csui-icon category1',
      sequence: 100
    },
    {
      // project
      equals: {type: 202},
      className: 'csui-icon csui-icon-project',
      sequence: 100
    },
    {
      // collection
      equals: {type: 298},
      className: 'csui-icon collection',
      sequence: 100
    },
    {
      equals: {type: 141},
      className: 'csui-icon csui-icon-enterprise-volume',
      sequence: 100
    },
    {
      equals: {type: 142},
      className: 'csui-icon csui-icon-personal-volume',
      sequence: 100
    },
    {
      equals: {type: 133},
      className: 'csui-icon csui-icon-category-volume',
      sequence: 100
    },
    {
      // Category Folder
      equals: {type: 132},
      className: 'csui-icon csui-icon-node-category-folder',
      sequence: 100
    },
    {
      // LiveReport
      equals: {type: 299},
      className: 'csui-icon csui-icon-node-livereport',
      sequence: 100
    },
    {
      // Milestone
      equals: {type: 212},
      className: 'csui-icon csui-icon-node-milestone',
      sequence: 100
    },
    {
      // Poll
      equals: {type: 218},
      className: 'csui-icon csui-icon-node-poll',
      sequence: 100
    },
    {
      // Prospector
      equals: {type: 384},
      className: 'csui-icon csui-icon-node-prospector',
      sequence: 100
    },
    {
      // Task
      equals: {type: 206},
      className: 'csui-icon csui-icon-node-task',
      sequence: 100
    },
    {
      // Task Group
      equals: {type: 205},
      className: 'csui-icon csui-icon-node-task-group',
      sequence: 100
    },
    {
      // Task List
      equals: {type: 204},
      className: 'csui-icon csui-icon-node-task-list',
      sequence: 100
    },
    {
      // Perspective Assets Folder
      equals: {type: 955},
      className: 'csui-icon csui-icon-perspective-assets-folder',
      sequence: 100
    },
    {
      // Perspective Assets Volume
      equals: {type: 954},
      className: 'csui-icon csui-icon-perspective-assets-volume',
      sequence: 100
    },
    {
      // Virtual Folder
      equals: {type: 899},
      className: 'csui-icon csui-icon-node-virtual-folder',
      sequence: 100
    },
    {
      // Custom View
      equals: {type: 146},
      className: 'csui-icon mime_custom_view',
      // Custom View has a MIME type, which would decide the icon otherwise;
      // the MIME type icons have the sequence number 50 in common
      sequence: 30
    },
    {
      // Workflow Step
      equals: {type: 153},
      className: 'csui-icon assignment-workflow',
      sequence: 100
    },
    {
      // Workflow Map
      equals: {type: 128},
      className: 'csui-icon mime_workflow_map',
      sequence: 100
    },
    {
      // Workflow Status
      equals: {type: 190},
      className: 'csui-icon mime_workflow_status',
      sequence: 100
    },
    {
      // Channel
      equals: {type: 207},
      className: 'csui-icon mime_channel',
      sequence: 100
    },
    {
      // News item
      equals: {type: 208},
      className: 'csui-icon mime_news',
      sequence: 100
    },
    {
      // Discussion
      equals: {type: 215},
      className: 'csui-icon mime_discussion',
      sequence: 100
    },
    {
      // XML DTD
      equals: {type: 335},
      className: 'csui-icon mime_xml_dtd',
      // XML DTD has a MIME type, which would decide the icon otherwise;
      // the MIME type icons have the sequence number 50 in common
      sequence: 30
    },
    {
      // form
      equals: {type: 223},
      className: 'csui-icon mime_form',
      sequence: 100
    },
    {
      // form template
      equals: {type: 230},
      className: 'csui-icon mime_form_template',
      sequence: 100
    },
    {
      // pulse comments
      equals: {type: 1281},
      className: 'csui-icon icon-pulse-comment',
      sequence: 100
    },
    {
      // wiki pages
      equals: {type: 5574},
      className: 'csui-icon mime_wiki_page',
      sequence: 10
    },
    // wikis
    {
      equals: {type: 5573},
      className: 'csui-icon mime_wiki',
      sequence: 10
    },
    {
      // default container
      equals: {container: 'nonselectable'},
      className: 'csui-icon mime_folder_nonselectable',
      sequence: 1000
    },
    {
      // default container; covers folder-like nodes too
      equals: {container: true},
      className: 'csui-icon mime_folder',
      sequence: 1000
    },
    {
      // default node
      className: 'csui-icon mime_document',
      sequence: 10000
    }
  ]);

  if (extraIcons) {
    nodeSprites.add(_.flatten(extraIcons, true));
  }

  return nodeSprites;

});

csui.define('csui/models/node.addable.type/server.adaptor.mixin',[
  'csui/lib/underscore', 'csui/utils/url', 'csui/models/node/node.model', 'csui/utils/nodesprites'
], function (_, Url, NodeModel, NodeSpriteCollection) {
  'use strict';

  var ServerAdaptorMixin = {
    mixin: function (prototype) {
      return _.extend(prototype, {
        makeServerAdaptor: function (options) {
          return this;
        },

        url: function () {
          return Url.combine(this.node.urlBase(), 'addablenodetypes');
        },

        parse: function (response, options) {
          // The server returns very inconvenient structure, where the types
          // have textual keys and no subtype numbers.  An array of object
          // literals describing the addable type is put together from the
          // number parsed out of the form URL (!) from the data object
          // and the name from the definition object.
          var data        = response.data,
            definitions = response.definitions;
          var self = this;
          return _.chain(data)
            .keys()
            .map(function (key) {
              var url        = data[key],
                definition = definitions[key];
              if (url && definition) {
                var match = url && /[?&]type=([^&]+)(?:&.*)?$/.exec(url);
                if (match) {
                  var subtype = parseInt(match[1], 10);
                  var type_name = NodeSpriteCollection.findTypeByNode(
                    new NodeModel({type: subtype, type_name: definition.name}));
                  return {
                    type: subtype,
                    type_name: type_name
                  };
                }
              }
            })
            .compact()
            .value();
        }

      });
    }
  };

  return ServerAdaptorMixin;
});

csui.define('csui/models/node/node.addable.type.collection',['csui/lib/underscore',
  'csui/lib/backbone',
  'csui/utils/url',
  'csui/models/node/node.model',
  'csui/models/mixins/node.resource/node.resource.mixin',
  'csui/models/node.addable.type/server.adaptor.mixin'
], function (_,
    Backbone,
    Url,
    NodeModel,
    NodeResourceMixin,
    ServerAdaptorMixin) {
  'use strict';

  var AddableTypeModel = Backbone.Model.extend({

    defaults: {
      type: null,
      type_name: null
    },

    idAttribute: 'type',

    constructor: function AddableTypeModel() {
      Backbone.Model.prototype.constructor.apply(this, arguments);
    }

  });

  var NodeAddableTypeCollection = Backbone.Collection.extend({

    model: AddableTypeModel,

    constructor: function NodeAddableTypeCollection(models, options) {
      NodeAddableTypeCollection.__super__.constructor.apply(this, arguments);

      this.makeNodeResource(options)
        .makeServerAdaptor(options);
    },

    clone: function () {
      return new this.constructor(this.models, {node: this.node});
    },

    isFetchable: function () {
      return this.node.isFetchable();
    }

  });

  NodeResourceMixin.mixin(NodeAddableTypeCollection.prototype);
  ServerAdaptorMixin.mixin(NodeAddableTypeCollection.prototype);

  return NodeAddableTypeCollection;

});

csui.define('csui/models/node.children2/server.adaptor.mixin',[
  'csui/lib/underscore', 'csui/utils/url',
  'csui/models/browsable/v1.request.mixin',
  'csui/models/browsable/v2.response.mixin'
], function (_, Url, BrowsableV1RequestMixin, BrowsableV2ResponseMixin) {
  'use strict';

  var ServerAdaptorMixin = {
    mixin: function (prototype) {
      BrowsableV2ResponseMixin.mixin(prototype);
      BrowsableV1RequestMixin.mixin(prototype);

      return _.extend(prototype, {
        makeServerAdaptor: function (options) {
          this.makeBrowsableV1Request(options)
              .makeBrowsableV2Response(options);
          return this;
        },

        url: function () {
          var apiUrl = new Url(this.node.connector.connection.url).getApiBase(2),
              url = Url.combine(apiUrl, 'nodes', this.node.get('id'), 'nodes'),
              query = Url.combineQueryString(
                  this.getBrowsableUrlQuery(),
                  this.getAdditionalResourcesUrlQuery(),
                  this.getResourceFieldsUrlQuery(),
                  this.getExpandableResourcesUrlQuery(),
                  this.getRequestedCommandsUrlQuery()
              );
          return Url.appendQuery(url, query);
        },

        parse: function (response, options) {
          this.parseBrowsedState(response, options);
          return this.parseBrowsedItems(response, options);
        }
      });
    }
  };

  return ServerAdaptorMixin;
});

csui.define('csui/models/node.children2/node.children2',[
  'module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/url', 'csui/models/node/node.model',
  'csui/models/mixins/node.resource/node.resource.mixin',
  'csui/models/browsable/browsable.mixin',
  'csui/models/mixins/v2.additional.resources/v2.additional.resources.mixin',
  'csui/models/mixins/v2.fields/v2.fields.mixin',
  'csui/models/mixins/v2.expandable/v2.expandable.mixin',
  'csui/models/mixins/v2.delayed.commandable/v2.delayed.commandable.mixin',
  'csui/models/node.children2/server.adaptor.mixin',
  'csui/models/utils/v1tov2', 'csui/utils/deepClone/deepClone'
], function (module, _, Backbone, Url, NodeModel, NodeResourceMixin,
    BrowsableMixin, AdditionalResourcesV2Mixin, FieldsV2Mixin,
    ExpandableV2Mixin, DelayedCommandableV2Mixin, ServerAdaptorMixin,
    v1tov2) {
  'use strict';

  var config = module.config();
  _.defaults(config, {
    defaultPageSize: 30
  });

  var NodeChildren2Collection = Backbone.Collection.extend({
    model: NodeModel,

    constructor: function NodeChildren2Collection(models, options) {
      options = _.defaults({}, options, {
        top: config.defaultPageSize
      }, options);

      Backbone.Collection.prototype.constructor.call(this, models, options);

      this.makeNodeResource(options)
          .makeBrowsable(options)
          .makeAdditionalResourcesV2Mixin(options)
          .makeFieldsV2(options)
          .makeExpandableV2(options)
          .makeDelayedCommandableV2(options)
          .makeServerAdaptor(options);
    },

    clone: function () {
      var clone = new this.constructor(this.models, {
        node: this.node,
        skip: this.skipCount,
        top: this.topCount,
        filter: _.deepClone(this.filters),
        orderBy: this.orderBy,
        fields: _.deepClone(this.fields),
        expand: _.deepClone(this.expand),
        includeResources: _.clone(this._additionalResources),
        commands: _.clone(this.commands),
        defaultActionCommands: _.clone(this.defaultActionCommands),
        delayRestCommands: this.delayRestCommands,
        autofetch: this.autofetch,
        autofetchEvent: this._autofetchEvent
      });
      clone.fetching = this.fetching;
      clone.fetched = this.fetched;
      clone.error = this.error;
      clone.actualSkipCount = this.actualSkipCount;
      clone.totalCount = this.totalCount;
      clone.filteredCount = this.filteredCount;
      return clone;
    },

    isFetchable: function () {
      return this.node.isFetchable();
    },

    getResourceScope: function () {
      return _.deepClone({
        fields: this.fields,
        expand: this.expand,
        includeResources: this._additionalResources,
        commands: this.commands,
        defaultActionCommands: this.defaultActionCommands
      });
    },

    setResourceScope: function (scope) {
      this.excludeResources();
      scope.includeResources && this.includeResources(scope.includeResources);
      this.resetFields();
      scope.fields && this.setFields(scope.fields);
      this.resetExpand();
      scope.expand && this.setExpand(scope.expand);
      this.resetCommands();
      scope.commands && this.setCommands(scope.commands);
      this.resetDefaultActionCommands();
      scope.defaultActionCommands && this.setDefaultActionCommands(scope.defaultActionCommands);
    }
  });

  BrowsableMixin.mixin(NodeChildren2Collection.prototype);
  AdditionalResourcesV2Mixin.mixin(NodeChildren2Collection.prototype);
  FieldsV2Mixin.mixin(NodeChildren2Collection.prototype);
  ExpandableV2Mixin.mixin(NodeChildren2Collection.prototype);
  DelayedCommandableV2Mixin.mixin(NodeChildren2Collection.prototype);
  NodeResourceMixin.mixin(NodeChildren2Collection.prototype);
  ServerAdaptorMixin.mixin(NodeChildren2Collection.prototype);

  // Provide compatibility with v1. Mostly, at least.
  var prototype = NodeChildren2Collection.prototype;

  var makeExpandableV2 = prototype.makeExpandableV2,
      setExpand = prototype.setExpand,
      resetExpand = prototype.resetExpand;
  prototype.makeExpandableV2 = function (options) {
    var expand = options && options.expand;
    if (Array.isArray(expand)) {
      options.expand = v1tov2.includeExpandsV1toV2(expand);
    }
    return makeExpandableV2.call(this, options);
  };

  prototype.setExpand = function (role, names) {
    if (!names) {
      role = v1tov2.includeExpandsV1toV2(role);
    }
    return setExpand.call(this, role, names);
  };

  prototype.resetExpand = function (role, names) {
    if (!names) {
      role = v1tov2.excludeExpandsV1toV2(role);
    }
    return resetExpand.call(this, role, names);
  };

  var makeCommandableV2 = prototype.makeCommandableV2;
  prototype.makeCommandableV2 = function (options) {
    makeCommandableV2.call(this, options);
    this.includeCommands = this.commands;
    return this;
  };

  return NodeChildren2Collection;
});

csui.define('csui/models/node.ancestors/server.adaptor.mixin',[
  'csui/lib/underscore', 'csui/models/ancestor', 'csui/utils/url'
], function (_, AncestorModel, Url) {
  'use strict';

  var ServerAdaptorMixin = {
    mixin: function (prototype) {
      return _.extend(prototype, {
        makeServerAdaptor: function (options) {
          return this;
        },

        url: function () {
          return Url.combine(this.node.urlBase(), "ancestors");
        },

        parse: function (response, options) {
          // TODO: Currently the breadcrumb parameters are set in the
          // constructor. Should this be moved to public methods like
          // ChildNodeCollection is controlled?  It would enable more
          // flexible usage of the model class and view changes.  The
          // server doesn't allow filtering, ordering or limiting of
          // the ancestor list.

          response = response.ancestors;

          if (this.options.stop) {
            var id = this.options.stop.get ? this.options.stop.get("id") :
              this.options.stop.id;
            var skip;
            response = _
              .filter(response.reverse(), function (ancestor) {
                var result = !skip;
                if (ancestor.id == id) {
                  skip = true;
                }
                return result;
              })
              .reverse();
          }

          if (this.options.limit && response.length > this.options.limit) {
            response.splice(0, response.length - this.options.limit);
            response.unshift({
              type: AncestorModel.Hidden
            });
          }

          // Help DefaultActionBehavior generate a link to open a node from
          // breadcrumb.  Ancestor items are not complete node infos, but
          // they have to be containers and setting {container:true} is enough
          // to render correct link to open the container.
          _.each(response, function (node) {
            node.container = true;
          });

          return response;
        }

      });
    }
  };

  return ServerAdaptorMixin;
});

csui.define('csui/models/nodeancestors',['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/utils/url', 'csui/utils/log', 'csui/models/ancestor',
  'csui/models/ancestors', 'csui/models/mixins/node.resource/node.resource.mixin',
  'csui/models/node.ancestors/server.adaptor.mixin'
], function (module, _, $, Backbone, Url, log, AncestorModel,
    AncestorCollection, NodeResourceMixin, ServerAdaptorMixin) {
  'use strict';

  var NodeAncestorCollection = AncestorCollection.extend({

    constructor: function NodeAncestorCollection(models, options) {
      AncestorCollection.prototype.constructor.apply(this, arguments);

      this.makeNodeResource(options)
        .makeServerAdaptor(options);

    },

    clone: function () {
      return new this.constructor(this.attributes, {
        connector: this.connector
      });
    },

    isFetchable: function () {
      return this.node.isFetchable();
    }

  });

  NodeResourceMixin.mixin(NodeAncestorCollection.prototype);
  ServerAdaptorMixin.mixin(NodeAncestorCollection.prototype);

  return NodeAncestorCollection;

});

csui.define('csui/models/nodechildrencolumn',['module', 'csui/lib/backbone', 'csui/utils/log',
  'i18n!csui/models/impl/nls/lang'
], function (module, Backbone, log, lang) {
  'use strict';

  //
  // Column model from the node children call (nodes/{id}/nodes)
  //
  var NodeChildrenColumnModel = Backbone.Model.extend({

    constructor: function NodeChildrenColumnModel(attributes, options) {
      if (attributes && !attributes.title) {
        var titleTranslated = lang[attributes.column_key];
        if (titleTranslated !== undefined) {
          attributes.title = titleTranslated;
        }
      }
      Backbone.Model.prototype.constructor.call(this, attributes, options);
    },

    idAttribute: null

  });

  return NodeChildrenColumnModel;

});

csui.define('csui/models/nodechildrencolumns',["module", "csui/lib/underscore", "csui/lib/backbone",
  "csui/utils/log", "csui/models/nodechildrencolumn"
], function (module, _, Backbone,
             log, NodeChildrenColumnModel) {
  "use strict";

  //
  // Column model collection from the node children call (nodes/{id}/nodes) and other browse calls
  //
  var NodeChildrenColumnCollection = Backbone.Collection.extend({

    model: NodeChildrenColumnModel,

    constructor: function NodeChildrenColumnCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
      this.fetched = false;
    },

    // private: reset the collection.  For performance purpose and prevent UI table redraw, this
    //          method will not reset if the models is the same as the cached one.
    resetCollection: function (models, options) {
      if (this.cachedColumns && _.isEqual(models, this.cachedColumns)) {
        return;
      }
      // Make a clone of the model array for the cache to let it be equal even if attributes are
      // added to objects of the array (which is done in this.reset where the constructor of the
      // NodeChildrenColumnModel adds a translated title attribute
      this.cachedColumns = _.map(models, function (model) {
        return _.clone(model);
      });

      this.reset(models, options);
      this.fetched = true;
    },

    // private
    getColumnModels: function (columnKeys, definitions) {
      var columns = _.reduce(columnKeys, function (colArray, column) {
        if (column.indexOf('_formatted') >= 0) {
          var shortColumnName = column.replace(/_formatted$/, '');
          if (definitions[shortColumnName]) {
            // there is also the column without the trailing _formatted: skip this and use this
            // instead
            return colArray;
          }
        } else {
          // copy the definitions_order from the *_formatted column to the non-formatted column
          var definition_short = definitions[column];
          if (definition_short && !definition_short.definitions_order) {
            var definition_formatted = definitions[column + '_formatted'];
            if (definition_formatted && definition_formatted.definitions_order) {
              definition_short.definitions_order = definition_formatted.definitions_order;
            }
          }
        }
        var definition = definitions[column];

        // Code from old code to keep node table code working.  Will look more into this after June.
        // TODO: support these attributes on the server too.
        switch (column) {
          case "name":
            definition = _.extend(definition, {
              default_action: true,
              contextual_menu: false,
              editable: true,
              filter_key: "name"
            });
            break;
          case "type":
            definition = _.extend(definition, {
              default_action: true
            });
            break;
          case "modify_date":
            definition = _.extend(definition, {
              initialSortingDescending: true
            });
            break;
        }

        colArray.push(_.extend({column_key: column}, definition));
        return colArray;
      }, []);
      return columns;
    },

    //
    // methods for REST API V1
    //

    // public
    resetColumns: function (response, options) {
      this.resetCollection(this.getV1Columns(response, options), options);
    },

    // private
    getV1Columns: function (response, options) {
      var definitions = response.definitions,
        columnKeys = options && options.columnsFromDefinitionsOrder ?
          response.definitions_order : _.keys(definitions);

      // merge definitions_order into definitions as definitions_order attribute
      if (response.definitions_order) {
        for (var idx = 0; idx < response.definitions_order.length; idx++) {
          var column_key = response.definitions_order[idx],
              definition = definitions[column_key];
          // definitions_order can be passed via options and does not need
          // to match with the server response; guard against mismatches
          if (definition) {
            definition.definitions_order = 500 + idx;
          }
        }
      }

      return this.getColumnModels(columnKeys, definitions);
    },

    //
    // methods for REST API V2
    //

    // public
    resetColumnsV2: function (response, options) {
      this.resetCollection(this.getV2Columns(response), options);
    },

    // private: convert v2 'metadata' to v1 'definitions' for backward code compatibility and
    //          reuse purpose
    getV2Columns: function (response) {

      // Note: from a long discussion with the server developer, use the common 'metadata' (or
      // called 'definitions' in v1) in the first element. Elements in the collection can have
      // different extended metadata (definitions).  If a business case arises that
      // extended definitions are needed, will discuss again with them and add that support.

      var definitions = (response.results &&
        response.results[0] &&
        response.results[0].metadata &&
        response.results[0].metadata.properties) || {};

      // For v2 calls, the 'size' column is not available.  Either the 'container_size' or
      // 'file_size' is available.  Create a 'size' definition here for compatibility with existing
      // code.
      if (!definitions.size &&
        (definitions.container_size ||
        (definitions.versions && definitions.versions.file_size))) {
        definitions.size = definitions.container_size || definitions.versions.file_size;
        definitions.size.align = 'right';
        definitions.size.key = 'size';
        definitions.size.name = 'Size';
      }

      var columnKeys = _.keys(definitions);

      return this.getColumnModels(columnKeys, definitions);
    }

  });
  NodeChildrenColumnCollection.version = '1.0';

  return NodeChildrenColumnCollection;

});

csui.define('csui/models/nodes',["module", "csui/lib/backbone", 'csui/models/node/node.model', "csui/utils/log",
  'csui/models/mixins/v2.delayed.commandable/v2.delayed.commandable.mixin'
], function (module, Backbone, NodeModel, log, DelayedCommandableV2Mixin) {

  var Nodes = Backbone.Collection.extend({

    model: NodeModel,

    constructor: function Nodes(models,options) {
      options || (options = {});
      Backbone.Collection.prototype.constructor.apply(this, arguments);
      this.makeDelayedCommandableV2(options);
    },

    automateFetch: function (enable) {
    }

  });
  DelayedCommandableV2Mixin.mixin(Nodes.prototype);
  Nodes.version = '1.0';

  return Nodes;

});

csui.define('csui/models/mixins/commandable/commandable.mixin',['csui/lib/underscore'], function (_) {
  'use strict';

  var CommandableV1Mixin = {

    mixin: function (prototype) {
      return _.extend(prototype, {

        makeCommandable: function (options) {
          var commands = options && options.commands;
          if (typeof commands === 'string') {
            commands = commands.split(',');
          }
          this.includeCommands = commands || [];
          return this;
        },

        setCommands: function (name) {
          if (!_.isArray(name)) {
            name = name.split(",");
          }
          _.each(name, function (name) {
            if (!_.contains(this.includeCommands, name)) {
              this.includeCommands.push(name);
            }
          }, this);
        },

        resetCommands: function (name) {
          if (name) {
            if (!_.isArray(name)) {
              name = name.split(",");
            }
            _.each(name, function (name) {
              var index = _.indexOf(this.includeCommands, name);
              if (index >= 0) {
                this.includeCommands.splice(index, 1);
              }
            }, this);
          } else {
            this.includeCommands.splice(0, this.includeCommands.length);
          }
        },

        getRequestedCommandsUrlQuery: function () {
          return this.includeCommands.length && {commands: this.includeCommands};
        }

      });
    }

  };

  return CommandableV1Mixin;

});

csui.define('csui/models/mixins/delayed.commandable/delayed.commandable.mixin',[
  'csui/lib/underscore', 'csui/lib/backbone', 'csui/models/node.actions',
  'csui/models/mixins/commandable/commandable.mixin',
  'csui/utils/deepClone/deepClone'
], function (_, Backbone, NodeActionCollection, CommandableMixin) {
  'use strict';

  var DelayedCommandableMixin = {

    mixin: function (prototype) {
      CommandableMixin.mixin(prototype);

      var originalPrepareModel = prototype._prepareModel;

      return _.extend(prototype, {

        makeDelayedCommandable: function (options) {
          options || (options = {});
          var defaultActionCommands = options.defaultActionCommands;
          if (typeof defaultActionCommands === 'string') {
            defaultActionCommands = defaultActionCommands.split(',');
          }
          this.defaultActionCommands = defaultActionCommands || [];

          this.delayedActions = new NodeActionCollection(undefined, {
            connector: options.connector
          });

          this.delayRestCommands = options.delayRestCommands;
          if (this.delayRestCommands) {
            this.on('sync', this._requestRestActions);
          }

          this.delayRestCommandsForModels = options.delayRestCommandsForModels;

          return this.makeCommandable(options);
        },

        _requestRestActions: function (model) {
          // Guard against propagated sync event: if this mixin has been
          // applied to a collection, only fetch of the collection should
          // be handled here; fetching of models should not re-fetch actions
          // for the whole collection.
          // Also do nothing if the collection is empty.
          if (model !== this ||
              this instanceof Backbone.Collection && !this.length) {
            return;
          }
          var defaultActionCommands = this.defaultActionCommands,
              restCommands = _.reject(this.includeCommands, function (command) {
                return _.contains(defaultActionCommands, command);
              });
          if (restCommands.length) {
            var delayedActions = this.delayedActions;
            delayedActions.resetCommands();
            delayedActions.setCommands(restCommands);
            delayedActions.resetNodes();
            if (this instanceof Backbone.Collection) {
              delayedActions.setNodes(this.pluck('id'));
            } else {
              delayedActions.setNodes([this.get('id')]);
            }
            if (!delayedActions.connector) {
              this.connector.assignTo(delayedActions);
            }
            delayedActions.parent_id = !!this.node ? this.node.get("id") : this.get("id");
            delayedActions
                .fetch({
                  reset: true,
                  // Update the actions as soon as possible; event
                  // and promise can be watched by someone else
                  success: _.bind(this._updateOriginalActions, this)
                });
          }
        },

        _updateOriginalActions: function () {
          var delayedActions = this.delayedActions;

          function updateNodeActions(node) {
            var actionNode = delayedActions.get(node.get('id'));
            if (actionNode) {
              node.actions.add(actionNode.actions.models);
            }
          }

          if (this instanceof Backbone.Collection) {
            this.each(updateNodeActions);
          } else {
            updateNodeActions(this);
          }
        },

        setDefaultActionCommands: function (name) {
          if (!_.isArray(name)) {
            name = name.split(',');
          }
          _.each(name, function (name) {
            if (!_.contains(this.defaultActionCommands, name)) {
              this.defaultActionCommands.push(name);
            }
          }, this);
        },

        resetDefaultActionCommands: function (name) {
          if (name) {
            if (!_.isArray(name)) {
              name = name.split(',');
            }
            _.each(name, function (name) {
              var index = _.indexOf(this.defaultActionCommands, name);
              if (index >= 0) {
                this.defaultActionCommands.splice(index, 1);
              }
            }, this);
          } else {
            this.defaultActionCommands.splice(0, this.defaultActionCommands.length);
          }
        },

        getRequestedCommandsUrlQuery: function () {
          var commands = this.delayRestCommands ?
                         this.defaultActionCommands : this.includeCommands;
          return commands.length && {commands: commands};
        },

        getAllCommandsUrlQuery: function () {
          var commands = this.includeCommands;
          return commands.length && {commands: commands};
        },

        // Stop the delayed action enabling for child models and collections.
        // If they want it, they can do so in the constructors, which creates
        // them. Immediate child models of this collection can be enabled by
        // the delayRestCommandsForModels option.
        _prepareModel: function (attrs, options) {
          var delayRestCommands, delayRestCommandsForModels;
          options || (options = {});
          // If the collection is populated after the constructor has
          // finished, we can use parameters passed to the constructor
          // as defaults, if the population options are empty.
          if (this.delayedActions) {
            delayRestCommands = options.delayRestCommands;
            if (delayRestCommands === undefined) {
              delayRestCommands = this.delayRestCommands;
            }
            delayRestCommandsForModels = options.delayRestCommandsForModels;
            if (delayRestCommandsForModels === undefined) {
              delayRestCommandsForModels = this.delayRestCommandsForModels;
            }
          } else {
            delayRestCommands = options.delayRestCommands;
            delayRestCommandsForModels = options.delayRestCommandsForModels;
          }
          options.delayRestCommands = delayRestCommandsForModels;
          options.delayRestCommandsForModels = false;
          var model = originalPrepareModel.call(this, attrs, options);
          options.delayRestCommands = delayRestCommands;
          options.delayRestCommandsForModels = delayRestCommandsForModels;
          return model;
        }

      });
    }

  };

  return DelayedCommandableMixin;

});

csui.define('csui/models/browsable/v1.response.mixin',['csui/lib/underscore'
], function (_) {

  var BrowsableV1ResponseMixin = {

    mixin: function (prototype) {
      return _.extend(prototype, {

        makeBrowsableV1Response: function (options) {
          return this;
        },

        parseBrowsedState: function (response, options) {
          // FIXME: Confirm sorting and filtering parameters too.
          if (response.page) {
            this.actualSkipCount = (response.page - 1) * (response.limit || 0);
          }
          var totalCount = response.total_count ? response.total_count : 0;
          this.totalCount = totalCount;
          this.filteredCount = response.filtered_count || totalCount;
        },

        parseBrowsedItems: function (response, options) {
          return response.data;
        }

      });
    }

  };

  return BrowsableV1ResponseMixin;

});

csui.define('csui/models/node.children/server.adaptor.mixin',[
  'csui/lib/underscore', 'csui/utils/url',
  'csui/models/browsable/v1.request.mixin',
  'csui/models/browsable/v1.response.mixin'
], function (_, Url, BrowsableV1RequestMixin, BrowsableV1ResponseMixin) {
  'use strict';

  var ServerAdaptorMixin = {
    mixin: function (prototype) {
      BrowsableV1ResponseMixin.mixin(prototype);
      BrowsableV1RequestMixin.mixin(prototype);

      return _.extend(prototype, {
        makeServerAdaptor: function (options) {
          this.makeBrowsableV1Request(options)
              .makeBrowsableV1Response(options);
          return this;
        },

        url: function () {
          var includeActions = !!this.includeActions,
              query = Url.combineQueryString({
                // Do not request the v1 actions, which are sent by default
                extra: includeActions,
                actions: includeActions
              },
              this.getBrowsableUrlQuery(),
              this.getExpandableResourcesUrlQuery(),
              this.getRequestedCommandsUrlQuery()
          );
          return Url.combine(this.node.urlBase(),
              query ? '/nodes?' + query : '/nodes');
        },

        // TODO: Remove this method and make the cache layer aware of node URLs.
        urlCacheBase: function(){
          return Url.combine(this.node.urlBase(),'/nodes?');
        },

        parse: function (response, options) {
          this.parseBrowsedState(response, options);
          this.columns && this.columns.resetColumns(response, this.options);
          return this.parseBrowsedItems(response, options);
        }
      });
    }
  };

  return ServerAdaptorMixin;
});

csui.define('csui/models/nodechildren',[
  'module', 'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/url', 'csui/models/node/node.model', 'csui/models/nodes',
  'csui/models/nodechildrencolumns',
  'csui/models/mixins/node.resource/node.resource.mixin',
  'csui/models/mixins/expandable/expandable.mixin',
  'csui/models/browsable/browsable.mixin',
  'csui/models/mixins/delayed.commandable/delayed.commandable.mixin',
  'csui/models/node.children/server.adaptor.mixin',
  'csui/utils/log', 'csui/utils/deepClone/deepClone'
], function (module, $, _, Backbone, Url, NodeModel, NodeCollection,
    NodeChildrenColumnCollection, NodeResourceMixin, ExpandableMixin,
    BrowsableMixin, DelayedCommandableMixin, ServerAdaptorMixin, log) {
  'use strict';

  var config = module.config();
  _.defaults(config, {
    defaultPageSize: 30
  });

  log = log(module.id);

  var NodeChildrenCollection = NodeCollection.extend({

    constructor: function NodeChildrenCollection(models, options) {
      options = _.defaults({}, options, {
        top: config.defaultPageSize,
        columnsFromDefinitionsOrder: false
      }, options);

      NodeCollection.prototype.constructor.call(this, models, options);

      this.makeNodeResource(options)
          .makeExpandable(options)
          .makeDelayedCommandable(options)
          .makeBrowsable(options)
          .makeServerAdaptor(options);

      this.options = options;
      this.includeActions = options.includeActions;
      this.columns = new NodeChildrenColumnCollection();
    },

    clone: function () {
      return new this.constructor(this.models, {
        node: this.node,
        skip: this.skipCount,
        top: this.topCount,
        filter: _.deepClone(this.filters),
        orderBy: this.orderBy,
        expand: _.clone(this.expand),
        includeActions: this.includeActions,
        commands: _.clone(this.includeCommands),
        defaultActionCommands: _.clone(this.defaultActionCommands),
        delayRestCommands: this.delayRestCommands
      });
    },

    isFetchable: function () {
      return this.node.isFetchable();
    }
  });

  BrowsableMixin.mixin(NodeChildrenCollection.prototype);
  ExpandableMixin.mixin(NodeChildrenCollection.prototype);
  DelayedCommandableMixin.mixin(NodeChildrenCollection.prototype);
  ServerAdaptorMixin.mixin(NodeChildrenCollection.prototype);
  NodeResourceMixin.mixin(NodeChildrenCollection.prototype);

  // TODO: Remove this, as soon as all abandoned this.Fetchable.
  var originalFetch = NodeChildrenCollection.prototype.fetch;
  NodeChildrenCollection.prototype.Fetchable = {
    fetch: function (options) {
      // log.warn('Using this.Fetchable.fetch has been deprecated.  ' +
      //          'Use NodeChildrenCollection.prototype.fetch. ' +
      //          'this.Fetchable is going to be removed.') && console.warn(log.last);
      // log.warn('Occurred ' + log.getStackTrace(2)) && console.warn(log.last);
      return originalFetch.call(this, options);
    }
  };

  return NodeChildrenCollection;
});

csui.define('csui/models/tool.item.config/tool.item.config.collection',[
  'module', 'require', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/backbone'
], function (module, require, _, $, Backbone) {
  'use strict';

  var configs = module.config().configs || [];
  // Support either array of module IDs or a map with keys pointing
  // to arrays of module IDs; the latter can be used for decentralized
  // configuration (multiple calls to require.config, which merge maps,
  // but not arrays)
  if (!Array.isArray(configs)) {
    configs = Object
        .keys(configs)
        .reduce(function (result, key) {
          return result.concat(configs[key]);
        }, []);
  }
  // Convert the array of tool item config module names to model attributes
  configs = configs.map(function (name) {
    return {
      id: name
    };
  });

  var ToolItemConfigCollection = Backbone.Collection.extend({

    constructor: function ToolItemConfigCollection(models, options) {
      models || (models = configs);
      Backbone.Collection.prototype.constructor.call(this, models, options);
     },

    sync: function (method, collection, options) {
      if (method !== 'read') {
        throw new Error('Only fetching tool item configurations is supported.');
      }
      var self = this;
      options = _.extend({}, this.options, options);
      return this._resolveConfigs(options)
                 .then(function () {
                   var response = self.toJSON();
                   options.success && options.success(response, options);
                   self.trigger('sync', self, response, options);
                 });
    },

    _resolveConfigs: function (options) {
      var modules = this.chain()
                        .filter(function (model) {
                          // A resolvable config must have an ID
                          // and not be already resolved
                          return model.has('id') &&
                                 !(model.has('config') ||
                                   model.has('error'));
                        })
                        .pluck('id')
                        .value(),
          deferred = $.Deferred(),
          self = this;
      if (modules.length) {
        require(modules, function () {
          var configs = arguments;
          modules.forEach(function (module, index) {
            var model = self.get(module);
            model.set('config', configs[index]);
          });
          deferred.resolve();
        }, function (error) {
          self.forEach(function (module) {
            module.set('error', error);
          });
          if (options.ignoreErrors) {
            deferred.resolve();
          } else {
            deferred.reject(error);
          }
        });
      } else {
        deferred.resolve();
      }
      return deferred.promise();
    }

  });

  return ToolItemConfigCollection;

});

csui.define('csui/models/tool.item.mask/tool.item.mask.collection',[
  'module', 'require', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/backbone'
], function (module, require, _, $, Backbone) {
  'use strict';

  var masks = module.config().masks || [];
  // Support either array of module IDs or a map with keys pointing
  // to arrays of module IDs; the latter can be used for decentralized
  // configuration (multiple calls to require.config, which merge maps,
  // but not arrays)
  if (!Array.isArray(masks)) {
    masks = Object
        .keys(masks)
        .reduce(function (result, key) {
          return result.concat(masks[key]);
        }, []);
  }
  // Convert the array of tool item mask module names to model attributes
  masks = masks.map(function (name) {
    return {
      id: name
    };
  });

  var ToolItemMaskCollection = Backbone.Collection.extend({

    constructor: function ToolItemMaskCollection(models, options) {
      models || (models = masks);
      Backbone.Collection.prototype.constructor.call(this, models, options);
    },

    sync: function (method, collection, options) {
      if (method !== 'read') {
        throw new Error('Only fetching tool item masks is supported.');
      }
      var self = this;
      options = _.extend({}, this.options, options);
      return this._resolveMasks(options)
                 .then(function () {
                   var response = self.toJSON();
                   options.success && options.success(response, options);
                   self.trigger('sync', self, response, options);
                 });
    },

    _resolveMasks: function (options) {
      var modules = this.chain()
                        .filter(function (model) {
                          // A resolvable mask must have an ID
                          // and not be already resolved
                          return model.has('id') &&
                                 !(model.has('mask') ||
                                   model.has('error'));
                        })
                        .pluck('id')
                        .value(),
          deferred = $.Deferred(),
          self = this;
      if (modules.length) {
        require(modules, function () {
          var masks = arguments;
          modules.forEach(function (module, index) {
            var model = self.get(module);
            model.set('mask', masks[index]);
          });
          deferred.resolve();
        }, function (error) {
          self.forEach(function (module) {
            module.set('error', error);
          });
          if (options.ignoreErrors) {
            deferred.resolve();
          } else {
            deferred.reject(error);
          }
        });
      } else {
        deferred.resolve();
      }
      return deferred.promise();
    }

  });

  return ToolItemMaskCollection;

});

csui.define('csui/models/server.module/server.module.collection',['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone'
], function (module, _, $, Backbone) {
  'use strict';

  // Map with ids as keys and attributes as values
  var sourceModules = module.config().modules || {},
  // Convert the configuration map to an array of model attributes
      serverModules = _.map(sourceModules, function (attributes, id) {
        attributes.id = id;
        return attributes;
      });

  var ServerModuleModel = Backbone.Model.extend({

    defaults: {
      id: null,   // Require.js module prefix used by the server module
      title: null // Displayable title of the server module
    },

    constructor: function ServerModuleModel(attributes, options) {
      ServerModuleModel.__super__.constructor.apply(this, arguments);
    }

  });

  var ServerModuleCollection = Backbone.Collection.extend({

    model: ServerModuleModel,

    constructor: function ServerModuleCollection(models, options) {
      models || (models = serverModules);
      ServerModuleCollection.__super__.constructor.call(this, models, options);
    },

    sync: function (method, collection, options) {
      if (method !== 'read') {
        throw new Error('Only fetching the server modules is supported.');
      }
      var self = this;
      options || (options = {});
      return this._resolveServerModules()
          .then(function () {
            var response = self.toJSON();
            options.success && options.success(response, options);
            self.trigger('sync', self, response, options);
          });
    },

    _resolveServerModules: function (options) {
      options = _.extend({}, this.options, options);
      var deferred = $.Deferred(),
          missing = this.find(function (serverModule) {
            var sourceModule = sourceModules[serverModule.id];
            if (sourceModule) {
              serverModule.set(sourceModule.attributes);
            } else {
              if (!options.ignoreErrors) {
                return true;
              }
            }
          });
      if (missing) {
        var error = new Error('Invalid module prefix: ' + missing.id);
        return deferred.reject(error);
      }
      return deferred.resolve().promise();
    }

  });

  return ServerModuleCollection;

});

csui.define('csui/models/specificnodemodel',['csui/lib/underscore', 'csui/lib/backbone', 'csui/utils/url',
  'csui/models/mixins/node.resource/node.resource.mixin'
], function (_, Backbone, Url, NodeResourceMixin) {
  'use strict';

  var SpecificNodeModel = Backbone.Model.extend({

    constructor: function SpecificNodeModel(attributes, options) {
      this.options = options || (options = {});
      Backbone.Model.prototype.constructor.call(this, arguments);
      this.makeNodeResource(options);
    },

    parse: function (response) {
      return response;
    },

    url: function () {

      var node   = this.options.node,
          nodeId = node.get('id'),
          url;
      url = _.str.sformat('forms/nodes/properties/specific?id={0}',
          nodeId);

      return Url.combine(this.options.connector.connection.url, url);

    }

  });

  NodeResourceMixin.mixin(SpecificNodeModel.prototype);

  return SpecificNodeModel;

});

csui.define('csui/models/autofetchable',['module', 'csui/lib/underscore', 'csui/utils/log'
], function (module, _, log) {
  'use strict';

  log = log(module.id);

  function AutoFetchableModel(ParentModel) {
    var prototype = {

      makeAutoFetchable: function (options) {
        // log.warn('Module "csui/models/autofetchable" has been deprecated and' +
        //          ' is going to be removed.' +
        //          '  Use "csui/models/mixins/autofetchable/autofetchable.mixin" instead.')
        // && console.warn(log.last);
        // log.warn('Occurred ' + log.getStackTrace(2)) && console.warn(log.last);
        options && options.autofetch && this.automateFetch(options.autofetch);
        return this;
      },

      automateFetch: function (enable) {
        this[enable ? 'on' : 'off'](_.result(this, '_autofetchEvent'),
          _.bind(this._fetchAutomatically, this, enable));
      },

      isFetchable: function () {
        return !!this.get('id');
      },

      _autofetchEvent: 'change:id',

      _fetchAutomatically: function (enableOptions, model, value, options) {
        if (this.isFetchable()) {
         var fullOptions = _.extend({}, enableOptions, options);
        this.fetch(fullOptions);
        }
      }

    };
    prototype.AutoFetchable = _.clone(prototype);
    
    return prototype;
  }

  return AutoFetchableModel;

});

csui.define('csui/models/connectable',['module', 'csui/lib/underscore', 'csui/utils/log'
], function (module, _, log) {
  'use strict';

  log = log(module.id);

  function ConnectableModel(ParentModel) {
    var prototype = {

      makeConnectable: function (options) {
        // log.warn('Module "csui/models/connectable" has been deprecated and' +
        //          ' is going to be removed.' +
        //          '  Use "csui/models/mixins/connectable/connectable.mixin" instead.')
        // && console.warn(log.last);
        // log.warn('Occurred ' + log.getStackTrace(2)) && console.warn(log.last);
        options && options.connector && options.connector.assignTo(this);
        options && options.connector && this.original && options.connector.assignTo(this.original);
        return this;
      },

      _prepareModel: function (attrs, options) {
        options || (options = {});
        options.connector = this.connector;
        return ParentModel.prototype._prepareModel.call(this, attrs, options);
      }

    };
    prototype.Connectable = _.clone(prototype);

    return prototype;
  }

  return ConnectableModel;

});

csui.define('csui/models/fetchable',['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/log'
], function (module, _, $, log) {
  'use strict';

  log = log(module.id);

  function FetchableModel(ParentModel) {
    var prototype = {

      makeFetchable: function (options) {
        // log.warn('Module "csui/models/fetchable" has been deprecated and' +
        //          ' is going to be removed.' +
        //          '  Use "csui/models/mixins/fetchable/fetchable.mixin" instead.')
        // && console.warn(log.last);
        // log.warn('Occurred ' + log.getStackTrace(2)) && console.warn(log.last);
        this.autoreset = options && options.autoreset;
        // Workaround for change/add/reset events, which are fired before
        // the caller is informed by sync that fetch successed.
        return this.on('reset', this._beforeFetchSucceeded, this)
            .on('add', this._beforeFetchSucceeded, this)
            .on('change', this._beforeFetchSucceeded, this);
      },

      _beforeFetchSucceeded: function () {
        this.fetching && this._fetchSucceeded();
      },

      _fetchSucceeded: function () {
        this.fetching = false;
        this.fetched = true;
      },

      _fetchFailed: function () {
        this.fetching = false;
      },

      fetch: function (options) {
        if (!this.fetching) {
          this.fetched = false;
          log.debug('Fetching is starting for {0} ({1}).',
              log.getObjectName(this), this.cid) && console.log(log.last);
          options = this._prepareFetch(options);
          // Ensure that the model is marked fetched before other events are
          // triggered.  If fetching is not silent, change/add/reset will be
          // triggered earlier: change/add/reset, options.*, sync, promise.
          var self = this,
              success = options.success,
              error = options.error;
          options.success = function () {
            log.debug('Fetching succeeded for {0} ({1}).',
                log.getObjectName(self), self.cid) && console.log(log.last);
            self._fetchSucceeded();
            success && success.apply(this, arguments);
          };
          options.error = function () {
            log.debug('Fetching failed for {0} ({1}).',
                log.getObjectName(self), self.cid) && console.log(log.last);
            self._fetchFailed();
            error && error.apply(this, arguments);
          };
          this.fetching = ParentModel.prototype.fetch.call(this, options);
        } else {
          log.debug('Fetching is in progress for {0} ({1}).',
              log.getObjectName(this), this.cid) && console.log(log.last);
        }
        return this.fetching;
      },

      _prepareFetch: function (options) {
        // Trigger just one item adding operation after fetching if wanted.
        options || (options = {});
        options.reset === undefined && this.autoreset && (options.reset = true);
        return options;
      },

      ensureFetched: function (options) {
        if (this.fetched) {
          log.debug('No need to fetch {0} ({1}).',
              log.getObjectName(this), this.cid) && console.log(log.last);
          if (options && options.success) {
            options.success(this);
          }
          return $.Deferred()
              .resolve(this, {}, options)
              .promise();
        }
        return this.fetch(options);
      }

    };
    prototype.Fetchable = _.clone(prototype);

    return prototype;
  }

  return FetchableModel;

});

csui.define('csui/models/including.additional.resources',['module', 'csui/lib/underscore', 'csui/utils/log'
], function (module, _, log) {
  'use strict';

  log = log(module.id);

  function IncludingAdditionalResources(ParentModel) {
    var prototype = {

      makeIncludingAdditionalResources: function (options) {
        // log.warn('Module "csui/models/including.additional.resources" has been deprecated and' +
        //          ' is going to be removed.' +
        //          '  Use "csui/models/mixins/including.additional.resources/including.additional.resources.mixin" instead.')
        // && console.warn(log.last);
        // log.warn('Occurred ' + log.getStackTrace(2)) && console.warn(log.last);
        this._additionalResources = [];
        if (options && options.includeResources) {
          this.includeResources(options.includeResources);
        }
        return this;
      },

      includeResources: function (names) {
        if (!_.isArray(names)) {
          names = names.split(',');
        }
        this._additionalResources = _.union(this._additionalResources, names);
      },

      excludeResources: function (names) {
        if (names) {
          if (!_.isArray(names)) {
            names = names.split(',');
          }
          this._additionalResources = _.reject(this._additionalResources, names);
        } else {
          this._additionalResources = [];
        }
      },

      getAdditionalResourcesUrlQuery: function () {
        return _.reduce(this._additionalResources, function (result, parameter) {
          result[parameter] = 'true';
          return result;
        }, {});
      }

    };
    prototype.IncludingAdditionalResources = _.clone(prototype);

    return prototype;
  }

  return IncludingAdditionalResources;

});

csui.define('csui/models/nodeautofetchable',['module', 'csui/lib/underscore', 'csui/utils/log'
], function (module, _, log) {
  'use strict';

  log = log(module.id);

  function NodeAutoFetchableModel(ParentModel) {
    var prototype = {

      makeNodeAutoFetchable: function (options) {
        // log.warn('Module "csui/models/fetchable" has been deprecated and' +
        //          ' is going to be removed.' +
        //          '  Use "csui/models/mixins/fetchable/fetchable.mixin" instead.')
        // && console.warn(log.last);
        // log.warn('Occurred ' + log.getStackTrace(2)) && console.warn(log.last);
        options && options.autofetch && this.automateFetch(options.autofetch);
        return this;
      },

      automateFetch: function (enable) {
        this.node[enable ? 'on' : 'off'](_.result(this, '_autofetchEvent'),
          _.bind(this._fetchAutomatically, this, enable));
      },

      isFetchable: function () {
        return this.node.isFetchableDirectly();
      },

      _autofetchEvent: 'change:id',

      _fetchAutomatically: function (options) {
        this.isFetchable() && this.fetch(_.isObject(options) && options);
      }

    };
    prototype.NodeAutoFetchable = _.clone(prototype);
    
    return prototype;
  }

  return NodeAutoFetchableModel;

});

csui.define('csui/models/nodeconnectable',['module', 'csui/lib/underscore', 'csui/utils/log'
], function (module, _, log) {
  'use strict';

  log = log(module.id);

  function NodeConnectableModel(ParentModel) {
    var prototype = {

      makeNodeConnectable: function (options) {
        // log.warn('Module "csui/models/connectable" has been deprecated and' +
        //          ' is going to be removed.' +
        //          '  Use "csui/models/mixins/connectable/connectable.mixin" instead.')
        // && console.warn(log.last);
        // log.warn('Occurred ' + log.getStackTrace(2)) && console.warn(log.last);
        if (options && options.node) {
          this.node = options.node;
          options.node.connector && options.node.connector.assignTo(this);
        }
        return this;
      },

      _prepareModel: function (attrs, options) {
        options.connector = this.node && this.node.connector;
        return ParentModel.prototype._prepareModel.call(this, attrs, options);
      }

    };
    prototype.NodeConnectable = _.clone(prototype);
    
    return prototype;
  }

  return NodeConnectableModel;

});

csui.define('csui/models/noderesource',['module', 'csui/lib/underscore', 'csui/utils/log',
  'csui/models/nodeconnectable', 'csui/models/fetchable',
  'csui/models/nodeautofetchable'
], function (module, _, log, NodeConnectableModel, FetchableModel,
    NodeAutoFetchableModel) {
  'use strict';

  log = log(module.id);

  function NodeResourceModel(ParentModel) {
    var prototype = {

      makeNodeResource: function (options) {
        // log.warn('Module "csui/models/noderesource" has been deprecated and' +
        //          ' is going to be removed.' +
        //          '  Use "csui/models/mixins/node.resource/node.resource.mixin" instead.')
        // && console.warn(log.last);
        // log.warn('Occurred ' + log.getStackTrace(2)) && console.warn(log.last);
        return this.makeNodeConnectable(options)
            .makeFetchable(options)
            .makeNodeAutoFetchable(options);
      }

    };
    prototype.NodeResource = _.clone(prototype);

    return _.extend({},
        NodeConnectableModel(ParentModel),
        FetchableModel(ParentModel),
        NodeAutoFetchableModel(ParentModel),
        prototype);
  }

  return NodeResourceModel;

});

csui.define('csui/models/resource',['module', 'csui/lib/underscore', 'csui/utils/log',
  'csui/models/connectable', 'csui/models/fetchable',
  'csui/models/autofetchable'
], function (module, _, log, ConnectableModel, FetchableModel,
  AutoFetchableModel) {
  'use strict';

  log = log(module.id);

  function ResourceModel(ParentModel) {
    var prototype = {

      makeResource: function (options) {
        // log.warn('Module "csui/models/resource" has been deprecated and' +
        //          ' is going to be removed.' +
        //          '  Use "csui/models/mixins/resource/resource.mixin" instead.')
        // && console.warn(log.last);
        // log.warn('Occurred ' + log.getStackTrace(2)) && console.warn(log.last);
        return this.makeConnectable(options)
          .makeFetchable(options)
          .makeAutoFetchable(options);
      }

    };
    prototype.Resource = _.clone(prototype);
    
    return _.extend({},
      ConnectableModel(ParentModel),
      FetchableModel(ParentModel),
      AutoFetchableModel(ParentModel),
      prototype);
  }

  return ResourceModel;

});

csui.define('csui/models/uploadable',['module', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/backbone', 'csui/utils/log'
], function (module, _, $, Backbone, log) {
  'use strict';

  log = log(module.id);

  function UploadableModel(ParentModel) {
    var prototype = {

      makeUploadable: function (options) {
        // log.warn('Module "csui/models/uploadable" has been deprecated and is going to be removed.' +
        //          '  Use "csui/models/mixins/uploadable/uploadable.mixin" instead.')
        // && console.warn(log.last);
        // log.warn('Occurred ' + log.getStackTrace(2)) && console.warn(log.last);
        return this;
      },

      sync: function (method, model, options) {
        var data = options.data || options.attrs || this.attributes;
        // Make sure, that POST and PUT urls do not contain the URL query
        // part.  It is not possible to ensure it inside the url function.
        function currectUpdatingUrl() {
          var url = options.url || _.result(model, 'url');
          return url.replace(/\?.*$/, '');
        }

        if (method === 'create') {
          log.debug('Creating {0} ({1}).',
              log.getObjectName(this), this.cid) && console.log(log.last);
          var formData = new FormData();
          formData.append('body', JSON.stringify(data));

          // append file, if there is
          _.each(_.keys(options.files || {}), function (key) {
            var files = options.files[key], i;
            if (_.isArray(files) && files.length > 1) {
              // TODO: Adapt this according to the server support.
              for (i = 0; i < files.length; ++i) {
                var name = i ? key + i : key;
                formData.append(name, files[i]);
              }
            } else if (files) {
              formData.append(key, files);
            }
          });

          _.extend(options, {
            data: formData,
            contentType: false,
            url: currectUpdatingUrl()
          });
        } else if (method === 'update' || method === 'patch') {
          log.debug('Updating {0} ({1}).',
              log.getObjectName(this), this.cid) && console.log(log.last);
          method = 'update';
          data = {body: JSON.stringify(data)};
          _.extend(options, {
            data: $.param(data),
            contentType: 'application/x-www-form-urlencoded',
            url: currectUpdatingUrl()
          });
        }
        return Backbone.sync(method, model, options);
      }

    };
    prototype.Uploadable = _.clone(prototype);

    return prototype;
  }

  return UploadableModel;

});

csui.define('csui/models/mixins/versions/v2.versions.response.mixin',['csui/lib/underscore'
], function (_) {
  'use strict';

  var VersionsV2ResponseMixin = {

    mixin: function (prototype) {
      return _.extend(prototype, {

        makeVersionableV2Response: function (options) {
          return this;
        },

        parseVersionsResponse: function (response) {
          if (!!response.results && !!response.results.data) {
            return response.results.data.versions;
          }
          return response;
        }

      });
    }
  };
  return VersionsV2ResponseMixin;
});

csui.define('csui/models/server.adaptors/version.mixin',[
  'csui/lib/underscore', 'csui/utils/url'
], function (_, Url) {
  'use strict';

  var ServerAdaptorMixin = {

    mixin: function (prototype) {

      return _.extend(prototype, {
        makeServerAdaptor: function (options) {
          return this;
        },

        url: function () {
          var url = Url.combine(this.connector.connection.url, 'nodes',
            this.get('id'), 'versions');
          if (!this.isNew()) {
            url = Url.combine(url.replace("/v1", "/v2"), this.get('version_number'));
            var query = Url.combineQueryString(
              this.getExpandableResourcesUrlQuery()
            );
            if (query) {
              url += '?' + query;
            }
          }

          return url;
        },

        parse: function (response) {
          // Handle both version objects when parsed from the single
          // /versions/:id and the collection /versions responses.
          var version = response.data || this.parseVersionsResponse(response);

          // TODO: Remove this.  Version properties should have its own general
          // property panel instead of using the node and breaking each other
          // when one of them gets changed
          /*if (version.type === undefined) {
            version.type = 144;
          }*/

          // get node type info from NodeVersionCollection for Version Collection, if it is single
          // fetch then collect it from rest api response id_expand object
          if (version.id_expand && version.id_expand.type) {
            version.type = version.id_expand.type;
          }

          if (!!version.version_number_name) {
            version.version_number_name_formatted = version.version_number_name;
          }

          if (version.commands) {
            var commands = version.commands;
            version.actions = _
              .chain(commands)
              .keys()
              .map(function (key) {
                var attributes = commands[key];
                attributes.signature = key;
                return attributes;
              })
              .value();
            delete version.commands;
            delete version.commands_map;
            delete version.commands_order;
          }

          return version;
        }

      });
    }
  };

  return ServerAdaptorMixin;
});

csui.define('csui/models/version',[
  'module', 'csui/lib/underscore', 'csui/lib/backbone',
  'csui/utils/log', 'csui/utils/url', 'csui/models/actions',
  'csui/models/mixins/expandable/expandable.mixin',
  'csui/models/mixins/resource/resource.mixin',
  'csui/models/mixins/uploadable/uploadable.mixin',
  'csui/models/mixins/versions/v2.versions.response.mixin',
  'csui/models/server.adaptors/version.mixin',
  'csui/utils/deepClone/deepClone'
], function (module, _, Backbone, log, Url, ActionCollection,
    ExpandableMixin, ResourceMixin, UploadableMixin, VersionsableV2ResponseMixin, ServerAdaptorMixin) {
  'use strict';

  var VersionModel = Backbone.Model.extend({

    idAttribute: 'version_number',

    constructor: function VersionModel(attributes, options) {
      attributes || (attributes = {});
      options = _.extend({expand: ['user', 'versions{id, owner_id}']}, options);

      Backbone.Model.prototype.constructor.call(this, attributes, options);

      this.makeResource(options)
          .makeUploadable(options)
          .makeVersionableV2Response(options)
          .makeExpandable(options)
          .makeServerAdaptor(options);

      if (!attributes.actions) {
        this.actions = new ActionCollection();
      }
    },

    clone: function () {
      return new this.constructor(this.attributes, {
        connector: this.connector,
        expand: _.deepClone(this.expand)
      });
    },

    set: function (key, val, options) {
      var attrs;
      if (key == null) {
        return this;
      }

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      options || (options = {});

      // TODO: Support sub-models and sub-collections in general
      if (attrs.actions) {
        if (this.actions) {
          this.actions.reset(attrs.actions, options);
        } else {
          this.actions = new ActionCollection(attrs.actions);
        }
      }

      // do the usual set
      return Backbone.Model.prototype.set.call(this, attrs, options);
    },

    isNew: function () {
      return !this.has('version_number');
    },

    isFetchable: function () {
      return !!(this.get('id') && this.get('version_number'));
    }

  });

  ExpandableMixin.mixin(VersionModel.prototype);
  UploadableMixin.mixin(VersionModel.prototype);
  ResourceMixin.mixin(VersionModel.prototype);
  VersionsableV2ResponseMixin.mixin(VersionModel.prototype);
  ServerAdaptorMixin.mixin(VersionModel.prototype);

  return VersionModel;

});

csui.define('csui/models/widget/widget.model',[
  'require', 'module', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/backbone', 'csui/utils/log',
  'csui/models/server.module/server.module.collection',
  'csui/models/tool.item.config/tool.item.config.collection',
  'csui/models/tool.item.mask/tool.item.mask.collection'
], function (require, module, _, $, Backbone, log,
    ServerModuleCollection, ToolItemConfigCollection, ToolItemMaskCollection) {
  'use strict';

  log = log(module.id);

  var WidgetModel = Backbone.Model.extend({

    defaults: {
      id: null,       // Require.js module ID
      view: null,     // Resolved function object of the widget's view controller
      manifest: null, // Resolved meta-data describing the widget
      error: null     // Error from the widget's resolution if it failed
    },

    constructor: function WidgetModel(attributes, options) {
      this.options = _.defaults({}, options, {
        includeView: true,
        includeManifest: true,
        includeServerModule: true,
        includeToolItems: true
      });
      if (this.options.includeToolItems) {
        this.options.includeManifest = true;
      }
      WidgetModel.__super__.constructor.call(this, attributes, this.options);
      this.serverModule = new ServerModuleCollection.prototype.model();
      this.actions = new Backbone.Collection();
    },

    getDefaultData: function () {
      var manifest = this.get('manifest');
      return manifest ? this._getDefaultPropertyValue(manifest.schema) : {};
    },

    _getDefaultPropertyValue: function (schema) {
      if (schema) {
        if (schema.type === 'object') {
          return _.reduce(schema.properties,
              function (result, propertySchema, propertyName) {
                result[propertyName] = this._getDefaultPropertyValue(propertySchema);
                return result;
              }, {}, this);
        }
        return schema['default'];
      }
    },

    _getDefaultPrimitiveValue: function (schema) {
      if (schema) {
        var value = schema['default'];
        if (value !== undefined) {
          return value;
        }
        switch (schema.type) {
        case 'string':
          return '';
        case 'integer':
        case 'number':
          return 0;
        case 'boolean':
          return false;
        case 'array':
          return [];
        case 'null':
          return null;
        }
      }
    },

    sync: function (method, collection, options) {
      if (method !== 'read') {
        throw new Error('Only fetching the widget is supported.');
      }
      options = _.extend({}, this.options, options);
      _.defaults(options, {
        includeView: this.options.includeView,
        includeManifest: this.options.includeManifest,
        includeServerModule: this.options.includeServerModule,
        includeToolItems: this.options.includeToolItems
      });
      if (options.includeToolItems) {
        options.includeManifest = true;
      }
      var serverModulesPromise = this._resolveServerModules(options),
          toolItemsPromise     = this._resolveToolItems(options),
          toolItemMasksPromise = this._resolveToolItemMasks(options),
          self = this;
      return $.when(serverModulesPromise, toolItemsPromise, toolItemMasksPromise)
              .then(_.bind(this._resolveWidget, this, options))
              .then(function () {
                var response = self.toJSON();
                options.success && options.success(response, options);
                self.trigger('sync', self, response, options);
              }, function () {
                var error = self.get('error');
                options.error && options.error(error, options);
                self.trigger('error', self, error, options);
                return $.Deferred().reject(error);
              });
    },

    _resolveWidget: function (options) {
      var viewPromise     = this._resolveView(options),
          manifestPromise = this._resolveManifest(options),
          self = this;
      return $.when(viewPromise, manifestPromise)
              .then(function () {
                self._updateServerModule(options);
                self._updateActions(options);
              });
    },

    _resolveView: function (options) {
      var deferred = $.Deferred();
      if (options.includeView) {
        var self       = this,
            widgetData = this.getModuleData(),
            viewPath   = this.getViewModulePath(widgetData);
        require([viewPath],
            function (View) {
              self.set('view', View);
              deferred.resolve();
            }, function (error) {
              self.set('error', error);
              if (options.ignoreErrors) {
                deferred.resolve();
              } else {
                deferred.reject(error);
              }
            });
      } else {
        deferred.resolve();
      }
      return deferred.promise();
    },

    _resolveManifest: function (options) {
      var deferred = $.Deferred();
      if (options.includeManifest) {
        var self         = this,
            widgetData   = this.getModuleData(),
            manifestPath = this.getManifestModulePath(widgetData);
        require([manifestPath],
            function (manifest) {
              if (self._needsLocalization(manifest)) {
                var manifestLocalizedPath = self.getLocalizedManifestModulePath(widgetData);
                require([manifestLocalizedPath],
                    function (manifestLocalized) {
                      manifest = self._renderLocalizedManifest(manifestPath,
                          manifest, manifestLocalized);
                      self.set('manifest', manifest);
                      deferred.resolve();
                    }, function (error) {
                      if (!self.has('error')) {
                        self.set('error', error);
                      }
                      if (options.ignoreErrors || options.ignoreManifestErrors) {
                        // If errors are ignored, return not localized manifest;
                        // if it were undefined, non-robust consumers might crash
                        self.set('manifest', manifest);
                        deferred.resolve();
                      } else {
                        deferred.reject(error);
                      }
                    });
              } else {
                self.set('manifest', manifest);
                deferred.resolve();
              }
            }, function (error) {
              if (!self.has('error')) {
                self.set('error', error);
              }
              if (options.ignoreErrors || options.ignoreManifestErrors) {
                // If errors are ignored, return an empty manifest;
                // if it were undefined, non-robust consumers might crash
                self.set('manifest', {});
                deferred.resolve();
              } else {
                deferred.reject(error);
              }
            });
      } else {
        deferred.resolve();
      }
      return deferred.promise();
    },

    _resolveServerModules: function (options) {
      var serverModules;
      if (options.includeServerModule && !options.serverModules) {
        options.serverModules = serverModules = new ServerModuleCollection();
        return serverModules.fetch({ignoreErrors: options.ignoreErrors});
      }
      return $.Deferred().resolve().promise();
    },

    _resolveToolItems: function (options) {
      var toolItems;
      if (options.includeToolItems && !options.toolItems) {
        options.toolItems = toolItems = new ToolItemConfigCollection();
        return toolItems.fetch({ignoreErrors: options.ignoreErrors});
      }
      return $.Deferred().resolve().promise();
    },

    _resolveToolItemMasks: function (options) {
      var toolItemMasks;
      if (options.includeToolItems && !options.toolItemMasks) {
        options.toolItemMasks = toolItemMasks = new ToolItemMaskCollection();
        return toolItemMasks.fetch({ignoreErrors: options.ignoreErrors});
      }
      return $.Deferred().resolve().promise();
    },

    _getModulePrefix: function () {
      var name       = this.get('id'),
          firstSlash = name.indexOf('/');
      // Enable widget names without the module path for the core widgets;
      // compatibility for early perspectives, which did not use full paths
      return firstSlash < 0 ? 'csui' : name.substring(0, firstSlash);
    },

    getModuleData: function () {
      var name      = this.get('id'),
          lastSlash = name.lastIndexOf('/'),
          path;
      // Enable widget names without the module path for the core widgets;
      // compatibility for early perspectives, which did not use full paths
      if (lastSlash < 0) {
        path = 'csui/widgets/' + name;
      } else {
        path = name;
        name = name.substring(lastSlash + 1);
      }
      return {
        name: name,
        path: path
      };
    },

    getViewModulePath: function (moduleData) {
      return moduleData.path + '/' + moduleData.name + '.view';
    },

    getManifestModulePath: function (moduleData) {
      return 'json!' + moduleData.path + '/' + moduleData.name + '.manifest.json';
    },

    getLocalizedManifestModulePath: function (moduleData) {
      return 'i18n!' + moduleData.path + '/impl/nls/' + moduleData.name + '.manifest';
    },

    _updateServerModule: function (options) {
      if (options.includeServerModule) {
        var modulePrefix = this._getModulePrefix(),
            serverModule = options.serverModules.get(modulePrefix),
            attributes   = serverModule && serverModule.toJSON() ||
                {id: modulePrefix};
        this.serverModule.set(attributes);
      }
    },

    _updateActions: function (options) {
      if (options.includeToolItems) {
        var manifest = this.get('manifest'),
            actions = manifest && manifest.actions;
        this.actions.reset(actions, {silent: true});
        this.actions.each(function (action) {
          action.toolItems = options.toolItems.get(action.get('toolItems'));
          action.toolItemMasks = options.toolItemMasks.get(action.get('toolItemMasks'));
          action.toolbars = new Backbone.Collection(action.get('toolbars'));
        });
        if (!options.silent) {
          this.actions.trigger('reset', this.actions, options);
        }
      }
    },

    _renderLocalizedManifest: function (manifestPath, manifest, localizedManifest) {
      function traverseManifest(object, localizedManifestParent) {
        var key, value, localizationKey, arrayItem, localizationArrayItem, i;
        function getLocalizationKey(value) {
          return _.isString(value) && value.indexOf('{{') === 0 &&
                 value.lastIndexOf('}}') === value.length - 2 &&
                 value.substring(2, value.length - 2);
        }
        for (key in object) {
          if (object.hasOwnProperty(key)) {
            value = object[key];
            localizationKey = getLocalizationKey(value);
            if (localizationKey) {
              // Support both real and dummy localization keys
              object[key] = localizedManifestParent[localizationKey] ||
                            localizedManifestParent[key] ||
                            // Show the localization string key in case
                            // the value is missing
                            value;
            } else if (_.isArray(value)) {
              localizationArrayItem = localizedManifestParent[key] || [];
              for (i = 0; i < value.length; ++i) {
                arrayItem = value[i];
                localizationKey = getLocalizationKey(arrayItem);
                if (localizationKey) {
                  // Support both array of dummy placeholders and flat
                  // localization by unique property names.
                  value[i] = localizationArrayItem[i] ||
                             // Support both real and dummy localization keys
                             localizedManifestParent[localizationKey] ||
                             localizedManifestParent[key] ||
                             // Show the localization string key in case
                             // the value is missing
                             arrayItem;
                } else if (_.isObject(arrayItem)) {
                  // Support both hierarchical and flat localization modules
                  value[i] = traverseManifest(arrayItem, localizationArrayItem[i] ||
                                                         localizedManifestParent);
                }
              }
            } else if (_.isObject(value)) {
              if (localizedManifestParent[key]) {
                log.warn(
                    'Hierarchical format has been detected in the localization ' +
                    'module "{0}". It has been deprecated and the support for it ' +
                    'will be removed. Please, change it to the flat format as soon ' +
                    'as possible. Although JSON format allows using nested objects, ' +
                    'automated translation tools can handle only key-value pairs. ' +
                    'That is why localization modules has to contain only one ' +
                    'object with properties pointing to strings.', manifestPath)
                && console.log(log.last);
              }
              // Support both hierarchical and flat localization modules
              object[key] = traverseManifest(value, localizedManifestParent[key] ||
                                                    localizedManifestParent);
            }
          }
        }
        return object;
      }

      return traverseManifest(manifest, localizedManifest);
    },

    _needsLocalization: function (object) {
      function isLocalizableString(value) {
        return typeof value === 'string' && value.indexOf('{{') === 0 &&
               value.lastIndexOf('}}') === value.length - 2;
      }

      var value;

      for (var key in object) {
        if (object.hasOwnProperty(key)) {
          value = object[key];
          if (isLocalizableString(value)) {
            return true;
          } else if (_.isArray(value)) {
            for (var i = 0; i < value.length; i++) {
              if (isLocalizableString(value[i])) {
                return true;
              }
            }
          } else if (typeof value === 'object') {
            return this._needsLocalization(value);
          }
        }
      }
    }

  });

  return WidgetModel;

});

csui.define('csui/models/widget/widget.collection',[
  'require', 'module', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/backbone', 'csui/models/widget/widget.model',
  'csui/models/server.module/server.module.collection',
  'csui/models/tool.item.config/tool.item.config.collection',
  'csui/models/tool.item.mask/tool.item.mask.collection'
], function (require, module, _, $, Backbone, WidgetModel,
    ServerModuleCollection, ToolItemConfigCollection, ToolItemMaskCollection) {
  'use strict';

  var widgets = module.config().widgets || [];
  // Support either array of module IDs or a map with keys pointing
  // to arrays of module IDs; the latter can be used for decentralized
  // configuration (multiple calls to require.config, which merge maps,
  // but not arrays)
  if (!_.isArray(widgets)) {
    widgets = Array.prototype.concat.apply([], _.values(widgets));
  }
  // Convert the array of widget names to model attributes
  widgets = _.map(widgets, function (name) {
    return {
      id: name
    };
  });

  var WidgetCollection = Backbone.Collection.extend({

    model: WidgetModel,

    constructor: function WidgetCollection(models, options) {
      // Store the options before calling the parent constructor;
      // model processing in _prepareModel may access the options
      this.options = _.defaults({}, options, {
        includeView: true,
        includeManifest: true,
        includeServerModule: true,
        includeToolItems: true
      });
      if (this.options.includeToolItems) {
        this.options.includeManifest = true;
      }
      models || (models = widgets);
      WidgetCollection.__super__.constructor.call(this, models, options);
    },

    sync: function (method, collection, options) {
      if (method !== 'read') {
        throw new Error('Only fetching the widgets is supported.');
      }
      var self = this;
      options = _.extend({}, this.options, options);
      if (options.includeToolItems) {
        options.includeManifest = true;
      }
      var serverModulesPromise = this._resolveServerModules(options),
          toolItemsPromise     = this._resolveToolItems(options),
          toolItemMasksPromise = this._resolveToolItemMasks(options);
      return $.when(serverModulesPromise, toolItemsPromise, toolItemMasksPromise)
              .then(_.bind(this._resolveWidgets, this, options))
              .then(function () {
                var response = self.toJSON();
                options.success && options.success(response, options);
                self.trigger('sync', self, response, options);
              });
    },

    _prepareModel: function (attrs, options) {
      options || (options = {});
      _.defaults(options, {
        includeView: this.options.includeView,
        includeManifest: this.options.includeManifest,
        includeServerModule: this.options.includeServerModule,
        includeToolItems: this.options.includeToolItems
      });
      return WidgetCollection.__super__._prepareModel.call(this, attrs, options);
    },

    _resolveServerModules: function (options) {
      var serverModules = options.serverModules;
      if (serverModules || !options.includeServerModule) {
        return $.Deferred().resolve().promise();
      }
      serverModules = options.serverModules = new ServerModuleCollection();
      return serverModules.fetch({ignoreErrors: options.ignoreErrors !== false});
    },

    _resolveToolItems: function (options) {
      var toolItems = options.toolItems;
      if (toolItems || !options.includeToolItems) {
        return $.Deferred().resolve().promise();
      }
      toolItems = options.toolItems = new ToolItemConfigCollection();
      return toolItems.fetch({ignoreErrors: options.ignoreErrors !== false});
    },

    _resolveToolItemMasks: function (options) {
      var toolItemMasks = options.toolItemMasks;
      if (toolItemMasks || !options.includeToolItems) {
        return $.Deferred().resolve().promise();
      }
      toolItemMasks = options.toolItemMasks = new ToolItemMaskCollection();
      return toolItemMasks.fetch({ignoreErrors: options.ignoreErrors !== false});
    },

    _resolveWidgets: function (options) {
      var resolvableModels = this.filter(function (model) {
            // A resolvable widget must have an ID and it was already resolved
            // neither with a success nor with a failure
            return model.has('id') &&
                   !(model.has('view') || model.has('manifest') || model.has('error'));
          }),
          promises = _.invoke(resolvableModels, 'fetch', {
            ignoreErrors: options.ignoreErrors !== false,
            ignoreManifestErrors: options.ignoreManifestErrors !== false,
            includeView: options.includeView,
            includeManifest: options.includeManifest,
            includeServerModule: options.includeServerModule,
            includeToolItems: options.includeToolItems,
            serverModules: options.serverModules,
            toolItems: options.toolItems,
            toolItemMasks: options.toolItemMasks
          });
      return $.when.apply($, promises);
    }

  });

  return WidgetCollection;

});


csui.define('csui/utils/classic.nodes/classic.nodes',[
  'csui/lib/underscore', 'csui/lib/backbone', 'csui/utils/url',
  'csui/models/mixins/rules.matching/rules.matching.mixin',
  // Load and register external Classic UI node rules
  'csui-ext!csui/utils/classic.nodes/classic.nodes'
], function (_, Backbone, Url, RulesMatchingMixin, rules) {
  'use strict';

  var ClassicNodeModel = Backbone.Model.extend({
    defaults: {
      sequence: 100,
      url: null,
      urlQuery: null,
      force: false
    },

    constructor: function ClassicNodeModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
      this.makeRulesMatching(options);
    }
  });

  RulesMatchingMixin.mixin(ClassicNodeModel.prototype);

  var ClassicNodeCollection = Backbone.Collection.extend({
    model: ClassicNodeModel,
    comparator: 'sequence',

    constructor: function ClassicNodeCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
    },

    findByNode: function (node, options) {
      var model = this.find(function (item) {
        return item.matchRules(node, item.attributes);
      });
      if (model) {
        return {
          url: this._getUrl(model, node, options),
          forced: model.get('forced')
        };
      }
    },

    isForced: function (node, options) {
      return this.some(function (item) {
        return item.get('forced') &&
               item.matchRules(node, item.attributes);
      });
    },

    isSupported: function (node, options) {
      return this.some(function (item) {
        return item.matchRules(node, item.attributes);
      });
    },

    getUrl: function (node, options) {
      var model = this.find(function (item) {
        return item.matchRules(node, item.attributes);
      });
      if (model) {
        return this._getUrl(model, node, options);
      }
    },

    _getUrl: function (model, node, options) {
      var url = model.get('url');
      if (url) {
        // Receive a complete URL
        if (typeof url === 'string') {
          url = this._replaceParameters(url, node.attributes);
        } else if (typeof url === 'function') {
          url = url(node);
        }
      } else {
        var urlQuery = model.get('urlQuery');
        if (urlQuery) {
          // Receive a URL query to be appended to the CGI URL
          if (typeof urlQuery === 'string') {
            urlQuery = this._replaceParameters(urlQuery, node.attributes);
          } else if (typeof urlQuery === 'function') {
            urlQuery = urlQuery(node);
          }
          var connector = options && options.connector || node.connector;
          if (connector) {
            url = new Url(connector.connection.url).getCgiScript();
          } else {
            url = '';
          }
          urlQuery = Url.combineQueryString(urlQuery);
          url = Url.appendQuery(url, urlQuery);
        }
      }
      return url;
    },

    _replaceParameters: function (expression, node) {
      var attributes = node.attributes,
          parameter = /{([^}]+)}/g,
          match, names, value, index;
      // Go over every parameter placeholder found
      while ((match = parameter.exec(expression))) {
        names = match[1].split('.');
        value = attributes;
        // Nested object property names are separated by dots
        _.find(names, function (name) {
          value = value[name];
          if (value == null) {
            value = '';
            return true;
          }
        });
        // Replace the placeholder with the value found
        index = match.index;
        expression = expression.substring(0, index) +
                     encodeURIComponent(value) +
                     expression.substring(index + match[0].length);
      }
      return expression;
    }
  });

  var classicNodes = new ClassicNodeCollection();

  if (rules) {
    classicNodes.add(_.flatten(rules, true));
  }

  return classicNodes;
});


csui.define('csui/utils/authenticators/authenticators',[
  'csui/lib/underscore', 'csui/lib/backbone',
  'csui/models/mixins/rules.matching/rules.matching.mixin',
  // Load and register external authenticator rules
  'csui-ext!csui/utils/authenticators/authenticators'
], function (_, Backbone, RulesMatchingMixin, rules) {
  'use strict';

  var AuthenticatorModel = Backbone.Model.extend({
    defaults: {
      sequence: 100,
      authenticator: null
    },

    constructor: function AuthenticatorModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
      this.makeRulesMatching(options);
    }
  });

  RulesMatchingMixin.mixin(AuthenticatorModel.prototype);

  var AuthenticatorCollection = Backbone.Collection.extend({
    model: AuthenticatorModel,
    comparator: 'sequence',

    constructor: function AuthenticatorCollection(models, options) {
      Backbone.Collection.prototype.constructor.call(this, models, options);
    },

    findByConnection: function (connection) {
      var rule = this.find(function (item) {
        return item.matchRules(connection, item.attributes);
      });
      return rule && rule.get('authenticator');
    }
  });

  var authenticators = new AuthenticatorCollection();

  if (rules) {
    authenticators.add(_.flatten(rules, true));
  }

  return authenticators;
});

csui.define('csui/utils/connector',[
  'require', 'module', 'csui/lib/jquery', 'csui/lib/underscore',
  'csui/lib/backbone', 'csui/utils/log', 'csui/utils/base',
  'csui/utils/url', 'i18n', 'i18n!csui/utils/impl/nls/lang',
  'csui/utils/authenticators/authenticators',
  'csui/models/mixins/uploadable/uploadable.mixin',
  'csui/lib/jquery.ajax-progress'
], function (require, module, $, _, Backbone, log, base,
  Url, i18n, lang, authenticators, UploadableMixin) {
  'use strict';

  var config = _.extend({
    connectionTimeout: undefined
  }, module.config());

  var pageUnloading = false;
  $(window).bind('beforeunload.' + module.id, function (event) {
    pageUnloading = true;
  });

  function Connector(options) {
    this.connection = options.connection;
    this.authenticator = options.authenticator;
    if (!this.authenticator) {
      var Authenticator = authenticators.findByConnection(this.connection);
      if (!Authenticator) {
        throw new Error(
          'No authenticator found. Load csui-extensions.json to enable built-in authenticators.');
      }
      this.authenticator = new Authenticator();
    }
    // The connection is owned by the connector but the authenticator
    // may be created by the client independently on the connector
    // and passed in. The connection must come from the connector.
    this.authenticator.connection = this.connection;
    this.authenticator.connectionTimeout = this.connectionTimeout;
    this.authenticationPending = false;
    this.waitingRequests = [];
  }

  function assignTo(model) {
    // Allow multiple calls when connectable is mixed
    // with node.connectable, for example
    if (model.connector) {
      if (model.connector === this) {
        return;
      }
      // The sync() method cannot be overridden twice
      throw new Error('Impossible to re-assign connector.');
    }
    model.connector = this;
    return overrideBackboneSync.call(this, model);
  }

  function overrideBackboneSync(model) {
    var self = this;
    var originalSync = model.sync;
    model.sync = function (method, model, options) {
      var jqxhr;

      function executeSync() {
        // If we caught unload event earlier and now a new request is going
        // to be executed, let's assume, that page unloading was cancelled
        pageUnloading = false;
        self.extendAjaxOptions(options);
        // The options for the $.ajax() serve as the carrier of the
        // deferred object; jQuery AJAX callbacks are on a lower level
        // and  do not have access to the Backbone model.
        var deferred = options.deferred;
        jqxhr = originalSync.call(model, method, model, options)
          .progress(deferred.notify)
          .done(deferred.resolve)
          .fail(function (request, message, statusText) {
            // Let the promise akceptors wait forever on page unload
            if (!pageUnloading) {
              deferred.reject(request, message, statusText);
            }
          });
        return addAbort(deferred.promise());
      }

      function addAbort(promise) {
        // extend the locally created promise with an additional abort method
        // not to break the Backbone.sync contract - it returns the jqxhr
        // object, which includes not only the promise methods, but also AJAX
        // call controlling methods like abort
        promise.abort = function () {
          // If noabort method exists, the model either does not support it
          // or the request was aborted while still in the waiting queue
          if (jqxhr.abort) {
            jqxhr.abort();
          }
          return this;
        };
        return promise;
      }

      if (self.authenticator.isAuthenticated()) {
        return executeSync();
      }

      var executor = {
        execute: executeSync,
        deferred: $.Deferred()
      };
      self.waitingRequests.push(executor);

      authenticate.call(self, function success() {
        executeWaitingRequests.call(self);
      }, function fail(error) {
        cancelWaitingRequests.call(self);
        reportError(error);
      });

      return addAbort(executor.deferred.promise());
    };
    return this;
  }

  function getConnectionUrl() {
    return new Url(this.connection.url);
  }

  function extendAjaxOptions(options) {
    options.headers || (options.headers = {});
    _.extend(options.headers, this.connection.headers);
    _.extend(options.headers, {
      'Accept-Language': i18n.settings.locale
    });
    this.authenticator.setAuthenticationHeaders(options.headers);
    options.timeout = this.connectionTimeout;
    // jQuery doesn't notify the promises about the data transfer
    // progress; we do it by our progress event handler below and
    // just relay the other promise events as they come.
    options.deferred = $.Deferred();

    var self = this;

    var beforeSend = options.beforeSend;
    options.beforeSend = function (request, settings) {
      // Progress event handler doesn't have access to the the jQuery AJAX
      // object; let's use the options in this scope as its carrier.
      options.request = request;
      request.settings = settings;
      if (self.reportSending) {
        self.reportSending(request, settings);
      }
      if (beforeSend) {
        beforeSend(request, settings);
      }
      // There's no progress event at the very start of uploading; it may be
      // useful to be notified about it though.  jQuery promises have no
      // start event; just notify and done, that's why we send one extra
      // notification with non-computable length to notify about the very
      // start.
      options.progress({
        lengthComputable: false,
        beforeSend: true
      });
    };

    var progress = options.progress;
    options.progress = function (event) {
      if (self.reportProgress) {
        self.reportProgress(event, options.request);
      }
      if (progress) {
        progress(event);
      }
      // jQuery doesn't notify the promises about the data transfer progress.
      options.deferred.notify(event, options.request);
    };

    var success = options.success;
    options.success = function (data, result, request) {
      self.authenticator.updateAuthenticatedSession(request);
      self._succeeded = true;
      if (self.reportSuccess) {
        self.reportSuccess(request);
      }

      if (success) {
        success(data, result, request);
      }
    };

    var error = options.error;
    options.error = function (request, message, statusText) {
      // Do not report any errors when the page is unloading; aborted AJAX
      // calls are expected to fail silently
      if (pageUnloading) {
        return;
      }

      function reportError() {
        if (self.reportError) {
          self.reportError(request);
        }
        if (error) {
          error(request, message, statusText);
        }
      }

      if (request.status == 401) {
        // If the user refuses to reload the page to sign in again, that
        // question will not be asked anymore.  Only error messages will
        // continue showing.
        if (!self.confirmingReload) {
          self.confirmingReload = true;
          var failure     = new base.RequestErrorMessage(request),
              dialogTitle = self._succeeded ? lang.SessionExpiredDialogTitle :
                            lang.AuthenticationFailureDialogTitle;
          log.warn(failure) && console.warn(log.last);

          csui.require(['csui/dialogs/modal.alert/modal.alert'], function (alertDialog) {
            alertDialog
              .showWarning(lang.AuthenticationFailureDialogText, dialogTitle, {
                buttons: alertDialog.buttons.Ok
              })
              .always(function () {
                self.authenticator.unauthenticate({reason: 'expired'});
              });
          });

        }
      } else {
        reportError();
      }
    };

    return options;
  }

  function formatAjaxData(data) {
    data = JSON.stringify(data);
    return UploadableMixin.useJSON || UploadableMixin.mock ?
           data : {body: data};
  }

  function getAjaxContentType() {
    return UploadableMixin.useJSON || UploadableMixin.mock ?
           'application/json' : 'application/x-www-form-urlencoded';
  }

  function makeAjaxCall(options) {
    options = this.extendAjaxOptions(options);
    var method = options.method || options.type || 'GET',
        data = options.data;
    if (data) {
      if (method === 'GET') {
        // Normalize the request, so that the parameters are always in
        // the URL query, to make the request mockable by mockjax
		    if (typeof data !== 'string') {
          data = $.param(data, true);
		    }
        var url = options.url || location.href;
        url += url.indexOf('?') >= 0 ? '&' : '?';
        url += data;
        delete options.data;
      } else {
        var contentType = options.contentType;
        if (data instanceof FormData) {
          // Unless set by the caller, ensure the MIME type, which can
          // accomodate both primitive and file fields
          if (!contentType) {
            options.contentType = 'multipart/form-data';
          }
          options.processData = false;
        } else {
          // Unless serialized to string by the caller, wither serialize
          // to application/json or application/x-www-form-urlencoded,
          // depending on the server capabilities
          if (typeof data !== 'string') {
            options.data = formatAjaxData(data);
          }
          if (!contentType) {
            options.contentType = getAjaxContentType();
          }
        }
      }
    }
    return $.ajax(options);
  }

  function executeWaitingRequests() {
    var executors = this.waitingRequests.slice(0);
    this.waitingRequests = [];
    _.each(executors, function (executor) {
      executor.execute()
        .progress(executor.deferred.notify)
        .done(executor.deferred.resolve)
        .fail(function (request, message, statusText) {
          // Let the promise akceptors wait forever on page unload
          if (!pageUnloading) {
            executor.deferred.reject(request, message, statusText);
          }
        });
    });
  }

  function cancelWaitingRequests() {
    var executors = this.waitingRequests.slice(0);
    this.waitingRequests = [];
    _.each(executors, function (executor) {
      executor.deferred.reject();
    });
  }

  function authenticate(success, failure) {
    if (!this.authenticationPending) {
      this.authenticationPending = true;
      var self = this;
      this.authenticator.authenticate(function () {
          self.authenticationPending = false;
          success();
        }, function (error) {
          self.authenticationPending = false;
          failure(error);
        });
    }
  }

  function reportSending(request, settings) {
    if (request && settings) {
      log.debug('Sending request as {0} to {1}.', settings.type, settings.url) &&
      console.log(log.last);
    }
  }

  function reportProgress(event, request) {
    var progress = event.lengthComputable ? _.str.sformat(
      '{0} from {1} bytes transferred', event.loaded, event.total) :
                   event.beforeSend ? 'connection opened' : 'no information';
    log.debug('Progress of {0} from {1}: {2}.', request.settings.type,
      request.settings.url, progress) && console.log(log.last);
  }

  function reportSuccess(request) {
    if (request && request.settings) {
      log.debug('Receiving response for {0} from {1}.', request.settings.type,
        request.settings.url) && console.log(log.last);
    }
  }

  function reportError(request, error) {
    if (!error) {
      if (request instanceof Error) {
        error = request;
        request = undefined;
      } else {
        error = new base.RequestErrorMessage(request);
      }
    }
    if (request && request.settings) {
      log.warn('{0} request to {1} failed:', request.settings.type, request.settings.url) &&
      console.warn(log.last);
    }
    log.warn(error) && console.warn(log.last);
    base.MessageHelper.addMessage(error.toString());
  }

  function requestContentAuthToken(node) {
    // TODO: Refactor this to be able to share the code with the connector
    // above.  And have a look how to share more with the authenticator too.
    var attributes = base.isBackbone(node) ? node.attributes : node,
        url        = Url.combine(this.connection.url, 'contentauth?id=' + attributes.id),
        headers    = _.extend({
          'Accept-Language': i18n.settings.locale
        }, this.connection.headers);
    this.authenticator.setAuthenticationHeaders(headers);
    return $.ajax({
      type: 'GET',
      url: url,
      headers: headers,
      timeout: this.connectionTimeout,
      context: this,
      beforeSend: _.bind(function (request, settings) {
        request.settings = settings;
        if (this.reportSending) {
          this.reportSending(request, settings);
        }
      }, this),
      success: _.bind(function (data, result, request) {
        this.authenticator.updateAuthenticatedSession(request);
        if (this.reportSuccess) {
          this.reportSuccess(request);
        }
      }, this),
      error: _.bind(function (request, message, statusText) {
        if (this.reportError) {
          this.reportError(request);
        }
      }, this)
    });
  }

  _.extend(Connector.prototype, Backbone.Events, {
    constructor: Connector,
    // Makes a Backbone model working with the REST API connector.
    assignTo: assignTo,
    // Returns a URL object with convenience methods like getApiBase,
    // which wraps the connection.url
    getConnectionUrl: getConnectionUrl,
    // Prepares options for the Backbone fetch method to work
    // with the REST API connector. It can be used for custom models.
    extendAjaxOptions: extendAjaxOptions,
    // Deprecated and to be removed.
    extendFetchOptions: extendAjaxOptions,
    // Preprocess the data property in $.ajax options, so that CS
    // can accept JSON in POST and PUT requests
    formatAjaxData: formatAjaxData,
    // Returns the correct content type for $.ajax options, so that CS
    // can accept JSON in POST and PUT requests
    getAjaxContentType: getAjaxContentType,
    // Shortens making an ajax call by applying extendAjaxOptions,
    // formatAjaxData and getAjaxContentType together and callig $.ajax.
    makeAjaxCall: makeAjaxCall,
    // Overridables to extend or replace logging and/or error reporting.
    reportSending: reportSending,
    reportProgress: reportProgress,
    reportSuccess: reportSuccess,
    reportError: reportError,
    // Other utility methods and properties.
    requestContentAuthToken: requestContentAuthToken,
    connectionTimeout: config.connectionTimeout,
    // authentication
    authenticate: authenticate
  });
  Connector.version = '1.0';

  return Connector;

});


csui.define('csui/utils/defaultactionitems',[
  'csui/lib/underscore', 'csui/models/actionitems',
  // Load and register external default action rules
  'csui-ext!csui/utils/defaultactionitems'
], function (_, ActionItemCollection, rules) {
  'use strict';

  var defaultActionItems = new ActionItemCollection();

  if (rules) {
    defaultActionItems.add(_.flatten(rules, true));
  }

  return defaultActionItems;
});

csui.define('csui/utils/authenticators/authenticator',[
  'csui/lib/underscore', 'csui/lib/backbone'
], function (_, Backbone) {
  'use strict';

  // Defines the authentication interface.
  function Authenticator(options) {
    this.connection = options && options.connection || {};
  }

  _.extend(Authenticator.prototype, Backbone.Events, {
    authenticate: function (options, succeeded, failed) {
      // Normalize input parameters, which are all optional.
      if (typeof options === 'function') {
        failed = succeeded;
        succeeded = options;
        options = undefined;
      }
      options || (options = {});

      this.syncStorage(options.session);
      if (this.doAuthenticate(options, succeeded, failed)) {
        return this;
      }

      if (this.isAuthenticated()) {
        if (succeeded) {
          succeeded(this.connection);
        }
      } else {
        var error = new Error('Missing authentication parameters.');
        if (failed) {
          failed(error, this.connection);
        } else {
          throw error;
        }
      }
      return this;
    },

    doAuthenticate: function (options) {
    },

    unauthenticate: function (options) {
      return this;
    },

    isAuthenticated: function () {
      return false;
    },

    syncStorage: function (session) {
      return this;
    },

    setAuthenticationHeaders: function (headers) {
    },

    updateAuthenticatedSession: function (session) {
    }
  });

  Authenticator.extend = Backbone.View.extend;

  return Authenticator;
});

csui.define('csui/utils/objectstorage',["module", "csui/lib/underscore", "csui/lib/backbone", "csui/utils/log", "csui/lib/jquery"
], function (module, _, Backbone, log, $) {
  'use strict';
  function ObjectStorage() {
    this.items = {};
  }

  _.extend(ObjectStorage.prototype,{
    constructor: ObjectStorage,
    setItem: function (k, v) {
      this.items[k] = v;
    },

    getItem: function (k) {
      return this.items[k];
    },

    removeItem: function (k) {
      delete this.items[k];
    }
  });

  return ObjectStorage;
});
csui.define('csui/utils/namedstorage',["module", "csui/lib/underscore", "csui/lib/backbone", "csui/utils/log",
  "csui/utils/objectstorage"
], function (module, _, Backbone, log, ObjectStorage) {

  function NamedStorage(storage, name) {
    this.storage = storage;
    this.name = name;
    try {
      this.storage.setItem("testkey","testvalue");
    } catch(e) {
      this.os = new ObjectStorage();
    }
  }

  _.extend(NamedStorage.prototype, Backbone.Events, {

    constructor: NamedStorage,

    get: function (key, value) {
      return getContent.call(this)[key];
    },

    set: function (key, value) {
      var content = getContent.call(this);
      content[key] = value;
      saveContent.call(this, content);
    },

    remove: function (key) {
      var content = getContent.call(this);
      delete content[key];
      saveContent.call(this, content);
    },

    destroy: function () {
      this.storage.removeItem(this.name);
    }

  });

  function getContent() {
    var content;
    if (!!this.os) {
      content = this.os.getItem(this.name);
    } else {
      content = this.storage && this.storage.getItem(this.name);
    }
    return (content && JSON.parse(content)) || {};
  }

  function saveContent(content) {
    if(!!this.os) {
      this.os.setItem(this.name, JSON.stringify(content));
    } else {
      this.storage && this.storage.setItem(this.name, JSON.stringify(content));
    }
  }

  NamedStorage.extend = Backbone.View.extend;
  NamedStorage.version = '1.0';

  return NamedStorage;

});

csui.define('csui/utils/namedsessionstorage',["module", "csui/utils/log", "csui/utils/namedstorage"
], function (module, log, NamedStorage) {

  if (sessionStorage === undefined) {
    log.warn("Session storage is not available." +
             "  Some information will not be able to save temporarily;" +
             " authenticated state, for example.") && console.warn(log.last);
  }

  var NamedSessionStorage = NamedStorage.extend({

    constructor: function NamedSessionStorage(name) {
      NamedStorage.prototype.constructor.call(this, sessionStorage, name);
    }

  });

  NamedSessionStorage.version = '1.0';

  return NamedSessionStorage;

});

csui.define('csui/utils/authenticators/ticket.authenticator',[
  'module', 'csui/lib/underscore', 'csui/utils/authenticators/authenticator',
  'csui/utils/namedsessionstorage'
], function (module, _, Authenticator, NamedSessionStorage) {
  'use strict';

  var config = window.csui.requirejs.s.contexts._.config
      .config['csui/utils/authenticator'] || {};
  config = _.extend({
    rememberTicket: true,
    ticketHeader: 'OTCSTicket',
    ticketExpirationHeader: 'OTCSTicketExpires'
  }, config, module.config());
  config.ticketHeader = config.ticketHeader.toLowerCase();
  config.ticketExpirationHeader = config.ticketExpirationHeader.toLowerCase();

  var storage = new NamedSessionStorage(module.id);

  // Supports authentication using the explicit ticket provided
  // in {session: titket}.
  var TicketAuthenticator = Authenticator.extend({
    constructor: function TicketAuthenticator(options) {
      Authenticator.prototype.constructor.call(this, options);
    },

    unauthenticate: function (options) {
      this.connection.session = undefined;
      if (config.rememberTicket) {
        storage.remove(this.connection.url);
      }
      this.trigger('loggedOut', {
        sender: this,
        connection: this.connection,
        reason: options && options.reason
      });
      return this;
    },

    isAuthenticated: function () {
      var session = this.connection.session;
      return !!(session && session.ticket);
    },

    syncStorage: function (session) {
      session || (session = this.connection.session);
      if (!session && config.rememberTicket) {
        // no session -> try to get from session storage
        session = storage.get(this.connection.url);
      }
      if (session) {
        // session -> update
        this.connection.session || (this.connection.session = {});
        _.extend(this.connection.session, session);
      }
      return this;
    },

    setAuthenticationHeaders: function (headers) {
      var session = this.connection.session,
          ticket = session && session.ticket;
      if (ticket) {
        headers[config.ticketHeader] = ticket;
        return true;
      }
    },

    updateAuthenticatedSession: function (data, request) {
      data || (data = {});
      if (!request && data.getResponseHeader) {
        request = data;
        data = {};
      }
      var ticket = data.ticket || request &&
                   request.getResponseHeader(config.ticketHeader);
      if (ticket) {
        var session = this.connection.session ||
                      (this.connection.session = {});
        _.extend(session, {
          ticket: ticket,
          expires: data.expires || request &&
                   request.getResponseHeader(config.ticketExpirationHeader)
        });
        if (config.rememberTicket) {
          storage.set(this.connection.url, session);
        }
      }
    }
  });

  return TicketAuthenticator;
});

csui.define('csui/utils/authenticators/request.authenticator',[
  'module', 'csui/lib/jquery', 'csui/lib/underscore',
  'csui/utils/base', 'csui/utils/url', 'csui/utils/log',
  'csui/models/mixins/uploadable/uploadable.mixin',
  'csui/utils/authenticators/ticket.authenticator',
  'csui/lib/jquery.parse.param'
], function (module, $, _, base, Url, log, UploadableMixin,
     TicketAuthenticator) {
  'use strict';

  var config = window.csui.requirejs.s.contexts._.config
  .config['csui/utils/requestauthenticator'] || {};
  config = _.extend({
    connectionTimeout: 60 * 1000
  }, config, module.config());

  // Performs authentication using an initial request, which is supposed to
  // obtain the OTCSTicket.  Descendants decide what request and how to
  // process its response.
  var RequestAuthenticator = TicketAuthenticator.extend({
    constructor: function RequestAuthenticator(options) {
      TicketAuthenticator.prototype.constructor.call(this, options);
    },

    login: function (options, succeeded, failed) {
      delete this.connection.session;
      log.debug('Sending authentication request to {0}.', this.connection.url)
      && console.log(log.last);
      var settings = this.prepareRequest(options);
      this.updateRequestBody(settings);
      return this.makeRequest(settings, succeeded, failed);
    },

    prepareRequest: function (options) {
      return options;
    },

    parseResponse: function (response, request) {
      return response;
    },

    makeRequest: function (options, succeeded, failed) {
      var headers = _.extend({}, this.connection.headers, options.headers);
      return $.ajax(_.extend({
        // TODO: Deprecate and remove this. This is an abstract object.
        // Descendant authenticators should be used to make calls.
        url: Url.combine(this.connection.url, 'auth'),

        timeout: this.connectionTimeout,
        context: this,

        beforeSend: function (request, settings) {
          request.settings = settings;
        },

        success: function (response, textStatus, request) {
          log.debug('Receiving authentication response from {0}.', this.connection.url)
          && console.log(log.last);
          response = this.parseResponse(response, request);
          if (this.authenticateSession(response, request)) {
            if (succeeded) {
              succeeded.call(this, this.connection);
            }
            this.trigger('loggedIn', {
              sender: this,
              connection: this.connection
            });
          }
        },

        error: function (request) {
          var error = new base.RequestErrorMessage(request);
          log.warn('Logging in to {0} failed:\r\n{1}',
            this.connection.url, error) && console.warn(log.last);
          if (failed) {
            failed.call(this, error, this.connection);
          }
        }
      }, options, {
        headers: headers
      }));
    },

    updateRequestBody: function (settings) {
      var data;
      if (UploadableMixin.useJSON || UploadableMixin.mock) {
        if (settings.contentType !== 'application/json') {
          settings.contentType = 'application/json';
          data = settings.data;
          if (typeof data === 'string') {
            data = $.parseParam(data);
          }
          if (UploadableMixin.mock) {
            settings.data = data;
          } else {
            settings.data = JSON.stringify(data);
          }
          settings.processData = false;
        }
      } else {
        if (settings.contentType === 'application/json') {
          settings.contentType = 'application/x-www-form-urlencoded';
          data = settings.data;
          if (typeof data === 'string') {
            settings.data = JSON.parse(data);
          }
          if (UploadableMixin.mock) {
            settings.data = data;
          }
          settings.processData = true;
        }
      }
    },

    authenticateSession: function (response, request) {
      if (response && response.ticket) {
        if (request && request.settings && request.settings.data) {
          log.info('Logging in to {0} as {1} succeeded.',
              this.connection.url, request.settings.data.username)
          && console.log(log.last);
        }
        this.updateAuthenticatedSession(response, request);
        return true;
      }
      return true;
    },

    unauthenticate: function (options) {
      var first = this.isAuthenticated();
      TicketAuthenticator.prototype.unauthenticate.apply(this, arguments);
      if (first) {
        this.trigger('loggedOut', {
          sender: this,
          connection: this.connection,
          reason: options && options.reason
        });
      }
      return this;
    },

    connectionTimeout: config.connectionTimeout
  });

  return RequestAuthenticator;
});

csui.define('csui/utils/authenticators/server.adaptors/initial.header.mixin',[
  'csui/lib/underscore', 'csui/utils/url',
], function (_, Url) {
  'use strict';

  var ServerAdaptorMixin = {
    mixin: function (prototype) {
      return _.extend(prototype, {
        makeServerAdaptor: function (options) {
          return this;
        },

        prepareRequest: function (options) {
          // Allow calling the login() method directly with partial
          // request settings overriding the authenticator defaults.
          var headers = options && options.headers ||
                        this.connection.authenticationHeaders;
          return {
            url: Url.combine(this.connection.url, 'auth'),
            headers: headers
          };
        }
      });
    }
  };

  return ServerAdaptorMixin;
});

csui.define('csui/utils/authenticators/initial.header.authenticator',[
  'require', 'csui/utils/log',
  'csui/utils/authenticators/request.authenticator',
  'csui/utils/authenticators/server.adaptors/initial.header.mixin'
], function (require, log, RequestAuthenticator, ServerAdaptorMixin) {
  'use strict';

  var InitialHeaderAuthenticator = RequestAuthenticator.extend({
    constructor: function InitialHeaderAuthenticator(options) {
      RequestAuthenticator.prototype.constructor.call(this, options);
      this.makeServerAdaptor(options);
    },

    doAuthenticate: function (options, succeeded, failed) {
      var headers = options.headers ||
                    this.connection.authenticationHeaders,
          self = this;
      if (headers) {
        this.connection.authenticationHeaders = headers;
        this.login({}, succeeded, function (error, connection) {
          self._reportError(error);
          self.unauthenticate({reason: 'failed'});
          if (failed) {
            failed(error, connection);
          }
        });
        return true;
      }
    },

    authenticateSession: function (response, request) {
      if (response && response.data) {
        log.info('Logging in to {0} as {1} succeeded.',
            this.connection.url, response.data.name)
        && console.log(log.last);
        this.updateAuthenticatedSession(request);
        return true;
      }
    },

    _reportError: function (error) {
      csui.require(['csui/dialogs/modal.alert/modal.alert'
      ], function (ModalAlert) {
        ModalAlert.showError(error.toString());
      });
    }
  });

  ServerAdaptorMixin.mixin(InitialHeaderAuthenticator.prototype);

  return InitialHeaderAuthenticator;
});

csui.define('csui/utils/headerauthenticator',[
  'csui/utils/authenticators/initial.header.authenticator'
], function (InitialHeaderAuthenticator) {
  'use strict';

  // TODO: Deprecate this module in favour of depending
  // on the connector automation.
  return InitialHeaderAuthenticator;
});

csui.define('csui/utils/authenticators/interactive.credentials.authenticator',[
  'require', 'module', 'csui/lib/underscore',
  'csui/utils/authenticators/request.authenticator'
], function (require, module, _, RequestAuthenticator) {
  'use strict';

  // Warns, that the developer did not specify any authentication ticket
  // or other header.  There is no interactive authentication in CS UI
  // Widgets.  Integrators have to authenticate, preferably by SSO.
  var InteractiveCredentialsAuthenticator = RequestAuthenticator.extend({
    constructor: function InteractiveCredentialsAuthenticator(options) {
      RequestAuthenticator.prototype.constructor.call(this, options);
    },

    authenticate: function (options, succeeded, failed) {
      // Normalize input parameters, which are all optional.
      if (typeof options === 'function') {
        failed = succeeded;
        succeeded = options;
        options = undefined;
      }

      RequestAuthenticator.prototype.authenticate.call(this, options,
          succeeded, _.bind(this.openSignInDialog, this, succeeded));
    },

    openSignInDialog: function (succeeded) {
      var self = this;
      csui.require(['csui/utils/impl/signin.dialog/signin.dialog'
      ], function (SignInDialog) {
        var dialog = new SignInDialog({
          connection: self.connection
        });
        dialog.show()
              .done(function (args) {
                self.connection.session = args.session;
                succeeded(self.connection);
              });
      });
    }
  });

  return InteractiveCredentialsAuthenticator;
});

csui.define('csui/utils/interactiveauthenticator',[
  'csui/utils/authenticators/interactive.credentials.authenticator'
], function (InteractiveCredentialsAuthenticator) {
  'use strict';

  // TODO: Deprecate this module in favour of depending
  // on the connector automation.
  return InteractiveCredentialsAuthenticator;
});

csui.define('csui/utils/namedlocalstorage',["module", "csui/utils/log", "csui/utils/namedstorage"
], function (module, log, NamedStorage) {

  if (localStorage === undefined) {
    log.warn("Local storage is not available." +
             "  Some information will not be able to be persisted;" +
             " expanded/collapsed state of facet filters, for example.") &&
    console.warn(log.last);
  }

  var NamedLocalStorage = NamedStorage.extend({

    constructor: function NamedLocalStorage(name) {
      NamedStorage.prototype.constructor.call(this, localStorage, name);
    }

  });

  NamedLocalStorage.version = '1.0';

  return NamedLocalStorage;

});


csui.define('csui/utils/node.links/node.links',[
  'csui/lib/underscore', 'csui/lib/backbone', 'csui/utils/url',
  'csui/models/mixins/rules.matching/rules.matching.mixin',
  // Load and register external node link rules
  'csui-ext!csui/utils/node.links/node.links'
], function (_, Backbone, Url, RulesMatchingMixin, rules) {
  'use strict';

  // TODO: Create a lightweight public module for this functionality.
  var config            = window.csui.requirejs.s.contexts._.config
                              .config['csui/pages/start/impl/perspective.router'] || {},
      routesWithSlashes = !config.developmentPage;

  var NodeLinkModel = Backbone.Model.extend({
    defaults: {
      sequence: 100,
      url: null
    },

    constructor: function NodeLinkModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
      this.makeRulesMatching(options);
    }
  });

  RulesMatchingMixin.mixin(NodeLinkModel.prototype);

  var NodeLinkCollection = Backbone.Collection.extend({
    model: NodeLinkModel,
    comparator: 'sequence',

    constructor: function NodeLinkCollection(models, options) {
      Backbone.Collection.prototype.constructor.call(this, models, options);
    },

    getUrl: function (node) {
      // Make the URLs point to the original node, if the current node is
      // a shortcut; leave generation point to itself for now, until
      // we support it properly
      var type = node.get('type');
      if (type === 1 && node.original && node.original.get('id') > 0) {
        node = node.original;
      }
      var rule = this.find(function (item) {
        return item.matchRules(node, item.attributes);
      });
      if (rule) {
        var url = rule.get('getUrl')(node);
        return this.completeUrl(node, url);
      }
    },

    completeUrl: function (node, url) {
      var serverUrl = new Url(node.connector && node.connector.connection.url ||
                              location.href);
      if (!url) {
        url = location.href;
      } else if (url.charAt(0) === '/') {
        if (url.charAt(1) === '/') {
          url = serverUrl.getProtocol() + ':' + url;
        } else {
          url = Url.combine(serverUrl.getOrigin(), url);
        }
      } else if (url.match(/^\?func=[a-z0-9]/i)) {
        url = serverUrl.getCgiScript() + url;
        node.attributes.absoluteUrl = url;
      } else if (url.indexOf('//') < 0) {
        url = this._getApplicationUrlPrefix(serverUrl) + url;
      }
      return url;
    },

    _getApplicationUrlPrefix: function (serverUrl) {
      // Application URLs start after '#' on the development pages, while
      // on the actual server they are merged with the main access point
      var applicationUrlPrefix;
      if (routesWithSlashes) {
        applicationUrlPrefix = Url.combine(serverUrl.getCgiScript(), '/app/');
      } else {
        applicationUrlPrefix = location.origin + location.pathname +
                               location.search + '#';
      }
      return applicationUrlPrefix;
    }
  });

  var nodeLinks = new NodeLinkCollection();

  if (rules) {
    nodeLinks.add(_.flatten(rules, true));
  }

  return nodeLinks;
});

csui.define('csui/utils/page.leaving.blocker',['module', 'csui/lib/jquery'], function (module, $) {

  var listenerRegistered,
      forceDisabled,
      messages = [],

      PageLeavingBlocker = {

        isEnabled: function () {
          return !forceDisabled && messages.length;
        },

        enable: function (message) {
          // The most recent message will be shown, when the user
          // tries to leave the page
          messages.unshift(message);
          ensureListener();
        },

        disable: function () {
          messages.shift();
        },

        forceDisable: function () {
          forceDisabled = true;
        }

      };

  function ensureListener() {
    if (!listenerRegistered) {
      listenerRegistered = true;
      $(window).bind('beforeunload.' + module.id, function (event) {
        if (PageLeavingBlocker.isEnabled()) {
          var message = messages[0];
          if (event) {
            event.originalEvent.returnValue = message; // Gecko, Trident, Chrome 34+
          }
          return message; // Gecko, WebKit, Chrome <34
        }
      });
    }
  }

  return PageLeavingBlocker;

});

csui.define('csui/utils/requestauthenticator',[
  'csui/utils/authenticators/request.authenticator'
], function (RequestAuthenticator) {
  'use strict';

  // TODO: Deprecate this module in favour of using
  // the new one.
  return RequestAuthenticator;
});


csui.define('csui/utils/smart.nodes/smart.nodes',[
  'csui/lib/underscore', 'csui/lib/backbone',
  'csui/models/mixins/rules.matching/rules.matching.mixin',
  // Load and register external Smart UI node rules
  'csui-ext!csui/utils/smart.nodes/smart.nodes'
], function (_, Backbone, RulesMatchingMixin, rules) {
  'use strict';

  var SmartNodeModel = Backbone.Model.extend({
    defaults: {
      sequence: 100
    },

    constructor: function SmartNodeModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
      this.makeRulesMatching(options);
    }
  });

  RulesMatchingMixin.mixin(SmartNodeModel.prototype);

  var SmartNodeCollection = Backbone.Collection.extend({
    model: SmartNodeModel,
    comparator: "sequence",

    constructor: function SmartNodeCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
    },

    isSupported: function (node, options) {
      return this.some(function (item) {
        return item.matchRules(node, item.attributes);
      });
    }
  });

  var smartNodes = new SmartNodeCollection();

  if (rules) {
    smartNodes.add(_.flatten(rules, true));
  }

  return smartNodes;
});

csui.define('csui/utils/authenticators/server.adaptors/basic.mixin',[
  'csui/lib/underscore', 'csui/utils/url'
], function (_, Url) {
  'use strict';

  var ServerAdaptorMixin = {
    mixin: function (prototype) {
      return _.extend(prototype, {
        makeServerAdaptor: function (options) {
          return this;
        },

        prepareRequest: function (options) {
          // Allow calling the login() method directly with partial
          // request settings overriding the authenticator defaults.
          var credentials = options && options.data ||
                            this.connection.credentials;
          return {
            url: Url.combine(this.connection.url, 'auth'),
            headers: {
              authorization: this.formatAuthorizationHeader(credentials)
            }
          };
        }
      });
    }
  };

  return ServerAdaptorMixin;
});

csui.define('csui/utils/authenticators/basic.authenticator',[
  'module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/base',
  'csui/utils/url', 'csui/utils/log', 'csui/utils/namedsessionstorage',
  'csui/utils/authenticators/authenticator',
  'csui/models/mixins/uploadable/uploadable.mixin',
  'csui/utils/authenticators/server.adaptors/basic.mixin'
], function (module, _, $, base, Url, log, NamedSessionStorage,
    Authenticator, UploadableMixin, ServerAdaptorMixin) {
  'use strict';

  var config = _.extend({
    rememberCredentials: true
  }, module.config());

  var storage = new NamedSessionStorage(module.id);

  // Authenticates the requests using the Base Authentication standard;
  // by sending encoded credentials in every request.
  var BasicAuthenticator = Authenticator.extend({
    constructor: function BasicAuthenticator(options) {
      Authenticator.prototype.constructor.call(this, options);
      this.credentials = options && options.credentials;
      this.makeServerAdaptor(options);
    },

    check: function (options, succeeded, failed) {
      log.debug('Checking credentials with {0}.', this.connection.url)
      && console.log(log.last);
      var settings = this.prepareRequest(options);
      return this.makeRequest(settings, succeeded, failed);
    },

    prepareRequest: function (options) {
      return options;
    },

    makeRequest: function (options, succeeded, failed) {
      var headers = _.extend({}, this.connection.headers, options.headers);
      return $.ajax(_.extend({
        timeout: this.connectionTimeout,
        context: this,

        beforeSend: function (request, settings) {
          request.settings = settings;
        },

        success: function (response, textStatus, request) {
          log.debug('Receiving credentials-checking response from {0}.',
              this.connection.url) && console.log(log.last);
          this.doAuthenticate(options);
          if (succeeded) {
            succeeded(this.connection);
          }
          this.trigger('loggedIn', {
            sender: this,
            connection: this.connection
          });
        },

        error: function (request) {
          var error = new base.RequestErrorMessage(request);
          log.warn('Check credentials with {0} failed:\r\n{1}',
            this.connection.url, error) && console.warn(log.last);
          if (failed) {
            failed(error, this.connection);
          }
        }
      }, options, {
        headers: headers
      }));
    },

    doAuthenticate: function (options, succeeded, failed) {
      var credentials = options.credentials ||
                        this.credentials ||
                        this.connection.credentials;
      if (credentials) {
        this.connection.credentials = credentials;
        if (config.rememberCredentials) {
          storage.set(this.connection.url, credentials);
        }
      }
    },

    unauthenticate: function (options) {
      var first = this.isAuthenticated();
      this.connection.credentials = undefined;
      if (config.rememberCredentials) {
        storage.remove(this.connection.url);
      }
      if (first) {
        this.trigger('loggedOut', {
          sender: this,
          connection: this.connection,
          reason: options && options.reason
        });
      }
      return this;
    },

    isAuthenticated: function () {
      return !!this.connection.credentials;
    },

    syncStorage: function () {
      if (!this.connection.credentials && config.rememberCredentials) {
        this.connection.credentials = storage.get(this.connection.url);
      }
      return this;
    },

    setAuthenticationHeaders: function (headers) {
      headers.authorization = this.formatAuthorizationHeader(
        this.connection.credentials);
    },

    formatAuthorizationHeader: function (credentials) {
      return 'Basic ' + btoa(unescape(encodeURIComponent(
        credentials.username + ':' + credentials.password)));
    }
  });

  ServerAdaptorMixin.mixin(BasicAuthenticator.prototype);

  return BasicAuthenticator;
});

csui.define('csui/utils/authenticators/server.adaptors/credentials.mixin',[
  'csui/lib/underscore', 'csui/utils/url'
], function (_, Url) {
  'use strict';

  var ServerAdaptorMixin = {
    mixin: function (prototype) {
      return _.extend(prototype, {
        makeServerAdaptor: function (options) {
          return this;
        },

        prepareRequest: function (options) {
          // Allow calling the login() method directly with partial
          // request settings overriding the authenticator defaults.
          var credentials = options && options.data ||
                            this.connection.credentials;
          return {
            type: 'POST',
            url: Url.combine(this.connection.url, 'auth'),
            data: {
              username: credentials.username,
              password: credentials.password,
              domain: ''
            }
          };
        }
      });
    }
  };

  return ServerAdaptorMixin;
});

csui.define('csui/utils/authenticators/credentials.authenticator',[
  'require', 'csui/utils/authenticators/request.authenticator',
  'csui/utils/authenticators/server.adaptors/credentials.mixin'
], function (require, RequestAuthenticator, ServerAdaptorMixin) {
  'use strict';

  // Authenticates the requests using the Base Authentication standard;
  // by sending encoded credentials in every request.
  var CredentialsAuthenticator = RequestAuthenticator.extend({
    constructor: function CredentialsAuthenticator(options) {
      RequestAuthenticator.prototype.constructor.call(this, options);
      this.credentials = options && options.credentials;
      this.makeServerAdaptor(options);
    },

    doAuthenticate: function (options, succeeded, failed) {
      var credentials = options.credentials ||
                        this.credentials ||
                        this.connection.credentials,
          self = this;
      if (credentials) {
        this.connection.credentials = credentials;
        this.login({}, succeeded, function (error, connection) {
          self._reportError(error);
          self.unauthenticate({reason: 'failed'});
          if (failed) {
            failed(error, connection);
          }
        });
        return true;
      }
    },

    _reportError: function (error) {
      csui.require(['csui/dialogs/modal.alert/modal.alert'
      ], function (ModalAlert) {
        ModalAlert.showError(error.toString());
      });
    }
  });

  ServerAdaptorMixin.mixin(CredentialsAuthenticator.prototype);

  return CredentialsAuthenticator;
});

csui.define('csui/utils/authenticators/regular.header.authenticator',[
  'module', 'csui/lib/underscore', 'csui/utils/log',
  'csui/utils/authenticators/authenticator', 'csui/utils/namedsessionstorage'
], function (module, _, log, Authenticator, NamedSessionStorage) {
  'use strict';

  var config = _.extend({
    rememberAuthenticationHeaders: true
  }, module.config());

  var storage = new NamedSessionStorage(module.id);

  var RegularHeaderAuthenticator = Authenticator.extend({
    constructor: function RegularHeaderAuthenticator(options) {
      Authenticator.prototype.constructor.call(this, options);
    },

    doAuthenticate: function (options, succeeded, failed) {
      var headers = options.headers ||
                    this.connection.authenticationHeaders;
      if (headers) {
        this.connection.authenticationHeaders = headers;
        if (config.rememberAuthenticationHeaders) {
          storage.remove(this.connection.url);
        }
      }
    },

    unauthenticate: function (options) {
      this.connection.authenticationHeaders = undefined;
      if (config.rememberAuthenticationHeaders) {
        storage.remove(this.connection.url);
      }
      return this;
    },

    isAuthenticated: function () {
      return !!this.connection.authenticationHeaders;
    },

    syncStorage: function () {
      if (!this.connection.authenticationHeaders &&
          config.rememberAuthenticationHeaders) {
        this.connection.authenticationHeaders = storage.get(this.connection.url);
      }
      return this;
    },

    setAuthenticationHeaders: function (headers) {
      _.extend(headers, this.connection.authenticationHeaders);
    }
  });

  return RegularHeaderAuthenticator;
});

csui.define('csui/utils/authenticators/core.authenticators',[
  'module', 'csui/lib/underscore',
  'csui/utils/authenticators/ticket.authenticator',
  'csui/utils/authenticators/basic.authenticator',
  'csui/utils/authenticators/credentials.authenticator',
  'csui/utils/authenticators/regular.header.authenticator',
  'csui/utils/authenticators/initial.header.authenticator',
  'csui/utils/authenticators/interactive.credentials.authenticator'
], function (module, _, TicketAuthenticator, BasicAuthenticator,
     CredentialsAuthenticator, RegularHeaderAuthenticator,
     InitialHeaderAuthenticator, InteractiveCredentialsAuthenticator) {
  'use strict';

  var config = window.csui.requirejs.s.contexts._.config
      .config['csui/utils/interactiveauthenticator'] || {},
      enableInteractiveAuthenticator = config.enabled;
  config = _.extend({
    enableInteractiveAuthenticator: enableInteractiveAuthenticator != null ?
	                            enableInteractiveAuthenticator : true,
    forceBasicAuthenticator: false,
    preferBasicAuthenticator: false,
    preferRegularHeaderAuthenticator: false
  }, module.config());

  return [
    {
      authenticator: BasicAuthenticator,
      sequence: 50,
      decides: function (connection) {
        return config.forceBasicAuthenticator ||
               connection.credentials && config.preferBasicAuthenticator;
      }
    },
    {
      authenticator: RegularHeaderAuthenticator,
      sequence: 50,
      and: {
        has: 'authenticationHeaders',
        decides: function () {
          return config.preferRegularHeaderAuthentication;
        }
      }
    },
    {
      authenticator: CredentialsAuthenticator,
      has: 'credentials'
    },
    {
      authenticator: InitialHeaderAuthenticator,
      has: 'authenticationHeaders'
    },
    {
      sequence: 1000,
      authenticator: config.enableInteractiveAuthenticator ?
                     InteractiveCredentialsAuthenticator : TicketAuthenticator
    }
  ];
});

csui.define('csui/utils/authenticator',[
  'csui/utils/authenticators/ticket.authenticator'
], function (TicketAuthenticator) {
  'use strict';

  // TODO: Deprecate this module in favour of depending
  // on the connector automation, or using the new one.
  return TicketAuthenticator;
});

csui.define('csui/utils/basicauthenticator',[
  'csui/utils/authenticators/credentials.authenticator'
], function (CredentialsAuthenticator) {
  'use strict';

  // TODO: Deprecate this module in favour of depending
  // on the connector automation.
  return CredentialsAuthenticator;
});

csui.define('bundles/csui-models',[
  // Models
  'csui/models/action',
  'csui/models/actions',
  'csui/models/actionitem',
  'csui/models/actionitems',
  'csui/models/addabletype',
  'csui/models/addabletypes',
  'csui/models/ancestor',
  'csui/models/ancestors',
  'csui/models/authenticated.user',
  'csui/models/authentication',
  'csui/models/browsing.state/browsing.state',
  'csui/models/browsing.state/browsing.states',
  'csui/models/browsing.state/nodes/nodes.browsing.state',
  'csui/models/clientsidecollection',
  'csui/models/column',
  'csui/models/columns',
  'csui/models/datadefinition',
  'csui/models/datadefinitions',
  'csui/models/favorite2',
  'csui/models/favorite2group',
  'csui/models/favorite2groups',
  'csui/models/favorites2',
  'csui/models/favorite2column',
  'csui/models/favorite2columns',
  'csui/models/favorite.model',
  'csui/models/member',
  'csui/models/member/member.model',
  'csui/models/member/membercollection',
  'csui/models/members',
  'csui/models/node/node.addable.type.collection',
  'csui/models/node/node.model',
  'csui/models/node.children2/node.children2',
  'csui/models/node.columns2',
  'csui/models/nodeancestors',
  'csui/models/nodechildrencolumn',
  'csui/models/nodechildrencolumns',
  'csui/models/nodechildren',
  'csui/models/nodes',
  'csui/models/tool.item.config/tool.item.config.collection',
  'csui/models/tool.item.mask/tool.item.mask.collection',
  'csui/models/server.module/server.module.collection',
  'csui/models/specificnodemodel',

  // Model mixins
  'csui/models/browsable/browsable.mixin',
  'csui/models/browsable/client-side.mixin',
  'csui/models/browsable/v1.request.mixin',
  'csui/models/browsable/v1.response.mixin',
  'csui/models/browsable/v2.response.mixin',
  'csui/models/mixins/autofetchable/autofetchable.mixin',
  'csui/models/mixins/commandable/commandable.mixin',
  'csui/models/mixins/connectable/connectable.mixin',
  'csui/models/mixins/expandable/expandable.mixin',
  'csui/models/mixins/fetchable/fetchable.mixin',
  'csui/models/mixins/including.additional.resources/including.additional.resources.mixin',
  'csui/models/mixins/node.autofetchable/node.autofetchable.mixin',
  'csui/models/mixins/node.connectable/node.connectable.mixin',
  'csui/models/mixins/node.resource/node.resource.mixin',
  'csui/models/mixins/resource/resource.mixin',
  'csui/models/mixins/rules.matching/rules.matching.mixin',
  'csui/models/mixins/syncable.from.multiple.sources/syncable.from.multiple.sources.mixin',
  'csui/models/mixins/uploadable/uploadable.mixin',
  'csui/models/mixins/v2.additional.resources/v2.additional.resources.mixin',
  'csui/models/mixins/v2.commandable/v2.commandable.mixin',
  'csui/models/mixins/v2.delayed.commandable/v2.delayed.commandable.mixin',
  'csui/models/mixins/v2.expandable/v2.expandable.mixin',
  'csui/models/mixins/v2.fields/v2.fields.mixin',
  'csui/models/autofetchable',
  'csui/models/connectable',
  'csui/models/fetchable',
  'csui/models/including.additional.resources',
  'csui/models/nodeautofetchable',
  'csui/models/nodeconnectable',
  'csui/models/noderesource',
  'csui/models/resource',
  'csui/models/uploadable',
  'csui/models/utils/v1tov2',
  'csui/models/version',
  'csui/models/version',
  'csui/models/version',
  'csui/models/widget/widget.collection',
  'csui/models/widget/widget.model',

  // Utilities
  'csui/utils/base',
  'csui/utils/classic.nodes/classic.nodes',
  'csui/utils/connector',
  'csui/utils/defaultactionitems',
  'csui/utils/promoted.actionitems',
  'csui/utils/deepClone/deepClone',
  'csui/utils/errormessage',
  'csui/utils/headerauthenticator',
  'csui/utils/interactiveauthenticator',
  'csui/utils/log',
  'csui/utils/messagehelper',
  'csui/utils/namedlocalstorage',
  'csui/utils/namedsessionstorage',
  'csui/utils/namedstorage',
  'csui/utils/node.links/node.links',
  'csui/utils/nodesprites',
  'i18n!csui/utils/impl/nls/lang',
  'csui/utils/page.leaving.blocker',
  'csui/utils/requestauthenticator',
  'csui/utils/smart.nodes/smart.nodes',
  'csui/utils/types/date',
  'csui/utils/types/localizable',
  'csui/utils/types/member',
  'csui/utils/types/number',
  'csui/utils/url',

  // Authenticators
  'csui/utils/authenticators/authenticator',
  'csui/utils/authenticators/authenticators',
  'csui/utils/authenticators/basic.authenticator',
  'csui/utils/authenticators/core.authenticators',
  'csui/utils/authenticators/credentials.authenticator',
  'csui/utils/authenticators/initial.header.authenticator',
  'csui/utils/authenticators/interactive.credentials.authenticator',
  'csui/utils/authenticators/regular.header.authenticator',
  'csui/utils/authenticators/request.authenticator',
  'csui/utils/authenticators/ticket.authenticator',
  'csui/utils/authenticator',
  'csui/utils/basicauthenticator',
  'csui/utils/headerauthenticator',
  'csui/utils/interactiveauthenticator',
  'csui/utils/requestauthenticator',

  // Server Adaptors
  // TODO: Move them to the csui-server-adaptors bundle.
  'csui/models/authenticated.user/server.adaptor.mixin',
  'csui/models/member/server.adaptor.mixin',
  'csui/models/node/server.adaptor.mixin',
  'csui/models/node.children/server.adaptor.mixin',
  'csui/models/node.children2/server.adaptor.mixin',
  'csui/utils/authenticators/server.adaptors/basic.mixin',
  'csui/utils/authenticators/server.adaptors/credentials.mixin',
  'csui/utils/authenticators/server.adaptors/initial.header.mixin'
], {});

