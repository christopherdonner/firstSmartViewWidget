/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'require', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/models/command','csui/utils/commandhelper',
  'i18n!csui/utils/commands/nls/localized.strings'
], function (module, require, _, $, CommandModel,
    CommandHelper, lang) {
  'use strict';

  var config = _.extend({}, module.config());

  var ApplyPermissionCommand = CommandModel.extend({
    defaults: {
      signature: 'ApplyPermission'
    },

    enabled: function (status) {
      var node = CommandHelper.getJustOneNode(status);
      return false;
    },

    execute: function (status, options) {
      var deferred = $.Deferred();
      require([
        'csui/controls/globalmessage/globalmessage'
      ], function (GlobalMessage) {
        if (true) {
          deferred.resolve();
          GlobalMessage.showMessage('success', "Applied permissions to sub-items");
        } else {
          deferred.reject();
          GlobalMessage.showMessage('error', "Failed to apply permissions to sub-items");
        }
      }, deferred.reject);
      return deferred.promise();
    }
  });

  return ApplyPermissionCommand;
});
