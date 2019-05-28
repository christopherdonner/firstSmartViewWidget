/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/utils/base',
  'csui/utils/commands',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  "csui/controls/table/cells/cell.factory",
  'csui/controls/progressblocker/blocker',
  'csui/controls/globalmessage/globalmessage',
  'csui/controls/tableactionbar/tableactionbar.view',
  'csui/controls/table/rows/metadata/metadatarow.view',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'hbs!csui/controls/table.list/impl/table.list.row',
  'hbs!csui/controls/table.list/impl/table.list.header',
  'hbs!csui/controls/table.list/impl/table.list',
  'hbs!csui/controls/table.list/impl/empty.table',
  'i18n!csui/controls/table.list/impl/nls/lang',
  'css!csui/controls/table.list/impl/table.list', 'csui/lib/jquery.mousehover'
], function (_, $, Backbone, Marionette, base, commands, LayoutViewEventsPropagationMixin,
    cellViewFactory, BlockingView, GlobalMessage, TableActionBarView, MetadataRowView,
    PerfectScrollingBehavior, TabableRegionBehavior, tableRowTemplate, tableHeaderTemplate,
    tableTemplate, emptyTableTemplate, lang) {
  'use strict';

  var EmptyTableView = Marionette.ItemView.extend({

    className: 'csui-table-empty',
    template: emptyTableTemplate,

    constructor: function EmptyTableView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },

    templateHelpers: function () {
      var emptyText = this.options.emptyTableText;
      return {
        message: emptyText
      };
    }
  });

  var TableRowView = Marionette.LayoutView.extend({

    className: 'csui-table-row',

    attributes: function () {
      return {role: 'row'};
    },

    tagName: 'div',

    template: tableRowTemplate,

    events: {
      'focusin .csui-table-cell': 'onFocusInTableCell',
      'blur .csui-table-cell': 'onFocusOutTableCell'
    },

    templateHelpers: function () {
      return {
        columns: this.options.columns,
        hasWrappedColumns: (this.options.wrappedColumns && this.options.wrappedColumns.length > 0)
      };
    },

    constructor: function TableRowView(options) {
      options || (options = {});
      Marionette.LayoutView.prototype.constructor.call(this, options);
    },

    initialize: function () {
      var self = this;
      if (this.options.columns) {
        _.each(this.options.columns, function (column) {
          if (column.CellView) {
            var region = column.name;
            self.addRegion(region, ".csui-table-cell-" + region);
          }
        }, this);
      }

      if (this.options.wrappedColumns && this.options.wrappedColumns.length > 0) {
        self.addRegion('csui-column-wrapped', '.csui-column-wrapped');
      }

    },

    onRender: function () {
      var self = this;
      if (this.options.columns) {
        _.each(this.options.columns, function (column, index) {
          if (column.CellView) {
            var region = column.name;
            var cellView = new column.CellView({
              tagName: 'DIV',
              model: self.model,
              context: self.options.context,
              applyTo: self.options.applyTo,
              column: column,
              originatingView: self.options.originatingView
            });
            self[region].show(cellView);
            self.listenTo(cellView, 'clicked:cell', function (event) {
              self.trigger('clicked:cell', {
                cellView: cellView,
                rowIndex: self._index,
                colIndex: index,
                model: self.model
              });
            });
          }
        }, this);
      }

      if (this.options.wrappedColumns && this.options.wrappedColumns.length > 0) {
        var metadataRowView = new MetadataRowView({
          context: this.options.context,
          model: this.model,
          columns: this.options.wrappedColumns
        });
        this['csui-column-wrapped'].show(metadataRowView);
      }

      if (!base.isTouchBrowser() && this.options.showInlineToolbar && this.$el) {
        this._subscribeEventHandlers();
      }

      if (base.isTouchBrowser() && this.options.showInlineToolbar) {
        this._showInlineRowActions();
      }
    },

    _showInlineRowActions: function () {
      var inlineToolbarContainer = this.$el.find('.csui-row-inlinetoolbar').removeClass(
          "binf-hidden"),
          membersTypeSupport     = [0, 1];
      if (this.model.get('permissions') === null || !this.options.hasEditPermission ||
          (membersTypeSupport.indexOf(
              this.model.get("right_id_expand") && this.model.get("right_id_expand").type) < 0 &&
           this.model.get("type") === "custom")) {
        this.$el.find('.csui-row-inlinetoolbar').addClass("binf-hidden");
      }
      if (inlineToolbarContainer.length === 0 || this.inlineRowToolbarView !== undefined) {
        return;
      }
      this.inlineRowToolbarView = new TableActionBarView(_.extend({
            context: this.options.context,
            commands: commands,
            collection: this.options.toolbarItems.inlineToolbar,
            toolItemsMask: this.options.toolbarItemsMasks.toolbars.inlineToolbar,
            originatingView: this.options.originatingView,
            model: this.model,
            applyTo: this.options.applyTo,
            status: {
              model: this.model,
              targetView: this,
              connector: this.options.connector,
              applyTo: this.options.applyTo
            }
          }, this.options.toolbarItems.inlineToolbar.options, {maxItemsShown: 1})
      );

      this.listenTo(this.inlineRowToolbarView, 'before:execute:command', function (eventArgs) {
        if (eventArgs && eventArgs.status && eventArgs.status.targetView &&
            eventArgs.status.targetView.$el) {
          eventArgs.status.targetView.$el.addClass("active-row");
        }
        this.trigger('before:execute:action', eventArgs);
      });
      this.listenTo(this.inlineRowToolbarView, 'after:execute:command', function (eventArgs) {
        if (eventArgs && eventArgs.status && eventArgs.status.targetView &&
            eventArgs.status.targetView.$el) {
          eventArgs.status.targetView.$el.removeClass("active-row");
        }
        this.trigger('after:execute:action', eventArgs);
      });

      if (this.options.originatingView) {
        this.listenTo(this.options.originatingView, "block:view:actions", function () {
          this.trigger('before:execute:action');
        });
        this.listenTo(this.options.originatingView, "unblock:view:actions", function () {
          this.trigger('after:execute:action');
        });
      }

      this.inlineRowToolbarView.render();
      inlineToolbarContainer.append(this.inlineRowToolbarView.$el);
      this.inlineRowToolbarView.triggerMethod("show");

    },

    _destroyInlineRowActionBar: function () {
      if (this.inlineRowToolbarView) {
        this.inlineRowToolbarView.destroy();
        this.inlineRowToolbarView = undefined;
        if (!!this.$el.find('active-row')) {
          this.$el.removeClass('active-row');
        }
      }
    },

    onBeforeRender: function () {
      if (!base.isTouchBrowser() && this.options.showInlineToolbar) {
        this._unsubscribeEventHandlers();
      }
    },

    onBeforeDestroy: function () {
      if (this.options.showInlineToolbar) {
        if (!base.isTouchBrowser()) {
          this._unsubscribeEventHandlers();
        } else {
          this._destroyInlineRowActionBar();
        }
      }
    },

    _subscribeEventHandlers: function () {
      this.$el && this.$el.mousehover(
          this.showInlineActions.bind(this),
          this.hideInlineActions.bind(this),
          {namespace: this.cid});
    },

    _unsubscribeEventHandlers: function () {
      if (this._isRendered) {
        this.$el.mousehover('off', {namespace: this.cid});
      }
    },

    showInlineActions: function (e) {
      var membersTypeSupport = [0, 1];
      if (membersTypeSupport.indexOf(
              this.model.get("right_id_expand") && this.model.get("right_id_expand").type) < 0 &&
          this.model.get("type") === "custom") {
        this.$el.find('.csui-inlinetoolbar').addClass("binf-hidden");
      } else {
        var inlineToolbarContainer = this.$el.find('.csui-inlinetoolbar').removeClass(
            "binf-hidden");
        if (inlineToolbarContainer.length > 0) {
          var self = this,
              args = {
                sender: self,
                target: inlineToolbarContainer,
                model: self.model
              };
          self.trigger("mouseenter:row", args);
        }
      }
    },

    hideInlineActions: function (e) {
      var inlineToolbarContainer = this.$el.find('.csui-inlinetoolbar').addClass("binf-hidden");

      if (inlineToolbarContainer.length > 0) {
        var self = this,
            args = {
              sender: self,
              target: inlineToolbarContainer,
              model: self.model
            };
        self.trigger("mouseleave:row", args);
      }
    },

    onFocusInTableCell: function (event) {
      if (this.options.showInlineToolbar) {
        this._showInlineRowActions();
      }
    },

    onFocusOutTableCell: function (event) {
      if (this.options.showInlineToolbar) {
        setTimeout(_.bind(function () {
          if (this.$el.find(document.activeElement).length === 0 && !base.isTouchBrowser()) {
            this._destroyInlineRowActionBar();
          }
        }, this), 50);
      }
    }

  });

  var TableHeaderView = Marionette.ItemView.extend({

    className: 'csui-table-header',

    attributes: function () {
      return {role: 'row'};
    },

    tagName: 'div',

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior,
        initialActivationWeight: 100
      }
    },

    events: {
      "keydown": "onKeyInView"
    },

    template: tableHeaderTemplate,

    templateHelpers: function () {
      var userPermissions = this.options.userPermissionsModel &&
                            this.options.userPermissionsModel.get("permissions"),
          isToolbar       = _.contains(userPermissions, 'edit_permissions');
      return {
        columns: this.options.columns,
        addTitle: lang.addTitle,
        isToolbar: this.options.admin_permissions || isToolbar
      };
    },

    constructor: function TableHeaderView(options) {
      options || (options = {});
      Marionette.ItemView.prototype.constructor.call(this, options);

    },

    onRender: function () {
      this.focusIndex = 0;
      this._columnCount = this.options.columns.length;
      this._toolbarHeaderColumnCount = 0;
      var userPermissions = this.options.userPermissionsModel &&
                            this.options.userPermissionsModel.get("permissions");
      if (!this.options.admin_permissions && !_.contains(userPermissions, 'edit_permissions')) {
        for (var i = 0; i < this._columnCount; i++) {
          var column = this.options.columns[i];
          if (!column.isToolbar) {
            this._toolbarHeaderColumnCount++;
          }
          if (column.attributes.containsInlineActions !== undefined) {
            column.attributes.containsInlineActions = false;
          }
        }
      } else {
        this._toolbarHeaderColumnCount = this._columnCount;
      }
    },

    currentlyFocusedElement: function () {
      var focusedEl = this.$el.find(".csui-table-header-cell").eq(this.focusIndex);
      return focusedEl;
    },

    onKeyInView: function (event) {
      var changeFocus = true;
      switch (event.keyCode) {

      case 37: // Left Arrow
        if (this.focusIndex > 0) {
          this.focusIndex--;
        }
        break;

      case 39: // Right Arrow
        if (this.focusIndex < this._toolbarHeaderColumnCount - 1) {
          this.focusIndex++;
        }
        break;

      default:
        changeFocus = false;
      }

      if (changeFocus) {
        event.preventDefault();
        event.stopPropagation();
        this.$el.find(".csui-table-header-cell").eq(this.focusIndex).focus();
      }
    }

  });

  var TableBodyView = Marionette.CollectionView.extend({

    className: 'csui-table-body',

    attributes: function () {
      return {role: 'rowgroup'};
    },

    childView: TableRowView,

    childEvents: {
      'mouseenter:row': 'onChildShowInlineActionBarWithDelay',
      'mouseleave:row': 'onChildActionBarShouldDestroy',
      'clicked:cell': 'onClickedCell'
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior,
        initialActivationWeight: 100
      }
    },

    events: {
      "keydown": "onKeyInView"
    },

    childViewOptions: function () {
      return {
        context: this.options.context,
        columns: this.options.columns,
        wrappedColumns: this.options.wrappedColumns,
        showInlineToolbar: this.showInlineToolbar,
        toolbarItems: this.options.toolbarItems,
        toolbarItemsMasks: this.options.toolbarItemsMasks,
        connector: this.options.collection.connector,
        originatingView: this.options.originatingView,
        applyTo: this.options.applyTo,
        hasEditPermission: this.hasEditPermissionUser(this.collection) ||
                           this.options.admin_permissions
      };
    },

    getEmptyView: function () {
      if (this.options.emptyView) {
        return this.options.emptyView;
      } else {
        return EmptyTableView;
      }
    },

    emptyViewOptions: function () {
      if (this.options.emptyView) {
        return {
          model: this.options.emptyViewModel
        };
      } else {
        return this.options;
      }
    },

    constructor: function TableBodyView(options) {
      Marionette.CollectionView.prototype.constructor.call(this, options);
      this.showInlineToolbar = (this.options.toolbarItems && this.options.toolbarItemsMasks);
      if (this.showInlineToolbar) {
        this.setInlineActionBarEvents();
      }
    },

    onRender: function () {
      this.nameColumnIndex = this.getNameColumnIndex(this.options.columns) || 0;
      this.accFocusedCell = this.options.accFocusedCell || {column: this.nameColumnIndex, row: 0};
      this.columnState = 0;
      this._columnCount = this.options.columns.length;
      this._toolbarColumnCount = 0;
      this.hasEditPermission = this.hasEditPermissionUser(this.collection) ||
                               this.options.admin_permissions;
      if (!this.hasEditPermission) {
        for (var i = 0; i < this._columnCount; i++) {
          var column = this.options.columns[i];
          if (column.isToolbar) {
            this._toolbarColumnCount++;
          }
        }
      }
    },

    hasEditPermissionUser: function (collection) {
      var userPermissions = collection.options &&
                            collection.options.authenticatedUserPermissions,
          permissions     = userPermissions.get("permissions");
      return _.contains(permissions, 'edit_permissions');
    },

    setInlineActionBarEvents: function () {
      this.listenTo(this, 'closeOther', this._destroyInlineActionBar);
      this.listenTo(this.collection, "reset", this._destroyInlineActionBar);
    },

    _showInlineActionBar: function (args) {
      if (this.inlineToolbarView) {
        this._savedHoverEnterArgs = args;
      } else if (!!args) {
        this._savedHoverEnterArgs = null;

        this.inlineToolbarView = new TableActionBarView(_.extend({
              context: this.options.context,
              commands: commands,
              collection: this.options.toolbarItems.inlineToolbar,
              toolItemsMask: this.options.toolbarItemsMasks.toolbars.inlineToolbar,
              originatingView: this.options.originatingView,
              applyTo: this.options.applyTo,
              model: args.model,
              status: {
                model: args.model,
                targetView: args.sender,
                connector: this.options.collection.connector,
                filterId: this.options.memberFilter.get("id"),
                applyTo: this.options.applyTo,
                admin_permissions: this.options.admin_permissions
              },
              customError: true
            }, this.options.toolbarItems.inlineToolbar.options)
        );

        this.listenTo(this.inlineToolbarView, 'before:execute:command', function (eventArgs) {
          this.lockedForOtherContols = true;
          if (eventArgs && eventArgs.status && eventArgs.status.targetView &&
              eventArgs.status.targetView.$el) {
            eventArgs.status.targetView.$el.addClass("active-row");
          }
          this._destroyInlineActionBar();
        });
        this.listenTo(this.inlineToolbarView, 'after:execute:command', function (eventArgs) {
          this.lockedForOtherContols = false;
          if (eventArgs && eventArgs.status && eventArgs.status.targetView &&
              eventArgs.status.targetView.$el) {
            eventArgs.status.targetView.$el.removeClass("active-row");
          }
          this._toolbarActionTriggered(eventArgs);
        });

        if (this.options.originatingView) {
          this.listenTo(this.options.originatingView, "block:view:actions", function () {
            this.lockedForOtherContols = true;
            this._destroyInlineActionBar();
          });
          this.listenTo(this.options.originatingView, "unblock:view:actions", function () {
            this.lockedForOtherContols = false;
          });
        }

        this.inlineToolbarView.render();
        this.listenTo(this.inlineToolbarView, 'destroy', function () {
          this.inlineToolbarView = undefined;
          if (this._savedHoverEnterArgs) {
            this.onChildShowInlineActionBarWithDelay(this._savedHoverEnterArgs);
          }
        }, this);
        $(args.target).append(this.inlineToolbarView.$el);
        this.inlineToolbarView.triggerMethod("show");
      }
    },

    onChildShowInlineActionBarWithDelay: function (childView, args) {
      if (this._showInlineActionbarTimeout) {
        clearTimeout(this._showInlineActionbarTimeout);
      }
      var self = this;
      this._showInlineActionbarTimeout = setTimeout(function () {
        self._showInlineActionbarTimeout = undefined;
        if (!self.lockedForOtherContols) {
          self._showInlineActionBar.call(self, args);
        }
      }, 200);
    },

    onChildActionBarShouldDestroy: function (childView, args) {
      if (this._showInlineActionbarTimeout) {
        clearTimeout(this._showInlineActionbarTimeout);
        this._showInlineActionbarTimeout = undefined;
      }
      if (this.inlineToolbarView) {
        this.inlineToolbarView.destroy();
      }
    },

    onChildviewBeforeExecuteAction: function () {
      if (base.isTouchBrowser()) {
        this.children.each(function (childview, index) {
          if (childview.inlineRowToolbarView && childview.inlineRowToolbarView.$el) {
            childview.inlineRowToolbarView.$el.addClass('binf-disabled');
          }
        });
      }
    },

    onChildviewAfterExecuteAction: function () {
      if (base.isTouchBrowser()) {
        this.children.each(function (childview, index) {
          if (childview.inlineRowToolbarView && childview.inlineRowToolbarView.$el) {
            childview.inlineRowToolbarView.$el.removeClass('binf-disabled');
            if (!!childview.$el.find('active-row')) {
              childview.$el.removeClass('active-row');
            }
          }
        });
      }
    },

    _destroyInlineActionBar: function () {
      if (this.inlineToolbarView) {
        this.inlineToolbarView.destroy();
        this.inlineToolbarView = undefined;
      }
    },
    _toolbarActionTriggered: function (context) {
      if (context && context.commandSignature) {
        this.trigger('after:action:execute', context);
      }
      this.currentlyFocusedElement().focus();

    },

    currentlyFocusedElement: function () {
      if (this.collection.length > 0 && this.accFocusedCell.column != null) {
        var rowView = this.children.findByIndex(this.accFocusedCell.row);
        return rowView && rowView.$el.find(
                '.csui-table-cell:nth-child(' + (this.accFocusedCell.column + 1) + ')').children(
                'DIV');
      }
      return $();
    },

    onClickedCell: function (childView, args) {
      this.accFocusedCell.row = args.rowIndex;
      if (args.colIndex < this._columnCount - this._toolbarColumnCount) {
        this.accFocusedCell.column = args.colIndex;
      } else {
        this.accFocusedCell.column = this._columnCount - this._toolbarColumnCount - 1;
      }
      this._accSetFocusToCurrentlyFocusedElement();
    },

    onKeyInView: function (event) {
      var changeFocus = true;
      var currentlyFocusedElement = this.currentlyFocusedElement();
      var initialFocusIndex,
          dropDownEle,
          dropDownEleIndex;
      switch (event.keyCode) {
      case 33:  // Page Up Key > goto first row
        this.accFocusedCell.row = 0;
        break;

      case 34:  // Page Down Key > goto last row
        if (this.collection.length > 0) {
          this.accFocusedCell.row = this.collection.length - 1;
        } else {
          this.accFocusedCell.row = 0;
        }
        break;

      case 35:  // END key > goto rightmost column
        this.accFocusedCell.column = this._columnCount - this._toolbarColumnCount - 1;
        break;

      case 36:  // POS1 key > goto first column
        this.accFocusedCell.column = 0;
        break;

      case 37: // Left Arrow
        if (this.accFocusedCell.column > 0) {
          initialFocusIndex = this.accFocusedCell.column;
          this.accFocusedCell.column--;
          currentlyFocusedElement = this.currentlyFocusedElement();
          if (currentlyFocusedElement.attr('data-csui-empty-cell') === 'true' &&
              currentlyFocusedElement.children().length < 1) {
            var focusable = this._getNextFocusableElementIndex(37, --this.accFocusedCell.column);
            if (focusable >= 0) {
              this.accFocusedCell.column = focusable;
            }
            else {
              this.accFocusedCell.column = initialFocusIndex;
            }
          }
        }
        break;

      case 38: // Up Arrow
        if (this.$('.binf-dropdown-toggle').parent('.binf-dropdown').hasClass('binf-open')) {
          dropDownEle = this.$('.binf-dropdown-menu li').length - 1,
              dropDownEleIndex = $(document.activeElement.parentElement).index();
          if (dropDownEle <= dropDownEleIndex) {
            dropDownEleIndex = dropDownEleIndex - 1;
            this.$(this.$('.binf-dropdown-menu li a')[dropDownEleIndex]).focus().focus();
          }
          changeFocus = false;
          break;
        }

        if (this.accFocusedCell.row > 0) {
          initialFocusIndex = this.accFocusedCell.column;
          this.accFocusedCell.row--;
          currentlyFocusedElement = this.currentlyFocusedElement();
          if (currentlyFocusedElement.attr('data-csui-empty-cell') === 'true' &&
              currentlyFocusedElement.children().length < 1) {
            this.accFocusedCell.row = initialFocusIndex;
          }
        }
        break;

      case 39: // Right Arrow
        if (this.accFocusedCell.column < this._columnCount - this._toolbarColumnCount - 1) {
          initialFocusIndex = this.accFocusedCell.column;
          this.accFocusedCell.column++;
          currentlyFocusedElement = this.currentlyFocusedElement();
          if (currentlyFocusedElement.attr('data-csui-empty-cell') === 'true' &&
              currentlyFocusedElement.children().length < 1) {
            this.accFocusedCell.column = initialFocusIndex;
          }
        }
        break;

      case 40: // Down Arrow
        if (this.$('.binf-dropdown-toggle').parent('.binf-dropdown').hasClass('binf-open')) {
          dropDownEle = this.$('.binf-dropdown-menu li').length - 1,
              dropDownEleIndex = $(document.activeElement.parentElement).index();
          if (dropDownEle > dropDownEleIndex) {
            dropDownEleIndex = dropDownEleIndex + 1;
            this.$(this.$('.binf-dropdown-menu li a')[dropDownEleIndex]).focus().focus();
          }
          changeFocus = false;
          break;
        }

        if (this.accFocusedCell.row < this.collection.length - 1) {
          initialFocusIndex = this.accFocusedCell.row;
          this.accFocusedCell.row++;
        }
        break;

      default:
        changeFocus = false;

      }

      if (changeFocus) {
        event.preventDefault();
        event.stopPropagation();
        this.trigger('closeOther'); // force inline bar to close
        this._accSetFocusToCurrentlyFocusedElement();
      }
    },
    _getNextFocusableElementIndex: function (modifyCellIndex, index) {
      var currentlyFocusedElement = this.currentlyFocusedElement();
      switch (modifyCellIndex) {
      case 37:
        if (this.accFocusedCell.column >= 0 &&
            currentlyFocusedElement.attr('data-csui-empty-cell') === 'true') {
          return index;
        }
        else {
          return -1;
        }
        break;

      default :
        return -1;
      }
    },

    _accSetFocusToCurrentlyFocusedElement: function () {
      var el = this.currentlyFocusedElement();
      if (el.length > 0) {
        el = $(el[0]);
        this.trigger('changed:focus', this);
        if (base.isVisibleInWindowViewport(el)) {
          el.focus();
        }
      }
    },

    getNameColumnIndex: function (displayedColumns) {
      if (!displayedColumns) {
        return undefined;
      }

      for (var colIdx = 0; colIdx < displayedColumns.length; colIdx++) {
        var column = displayedColumns[colIdx];
        if (column.isNaming) {
          return colIdx;
        }
      }
      return undefined;
    }

  });

  var TableListView = Marionette.LayoutView.extend({

    className: 'csui-table-list',

    attributes: function () {
      return {role: 'table'};
    },

    template: tableTemplate,

    regions: {
      headerRegion: '.csui-table-list-header',
      bodyRegion: '.csui-table-list-body'
    },

    behaviors: {
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: '.csui-table-list-body',
        suppressScrollX: true
      }
    },

    constructor: function TableListView(options) {
      options || (options = {});
      options.maxColumnsDisplayed || (options.maxColumnsDisplayed = 10);
      options.tableColumns || (options.tableColumns = []);

      Marionette.LayoutView.prototype.constructor.call(this, options);
      this.context = options.context;
      this.collection = options.collection;

      this.listenTo(this.collection.delayedActions, 'error',
          function (collection, request, options) {
            var error = new base.Error(request);
            GlobalMessage.showMessage('error', error.message);
          });

      this.listenTo(this.collection, 'sync', this._updateTable);
      this.listenTo(this.collection, "update", this.render);
      this.listenTo(this, "update:table", this._updateTable);

      this.onTableWinResize = _.bind(function (event) {
        this._adjustColumnsAfterWindowResize();
        this.trigger('resizetable', event);
      }, this);
      $(window).bind("resize", this.onTableWinResize);
      $(window).bind("resize.tableview", this.onTableWinResize);
    },

    onBeforeDestroy: function () {
      $(window).unbind("resize", this.onTableWinResize);
    },
    _updateTable: function (collectionOrModel) {
      if (!!this.tableBodyView && !!this.tableBodyView.accFocusedCell) {
        var row    = this.tableBodyView.accFocusedCell.row,
            column = this.tableBodyView.accFocusedCell.column;
        if (collectionOrModel === this.collection) {
          this.render();
        } else {
          this.tableBodyView.children.findByModel(collectionOrModel).render();
          this.triggerMethod('dom:refresh');
        }
        this.tableBodyView.accFocusedCell.row = row;
        this.tableBodyView.accFocusedCell.column = column;
        this.tableBodyView.trigger('changed:focus', this.tableBodyView);
      }
      else {
        this.render();
      }

    },

    onRender: function () {
      this.allColumns = this.getColumns();
      this.displayedColumns = _.where(this.allColumns, {columnWrapped: false});
      this.wrappedColumns = _.where(this.allColumns, {columnWrapped: true});
      this.tableHeaderView = new TableHeaderView({
        columns: this.displayedColumns,
        context: this.context,
        admin_permissions: this.options.admin_permissions,
        userPermissionsModel: this.collection.options.authenticatedUserPermissions,
        hasPermissionAction: !!this.options.hasPermissionAction
      });
      this.headerRegion.show(this.tableHeaderView);

      this.tableBodyView = new TableBodyView(_.defaults({
        columns: this.displayedColumns,
        wrappedColumns: this.wrappedColumns,
        context: this.context,
        collection: this.collection,
        toolbarItems: this.options.toolbarItems,
        toolbarItemsMasks: this.options.toolbarItemsMasks,
        emptyView: this.options.emptyView,
        emptyViewModel: this.options.emptyViewModel
      }, this.options));

      this.bodyRegion.show(this.tableBodyView);
      var self = this;
      this.$el.find('.csui-table-list-body').bind('scroll', function (event) {
        self.trigger('scroll', event);
      });

      this._rebuildingTable = false;
    },

    onBeforeRender: function () {
      this._rebuildingTable = true;
    },

    onDomRefresh: function (event) {
      if (this.$el.is(':visible')) {
        this._adjustColumnsAfterWindowResize();
        this.trigger('resizetable', event);
      }
    },

    getColumns: function () {
      var cols = [], self = this;
      if (this.options.tableColumns) {
        var tableColumns = this.options.tableColumns.deepClone(); // use fresh collection every time
        var sortedColumns = [];
        tableColumns.each(function (tableColumn) {
          var colDef     = tableColumn,
              column_key = tableColumn.get('key');
          tableColumn.attributes.column_key = column_key;

          sortedColumns.push(colDef);

        }, this);

        cols = _.map(sortedColumns, function (definition) {
          var CellView        = cellViewFactory.getCellView(definition),
              propertyName    = definition.get("column_key"),
              columnClassName = CellView.columnClassName;
          if (!columnClassName) {
            columnClassName = "csui-table-cell-" + propertyName;
          }
          var propertiesToMerge = ['permanentColumn', 'noTitleInHeader', 'title', 'align',
            'widthFactor', 'isNaming', 'containsInlineActions'];
          _.each(propertiesToMerge, function (propName) {
            if (CellView[propName]) {
              definition.set(propName, CellView[propName], {silent: true});
            }
          });
          var column = {
            CellView: CellView,
            name: propertyName,
            noTitleInHeader: definition.get('noTitleInHeader'),
            isToolbar: definition.get('isToolbar'),
            title: definition.get('title') || definition.get('name') ||
                   definition.get("column_name"),
            className: columnClassName
          };

          var alignment = definition.get("align");
          if (alignment) {
            if (window.csui && window.csui.rtl) {
              alignment === "left" && (alignment = "right") ||
              alignment === "right" && (alignment = "left");
            }
            column.className += " csui-align-" + alignment;
          }
          if (definition.attributes) {
            column.attributes = column.attributes || {};
            _.extend(column.attributes, definition.attributes);
          }

          return column;
        });
      }

      if (this.options.maxColumnsDisplayed || this.maxColumnsDisplayed) {
        var colCount = 0;
        _.each(cols, function (colDef) {
          if (colDef.attributes && colDef.attributes.permanentColumn === true) {
            colCount++;
            colDef.columnWrapped = false;
          }
        }, this);

        this.maxColumnsDisplayed = this.calculateMaxColumnsDisplayed(cols);
        _.each(cols, function (colDef) {
          if (!colDef.attributes || colDef.attributes.permanentColumn !== true) {
            colCount++;
            colDef.columnWrapped = (colCount > this.maxColumnsDisplayed);
          }
        }, this);

      }
      return cols;
    },

    _adjustColumns: function () {
      if (!this.displayedColumns || !this.$el.is(':visible')) {
        return;
      }
      var tableWidth = this.$el.width() - 5;
      var numberColumnsWithFixedWidth = 0;
      var sumFixedWidth = 0;
      var spaceBetweenCells = 4;  //Inline-block div has 4px space in between
      var columnCells;
      var headerCells = this.$el.find('.csui-table-header-cell');
      if (this.collection.length > 0) {
        columnCells = this.$el.find('.csui-table-body>div').first().find(
            '.csui-table-cell');  //TODO:Check for presence of first element
      } else {
        columnCells = headerCells;
      }

      var widerCellIndexes = {};
      var normalCellIndexes = [];
      var displayedColumns = this.displayedColumns;
      var widthFactorSum                 = 0,
          widestColumnIndex,
          largestWidthFactor             = 0,
          flexibleColumnWidth            = 0,
          numberColumnsWithFlexibleWidth = 0;
      columnCells.each(function (index) {
        if (index < displayedColumns.length) {
          var el = $(this);

          var column = displayedColumns[index];
          if (column.CellView && column.CellView.hasFixedWidth) {
            sumFixedWidth += el.outerWidth();
            numberColumnsWithFixedWidth++;
          } else {
            var widthFactor = (column.attributes && column.attributes.widthFactor) || 1.0;
            if (widthFactor && widthFactor !== 1.0) {
              widerCellIndexes[index] = widthFactor;
              widthFactorSum += widthFactor;
            } else {
              if (column.CellView && column.CellView.flexibleWidth) {
                flexibleColumnWidth += el.outerWidth();
                numberColumnsWithFlexibleWidth++;
              } else {
                normalCellIndexes.push(index);
                widthFactorSum += 1;
              }

            }
            if (widthFactor > largestWidthFactor) {
              largestWidthFactor = widthFactor;
              widestColumnIndex = index;
            }
          }
        }
      });
      var remainingWidth             = tableWidth - sumFixedWidth - flexibleColumnWidth -
                                       (spaceBetweenCells * displayedColumns.length),
          numberColumnsNonFixedWidth = displayedColumns.length - numberColumnsWithFixedWidth -
                                       numberColumnsWithFlexibleWidth,
          remainingWidthPerCell      = numberColumnsNonFixedWidth > 0 ?
                                       remainingWidth / numberColumnsNonFixedWidth : 0,
          sumWidthOfWideCells        = 0,
          averageWidthFactor         = widthFactorSum / numberColumnsNonFixedWidth;
      _.each(widerCellIndexes, function (widthFactor, columnIndex) {
        var wf = widthFactor / averageWidthFactor,
            w  = remainingWidthPerCell * wf;
        if (sumWidthOfWideCells + w > remainingWidth) {
          w = remainingWidth - sumWidthOfWideCells;
          if (w < 0) {
            w = 0;
          }
        }
        w = Math.floor(w);
        widerCellIndexes[columnIndex] = w;
        sumWidthOfWideCells += w;
      });
      var correctionWidth;
      if (normalCellIndexes.length > 0) {
        remainingWidthPerCell = (remainingWidth - sumWidthOfWideCells) /
                                normalCellIndexes.length / averageWidthFactor;
        remainingWidthPerCell = Math.floor(remainingWidthPerCell);
        correctionWidth = remainingWidth - sumWidthOfWideCells -
                          remainingWidthPerCell * normalCellIndexes.length;
      } else {
        remainingWidthPerCell = 0;
        correctionWidth = remainingWidth - sumWidthOfWideCells;
      }
      correctionWidth = Math.floor(correctionWidth);

      var cachedColumnWidths = {},
          view               = this;
      columnCells.each(function (index) {
        if (index < displayedColumns.length) {
          var el = $(this);
          var column = displayedColumns[index];
          var hasFixedWidth = column.CellView && column.CellView.hasFixedWidth;
          var widthStyle = {"width": el.outerWidth() + "px"};
          if (!hasFixedWidth) {
            var columnWidth;
            if (widerCellIndexes[index] && widerCellIndexes[index] > 0) {
              columnWidth = widerCellIndexes[index];
            } else {
              columnWidth = remainingWidthPerCell;
            }
            if (index === widestColumnIndex && correctionWidth) {
              columnWidth += correctionWidth;
            }
            var px = columnWidth + 'px';

            if (column.CellView.flexibleWidth) {
              $(headerCells[index]).css(widthStyle);
            } else {
              widthStyle = {"min-width": px, "max-width": px};
              $(headerCells[index]).css(widthStyle);
            }

            var tdCells = view.$el.find(
                '.csui-table-cell:nth-child(' + (index + 1) + ')');
            tdCells.css(widthStyle);
          }
          cachedColumnWidths[column.className] = widthStyle;
        }
      });
      this.cachedColumnWidths = cachedColumnWidths;
    },

    calculateMaxColumnsDisplayed: function (cols) {
      if (!cols || cols.length === 0) {
        return;
      }
      var maxColumnsDisplayed = 0, usedWidth = 0, widthFactor, width, averageWidth = 120;
      if (this.$el.length > 0 && this.$el[0].children.length > 0) {
        var tw = this.$el.width();
        _.each(cols, function (column) {
          if (column.attributes && column.attributes.permanentColumn === true) {
            widthFactor = column.attributes.widthFactor;
            width = widthFactor ? averageWidth * widthFactor : averageWidth;
            usedWidth += width;
            maxColumnsDisplayed++;
          }
        }, this);
        for (var colno = 0; colno < cols.length; colno++) {
          var column = cols[colno], selectorWidth, allNthColumns;
          if (column.attributes) {
            if (!column.attributes.permanentColumn) {
              widthFactor = column.attributes.widthFactor;
              selectorWidth = averageWidth;
              width = widthFactor ? selectorWidth * widthFactor : selectorWidth;
              usedWidth += width;
              if (usedWidth > tw) {
                break;
              }
              maxColumnsDisplayed++;
            }
          }
        }
        if (maxColumnsDisplayed > this.options.maxColumnsDisplayed) {
          maxColumnsDisplayed = this.options.maxColumnsDisplayed;
        }
        if (maxColumnsDisplayed < 1) {
          maxColumnsDisplayed = 1;
        }
      } else {
        maxColumnsDisplayed = this.options.maxColumnsDisplayed;
      }
      return maxColumnsDisplayed;
    },

    _adjustColumnsAfterWindowResize: function () {

      if (!this.allColumns.length) {
        return;
      }
      if (this.maxColumnsDisplayed && this.$el.is(':visible')) {
        var maxColumns = this.calculateMaxColumnsDisplayed(this.allColumns);
        if (maxColumns !== this.maxColumnsDisplayed) {
          this.maxColumnsDisplayed = maxColumns;
          if (!this._rebuildingTable) {
            return setTimeout(_.bind(this.render, this));
          }
        }
      }
      this._adjustColumns();
    }

  });

  _.extend(TableListView.prototype, LayoutViewEventsPropagationMixin);

  return TableListView;
});