/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/marionette',
  'workflow/controls/stepcards/stepcard.view',
  'workflow/controls/stepcards/stepcard.empty.view',
  'hbs!workflow/controls/stepcards/impl/stepcards',
  'css!workflow/controls/stepcards/impl/stepcard'
], function (_, Marionette, StepcardView, StepCardsEmptyView, template) {
  'use strict';

  var StepcardCollectionView = Marionette.CompositeView.extend({

    childView: StepcardView,
    childViewOptions: function () {
      return {
        context: this.options.context,
        cellView: this.options.cellView,
        wfStatusInfoModel: this.options.wfStatusInfoModel,
        stepCardsListView: this.options.stepCardsListView,
        stepType: this.options.stepType
      };
    },
    emptyView: StepCardsEmptyView,
    className: 'wfstatus-stepcards-view binf-col-md-12 binf-col-sm-9 binf-col-xs-12',
    template: template,

    constructor: function StepcardCollectionView(options) {
      Marionette.CompositeView.prototype.constructor.apply(this, arguments);
    }

  });

  return StepcardCollectionView;
});
