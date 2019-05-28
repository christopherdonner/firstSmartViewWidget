/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/models/mixins/v2.fields/v2.fields.mixin'
], function (_, FieldsV2Mixin) {
  'use strict';

  var ExpandableV2Mixin = {
    mixin: function (prototype) {
      return _.extend(prototype, {
        makeExpandableV2: function (options) {
          this.expand = options && options.expand || {};
          return this;
        },

        setExpand: function (role, names) {
          if (_.isObject(role)) {
            _.each(role, function (value, key) {
              this._setOneExpand(key, value);
            }, this);
          } else {
            this._setOneExpand(role, names);
          }
        },

        resetExpand: function (role, names) {
          if (_.isObject(role)) {
            _.each(role, function (value, key) {
              this._resetOneExpand(key, value);
            }, this);
          } else {
            this._resetOneExpand(role, names);
          }
        },

        getExpandableResourcesUrlQuery: function () {
          return _.reduce(this.expand, function (result, names, role) {
            var expand = result.expand || (result.expand = []),
                encodedNames = _.map(names, encodeURIComponent),
                expandable = encodeURIComponent(role);
            if (encodedNames.length) {
              expandable += '{' + encodedNames.join(',') + '}';
            }
            expand.push(expandable);
            return result;
          }, {});
        },

        _setOneExpand: function (role, names) {
          var expand = this.expand[role] || (this.expand[role] = []);
          if (names) {
            if (!_.isArray(names)) {
              names = names.split(',');
            }
            _.each(names, function (name) {
              if (!_.contains(expand, name)) {
                expand.push(name);
              }
            }, this);
          }
        },

        _resetOneExpand: function (role, names) {
          if (names) {
            var expand = this.expand[role] || (this.expand[role] = []);
            if (!_.isArray(names)) {
              names = names.split(',');
            }
            _.each(names, function (name) {
              var index = _.indexOf(expand, name);
              if (index >= 0) {
                expand.splice(index, 1);
              }
            }, this);
          } else if (role) {
            delete this.expand[role];
          } else {
            _.chain(this.expand)
             .keys()
             .each(function (key) {
               delete this.expand[key];
             }, this);
          }
        }
      });
    },

    mergePropertyParameters: FieldsV2Mixin.mergePropertyParameters
  };

  return ExpandableV2Mixin;
});
