/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'require', 'csui/lib/jquery', 'csui/lib/underscore',
  'csui/lib/backbone', 'csui/lib/marionette', 'csui/utils/log', 'csui/utils/base',
  'csui/models/nodes', 'csui/controls/toolbar/toolitem.model',
  'csui/controls/toolbar/toolitems.filtered.model',
  'csui/controls/toolbar/toolbar.view',
  'csui/controls/item.title/item.title.view',
  'csui/controls/toolbar/delayed.toolbar.view',
  'csui/utils/commandhelper', 'csui/utils/commands/add',
  'i18n!csui/controls/tabletoolbar/impl/nls/localized.strings',
  'csui/controls/table/inlineforms/inlineform.factory',
  'hbs!csui/controls/tabletoolbar/impl/tabletoolbar',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/controls/mixins/global.alert/global.alert.mixin',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/toolbar/toolbar.state.behavior',
  'csui/controls/toolbar/toolbar.command.controller',
  'csui/utils/commands',
  'csui-ext!csui/controls/tabletoolbar/tabletoolbar.view',
  'csui/lib/jquery.when.all',
  'css!csui/controls/tabletoolbar/impl/tabletoolbar'
], function (module, require, $, _, Backbone, Marionette, log, base,
    NodeCollection, ToolItemModel, FilteredToolItemsCollection,
    ToolbarView, ItemTitleView, DelayedToolbarView, CommandHelper, AddCommand,
    tableToolbarLang, inlineFormViewFactory, template,
    LayoutViewEventsPropagationMixin, GlobalAlertMixin, TabableRegionBehavior,
    ToolbarStateBehavior, ToolbarCommandController, commands,
    toolbarExtensions) {
  'use strict';

  var TableToolbarView = Marionette.LayoutView.extend({
    template: template,

    regions: {
      filterToolbarRegion: '.csui-filterToolbar', // filter toolbar
      addToolbarRegion: '.csui-addToolbar', // add toolbar
      leftToolbarRegion: '.csui-leftToolbar', // left toolbar
      otherToolbarRegion: '.csui-otherToolbar', // other toolbar
      toolbarCaptionRegion: '.csui-toolbar-caption', // caption
      rightToolbarRegion: '.csui-rightToolbar' // right toolbar
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    toolbarItemSelector: 'a.' + TabableRegionBehavior.accessibilityFocusableClass + ',' +
                         'button.' + TabableRegionBehavior.accessibilityFocusableClass + ',' +
                         'div.' + TabableRegionBehavior.accessibilityFocusableClass,

    events: {"keydown": "onKeyInView"},

    currentlyFocusedElement: function () {

      var toolbarElements = this.$(this.toolbarItemSelector);
      var elementOfFocus = toolbarElements.length ?
                           $(toolbarElements[this.accNthToolbarItemFocused]) : null;
      return elementOfFocus;
    },

    constructor: function TableToolbarView(options) {
      options || (options = {});

      this.context = options.context;
      this.commandController = options.toolbarCommandController ||
                               new ToolbarCommandController({
                                 commands: options.commands || commands
                               });
      this.addableTypes = options.addableTypes;
      this.originatingView = options.originatingView || this;
      this.blockingParentView = options.blockingParentView;
      this.selectedNodes = new NodeCollection();
      this.accNthToolbarItemFocused = 0;
      this.toolbarNames = ['filter', 'add', 'left', 'other', 'right'];

      Marionette.LayoutView.prototype.constructor.apply(this, arguments); // sets this.options

      this.listenTo(this, 'before:regions:reinitialize', this.initialize);
    },

    initialize: function (options) {
      this.container = options.container || this.collection.node;

      var status = {
        context: this.context,
        nodes: this.selectedNodes,
        container: this.container,
        collection: this.collection,
        data: {
          addableTypes: this.addableTypes,
        }
      };

      _.each(this.toolbarNames, function (toolbarName) {
        var fullToolbarName = toolbarName + 'Toolbar',
            toolItemFactory = this.options.toolbarItems[fullToolbarName];
        if (toolItemFactory) {
          var toolbarItemsMask = this.options.toolbarItemsMasks &&
                                 this.options.toolbarItemsMasks.toolbars[fullToolbarName];
          var delayedActions = toolbarName === 'other' &&
                               this.collection.delayedActions;
          var filteredCollection = new FilteredToolItemsCollection(
              toolItemFactory, {
                status: status,
                commands: this.commandController.commands,  // todo: move filteredCollection to
                delayedActions: delayedActions,
                mask: toolbarItemsMask
        });
          var toolbarClass = delayedActions ? DelayedToolbarView : ToolbarView,
              toolbarView  = new toolbarClass(_.extend({
                collection: filteredCollection,
                toolbarName: toolbarName,
                toolbarCommandController: this.commandController,
                toolbarItemsMask: toolbarItemsMask,
                originatingView: this.originatingView,
                blockingParentView : this.blockingParentView
              }, toolItemFactory.options));
          this[toolbarName + 'ToolbarView'] = toolbarView;
          if (toolbarView.closeDropdown) {
            toolbarView.listenTo(this, 'changed:focus close:dropdown', toolbarView.closeDropdown);
          }
          this
              .listenTo(toolbarView, 'childview:toolitem:action',
                  this._toolbarItemClicked)
              .listenTo(toolbarView, 'dom:refresh', function () {
                this.triggerMethod('refresh:tabindexes');
              }).listenTo(this.commandController, 'after:execute:command', function (eventArgs) {
                if (eventArgs && eventArgs.cancelled) {
                  var targetToolItem  = this.$el.find('[data-csui-command=' +
                                                      eventArgs.commandSignature.toLowerCase() +
                                                      '] a'),
                      isUnderDropDown = targetToolItem.length ?
                                        targetToolItem.closest('ul.csui-more-dropdown-menu') : {};
                  if (isUnderDropDown.length) {
                    isUnderDropDown.siblings('a.binf-dropdown-toggle').focus();
                  } else {
                    targetToolItem.focus();
                  }
                }
              });
          if (delayedActions) {
            this.listenTo(this.selectedNodes, 'reset', function () {
              toolbarView.actionState.set('showMessage', !!this.selectedNodes.length);
            });
          }
        }
      }, this);

      if (this.options.toolbarItems.addToolbar && this.addableTypes) {
        this._updateAddToolbar();
        this.listenTo(this.addableTypes, 'reset', this._updateAddToolbar, this);
      }

      if (this.options.headermenuItems &&
          this.options.headermenuItems.headerMenuToolbar && this.container) {
        this.captionView = new ItemTitleView({
          model: this.container,
          toolItems: this.options.headermenuItems.headerMenuToolbar,
          toolItemsMask: this.options.headermenuItemsMask,
          context: this.context,
          commands: this.commandController.commands,
          originatingView: this.originatingView
        });
        this.captionView.listenTo(this, 'changed:focus', this.captionView.closeMenu);
      }

      this.propagateEventsToRegions();
      this.prepareForGlobalAlert();

      var self = this;
      if (toolbarExtensions) {
        toolbarExtensions.forEach(function (entryPoint) {
          entryPoint(self);
        });
      }
    },

    _moveTo: function (event) {
      event.preventDefault();
      event.stopPropagation();
      this.trigger('changed:focus', this);
      this.currentlyFocusedElement().focus();
    },

    onKeyInView: function (event) {

      var toolbarElements;
      if ($(event.target).is(':input') &&
          !$(event.target).hasClass(TabableRegionBehavior.accessibilityFocusableClass)) {
        return; // if keyboard event was from input element, ignore it
      }
      switch (event.keyCode) {
      case 9:
        this.trigger('close:dropdown');
        break;
      case 37:
        toolbarElements = this.$(this.toolbarItemSelector);
        if (this.accNthToolbarItemFocused > 0) {
          this.accNthToolbarItemFocused--;
        }
        this._moveTo(event);
        break;
      case 39:
        toolbarElements = this.$(this.toolbarItemSelector);
        if (this.accNthToolbarItemFocused < toolbarElements.length - 1) {
          this.accNthToolbarItemFocused++;
        }
        this._moveTo(event);
        break;
      case 35:
        if (!$(event.target).closest('ul').hasClass('binf-dropdown-menu')) {
          toolbarElements = this.$(this.toolbarItemSelector);
          this.accNthToolbarItemFocused = toolbarElements.length - 1;
          this._moveTo(event);
        }
        break;
      case 36:
        if (!$(event.target).closest('ul').hasClass('binf-dropdown-menu')) {
          this.accNthToolbarItemFocused = 0;
          this._moveTo(event);
        }
        break;
      }
    },

    _updateAddToolbar: function () {
      var toolbarItems = [];
      this.addableTypes.each(function (addableType) {
        var addType = addableType.get('type');
        var isAddableWithoutInlineForm = AddCommand.isAddableTypeWithoutInlineForm(addType);
        var inlineFormView;
        if (!isAddableWithoutInlineForm) {
          inlineFormView = inlineFormViewFactory.getInlineFormView(addType);
        }
        if (isAddableWithoutInlineForm || inlineFormView) {
          var toolItem = new ToolItemModel({
            signature: 'Add',
            name: addableType.get('type_name'),
            title: _.str.sformat(tableToolbarLang.AddToolbarItemsTitle,
                addableType.get('type_name')),
            type: addType,
            group: 'add',
            commandData: {
              type: addType,
              addableTypes: this.addableTypes
            }
          });
          toolbarItems.push(toolItem);
        }
      }, this);

      var deferreds = [],
          self      = this;
      this.triggerMethod('before:updateAddToolbar', {
        context: this.context,
        container: this.container,
        addableTypes: this.addableTypes,
        toolbarItems: toolbarItems,
        async: function () {
          var deferred = $.Deferred();
          deferreds.push(deferred);
          return function () {
            deferred.resolve();
          };
        }
      });

      $.whenAll.apply($, deferreds).always(function () {
        if (self.options.creationToolItemsMask) {
          toolbarItems = self.options.creationToolItemsMask.maskItems(toolbarItems);
        }
        self.options.toolbarItems.addToolbar.reset(toolbarItems);
      });
    },
    _toolbarItemClicked: function (toolItemView, args) {
      var executionContext = {
        context: this.context,
        nodes: this.selectedNodes,
        container: this.container,
        collection: this.collection,
        originatingView: this.originatingView,
        toolItemView: toolItemView
      };

      this.commandController.toolitemClicked(args.toolItem, executionContext);
    },
    updateForSelectedChildren: function (selectedNodes) {
      this.selectedNodes.reset(selectedNodes);
    },

    onRender: function () {
      if (this.options.height) {
        this.$el.height(this.options.height);
      }
      _.each(this.toolbarNames, function (toolbarName) {
        var view = this[toolbarName + 'ToolbarView'];
        if (view) {
          view.collection.refilter();
          this[toolbarName + 'ToolbarRegion'].show(view);
        }
      }, this);
      if (this.captionView) {
        this.toolbarCaptionRegion.show(this.captionView);
      }
    }

  });

  _.extend(TableToolbarView.prototype, LayoutViewEventsPropagationMixin);
  _.extend(TableToolbarView.prototype, GlobalAlertMixin);

  return TableToolbarView;

});
