/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery'
], function (_, $) {

  var AdditionalResourcesV2Mixin = {

    mixin: function (prototype) {

      return _.extend(prototype, {

        makeAdditionalResourcesV2Mixin: function (options) {
          this._additionalResources = [];
          if (options && options.includeResources) {
            this.includeResources(options.includeResources);
          }
          return this;
        },

        includeResources: function (names) {
          if (names && !_.isArray(names)) {
            names = names.split(',');
          }
          this._additionalResources = _.union(this._additionalResources, names);
        },

        excludeResources: function (names) {
          if (names) {
            if (!_.isArray(names)) {
              names = names.split(',');
            }
            this._additionalResources = _.reject(this._additionalResources, names);
          } else {
            this._additionalResources.splice(0, this._additionalResources.length);
          }
        },

        getAdditionalResourcesUrlQuery: function () {
          return _.reduce(this._additionalResources, function (result, parameter) {
            result[parameter] = '';
            return result;
          }, {});
        }

      });

    }

  };

  return AdditionalResourcesV2Mixin;

});
