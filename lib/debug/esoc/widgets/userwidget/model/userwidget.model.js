csui.define([
  'csui/lib/backbone',
  'csui/utils/url',
  'csui/utils/namedsessionstorage',
  'esoc/widgets/common/util'
], function (Backbone, Url, NamedSessionStorage, CommonUtil) {
  var UserWidgetModel = Backbone.Model.extend({
    defaults: {
      userid: "",
      firstname: "",
      lastname: "",
      username: ""
    },
    connector: "",
    namedSessionStorage: new NamedSessionStorage(CommonUtil.globalConstants.ESOCIAL_USER_INFO),
    constructor: function UserWidgetModel(attributes, options) {
      if (attributes !== undefined) {
        this.attributes = attributes;
      }
      this.defaults.userid = options.userid;
      Backbone.Model.prototype.constructor.apply(this, arguments);
      if (options && options.connector) {
        options.connector.assignTo(this);
      }
    },
    url: function () {
      var restUrl = CommonUtil.updateQueryStringValues(Url.combine(this.connector.connection.url,
          "members" , this.attributes.userid ),CommonUtil.globalConstants.EXPAND,CommonUtil.globalConstants.MEMBER);
      return restUrl;
    },
    parse: function (response) {
      var user_info = {},
          resp      = response.data;
      user_info.display_name = resp.display_name;
      user_info.id = resp.id;
      user_info.department_name = resp.group_id ? resp.group_id["name"]: "";
      user_info.office_location = resp.office_location;
      user_info.business_email = resp.business_email;
      user_info.title = resp.title;
      user_info.business_fax = resp.business_fax;
      user_info.business_phone = resp.business_phone;
      user_info.time_zone = resp.time_zone;
      user_info.photo_url = resp.photo_url;
      user_info.deleted = resp.deleted;
      if (this.attributes.userid !== "") {
        this.namedSessionStorage.set(CommonUtil.globalConstants.USERDETAILS +
                                     this.attributes.userid, user_info);
      }
      return user_info;
    }
  });
  return UserWidgetModel;
});
