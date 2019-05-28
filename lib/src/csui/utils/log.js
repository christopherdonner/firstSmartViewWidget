/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/jquery', 'csui/lib/underscore',
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
    if (config.window) {
      appender = new log4javascript.PopUpAppender();
      appender.setNewestMessageAtTop(false);
      appender.setScrollToLatestMessage(true);
      appender.setLayout(new log4javascript.PatternLayout(
          '%d{HH:mm:ss.SSS} %-5p - %m{1}'));
      logger.addAppender(appender);
    }
    if (config.page) {
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
