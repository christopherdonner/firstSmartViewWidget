/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module',
      'require',
      'csui/lib/jquery',
      'csui/lib/underscore',
      'csui/lib/marionette',
      'i18n!esoc/widgets/userwidget/nls/lang',
      'esoc/widgets/userwidget/view/general.view',
      'esoc/widgets/userwidget/view/personal.view',
      'esoc/widgets/userwidget/view/relations.view',
      'esoc/widgets/userwidget/view/settings.view',
      'esoc/widgets/activityfeedwidget/activityfeedwithfilter.view',
      'csui/behaviors/keyboard.navigation/tabable.region.behavior',
      'esoc/widgets/userwidget/view/simple.userwidget.form.view',
      'csui-ext!esoc/widgets/userprofile/tab.extension',
      "esoc/widgets/common/util"],
    function (module, _require, $, _, Marionette, Lang, GeneralView, PersonalView,
        RelationsView, SettingsView, ActivityFeedContent, TabableRegionBehavior, SimpleUserWidgetFormView, extraTabs,
        CommonUtil) {
      var viewInstance;
      var UserProfile = {
        userProfileTabViewMapping: {
          "esoc-user-profile-general-tab": GeneralView,
          "esoc-user-profile-personal-tab": PersonalView,
          "esoc-user-profile-activity-tab": ActivityFeedContent,
          "esoc-user-profile-following-tab": RelationsView,
          "esoc-user-profile-followers-tab": RelationsView,
          "esoc-user-profile-settings-tab": SettingsView
        },

        showTab: function (selectedTabId, regionId, options, view) {
          this.uniqueId = _.uniqueId();
          var activityFeedOptions,
              contentRegion = new Marionette.Region({
                el: view.$el.find("#" + regionId)
              }), self      = this;
          if (selectedTabId === "esoc-user-profile-following-tab") {
            options.selectedtab = CommonUtil.globalConstants.FRIENDS;
          } else if (selectedTabId === "esoc-user-profile-followers-tab") {
            options.selectedtab = CommonUtil.globalConstants.FOLLOWERS
          }
          if (!!viewInstance && $("esoc-simple-user-profile-tab-" + options.uniqueId).legth > 0) {
            viewInstance.destroy();
          }
          if (selectedTabId === "esoc-user-profile-activity-tab") {
            var ActivityFeedContent = _require(
                    'esoc/widgets/activityfeedwidget/activityfeedwithfilter.view');
            activityFeedOptions = {
              "context": options.context,
              "otherUser": options.model.attributes.otherUser,
              "hideupdatesfrom": true,
              "hideExpandIcon": true,
              feedSettings: {
                "enableFilters": true
              },
              "updatesfrom": {
                "from": "user",
                "id": options.model.attributes.userid
              },
              "filterSource": "userprofile",
              "userActivity": true,
              "showCommentIcon": true,
              "origin": "userwidget",
              "userProfileView": view
            };
            viewInstance = new ActivityFeedContent(activityFeedOptions);
          } else {
            var viewOptions = _.extend({}, options);
            viewOptions.userwidgetmodel = options.model;
            delete viewOptions["model"];
            this.userProfileTabViewMapping["esoc-simple-user-profile-tab-" + options.uniqueId]= SimpleUserWidgetFormView;
            viewInstance = new this.userProfileTabViewMapping[selectedTabId](viewOptions);
          }
          viewInstance.on("relationsview.show.user.dialog", function (e) {
            view.trigger('userprofileview.show.user.dialog', e);
          });
          var selectorString = "a[href],input[type!='radio'],input[type='radio']:checked,textarea,*[tabindex] *[data-cstabindex],button";
          view.on("view:shown", function () {
            var profileImg = view.$el.find("img.esoc-full-profile-avatar-cursor");
            if (profileImg.attr("src") !== "#") {
              profileImg.attr("tabindex", "0").attr(
                  "data-cstabindex", "0");
            } else {
              view.$el.find("span.esoc-full-profile-avatar-cursor").attr("tabindex", "0").attr(
                  "data-cstabindex", "0");
            }
            view.setTabIndexForNonTabs && view.setTabIndexForNonTabs();
            view.trigger("dom:refresh");
            if (view.options.viewShown) {
              self.setTabbing(view, selectorString, selectedTabId);
              view.options.tabClicked = true;
            } else {
              view.options.viewShown = true;
            }
          });
          viewInstance.on("view:shown", function (eventName) {
            if (view.options.viewShown) {
              self.setTabbing(view, selectorString, selectedTabId, eventName);
              view.options.tabClicked = true;
            } else {
              view.options.viewShown = true;
            }
          });
          contentRegion.show(viewInstance);
          if (selectedTabId === "esoc-user-profile-activity-tab") {
            options.context._factories[activityFeedOptions.collection.widgetOptions.activityfeed.widgetId].fetch(
                activityFeedOptions).done(function () {
              viewInstance.trigger("view:shown");
            });
          }
        },

        setTabbing: function (view, selectorString, selectedTabId, eventName) {
          var self = this;
          if (selectedTabId !== "esoc-user-profile-activity-tab") {
            self.setTabIndexForViewElements(view);
            self.setTabIndexForViewInstanceElements(viewInstance, selectorString);
          }
          $(".esoc-user-widget-dialog-back").attr("tabindex", "0").attr("data-cstabindex", "0");
          view.$el.find("[data-cstabindex=0]").filter(
              ":not(a:empty)").on("focus", function (event) {
            self.addTabableClass(view, event);
          });
          if (view.options.tabClicked && eventName !== "contentChanged") {
             viewInstance.$el.find("[data-cstabindex=0]").filter(":visible").filter(":not(a:empty)").first().focus();
          }
        },

        setTabIndexForViewElements: function(view) {
         
          view.setTabIndexForTabs && view.setTabIndexForTabs();
        },

        addTabableClass: function(view,event) {
          var target = $(event.target);
          view.options.focusedElement && view.options.focusedElement.removeClass(
              TabableRegionBehavior.accessibilityActiveElementClass);
          target.addClass(TabableRegionBehavior.accessibilityActiveElementClass);
          view.options.focusedElement = target;
        },

        setTabIndexForViewInstanceElements: function (viewInstance, selectorString) {
          viewInstance.$el.find(selectorString).attr("tabindex", "0").attr(
              "data-cstabindex", "0");
        }
      };
      if (extraTabs) {
        extraTabs = _.flatten(extraTabs, true);
        _.each(extraTabs, function (tab) {
          var str = "esoc-user-profile-" + tab.tabName + "-tab";
          UserProfile.userProfileTabViewMapping[str] = tab.tabContentView;
        });
      }
      return UserProfile;
    });
