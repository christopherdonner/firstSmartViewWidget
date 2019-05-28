/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone'
], function (module, _, $, Backbone) {
  'use strict';
  var sourceModules = module.config().modules || {},
      serverModules = _.map(sourceModules, function (attributes, id) {
        attributes.id = id;
        return attributes;
      });

  var ServerModuleModel = Backbone.Model.extend({

    defaults: {
      id: null,   // Require.js module prefix used by the server module
      title: null // Displayable title of the server module
    },

    constructor: function ServerModuleModel(attributes, options) {
      ServerModuleModel.__super__.constructor.apply(this, arguments);
    }

  });

  var ServerModuleCollection = Backbone.Collection.extend({

    model: ServerModuleModel,

    constructor: function ServerModuleCollection(models, options) {
      models || (models = serverModules);
      ServerModuleCollection.__super__.constructor.call(this, models, options);
    },

    sync: function (method, collection, options) {
      if (method !== 'read') {
        throw new Error('Only fetching the server modules is supported.');
      }
      var self = this;
      options || (options = {});
      return this._resolveServerModules()
          .then(function () {
            var response = self.toJSON();
            options.success && options.success(response, options);
            self.trigger('sync', self, response, options);
          });
    },

    _resolveServerModules: function (options) {
      options = _.extend({}, this.options, options);
      var deferred = $.Deferred(),
          missing = this.find(function (serverModule) {
            var sourceModule = sourceModules[serverModule.id];
            if (sourceModule) {
              serverModule.set(sourceModule.attributes);
            } else {
              if (!options.ignoreErrors) {
                return true;
              }
            }
          });
      if (missing) {
        var error = new Error('Invalid module prefix: ' + missing.id);
        return deferred.reject(error);
      }
      return deferred.resolve().promise();
    }

  });

  return ServerModuleCollection;

});
