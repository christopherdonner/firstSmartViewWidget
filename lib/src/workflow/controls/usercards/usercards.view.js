/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/marionette',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'workflow/controls/usercards/usercard.view',
  'css!workflow/controls/usercards/impl/usercard'
], function (_, Marionette, PerfectScrollingBehavior, UsercardView) {
  'use strict';

  var UsercardCollectionView = Marionette.CollectionView.extend({

    childView: UsercardView,

    className: 'wfstatus-usercard-list',

    constructor: function UsercardCollectionView(options) {
      Marionette.CollectionView.prototype.constructor.apply(this, arguments);
    },

    childViewOptions: function () {
      return {
        options:this,
        status: this.options.status,
        context: this.options.context,
        originatingView: this.options.originatingView,
        nodeModel: this.options.nodeModel,
        stepCardsListView: this.options.stepCardsListView,
        wfData: this.options.wfData,
        stepType: this.options.stepType
      };
    }
  });

  return UsercardCollectionView;
});