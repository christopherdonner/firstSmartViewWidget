/**
 *  This is to show user's settings information
 */
csui.define([
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/handlebars',
  'csui/lib/marionette',
  'csui/utils/url',
  'hbs!esoc/widgets/userwidget/impl/settings',
  'i18n!esoc/widgets/userwidget/nls/lang',
  'esoc/widgets/userwidget/model/settings.model',
  'esoc/widgets/userwidget/util',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior'
], function ($, _, Handlebars, Marionette, Url, SettingsTemplate, Lang, SettingsModel, Util,
    PerfectScrollingBehavior) {
  var self = null;
  var SettingsView = Marionette.ItemView.extend({
    tagName: "div",
    className: 'esoc-settings-tab',
    template: SettingsTemplate,
    util: Util,
    templateHelpers: function () {
      return {
        messages: {
          notification: Lang.notification,
          notifyMentions: Lang.notifyMentions,
          notifyNewFollower: Lang.notifyNewFollower,
          notifyCommentsMyPosts: Lang.notifyCommentsMyPosts,
          notifyCommentsMyThreads: Lang.notifyCommentsMyThreads,
          notifyPrivateMessages: Lang.notifyPrivateMessages,
          privacySettings: Lang.privacySettings,
          privacySettingsForStatusMessages: Lang.privacySettingsForStatusMessages,
          notifyMyUpdatesTo: Lang.notifyMyUpdatesTo,
          privacyEveryOne: Lang.privacyEveryOne,
          privacyFollow: Lang.privacyFollow,
          privacyNone: Lang.privacyNone,
          EVERYONE: Util.commonUtil.globalConstants.USER_PRIVACY_SETTINGS[0],
          FOLLOW: Util.commonUtil.globalConstants.USER_PRIVACY_SETTINGS[1],
          NONE: Util.commonUtil.globalConstants.USER_PRIVACY_SETTINGS[2],
          CONTENT_PRIVACY: Util.commonUtil.globalConstants.CONTENT_PRIVACY,
          STATUS_PRIVACY: Util.commonUtil.globalConstants.STATUS_PRIVACY
        }
      };
    },
    events: {
      "click .esoc_setting_edit_field ": "updateSetting"
    },
    behaviors: {
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        suppressScrollX: true,
        contentParent: ".esoc-settings-tab-content",
        scrollYMarginOffset: 15 // like bottom padding of container, otherwise scrollbar is shown always
      }
    },
    initialize: function (options) {
      this.options = options;
      this.editSettingUrl = Url.combine(
          this.util.commonUtil.getV2Url(this.options.connector.connection.url),
          this.util.commonUtil.REST_URLS.pulseRestUrl, this.model.attributes.userid);
    },
    constructor: function SettingsView(options) {
      options = options || {};
      var settingsOptions = _.extend({}, options);
      settingsOptions.model = new SettingsModel(settingsOptions);
      settingsOptions.model.fetch({async: false});
      Marionette.ItemView.prototype.constructor.call(this, settingsOptions);
    },
    onDomRefresh: function () {
      this.trigger("view:shown", this);
    },
    errorHandle: function (model, response) {
    },
    updateSetting: function (e) {
      var setting      = $(e.target).val(),
          setting_type = $(e.target).attr("name"),
          formData     = new FormData();
      formData.append(this.util.commonUtil.globalConstants.ACTION,
          this.util.commonUtil.globalConstants.UPDATE_SETTINGS_ACTION);
      if (setting_type === this.util.commonUtil.globalConstants.CONTENT_PRIVACY ||
          setting_type === this.util.commonUtil.globalConstants.STATUS_PRIVACY) {
        formData.append(setting_type, setting);
      } else {
        $(e.target).is(":checked") ? formData.append(setting, "on") :
        formData.append(setting, "off");
      }
      var args = {
        "itemview": this,
        "url": this.editSettingUrl,
        "type": "POST",
        "data": formData,
        "requestType": "updateSettings",
        "targetElement": $(e.target)
      };
      this.util.updateAjaxCall(args);
      $(e.target).prop('disabled', true);
      this.util.commonUtil.updateSelection(e, this, setting_type);
    }
  });
  return SettingsView;
});
