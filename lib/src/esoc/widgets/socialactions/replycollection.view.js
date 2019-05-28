/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'esoc/widgets/socialactions/replylist.view',
  'csui/behaviors/default.action/default.action.behavior',
  'esoc/widgets/socialactions/util'
], function ($, _, Backbone, Marionette, ReplyListView, DefaultActionBehavior, Util) {
  var ReplyCollectionView = Marionette.CollectionView.extend({
    tagName: 'div',
    className: 'comments-list',
    childView: ReplyListView,
    util: Util,
    constructor: function ReplyCollectionView(options) {
      this.childViewOptions = options;
      Marionette.CollectionView.prototype.constructor.apply(this, arguments);
    },
    onRender: function () {
      this.$el.find(".esoc-social-reply-list-item").hide();
    },
    behaviors: {
      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      }
    },
    childEvents: {
      'click:attachment': 'onClickAttachment'
    },
    onClickAttachment: function (target) {
      var objectArgs = {
        "node": target.attachmentModel,
        "callingViewInstance": this
      }
      this.util.commonUtil.openItem(objectArgs);
    }
  });
  return ReplyCollectionView;
});