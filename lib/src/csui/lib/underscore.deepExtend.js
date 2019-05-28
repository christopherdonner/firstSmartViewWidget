/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

/* implementation: Copyright (C) 2012-2013 Kurt Milam - http://xioup.com | Source: https://gist.github.com/1868955
*  NPM packaging: Copyright (C) 2012-2014 Pierre-Yves Gérardy | https://github.com/pygy/underscoreDeepExtend
*
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
**/

// [OT] Modifications done:
//
// * Replace UMD with csui AMD at the top and bottom of the file

// [OT] Declare a csui module
define(['require'], function (require) {
  'use strict';

  var _;

  function deepExtend(obj) {
    // [OT] Ensure, that _ is not undefined
    // Guard against cyclic dependency. Unfortunately, this module was
    // initially loaded from csui/lib/underscore, while it should be
    // referenced from modules, which use it in their sources.
    if (!_) {
      _ = require('csui/lib/underscore');
    }

    var parentRE = /#{\s*?_\s*?}/,
        slice = Array.prototype.slice,
        hasOwnProperty = Object.prototype.hasOwnProperty;

    _.each(slice.call(arguments, 1), function(source) {
      for (var prop in source) {
        if (hasOwnProperty.call(source, prop)) {
          if (_.isUndefined(obj[prop]) || _.isFunction(obj[prop]) || _.isNull(source[prop]) || _.isDate(source[prop])) {
            obj[prop] = source[prop];
          }
          else if (_.isString(source[prop]) && parentRE.test(source[prop])) {
            if (_.isString(obj[prop])) {
              obj[prop] = source[prop].replace(parentRE, obj[prop]);
            }
          }
          else if (_.isArray(obj[prop]) || _.isArray(source[prop])){
            if (!_.isArray(obj[prop]) || !_.isArray(source[prop])){
              throw 'Error: Trying to combine an array with a non-array (' + prop + ')';
            } else {
              obj[prop] = _.reject(deepExtend(obj[prop], source[prop]), function (item) { return _.isNull(item);});
            }
          }
          else if (_.isObject(obj[prop]) || _.isObject(source[prop])){
            if (!_.isObject(obj[prop]) || !_.isObject(source[prop])){
              throw 'Error: Trying to combine an object with a non-object (' + prop + ')';
            } else {
              obj[prop] = deepExtend(obj[prop], source[prop]);
            }
          } else {
            obj[prop] = source[prop];
          }
        }
      }
    });
    return obj;
  };

  // [OT] Here it would be mixed in to _, but it cannot be, because it
  // has been done in csui/lib/underscore at the beginning.

  return deepExtend;

});
