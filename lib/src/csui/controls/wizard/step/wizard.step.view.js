/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['module', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/behaviors/keyboard.navigation/tabables.behavior',
  'csui/controls/wizard/step/impl/footer.view',
  'csui/controls/wizard/step/impl/header.view',
  'hbs!csui/controls/wizard/step/impl/wizard.step',
  'csui/utils/log',
  'i18n!csui/controls/wizard/impl/nls/lang',
  'i18n'
], function (module, _, $, Backbone, Marionette, LayoutViewEventsPropagationMixin,
    TabablesBehavior, WizardStepFooterView, WizardStepHeaderView, wizardStepTemplate,
    log, lang, i18n) {

  log = log(module.id);

  var WizardStepView = Marionette.LayoutView.extend({

    className: function () {
      var className = 'cs-wizard-step cs-dialog binf-modal binf-fade';
      if (this.options.className) {
        className += ' ' + _.result(this.options, 'className');
      }
      return className;
    },

    attributes: {
      'tabindex': '-1',
      'role': 'dialog',
      'aria-hidden': 'true'
    },

    template: wizardStepTemplate,

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
      return {
        largeSize: this.options.largeSize,
        midSize: this.options.midSize,
        bodyMessage: this.options.bodyMessage,
        dialogTxtAria: this.options.dialogTxtAria
      };
    },

    constructor: function WizardStepView() {
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
      this.listenToOnce(this, 'before:hide', TabablesBehavior.popTabableHandler);
      this.propagateEventsToRegions();
    },
    onKeyInView: function (event) {
      if (event.keyCode === 27) {
        event.preventDefault();
        event.stopPropagation();
        this.destroy();
        this.trigger('close:wizard');
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
      this.$el
          .addClass(WizardStepView.prototype.className.call(this))
          .attr('tabindex', 0);
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
      WizardStepView.__super__.destroy.apply(this, arguments);
      this._scrollToBegin();
      return true;
    },

    destroy: function () {
      if (this.$el.is(':visible')) {
        this.$el.binf_modal('hide');
        $('body').removeClass('binf-modal-open');
      } else {
        WizardStepView.__super__.destroy.apply(this, arguments);
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
      if (this.options.view) {
        this.options.view.triggerMethod('dom:refresh');
        this.options.view.triggerMethod('after:show');
      }
      if (this.headerView) {
        this.headerView.triggerMethod('dom:refresh');
        this.headerView.triggerMethod('after:show');
      }
      if (this.footerView) {
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
      this.trigger('close:wizard');
    },

    onClickActionIcon: function (event) {
      this.options.view.trigger("click:actionIcon");
    },

    onClickButton: function (view) {
      if (view.model.get('id') === 'Add') {
        this.trigger('add:member');
      } else {
        var attributes = view.model.attributes;
        if (attributes.click) {
          attributes.click({
            dialog: this,
            button: this.$el
          });
        }
        if (attributes.close) {
          this.trigger('close:wizard');
        }
      }

    },

    _scrollToBegin: function () {
      if (i18n.settings.rtl === true) {
        var pos = $('body').width();
        $('body').scrollLeft(pos);
      } else {
        $('body').scrollLeft(0);
        $('.csui-add-permission').focus();
      }
    },

    _renderHeader: function () {
      var headerView = this.headerView = this.options.headerView,
          expandedHeader = this.options.standardHeader !== undefined ?
                           this.options.standardHeader : !this.options.template;
      (!!headerView) ?
      (headerView.editpermission = !!this.options.wizard && !!this.options.wizard.edit_permission &&
                                   this.options.wizard.edit_permission) : '';
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
        headerView = this.headerView = new WizardStepHeaderView(options);
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
        var defaultButtons = [];
        if (!this.options.isFirstStep) {
          defaultButtons.push({
            id: 'previous',
            label: this.options.previousButtonLabel || lang.back,
            toolTip: this.options.previousButtonLabel || lang.back,
            'default': false,
            disabled: false,
            separate: true,
            click: _.bind(this.onClickPreviousButton, this)
          });
        }
        var nextButton = {
              id: 'next',
              label: this.options.nextButtonLabel || lang.next,
              toolTip: this.options.nextButtonLabel || lang.next,
              'default': true,
              disabled: (this.options.disableNext === undefined) ? true : this.options.disableNext,
              click: _.bind(this.onClickNextButton, this)
            },
            doneButton = {
              id: 'done',
              label: this.options.doneButtonLabel || lang.next,
              toolTip: this.options.doneButtonLabel || lang.next,
              'default': true,
              disabled: (this.options.disableDone === undefined) ? true : this.options.disableDone,
              click: _.bind(this.onClickDoneButton, this)
            };
        if (this.options.nextButton) {
          defaultButtons.push(nextButton);
        } else if (this.options.doneButton) {
          defaultButtons.push(doneButton);
        }
        defaultButtons.push(
            {
              id: 'cancel',
              label: lang.cancel,
              toolTip: lang.cancel,
              close: true
            });

        var buttons = this.options.buttons || defaultButtons;
        if (buttons.length) {
          this.ui.footer.removeClass('binf-hidden');
        }
        footerView = this.footerView = new WizardStepFooterView({
          collection: new Backbone.Collection(buttons),
          wizardView: this,
          el: this.ui.footer[0]
        });
        this.listenTo(footerView, 'childview:click', this.onClickButton);
        footerView.render();
        this.footer.attachView(footerView);
      }
    },

    showPreviousButton: function () {
      var previousBtnView = this.footer.currentView.getPreviousButton();
      previousBtnView.$el.removeClass('binf-hidden');
    },

    hidePreviousButton: function () {
      var previousBtnView = this.footer.currentView.getPreviousButton();
      previousBtnView.$el.addClass('binf-hidden');
    },

    validate: function () {
      if (this.body.currentView && this.body.currentView.validate) {
        return this.body.currentView.validate();
      } else {
        return true;
      }
    },

    onClickNextButton: function () {
      this.trigger('next:clicked');
    },

    onClickDoneButton: function () {
      this.trigger('done:clicked');
    },

    onClickPreviousButton: function () {
      this.trigger('previous:clicked');
    }

  });

  _.extend(WizardStepView.prototype, LayoutViewEventsPropagationMixin);

  return WizardStepView;

});
