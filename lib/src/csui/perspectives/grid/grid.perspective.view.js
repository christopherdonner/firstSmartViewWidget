/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/controls/grid/grid.view', 'csui/behaviors/widget.container/widget.container.behavior'
], function (module, _, $, Marionette, GridView, WidgetContainerBehavior) {

  var config = module.config();

  var GridPerspectiveView = GridView.extend({

    className: function () {
      var className = 'cs-perspective cs-grid-perspective grid-rows',
          parentClassName = _.result(GridView.prototype, 'className');
      if (parentClassName) {
        className = className + ' ' + parentClassName;
      }
      return className;
    },

    cellView: function (model) {
      var widget = model.get('widget');
      if (widget) {
        var view = widget.view;
        if (!view) {
          throw new Marionette.Error({
            name: 'UnresolvedWidgetError',
            message: 'Widget "' + widget.type + '" not resolved: ' +
                     widget.error
          });
        }
        return view;
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

    behaviors: {
      WidgetContainer: {
        behaviorClass: WidgetContainerBehavior
      }
    },

    constructor: function GridPerspectiveView(options) {
      options || (options = {});
      options = $.extend(true, {}, options);
      var rows = options.rows;
      if (rows && rows.length > 0 && config.supportedWidgets) {
        var columns = rows[0].columns;
        rows[0].columns = _.filter(columns, function (column) {
          return _.contains(config.supportedWidgets, column.widget.type);
        });

        if( columns.length > 1 && config.widgetSizes ){
          _.each(columns, function (column) {
            column.sizes = config.widgetSizes;
            column.heights = {};
          });
        }
      }
      GridView.prototype.constructor.call(this, options);
    },

    enumerateWidgets: function (callback) {
      this._enumerateWidgetRow(this.options.collection, callback);
    },

    _enumerateWidgetRow: function (rows, callback) {
      rows.each(function (row) {
        row.columns.each(function (column) {
          var widget = column.get('widget');
          widget && callback(widget);
          if (column.rows) {
            this._enumerateWidgetRow(column.rows, callback);
          }
        }, this);
      }, this);
    },
  
    _supportMaximizeWidget: true,

    _supportMaximizeWidgetOnDisplay: true

  });

  return GridPerspectiveView;

});
