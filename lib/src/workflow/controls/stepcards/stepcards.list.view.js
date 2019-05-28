/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/models/nodes',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'workflow/controls/stepcards/stepcard.view',
  'workflow/controls/stepcards/stepcards.view',
  'hbs!workflow/controls/stepcards/impl/stepcards.list',
  'css!workflow/controls/stepcards/impl/stepcard'
], function ($, _, Backbone, Marionette,
    NodeCollection, PerfectScrollingBehavior, StepcardView, StepcardCollectionView,
    template) {
  'use strict';
  var StepcardsListView = Marionette.LayoutView.extend({

    childView: StepcardView,
    className: 'wfstatus-stepcard-layout',
    template: template,
    tagName: 'div',

    behaviors: {
      ScrollingInstructions: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: '.wfstatus-stepcard-list',
        suppressScrollX: true
      }
    },

    regions: {
      stepcardLayout: ".wfstatus-stepcard-list"
    },

    constructor: function StepcardsListView(options) {
      options = options || {};
      Marionette.LayoutView.prototype.constructor.call(this, options);
    },

    onRender: function () {
        this.stepcollection = new NodeCollection(this.options.step_list, {});
        this.stepcardCollectionView = new StepcardCollectionView({
          collection: this.stepcollection,
          context: this.options.context,
          cellView: this.options.cellView,
          stepCardsListView : this,
          wfStatusInfoModel: this.options.wfStatusInfoModel,
          stepType: this.options.stepType
        });
        this.stepcardLayout.show(this.stepcardCollectionView);
      }

  });
  return StepcardsListView;
});
