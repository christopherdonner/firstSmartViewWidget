/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/marionette', 'csui/utils/log', 'csui/utils/base', 'i18n',
  'csui/controls/toolbar/toolitem.model',
  'csui/controls/toolbar/toolitem.view',
  'csui/controls/toolbar/toolbar.view',
  'csui/models/nodes', 'csui/controls/toolbar/toolitems.filtered.model',
  'csui/controls/toolbar/toolbar.state.behavior',
  'csui/utils/commandhelper', 'csui/utils/commands',
  'hbs!csui/controls/tableactionbar/impl/tableactionbar',
  'hbs!csui/controls/tableactionbar/impl/lazy.loading.template',
  "csui/controls/tile/behaviors/perfect.scrolling.behavior",
  'css!csui/controls/tableactionbar/impl/tableactionbar'
], function (module, _, $, Backbone, Marionette, log, base, i18n,
    ToolItemModel, ToolItemView, ToolbarView, NodeCollection,
    FilteredToolItemsCollection, ToolbarStateBehavior, CommandHelper,
    commands, template, lazyLoadingTemplate, PerfectScrollingBehavior) {
  'use strict';

  var TableActionBarView = Marionette.CompositeView.extend({

    className: "csui-table-actionbar",

    template: template,

    childView: ToolItemView,

    childViewContainer: "ul",

    behaviors: {

      ToolbarState: {
        behaviorClass: ToolbarStateBehavior
      }

    },

    constructor: function TableActionBarView(options) {
      this.container = options.container;
      this.containerCollection = options.containerCollection;
      this.originatingView = options.originatingView;
      this.commandExecutionOptions = options.commandExecutionOptions;

      options.status || (options.status = {});
      var status = _.defaults(options.status, {
        nodes: new NodeCollection([options.model]),
        container: this.container,
        context: this.originatingView.context // todo get context from creating view
      });

      this.commands = options.commands || commands;
      options.collection = new FilteredToolItemsCollection(
          options.collection, {
            status: status,
            commands: this.commands,
            delayedActions: options.delayedActions,
            mask: options.toolItemsMask
          });

      Marionette.CompositeView.prototype.constructor.apply(this, arguments);
      if (this.model.nonPromotedActionCommands && this.model.nonPromotedActionCommands.length &&
          options.collection.length <= 1) {
        this.actionState.set('state', 'loading');
      }

      if (options.el) {
        $(options.el).addClass(_.result(this, "className"));
      }
    },

    isEmpty: function (options) {
      return this.collection.length <= 1;
    },

    onBeforeDestroy: function () {
      this.originatingView = null;
      this.collection.stopListening();
    },

    onBeforeRenderCollection: function () {
      this.destroyChildren();
      if (this.$childViewContainer) {
        this.$childViewContainer.empty();
      }
    },

    onRenderCollection: function () {
      this._adjusted = false;
      if (base.isVisibleInWindowViewport(this.$el)) {
        this._layoutButtons();
      }
    },

    onRender: function () {
      if (this.options.inlineBarStyle) {
        this.$el.addClass(this.options.inlineBarStyle);
      }
      if (this._isBlocked) {
        this.$el.addClass('binf-disabled');
      }
    },

    onShow: function () {
      this._layoutButtons();
    },

    _layoutButtons: function () {
      var delayedActions = this.options.delayedActions;
      if (delayedActions && (delayedActions.fetching ||
                             delayedActions.error)) {
        return;
      }

      if (this._adjusted) {
        return true;
      }

      this._adjusting = true;

      var node                 = this.model,
          lazyActionsRetrieved = !!node && !!node.get('csuiLazyActionsRetrieved'),
          isLocallyCreatedNode = !!node.isLocallyCreated,
          itemViews            = _.sortBy(this.children.toArray(), 'cid'); //IE11, returns wrong index and view in each loop
      itemViews = itemViews.filter(function (view) {
        return view instanceof ToolItemView;
      }); //filters toolItemViews
      this.actionbarOptions = {
        toolItemCounter: 0,
        cntItemsFit: 0,
        index: 0,
        dropDownMenuEl: undefined,
        separatorView: undefined,
      };
      this.enabledNonPomotedCommands = node.collection.enableNonPromotedCommands === false ?
                                       node.collection.enableNonPromotedCommands : true;

      if (itemViews.length > 1) {
        this.firstOffsetY = this.children.first().$el.offset().top;

        _.each(itemViews, _.bind(function (toolItemView, index) {
          this.actionbarOptions.index = index;
          this._wrapToolItemView(toolItemView);
        }, this));

        if (!!node && !lazyActionsRetrieved && node.nonPromotedActionCommands &&
            this.enabledNonPomotedCommands &&
            node.nonPromotedActionCommands.length && !isLocallyCreatedNode) { // append loading
          if (this.$childViewContainer.find('.binf-dropdown').length) {
            this.$childViewContainer.find('.binf-dropdown ul').append(lazyLoadingTemplate);
          } else {
            if (this.actionbarOptions.toolItemCounter === this.options.maxItemsShown) {
              if (this.$childViewContainer.find('li:last').length > 0) {
                this.$childViewContainer.find('li:last').addClass('csui-actionbar-hide-child');
              }
            }
            this.$childViewContainer.append(lazyLoadingTemplate);
            this._renderLazyActions().always(_.bind(function () {
              this._checkInlineActionBarShouldAlive();
            }, this));
          }
        } else {
          this._checkInlineActionBarShouldAlive();
        }

      } else {
        if (!!node && !lazyActionsRetrieved && node.nonPromotedActionCommands &&
            node.nonPromotedActionCommands.length && !isLocallyCreatedNode &&
            this.enabledNonPomotedCommands) {
          this._renderLazyActions().always(_.bind(function () {
            this._checkInlineActionBarShouldAlive();
          }, this));
        } else {
          this._checkInlineActionBarShouldAlive();

        }
      }

      this._adjusting = false;
      this._adjusted = true;
    },

    _checkInlineActionBarShouldAlive: function () {
      if (this.actionbarOptions.cntItemsFit < 2 && this.options.maxItemsShown !== 1) {
        this.destroy();
      }
    },

    _wrapToolItemView: function (toolItemView) {
      if (!(toolItemView instanceof ToolItemView)) {
        return;
      }
      var isSeparator = toolItemView.model.isSeparator();
      if (!isSeparator) {
        this.actionbarOptions.toolItemCounter++;
      }
      if (this.actionbarOptions.dropDownMenuEl) {
        if (!(isSeparator && this.actionbarOptions.index + 1 === this.children.length)) {
          toolItemView.renderTextOnly();
          toolItemView.$el.attr('role', 'menuitem');
          this.actionbarOptions.dropDownMenuEl.append(toolItemView.$el);
        }
      } else {
        if (isSeparator) {
          this.actionbarOptions.separatorView = toolItemView;
        } else {
          var currentOffsetY = toolItemView.$el.offset().top;
          if (currentOffsetY !== this.firstOffsetY ||
              (this.actionbarOptions.toolItemCounter > this.options.maxItemsShown)) {
            if (this.actionbarOptions.prevToolItemView) {
              this.actionbarOptions.prevToolItemView.$el.attr('role', 'menuitem');
              this.actionbarOptions.dropDownMenuEl = this._wrapWithDropDown(
                  this.actionbarOptions.prevToolItemView, toolItemView,
                  this.actionbarOptions.separatorView);
            } else {
              this.actionbarOptions.dropDownMenuEl = this._wrapWithDropDown(
                  toolItemView.$el, toolItemView);
            }
          }
          else {
            this.actionbarOptions.cntItemsFit++;
          }
          this.actionbarOptions.prevToolItemView = toolItemView;
        }
      }
    },

    _renderLazyActions: function () {
      var self      = this,
          node      = this.model,
          derferred = $.Deferred();
      !!node && node.setEnabledLazyActionCommands(true).done(_.bind(function () {

        var newCollection = new FilteredToolItemsCollection(
            self.options.collection.unfilteredModels, {
              status: self.options.status,
              commands: self.commands,
              delayedActions: self.model.delayedActions,
              mask: self.options.toolItemsMask
            });
        var blockingEle = self.$childViewContainer.find('.csui-loading-parent-wrapper');
        if (blockingEle.length) {
          blockingEle.animate("width: 0", 300, function () {
            self.$childViewContainer.find('.csui-actionbar-hide-child').removeClass(
                'csui-actionbar-hide-child');
            blockingEle.addClass('binf-hidden');
            if (self.actionbarOptions.toolItemCounter < self.options.maxItemsShown) {
              blockingEle.addClass('binf-maxtoolitems-not-reached');
            }
            if (self.collection.models.length !== newCollection.models.length) {
              _.filter(newCollection.models, function (model) {
                if (self.isDestroyed === true || self._isDestroyed) {
                  self.children = undefined;
                } else {
                  var signature = model.get("signature");
                  if (!self.collection.find({signature: signature})) {
                    self.actionbarOptions.index++;
                    var lazyToolItemView = self.addChild(model, ToolItemView,
                        self.actionbarOptions.index);
                    self._wrapToolItemView(lazyToolItemView);
                  }
                }
              });
            }
            derferred.resolve();
          });
        } else {
          if (self.isDestroyed === true || self._isDestroyed) {
            self.children = undefined;
          } else {
            self.collection.refilter();
          }
          derferred.resolve();
        }

      }), self).fail(function () {
        self.$childViewContainer.find('.csui-loading-parent-wrapper').remove();
        self.$childViewContainer.find('.csui-actionbar-hide-child').removeClass(
            'csui-actionbar-hide-child');
        derferred.reject();
      });
      return derferred.promise();
    },

    _wrapWithDropDown: function (prevToolItemView, toolItemView, separatorView) {
      prevToolItemView.renderTextOnly();
      prevToolItemView.$el.wrap('<li class="binf-dropdown"><ul class="binf-dropdown-menu"' +
                                ' role="menu"></ul></li>');
      var e = this._makeDropDown();
      this.$el.find('li.binf-dropdown').prepend(e);
      var dropdownToggler = this.$el.find('li.binf-dropdown > a.binf-dropdown-toggle');

      dropdownToggler.bind('binf.dropdown.before.show', _.bind(function () {
        $(this.nextElementSibling).addClass('binf-invisible');
        var node                 = this.model,
            lazyActionsRetrieved = !!node.get('csuiLazyActionsRetrieved'),
            isLocallyCreatedNode = !!node.isLocallyCreated;

        if (!!node && !lazyActionsRetrieved && node.nonPromotedActionCommands &&
            node.nonPromotedActionCommands.length && !isLocallyCreatedNode &&
            this.enabledNonPomotedCommands) {
          this._renderLazyActions();
        }
      }, this));

      var $inlineActionBarView = toolItemView._parent;

      $inlineActionBarView.listenTo($inlineActionBarView, 'destroy', function () {
        $(".csui-zero-zindex").removeClass("csui-zero-zindex");
      });

      var that = this;

      dropdownToggler.bind('binf.dropdown.after.show', function () {
        var scrollSelector = $(this).closest('.csui-perfect-scrolling').length > 0 ?
                             '.csui-perfect-scrolling' : '.csui-normal-scrolling'; //.csui-normal-scrolling for touch devices (MS Surface)
        var el = $(this).closest(scrollSelector);
        var $dropdown = $(this).nextAll('.binf-dropdown-menu');
        base.autoAlignDropDowns($(this), $dropdown, true, $dropdown, base.isIE11());
        var css = {};
        if (el.width() < $dropdown.offset().left + $dropdown.width()) {
          css.left = ($dropdown[0].offsetLeft + $(this).outerWidth()) - $dropdown.width();
        }
        if (i18n.settings.rtl &&
            ($dropdown.siblings(".binf-dropdown-toggle").offset().left - el.offset().left) <
            $dropdown.width()) {
          css.right = 'auto';
          if (base.isIE11()) {
            css.left = ($dropdown.siblings(".binf-dropdown-toggle").offset().left);
          } else {
            css.left = ($dropdown.siblings(".binf-dropdown-toggle").offset().left - el.offset().left);
          }
        }
        if ($dropdown.prop('style').top === 'auto') { //dropup, added by base.autoAlignDropDowns
          css.maxHeight = Math.floor(window.innerHeight -
                          (window.innerHeight - $dropdown.closest('.binf-dropdown').offset().top)) -
                          5;
          if (!!that.model.get('csuiDelayedActionsRetrieved') &&
              !that.model.get('csuiLazyActionsRetrieved') && that.model.nonPromotedActionCommands &&
              that.model.nonPromotedActionCommands.length && that.enabledNonPomotedCommands) {
            var dropdownEle = $dropdown.closest('.binf-dropdown'),
                blockingEle = $(dropdownEle).find('.csui-loading-parent-wrapper');
            blockingEle.length && blockingEle.remove(); //Remove existing loading icons from
            dropdownEle.addClass('csui-actionbar-hide-child');
            $dropdown.closest('.csui-table-actionbar .binf-nav').append(lazyLoadingTemplate);
          }
          if ($("#breadcrumb-wrap").length > 0) {
            $("#breadcrumb-wrap").addClass("csui-zero-zindex");
            $(".csui-navbar.binf-navbar.binf-navbar-default").addClass("csui-zero-zindex");
            if ($('.csui-search-tool-container').length > 0) {
              $('.csui-search-tool-container').addClass('csui-zero-zindex');
            }
          }
        } else {
          css.maxHeight = Math.floor(
                          window.innerHeight - $dropdown.closest('.binf-dropdown').offset().top) -
                          $dropdown.closest('.binf-dropdown').height() - 5;
          if ($("#breadcrumb-wrap").length > 0) {
            $("#breadcrumb-wrap").removeClass("csui-zero-zindex");
            $(".csui-navbar.binf-navbar.binf-navbar-default").removeClass("csui-zero-zindex");
            if ($('.csui-search-tool-container').length > 0) {
              $('.csui-search-tool-container').removeClass('csui-zero-zindex');
            }
          }
        }

        $dropdown.css(css);

        var $scrollParent;
        if (that.usePerfectScrollbar()) {
          $dropdown.addClass('csui-perfect-scrolling');
          $dropdown.perfectScrollbar({
            suppressScrollX: true,
            includePadding: true
          });
          $scrollParent = $dropdown.closest('.binf-dropdown').closest(
              '.csui-perfect-scrolling.ps-container');
        } else {
          $scrollParent = $dropdown.closest('.binf-dropdown').scrollParent();
        }
        $scrollParent.bind('scroll.csui.inline.actions', function (event) {
          !$dropdown.is(':hidden') && $dropdown.binf_dropdown('toggle');
          $(event.target).unbind('scroll.csui.inline.actions');
        });
      });

      var dropDownMenuEl = this.$el.find('li.binf-dropdown>ul.binf-dropdown-menu');

      if (separatorView) {
        separatorView.renderTextOnly();
        dropDownMenuEl.append(separatorView.$el);
      }

      toolItemView.renderTextOnly();
      toolItemView.$el.attr('role', 'menuitem');
      dropDownMenuEl.append(toolItemView.$el);  // move current toolitem into dropdown
      return dropDownMenuEl;
    },

    _makeDropDown: function () {
      var e = '<a role="button" href="#" tabindex="-1" class="binf-dropdown-toggle" data-binf-toggle="dropdown"' +
              ' aria-expanded="false"';
      if (this.options.dropDownText) {
        e += ' title="' + this.options.dropDownText + '" aria-label="' + this.options.dropDownText +
             '">';
      } else {
        e += '>';
      }
      if (this.options.dropDownIcon) {
        e += '<span class="' + this.options.dropDownIcon + '"></span>';
      } else {
        if (this.options.dropDownText) {
          e += this.options.dropDownText;
        }
      }
      e += "</a>";
      return e;
    },

    _setBlocked: function () {
      var self = this;
      this._blockedTimer = setTimeout(function () {
        if (self._isBlocked === false) {
          self.$el.removeClass('binf-disabled');
        }
        self._blockedTimer = undefined;
      }, 500);
      this._isBlocked = true;
      this.$el.addClass('binf-disabled');
    },

    _setUnblocked: function () {
      this._isBlocked = false;
      if (!this._blockedTimer) {
        this.$el.removeClass('binf-disabled');
      }
    },
    onChildviewToolitemAction: function (toolItemView, args) {
      var self = this;
      var signature = args.toolItem.get("signature");
      var command = this.commands.findWhere({signature: signature});
      var status = _.defaults(this.options.status, {
        nodes: new NodeCollection([this.model]),
        container: this.container,
        originatingView: this.originatingView,
        context: this.originatingView.context // todo get context from creating view
      });
      status.collection = this.containerCollection;
      status.data = args.toolItem.get('commandData') || {};

      var eventArgs = {
        status: status,
        commandSignature: signature
      };
      this.trigger('before:execute:command', eventArgs);
      this._setBlocked();
      Backbone.trigger('closeToggleAction');
      var promisesFromCommands = command.execute(status, this.commandExecutionOptions);
      CommandHelper.handleExecutionResults(promisesFromCommands,
          {
            command: command,
            suppressSuccessMessage: status.suppressSuccessMessage,
            suppressFailMessage: status.suppressFailMessage,
            customError: this.options.customError
          }).done(function (nodes) {
        if (!!command.allowCollectionRefetch &&
            self.options.originatingView.collection.totalCount >
            self.options.originatingView.collection.topCount) {
          self.options.originatingView.collection.fetch();
        }
      })
          .always(function () {
            self._setUnblocked();
            self.trigger('after:execute:command', eventArgs);
          });
    },

    usePerfectScrollbar: function () {
      return PerfectScrollingBehavior.usePerfectScrollbar();
    }

  });

  TableActionBarView.version = '1.0';

  return TableActionBarView;

});
