/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/marionette', 'csui/utils/base', 'csui/utils/log'
], function (_, $, Backbone, Marionette, base, log) {
  'use strict';

  var Context = Marionette.Controller.extend({

    constructor: function Context(options) {
      this.cid = _.uniqueId('context');
      Marionette.Controller.prototype.constructor.apply(this, arguments);
      this._factories = {};
      _.each(this.options.factories, function (object, key) {
        object.internal = true;
      });
    },
    getModel: getObject,      // NodeModel, e.g.
    getCollection: getObject, // FavoriteCollection, e.g.
    getObject: getObject,     // Connector, e.g.
    hasModel: hasObject,      // NodeModel, e.g.
    hasCollection: hasObject, // FavoriteCollection, e.g.
    hasObject: hasObject,     // Connector, e.g.

    getFactory: function (Factory, options) {
      return this._getFactory(Factory, options, true);
    },

    clear: function (options) {
      log.info('Clearing the context started.') && console.log(log.last);
      this.triggerMethod('before:clear', this);
      if (options && options.all) {
        this._destroyAllFactories();
      } else {
        this._destroyNonPermanentFactories();
      }
      log.info('Clearing the context succeeded.') && console.log(log.last);
      this.triggerMethod('clear', this);
      return this;
    },

    fetch: function (options) {
      log.info('Fetching the context started.') && console.log(log.last);
      this.triggerMethod('request', this);
      this._destroyTemporaryFactories();
      var self = this,
          promises = _.chain(this._factories)
              .filter(function (factory) {
                return self._isFetchable(factory);
              })
              .map(function (factory) {
                var clonedOptions = options ? _.clone(options) : {};
                return factory.fetch(clonedOptions);
              })
              .compact()
              .value();
      return $.when
          .apply($, promises)
          .then(function () {
            log.info('Fetching the context succeeded.') && console.log(log.last);
            self.triggerMethod('sync', self);
          }, function (request, statusText, messageText) {
            var error = new base.Error(request);
            log.error('Fetching the context failed: {0}', error) &&
            console.error(log.last);
            self.triggerMethod('error', error);
            return $.Deferred().reject(error);
          });
    },

    _isFetchable: function (factory) {
      if (factory.options.detached) {
        return false;
      }
      if (factory.isFetchable) {
        return factory.isFetchable();
      }
      return !!factory.fetch;
    },

    _destroyTemporaryFactories: function () {
      this._factories = _.pick(this._factories, function (factory) {
        if (factory.options.temporary) {
          factory.destroy();
        } else {
          return true;
        }
      }, this);
    },

    _destroyNonPermanentFactories: function () {
      this._factories = _.pick(this._factories, function (factory) {
        if (factory.options && factory.options.permanent) {
          return true;
        } else {
          factory.destroy();
        }
      }, this);
    },

    _destroyAllFactories: function () {
      _.each(this._factories, function (factory) {
        factory.destroy();
      });
      this._factories = {};
    },

    _getPropertyName: function (Factory, options) {
      options || (options = {});
      var attributes = options.attributes || {};
      if (options.unique) {
        attributes = _.extend({
          stamp: _.uniqueId()
        }, attributes);
      }
      return _.reduce(attributes, function (result, value, key) {
        if (value == null) {
          return result;
        }
        return result + '-' + key + '-' + value;
      }, Factory.prototype.propertyPrefix);
    },

    _getFactory: function (Factory, options, createIfNotFound) {
      if (typeof Factory === 'string') {
        return this._factories[Factory];
      }
      options || (options = {});
      var propertyPrefix = Factory.prototype.propertyPrefix,
          globalOptions = this.options.factories || {},
          objectOptions, nameOptions, factoryOptions;
      if (options.internal) {
        objectOptions = options[propertyPrefix];
        if (objectOptions && !objectOptions.internal &&
            !(objectOptions instanceof Backbone.Model)) {
          nameOptions = {
            attributes: objectOptions.attributes,
            unique: objectOptions.unique
          };
        }
      } else {
        objectOptions = options[propertyPrefix];
        if (objectOptions === undefined && !_.isEmpty(options)) {
          factoryOptions = _.omit(options,
              'detached', 'permanent', 'temporary', 'unique');
          if (!_.isEmpty(factoryOptions)) {
            options[propertyPrefix] = _.defaults(factoryOptions, globalOptions[propertyPrefix]);
          }
        }
        _.defaults(options, {
          internal: true
        }, globalOptions);
        nameOptions = {
          attributes: options.attributes,
          unique: options.unique
        };
        if (!nameOptions.attributes && objectOptions && !objectOptions.internal &&
            !(objectOptions instanceof Backbone.Model)) {
          nameOptions = {
            attributes: objectOptions.attributes,
            unique: objectOptions.unique
          };
        }
      }
      var propertyName = this._getPropertyName(Factory, nameOptions),
          factory = this._factories[propertyName];
      if (!factory && createIfNotFound) {
        options.factoryName = propertyName;
        factory = new Factory(this, options);
        this._factories[propertyName] = factory;
      }
      return factory;
    }

  });

  function getObject(Factory, options) {
    var factory = this._getFactory(Factory, options, true);
    return factory.property;
  }

  function hasObject(Factory, options) {
    return !!this._getFactory(Factory, options, false);
  }

  return Context;

});
