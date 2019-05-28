/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/jsonpath'
], function (_, Backbone, jsonPath) {
  'use strict';

  var FormModel = Backbone.Model.extend({

    constructor: function FormModel(attributes, options) {
      this.options = options || (options = {});

      Backbone.Model.prototype.constructor.call(this, attributes, options);
    },

    getValue: function (path) {
      var data = this.get('data');
      if (data && path) {
        data = FormModel.getValueOnPath(data, path);
      } else {
        data = null;
      }
      return data;
    },

    setValue: function (path, value) {
      var data = this.get('data');
      if (data && path) {
        data = FormModel.setValueOnPath(data, path, value);
      } else {
        data = null;
      }
      return data;
    }

  }, {
    getValueOnPath: function (data, path) {
      if (path) {
        path = path
            .replace(/^\//, '$.')
            .replace(/\//, '.');
        data = jsonPath(data, path);
        data = data ? data[0] : null;
      }
      return data;
    },
    setValueOnPath: function (data, path, value) {
      if (path) {
        var name = path.replace(/^.*\/([^\/]+)$/, '$1'),
            index = name.indexOf('[') > 0 ?
                    name.replace(/^.*\[(\d+)\]$/, '$1') : undefined;
        if (index !== undefined) {
          path = path
              .replace(/^(.*)\[[^\]]\]+$/, '$1')
              .replace(/^\//, '$.')
              .replace(/\//, '.');
          data = jsonPath(data, path);
          if (data) {
            data = data[0];
            data[parseInt(index, 10)] = value;
          } else {
            data = null;
          }
        } else {
          path = path
              .replace(/^(.*)\/[^\/]+$/, '$1')
              .replace(/^\//, '$.')
              .replace(/\//, '.');
          if (path && path !== '/') {
            data = jsonPath(data, path);
            if (data) {
              data = data[0];
            }
          }
          if (data) {
            data[name] = value;
          } else {
            data = null;
          }
        }
      }
      return data;
    },

    pluckPrimitiveFields: function (data) {
      function flattenObject(data, result) {
        return _.reduce(_.keys(data), function (result, key) {
          var value = data[key];
          if (_.isArray(value)) {
            result[key] = flattenArray(value);
          } else if (_.isObject(value)) {
            result = flattenObject(value, result);
          } else {
            result[key] = value;
          }
          return result;
        }, result || {}, this);
      }

      function flattenArray(array) {
        return _.map(array, function (item) {
          if (_.isArray(item)) {
            return flattenArray(item);
          } else if (_.isObject(item)) {
            return flattenObject(item);
          } else {
            return item;
          }
        });
      }

      return flattenObject(data);
    }

  });

  return FormModel;

});
