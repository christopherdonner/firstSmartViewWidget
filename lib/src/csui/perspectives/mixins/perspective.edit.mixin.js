/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(
    ['require', 'csui/lib/underscore', 'csui/lib/jquery', "csui/utils/log",
      'i18n!csui/perspectives/impl/nls/lang', 'csui/models/node/node.model',
      'csui/models/widget/widget.model'],
    function (require, _, $, log, lang, NodeModel, WidgetModel) {
      'use strict';
      var PerspectiveEditMixin = {
        mixin: function (prototype) {
          return _.extend(prototype, {
            prepareForEditMode: function () {
              this.listenTo(this, 'update:widget:options',
                  function (widgetView, isValid, options) {
                    var widget = widgetView.model.get('widget');
                    if (widget.type === 'csui/perspective.manage/widgets/perspective.widget') {
                      widget = widget.options;
                    }
                    widget.options = options;
                    widgetView.model.set('hasValidOptions', isValid, {
                      silent: true
                    });
                  });
            },

            _resolveWidget: function (widget) {
              var deferred = $.Deferred();
              var widgetModel = new WidgetModel({id: widget.type});
              widgetModel.fetch().then(function () {
                widget.view = widgetModel.get('view');
                deferred.resolve(widgetModel);
              }, function (error) {
                deferred.reject(error);
              });
              return deferred.promise();
            },
            serializeWidget: function (model) {
              var deferred = $.Deferred();
              if (model.get('hasValidOptions') !== false) {
                var widget  = model.get('widget'),
                    kind    = widget.kind,
                    type    = widget.type,
                    cid     = widget.cid,
                    options = widget.options;
                if (type === 'csui/perspective.manage/widgets/perspective.widget') {
                  type = options.widget.id;
                  options = options.options;
                }
                deferred.resolve({
                  widget: {
                    type: type,
                    kind: kind,
                    options: options,
                    c_id: cid
                  }
                });
              } else {
                deferred.reject({
                  error: lang.invalidWidgetOptions
                });
              }
              return deferred.promise();
            },
            executeCallbacks: function (models, perspectiveModel) {
              this.perspectiveWidgets = models;
              var deferred = $.Deferred();
              this.loadCallbacks(models).then(_.bind(function (widgetsWithCallback) {
                var promises = _.map(widgetsWithCallback,
                    _.bind(function (widgetWithCallback) {
                      return this.initializeWidget(widgetWithCallback, perspectiveModel);
                    }, this));
                $.whenAll.apply($, promises)
                    .then(function () {
                      deferred.resolve();
                    });
              }, this));
              return deferred.promise();
            },

            loadCallbacks: function (models) {
              var self     = this,
                  deferred = $.Deferred(),
                  promises = _.chain(models)
                      .groupBy(function (model) {
                        return model.widget.type;
                      })
                      .map(function (widgetType) {
                        var deferredEach = $.Deferred();
                        self._resolveWidget(widgetType[0].widget).done(function (widgetModel) {
                          var widgetManifest = widgetModel ? widgetModel.get('manifest') :
                                               false,
                              widgetCallback = widgetManifest ? widgetManifest.callback : false;
                          if (widgetCallback) {
                            require([widgetCallback], function (callback) {
                              if (callback && _.isFunction(callback)) {
                                widgetModel.type = widgetModel.id;
                                deferredEach.resolve(_.extend(widgetModel, new callback()));
                              } else {
                                deferredEach.reject();
                              }
                            }, function (error) {
                              log.warn('Failed to load callback. {0}', error);
                              deferredEach.reject(error);
                            });
                          } else {
                            deferredEach.resolve();
                          }
                        });
                        return deferredEach.promise();
                      })
                      .compact()
                      .value();
              $.whenAll.apply($, promises)
                  .then(function (results) {
                    deferred.resolve(_.compact(results));
                  });
              return deferred.promise();
            },

            initializeWidget: function (widgetWithCallback, perspectiveModel) {
              var deferred   = $.Deferred(),
                  widgets    = _.filter(this.perspectiveWidgets, function (widget) {
                    return widget.widget.type === widgetWithCallback.type;
                  }),
                  mode       = perspectiveModel.get('id') ? 'update' :
                               'create',
                  settings   = {
                    priority: parseInt(perspectiveModel.get('priority')) || undefined,
                    title: perspectiveModel.get('title') || '',
                    overrideType: perspectiveModel.get('overrideType'),
                    scope: perspectiveModel.get('scope') || '',
                    containerType: parseInt(perspectiveModel.get('containerType')) ||
                                   undefined,
                    perspectiveParentId: parseInt(perspectiveModel.get('override_id')) ||
                                         parseInt(perspectiveModel.get('perspectivesVolId')) ||
                                         undefined,
                    overrideObjId: parseInt(perspectiveModel.get('node')) || undefined,
                    assetContainerId: perspectiveModel.get('assetContainerId') || undefined
                  },
                  parameters = {
                    mode: mode,
                    widgets: widgets,
                    settings: settings,
                    connector: perspectiveModel.connector
                  };
              if (mode == 'update') {
                var previousPerspectiveWidgets = this.getPreviousWidgets &&
                                                 this.getPreviousWidgets(perspectiveModel);
                parameters.previousWidgets = _.filter(previousPerspectiveWidgets,
                    function (widget) {
                      return widget.widget.type === widgetWithCallback.type;
                    });
              }
              var callbackPromise = this.getHiddenWidgetOptions(widgetWithCallback, parameters),
                  that            = this;
              $.when(callbackPromise)
                  .done(_.bind(function (responseParameters) {
                    deferred.resolve();
                  }, this))
                  .fail(function (error) {
                    deferred.reject(error);
                  });
              return deferred.promise();
            },

            getHiddenWidgetOptions: function (widgetWithCallback, parameters) {
              var deferredOptions        = $.Deferred(),
                  deferredContainer      = $.Deferred(),
                  widgetPromises         = [],
                  errors                 = [],
                  ensureContainerPromise = deferredContainer.promise(), // note: no response argument - i.e. an empty promise
                  useOverrideContainer   = false;
              if (!widgetWithCallback || !_.has(widgetWithCallback, 'defineWidgetOptionsCommon') ||
                  !_.has(widgetWithCallback, 'defineWidgetOptionsEach')) {
                deferredOptions.reject();
                return deferredOptions.promise();
              }
              if (_.has(widgetWithCallback, 'ensureContainer') &&
                  _.isFunction(widgetWithCallback.ensureContainer)) {
                if (widgetWithCallback.ensureContainer(parameters)) {
                  ensureContainerPromise = this.ensureContainer(parameters);
                } else {
                  useOverrideContainer = true;
                }
              } else {
                useOverrideContainer = true;
              }

              if (useOverrideContainer) {
                deferredContainer.resolve();
              }

              $.when(ensureContainerPromise).done(function (response) {

                if (!_.has(parameters.settings, 'assetContainerId') ||
                    _.isUndefined(parameters.settings.assetContainerId)) {
                  var id = (response) ? response.id : parameters.settings.overrideObjId, // no response if ensureContainer was an empty promise
                      ac = {assetContainerId: id};

                  _.extend(parameters.settings, ac); // the containerId is required by the callback
                }

                var promiseBefore = widgetWithCallback.defineWidgetOptionsCommon(parameters);
                if (!promiseBefore || typeof promiseBefore != 'object' ||
                    !_.has(promiseBefore, 'state')) {
                  deferredOptions.reject();
                  return deferredOptions.promise();
                }
                $.when(promiseBefore).done(function (commonOptions) {
                  if (_.has(parameters, 'widgets') && _.isArray(parameters.widgets)) {

                    _.each(parameters.widgets, function (item, index) {

                      if (!_.has(item, 'newOptions')) {
                        item.newOptions = {};
                      }

                      _.extend(item.newOptions, commonOptions);
                      widgetPromises.push(widgetWithCallback.defineWidgetOptionsEach(item,
                          parameters));
                      $.when(widgetPromises[index])
                          .done(function (newOptions) {
                            _.extend(item.newOptions, newOptions);
                          })
                          .fail(function (errorMsg) {
                            errors.push(errorMsg); // error returned by user-extended _eachWidgetOptions()
                          });
                    });
                    $.when.apply(this, widgetPromises)
                        .done(function () {
                          deferredOptions.resolve(parameters);
                        })
                        .fail(function (errorMsg) {
                          errors.push(errorMsg);
                          deferredOptions.reject(errors); // errors array returned to perspective manager
                        });
                  }

                })
                    .fail(function (errorMsg) {
                      errors.push(errorMsg); // error returned by user-extended _eachWidgetOptions()
                      deferredOptions.reject(errors);
                    });
              })
                  .fail(function (error) {
                    deferredContainer.reject(error);
                    deferredOptions.reject([error]);
                  });

              return deferredOptions.promise();
            },

            ensureContainer: function (parameters) {

              var deferredContainer = $.Deferred();

              function uniqueId() {
                return _.now() + Math.random().toString().substring(2);
              }
              if (_.has(parameters.settings, 'assetContainerId') &&
                  !isNaN(parseInt(parameters.settings.assetContainerId))) {
                deferredContainer.resolve(false);
              } else {
                this.perspectiveAssetsVolume = new NodeModel(
                    {
                      id: 'volume',
                      type: 954
                    },
                    {
                      connector: parameters.connector
                    });
                this.perspectiveAssetsVolume.fetch().then(_.bind(function () {
                  var collectOptions = parameters.connector.extendAjaxOptions({
                    url: parameters.connector.connection.url + '/nodes',
                    type: 'POST',
                    data: {
                      type: 955,
                      parent_id: this.perspectiveAssetsVolume.get('id'),
                      name: 'assets_' + uniqueId()
                    },
                    success: function (response) {
                      deferredContainer.resolve(response);

                    },
                    error: function (error) {
                      deferredContainer.reject(error);
                    }
                  });

                  $.ajax(collectOptions).done(function (resp) {
                    deferredContainer.resolve(resp);
                  }).fail(function (resp) {
                    deferredContainer.reject(resp);
                  });
                }, this));
              }

              return deferredContainer.promise();
            }

          });
        }
      };

      return PerspectiveEditMixin;
    });