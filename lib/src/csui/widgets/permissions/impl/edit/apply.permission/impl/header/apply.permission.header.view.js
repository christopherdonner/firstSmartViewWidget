/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'hbs!csui/widgets/permissions/impl/edit/apply.permission/impl/header/apply.permission.header',
  'i18n!csui/widgets/permissions/impl/edit/apply.permission/impl/nls/lang',
  'css!csui/widgets/permissions/impl/permissions'
], function (_,
    $,
    Marionette,
    applyPermissionHeaderTemplate,
    lang) {
  "use strict";

  var ApplyPermissionHeaderView = Marionette.ItemView.extend({

    template: applyPermissionHeaderTemplate,

    templateHelpers: function () {
      var headerTitle = "";
      if (this.options.removePermission) {
        var memberName = this.options.permissionModel &&
                         this.options.permissionModel.get("right_id_expand") &&
                         this.options.permissionModel.get("right_id_expand").name_formatted;
        memberName = this.options.permissionModel &&
                     this.options.permissionModel.get("type") === "public" ? lang.publicAccess :
                     memberName;
        headerTitle = _.str.sformat(lang.removePermissionHeaderTitle, memberName);
      } else if (this.options.restorePublicAccess) {
        headerTitle = lang.restorePublicAccessHeaderTitle;
      } else {
        headerTitle = lang.applyPermissionHeaderTitle;
      }
      return {
        title: headerTitle
      };
    },

    constructor: function ApplyPermissionHeaderView(options) {
      options || (options = {});
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    }
  });

  return ApplyPermissionHeaderView;
});