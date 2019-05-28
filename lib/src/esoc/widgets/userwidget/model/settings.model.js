/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/backbone',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/utils/url',
  'esoc/widgets/userwidget/util'
], function (Backbone, $, _, Url, Util) {
  var SettingsModel = Backbone.Model.extend({
    connector: "",
    restUrl: "",
    constructor: function SettingsModel(options) {
      this.options = options;
      this.restUrl = Url.combine(Util.commonUtil.getV2Url(options.connector.connection.url),
          Util.commonUtil.REST_URLS.pulseRestUrl,
          options.userWidgetView.model.attributes.userid);
      this.restUrl = Util.commonUtil.updateQueryStringValues(this.restUrl,
          Util.commonUtil.globalConstants.FIELDS, Util.commonUtil.globalConstants.SETTINGS);
      Backbone.Model.prototype.constructor.apply(this, arguments);
      if (options && options.connector) {
        options.connector.assignTo(this);
      }
    },
    url: function () {
      return this.restUrl;
    },
    fetch: function () {
      Backbone.Model.prototype.fetch.apply(this, arguments);
    },
    parse: function (data, options) {
      var results                 = data.results,
          possibleOptions         = Util.commonUtil.globalConstants.USER_PRIVACY_SETTINGS,
          possibleValues          = ["PrivacyEveryOne", "PrivacyFollow", "PrivacyNone"],
          contentPrivacyCurrValue = possibleValues[$.inArray(results.settings.contentPrivacy,
              possibleOptions)],
          statusPrivacyCurrValue  = possibleValues[$.inArray(results.settings.statusPrivacy,
              possibleOptions)];

      results.settings["content" + contentPrivacyCurrValue] = "on";
      results.settings["status" + statusPrivacyCurrValue] = "on";
      return results;
    }
  });
  return SettingsModel;
});
