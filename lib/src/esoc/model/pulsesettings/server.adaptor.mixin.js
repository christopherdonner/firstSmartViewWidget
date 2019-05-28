/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/utils/url',
  'esoc/widgets/common/util'
], function (_, Url, CommonUtil) {
  'use strict';

  var ServerAdaptorMixin = {
    mixin: function (prototype) {
      return _.extend(prototype, {
        makeServerAdaptor: function (options) {
          return this;
        },

        url: function (options) {
          var restUrl = Url.combine(CommonUtil.getV2Url(this.connector.connection.url),
              CommonUtil.REST_URLS.pulseSettingsUrl);
          if (this.options.chat) {
            restUrl = CommonUtil.updateQueryStringValues(restUrl, CommonUtil.globalConstants.FIELDS,
                CommonUtil.globalConstants.CHAT_SEETINGS);
          }
          return restUrl;
        },

        parse: function (response) {
          this.options.fetched = false;
          return response.results;
        }
      });
    }

  };

  return ServerAdaptorMixin;
});
