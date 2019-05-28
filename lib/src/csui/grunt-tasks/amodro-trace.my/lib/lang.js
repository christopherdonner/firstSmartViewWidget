/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

var define = function(fn) { module.exports = fn(); };

define(function () {
    'use strict';

    var lang, isJavaObj,
        hasOwn = Object.prototype.hasOwnProperty;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    isJavaObj = function () {
        return false;
    };
    if (typeof java !== 'undefined' && java.lang && java.lang.Object && typeof importPackage !== 'undefined') {
        isJavaObj = function (obj) {
            return obj instanceof java.lang.Object;
        };
    }

    lang = {
        makeJsArrayString: function (ary) {
            return '["' + ary.map(function (item) {
                return lang.jsEscape(item);
            }).join('","') + '"]';
        },

        backSlashRegExp: /\\/g,
        ostring: Object.prototype.toString,

        isArray: Array.isArray || function (it) {
            return lang.ostring.call(it) === "[object Array]";
        },

        isFunction: function(it) {
            return lang.ostring.call(it) === "[object Function]";
        },

        isRegExp: function(it) {
            return it && it instanceof RegExp;
        },

        hasProp: hasProp,
        falseProp: function (obj, prop) {
            return !hasProp(obj, prop) || !obj[prop];
        },
        getOwn: function (obj, prop) {
            return hasProp(obj, prop) && obj[prop];
        },

        _mixin: function(dest, source, override){
            var name;
            for (name in source) {
                if(source.hasOwnProperty(name) &&
                    (override || !dest.hasOwnProperty(name))) {
                    dest[name] = source[name];
                }
            }

            return dest; // Object
        },
        mixin: function(dest){
            var parameters = Array.prototype.slice.call(arguments),
                override, i, l;

            if (!dest) { dest = {}; }

            if (parameters.length > 2 && typeof arguments[parameters.length-1] === 'boolean') {
                override = parameters.pop();
            }

            for (i = 1, l = parameters.length; i < l; i++) {
                lang._mixin(dest, parameters[i], override);
            }
            return dest; // Object
        },
        deepMix: function(dest, source) {
            lang.eachProp(source, function (value, prop) {
                if (typeof value === 'object' && value &&
                    !lang.isArray(value) && !lang.isFunction(value) &&
                    !(value instanceof RegExp)) {

                    if (!dest[prop]) {
                        dest[prop] = {};
                    }
                    lang.deepMix(dest[prop], value);
                } else {
                    dest[prop] = value;
                }
            });
            return dest;
        },
        deeplikeCopy: function (obj) {
            var type, result;

            if (lang.isArray(obj)) {
                result = [];
                obj.forEach(function(value) {
                    result.push(lang.deeplikeCopy(value));
                });
                return result;
            }

            type = typeof obj;
            if (obj === null || obj === undefined || type === 'boolean' ||
                type === 'string' || type === 'number' || lang.isFunction(obj) ||
                lang.isRegExp(obj)|| isJavaObj(obj)) {
                return obj;
            }
            result = {};
            lang.eachProp(obj, function(value, key) {
                result[key] = lang.deeplikeCopy(value);
            });
            return result;
        },

        delegate: (function () {
            function TMP() {}
            return function (obj, props) {
                TMP.prototype = obj;
                var tmp = new TMP();
                TMP.prototype = null;
                if (props) {
                    lang.mixin(tmp, props);
                }
                return tmp; // Object
            };
        }()),
        each: function each(ary, func) {
            if (ary) {
                var i;
                for (i = 0; i < ary.length; i += 1) {
                    if (func(ary[i], i, ary)) {
                        break;
                    }
                }
            }
        },
        eachProp: function eachProp(obj, func) {
            var prop;
            for (prop in obj) {
                if (hasProp(obj, prop)) {
                    if (func(obj[prop], prop)) {
                        break;
                    }
                }
            }
        },
        bind: function bind(obj, fn) {
            return function () {
                return fn.apply(obj, arguments);
            };
        },
        jsEscape: function (content) {
            return content.replace(/(["'\\])/g, '\\$1')
                .replace(/[\f]/g, "\\f")
                .replace(/[\b]/g, "\\b")
                .replace(/[\n]/g, "\\n")
                .replace(/[\t]/g, "\\t")
                .replace(/[\r]/g, "\\r");
        }
    };
    return lang;
});
