/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/utils/base',
  'csui/controls/toolbar/toolitems.filtered.model',
  'csui/controls/toolbar/toolbar.command.controller',
  'csui/controls/toolbar/toolbar.view',
  'csui/controls/toolbar/delayed.toolbar.view',
  'csui/controls/table.rowselection.toolbar/impl/right.toolbar.view',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/mixins/global.alert/global.alert.mixin',
  'hbs!csui/controls/table.rowselection.toolbar/impl/table.rowselection.toolbar',
  'css!csui/controls/table.rowselection.toolbar/impl/table.rowselection.toolbar'
], function ($, _,
    Backbone, Marionette, base,
    FilteredToolItemsCollection,
    ToolbarCommandController,
    ToolbarView,
    DelayedToolbarView,
    RightToolbarView,
    TabableRegionBehavior,
    GlobalAlertMixin,
    template) {
  'use strict';

  var TableRowSelectionToolbarView = Marionette.LayoutView.extend({
    template: template,
    className: 'csui-table-rowselection-toolbar-view',

    regions: {
      toolbarRegion: '.csui-toolbar-region',
      rightToolbarRegion: '.csui-right-toolbar-region'
    },

    events: {
      'keydown': 'onKey'
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    currentlyFocusedElement: function () {
      return $(this._focusableElements[this._focusedToolbarItemIndex]);
    },

    constructor: function TableRowSelectionToolbarView(options) {
      options || (options = {});

      Marionette.LayoutView.prototype.constructor.apply(this, arguments);

      this._focusedToolbarItemIndex = 0;
    },

    initialize: function (options) {

      var status = {
        nodes: options.selectedChildren,
        context: options.context,
        collection: options.collection,
        container: options.collection.node
      };

      this._commandController = options.toolbarCommandController ||
                                new ToolbarCommandController({
                                  commands: options.commands
                                });
      this._filteredToolItemsCollection = new FilteredToolItemsCollection(
          options.toolItemFactory, {
            status: status,
            commands: this._commandController.commands,
            delayedActions: options.collection.delayedActions,
            mask: options.toolbarItemsMask
          });
      var toolbarViewOptions = _.extend({
        originatingView: options.originatingView,
        collection: this._filteredToolItemsCollection,
        toolbarName: 'tableHeader'
      }, options.toolItemFactory.options, {role: 'menu'});

      if (options.collection.delayedActions) {
        this._toolbarView = new DelayedToolbarView(toolbarViewOptions);
      } else {
        this._toolbarView = new ToolbarView(toolbarViewOptions);
      }
      this.listenTo(this._toolbarView, 'childview:toolitem:action', this._toolbarItemClicked);
      this.listenTo(this._toolbarView, 'render render:lazy:actions', function () {
        this._updateCounts();
        if (this._focusableElements.length) {
          this._focusedToolbarItemIndex = 0;
          this._moveTabindexToFocusedElement();
        }
      });

      this._rightToolbarView = new RightToolbarView(options);
      this.listenTo(this._rightToolbarView, 'toggle:condensed:header', function () {
        this.trigger('toggle:condensed:header');
      });
      this.listenTo(this, 'toolbar:activity', function (toolbarVisible, headerVisible) {
        this._rightToolbarView.triggerMethod('toolbar:activity', toolbarVisible, headerVisible);
      });

      this.listenTo(this._commandController, 'before:execute:command', function (eventArgs) {
        this._toolbarView.trigger('before:execute:command', eventArgs);
      });
      this.listenTo(this._commandController, 'after:execute:command', function (eventArgs) {
        this._toolbarView.trigger('after:execute:command', eventArgs);
      });

      this.listenTo(this, 'render', function () {
        this.toolbarRegion.show(this._toolbarView);
        this.rightToolbarRegion.show(this._rightToolbarView);
      });

      this.listenTo(this, 'dom:refresh', function () {
        this._toolbarView.triggerMethod('dom:refresh');
        this._rightToolbarView.triggerMethod('dom:refresh');
      });

    },

    _toolbarItemClicked: function (toolItemView, args) {
      var executionContext = {
        context: this.options.context,
        nodes: this.options.selectedChildren,
        container: this.options.collection.node,
        collection: this.options.collection,
        originatingView: this.options.originatingView,
        toolItemView: toolItemView
      };

      this._commandController.toolitemClicked(args.toolItem, executionContext);
    },

    onKey: function (event) {
      switch (event.keyCode) {
      case 37:
          this._updateCounts();
        if (this._focusedToolbarItemIndex > 0) {
          this._focusedToolbarItemIndex--;
          if (this._focusedToolbarItemIndex >= this._visibleToolitemsCount) {
            this._focusedToolbarItemIndex = this._visibleToolitemsCount - 1;
          }
        } else {
          this._focusedToolbarItemIndex = 0;
        }
        this._moveTabindexToFocusedElement();
        this._moveFocus();
        event.preventDefault();
        event.stopPropagation();
        break;
      case 39:
        this._updateCounts();
        if (this._focusedToolbarItemIndex < this._visibleToolitemsCount - 1) {
          this._focusedToolbarItemIndex++;
        } else {
          this._focusedToolbarItemIndex = this._visibleToolitemsCount - 1;
        }
        this._moveTabindexToFocusedElement();
        this._moveFocus();
        event.preventDefault();
        event.stopPropagation();
        break;
      }
    },

    _updateCounts: function () {
      this._focusableElements = base.findFocusables(this._toolbarView.el);
      this._visibleToolitemsCount = this._toolbarView.getVisibleToolitemsCount();
    },

    _moveTabindexToFocusedElement: function () {
      for (var i = 0; i < this._focusableElements.length; i++) {
        if (i === this._focusedToolbarItemIndex) {
          this._focusableElements[i].setAttribute('tabindex', '0');
        } else {
          this._focusableElements[i].setAttribute('tabindex', '-1');
        }
      }
    },

    _moveFocus: function () {
      this.trigger('changed:focus');
      if (this._toolbarView) {
        this._toolbarView.setFocusByIndex(this._focusedToolbarItemIndex);
      }
    }

  });

  _.extend(TableRowSelectionToolbarView.prototype, GlobalAlertMixin);

  return TableRowSelectionToolbarView;

});
