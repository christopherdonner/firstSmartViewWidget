/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['csui/lib/underscore', 'csui/lib/backbone'], function (_, Backbone) {
  function deepClone(source, options) {
    var result = {},
        key;
    if (!source || typeof source !== 'object' || source instanceof HTMLElement ||
        _.isBoolean(source) || _.isNumber(source) || _.isString(source)) {
      return source;
    }
    if (_.isDate(source) || _.isRegExp(source)) {
      return new source.constructor(source.valueOf());
    }
    if (_.isArray(source)) {
      return _.map(source, function (obj) {
        return _.deepClone(obj);
      });
    }
    if (source.constructor !== Object) {
      if (options) {
        if (options.cloneCloneableObjects) {
          if (source.deepClone) {
            return source.deepClone();
          }
          if (source.clone) {
            return source.clone();
          }
        }
        if (options.copyArbitraryObjects) {
          return source;
        }
        if (!options.cloneArbitraryObjects) {
          throw new Error('Cannot clone an arbitrary function object instance');
        }
      } else {
        throw new Error('Cannot clone an arbitrary function object instance');
      }
    }
    return _.reduce(source, function (result, value, key) {
      result[key] = deepClone(value);
      return result;
    }, {});
  }
  _.mixin({deepClone: deepClone});
  Backbone.Model.prototype.deepClone = function (options) {
    return new this.constructor(deepClone(this.attributes, options));
  };
  Backbone.Collection.prototype.deepClone = function (options) {
    return new this.constructor(this.map(function (model) {
      return deepClone(model.attributes, options);
    }));
  };

  return deepClone;

});
