/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
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
  function getExactFormat(momentFormat) {
    var formatters     = /\w+/g,
        explicitFormat = momentFormat,
        shift          = 0,
        match, part, partFormat, index;
    while ((match = formatters.exec(momentFormat))) {
      part = match[0];
      partFormat = moment.localeData().longDateFormat(part);
      if (partFormat) {
        index = match.index + shift;
        explicitFormat = explicitFormat.substring(0, index) + partFormat +
                         explicitFormat.substring(index + part.length);
        shift += partFormat.length - part.length;
      }
    }
    return explicitFormat !== momentFormat ?
      getExactFormat(explicitFormat) : explicitFormat;
  }

  function pad(n) {
    return n < 10 ? '0' + n : n;
  }
  function createMoment(text) {
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
  function deserializeDate(text) {
    return text && createMoment(text).toDate();
  }
  function serializeDateTime(date, format, callback) {
    function formatDateTime(date, suffix) {
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
