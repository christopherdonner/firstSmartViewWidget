/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery'], function(module, _, $) {
  function asyncElement(parent, selector, options) {
    var deferred = $.Deferred(), el, intervalRef, newOptions = {};
    if (typeof options === 'number') {
      newOptions.interval = options;
    } else if (typeof options === 'boolean') {
      newOptions.removal = options;
    } else {
      newOptions = options;
    }
    options = _.extend({interval: 50, removal: false, length: 0}, newOptions);
    if (!parent || !selector) {
      console.warn('parent or child selector missing');
      deferred.reject();
    } else {
      el = $(parent).find(selector);
      if (options.removal ? el.length === options.length : el.length > options.length) {
        deferred.resolve(el);
      } else {
        intervalRef = setInterval(function () {
          el = $(parent).find(selector);
          if (options.removal ? el.length === options.length : el.length > options.length) {
            clearInterval(intervalRef);
            deferred.resolve(el);
          }
        }, options.interval);
      }
    }
    return deferred.promise();
  }
  return {
    asyncElement: asyncElement
  };
});
