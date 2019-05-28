/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/utils/log', 'csui/controls/toolbar/toolitem.view',
  'csui/models/nodes', 'csui/controls/toolbar/toolitems.filtered.model', 'csui/utils/commands',
  'csui/controls/toolbar/toolbar.command.controller',
  'csui/behaviors/dropdown.menu/dropdown.menu.behavior',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'hbs!csui/controls/table.configuration.toolbar/impl/configuration.toolbar.dropdown',
  'i18n!csui/controls/table.configuration.toolbar/impl/nls/localized.strings',
  'css!csui/controls/table.configuration.toolbar/impl/configuration.toolbar.dropdown',
  'csui/lib/binf/js/binf'
], function ($, _, Backbone, Marionette, log, ToolItemView,
    NodeCollection, FilteredToolItemsCollection, commands, ToolbarCommandController,
    DropdownMenuBehavior, PerfectScrollingBehavior, template, lang) {
  var ConfigurationDropdownMenuView = Marionette.CompositeView.extend({

    className: "csui-configuration-view",

    template: template,
    templateHelpers: function () {
      return {
        btnId: _.uniqueId('configurationButton'),
        configurationButtonTooltip: lang.configurationButtonTooltip
      };
    },

    childView: ToolItemView,
    childViewContainer: "ul.binf-dropdown-menu",
    childViewOptions: function (model) {
      return {
        renderTextOnly: true,
        role: 'menuitem'
      };
    },

    ui: {
      dropdownDiv: '.binf-dropdown',
      dropdownToggle: '.binf-dropdown-toggle',
      dropdownMenu: '.binf-dropdown-menu',
      loadingIconsDiv: '.csui-loading-parent-wrapper'
    },

    behaviors: {
      DropdownMenuBehavior: {
        behaviorClass: DropdownMenuBehavior
      },
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: '.command-view-region'
      }
    },

    constructor: function ConfigurationDropdownMenuView(options) {
      options || (options = {});
      this.context = options.context;
      this.commands = options.commands || commands;
      this.commandController = options.toolbarCommandController ||
                               new ToolbarCommandController({commands: this.commands});
      this.selectedNodes = (options.status && options.status.nodes) || new NodeCollection();
      this.container = options.container;

      this.status = options.status || {
            context: this.context,
            nodes: this.selectedNodes,
            container: this.container
          };

      options.collection = new FilteredToolItemsCollection(
          options.toolbarItems, {
            status: this.status,
            commands: this.commands,
            mask: options.toolbarItemsMask
          });

      Marionette.CompositeView.prototype.constructor.apply(this, arguments);

      this.listenTo(this, 'childview:toolitem:action', this._triggerMenuItemAction)
          .listenTo(Backbone, 'closeToggleAction', this._closeToggle);
    },

    enabled: function () {
      return this.options.context ? true : false;
    },

    onRender: function () {
      if (this.collection.length < 1) {
        this.$el.addClass('binf-hidden');
        this.ui.dropdownToggle.attr('data-cstabindex', '-1');
        this.ui.dropdownToggle.removeClass('csui-acc-focusable');
      } else {
        this.$el.find('.binf-dropdown').removeClass('binf-hidden');
        this.$el.removeClass('binf-hidden');
        this.ui.dropdownToggle.attr('data-cstabindex', '0');
        this.ui.dropdownToggle.addClass('csui-acc-focusable');
      }

      if (this.collection.length > 0) {
        this.ui.dropdownToggle.binf_dropdown();
        this.ui.dropdownDiv.on('hide.binf.dropdown', _.bind(function () {
          this._showMenuItems();
        }, this));
      }
    },

    _closeToggle: function () {
      var dropdownToggleEl = this.$el.find('.binf-dropdown-toggle');
      if (dropdownToggleEl.parent().hasClass('binf-open')) {
        dropdownToggleEl.binf_dropdown('toggle', false);
      }
      this._showMenuItems();
    },

    _triggerMenuItemAction: function (toolItemView, args) {
      if (args && args.toolItem && args.toolItem.get('menuWithMoreOptions') === true) {
        this._toolitemClicked(toolItemView, args);
      } else {
        var dropdownToggleEl = this.$el.find('.binf-dropdown-toggle');
        dropdownToggleEl.binf_dropdown('toggle'); // close dropdown menu before triggering the event

        var executionContext = _.extend(this.status, {
          originatingView: this.options.originatingView,
          blockingParentView: this.options.blockingParentView,
          configurationMenuView: this,
          toolItemView: toolItemView
        });
        this.commandController.toolitemClicked(args.toolItem, executionContext);
      }
    },
    _toolitemClicked: function (toolItemView, args) {
      var self = this;
      var signature = args.toolItem.get("signature");
      var command = this.commandController.commands.findWhere({
        signature: signature
      });

      var status = _.extend(this.status, {
        originatingView: this.options.originatingView,
        blockingParentView: this.options.blockingParentView,
        configurationMenuView: this,
        toolItemView: toolItemView
      });
      var data = _.extend({}, status.data, args.toolItem.get('commandData'));
      status = _.defaults({
        toolItem: args.toolItem,
        data: data
      }, status);

      var eventArgs = {
        status: status,
        commandSignature: signature,
        command: command
      };
      this.commandController.trigger('before:execute:command', eventArgs);

      var executeOptions = {
        context: status.context
      };
      command.execute(status, executeOptions)
          .done(function (args) {
            if (args && args.viewClass) {
              self._showCommandViewInDropdownMenu(args.viewClass, args.viewOptions || {});
            }
            self.commandController.trigger('after:execute:command', eventArgs);
          })
          .fail(function (error) {
            if (error === undefined) {
              error = {
                cancelled: true,
                commandSignature: signature
              };
            }
            self.commandController.trigger('after:execute:command', error);
          });
    },

    _showCommandViewInDropdownMenu: function (viewClass, viewOptions) {
      var commandView = new viewClass(viewOptions);
      this.listenTo(commandView, 'go:back', _.bind(function () {
        this._showMenuItemsWithAnimation();
      }, this));
      this.listenTo(commandView, 'close:menu', _.bind(function () {
        this._showMenuItems();
        this._closeToggle();
      }, this));
      this.listenTo(commandView, 'dom:refresh', _.bind(function () {
        this.trigger('render');
        this.trigger('update:scrollbar');
      }, this));
      this._ensureCommandViewRegion();
      this.commandViewRegion.show(commandView);
      this._hideMenuItemsWithAnimation();
    },

    _ensureCommandViewRegion: function () {
      if (!this.commandViewRegion) {
        this.ui.dropdownMenu.append('<div class="command-view-region"></div>');
        var commandViewRegion = this.ui.dropdownMenu.find('.command-view-region');
        this.commandViewRegion = new Marionette.Region({
          el: commandViewRegion
        });
        commandViewRegion.on('click', function(event) {
          event.preventDefault();
          event.stopPropagation();
        });
        this.commandViewRegion.$el.hide();
      }
    },

    _emptyCommandViewRegion: function () {
      if (this.commandViewRegion) {
        this.commandViewRegion.empty();
      }
    },

    _showMenuItems: function () {
      this.ui.dropdownMenu.find('> li').show();
      this._emptyCommandViewRegion();
      this.commandViewRegion && this.commandViewRegion.$el.hide();
    },

    _showMenuItemsWithAnimation: function () {
      var self = this;
      var $rightArrows = this.ui.dropdownMenu.find('.csui-icon-rightArrow');
      $rightArrows.addClass('binf-hidden');
      self.ui.dropdownMenu.css('overflow', 'hidden');
      self.ui.dropdownMenu.animate({
        'width': self.dropdownMenuOriginalWidth,
        'height': self.dropdownMenuOriginalHeight
      }, 500);
      self.commandViewRegion.$el.css({
        'position': 'absolute',
        'top': self.ui.dropdownMenu.css('padding-top'),
        'background-color': self.ui.dropdownMenu.css('background-color'),
        'opacity': 1
      });
      self.ui.dropdownMenu.find('> li').show();
      self.commandViewRegion.$el.hide('blind', {
        direction: 'right',
        complete: function () {
          self._emptyCommandViewRegion();
          $rightArrows.removeClass('binf-hidden');
          self.commandViewRegion.$el.css({
            'position': '',
            'top': '',
            'background-color': '',
            'opacity': ''
          });
          self.ui.dropdownMenu.css({
            'overflow': '',
            'width': '',
            'height': ''
          });
        }
      }, 500);
    },

    _hideMenuItemsWithAnimation: function () {
      var self = this;
      var $rightArrows = this.ui.dropdownMenu.find('.csui-icon-rightArrow');
      $rightArrows.addClass('binf-hidden');
      self.dropdownMenuOriginalWidth = self.ui.dropdownMenu.css('width');
      self.dropdownMenuOriginalHeight = self.ui.dropdownMenu.css('height');
      self.ui.dropdownMenu.css('overflow', 'hidden');
      self.ui.dropdownMenu.animate({
        'width': self.commandViewRegion.$el.width(),
        'height': self.commandViewRegion.$el.height()
      }, 500);
      self.commandViewRegion.$el.css({
        'position': 'absolute',
        'top': self.ui.dropdownMenu.css('padding-top'),
        'background-color': self.ui.dropdownMenu.css('background-color'),
        'opacity': 1
      });
      self.commandViewRegion.$el.show('blind', {
        direction: 'right',
        complete: function () {
          self.ui.dropdownMenu.find('> li').hide();
          $rightArrows.removeClass('binf-hidden');
          self.commandViewRegion.$el.css({
            'position': '',
            'top': '',
            'background-color': '',
            'opacity': ''
          });
          self.ui.dropdownMenu.css({
            'width': '',
            'height': ''
          });
        }
      }, 500);
    }

  });

  return ConfigurationDropdownMenuView;
});
