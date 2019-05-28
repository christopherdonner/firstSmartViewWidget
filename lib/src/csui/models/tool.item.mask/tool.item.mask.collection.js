/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'require', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/backbone'
], function (module, require, _, $, Backbone) {
  'use strict';

  var masks = module.config().masks || [];
  if (!Array.isArray(masks)) {
    masks = Object
        .keys(masks)
        .reduce(function (result, key) {
          return result.concat(masks[key]);
        }, []);
  }
  masks = masks.map(function (name) {
    return {
      id: name
    };
  });

  var ToolItemMaskCollection = Backbone.Collection.extend({

    constructor: function ToolItemMaskCollection(models, options) {
      models || (models = masks);
      Backbone.Collection.prototype.constructor.call(this, models, options);
    },

    sync: function (method, collection, options) {
      if (method !== 'read') {
        throw new Error('Only fetching tool item masks is supported.');
      }
      var self = this;
      options = _.extend({}, this.options, options);
      return this._resolveMasks(options)
                 .then(function () {
                   var response = self.toJSON();
                   options.success && options.success(response, options);
                   self.trigger('sync', self, response, options);
                 });
    },

    _resolveMasks: function (options) {
      var modules = this.chain()
                        .filter(function (model) {
                          return model.has('id') &&
                                 !(model.has('mask') ||
                                   model.has('error'));
                        })
                        .pluck('id')
                        .value(),
          deferred = $.Deferred(),
          self = this;
      if (modules.length) {
        require(modules, function () {
          var masks = arguments;
          modules.forEach(function (module, index) {
            var model = self.get(module);
            model.set('mask', masks[index]);
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

  return ToolItemMaskCollection;

});
