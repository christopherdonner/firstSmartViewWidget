/**
 *  This is to get user's general information
 */
csui.define([
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/handlebars',
  'csui/lib/marionette',
  'csui/utils/contexts/factories/connector',
  'esoc/widgets/userwidget/view/miniprofilecard.view',
  'i18n!esoc/widgets/userwidget/nls/lang',
  'esoc/widgets/userwidget/util',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior'
], function ($, _, Handlebars, Marionette, ConnectorFactory, MiniProfileCardView, Lang, Util,
    PerfectScrollingBehavior) {
  var self = null;
  var MiniProfileCollectionView = Marionette.CollectionView.extend({
    tagName: "div",
    className: 'binf-col-lg-12 binf-col-md-12 binf-col-sm-12 binf-col-xs-12 esoc-miniprofile-collection',
    childView: MiniProfileCardView,
    childViewOptions: function () {
      return {
        context: this.options.context,
        parentViewOptions: this.options
      };
    },
    initialize: function (options) {
      this.options = options;
      if (!this.options.connector) {
        this.options.connector = this.options.context.getObject(ConnectorFactory);
      }
      self = this;
      this.listenTo(this, "childview:show.user.dialog", function (e) {
        self.trigger('collectionview.show.user.dialog', e);
      });
      this.listenTo(Util.commonUtil.globalConstants.event_bus, "changefollowingstatus",
          function (miniprofileview, followUnfollowResponse) {
            // do not refresh the tab if commenting widget is opened
            if (($("#esoc-user-profile-following-tab").hasClass('binf-active') &&
                 !$("#esoc-social-comment-create-container").is(':visible')) ||
                ($("#esoc-user-profile-activity-tab").hasClass('binf-active') &&
                 !$("#esoc-social-comment-create-container").is(':visible')) ||
                ($("#esoc-user-profile-followers-tab").hasClass('binf-active') &&
                 !$("#esoc-social-comment-create-container").is(':visible'))) {

              var miniprofilemodel = this.options.collection.get(
                  miniprofileview.model.attributes.id);
              var followingStatus;
              if (!!miniprofilemodel) {
                var miniProfileModelAttrs = miniprofilemodel.attributes;
                if (miniProfileModelAttrs.relation === Util.commonUtil.globalConstants.FRIENDS) {
                  if (miniProfileModelAttrs.otherUserProfile) {
                    followingStatus = miniprofileview.model.attributes.following;
                    miniProfileModelAttrs.following = followingStatus;
                    if (followingStatus) {
                      miniProfileModelAttrs.actions.following = Lang.unfollow;
                      miniProfileModelAttrs.actions.followingClass = "esoc-mini-profile-unfollow-icon"
                    } else {
                      miniProfileModelAttrs.actions.following = Lang.follow;
                      miniProfileModelAttrs.actions.followingClass = "esoc-mini-profile-follow-icon"
                    }
                    this.render();
                  } else {
                    this.options.collection.remove(miniprofileview.model.attributes.id);
                    this.options.collection.trigger("remove.relation", miniprofileview,
                        followUnfollowResponse);
                  }
                } else if (miniProfileModelAttrs.relation ===
                           Util.commonUtil.globalConstants.FOLLOWERS) {
                  followingStatus = miniprofileview.model.attributes.following;
                  miniProfileModelAttrs.following = followingStatus;
                  miniProfileModelAttrs.following = followingStatus;
                  if (followingStatus) {
                    miniProfileModelAttrs.actions.following = Lang.unfollow;
                    miniProfileModelAttrs.actions.followingClass = "esoc-mini-profile-unfollow-icon"
                  } else {
                    miniProfileModelAttrs.actions.following = Lang.follow;
                    miniProfileModelAttrs.actions.followingClass = "esoc-mini-profile-follow-icon"
                  }
                  this.render();
                  if (!miniProfileModelAttrs.otherUserProfile) {
                    Util.changeRelationsCounts(followUnfollowResponse.data.user);
                  }
                }
              }
              else {
                //update the cards in the following tab
                if (this.options.relation === Util.commonUtil.globalConstants.FRIENDS) {
                  if (!this.options.otherUserProfile) { //self user
                    var ajaxParams = {
                      "itemview": self,
                      "url": self.options.connector.connection.url +
                             Util.commonUtil.REST_URLS.chatHistoryUrl +
                             miniprofileview.model.attributes.id,
                      "type": "GET",
                      "relation": this.options.relation,
                      "otherUserProfile": this.options.otherUserProfile,
                      "requestType": "membersAPI",
                      "context": this.options.context
                    };
                    Util.updateAjaxCall(ajaxParams);
                  }
                }
              }
            }
          });

      this.listenTo(Util.commonUtil.globalConstants.event_bus, "updatefollowerstab",
          function (userprofileview, followUnfollowResponse) {
            // do not refresh the tab if commenting widget is opened
            if (($("#esoc-user-profile-following-tab").hasClass('binf-active') &&
                 !$("#esoc-social-comment-create-container").is(':visible')) ||
                ($("#esoc-user-profile-activity-tab").hasClass('binf-active') &&
                 !$("#esoc-social-comment-create-container").is(':visible')) ||
                ($("#esoc-user-profile-followers-tab").hasClass('binf-active') &&
                 !$("#esoc-social-comment-create-container").is(':visible'))) {
              if (this.options.relation === Util.commonUtil.globalConstants.FOLLOWERS) {
                if (this.options.collection.get(this.options.loggedUserId)) {
                  this.options.collection.remove(this.options.loggedUserId);
                  this.options.collection.trigger("remove.relation", userprofileview,
                      followUnfollowResponse);
                } else {
                  // get loggeduserinfo from members api and add to collection
                  var ajaxParams = {
                    "itemview": self,
                    "url": self.options.connector.connection.url +
                           Util.commonUtil.REST_URLS.chatHistoryUrl +
                           this.options.loggedUserId,
                    "type": "GET",
                    "requestType": "membersAPI",
                    "context": this.options.context
                  };
                  Util.updateAjaxCall(ajaxParams);
                }
              }
            }
          });
    },
    onRender: function (e) {
      var scrollTop;
      this.$el.on("scroll", function (e, that) {
        var followingContainer = $(this);
        var containerHeight = followingContainer.height();
        var containerScrollHeight = followingContainer[0].scrollHeight;
        var containerScrollTop = followingContainer.scrollTop();
        if ((containerScrollTop + 17) >= (containerScrollHeight - containerHeight)) {
          // ESOC-4021 Unable to view more than 20 users in following and followers list while list contains a lot of users
          // To prevent immediate click events checking atleast 50px gap between the scroll
          // positions of the last fetched page and next loading page
          if (!scrollTop || (scrollTop && (containerScrollTop - parseInt(scrollTop, 10)) > 50)) {
            scrollTop = containerScrollTop;
            $(this).find(".esoc-social-users-load-more:last").trigger("click");
          }
        }
      });
    },
    behaviors: {
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        suppressScrollX: true,
        scrollYMarginOffset: 15 // like bottom padding of container, otherwise scrollbar is shown always
      }
    },
    constructor: function MiniProfileCollectionView() {
      Marionette.CollectionView.prototype.constructor.apply(this, arguments);
    },
    errorHandle: function (model, response) {
    },
    events: {
      "click .esoc-social-users-load-more": "loadMoreItems"
    },
    loadMoreItems: function (e) {
      if (this.collection.defaults.params.cursor > 0) {
        this.collection.fetch({
          remove: false,
          params: {cursor: this.collection.defaults.params.cursor},
          success: this.collection.fetchSuccess
        });
      }
    }

  });
  return MiniProfileCollectionView;
});
