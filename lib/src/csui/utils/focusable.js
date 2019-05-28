/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/ally'
], function (ally) {
  'use strict';

  function findFocusables (selector, rootElement) {
    var context = rootElement ? rootElement.querySelector(selector) : selector;
    return ally.query.focusable({
      context: context,
      includeContext: false,
      strategy: 'quick',
    });
  }

  function isFocusable (element) {
    return ally.is.focusable(element);
  }

  return {
    findFocusables: findFocusables,
    isFocusable: isFocusable
  };
});
