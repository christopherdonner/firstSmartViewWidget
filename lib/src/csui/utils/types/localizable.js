/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'i18n' 
], function (_, i18n) {
  'use strict';

  var locale = i18n.settings.locale,
      language = locale.replace(/[-_]\w+$/, ''),
      defaultLocale = i18n.settings.defaultLocale,
      defaultLanguage = defaultLocale.replace(/[-_]\w+$/, '');

  function getClosestLocalizedString(value, fallback) {
    if (_.isObject(value)) {
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
    var usage = options.usage || 'search',
        filteredOptions = {
          usage: usage,
          sensitivity: usage === 'search' ? 'base' : 'variant',
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
    var maxLength = Math.min(full.length, start.length * 3),
        i;
    for (i = 1; i <= maxLength; ++i) {
      if (localeCompareString(full.substring(0, i), start) === 0) {
        return true;
      }
    }
  }

  function formatMessage(count, messagesObj) {
    var SUCCESS_TYPE = "success";
    var ERROR_TYPE = "error";
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
