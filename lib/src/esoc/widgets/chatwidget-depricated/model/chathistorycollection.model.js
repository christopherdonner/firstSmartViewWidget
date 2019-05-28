/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  "csui/lib/jquery",
  "csui/lib/backbone",
  "csui/lib/underscore",
  "csui/lib/moment",
  "esoc/widgets/chatwidget/model/chathistory.model",
  "esoc/widgets/common/util"
], function ($, Backbone, _, Moment, ChatModel, CommonUtil) {

  var ChatHistoryCollection = Backbone.Collection.extend({
    model: ChatModel,
    MomentJS: Moment,
    commonUtil: CommonUtil,
    getChatHistoryRESTUrl: "",
    constructor: function ChatHistoryCollection(options) {
      this.getChatHistoryRESTUrl = options.connector.connection.url;
      this.getChatHistoryRESTUrl += this.commonUtil.REST_URLS.chatHistoryUrl;
      this.getChatHistoryRESTUrl += options.userid;
      if (options && options.connector) {
        options.connector.assignTo(this);
      }
      Backbone.Collection.prototype.constructor.apply(this, arguments);
    },
    url: function () {
      return this.getChatHistoryRESTUrl;
    },
    initialize: function () {
    },
    fetch: function (options) {
      Backbone.Collection.prototype.fetch.apply(this, arguments);
    },
    parse: function (response) {
      var returnData = JSON.parse(JSON.stringify(response.data));
      return returnData;
    }
  });
  return ChatHistoryCollection;
});
