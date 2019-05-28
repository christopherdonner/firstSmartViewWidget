/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["module", "csui/lib/jquery", "csui/lib/underscore",
  "csui/lib/backbone", "csui/lib/marionette", 'csui/utils/log',
  'csui/controls/toolbar/toolitem.model', 'csui/controls/toolbar/toolitem.view',
  'csui/models/nodes', 'csui/controls/toolbar/toolitems.filtered.model',
  'csui/controls/toolbar/toolbar.view',
  'csui/utils/commands', 'csui/utils/commandhelper',
  'hbs!csui/widgets/metadata/impl/header/dropdown.menu/dropdown.menu',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/behaviors/dropdown.menu/dropdown.menu.behavior',
  'csui/utils/contexts/factories/browsing.states',
  'i18n!csui/widgets/metadata/impl/nls/lang',
  'hbs!csui/widgets/metadata/impl/header/dropdown.menu/lazy.loading.template',
  'css!csui/widgets/metadata/impl/header/dropdown.menu/dropdown.menu',
  'csui/lib/binf/js/binf'
], function (module, $, _, Backbone, Marionette, log, ToolItemModel, ToolItemView,
    NodeCollection, FilteredToolItemsCollection, ToolbarView, commands,
    CommandHelper, template, TabableRegionBehavior, DropdownMenuBehavior,
    BrowsingStateCollectionFactory, lang, lazyloadingTemplate) {
  'use strict';

  var DropdownMenuView = Marionette.CompositeView.extend({

    className: "cs-dropdown-menu",
    template: template,

    childView: ToolItemView,
    childViewContainer: "ul.binf-dropdown-menu",
    childViewOptions: function (model) {
      return {
        role: 'menuitem'
      };
    },

    templateHelpers: function () {
      return {
        hasCommands: !!this.collection.length,
        btnId: _.uniqueId('dropdownMenuButton'),
        showMoreTooltip: lang.showMore,
        showMoreAria: lang.showMoreAria
      };
    },

    ui: {
      dropdownToggle: '.binf-dropdown-toggle',
      dropdownMenu: '.binf-dropdown-menu',
      loadingIconsDiv: '.csui-loading-parent-wrapper'
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

      var status = {
        nodes: new NodeCollection([options.model]),
        container: options.container,
        containerCollection: options.containerCollection,
        context: options.context
      };
      options.status = status;
      options.collection = new FilteredToolItemsCollection(
          options.toolItems, {
            status: status,
            commands: this.commands,
            delayedActions: options.containerCollection &&
                            options.containerCollection.delayedActions,
            mask: options.toolItemMask
          });

      options.reorderOnSort = true;
      Marionette.CompositeView.prototype.constructor.apply(this, arguments);
      _.defaults(this.options, options.toolItems.options);  // set options from ToolItemFactory

      this.originatingView = options.originatingView;

      this.commands = options.commands || commands;
      if (options.el) {
        $(options.el).addClass(_.result(this, "className"));
      }

      this.listenTo(this, "childview:toolitem:action", this._triggerMenuItemAction)
          .listenTo(this.model, "sync", this.render)
          .listenTo(Backbone, 'closeToggleAction', this._closeToggle)
          .listenTo(this.model, "change", this.render);
    },

    _updateMenuItems: function () {
      this.collection.refilter();
      this.render();
    },

    onRender: function () {
      if (!this.collection.length) {
        var node                 = this.options.model ? this.options.model : this.model,
            lazyActionsRetrieved = !!node && !!node.get('csuiLazyActionsRetrieved'),
            isLocallyCreatedNode = !!node && !!node.isLocallyCreated;
        if (!!node && !lazyActionsRetrieved && node.nonPromotedActionCommands.length &&
            !isLocallyCreatedNode) {
          this.$el.find('.binf-dropdown').addClass('binf-hidden');
          this.ui.loadingIconsDiv.removeClass('binf-hidden');
          this.fetchingNonPromotedActions = true;
          node.setEnabledLazyActionCommands(
              true).done(_.bind(function () {
            this.fetchingNonPromotedActions = false;
            var blockingElement = this.$el.find('.csui-loading-parent-wrapper');
            blockingElement.animate("width: 0", 300, _.bind(function () {
              blockingElement.addClass('binf-hidden');
              this.$el.find('.binf-dropdown').removeClass('binf-hidden');
              this.collection.silentFetch = true;
              this._updateMenuItems();
            }, this));
          }, this));
        }
      } else {
        this.fetchingNonPromotedActions = false;
        this.ui.dropdownToggle.binf_dropdown();
        this.ui.dropdownMenu.find("> li > a.binf-hidden").removeClass('binf-hidden');
        var adjustDropdown = _.bind(function () {
          this.ui.dropdownMenu.removeClass('adjust-dropdown-menu');
          var dropdownLeftOffset   = this.ui.dropdownMenu.offset().left,
              dropdownWidth        = this.ui.dropdownMenu.outerWidth(),
              originatingViewWidth = this.options.originatingView.$el.width(),
              margin               = (window.innerWidth - originatingViewWidth) / 2,
              rightOffset          = originatingViewWidth -
                                     (dropdownLeftOffset + dropdownWidth - margin);
          if (dropdownLeftOffset + dropdownWidth >
              originatingViewWidth ||
              (rightOffset + dropdownWidth > originatingViewWidth)) {
            this.ui.dropdownMenu.addClass('adjust-dropdown-menu');
          }
        }, this);
        var renderLazyActions = _.bind(function () {
          var self = this;
          var node                 = this.options.model ? this.options.model : this.model,
              lazyActionsRetrieved = !!node && !!node.get('csuiLazyActionsRetrieved'),
              isLocallyCreatedNode = !!node && !!node.isLocallyCreated;
          if (!!node && !lazyActionsRetrieved && node.nonPromotedActionCommands.length &&
              !isLocallyCreatedNode) {
            this.fetchingNonPromotedActions = true;
            this.ui.dropdownMenu.append(lazyloadingTemplate);
            node.setEnabledLazyActionCommands(
                true).done(function () {
              self.fetchingNonPromotedActions = false;
              var newCollection = new FilteredToolItemsCollection(
                  self.options.toolItems, {
                    status: self.options.status,
                    commands: self.commands,
                    delayedActions: self.options.containerCollection &&
                                    self.options.containerCollection.lazyActions,
                    lazyActions: self.options.containerCollection &&
                                 self.options.containerCollection.lazyActions,
                    mask: self.options.toolItemsMask
                  });

              var blockingEle = self.ui.dropdownMenu.find('.csui-loading-parent-wrapper');
              blockingEle.animate("width: 0", 300, function () {
                blockingEle.remove();
                if (self.collection.models.length !== newCollection.models.length) {
                  _.filter(newCollection.models, function (model) {
                    if (self.isDestroyed === true || self._isDestroyed) {
                      self.children = undefined;
                    } else {
                      var signature = model.get("signature");
                      if (!self.collection.find({signature: signature})) {
                        self.collection.models.push(model);
                        var lazyToolItemView = self.addChild(model, ToolItemView);
                        lazyToolItemView.renderTextOnly();
                      }
                    }
                  });
                }
              });

            });
          }
        }, this);
        this.ui.dropdownToggle.bind('binf.dropdown.after.show', adjustDropdown);
        this.ui.dropdownToggle.bind('binf.dropdown.before.show', renderLazyActions);
        $(window).bind('resize.metadata.header.dropdown.menu', _.debounce(adjustDropdown, 100));
        this.delegateEvents();
      }
    },

    onRenderCollection: function () {
      if (this.collection.length && this.fetchingNonPromotedActions) {
        var loadingIconsDiv = this.ui.dropdownMenu.find('.csui-loading-parent-wrapper');
        loadingIconsDiv.length && loadingIconsDiv.remove();
        this.ui.dropdownMenu.append(lazyloadingTemplate);
      }
    },

    onDestroy: function () {
      $(window).unbind("resize.metadata.header.dropdown.menu");
    },

    currentlyFocusedElement: function () {
      return $(this.ui.dropdownToggle);
    },

    _closeToggle: function () {
      var dropdownToggleEl = this.$el.find('.binf-dropdown-toggle');
      if (dropdownToggleEl.parent().hasClass('binf-open')) {
        dropdownToggleEl.binf_dropdown('toggle');
      }
    },

    _triggerMenuItemAction: function (toolItemView, args) {
      var dropdownToggleEl = this.$el.find('.binf-dropdown-toggle');
      dropdownToggleEl.binf_dropdown('toggle');  // close the dropdown menu before triggering the event

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
          container: this.options.container,
          collection: this.options.containerCollection,
          originatingView: this.originatingView
        };

        if (command && command.enabled(status)) {
          signature === 'Delete' && (this.trigger('metadata:item:before:delete', this));
          signature === 'Move' && (this.trigger('metadata:item:before:move', this));
          if (signature === 'CopyLink' && this.options.metadataScenario) {
            var browsingStates = this.options.context.getCollection(BrowsingStateCollectionFactory);
            if (browsingStates.length === 1) {
              browsingStates.models[0].attributes.path.node_id = status.nodes.models[0].get('id');
              browsingStates.models[0].attributes.path.node_name = status.nodes.models[0].get(
                  'name');
            }
            status.url = browsingStates.getUrlPathWithQuery();
          }

          command.execute(status)
              .done(_.bind(function (resp) {
                signature === 'Delete' && (this.trigger('metadata:item:deleted', this));
              }, this));
        }
      }
    }

  });

  return DropdownMenuView;
});
