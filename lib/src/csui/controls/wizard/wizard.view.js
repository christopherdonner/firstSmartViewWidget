/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/behaviors/keyboard.navigation/tabables.behavior',
  'csui/controls/wizard/step/wizard.step.view',
  'hbs!csui/controls/wizard/impl/wizard',
  'csui/utils/non-emptying.region/non-emptying.region',
  'csui/utils/log',
  'i18n',
  'css!csui/controls/wizard/impl/wizard',
  'csui/lib/binf/js/binf'
], function (module, _, $, Backbone, Marionette, LayoutViewEventsPropagationMixin,
    TabablesBehavior, WizardStepView, wizardTemplate,
    NonEmptyingRegion, log, i18n) {

  var WizardView = Marionette.LayoutView.extend({

    id: 'wizard',

    template: wizardTemplate,

    behaviors: {
      TabablesBehavior: {
        behaviorClass: TabablesBehavior,
        recursiveNavigation: true,
        containTabFocus: true
      }
    },

    className: function () {
      var className = 'cs-wizard';
      if (this.options.className) {
        className += ' ' + _.result(this.options, 'className');
      }
      return className;
    },

    templateHelpers: function () {
      return {};
    },

    constructor: function WizardView(options) {
      options || (options = {});
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
      this.propagateEventsToRegions();
    },

    initialize: function () {
      this.currentStep = 0;
      this.stepViews = [];
      this.direction = "right";
    },

    show: function (options) {
      var container = $.fn.binf_modal.getDefaultContainer(),
          region    = new NonEmptyingRegion({el: container});
      this.edit_permission = options.editpermission;
      region.show(this);
      return this;
    },

    onRender: function () {
      this.renderCurrentStep();
      return this;
    },

    renderCurrentStep: function () {
      this.currentView = this.getCurrentView();
      if (this.currentView._isRendered) {
        this.showCurrentView();
      } else {
        var region = new NonEmptyingRegion({el: this.el});
        region.show(this.currentView);
      }
    },

    getCurrentView: function () {
      if (this.currentStep < this.stepViews.length) {
        return this.stepViews[this.currentStep];
      } else {
        var stepNum = this.currentStep;
        var view = new WizardStepView(_.extend(this.options.steps[stepNum],
            {wizard: this, isFirstStep: this.isFirstStep()}));
        this.stepViews.push(view);
        this.listenTo(view, 'next:clicked', this.nextStep)
            .listenTo(view, 'previous:clicked', this.prevStep)
            .listenTo(view, 'done:clicked', this.save)
            .listenTo(view, 'add:member', this.addMember)
            .listenTo(view, 'close:wizard', this.closeWizard);
        return view;
      }
    },

    nextStep: function () {
      if (this.currentView.validate()) {
        if (!this.isLastStep()) {
          this.hideCurrentView();
          this.currentStep += 1;
          this.direction = i18n && i18n.settings.rtl ? "left" : "right";
          this.renderCurrentStep();
        } else {
          this.save();
        }
      }
    },

    prevStep: function () {
      if (!this.isFirstStep()) {
        this.hideCurrentView();
        this.currentStep -= 1;
        this.direction = i18n && i18n.settings.rtl ? "right" : "left";
        this.renderCurrentStep();
      }
    },

    hideCurrentView: function () {
      this.currentView.$el.addClass('binf-hidden');
    },

    showCurrentView: function () {
      this.currentView.$el.removeClass('binf-hidden');
    },

    addDirection: function () {
      this.currentView.$el.find(".binf-modal-dialog").removeClass("left");
      this.currentView.$el.find(".binf-modal-dialog").removeClass("right");
      this.currentView.$el.find(".binf-modal-dialog").addClass(this.direction);
    },

    updateButton: function (id, options) {
      if (!this.currentView.updateButton) {
        throw new Error('Dialog footer does not support button updating.');
      }
      this.currentView.updateButton(id, options);
    },

    save: function () {
      this.trigger("save:result");
    },

    addMember: function () {
      this.trigger("add:member");
    },

    isFirstStep: function () {
      return (this.currentStep === 0);
    },

    isLastStep: function () {
      return (this.currentStep === this.options.steps.length - 1);
    },

    onBeforeDestroy: function () {
      _.each(this.stepViews, function (stepView, index) {
        stepView.destroy();
      });
    },

    closeWizard: function () {
      this.trigger('closing:wizard');
      this.destroy();
    },

    getStepViewByStepNumber: function (stepNum) {
      if (this.stepViews && (stepNum < this.stepViews.length)) {
        return this.stepViews[stepNum];
      } else {
        return null;
      }
    }

  });

  _.extend(WizardView.prototype, LayoutViewEventsPropagationMixin);

  return WizardView;

});