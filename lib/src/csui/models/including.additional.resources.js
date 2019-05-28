/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/utils/log'
], function (module, _, log) {
  'use strict';

  log = log(module.id);

  function IncludingAdditionalResources(ParentModel) {
    var prototype = {

      makeIncludingAdditionalResources: function (options) {
        this._additionalResources = [];
        if (options && options.includeResources) {
          this.includeResources(options.includeResources);
        }
        return this;
      },

      includeResources: function (names) {
        if (!_.isArray(names)) {
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
          this._additionalResources = [];
        }
      },

      getAdditionalResourcesUrlQuery: function () {
        return _.reduce(this._additionalResources, function (result, parameter) {
          result[parameter] = 'true';
          return result;
        }, {});
      }

    };
    prototype.IncludingAdditionalResources = _.clone(prototype);

    return prototype;
  }

  return IncludingAdditionalResources;

});
