/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['module', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/behaviors/keyboard.navigation/tabables.behavior',
  'esoc/controls/dialog/dialog.view',
  'hbs!esoc/controls/dialog/impl/multiple.dialogs',
  'csui/utils/non-emptying.region/non-emptying.region',
  'csui/utils/log',
  'i18n',
  'csui/lib/binf/js/binf'
], function (module, _, $, Backbone, Marionette, LayoutViewEventsPropagationMixin,
    TabablesBehavior, UserDialogView, multipleDialogsTemplate,
    NonEmptyingRegion, log, i18n) {

  log = log(module.id);

  var MultipleDialogsView = Marionette.ItemView.extend({

    className: function () {
      var className = 'cs-dialog binf-modal binf-fade';
      if (this.options.className) {
        className += ' ' + _.result(this.options, 'className');
      }
      return className;
    },

    attributes: {
      'tabindex': '-1', // prevent focus to move outside dialog when tabbing through
      'aria-hidden': 'true'
    },

    template: multipleDialogsTemplate,

    behaviors: {
      TabablesBehavior: {
        behaviorClass: TabablesBehavior,
        recursiveNavigation: true,
        containTabFocus: true
      }
    },

    events: {
      'hide.binf.modal': 'onHiding',
      'hidden.binf.modal': 'onHidden',
      'click .cs-close': 'onClickClose',
      'shown.binf.modal': 'onShown',
      'keydown': 'onKeyInView', // using keydown for fields, so to prevent execution use same event.
      'setCurrentTabFocus': 'setCurrentTabFocus',
      'tabNextRegion': 'tabNextRegion',
      'click .tile-type-action-icon': 'onClickActionIcon'
    },

    constructor: function MultipleDialogsView() {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      this.listenToOnce(this, 'before:hide', TabablesBehavior.popTabableHandler);
    },

    onKeyInView: function (event) {
      if (event.keyCode === 27) {
        this.destroy(event);
      }
    },

    setCurrentTabFocus: function () {
      this.focusOnLastRegion = true;
      this.$el.focus();
    },

    tabNextRegion: function () {
      this.trigger('changed:focus');
    },

    onRender: function () {
      this.$el.addClass(MultipleDialogsView.prototype.className.call(this))
          .attr('tabindex', 0);
      this.appendData(this.options.views);
    },
    appendData: function (views) {

      var userDialogView = new UserDialogView({
        view: views[views.length - 1],
        largeSize: this.options.largeSize
      });
      userDialogView.render();
      var childData = userDialogView.$el.find('.binf-modal-dialog').detach();
      this.$el.find('.modal-dialogs-inner').append(childData);
    },

    onShow: function () {
      $(window).scrollTop(0);

      this.$el.binf_modal({
        backdrop: 'static',
        keyboard: false,
        paddingWhenOverflowing: false
      });
    },
     onShown : function () { 
      this.$el.find('.cs-close').focus();
     },

    kill: function () {
      MultipleDialogsView.__super__.destroy.apply(this, arguments);
      this._scrollToBegin();
      return true;
    },

    destroy: function (event) {
      var viewCount = this.options.views.length;
      if (this.$el.is(':visible') && !!viewCount) {
        if (viewCount === 1) {
          this.$el.binf_modal('hide');
        }
        else {
          var currentSlide;
          if ($(event.currentTarget).hasClass("cs-dialog")) {
            currentSlide = $(event.currentTarget).find('.slick-current .binf-modal-dialog');
          } else {
            currentSlide = $(event.currentTarget).closest('.binf-modal-dialog');
          }
          this.options.util.removeSlick();
          var currentSlideIndex = currentSlide.index();
          $(currentSlide).remove();
          if (currentSlideIndex > 0) {
            this.options.util.applySlick(currentSlideIndex - 1);
          } else {
            this.options.util.applySlick(currentSlideIndex);
          }
          this.options.views.length = this.options.views.length - 1;
          if (this.options.views.length === 1) {
            this.$el.focus();
          }
        }
      } else {
        MultipleDialogsView.__super__.destroy.apply(this, arguments);
        if (this.options.focusCallBack) {
          this.options.focusCallBack();
        } else {
          var focusedElement = this.options.targetEle;
          if (focusedElement && $(focusedElement).is(':visible')) {
            focusedElement.focus();
          }
        }
      }
      this._scrollToBegin();
      this.$el.find('.binf-modal-dialog').length === 1 ? this.$el.find('.cs-close').focus() :
      this.$el.find('.slick-current .slick -close').focus();

      return this;
    },

    onHiding: function () {
      this.triggerMethod('before:hide');
    },

    onHidden: function () {
      this.triggerMethod('hide');
      this.destroy();
    },

    onClickClose: function (event) {
      event.preventDefault();
      event.stopPropagation();
      this.destroy(event);
    },

    onClickActionIcon: function (event) {
      this.options.view.trigger("click:actionIcon");
    },

    _scrollToBegin: function () {
      if (i18n.settings.rtl === true) {
        var pos = $('body').width();
        $('body').scrollLeft(pos);
      } else {
        $('body').scrollLeft(0);
      }
    }

  });

  return MultipleDialogsView;

});
