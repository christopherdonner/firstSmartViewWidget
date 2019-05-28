csui.define([
  'csui/lib/backbone',
  'csui/utils/url',
  'esoc/widgets/common/util'
], function (Backbone, Url, CommonUtil) {
  var CommentDialogModel = Backbone.Model.extend({
    defaults: {
      attachementsEnabled: true,
      chatEnabled: true,
      commentingOpen: true,
      commentsEnabled: true,
      likesEnabled: true,
      taggingEnabled: true,
      threadingEnabled: true,
      csid: "",
      commentCount: 0
    },
    connector: "",
    commonUtil: CommonUtil,
    constructor: function CommentDialogModel(attributes, options) {
      this.defaults.csid = options.nodeid;
      this.options = options || {};
      Backbone.Model.prototype.constructor.apply(this, arguments);

      if (options && options.connector) {
        options.connector.assignTo(this);
      }
    },
    url: function () {
      var restUrl = Url.combine(this.connector.connection.url, this.commonUtil.REST_URLS.csGetROI);
      restUrl += "csid=" + this.options.csid + "&includes=comment_count";
      return restUrl;
    },
    parse: function (response) {
      var responseData = JSON.parse(JSON.stringify(response.available_settings)),
          data         = {
            socialactions: responseData
          };
      data.id = responseData.CSID;
      data.showSocialActions = responseData.pulseEnabled;
      data.wnd_comments = responseData.commentCount;
      data.wnd_comments_validated = responseData.commentCount > 0 ?
                                    responseData.commentCount > 99 ? '99+' :
                                    responseData.commentCount : '';
      return data;
    }
  });
  return CommentDialogModel;
});
