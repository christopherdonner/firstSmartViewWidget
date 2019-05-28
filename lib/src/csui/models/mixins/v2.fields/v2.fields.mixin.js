/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore'], function (_) {
  'use strict';

  var FieldsV2Mixin = {
    mixin: function (prototype) {
      return _.extend(prototype, {
        makeFieldsV2: function (options) {
          this.fields = options && options.fields || {};
          return this;
        },

        setFields: function (role, names) {
          if (_.isObject(role)) {
            _.each(role, function (value, key) {
              this._setOneFieldSet(key, value);
            }, this);
          } else {
            this._setOneFieldSet(role, names);
          }
        },

        resetFields: function (role, names) {
          if (_.isObject(role)) {
            _.each(role, function (value, key) {
              this._resetOneFieldSet(key, value);
            }, this);
          } else {
            this._resetOneFieldSet(role, names);
          }
        },

        getResourceFieldsUrlQuery: function () {
          return _.reduce(this.fields, function (result, names, role) {
            var fields = result.fields || (result.fields = []),
                encodedNames = _.map(names, encodeURIComponent),
                field = encodeURIComponent(role);
            if (encodedNames.length) {
              var dot = field.indexOf('.');
              if (dot > 0) {
                field = field.substring(0, dot) + '{' + encodedNames.join(',') + '}' +
                        field.substring(dot);
              } else {
                field += '{' + encodedNames.join(',') + '}';
              }
            }
            fields.push(field);
            return result;
          }, {});
        },

        _setOneFieldSet: function (role, names) {
          var fields = this.fields[role] || (this.fields[role] = []);
          if (names) {
            if (!_.isArray(names)) {
              names = names.split(',');
            }
            _.each(names, function (name) {
              if (!_.contains(fields, name)) {
                fields.push(name);
              }
            }, this);
          }
        },

        _resetOneFieldSet: function (role, names) {
          if (names) {
            var fields = this.fields[role] || (this.fields[role] = []);
            if (!_.isArray(names)) {
              names = names.split(',');
            }
            _.each(names, function (name) {
              var index = _.indexOf(fields, name);
              if (index >= 0) {
                fields.splice(index, 1);
              }
            }, this);
          } else if (role) {
            delete this.fields[role];
          } else {
            _.chain(this.fields)
             .keys()
             .each(function (key) {
               delete this.fields[key];
             }, this);
          }
        }
      });
    },

    mergePropertyParameters: function (output, input) {
      if (typeof input === 'string') {
        input = input.split(',');
      }
      if (Array.isArray(input)) {
        input = input.reduce(function (result, name) {
          var value = result[name];
          if (!value || value.length) {
            result[name] = [];
          }
          return result;
        }, {});
      }
      output || (output = {});
      _.each(input, function (values, name) {
        var target = output[name];
        if (target) {
          _.each(values, function (value) {
            if (!_.contains(target, value)) {
              target.push(value);
            }
          });
        } else {
          output[name] = values;
        }
      });
      return output;
    }
  };

  return FieldsV2Mixin;
});
