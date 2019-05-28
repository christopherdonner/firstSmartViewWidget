/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/models/favorite.model', 'csui/dialogs/modal.alert/modal.alert', 'csui/utils/base', 'i18n',
  'csui/controls/progressblocker/blocker',
  'csui/utils/contexts/factories/favorite2groups',
  'csui/widgets/favorites/impl/favorite.star/favorite.add.form.view',
  'csui/controls/mixins/keyboard.navigation/modal.keyboard.navigation.mixin',
  'hbs!csui/widgets/favorites/impl/favorite.star/favorite.star.view',
  'i18n!csui/widgets/favorites/impl/nls/lang',
  'css!csui/widgets/favorites/impl/favorite.star/favorite.star.view'
], function (_, $, Backbone, Marionette, FavoriteModel, ModalAlert, base, i18n,
    BlockingView, Favorite2GroupsCollectionFactory, FavoriteAddFormView,
    ModalKeyboardNavigationMixin, template, lang) {
  var FavoriteStarView = Marionette.ItemView.extend({

    template: template,

    templateHelpers: function () {
      return {
        enabled: this.enabled(),
        showInFavoritesTable: this.favTableOptions.isFavoritesTable,
        focusable: this.options.focusable,
        addFav: lang.addFav,
        removeFav: lang.removeFav,
        selected: this.favModel.get('selected')
      };
    },

    events: {
      'keydown': 'onKeyInView',
      'click': '_onClickView',
      'click button.csui-favorite-star': '_onClickStarButton',
      'click button > span.icon-socialFav': '_clickRemoveFavoriteStar',
      'click button > span.icon-socialFavOpen': '_clickAddFavoriteStar'
    },

    constructor: function FavoriteStarView(options) {
      options || (options = {});
      _.defaults(options, {
        formPopoverPlacement: 'left',
        popoverAtBodyElement: false,
        focusable: true
      });

      this.favTableOptions = options.favoritesTableOptions || {};

      Marionette.ItemView.call(this, options);

      if (options && options.blockingParentView) {
        BlockingView.delegate(this, options.blockingParentView);
      }

      this.favGroupsCollection = options.context && options.context.getCollection(
              Favorite2GroupsCollectionFactory,
              {detached: true, permanent: true}
          );
      var connector = this.model && this.model.connector;
      var favModelOptions = {};
      if (this.model) {
        favModelOptions = _.extend(
            this._getModelDataForFavoriteModel(),
            {selected: this.model.get('favorite')});
      }
      this.favModel = new FavoriteModel(favModelOptions, {connector: connector});
      this.listenTo(this.favModel, 'change:selected', this.render);

      this.uniqueViewId = 'view' + _.uniqueId();

      this.popoverContainerClassname = 'csui-favorite-popover-container ' + this.uniqueViewId;
      this.popoverContainerSelector = '.csui-favorite-popover-container.' + this.uniqueViewId;

      $(window).bind('resize.' + this.uniqueViewId, {view: this}, this._onWindowResize);
    },

    onBeforeDestroy: function () {
      this.triggerMethod('close:add:favorite:form');
      this.closePopover();
      $(window).unbind('resize.' + this.uniqueViewId, this._onWindowResize);
    },

    enabled: function () {
      return this.model && this.options.context ? true : false;
    },

    onRender: function () {
      if (this._previousFocusElm) {
        if ($(this._previousFocusElm).hasClass('csui-favorite-star')) {
          this.$el.find('button.csui-favorite-star').focus();
          this._previousFocusElm = undefined;
        }
      }
      this._previousTitle = undefined;
      this.favGroupsCollection.ensureFetched();

      this.delegateEvents();
    },

    _onWindowResize: function (event) {
      if (base.isTouchBrowser() || base.isAppleMobile) {
        return;
      }
      if (event && event.data && event.data.view) {
        var self = event.data.view;
        self.showingForm && self.closePopover();
      }
    },

    _getPopoverParent: function () {
      return this.options.popoverAtBodyElement ? $(this.popoverContainerSelector) : this.$el;
    },

    _handleClickEvent: function (event) {
      if (!$(event.target).closest('.binf-popover').length) {
        var self;
        if (event && event.data && event.data.view) {
          self = event.data.view;
          if (self.commandBlocked) {
            return;
          }
          $(document).off('click', self._handleClickEvent);
        }
        self && self.closePopover();
        self && self._setBlocked();
      }
    },

    _handleScrollEvent: function (event) {
      if (base.isTouchBrowser() || base.isAppleMobile) {
        return;
      }
      if (!$(event.target).closest('.binf-popover').length) {
        var self;
        if (event && event.data && event.data.view) {
          self = event.data.view;
          $(document).off('scroll', self._handleScrollEvent);
        }
        self && self.closePopover();
      }
    },

    _getModelDataForFavoriteModel: function () {
      var tabId;
      if (this.favTableOptions.isFavoritesTable && this.favTableOptions.selectedGroup) {
        tabId = this.favTableOptions.selectedGroup.get('tab_id');
      } else {
        tabId = this.model.get('favorite_tab_id') || -1;  // default to the unsorted group
      }
      return {
        id: this.model.get('id'),
        name: this.model.get('favorite_name') || this.model.get('name'),
        tab_id: tabId
      };
    },

    _onClickView: function (event) {
      if (!this.enabled() || this.$el.find(event.target).length > 0) {
        return;
      }
      this._onClickStarButton(event);
    },

    _onClickStarButton: function (event) {
      if (this.$el.find('span.icon-socialFav').length > 0) {
        this._clickRemoveFavoriteStar(event);
      } else {
        this._clickAddFavoriteStar(event);
      }
    },

    _setBlocked: function () {
      this.commandBlocked = true;
      setTimeout(_.bind(function () {
        this.commandBlocked = false;
      }, this), 500);
    },

    _clickAddFavoriteStar: function (event) {
      event && event.preventDefault();
      if (this.commandBlocked) {
        return;
      }
      if (this._getPopoverParent().find('.binf-popover').length === 0) {
        this._setBlocked();
      }
      this._capturePreviousFocusElement();
      this.favModel.set(this._getModelDataForFavoriteModel());
      if (this.favTableOptions.isFavoritesTable) {
        this._addFavoriteToClientSideCollection(true);
        this.favGroupsCollection.trigger('bulk:update');
      } else {
        this._addFavoriteWithForm();
      }
    },

    _clickRemoveFavoriteStar: function (event) {
      event && event.preventDefault();
      event && event.stopPropagation();
      if (this.commandBlocked) {
        return;
      }
      this._setBlocked();
      this._capturePreviousFocusElement();
      if (this.favTableOptions.isFavoritesTable) {
        this._removeFavoriteFromClientSideCollection(true);
        this.favGroupsCollection.trigger('bulk:update');
      } else {
        this._removeFavoriteFromServer();
      }
    },

    _clickAddButton: function () {
      if (this.commandBlocked) {
        return;
      }
      this._addFavoriteToServer()
          .done(_.bind(function () {
            this._previousTitle = undefined;
            this.disengageModalKeyboardFocusOnClose();
            this.closePopover();
            this._restorePreviousFocusAfterClosingPopover();
          }, this));
    },

    _clickCancelButton: function () {
      this.closePopover();
    },

    scrollCheckToClosePopover: function () {
      if (this._elTop) {
        var tolerance = 15;
        var top = this.$el.offset().top;
        if (this._elTop && this._elTop < top - tolerance || this._elTop > top + tolerance) {
          this.closePopover();
        }
      }
    },

    _capturePreviousFocusElement: function () {
      this._previousFocusElm = document.activeElement;
    },

    _restorePreviousFocusAfterClosingPopover: function () {
      if (this._previousFocusElm) {
        var $previousElm = $(this._previousFocusElm);
        if ($previousElm.hasClass('csui-favorite-star')) {
          this.$el.find('button.csui-favorite-star').focus();
        } else {
          $previousElm.focus();
        }
        this._previousFocusElm = undefined;
      }
    },

    closePopover: function () {
      if (this._getPopoverParent().find('.binf-popover').length > 0) {
        $(document).off('click', this._handleClickEvent);
        $(document).off('scroll', this._handleScrollEvent);
        this.disengageModalKeyboardFocusOnClose();
        this.triggerMethod('close:add:favorite:form');
        this.showingForm = false;
        this.commandBlocked = false;
        this._elTop = undefined;
        var $popoverEl = $(this.$el.find('.csui-favorite-star')[0]);
        $popoverEl.binf_popover('destroy');
        if (this._previousTitle) {
          $popoverEl.attr('title', this._previousTitle);
          this._previousTitle = undefined;
        }
        setTimeout(_.bind(function () {
          this.addForm && this.addForm.destroy();
          this.addForm = undefined;
          this.options.popoverAtBodyElement && $(this.popoverContainerSelector).remove();
          this._restorePreviousFocusAfterClosingPopover();
        }, this), 500);
      }
    },

    _removeFavoriteFromClientSideCollection: function (listenToEvent) {
      var self = this;
      this.model.set('favorite', false, {silent: true});
      this.$el.trigger('favorite:change');
      if (listenToEvent === true) {
        this.listenToOnce(this.favGroupsCollection, 'bulk:update:succeed', function () {
          self.stopListening(self.favGroupsCollection, 'bulk:update:fail');
          self.favModel.set('selected', false);
        });
        this.listenToOnce(this.favGroupsCollection, 'bulk:update:fail', function () {
          self.stopListening(self.favGroupsCollection, 'bulk:update:succeed');
          this.model.set('favorite', true, {silent: true});
        });
      }
      this.favGroupsCollection.each(function (group) {
        group.favorites && group.favorites.remove({id: self.favModel.get('id')});
      });
    },

    _removeFavoriteFromServer: function () {
      var self = this;
      this.blockActions();
      this.favModel.removeFromFavorites()
          .always(function (data) {
            self.unblockActions();
          })
          .done(function (resp) {
            self._removeFavoriteFromClientSideCollection();
          })
          .fail(function (err) {
            self._showErrorMessage(self.favModel, err);
          });
    },

    _addFavoriteWithForm: function () {
      if (this._getPopoverParent().find('.binf-popover').length > 0) {
        return;
      }
      this.favGroupsCollection.ensureFetched()
          .always(_.bind(function () {
            this._showAddFavoriteForm();
          }, this));
    },

    _showAddFavoriteForm: function () {
      this.favModel.set(this._getModelDataForFavoriteModel());
      this.addForm && this.addForm.destroy();
      this.addForm = new FavoriteAddFormView({
        context: this.options.context,
        model: this.model,
        favModel: this.favModel,
        collection: this.favGroupsCollection
      });
      this.addForm.render();
      this.listenTo(this.addForm, 'click:add:button', this._clickAddButton);
      this.listenTo(this.addForm, 'click:cancel:button', this._clickCancelButton);

      var placement = this.options.formPopoverPlacement;
      if (i18n && i18n.settings.rtl) {
        if (placement === 'left') {
          placement = 'right';
        } else {
          placement = 'left';
        }
      }

      var popoverOptions = {
        html: true,
        content: this.addForm.el,
        trigger: 'manual',
        placement: placement
      };

      if (this.options.popoverAtBodyElement) {
        var $parent = $('body');
        var modal = this.$el.closest('.binf-modal-body');
        (modal && modal.length > 0) && ($parent = $(modal[0]));
        $parent.append('<div class="binf-widgets ' + this.popoverContainerClassname + '"></div>');
        popoverOptions = _.extend(popoverOptions, {container: this.popoverContainerSelector});
      }
      var $popoverEl = $(this.$el.find('.csui-favorite-star')[0]);
      this._previousTitle = $popoverEl.attr('title');

      var rightPercent = (($popoverEl.offset().left + $popoverEl.outerWidth()) /
                          $(window).width()) * 100;
      if ($(window).devicePixelRatio === 2) {
        if ((rightPercent < 29 && !i18n.settings.rtl) || (rightPercent > 70 && i18n.settings.rtl)) {
          placement = (placement === 'left') ? 'right' : 'left';
          popoverOptions.placement = placement;
        }
      } else {
        if ($(window).width() < 1280) {
          if ((rightPercent < 44 && !i18n.settings.rtl) ||
              (rightPercent > 58 && i18n.settings.rtl)) {
            placement = (placement === 'left') ? 'right' : 'left';
            popoverOptions.placement = placement;
          }
        } else {
          if ((rightPercent < 25 && !i18n.settings.rtl) ||
              (rightPercent > 80 && i18n.settings.rtl)) {
            placement = (placement === 'left') ? 'right' : 'left';
            popoverOptions.placement = placement;
          }
        }
      }
      $popoverEl.binf_popover(popoverOptions).binf_popover('show');
      var $popoverDiv = this._getPopoverParent().find('.binf-popover');

      if (this.favGroupsCollection.length > 1) {
        $popoverDiv.addClass('show-groups');
      }
      var adjustedTop = parseInt($popoverDiv.css('top'), 10) + 52;
      $popoverDiv.css('top', adjustedTop);
      var $popoverArrow = $popoverDiv.find('.binf-arrow');
      $popoverArrow.css('top', 20);
      if (this.options.popoverAtBodyElement === true) {  // popover is appended to body element
        if (base.isVisibleInWindowViewportVertically($popoverDiv) !== true) {
          adjustedTop = parseInt($popoverDiv.css('top'), 10) - $popoverDiv.height() + 45;
          $popoverDiv.css('top', adjustedTop);
          $popoverArrow.css('top', $popoverDiv.height() - 20);
        }
      } else {  // popover is created at target element
        if (this.options.checkVisible) {
          var $parentDiv = $popoverDiv.closest('.csui-perfect-scrolling');
          $parentDiv.length === 0 && ($parentDiv = $popoverDiv.closest('.csui-normal-scrolling'));
          if (base.isElementVisibleInParent($popoverDiv, $parentDiv, 90, 90) !== true) {
            adjustedTop = parseInt($popoverDiv.css('top'), 10) - $popoverDiv.height() + 45;
            $popoverDiv.css('top', adjustedTop);
            $(this.$el.find('.binf-arrow')[0]).css('top', $popoverDiv.height() - 23);
          }
        }
      }
      var $starEl = $(this.$el.find('.csui-favorite-star > .icon')[0]);
      var starMiddle = $starEl.offset().top + ($starEl.height() / 2);
      var arrowMiddle = $popoverArrow.offset().top + 11; // arrowHeight = 22px
      var topOffset = starMiddle - arrowMiddle;
      $popoverDiv.offset({top: $popoverDiv.offset().top + topOffset});
      this.engageModalKeyboardFocusOnOpen(this.addForm.el);
      var popoverLabelElemId = _.uniqueId('popoverLabelId');
      $popoverDiv.find('>.binf-popover-title').attr('id', popoverLabelElemId);
      $popoverDiv.attr('role', 'dialog');
      $popoverDiv.attr('aria-labelledby', popoverLabelElemId);
      $popoverEl.on('shown.binf.popover', _.bind(function (event) {
        this._elTop = this.$el.offset().top;
        this.addForm && this.addForm.currentlyFocusedElement().focus();
        $(document).on('click', {view: this}, this._handleClickEvent);
        if (this.options.popoverAtBodyElement) {
          $(document).on('scroll', {view: this}, this._handleScrollEvent);
        }
        this.triggerMethod('show:add:favorite:form');
      }, this));

      this.showingForm = true;
    },

    _addFavoriteToClientSideCollection: function (listenToEvent) {
      var self = this;
      this.model.set('favorite', true, {silent: true});
      this.$el.trigger('favorite:change', this.favModel);
      if (listenToEvent === true) {
        this.listenToOnce(this.favGroupsCollection, 'bulk:update:succeed', function () {
          self.stopListening(self.favGroupsCollection, 'bulk:update:fail');
          self.favModel.set('selected', true);
        });
        this.listenToOnce(this.favGroupsCollection, 'bulk:update:fail', function () {
          self.stopListening(self.favGroupsCollection, 'bulk:update:succeed');
          this.model.set('favorite', false, {silent: true});
        });
      }
      var group = this.favGroupsCollection.findWhere({tab_id: this.favModel.get('tab_id')});
      var model = this.model.clone();
      model.set('favorite', true);
      model.set('favorite_name', this.favModel.get('name'));
      model.set('favorite_tab_id', this.favModel.get('tab_id'));
      group.favorites.add(model);
    },

    _addFavoriteToServer: function () {
      var deferred = $.Deferred();
      var self = this;
      this.blockActions();
      this.favModel.addToFavorites()
          .always(function (data) {
            self.unblockActions();
          })
          .done(function (resp) {
            self.model.setExpand('properties', ['parent_id']);
            self.model.fetch().always(function(){
              deferred.resolve(resp);
              self._addFavoriteToClientSideCollection();
            });

          })
          .fail(function (err) {
            deferred.reject(err);
            self._showErrorMessage(self.favModel, err);
          });
      return deferred.promise();
    },

    _suspendPopoverBehaviors: function () {
      if (this._getPopoverParent().find('.binf-popover').length > 0) {
        this._focusElementBeforeErrorDialog = document.activeElement;
        $(document).off('click', this._handleClickEvent);
        this.disengageModalKeyboardFocusOnClose();
      }
    },

    _resumePopoverBehaviors: function () {
      if (this._getPopoverParent().find('.binf-popover').length > 0) {
        $(document).on('click', {view: this}, this._handleClickEvent);
        this.addForm && this.engageModalKeyboardFocusOnOpen(this.addForm.el);
        this._focusElementBeforeErrorDialog && $(this._focusElementBeforeErrorDialog).focus();
        this._focusElementBeforeErrorDialog = undefined;
      }
    },

    _showErrorMessage: function (model, iError) {
      var error = new base.Error(iError);
      var title = lang.updateFavoriteFailTitle;
      var message = _.str.sformat(lang.updateFavoriteFailMessage, model.get("id"), error.message);
      this._suspendPopoverBehaviors();
      ModalAlert.showError(message, title)
          .always(_.bind(function () {
            this._resumePopoverBehaviors();
          }, this));
    },

    toggleFavorite: function () {
      if (this.model.get('favorite')) {
        this._clickRemoveFavoriteStar();
      } else {
        this._clickAddFavoriteStar();
      }
    },

    onKeyInView: function (event) {
      if (event.keyCode === 32 || event.keyCode === 13) {  // space or enter key
        if (this._getPopoverParent().find('.binf-popover').length > 0) {
          event.stopPropagation();
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        this.enabled() && this.toggleFavorite();
      }
    },
    blockActions: function () {},
    unblockActions: function () {}

  });

  ModalKeyboardNavigationMixin.mixin(FavoriteStarView.prototype);

  return FavoriteStarView;

});
