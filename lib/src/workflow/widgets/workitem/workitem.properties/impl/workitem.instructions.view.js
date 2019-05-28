/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/utils/log',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'hbs!workflow/widgets/workitem/workitem.properties/impl/workitem.instructions',
  'i18n!workflow/widgets/workitem/workitem.properties/impl/nls/lang',
  'css!workflow/widgets/workitem/workitem.properties/impl/workitem.instructions'
], function (_, $, Marionette, log, LayoutViewEventsPropagationMixin,
    TabableRegionBehavior, template, lang) {
  'use strict';
  var WorkItemInstructionsView = Marionette.LayoutView.extend({
    className: 'workflow-workitem-properties-instructions',

    ui: {
      instructions: '.workitem-instructions-text',
      InstructionElement: '.workitem-extended-view-mode',
      seeLessIcon: 'a.workitem-see-less-instruction',
      seeMoreIcon: 'a.workitem-see-more-instruction'
    },

    events: {
      'keydown': 'onKeyDown',
      "click @ui.seeMoreIcon": "showMoreContent",
      "click @ui.seeLessIcon": "showLessContent",
      "keydown @ui.seeMoreIcon": "onKeyDownShowMoreContent",
      "keydown @ui.seeLessIcon": "onKeyDownShowLessContent",
    },
    template: template,
    constructor: function WorkItemInstructionsView(options) {
      Marionette.LayoutView.prototype.constructor.call(this, options);
      this.propagateEventsToRegions();
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    currentlyFocusedElement: function () {
      var instructions = this.model.get('instructions');
      if (instructions) {
        return $(".workitem-instructions a");
      }
      else {
        $(".cs-form.cs-form-update:first").addClass("workitem-with-empty-instructions");
      }
    },
    contentTypeElement: ".workitem-extended-view-mode",

    showMoreContent: function (e) {

      if (window.getSelection().toString() === "") {
        var _lessIcon    = $(this.$el.find(".instruction-see-less")[0]),
            _moreIcon    = $(this.$el.find(".instruction-see-more")[0]),
            _textElement = this.ui.InstructionElement[0];
        $(_lessIcon).removeAttr("style");
        $(_lessIcon).show();
        $(_moreIcon).hide();
        this.ui.seeLessIcon.focus();
        $(_textElement).removeClass("workitem-see-more-content");
        $(_textElement).removeClass("workitem-see-more-instruction");
        $(_textElement).addClass("workitem-see-less-instruction");
      }
    },

    showLessContent: function (e) {
      if (window.getSelection().toString() === "") {
        var _lessIcon    = $(this.$el.find(".instruction-see-less")[0]),
            _moreIcon    = $(this.$el.find(".instruction-see-more")[0]),
            _textElement = this.ui.InstructionElement[0];
        $(_lessIcon).hide();
        $(_moreIcon).removeAttr("style");
        $(_moreIcon).show();
        this.ui.seeMoreIcon.focus();
        $(_textElement).addClass("workitem-see-more-content");
        $(_textElement).addClass("workitem-see-more-instruction");
        $(_textElement).removeClass("workitem-see-less-instruction");
      }
    },

    onKeyDownShowMoreContent: function (e) {
      if (e.keyCode === 13) {
        e.preventDefault();
        e.stopPropagation();
        this.showMoreContent(e);
      }

    },
    onKeyDownShowLessContent: function (e) {
      if (e.keyCode === 13) {
        e.preventDefault();
        e.stopPropagation();
        this.showLessContent(e);
      }
    },
    onKeyDown: function (e) {
      var handled = false;
      var deltaY = 0;
      switch (e.keyCode) {
      case 38: // up
        deltaY = -30;
        handled = true;
        break;
      case 40: // down
        deltaY = 30;
        handled = true;
        break;
      }
      if (handled) {
        e.preventDefault();
        e.stopPropagation();

        var parent = this.$el.find('.workitem-instructions-scrolling');
        parent.scrollTop(parent.scrollTop() + deltaY);
      }
    },
    templateHelpers: function () {
      return {
        seeMore: lang.SeeMore,
        seeLess: lang.SeeLess,
        seeMoreInstructions: lang.SeeMoreInstructions,
        seeLessInstructions: lang.SeeLessInstructions,
        model: this.model.toJSON(),
        id_instructions: _.uniqueId("id_")
      };
    }
  });

  _.extend(WorkItemInstructionsView.prototype, LayoutViewEventsPropagationMixin);

  return WorkItemInstructionsView;

});
