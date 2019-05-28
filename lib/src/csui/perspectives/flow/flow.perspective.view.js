/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['require', 'module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/marionette', 'csui/models/widget/widget.collection',

  'csui/controls/grid/grid.view', 'csui/utils/log',
  'csui/behaviors/widget.container/widget.container.behavior',
  'csui/behaviors/drag.drop/dnd.item.behaviour',
  'csui/behaviors/drag.drop/dnd.container.behaviour',
  'csui/perspectives/mixins/perspective.edit.mixin',
  'i18n!csui/perspectives/flow/impl/nls/lang',
  'css!csui/perspectives/flow/impl/flow.perspective'
], function (require, module, _, $, Backbone, Marionette, WidgetCollection, GridView,
    log, WidgetContainerBehavior, DnDItemBehaviour, DnDContainerBehaviour, PerspectiveEditMixin,
    lang) {
  'use strict';

  var config = module.config();
  _.defaults(config, {
    defaultWidgetKind: 'tile',
    widgetSizes: {
      fullpage: {
        widths: {
          xs: 12
        },
        heights: {
          xs: 'full'
        }
      },
      header: {
        widths: {
          xs: 12,
          md: 8,
          xl: 6
        }
      },
      widetile: {
        widths: {
          xs: 12,
          lg: 6
        }
      },
      tile: {
        widths: {
          xs: 12,
          sm: 6,
          md: 4,
          xl: 3
        }
      }
    }
  });

  var FlowPerspectiveView = GridView.extend({

    className: function () {
      var className       = 'cs-perspective cs-flow-perspective grid-rows',
          parentClassName = _.result(GridView.prototype, 'className');
      if (parentClassName) {
        className = className + ' ' + parentClassName;
      }
      return className;
    },

    cellView: function (model) {
      var widget = model.get('widget');
      if (widget) {
        if (!widget.view) {
          throw new Marionette.Error({
            name: 'UnresolvedWidgetError',
            message: 'Widget "' + widget.type + '" not resolved:' +
                     widget['error']
          });
        }
        return widget.view;
      }
    },

    cellViewOptions: function (model) {
      var widget = model.get('widget');
      return {
        context: this.options.context,
        data: widget && widget.options || {},
        model: undefined
      };
    },

    constructor: function FlowPerspectiveView(options) {
      options || (options = {});
      options = $.extend(true, {}, options);
      if (options.perspectiveMode === 'edit') {
        this._prepareOptionsForEditMode(options);
        this.prepareForEditMode();
      }
      if (!options.collection) {
        var extWidgets = _.chain(config)
            .pick(function (value, key) {
              return key.indexOf('-widgets') >= 0;
            })
            .values()
            .flatten();

        if (extWidgets && extWidgets._wrapped && extWidgets._wrapped.length > 0) {
          options.widgets = _.filter(options.widgets, function (widget) {
            return _.contains(extWidgets._wrapped, widget.type);
          });
        }

        options.collection = this._createCollection(options);
      }
      GridView.prototype.constructor.call(this, options);
      if (options.perspectiveMode === 'edit') {
        this._registerEditEvents();
      }
    },
    _prepareOptionsForEditMode: function (options) {
      options.widgets || (options.widgets = []);
      options.widgets.push({
        kind: 'tile',
        type: 'csui/perspective.manage/widgets/perspective.placeholder',
        className: 'csui-draggable-item-disable'
      });

      options.cellBehaviours = {
        PerspectiveWidgetConfig: { // For widget editing
          behaviorClass: require(
              'csui/perspective.manage/behaviours/pman.widget.config.behaviour'),
          perspectiveView: this
        },
        DnDItemBehaviour: { // For DnD widget
          behaviorClass: DnDItemBehaviour
        }
      };

      this._createDnDPlaceholderWidget();

      options.rowBehaviours = {
        DnDContainerBehaviour: {
          behaviorClass: DnDContainerBehaviour,
          placeholder: this._getDnDPlaceholder.bind(this),
          handle: '.csui-pman-widget-masking', // Limit re-ordering to mask (avoids callout popover),
          over: _.bind(function (event, ui) {
            var placeholderWidget = this._getDnDPlaceholder(ui.helper);
            var placeholder = ui.placeholder;
            placeholder.attr('class', placeholderWidget.attr('class'));
            placeholder.html(placeholderWidget.html());
            placeholder.css('visibility', 'visible');
            placeholder.data('pman.widget', ui.helper.data('pman.widget'));
          }, this),
          receive: _.bind(function (event, ui) {
            var newWidget = ui.placeholder.data('pman.widget'),
                index     = ui.item.index(); // this.$el.find('.binf-row >div').index(ui.item);

            var widget = {
              type: 'csui/perspective.manage/widgets/perspective.widget',
              kind: newWidget.get('manifest').kind,
              options: {
                options: {}, // To be used and filled by callout form
                widget: newWidget
              },
              view: this.pespectiveWidgetView
            };
            var self = this;
            var widgetUpdates = self._prepareGridCell(widget, index);
            var cells = self.collection.at(0).columns;
            cells.add(widgetUpdates, {at: index});
            ui.sender.sortable("cancel");
          }, this)
        }
      };
    },
    _createDnDPlaceholderWidget: function () {
      var self              = this,
          placeholderWidget = {
            type: 'csui/perspective.manage/widgets/perspective.placeholder',
          };
      this._resolveWidget(placeholderWidget).done(function (resolvedWidget) {
        self.dndPlaceholderCell = new GridView.CellView({
          grid: self,
          model: new Backbone.Model(self._createCell(placeholderWidget, resolvedWidget, 0))
        });
        self.dndPlaceholderCell.render();
      });

      this._resolveWidget({
        type: 'csui/perspective.manage/widgets/perspective.widget'
      }).done(function (resolvedWidget) {
        self.pespectiveWidgetView = resolvedWidget.get('view');
      });
    },
    _getDnDPlaceholder: function (dragEl) {
      var widget = dragEl.data('pman.widget');
      if (!!widget) {
        var kind = widget.attributes.manifest.kind;
        if (!kind) {
          kind = config.defaultWidgetKind;
        }
        var sizes = config.widgetSizes[kind];
        this.dndPlaceholderCell.model.set({
          sizes: sizes.widths,
          heights: sizes.heights
        });
      }
      return this.dndPlaceholderCell.$el;
    },

    _registerEditEvents: function () {
      var self = this;
      this.listenTo(this, 'delete:widget', function (widgetView) {
        var cells = self.collection.at(0).columns;
        var model = widgetView.model;
        cells.remove(model);
      });

      this.listenTo(this, 'update:widget:size', function (widgetView, kind) {
        var sizes  = config.widgetSizes[kind],
            widget = widgetView.model.get('widget');
        widget.kind = kind;
        widgetView.model.set({
          sizes: sizes.widths,
          heights: sizes.heights,
          widget: widget
        });
      });

      this.listenTo(this, 'replace:widget', this._replaceWidget);
    },

    _replaceWidget: function (currentWidget, widgetToReplace) {
      if (!this.getPManPlaceholderWidget) {
        return;
      }
      var self = this;
      var cells = this.collection.at(0).columns;
      this._resolveWidget(widgetToReplace).done(function () {
        if (currentWidget.model.get('widget').type !== self.getPManPlaceholderWidget().type) {
          widgetToReplace.kind = currentWidget.model.get('widget').kind;
        }
        var widgetUpdates = self._prepareGridCell(widgetToReplace,
            cells.indexOf(currentWidget.model));
        currentWidget.model.set(widgetUpdates);
        var placeholderWidget = self.getPManPlaceholderWidget(),
            hasPlaceholders   = cells.filter(function (w) {
                  return w.get('widget').type === placeholderWidget.type;
                }).length > 0;
        if (!hasPlaceholders) {
          self._resolveWidget(placeholderWidget).done(function (resolvedWidget) {
            var newCell = self._createCell(placeholderWidget, resolvedWidget, cells.length);
            cells.add(newCell);
          });
        }
      });
    },

    _createCollection: function (options) {
      var rows = new Backbone.Collection();
      var uniqueWidgets = _.chain(options.widgets)
          .pluck('type')
          .unique()
          .map(function (id) {
            return {id: id};
          })
          .value();

      var resolvedWidgets = new WidgetCollection(uniqueWidgets);
      var self = this;

      this.widgetsResolved = resolvedWidgets
          .fetch()
          .then(function () {
            var firstRow = rows.add({});
            firstRow.columns = self._createColumns(options.widgets, resolvedWidgets);
          });
      return rows;
    },

    _createColumns: function (widgets, resolvedWidgets) {
      var columns = _.map(widgets, function (widget, columnIndex) {
        var resolvedWidget = resolvedWidgets.get(widget.type);
        return this._createCell(widget, resolvedWidget, columnIndex);
      }.bind(this));
      return new Backbone.Collection(columns);
    },

    _prepareGridCell: function (widgetConfig, columnIndex) {
      var kind = widgetConfig.kind;
      if (!kind) {
        kind = config.defaultWidgetKind;
      }
      var sizes = config.widgetSizes[kind];
      return {
        sizes: sizes.widths,
        heights: sizes.heights,
        className: widgetConfig.className,
        widget: {
          cellAddress: 'grid0:r0:c' + columnIndex,
          type: widgetConfig.type,
          options: widgetConfig.options,
          view: widgetConfig.view,
          kind: kind
        }
      };
    },

    _createCell: function (widget, resolvedWidget, columnIndex) {
      var widgetView     = resolvedWidget.get('view'),
          manifest       = resolvedWidget.get('manifest') || {},
          supportedKinds = manifest.supportedKinds,
          kind           = widget.kind;
      if (!kind || !supportedKinds || !_.contains(supportedKinds, kind)) {
        kind = manifest.kind;
      }
      widget.kind = kind;
      if (widgetView) {
        widget.view = widgetView;
        return this._prepareGridCell(widget, columnIndex);
      }
      var error = resolvedWidget.get('error');
      log.warn('Loading widget "{0}" failed. {1}', widget.type, error)
      && console.warn(log.last);
      var sizes = config.widgetSizes[config.defaultWidgetKind];
      return {
        sizes: sizes.widths,
        heights: sizes.heights,
        widget: WidgetContainerBehavior.getErrorWidget(widget, error)
      };
    },
    getSupportedWidgetSizes: function (manifest, widget) {
      return _.map(manifest.supportedKinds, function (suppKind) {
        return {
          kind: suppKind,
          label: lang[suppKind + 'Label'],
          selected: widget.model.get('widget').kind === suppKind
        };
      });
    },

    serializePerspective: function (perspectiveModel) {
      var self         = this,
          deferred     = $.Deferred(),
          cells        = this.collection.at(0).columns,
          widgetModels = cells.filter(function (cell) {
            return cell.get('widget').type !==
                   'csui/perspective.manage/widgets/perspective.placeholder';
          });

      var widgetPromises = widgetModels.map(self.serializeWidget);
      $.whenAll.apply($, widgetPromises).done(function (results) {
        self.executeCallbacks(results, perspectiveModel).done(function () {
          deferred.resolve({
            type: 'flow',
            options: {
              widgets: _.map(results, function (result) {return result.widget;})
            }
          });
        }).fail(function (results) {
          results = _.filter(results, function (result) {return !!result.error});
          deferred.reject(results[0].error);
        });
      }, this).fail(function (results) {
        results = _.filter(results, function (result) {return !!result.error});
        deferred.reject(results[0].error);
      });
      return deferred.promise();
    },

    getPreviousWidgets: function (perspectiveModel) {
      var perspective     = perspectiveModel.get('perspective'),
          previousWidgets = perspective &&
                            perspective.options ?
                            perspective.options.widgets :
          {};
      previousWidgets = _.map(previousWidgets, function (widget) {
        return {widget: widget};
      });
      return previousWidgets;
    },

    _supportMaximizeWidget: true,

    _supportMaximizeWidgetOnDisplay: true

  });
  PerspectiveEditMixin.mixin(FlowPerspectiveView.prototype);
  return FlowPerspectiveView;

});
