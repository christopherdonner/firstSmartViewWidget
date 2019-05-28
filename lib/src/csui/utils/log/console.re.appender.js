/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/log4javascript'], function (log4javascript) {
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