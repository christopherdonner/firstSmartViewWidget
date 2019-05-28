/**
 *  This relation view is to handle both the followers and following user's information.
 *  Based on selectedTab, it decides the model dynamically and generates the respective view.
 */
csui.define([
  'require',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/handlebars',
  'csui/lib/marionette',
  'csui/utils/contexts/factories/user',
  'esoc/widgets/userwidget/view/miniprofilecollection.view',
  'esoc/widgets/activityfeedwidget/activityfeedcontent',
  'esoc/widgets/userwidget/model/relations.model',
  'esoc/widgets/userwidget/view/customuserpicker.view',
  'hbs!esoc/widgets/userwidget/impl/relations',
  'esoc/widgets/userwidget/util',
  'esoc/widgets/userwidget/chat/chatutil',
  'esoc/widgets/userwidget/chat/chatfactory',
  'i18n!esoc/widgets/userwidget/nls/lang',
  'esoc/widgets/userwidget/chat/skype/skypeucwa.attribute.model'
], function (_require, $, _, Handlebars, Marionette, UserModelFactory, MiniProfileCollectionView,
    ActivityFeedContent, RelationsModel, UserPickerView, RelationsTemplate, Util, ChatUtil,
    ChatFactory,
    Lang, skypeAttributeModel) {
  var self = null;
  var RelationsView = Marionette.ItemView.extend({
    tagName: "div",
    className: 'esoc-user-relation-tab',
    template: RelationsTemplate,
    miniProfileCollectionView: "",
    activityFeedView: "",
    activityFeedOptions: "",
    ActivityFeedWidgetView: "",
    templateHelpers: function () {
      return {
        messages: {
          isFollowingTab: this.options.selectedtab === Util.commonUtil.globalConstants.FRIENDS,
          followingListEmptyMessage: Lang.noFriendsMessage,
          otherUser: this.options.userwidgetmodel.attributes.otherUser
        }
      };
    },
    initialize: function (options) {
      this.options = options;
      self = this;
      var commonUtil  = Util.commonUtil,
          updatesFrom = options.selectedtab === commonUtil.globalConstants.FRIENDS ?
                        "following" : commonUtil.globalConstants.FOLLOWERS;
      this.ActivityFeedContent = _require('esoc/widgets/activityfeedwidget/activityfeedcontent');
      options.relation = options.selectedtab === commonUtil.globalConstants.FRIENDS ?
                         commonUtil.globalConstants.FRIENDS :
                         commonUtil.globalConstants.FOLLOWERS;
      var relationsModel = new RelationsModel(options);
      this.activityFeedOptions = {
        "context": options.context,
        "otherUser": options.userwidgetmodel.attributes.otherUser,
        "hideupdatesfrom": true,
        "updatesfrom": {
          "from": updatesFrom,
          "id": options.userwidgetmodel.attributes.userid
        },
        "feedSettings": {"enableFilters": true},
        "filterSource": "userprofile",
        "selectedTab": options.selectedtab,
        "origin": "userwidget"
      };
      //TODO: implement blocking of parent view  until response is fetched and view is ready
      relationsModel.fetch({
        async: false,
        success: relationsModel.fetchSuccess,
        context: options.context
      });
      $('.esoc-userprofile-action-names a.esoc-userprofile-following-action').show().html(
          this.options.userwidgetmodel.attributes.following ? Lang.unfollow : Lang.follow);
      $('.esoc-userprofile-action-names a.esoc-userprofile-following-action').attr('title',
          this.options.userwidgetmodel.attributes.following ? Lang.unfollow : Lang.follow);
      var user   = options.context ? options.context.getModel(UserModelFactory) : undefined,
          userId = !!user && user.get("id") ? user.get("id") : options.loggedUserId;

      this.miniProfileCollectionView = new MiniProfileCollectionView({
        collection: relationsModel,
        loggedUserId: userId,
        relation: options.relation,
        otherUserProfile: options.userwidgetmodel.attributes.otherUser,
        context: options.context
      });
      var relationCount = (this.options.selectedtab === Util.commonUtil.globalConstants.FRIENDS ?
                           this.options.userwidgetmodel.attributes.friends_count :
                           this.options.userwidgetmodel.attributes.followers_count);
      Util.changeRelationsCounts(this.options.userwidgetmodel.attributes);
      this.options.userwidgetmodel.attributes.relationCount = relationCount;
      this.activityFeedView = new this.ActivityFeedContent(this.activityFeedOptions);
      this.listenTo(this.miniProfileCollectionView, "collectionview.show.user.dialog",
          function (e) {
            self.trigger("relationsview.show.user.dialog", e);
          });
      relationsModel.on('remove.relation', function (e, response) {
        if (self.activityFeedView.contentView.collection.widgetOptions.getNewUpdates !==
            undefined) {
          delete self.activityFeedView.contentView.collection.widgetOptions["getNewUpdates"];
        }
        var friends_count         = response.friends_count !== undefined ? response.friends_count :
                                    response.data.user.friends_count,
            followers_count       = response.followers_count !== undefined ?
                                    response.followers_count :
                                    response.data.user.followers_count,
            afwID                 = self.activityFeedOptions.collection.widgetOptions.activityfeed.widgetId,
            relationsCountResults = {
              friends_count: friends_count,
              followers_count: followers_count
            };
        Util.changeRelationsCounts(relationsCountResults);
        if ((self.options.selectedtab === Util.commonUtil.globalConstants.FRIENDS &&
             parseInt(friends_count, 10) === 0) ||
            (self.options.selectedtab === Util.commonUtil.globalConstants.FOLLOWERS &&
             parseInt(followers_count, 10) === 0)) {
          self.options.userwidgetmodel.attributes.followers_count = parseInt(followers_count, 10);
          self.options.userwidgetmodel.attributes.friends_count = parseInt(friends_count, 10);
          self.options.userwidgetmodel.attributes.relationCount = (self.options.selectedtab ===
                                                                   Util.commonUtil.globalConstants.FRIENDS ?
                                                                   self.options.userwidgetmodel.attributes.friends_count :
                                                                   self.options.userwidgetmodel.attributes.followers_count);
          if (self.options.selectedtab === Util.commonUtil.globalConstants.FRIENDS) {
            self.$el.find(".esoc-user-no-relations").show();
            self.$el.find("#esoc-user-no-relations").show();
          }
          self.$el.find("#esoc-user-relations-list").hide();
          self.$el.find("#esoc-user-relations-activity-list").hide();
          self.activityFeedView.contentView.collection.widgetOptions = _.extend(
              {getNewUpdates: false},
              self.activityFeedView.contentView.collection.widgetOptions);
          if (!self.options.userwidgetmodel.attributes.otherUser &&
              self.templateHelpers().messages.isFollowingTab) {
            self.$el.find(".esoc-user-no-relations").show();
          }
        }
        self.$el.find(".esoc-activityfeed-getnewupdates.esoc-activityfeed-getnewupdates-" +
                      afwID).hide();
        self.options.context._factories[afwID].fetch(self.activityFeedOptions);
      });
      this.listenTo(relationsModel, "add.follower", this.onAddFollower);
      this.options.showActions = true;
      this.pickerView = new UserPickerView({
        context: this.options.context,
        limit: 5,
        memberFilter: {type: [0]},
        widgetoptions: this.options,
        placeholder: Lang.userpickerplaceholder,
        prettyScrolling: true,
        scrollContainerHeight: 'auto'
      });
    },
    constructor: function RelationsView(options) {
      options = options || {};
      Marionette.ItemView.prototype.constructor.call(this, options);
    },
    errorHandle: function (model, response) {
    },
    onShow: function () {
      if (self.activityFeedView.contentView.collection.widgetOptions.getNewUpdates !== undefined) {
        delete self.activityFeedView.contentView.collection.widgetOptions["getNewUpdates"];
      }
      self.showUserPicker();
      var miniProfileCollectionRegion = new Marionette.Region({el: "#esoc-user-relations-list"}),
          activityFeedRegion          = new Marionette.Region({el: "#esoc-user-relations-activity-list"});
      miniProfileCollectionRegion.show(this.miniProfileCollectionView);
      activityFeedRegion.show(this.activityFeedView.contentView);
      if (this.options.userwidgetmodel.attributes.relationCount === 0) {
        self.activityFeedView.contentView.collection.widgetOptions = _.extend(
            {getNewUpdates: false},
            self.activityFeedView.contentView.collection.widgetOptions);
        self.$el.find("#esoc-user-relations-list").hide();
        self.$el.find("#esoc-user-relations-activity-list").hide();
        if (!self.options.userwidgetmodel.attributes.otherUser &&
            self.templateHelpers().messages.isFollowingTab) {
          self.$el.find(".esoc-user-no-relations").show();
        }
      }

      self.options.context._factories[self.activityFeedOptions.collection.widgetOptions.activityfeed.widgetId].fetch(
          self.activityFeedOptions).done(function () {
        self.trigger("view:shown");
      });

      if (skypeAttributeModel.getPresenceEnabled() && skypeAttributeModel.isPluginEnabled()) {
        var collectionLen = self.miniProfileCollectionView.collection.length,
            collection    = self.miniProfileCollectionView.collection,
            emailIDS      = [],
            presenceEle   = [];

        if (collectionLen > 0) {
          for (var item = 0; item < collectionLen; item++) {

            emailIDS[item] = collection.models[item].attributes.screen_name + '@' +
                             collection.models[item].attributes.chatSettings.chatDomain;
            presenceEle[item] = "esoc-mini-profile-presence-indicator-" +
                                collection.models[item].attributes.id;

          }

          var presenceOptions = {
            presenceHolder: presenceEle,
            email: emailIDS,
            context: self.options.context
          };

          if (emailIDS.length > 0 && presenceEle.length > 0) {
            ChatFactory.getProvider().showUserPresence(presenceOptions);
          }
        }
      }
    },
    onAddFollower: function (e) {
      var afwID = self.activityFeedOptions.collection.widgetOptions.activityfeed.widgetId;
      if (self.options.userwidgetmodel.attributes.relationCount === 0) {
        if (self.activityFeedView.contentView.collection.widgetOptions.getNewUpdates !==
            undefined) {
          delete self.activityFeedView.contentView.collection.widgetOptions["getNewUpdates"];
        }

        if (self.options.selectedtab === Util.commonUtil.globalConstants.FRIENDS) {
          self.$el.find("#esoc-user-no-relations").hide();
        }
        self.$el.find("#esoc-user-relations-list").show();
        self.$el.find("#esoc-user-relations-activity-list").show();
        Util.commonUtil.alignUpdateButton(afwID, false);
        if (this.options.relation === Util.commonUtil.globalConstants.FOLLOWERS) {
          self.options.userwidgetmodel.attributes.relationCount = self.options.userwidgetmodel.attributes.followers_count;
        }
        if (!(self.activityFeedView instanceof ActivityFeedContent)) {
          self.activityFeedView = new this.ActivityFeedContent(self.activityFeedOptions);
        }
      }
      self.$el.find(".esoc-activityfeed-getnewupdates.esoc-activityfeed-getnewupdates-" +
                    afwID).hide();
      self.options.context._factories[afwID].fetch(self.activityFeedOptions);
    },
    showUserPicker: function () {
      if (!self.options.userwidgetmodel.attributes.otherUser) {
        if (self.options.relation === Util.commonUtil.globalConstants.FRIENDS) {
          var pickerRegion = new Marionette.Region({
            el: this.$el.find('#esoc-user-picker')
          });
          pickerRegion.show(this.pickerView);
          this.$el.find(".esoc-user-relations-list").addClass("esoc-user-relations-with-picker");
        }
      }
    },
    onDestroy: function () {
      self.activityFeedView.contentView.destroy();
    }
  });
  return RelationsView;
});