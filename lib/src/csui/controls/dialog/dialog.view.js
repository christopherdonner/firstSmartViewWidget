/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['module', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/behaviors/keyboard.navigation/tabables.behavior',
  'csui/controls/dialog/impl/footer.view',
  'csui/controls/dialog/impl/header.view',
  'hbs!csui/controls/dialog/impl/dialog',
  'csui/utils/non-emptying.region/non-emptying.region',
  'csui/utils/log',
  'i18n',
  'css!csui/controls/dialog/impl/dialog',
  'csui/lib/binf/js/binf'
], function (module, _, $, Backbone, Marionette, LayoutViewEventsPropagationMixin,
    TabablesBehavior, DialogFooterView, DialogHeaderView, dialogTemplate,
    NonEmptyingRegion, log, i18n) {

  log = log(module.id);

  var DialogView = Marionette.LayoutView.extend({

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

    template: dialogTemplate,

    behaviors: {
      TabablesBehavior: {
        behaviorClass: TabablesBehavior,
        recursiveNavigation: true,
        containTabFocus: true
      }
    },

    regions: {
      body: '.binf-modal-body',
      header: '.binf-modal-header',
      footer: '.binf-modal-footer'
    },

    ui: {
      header: '.binf-modal-header',
      footer: '.binf-modal-footer',
      body: '.binf-modal-body'
    },

    events: {
      'hide.binf.modal': 'onHiding',
      'hidden.binf.modal': 'onHidden',
      'click .cs-close': 'onClickClose',
      'shown.binf.modal': 'onShown',
      'keyup': 'onKeyInView', // must be keyup, because subviews want to intercept too
      'setCurrentTabFocus': 'setCurrentTabFocus',
      'tabNextRegion': 'tabNextRegion',
      'click .tile-type-action-icon': 'onClickActionIcon'
    },

    templateHelpers: function () {
      var binfDialogSizeClassName = !!this.options.largeSize ? 'binf-modal-lg' :
                                    (!!this.options.midSize ? 'binf-modal-md' : '');
      return {
        binfDialogSizeClassName: binfDialogSizeClassName,
        bodyMessage: this.options.bodyMessage
      };
    },

    constructor: function DialogView() {
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
      this.listenToOnce(this, 'before:hide', TabablesBehavior.popTabableHandler);
      this.propagateEventsToRegions();
      if (this.options.headerControl) {
      }
    },

    onKeyInView: function (event) {
      if (event.keyCode === 27 && !event.isDefaultPrevented()) {
        this.destroy();
      }
    },

    setCurrentTabFocus: function () {
      this.focusOnLastRegion = true;
      this.$el.focus();
    },

    tabNextRegion: function () {
      this.trigger('changed:focus');
    },

    show: function () {
      var container = $.fn.binf_modal.getDefaultContainer(),
          region    = new NonEmptyingRegion({el: container});
      region.show(this);
      return this;
    },

    onRender: function () {
      this.$el.addClass(DialogView.prototype.className.call(this))
          .attr({'tabindex': 0, 
                  'aria-label': this.options.dialogTxtAria || this.options.title || ''
                });
      this._renderHeader();

      if (this.options.view) {
        this.body.show(this.options.view);
      }

      this._renderFooter();
    },

    onShow: function () {
      $(window).scrollTop(0);

      this.$el.binf_modal({
        backdrop: 'static',
        keyboard: false,
        paddingWhenOverflowing: false
      });
    },

    kill: function () {
      DialogView.__super__.destroy.apply(this, arguments);
      this._scrollToBegin();
      return true;
    },

    destroy: function () {
      if (this.$el.is(':visible')) {
        this.$el.binf_modal('hide');
      } else {
        DialogView.__super__.destroy.apply(this, arguments);
      }
      this._scrollToBegin();
      return this;
    },

    updateButton: function (id, options) {
      var footerView = this.footerView;
      if (!footerView.updateButton) {
        throw new Error('Dialog footer does not support button updating.');
      }
      footerView.updateButton(id, options);
    },

    showView: function (view) {
      this.body.show(view);
      view.triggerMethod('after:show');
    },

    onShown: function () {
      if (this.options.view && this.options.view.triggerMethod) {
        this.options.view.triggerMethod('dom:refresh');
        this.options.view.triggerMethod('after:show');
      }
      if (this.headerView && this.headerView.triggerMethod) {
        this.headerView.triggerMethod('dom:refresh');
        this.headerView.triggerMethod('after:show');
      }
      if (this.footerView && this.footerView.triggerMethod) {
        this.footerView.triggerMethod('dom:refresh');
        this.footerView.triggerMethod('after:show');
      }
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
      this.destroy();
    },

    onClickActionIcon: function (event) {
      this.options.view.trigger("click:actionIcon");
    },

    onClickButton: function (view) {
      var attributes = view.model.attributes;
      if (attributes.click) {
        attributes.click({
          dialog: this,
          button: this.$el,
          buttonAttributes: attributes
        });
      }
      if (attributes.close) {
        this.destroy();
      }
    },

    _scrollToBegin: function () {
      if (i18n.settings.rtl === true) {
        var pos = $('body').width();
        $('body').scrollLeft(pos);
      } else {
        $('body').scrollLeft(0);
      }
    },

    _renderHeader: function () {
      var headerView = this.headerView = this.options.headerView,
          expandedHeader = this.options.standardHeader !== undefined ?
                           this.options.standardHeader : !this.options.template;
      if (headerView) {
        this.header.show(headerView);
      }
      else {
        var options = {
          iconLeft: this.options.iconLeft,
          actionIconLeft: this.options.actionIconLeft,
          imageLeftUrl: this.options.imageLeftUrl,
          imageLeftClass: this.options.imageLeftClass,
          title: this.options.title,
          iconRight: this.options.iconRight || 'cs-icon-cross',
          headers: this.options.headers,
          headerControl: this.options.headerControl,
          expandedHeader: expandedHeader,
          el: this.ui.header[0]
        };
        headerView = this.headerView = new DialogHeaderView(options);
        headerView.render();
        this.header.attachView(headerView);
        this.headerView.trigger('dom:refresh');
      }
    },

    _renderFooter: function () {
      var footerView = this.footerView = this.options.footerView;
      if (footerView) {
        this.ui.footer.removeClass('binf-hidden');
        this.footer.show(footerView);
      } else {
        var buttons = this.options.buttons || [];
        if (buttons.length) {
          this.ui.footer.removeClass('binf-hidden');
        }
        footerView = this.footerView = new DialogFooterView({
          collection: new Backbone.Collection(buttons),
          el: this.ui.footer[0]
        });
        this.listenTo(footerView, 'childview:click', this.onClickButton);
        footerView.render();
        this.footer.attachView(footerView);
      }
    }

  });

  _.extend(DialogView.prototype, LayoutViewEventsPropagationMixin);

  return DialogView;

});
