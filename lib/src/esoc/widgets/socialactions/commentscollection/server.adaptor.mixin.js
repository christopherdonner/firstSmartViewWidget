/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  "csui/lib/jquery",
  "csui/lib/backbone",
  "csui/lib/underscore",
  'csui/utils/url',
  "csui/utils/base",
  'csui/behaviors/default.action/impl/defaultaction'
], function ($, Backbone, _, Url, Base, DefaultActionController) {
  'use strict';

  var ServerAdaptorMixin = {
    mixin: function (prototype) {
      return _.extend(prototype, {
        makeServerAdaptor: function (options) {
          return this;
        },
        base: Base,
        url: function () {
          return this.getCommentsRESTUrl;
        },
        fetch: function (options) {
          options.params = $.extend(this.defaults.params, options.params);
          var defaultActionController = new DefaultActionController(),
              commands                = {
                commands: defaultActionController.actionItems.getAllCommandSignatures(
                    defaultActionController.commands)
              };
          this.getCommentsRESTUrl = Url.appendQuery(this.defaults.csRESTUrl,
              Url.combineQueryString($.param(options.params), commands));
          Backbone.Collection.prototype.fetch.apply(this, arguments);
        },
        parse: function (response) {
          this.util.commonUtil.globalConstants.MAX_CHAR_LIMIT = (this.maxMessageLength !== undefined &&
                                                                 parseInt(this.maxMessageLength, 10) >
                                                                 0) ?
                                                                parseInt(this.maxMessageLength, 10) :
                                                                (response.config_settings.maxMessageLength ?
                                                                 response.config_settings.maxMessageLength :
                                                                 this.commonUtil.globalConstants.MAX_CHAR_LIMIT);
          var returnData = JSON.parse(JSON.stringify(response.data));
          delete this.defaults.params[this.util.commonUtil.globalConstants.SINCE_ID];
          return this.parseCommentsCollectionResponse(returnData);
        },
        parseCommentsCollectionResponse: function (jsonResponse) {
          for (var response in jsonResponse) {
            var currentObj = jsonResponse[response];
            currentObj.text = $.trim(currentObj.text);
            currentObj.created_at_iso8601 = this.base.formatFriendlyDateTimeNow(
                currentObj.created_at_iso8601);
            if (currentObj.modified_at_iso8601 !== "" &&
                currentObj.modified_at_iso8601 !== undefined) {
              currentObj.modified_at_iso8601 = this.base.formatFriendlyDateTimeNow(
                  currentObj.modified_at_iso8601);
            }
          }
          return jsonResponse;
        },

        sync: function (method, model, options) {
          return Backbone.Collection.prototype.sync.apply(this, arguments);
        }

      });
    }

  };

  return ServerAdaptorMixin;
});
