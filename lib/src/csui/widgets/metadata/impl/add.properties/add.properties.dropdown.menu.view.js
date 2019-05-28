/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["csui/lib/jquery", "csui/lib/underscore", "csui/lib/backbone", "csui/lib/marionette",
  'csui/utils/log', 'csui/controls/toolbar/toolitem.view', 'csui/controls/progressblocker/blocker',
  'csui/models/nodes', 'csui/controls/toolbar/toolitems.filtered.model', 'csui/utils/commands',
  'csui/behaviors/dropdown.menu/dropdown.menu.behavior',
  'hbs!csui/widgets/metadata/impl/add.properties/add.properties.dropdown.menu',
  'i18n!csui/widgets/metadata/impl/nls/lang',
  'css!csui/widgets/metadata/impl/add.properties/add.properties.dropdown.menu',
  'csui/lib/binf/js/binf'
], function ($, _, Backbone, Marionette, log, ToolItemView, BlockingView,
    NodeCollection, FilteredToolItemsCollection, commands, DropdownMenuBehavior,
    template, lang) {
  var AddPropertiesDropdownMenuView = Marionette.CompositeView.extend({

    className: "metadata-add-properties",

    template: template,
    templateHelpers: function () {
      return {
        btnId: _.uniqueId('addPropertiesButton'),
        addTitleTooltip: (this.collection.length === 1 ?
                          this.collection.at(0).get('name') : lang.addNewProperties)
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
      dropdownDiv: '.binf-dropdown',
      dropdownToggle: '.binf-dropdown-toggle',
      loadingIconsDiv: '.csui-loading-parent-wrapper'
    },

    behaviors: {
      DropdownMenuBehavior: {
        behaviorClass: DropdownMenuBehavior
      }
    },

    constructor: function AddPropertiesDropdownMenuView(options) {
      options || (options = {});
      this.context = options.context;
      this.commands = options.commands || commands;
      this.node = options.node;
      this.container = options.container;
      this.formCollection = options.collection;
      this.originalFormCollection = options.formCollection;
      this.listenTo(this.formCollection, "reset", this._updateMenuItems);

      this.originatingView = options.originatingView;
      if (options.blockingParentView) {
        BlockingView.delegate(this, options.blockingParentView);
      } else {
        BlockingView.imbue(this);
      }

      var status = {
        nodes: new NodeCollection([options.node]),
        container: options.container,
        formCollection: this.formCollection,
        originalFormCollection: this.originalFormCollection,
        context: options.context
      };

      var toolbarName = 'addPropertiesToolbar';
      var toolItemFactory = options.toolbarItems[toolbarName];
      options.collection = new FilteredToolItemsCollection(
          toolItemFactory, {
            status: status,
            commands: this.commands,
            delayedActions: options.containerCollection &&
                            options.containerCollection.delayedActions,
            mask: options.toolbarItemsMask
          });

      Marionette.CompositeView.prototype.constructor.apply(this, arguments);
      if (options.el) {
        $(options.el).addClass(_.result(this, "className"));
      }

      this.listenTo(this, "childview:toolitem:action", this._triggerMenuItemAction)
          .listenTo(this.node, 'sync change', this._reRender)
          .listenTo(Backbone, 'closeToggleAction', this._closeToggle);

      if (options.containerCollection && options.containerCollection.delayedActions) {
        this.listenTo(options.containerCollection.delayedActions, 'sync', this._reRender);
      }
    },

    _updateMenuItems: function () {
      this.collection.refilter();
    },

    _reRender: function () {
      if (this._isRendered && !this.isDestroyed) {
        this._updateMenuItems();
        this.render();
      }
    },

    onRender: function () {
      this._ensureLazyActionsRetrieved().done(_.bind(function () {
        if (this.collection.length < 1 || this.options.suppressAddProperties === true) {
          this.$el.addClass('binf-hidden');
          this.ui.dropdownToggle.attr('data-cstabindex', '-1');
        } else {
          this.$el.find('.binf-dropdown').removeClass('binf-hidden');
          this.$el.removeClass('binf-hidden');
          this.ui.dropdownToggle.attr('data-cstabindex', '0');
          if (this.collection.length === 1) {
            this.ui.dropdownToggle.attr('aria-haspopup', false);
          }
        }

        if (this.collection.length > 1) {
          this.ui.dropdownToggle.binf_dropdown();
        }

        this.ui.dropdownDiv.on('click', _.bind(this._onClickAddButton, this));
        this.ui.dropdownToggle.on('click', _.bind(this._onClickAddButton, this));

        var self = this;
        setTimeout(function () {
          var event = $.Event('tab:content:render');
          self.$el.trigger(event);
        }, 200);

      }, this)).fail(function () {
        this.$el.addClass('binf-hidden');
        this.ui.dropdownToggle.attr('data-cstabindex', '-1');
      });

    },

    _closeToggle: function () {
      if (this.options.suppressAddProperties !== true) {
        var dropdownToggleEl = this.$el.find('.binf-dropdown-toggle');
        if (dropdownToggleEl.parent().hasClass('binf-open')) {
          dropdownToggleEl.binf_dropdown('toggle', false);
        }
      }
    },

    _onClickAddButton: function (event) {
      if (this.collection.length === 1) {
        Backbone.trigger('closeToggleAction');
        event.preventDefault();
        event.stopPropagation();
        this._executeAction(this.collection.at(0).get('signature'));
      }
    },

    _triggerMenuItemAction: function (toolItemView, args) {
      var dropdownToggleEl = this.$el.find('.binf-dropdown-toggle');
      dropdownToggleEl.binf_dropdown('toggle');  // close the dropdown menu before triggering the event

      this._executeAction(args.toolItem.get("signature"));
    },

    _executeAction: function (signature) {
      var command = this.commands.findWhere({signature: signature});

      var executeOptions = {
        action: this.options.action,
        node: this.options.node,
        collection: this.formCollection,
        container: this.options.container,
        inheritance: this.options.inheritance,
        context: this.options.context,
        parentView: this.options.parentView,  // use for blocking view and callback
        addPropertiesCallback: this.options.addPropertiesCallback
      };

      var status = {
        context: this.options.context,
        nodes: new NodeCollection([this.node]),
        container: this.options.container,
        formCollection: this.formCollection,
        originalFormCollection: this.originalFormCollection,
        originatingView: this.originatingView
      };

      if (command && command.enabled(status)) {
        var el = this.ui.dropdownDiv;
        el.addClass("binf-disabled");
        command.execute(status, executeOptions)
            .done(_.bind(function (resp) {
              el.removeClass("binf-disabled");
              el.closest('.tab-links').find('.tab-links-bar ul li.binf-active a').focus();
            }, this))
            .fail(function (error) {
              el.removeClass("binf-disabled");
              if (error && error.cancelled) {
                el.find(".binf-btn.binf-dropdown-toggle").focus();
              }
            });
      }
    },
    _ensureLazyActionsRetrieved: function () {
      var deferred                = $.Deferred(),
          node                    = this.options.node,
          lazyActionsAreRetrieved = !!node.get('csuiLazyActionsRetrieved'),
          isNodeLocallyCreated    = !!node.isLocallyCreated,
          nonPromotedCommands     = node.nonPromotedActionCommands;
      if (!!node && !lazyActionsAreRetrieved && !isNodeLocallyCreated && nonPromotedCommands &&
          nonPromotedCommands.length) {
        this.$el.find('.binf-dropdown').addClass('binf-hidden');
        this.ui.loadingIconsDiv.removeClass('binf-hidden');
        node.setEnabledLazyActionCommands(true).done(_.bind(function () {
          setTimeout(_.bind(function () {
            this.ui.loadingIconsDiv.addClass('binf-hidden');
            this._updateMenuItems();
            deferred.resolve();
          }, this), 300);
        }, this)).fail(_.bind(function () {
          this.$el.find('.binf-dropdown').removeClass('binf-hidden');
          deferred.reject();
        }, this));
      } else {
        deferred.resolve();
      }
      return deferred.promise();
    }

  });

  return AddPropertiesDropdownMenuView;
});
