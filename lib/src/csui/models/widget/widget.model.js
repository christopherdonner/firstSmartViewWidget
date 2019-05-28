/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'require', 'module', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/backbone', 'csui/utils/log',
  'csui/models/server.module/server.module.collection',
  'csui/models/tool.item.config/tool.item.config.collection',
  'csui/models/tool.item.mask/tool.item.mask.collection'
], function (require, module, _, $, Backbone, log,
    ServerModuleCollection, ToolItemConfigCollection, ToolItemMaskCollection) {
  'use strict';

  log = log(module.id);

  var WidgetModel = Backbone.Model.extend({

    defaults: {
      id: null,       // Require.js module ID
      view: null,     // Resolved function object of the widget's view controller
      manifest: null, // Resolved meta-data describing the widget
      error: null     // Error from the widget's resolution if it failed
    },

    constructor: function WidgetModel(attributes, options) {
      this.options = _.defaults({}, options, {
        includeView: true,
        includeManifest: true,
        includeServerModule: true,
        includeToolItems: true
      });
      if (this.options.includeToolItems) {
        this.options.includeManifest = true;
      }
      WidgetModel.__super__.constructor.call(this, attributes, this.options);
      this.serverModule = new ServerModuleCollection.prototype.model();
      this.actions = new Backbone.Collection();
    },

    getDefaultData: function () {
      var manifest = this.get('manifest');
      return manifest ? this._getDefaultPropertyValue(manifest.schema) : {};
    },

    _getDefaultPropertyValue: function (schema) {
      if (schema) {
        if (schema.type === 'object') {
          return _.reduce(schema.properties,
              function (result, propertySchema, propertyName) {
                result[propertyName] = this._getDefaultPropertyValue(propertySchema);
                return result;
              }, {}, this);
        }
        return schema['default'];
      }
    },

    _getDefaultPrimitiveValue: function (schema) {
      if (schema) {
        var value = schema['default'];
        if (value !== undefined) {
          return value;
        }
        switch (schema.type) {
        case 'string':
          return '';
        case 'integer':
        case 'number':
          return 0;
        case 'boolean':
          return false;
        case 'array':
          return [];
        case 'null':
          return null;
        }
      }
    },

    sync: function (method, collection, options) {
      if (method !== 'read') {
        throw new Error('Only fetching the widget is supported.');
      }
      options = _.extend({}, this.options, options);
      _.defaults(options, {
        includeView: this.options.includeView,
        includeManifest: this.options.includeManifest,
        includeServerModule: this.options.includeServerModule,
        includeToolItems: this.options.includeToolItems
      });
      if (options.includeToolItems) {
        options.includeManifest = true;
      }
      var serverModulesPromise = this._resolveServerModules(options),
          toolItemsPromise     = this._resolveToolItems(options),
          toolItemMasksPromise = this._resolveToolItemMasks(options),
          self = this;
      return $.when(serverModulesPromise, toolItemsPromise, toolItemMasksPromise)
              .then(_.bind(this._resolveWidget, this, options))
              .then(function () {
                var response = self.toJSON();
                options.success && options.success(response, options);
                self.trigger('sync', self, response, options);
              }, function () {
                var error = self.get('error');
                options.error && options.error(error, options);
                self.trigger('error', self, error, options);
                return $.Deferred().reject(error);
              });
    },

    _resolveWidget: function (options) {
      var viewPromise     = this._resolveView(options),
          manifestPromise = this._resolveManifest(options),
          self = this;
      return $.when(viewPromise, manifestPromise)
              .then(function () {
                self._updateServerModule(options);
                self._updateActions(options);
              });
    },

    _resolveView: function (options) {
      var deferred = $.Deferred();
      if (options.includeView) {
        var self       = this,
            widgetData = this.getModuleData(),
            viewPath   = this.getViewModulePath(widgetData);
        require([viewPath],
            function (View) {
              self.set('view', View);
              deferred.resolve();
            }, function (error) {
              self.set('error', error);
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
    },

    _resolveManifest: function (options) {
      var deferred = $.Deferred();
      if (options.includeManifest) {
        var self         = this,
            widgetData   = this.getModuleData(),
            manifestPath = this.getManifestModulePath(widgetData);
        require([manifestPath],
            function (manifest) {
              if (self._needsLocalization(manifest)) {
                var manifestLocalizedPath = self.getLocalizedManifestModulePath(widgetData);
                require([manifestLocalizedPath],
                    function (manifestLocalized) {
                      manifest = self._renderLocalizedManifest(manifestPath,
                          manifest, manifestLocalized);
                      self.set('manifest', manifest);
                      deferred.resolve();
                    }, function (error) {
                      if (!self.has('error')) {
                        self.set('error', error);
                      }
                      if (options.ignoreErrors || options.ignoreManifestErrors) {
                        self.set('manifest', manifest);
                        deferred.resolve();
                      } else {
                        deferred.reject(error);
                      }
                    });
              } else {
                self.set('manifest', manifest);
                deferred.resolve();
              }
            }, function (error) {
              if (!self.has('error')) {
                self.set('error', error);
              }
              if (options.ignoreErrors || options.ignoreManifestErrors) {
                self.set('manifest', {});
                deferred.resolve();
              } else {
                deferred.reject(error);
              }
            });
      } else {
        deferred.resolve();
      }
      return deferred.promise();
    },

    _resolveServerModules: function (options) {
      var serverModules;
      if (options.includeServerModule && !options.serverModules) {
        options.serverModules = serverModules = new ServerModuleCollection();
        return serverModules.fetch({ignoreErrors: options.ignoreErrors});
      }
      return $.Deferred().resolve().promise();
    },

    _resolveToolItems: function (options) {
      var toolItems;
      if (options.includeToolItems && !options.toolItems) {
        options.toolItems = toolItems = new ToolItemConfigCollection();
        return toolItems.fetch({ignoreErrors: options.ignoreErrors});
      }
      return $.Deferred().resolve().promise();
    },

    _resolveToolItemMasks: function (options) {
      var toolItemMasks;
      if (options.includeToolItems && !options.toolItemMasks) {
        options.toolItemMasks = toolItemMasks = new ToolItemMaskCollection();
        return toolItemMasks.fetch({ignoreErrors: options.ignoreErrors});
      }
      return $.Deferred().resolve().promise();
    },

    _getModulePrefix: function () {
      var name       = this.get('id'),
          firstSlash = name.indexOf('/');
      return firstSlash < 0 ? 'csui' : name.substring(0, firstSlash);
    },

    getModuleData: function () {
      var name      = this.get('id'),
          lastSlash = name.lastIndexOf('/'),
          path;
      if (lastSlash < 0) {
        path = 'csui/widgets/' + name;
      } else {
        path = name;
        name = name.substring(lastSlash + 1);
      }
      return {
        name: name,
        path: path
      };
    },

    getViewModulePath: function (moduleData) {
      return moduleData.path + '/' + moduleData.name + '.view';
    },

    getManifestModulePath: function (moduleData) {
      return 'json!' + moduleData.path + '/' + moduleData.name + '.manifest.json';
    },

    getLocalizedManifestModulePath: function (moduleData) {
      return 'i18n!' + moduleData.path + '/impl/nls/' + moduleData.name + '.manifest';
    },

    _updateServerModule: function (options) {
      if (options.includeServerModule) {
        var modulePrefix = this._getModulePrefix(),
            serverModule = options.serverModules.get(modulePrefix),
            attributes   = serverModule && serverModule.toJSON() ||
                {id: modulePrefix};
        this.serverModule.set(attributes);
      }
    },

    _updateActions: function (options) {
      if (options.includeToolItems) {
        var manifest = this.get('manifest'),
            actions = manifest && manifest.actions;
        this.actions.reset(actions, {silent: true});
        this.actions.each(function (action) {
          action.toolItems = options.toolItems.get(action.get('toolItems'));
          action.toolItemMasks = options.toolItemMasks.get(action.get('toolItemMasks'));
          action.toolbars = new Backbone.Collection(action.get('toolbars'));
        });
        if (!options.silent) {
          this.actions.trigger('reset', this.actions, options);
        }
      }
    },

    _renderLocalizedManifest: function (manifestPath, manifest, localizedManifest) {
      function traverseManifest(object, localizedManifestParent) {
        var key, value, localizationKey, arrayItem, localizationArrayItem, i;
        function getLocalizationKey(value) {
          return _.isString(value) && value.indexOf('{{') === 0 &&
                 value.lastIndexOf('}}') === value.length - 2 &&
                 value.substring(2, value.length - 2);
        }
        for (key in object) {
          if (object.hasOwnProperty(key)) {
            value = object[key];
            localizationKey = getLocalizationKey(value);
            if (localizationKey) {
              object[key] = localizedManifestParent[localizationKey] ||
                            localizedManifestParent[key] ||
                            value;
            } else if (_.isArray(value)) {
              localizationArrayItem = localizedManifestParent[key] || [];
              for (i = 0; i < value.length; ++i) {
                arrayItem = value[i];
                localizationKey = getLocalizationKey(arrayItem);
                if (localizationKey) {
                  value[i] = localizationArrayItem[i] ||
                             localizedManifestParent[localizationKey] ||
                             localizedManifestParent[key] ||
                             arrayItem;
                } else if (_.isObject(arrayItem)) {
                  value[i] = traverseManifest(arrayItem, localizationArrayItem[i] ||
                                                         localizedManifestParent);
                }
              }
            } else if (_.isObject(value)) {
              if (localizedManifestParent[key]) {
                log.warn(
                    'Hierarchical format has been detected in the localization ' +
                    'module "{0}". It has been deprecated and the support for it ' +
                    'will be removed. Please, change it to the flat format as soon ' +
                    'as possible. Although JSON format allows using nested objects, ' +
                    'automated translation tools can handle only key-value pairs. ' +
                    'That is why localization modules has to contain only one ' +
                    'object with properties pointing to strings.', manifestPath)
                && console.log(log.last);
              }
              object[key] = traverseManifest(value, localizedManifestParent[key] ||
                                                    localizedManifestParent);
            }
          }
        }
        return object;
      }

      return traverseManifest(manifest, localizedManifest);
    },

    _needsLocalization: function (object) {
      function isLocalizableString(value) {
        return typeof value === 'string' && value.indexOf('{{') === 0 &&
               value.lastIndexOf('}}') === value.length - 2;
      }

      var value;

      for (var key in object) {
        if (object.hasOwnProperty(key)) {
          value = object[key];
          if (isLocalizableString(value)) {
            return true;
          } else if (_.isArray(value)) {
            for (var i = 0; i < value.length; i++) {
              if (isLocalizableString(value[i])) {
                return true;
              }
            }
          } else if (typeof value === 'object') {
            return this._needsLocalization(value);
          }
        }
      }
    }

  });

  return WidgetModel;

});
