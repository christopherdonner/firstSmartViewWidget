/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/controls/thumbnail/content/content.registry',
  'csui/controls/thumbnail/content/content.factory',
  'csui/controls/thumbnail/content/overview/properties.overview',
  'csui/controls/mixins/keyboard.navigation/modal.keyboard.navigation.mixin',
  'csui/utils/base',
  'i18n',
  'i18n!csui/controls/thumbnail/content/overview/impl/nls/localized.strings',
  'hbs!csui/controls/thumbnail/content/overview/impl/overview',
  'css!csui/controls/thumbnail/content/overview/impl/overview'
], function ($, _, Backbone, Marionette, ContentRegistry, ContentFactory, PropertiesOverview,
    ModalKeyboardNavigationMixin, base,
    i18n, lang, template) {
  'use strict';

  var OverviewView = Marionette.LayoutView.extend({
    className: 'csui-thumbnail-overview-container',
    template: template,

    constructor: function OverviewView(options) {
      options || (options = {});
      Marionette.LayoutView.prototype.constructor.call(this, options);
      _.defaults(options, {
        formPopoverPlacement: 'right'
      });
      this.options = options;
    },

    templateHelpers: function () {
      return {
        overViewTitle: lang.ColumnTitle,
        focusable: this.options.focusable || true
      };
    },

    events: {
      'keydown': 'onKeyInView',
      'click .csui-thumbnail-overview-icon': '_showPopover'
    },

    onKeyInView: function (event) {
      if (event.keyCode === 32 || event.keyCode === 13) {  // space or
        if (this.$el.find('.binf-popover').length > 0) {
          event.stopPropagation();
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        this._showPopover();
      } else if (event.keyCode === 27) { //esc key
        if (this.$el.find('.binf-popover').length > 0) {
          event.preventDefault();
          event.stopPropagation();
          this._closePopover();
        }
      }
    },

    _capturePreviousFocusElement: function () {
      this._previousFocusElm = document.activeElement;
    },

    _restorePreviousFocusAfterClosingPopover: function () {
      if (this._previousFocusElm) {
        var $previousElm = $(this._previousFocusElm);
        if ($previousElm.hasClass('csui-thumbnail-overview-icon')) {
          this.$el.find('button.csui-thumbnail-overview-icon').focus();
        } else {
          $previousElm.focus();
        }
        this._previousFocusElm = undefined;
      }
    },

    _showPopover: function (event) {
      var self = this;
      if (this.$el.find('.binf-popover').length > 0) {
        return;
      }
      this._capturePreviousFocusElement();
      var placement = this.options.formPopoverPlacement;

      if (i18n && i18n.settings.rtl) {
        this.rtl = true;
      }

      this.propertiesOverview = new PropertiesOverview({
        model: this.model,
        context: this.options.context,
        ContentFactory: this.options.ContentFactory,
        originatingView: this.options.originatingView,
        selectedChildren: this.options.selectedChildren,
        collection: this.options.collection,
        columns: this.options.columns
      });
      this.propertiesOverview.render();

      this.$popoverEl = this.$el.find('.csui-thumbnail-overview-icon');
      this._previousTitle = this.$popoverEl.attr('title');
      this.$popoverEl.attr("title", "");
      var leftPercent = (this.$popoverEl.offset().left / $(window).width()) * 100;
      if (leftPercent > 80) {
        this.plcamentChanged = true;
        placement = (placement === 'right') ? 'left' : 'right';
      }

      this.$popoverEl.binf_popover({
        content: _.bind(function () {
          return this.propertiesOverview.el;
        }, this),
        html: true,
        placement: function (tip, element) {
          var self     = this,
              position = placement;
          return position;
        },
        trigger: 'manual'
      });

      this.$popoverEl.binf_popover('show');
      this.propertiesOverview.trigger('dom:refresh');
      this.engageModalKeyboardFocusOnOpen(this.propertiesOverview.el);
      this.$popoverEl.on('shown.binf.popover', _.bind(function (event) {
        $(document).on('click.popover', {view: this}, this._handleClickEvent);
        this.scrollEle = this.$el.closest('.csui-thumbnail-results');
        this.scrollEle.on('scroll.popover', {view: this}, this._handleScrollEvent);
        self.onShowOverviewFlyout(event);
        self.triggerMethod("shown:overview:flyout");
        this.propertiesOverview && this.propertiesOverview.currentlyFocusedElement().focus();
        }, this));
    },

    onShowOverviewFlyout: function (args) {
      var flyOutTarget        = this.$el,
          popoverContainer    = this.$el.parent().find(".binf-popover"),
          popoverArrowEl      = popoverContainer.find('.binf-arrow'),
          popoverArrowTop     = parseInt(popoverArrowEl.css('top')),
          popoverArrowHeight  = parseInt(popoverArrowEl.css('height')),
          arrowWidth          = popoverArrowEl.outerWidth() === 0 ? 28 :
                                popoverArrowEl.outerWidth(),
          scrollableParent    = this.$el.closest('.csui-thumbnail-results'),
          scrollableContainer = (scrollableParent.closest('.ps-container').length > 0 ?
                                 scrollableParent.closest('.ps-container') :
                                 scrollableParent.closest('.csui-normal-scrolling')),
          popoverMetadata     = popoverContainer.find(".csui-thumbnail-metadata-container"),
          popoverName         = popoverContainer.find(".csui-thumbnail-overview-name"),
          popoverActions      = popoverContainer.find(".csui-thumbnail-properties-actions"),
          flyOutTopPosition;
      var popoverMetadataHeight = (popoverMetadata.height() > window.innerHeight) ?
                                  window.innerHeight -
                                  (popoverName.height() + popoverActions.height() + 100) :
                                  (window.innerHeight <
                                   popoverMetadata.height() + popoverName.height() +
                                   popoverActions.height() + 100) ? popoverMetadata.height() - 100 :
                                  popoverMetadata.height();
      popoverMetadata.css({'height': popoverMetadataHeight});
      if (base.isIE11()) {
        flyOutTopPosition = flyOutTarget.offset().top - parseInt(popoverArrowEl.css('top')) + 12;
      } else {
        flyOutTopPosition = flyOutTarget.offset().top - ($('nav.csui-navbar').innerHeight() +
                                                         $('#breadcrumb-wrap').innerHeight() +
                                                         parseInt(popoverArrowEl.css('top'))) + 11;
      }
      var perspectivePanel          = $(".cs-perspective-panel"),
          perspectivePanelClientTop = perspectivePanel.length > 0 ?
                                      perspectivePanel[0].getBoundingClientRect().top : 0;
      if (base.isIE11() &&
          flyOutTopPosition < (perspectivePanelClientTop + $('#breadcrumb-wrap').innerHeight())) {
        flyOutTopPosition = flyOutTarget.offset().top - ($('nav.csui-navbar').innerHeight() +
                                                         $('#breadcrumb-wrap').innerHeight()) + 12;
        popoverArrowTop = (flyOutTarget.offset().top - flyOutTopPosition) + 12;
        popoverArrowEl.css('top', popoverArrowTop);
      }
      if (flyOutTopPosition < perspectivePanelClientTop && !base.isIE11()) {
        flyOutTopPosition = 0;
        popoverArrowTop = flyOutTarget.offset().top - ($('nav.csui-navbar').innerHeight() +
                                                       $('#breadcrumb-wrap').innerHeight()) + 11;
        popoverArrowEl.css('top', popoverArrowTop);
      }
      popoverContainer.css({
        'position': 'fixed',
        'top': flyOutTopPosition
      });
      if (base.isTouchBrowser()) {
        scrollableContainer.css({'-webkit-overflow-scrolling': 'auto'});
      }
      var flyOutLeft;
      if (this.plcamentChanged) {
        flyOutLeft = flyOutTarget.offset().left - popoverContainer.outerWidth();
      } else {
        flyOutLeft = flyOutTarget.offset().left + flyOutTarget.width();
      }

      popoverContainer.css({
        'right': 'auto',
        'left': flyOutLeft
      });

      this._adjustFlyOut();
      var documentHeight     = ($(window).height()),
          originalPopoverTop = popoverContainer.offset().top,
          flyOutHeight       = popoverContainer.innerHeight() - parseInt(popoverArrowEl.css('top')),
          flyOutTargetTop    = flyOutTarget.offset().top,
          adjustedPosition   = flyOutTargetTop + flyOutHeight + popoverArrowHeight - documentHeight;
      Marionette.triggerMethodOn(this, 'dom:refresh', this);
      flyOutTarget.focus();
    },

    _adjustFlyOut: function () {
      this.propertiesOverview.trigger('update:scrollbar');
      var scrollableParent = this.$el.closest('.csui-thumbnail-results'),
          documentHeight   = ($(window).height()),
          headerHeight     = $('nav.csui-navbar').innerHeight() / 2;
      this.currentNavbarIndex = $('nav.csui-navbar').css('z-index');
      this.currentBreadcrumbIndex = $('#breadcrumb-wrap').css('z-index');
      if (this.$el.height() > documentHeight) {
        this.$el.height(documentHeight - headerHeight);
      }

      $('body').addClass('csui-apply-zero-zindex');
      var scrollableContainer = (scrollableParent.closest('.ps-container').length > 0 ?
                                 scrollableParent.closest('.ps-container') :
                                 scrollableParent.closest('.csui-normal-scrolling'));

      $(scrollableContainer).on("scroll", function () {
        if ($(this).data('binf.popover')) {
          $(this).binf_popover('destroy');
          $('body').removeClass('csui-apply-zero-zindex');
        }
      });

      return false;
    },

    _closePopover: function () {
      this.disengageModalKeyboardFocusOnClose();
      this.$popoverEl.binf_popover('destroy');
      if (this._previousTitle) {
        this.$popoverEl.attr('title', this._previousTitle);
        this._previousTitle = undefined;
      }
      $(document).off('click.popover', this._handleClickEvent);
      this.scrollEle.off('scroll.popover', this._handleScrollEvent);
      $('body').removeClass('csui-apply-zero-zindex');
      this.triggerMethod("hide:overview:flyout");
      this._restorePreviousFocusAfterClosingPopover();
    },

    _handleClickEvent: function (event) {
      if (!$(event.target).closest('.binf-popover').length) {
        var view = event.data.view;
        $(document).off('click.popover', this._handleClickEvent);
        view._closePopover();
      }
    },

    _handleScrollEvent: function (event) {
      var self = event.data.view;
      if (!$(event.target).closest('.binf-popover').length) {
        self.scrollEle.off('scroll.popover', self._handleScrollEvent);
        self && self._closePopover();
      }
    }
  });
  ContentRegistry.registerByKey('overview', OverviewView);
  ModalKeyboardNavigationMixin.mixin(OverviewView.prototype);
  return OverviewView;
});
