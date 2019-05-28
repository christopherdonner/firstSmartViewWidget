/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/marionette', 'csui/controls/grid/grid.view',
  'csui/behaviors/widget.container/widget.container.behavior',
  'csui/perspectives/mixins/perspective.edit.mixin'
], function (_, $, Backbone, Marionette, GridView, WidgetContainerBehavior, PerspectiveEditMixin) {

  var ZonePerspectiveView = GridView.extend({

    className: function () {
      var className       = 'cs-perspective cs-zone-perspective grid-rows ',
          parentClassName = _.result(GridView.prototype, 'className');
      if (parentClassName) {
        className = className + parentClassName;
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

    constructor: function ZonePerspectiveView(options) {
      options || (options = {});
      options = $.extend(true, {}, options);
      if (!options.collection) {
        options.collection = this._createCollection(options);
      }
      options.collection.each(function (row, rowIndex) {
        row.columns.each(function (column, colIndex) {
          column.get('widget').cellAddress = 'grid0:r' + rowIndex + ':c' + colIndex;
        });
      });
      if (options.perspectiveMode === 'edit') {
        this.prepareForEditMode();
      }
      GridView.prototype.constructor.call(this, options);
    },

    _createCollection: function (options) {
      var rows       = new Backbone.Collection(),
          layoutName = this._getLayoutName(options);
      if (layoutName) {
        var zoneLayouts = getOption.call(this, 'zoneLayouts'),
            zoneLayout  = zoneLayouts[layoutName];
        if (zoneLayout) {
          var row     = rows.add({}),
              columns = _.map(zoneLayout.zoneOrder, function (zone) {
                return _.defaults({
                  widget: options[zone]
                }, zoneLayout.zoneSizes[zone]);
              });
          row.columns = new Backbone.Collection(columns);
        } else {
          throw new Marionette.Error({
            name: 'InvalidLayoutContentError',
            message: 'Missing widget in the important perspective zone'
          });
        }
      }
      return rows;
    },
    _getLayoutName: function (options) {
      var zoneNames = getOption.call(this, 'zoneNames');
      return _.reduce(zoneNames, function (result, zone) {
        if (options[zone] && !_.isEmpty(options[zone])) {
          result && (result += '-');
          result += zone;
        }
        return result;
      }, '');
    },

    enumerateWidgets: function (callback) {
      var zoneNames = getOption.call(this, 'zoneNames');
      _.each(zoneNames, function (zone) {
        var zoneContent = this.options[zone];
        if (!_.isEmpty(zoneContent)) {
          var widget = this.options[zone];
          widget && callback(widget);
        }
      }, this);
    },
    serializeOptions: function () {
      var self        = this,
          deferred    = $.Deferred(),
          layoutName  = this._getLayoutName(this.options),
          zoneLayouts = getOption.call(this, 'zoneLayouts'),
          zoneLayout  = zoneLayouts[layoutName],
          cells       = this.collection.at(0).columns;
      var widgetPromises = _.map(zoneLayout.zoneOrder, function (zone, index) {
        if (cells.at(index).get('widget').type ===
            'csui/perspective.manage/widgets/perspective.placeholder') {
          return $.Deferred().resolve({
            zone: zone,
            config: {widget: {}}
          });
        }
        return self.serializeWidget(cells.at(index)).then(function (result) {
          return {
            zone: zone,
            config: result
          };
        });
      });

      $.whenAll.apply($, widgetPromises).done(function (results) {
        var zoneOptions = _.reduce(results, function (zoneOptions, result) {
          zoneOptions[result.zone] = result.config.widget;
          return zoneOptions;
        }, {});
        deferred.resolve(zoneOptions);
      }).fail(function (results) {
        results = _.filter(results, function (result) {return !!result.error});
        deferred.reject(results[0].error);
      });

      return deferred.promise();
    }

  });
  function getOption(property, source) {
    var value;
    if (source) {
      value = source[property];
    } else {
      value = getOption.call(this, property, this.options || {});
      if (value === undefined) {
        value = this[property];
      }
    }
    return _.isFunction(value) ? value.call(this) : value;
  }
  PerspectiveEditMixin.mixin(ZonePerspectiveView.prototype);

  return ZonePerspectiveView;

});
