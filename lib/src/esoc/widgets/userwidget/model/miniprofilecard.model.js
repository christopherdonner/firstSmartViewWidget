/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/backbone',
  'esoc/widgets/userwidget/util'
], function (Backbone, Util) {
  var MiniProfileCardModel = Backbone.Model.extend({
    defaults: {
      userid: "",
      display_name: "",
      business_email: "",
      title: "",
      className: "esoc-miniprofile-view",
      otherUser: "",
      following: "",
      otherUserProfile: ""
    },
    constructor: function MiniProfileCardModel(options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
    },
    parse: function (data, options) {
      data.user.business_email = data.user.email;
      data.user.id = parseInt(data.user.id, 10);
      data.user.display_name = data.user.name;
      return data.user;
    }
  });
  return MiniProfileCardModel;
})
;
