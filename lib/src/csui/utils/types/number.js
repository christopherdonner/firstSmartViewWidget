/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
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
