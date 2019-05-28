/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["module",
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/controls/toolbar/toolitem.model',
  'csui/controls/toolbar/toolitem.view',
  'csui/models/nodes',
  'csui/controls/toolbar/toolitems.filtered.model',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/behaviors/dropdown.menu/dropdown.menu.behavior',
  'csui/utils/commands',
  'hbs!csui/controls/item.title/impl/dropdown.menu/dropdown.menu',
  'i18n!csui/controls/item.title/impl/nls/localized.strings',
  'css!csui/controls/item.title/impl/dropdown.menu/dropdown.menu'

], function (module, $, _, Backbone, Marionette,
    ToolItemModel,
    ToolItemView,
    NodeCollection,
    FilteredToolItemsCollection,
    TabableRegionBehavior,
    DropdownMenuBehavior,
    commands,
    template, lang) {
  'use strict';

  var DropdownMenuView = Marionette.CompositeView.extend({

    className: "csui-item-title-dropdown-menu",

    template: template,
    templateHelpers: function () {
      return {
        hasCommands: !!this.collection.length,
        btnId: _.uniqueId('dropdownMenuButton'),
        showMoreTooltip: lang.showMore,
        showMoreAria: lang.showMoreAria
      };
    },

    childView: ToolItemView,
    childViewContainer: "ul.binf-dropdown-menu",
    childViewOptions: function (model) {
      return {
        role: 'menuitem'
      };
    },

    ui: {
      dropdownToggle: '.binf-dropdown-toggle'
    },

    behaviors: {
      TabableRegionBehavior: {
        behaviorClass: TabableRegionBehavior
      },
      DropdownMenuBehavior: {
        behaviorClass: DropdownMenuBehavior
      }
    },

    constructor: function DropdownMenuView(options) {
      options.collection = new FilteredToolItemsCollection(
          options.toolItems, {
            status: this._createCommandStatus(options),
            commands: this.commands,
            mask: options.toolItemsMask
          });

      options.reorderOnSort = true;
      Marionette.CompositeView.prototype.constructor.apply(this, arguments);
      _.defaults(this.options, options.toolItems.options);  // set options from ToolItemFactory

      this.commands = options.commands || commands;
      if (options.el) {
        $(options.el).addClass(_.result(this, "className"));
      }

      this.listenTo(this, "childview:toolitem:action", this._triggerMenuItemAction)
          .listenTo(this.model, "sync", this.render)
          .listenTo(this, 'close:menu', this._closeToggle)
          .listenTo(Backbone, 'closeToggleAction', this._closeToggle)
          .listenTo(this.model, "change", this.render);
    },

    _createCommandStatus: function (options) {
      return {
        nodes: new NodeCollection([options.model]),
        container: options.model,
        context: options.context
      };
    },

    _updateCollectionStatus: function () {
      var status = this._createCommandStatus(this.options);
      this.options.collection.setStatus(status);
    },

    onBeforeRender: function () {
      this._updateCollectionStatus();
    },

    onRender: function () {
      this.ui.dropdownToggle.binf_dropdown();
      this.delegateEvents();
    },

    currentlyFocusedElement: function () {
      return $(this.ui.dropdownToggle);
    },

    _closeToggle: function () {
      if (this.ui.dropdownToggle.parent().hasClass('binf-open')) {
        this.ui.dropdownToggle.binf_dropdown('toggle');
      }
      this.ui.dropdownToggle.attr('aria-expanded', 'false');
    },

    _triggerMenuItemAction: function (toolItemView, args) {
      this.ui.dropdownToggle.binf_dropdown('toggle');  // close the dropdown menu before triggering the event

      var signature = args.toolItem.get("signature");
      var command = this.commands.findWhere({signature: signature});

      if (signature === 'Rename') {
        setTimeout(_.bind(function () {
          this.trigger('rename', this);
        }, this), 200);
      } else {
        var status = {
          context: this.options.context,
          nodes: new NodeCollection([this.model]),
          container: this.model,
          originatingView: this.options.originatingView
        };
        if (command && command.enabled(status)) {
          command.execute(status);
        }
      }
    }
  });

  return DropdownMenuView;
});
