/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

// jQuery.parseParams 0.1.0
// https://gist.github.com/prantlf/061e3911cd450491f84aac40292b7e7c
//
// Copyright (c) 2015-2017 Ferdinand Prantl
// Licensed under the MIT license.
//
// Reverses the $.param effect - parses the URL query part into an object
// with parameter names as keys pointing to parameter values; normalizes
// all parameter names to lower-case and saves multiple parameters with
// the same name to arrays

// [OT] Modifications done:
//
// * Replace module pattern csui AMD at the top and bottom of the file
// * Set $.parseParam for compatibility
// * Return $.parseParams

// [OT] Declare a csui module
define(['csui/lib/jquery'], function ($) {
  'use strict';

  $.parseParams = function (query) {
    var result = {};

    query || (query = '');
    // Make passing of location.search easier, which includes the leading "?"
    if (query.charAt(0) === '?') {
      query = query.substr(1);
    }
    // $.param additionally replaces "%20" by "+" after encoding a value
    query = query.replace(/\+/g, ' ');

    $.each(query.split('&'), function (index, parameter) {
      var keyAndValue = parameter.split('='),
          name = decodeURIComponent(keyAndValue[0]).toLowerCase(),
          value = keyAndValue.length > 1 &&
                  decodeURIComponent(keyAndValue[1]) || '',
          values = result[name];
      if (name) {
        if (values !== undefined) {
          if (Array.isArray(values)) {
            values.push(value);
          } else {
            result[name] = [values, value];
          }
        } else {
          result[name] = value;
        }
      }
    });

    return result;
  };

  // [OT] Set $.parseParam for compatibility
  $.parseParam = $.parseParams;
  // [OT] Return function pointer
  return $.parseParam;
});