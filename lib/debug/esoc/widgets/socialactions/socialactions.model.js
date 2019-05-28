csui.define([
  // MVC component support
  'csui/lib/backbone',
  // CS REST API URL parsing and combining
  'csui/utils/url',
  'csui/utils/namedsessionstorage',
  'esoc/widgets/common/util'
], function (Backbone, Url, NamedSessionStorage, CommonUtil) {

  var SocialActionsModel = Backbone.Model.extend({

    // Declare model properties with default values
    defaults: {
      attachementsEnabled: true,
      chatEnabled: true,
      commentingOpen: true,
      commentsEnabled: true,
      likesEnabled: true,
      taggingEnabled: true,
      threadingEnabled: true,
      csid: "",
      rockey: "",
      roid: ""
    },

    connector: "",
    commonUtil: CommonUtil,

    namedSessionStorage: new NamedSessionStorage(),

    // Constructor gives an explicit name to the object in the debugger
    constructor: function SocialActionsModel(attributes, options) {
      this.defaults.rockey = options.rockey;
      this.defaults.roid = options.roid;
      this.defaults.csid = options.csid;
      Backbone.Model.prototype.constructor.apply(this, arguments);

      // Enable this model for communication with the CS REST API
      if (options && options.connector) {
        options.connector.assignTo(this);
      }
    },

    // Computes the REST API URL using the connection options
    url: function () {
      var restUrl = Url.combine(this.connector.connection.url, this.commonUtil.REST_URLS.csGetROI);
      restUrl += "rockey=" + encodeURIComponent(this.attributes.rockey) + "&roid=" +
                 encodeURIComponent(this.attributes.roid);
      if (this.namedSessionStorage.get(this.attributes.rockey + this.attributes.roid) !==
          undefined) {
        restUrl += "&csid=" +
                   this.namedSessionStorage.get(this.attributes.rockey + this.attributes.roid);
      } else if (this.attributes.csid !== "" && this.attributes.csid.toString().length > 0) {
        restUrl += "&csid=" + this.attributes.csid;
      }
      return restUrl;
    },

    // Massage the server response, so that it looks like object attributes
    parse: function (response) {
      // All attributes are placed below the `data` key
      var responseData = JSON.parse(JSON.stringify(response.available_settings));
      if (this.attributes.rockey + this.attributes.roid !== "" &&
          this.attributes.rockey + this.attributes.roid.toString().length > 0) {
        this.namedSessionStorage.set(this.attributes.rockey + this.attributes.roid,
            responseData.CSID);
      }
      var data = {socialactions: responseData};
      return data;
    }

  });

  return SocialActionsModel;

});
