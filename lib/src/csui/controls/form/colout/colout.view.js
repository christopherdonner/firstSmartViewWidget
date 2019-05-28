/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/marionette',
  'csui/utils/base',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/controls/form/colout/colout.form.view',
  'hbs!csui/controls/form/colout/colout.item', 'i18n'
], function ($, _, Marionette, base, PerfectScrollingBehavior,
    ColoutFormView, ColoutTemplate, i18n) {

  var ColoutLayoutView = Marionette.LayoutView.extend({
    className: "csui-colout-container",
    regions: {
      formRegion: ".csui-colout-formitems"
    },
    template: ColoutTemplate,

    behaviors: {
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        suppressScrollX: true,
        scrollYMarginOffset: 1
      }
    },

    constructor: function ColoutLayoutView(options) {
      options || (options = {});
      Marionette.LayoutView.prototype.constructor.call(this);
      this.options = options;

      var coloutTarget = this.options.get('targetEl');
      coloutTarget.one('shown.binf.popover', _.bind(this.onShowColoutPopoverForm, this));

      this.windowResizeHandler = _.bind(this._adjustColout, this);
      $(window).on('resize', this.windowResizeHandler);

      this.render();
    },

    onRender: function () {
      var fields = this.options.attributes.options.fields,
          coloutView;

      for (var key in fields) {
        if (fields[key].hasOwnProperty('prevData')) {
          delete fields[key].prevChildData;
        }
      }

      if (base.isTouchBrowser()) {
        var viewportHeight = $('.binf-tab-content').length > 0 ?
                             $('.binf-tab-content').innerHeight() :
                             $('.form-metadata').innerHeight();
        this.$el.css({'max-height': viewportHeight - 100});
      }

      coloutView = new ColoutFormView({
        context: this.options.get('context'),
        model: this.options,
        layoutMode: 'doubleCol',
        mode: 'read',
        orginatingView: this
      });

      this.formRegion.show(coloutView);
    },

    onRenderForm: function () {
      var coloutTarget = this.options.get('targetEl');

      coloutTarget.binf_popover({
        content: this.el,
        html: true,
        placement: function (tip, element) {
          var self     = this,
              position = (i18n && i18n.settings.rtl) ? 'left' : 'right';
          setTimeout(function () {
            self.$arrow.css('top', 50);
            self.$tip.css('top', -45);
          }, 0);
          return position;
        },
        trigger: 'manual',
        container: this.options.get('coloutContainer')
      });

      coloutTarget.binf_popover('show');
    },

    onShowColoutPopoverForm: function (args) {
      var coloutTarget          = this.options.get('targetEl'),
          popoverContainer      = this.$el.closest(".binf-popover"),
          popoverArrowEl        = popoverContainer.find('.binf-arrow'),
          popoverArrowTop       = parseInt(popoverArrowEl.css('top')),
          popoverArrowHeight    = parseInt(popoverArrowEl.css('height')),
          arrowWidth            = popoverArrowEl.outerWidth() === 0 ? 28 :
                                  popoverArrowEl.outerWidth(),
          scrollableParent      = this.$el.parents('.cs-form-set-container'),
          scrollableContainer   = (scrollableParent.closest('.ps-container').length > 0 ?
                                   scrollableParent.closest('.ps-container') :
                                   scrollableParent.closest('.csui-normal-scrolling')),
          modalDialogOffsetLeft = 0,
          ColOutTopPosition;
      if (coloutTarget.parents('.binf-modal-dialog').length === 1) {
        modalDialogOffsetLeft = coloutTarget.parents('.binf-modal-dialog').offset().left;
      }

      if (base.isIE11()) {
        ColOutTopPosition = coloutTarget.offset().top - 45;
      } else {
        ColOutTopPosition = coloutTarget.offset().top - ($('nav.csui-navbar').innerHeight() +
                                                         $('#breadcrumb-wrap').innerHeight() +
                                                         parseInt(popoverArrowEl.css('top'))) + 5;
      }
      var columns      = popoverContainer.find('.cs-form-doublecolumn'),
          columnsCount = columns.length;
      columns.parent('.cs-form').removeClass('cs-doublecolumn-form');
      for (var i = 0; i < columnsCount; i++) {
        if (!$(columns[i]).is(':empty')) {
          $(columns[i]).css('display', 'table-cell');
          popoverArrowEl.css('display', 'block');
          columns.closest('.cs-form').addClass('cs-doublecolumn-form');
        } else {
          $(columns[i]).css('display', 'none');
        }
      }

      popoverContainer.css({'position': 'fixed', 'top': ColOutTopPosition});
      if (base.isTouchBrowser()) {
        scrollableContainer.css({'-webkit-overflow-scrolling': 'auto'});
      }

      if (i18n && i18n.settings.rtl) {
        popoverContainer.css({
          'left': 'auto',
          'right': $(window).width() - (coloutTarget.offset().left - arrowWidth / 2) -
                   (modalDialogOffsetLeft)
        });
      } else {
        popoverContainer.css({
          'right': 'auto',
          'left': coloutTarget.offset().left + coloutTarget.width() - (modalDialogOffsetLeft)
        });
      }

      this._adjustColout();
      var documentHeight   = ($(window).height()),
          coloutHeight     = popoverContainer.innerHeight() - parseInt(popoverArrowEl.css('top')),
          coloutTargetTop  = coloutTarget.offset().top,
          adjustedPosition = coloutTargetTop + coloutHeight + popoverArrowHeight - documentHeight;
      if (documentHeight < coloutTargetTop + coloutHeight) {
        ColOutTopPosition = ColOutTopPosition - adjustedPosition;
        popoverArrowTop = popoverArrowTop + adjustedPosition;
        popoverContainer.css('top', ColOutTopPosition);
        popoverArrowEl.css('top', popoverArrowTop);
      }
      Marionette.triggerMethodOn(this, 'dom:refresh', this);
      coloutTarget.focus();
    },

    _adjustColout: function () {
      var scrollableParent          = this.$el.parents('.cs-form-set-container'),
          documentHeight            = ($(window).height()),
          headerHeight              = $('nav.csui-navbar').innerHeight() / 2,
          currentNavbarIndex        = $('nav.csui-navbar').css('z-index'),
          currentBreadcrumbbarIndex = $('#breadcrumb-wrap').css('z-index');
      if (this.$el.height() > documentHeight) {
        this.$el.height(documentHeight - headerHeight);
      }
      $('nav.csui-navbar, #breadcrumb-wrap').css({'z-index': 'auto'});
      var scrollableContainer = (scrollableParent.closest('.ps-container').length > 0 ?
                                 scrollableParent.closest('.ps-container') :
                                 scrollableParent.closest('.csui-normal-scrolling'));

      $(scrollableContainer).on("scroll", function () {
        $('.csui-colout-icon').each(function () {
          if ($(this).data('binf.popover')) {
            $(this).binf_popover('destroy');
            $('nav.csui-navbar').css({'z-index': currentNavbarIndex});
            $('#breadcrumb-wrap').css({'z-index': currentBreadcrumbbarIndex});
          }
        });
      });

      return false;
    },

    onDestroy: function () {
      if (!!this.windowResizeHandler) {
        $(window).off('resize', this.windowResizeHandler);
      }
    }

  });
  return ColoutLayoutView;
});