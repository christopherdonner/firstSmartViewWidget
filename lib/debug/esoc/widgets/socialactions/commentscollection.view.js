csui.define([
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/behaviors/default.action/default.action.behavior',
  'esoc/widgets/socialactions/commentslist.view',
  'esoc/widgets/socialactions/util',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'esoc/widgets/socialactions/social.infinite.scrolling.behavior'
], function ($, _, Backbone, Marionette, DefaultActionBehavior, CommentsListView, Util,
    PerfectScrollingBehavior, InfiniteScrollingBehavior) {
  var CommentsCollectionView = Marionette.CollectionView.extend({
    tagName: 'ul',
    className: 'comments-list',
    childView: CommentsListView,
    util: Util,
    constructor: function CommentsCollectionView(options) {
      this.childViewOptions = options;
      this.childViewOptions.parentCollectionView = this;
      Marionette.CollectionView.prototype.constructor.apply(this, arguments);
      this.listenTo(this.collection, "remove sync", this.triggerMethod("update:scrollbar"));
    },
    events: {
      "click .esoc-social-comment-load-more": "loadMoreItems"
    },
    onRender: function () {
      var self = this;
      this.$el.find(".esoc-social-comment-list-item").hide();
      this.util.setCommentDialogPointer();
        $(window).on("resize", function (e) {
            if ($("[id*=esoc-social-comment-widget]") && $("[id*=esoc-social-comment-widget]").length > 0) {
                self.util.setCommentDialogPointer();
            }
      });
    },
    behaviors: {
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        suppressScrollX: true
      },
      InfiniteScrolling: {
        behaviorClass: InfiniteScrollingBehavior
      },
      DefaultAction: {
        behaviorClass: DefaultActionBehavior
      }
    },
    childEvents: {
      'click:item': 'onClickItem',
      'click:attachment': 'onClickAttachment'
    },
    onClickItem: function (target) {
      var objectArgs = {
        "node": target.sgmModel,
        "callingViewInstance": this
      }
      this.util.commonUtil.openItem(objectArgs);

    },
    onClickAttachment: function (target) {
      var objectArgs = {
        "node": target.attachmentModel,
        "callingViewInstance": this
      }
      this.util.commonUtil.openItem(objectArgs);
    },
    loadMoreItems: function (e) {
      if (!this.collection.models[this.collection.models.length - 1].attributes.noMoreData) {
        delete this.collection.defaults.params[this.util.commonUtil.globalConstants.SINCE_ID];
        this.collection.defaults.params[this.util.commonUtil.globalConstants.MAX_ID] = e.target.id;
        this.collection.fetch({remove: false});
      }
    }
  });
  return CommentsCollectionView;
});
