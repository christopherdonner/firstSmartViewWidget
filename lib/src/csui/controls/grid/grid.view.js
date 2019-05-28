/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['require', 'csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin'
], function (require, _, Backbone, Marionette, ViewEventsPropagationMixin) {

  var ColumnView = Marionette.ItemView.extend({

    className: function () {
      var classNames = [];
      if (!!this.model.get('className')) {
        classNames.push(this.model.get('className'));
      }
      this._addSizeClasses(classNames);
      this._addOffsetClasses(classNames);
      this._addPullClasses(classNames);
      this._addPushClasses(classNames);
      this._addHeightClasses(classNames);
      return _.unique(classNames).join(' ');
    },

    attributes: function () {
      var tmpAttributes;

      if (this.model.get('widget') !== undefined) {
        var widgetType = this.model.get('widget').type;
        var lastSlash = widgetType.lastIndexOf('/');
        if (lastSlash > 0) {
          widgetType = widgetType.substring(lastSlash + 1);
        }

        tmpAttributes = {
          'data-csui-widget_type': widgetType,
          'data-csui-cell_address': this.model.get('widget').cellAddress
        };
      }
      else {
        tmpAttributes = {};
      }

      return tmpAttributes;
    },

    constructor: function ColumnView(options) {
      if (!!options.cellBehaviours) {
        this.behaviors = _.extend(options.cellBehaviours, this.behaviors);
      }
      this._init(options);
    },

    _init: function (options) {
      Marionette.ItemView.prototype.constructor.call(this, _.extend({template: false}, options));
      if (this.collection) {
        this._createRows();
      } else {
        this._createCell();
        this._registerModelEvents();
      }
      this.propagateEventsToViews(this.cell || this.rows);
    },

    _registerModelEvents: function () {
      this.listenTo(this.model, 'change:widget', this._updateWidget);
      this.listenTo(this.model, 'change:sizes', this._updateSizes);
      this.listenTo(this.model, 'change:heights', this._updateSizes);
    },

    _updateSizes: function () {
      var className = _.result(this, 'className');
      this.$el.attr('class', className);
    },
    _updateWidget: function (newWidget) {
      newWidget.cellAddress = this.model.get('widget').cellAddress;
      this._createCell();
      var attrs = _.result(this, 'attributes');
      if (this.id) { attrs.id = _.result(this, 'id'); }
      if (this.className) { attrs['class'] = _.result(this, 'className');}
      this.$el.attr(attrs);
      this.render();
    },

    onRender: function () {
      this._renderContent();
    },

    onBeforeDestroy: function () {
      this._destroyContent();
    },

    _addSizeClasses: function (classNames) {
      var sizes = this.model.get('sizes');
      if (sizes) {
        sizes.xs != null && classNames.push('binf-col-xs-' + sizes.xs);
        sizes.sm != null && classNames.push('binf-col-sm-' + sizes.sm);
        sizes.md != null && classNames.push('binf-col-md-' + sizes.md);
        sizes.lg != null && classNames.push('binf-col-lg-' + sizes.lg);
        sizes.xl != null && classNames.push('binf-col-xl-' + sizes.xl);
        sizes.xxl != null && classNames.push('binf-col-xxl-' + sizes.xxl);
      }
    },

    _addOffsetClasses: function (classNames) {
      var offset = this.model.get('offsets');
      if (offset) {
        offset.xs != null && classNames.push('binf-col-xs-offset-' + offset.xs);
        offset.sm != null && classNames.push('binf-col-sm-offset-' + offset.sm);
        offset.md != null && classNames.push('binf-col-md-offset-' + offset.md);
        offset.lg != null && classNames.push('binf-col-lg-offset-' + offset.lg);
        offset.xl != null && classNames.push('binf-col-xl-offset-' + offset.xl);
        offset.xxl != null && classNames.push('binf-col-xxl-offset-' + offset.xxl);
      }
    },

    _addPullClasses: function (classNames) {
      var pulls = this.model.get('pulls');
      if (pulls) {
        pulls.xs != null && classNames.push('binf-col-xs-pull-' + pulls.xs);
        pulls.sm != null && classNames.push('binf-col-sm-pull-' + pulls.sm);
        pulls.md != null && classNames.push('binf-col-md-pull-' + pulls.md);
        pulls.lg != null && classNames.push('binf-col-lg-pull-' + pulls.lg);
        pulls.xl != null && classNames.push('binf-col-xl-pull-' + pulls.xl);
        pulls.xxl != null && classNames.push('binf-col-xxl-pull-' + pulls.xxl);
      }
    },

    _addPushClasses: function (classNames) {
      var pushes = this.model.get('pushes');
      if (pushes) {
        pushes.xs != null && classNames.push('binf-col-xs-push-' + pushes.xs);
        pushes.sm != null && classNames.push('binf-col-sm-push-' + pushes.sm);
        pushes.md != null && classNames.push('binf-col-md-push-' + pushes.md);
        pushes.lg != null && classNames.push('binf-col-lg-push-' + pushes.lg);
        pushes.xl != null && classNames.push('binf-col-xl-push-' + pushes.xl);
        pushes.xxl != null && classNames.push('binf-col-xxl-push-' + pushes.xxl);
      }
    },

    _addHeightClasses: function (classNames) {
      var heights = this.model.get('heights');
      if (heights) {
        heights.xs != null && classNames.push('row-xs-' + heights.xs);
        heights.sm != null && classNames.push('row-sm-' + heights.sm);
        heights.md != null && classNames.push('row-md-' + heights.md);
        heights.lg != null && classNames.push('row-lg-' + heights.lg);
        heights.xl != null && classNames.push('row-xl-' + heights.xl);
        heights.xxl != null && classNames.push('row-xxl-' + heights.xxl);
      }
    },

    _createRows: function () {
      this.rows = new RowsView({
        el: this.el,
        grid: this.options.grid,
        collection: this.collection
      });
    },

    _createCell: function () {
      var CellView        = this._getCellView(),
          cellViewOptions = this._getCellViewOptions(),
          fullOptions     = _.extend({model: this.model}, cellViewOptions);
      this.cell = new CellView(fullOptions);
    },

    _getCellView: function () {
      var cellView = this.options.grid.getOption('cellView');
      if (cellView && !(cellView.prototype instanceof Backbone.View)) {
        cellView = cellView.call(this.options.grid, this.model);
      }
      if (!cellView) {
        throw new Marionette.Error({
          name: 'NoCellViewError',
          message: 'A "cellView" must be specified'
        });
      }
      return cellView;
    },

    _getCellViewOptions: function () {
      var cellViewOptions = this.options.grid.getOption('cellViewOptions');
      if (_.isFunction(cellViewOptions)) {
        cellViewOptions = cellViewOptions.call(this.options.grid, this.model);
      }
      return cellViewOptions;
    },

    _renderContent: function () {
      if (this.cell) {
        this.cell.render();
        Marionette.triggerMethodOn(this.cell, 'before:show');
        this.$el
            .html('')
            .append(this.cell.el);
        Marionette.triggerMethodOn(this.cell, 'show');
      } else {
        if (this.options.grid.$el.hasClass('grid-rows')) {
          this.$el.addClass('grid-rows');
        }
        this.rows.render();
      }
    },

    _destroyContent: function () {
      this.cell && this.cell.destroy();
      this.rows && this.rows.destroy();
    }

  });

  _.extend(ColumnView.prototype, ViewEventsPropagationMixin);

  var RowView = Marionette.CollectionView.extend({

    className: 'binf-row',

    childView: ColumnView,
    childViewOptions: function (child) {
      return {
        grid: this.options.grid,
        collection: child.rows,
        cellBehaviours: this.options.cellBehaviours,
        rowBehaviours: this.options.rowBehaviours
      };
    },

    constructor: function RowView(options) {
      if (!!options.rowBehaviours) {
        this.behaviors = _.extend(options.rowBehaviours, this.behaviors);
      }
      Marionette.CollectionView.prototype.constructor.apply(this, arguments);
      this.listenTo(this, 'add:child', this.propagateEventsToViews);
    }

  });

  _.extend(RowView.prototype, ViewEventsPropagationMixin);

  var RowsView = Marionette.CollectionView.extend({

    childView: RowView,
    childViewOptions: function (child) {
      return {
        grid: this.options.grid,
        collection: child.columns,
        cellBehaviours: this.options.cellBehaviours,
        rowBehaviours: this.options.rowBehaviours
      };
    },

    constructor: function RowsView() {
      Marionette.CollectionView.prototype.constructor.apply(this, arguments);
      this.listenTo(this, 'add:child', this.propagateEventsToViews);
    }

  });

  _.extend(RowsView.prototype, ViewEventsPropagationMixin);

  var GridRowView = RowView.extend({

    childView: ColumnView,
    childViewOptions: function (child) {
      return {
        grid: this.options.grid,
        cellBehaviours: this.options.cellBehaviours,
        rowBehaviours: this.options.rowBehaviours
      };
    },

    constructor: function GridRowView(options) {
      options || (options = {});
      options.grid = this;
      if (!options.collection) {
        options.collection = this._convertCollection(options);
      }
      RowView.prototype.constructor.call(this, options);
    },

    _convertCollection: function (options) {
      return new Backbone.Collection(options.columns);
    }

  });

  var GridView = RowsView.extend({

    className: 'cs-grid binf-container-fluid',

    constructor: function GridView(options) {
      options || (options = {});
      options.grid = this;
      if (!options.collection) {
        options.collection = this._convertCollection(options);
      }
      RowsView.prototype.constructor.call(this, options);
    },

    _convertCollection: function (options) {
      return this._convertRows(options.rows, 'grid0');
    },

    _convertRows: function (rows, addressPrefix) {
      rows = new Backbone.Collection(rows);
      rows.each(function (row, rowIndex) {
        var columns = row.get('columns');
        row.cellAddress = addressPrefix + ':r' + rowIndex;
        row.columns = this._convertColumns(columns, row.cellAddress);
      }, this);
      return rows;
    },

    _convertColumns: function (columns, addressPrefix) {
      columns = new Backbone.Collection(columns);
      columns.each(function (column, colIndex) {
        var rows = column.get('rows');
        column.cellAddress = addressPrefix + ':c' + colIndex;
        if (column.get('widget') !== undefined) {
          column.get('widget').cellAddress = column.cellAddress;
        }
        if (rows) {
          column.rows = this._convertRows(rows, column.cellAddress);
        }
      }, this);
      return columns;
    }

  }, {

    RowView: GridRowView,
    CellView: ColumnView

  });

  return GridView;

});
