/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'require', 'csui/lib/jquery', 'csui/models/command', 'csui/utils/base',
  'i18n!csui/utils/commands/nls/localized.strings'
], function (require, $, CommandModel, base, lang) {
  'use strict';

  var UserProfileCommand = CommandModel.extend({

    defaults: {
      signature: 'UserProfile',
      name: lang.UserProfileCommandName
    },

    enabled: function (status, options) {
      var toolItem = status.toolItem || options && options.toolItem;
      if (toolItem) {
        var context = status.context || options && options.context,
            user = context.getModel('user'),
            name = base.formatMemberName(user);
        toolItem.set('name', name);
      }
      return true;
    },

    execute: function (status, options) {
      var deferred = $.Deferred(),
          context = status.context || options && options.context;
      require([
        'csui/utils/contexts/factories/user',
        'esoc/controls/userwidget/userwidget.view'
      ], function (UserModelFactory, UserWidgetView) {
        var user = context.getModel(UserModelFactory),
            userId = user.get('id'),
            userWidgetView = new UserWidgetView({
              model: user,
              connector: user.connector,
              userid: userId,
              context: context,
              baseElement: undefined,
              showUserProfileLink: true,
              showMiniProfile: false,
              loggedUserId: userId
            });
        userWidgetView.showUserProfileDialog();
        deferred.resolve();
      }, deferred.reject);
      return deferred.promise();
    }

  });

  return UserProfileCommand;

});
