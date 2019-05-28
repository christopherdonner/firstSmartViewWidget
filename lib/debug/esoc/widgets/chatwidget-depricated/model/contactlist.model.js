csui.define([
  "csui/lib/jquery",
  "csui/lib/backbone",
  "csui/lib/underscore",
  "csui/lib/moment",
  "esoc/widgets/chatwidget/model/contact.model",
  "esoc/widgets/common/util"
], function ($, Backbone, _, Moment, ContactModel, CommonUtil) {

  var ContactListModel = Backbone.Collection.extend({
    defaults: {},
    model: ContactModel,
    MomentJS: Moment,
    commonUtil: CommonUtil,
    getMembersRESTUrl: "",
    constructor: function ContactListModel(options) {
      // Enable this model for communication with the CS REST API
      this.getMembersRESTUrl = options.connector.connection.url;
      this.getMembersRESTUrl += this.commonUtil.REST_URLS.membersRESTUrl;
      if (options && options.connector) {
        options.connector.assignTo(this);
      }
      Backbone.Collection.prototype.constructor.apply(this, arguments);
    },
    url: function () {
      return this.getMembersRESTUrl;
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
  return ContactListModel;
});
