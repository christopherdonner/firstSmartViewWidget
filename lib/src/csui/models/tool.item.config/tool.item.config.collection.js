/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'require', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/backbone'
], function (module, require, _, $, Backbone) {
  'use strict';

  var configs = module.config().configs || [];
  if (!Array.isArray(configs)) {
    configs = Object
        .keys(configs)
        .reduce(function (result, key) {
          return result.concat(configs[key]);
        }, []);
  }
  configs = configs.map(function (name) {
    return {
      id: name
    };
  });

  var ToolItemConfigCollection = Backbone.Collection.extend({

    constructor: function ToolItemConfigCollection(models, options) {
      models || (models = configs);
      Backbone.Collection.prototype.constructor.call(this, models, options);
     },

    sync: function (method, collection, options) {
      if (method !== 'read') {
        throw new Error('Only fetching tool item configurations is supported.');
      }
      var self = this;
      options = _.extend({}, this.options, options);
      return this._resolveConfigs(options)
                 .then(function () {
                   var response = self.toJSON();
                   options.success && options.success(response, options);
                   self.trigger('sync', self, response, options);
                 });
    },

    _resolveConfigs: function (options) {
      var modules = this.chain()
                        .filter(function (model) {
                          return model.has('id') &&
                                 !(model.has('config') ||
                                   model.has('error'));
                        })
                        .pluck('id')
                        .value(),
          deferred = $.Deferred(),
          self = this;
      if (modules.length) {
        require(modules, function () {
          var configs = arguments;
          modules.forEach(function (module, index) {
            var model = self.get(module);
            model.set('config', configs[index]);
          });
          deferred.resolve();
        }, function (error) {
          self.forEach(function (module) {
            module.set('error', error);
          });
          if (options.ignoreErrors) {
            deferred.resolve();
          } else {
            deferred.reject(error);
          }
        });
      } else {
        deferred.resolve();
      }
      return deferred.promise();
    }

  });

  return ToolItemConfigCollection;

});
