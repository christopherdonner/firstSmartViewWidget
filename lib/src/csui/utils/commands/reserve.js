/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  "require", "module", "csui/lib/underscore", "csui/lib/jquery",
  'i18n!csui/utils/commands/nls/lang',
  "i18n!csui/utils/commands/nls/localized.strings",
  "csui/utils/commandhelper", "csui/utils/commands/node"
], function (require, module, _, $,  publicLang, lang, CommandHelper, NodeCommand) {
  'use strict';

  var config = module.config();
  _.defaults(config, {
    parallelism: 2
  });

  var ReserveCommand = NodeCommand.extend({
    defaults: {
      signature: "ReserveDoc",
      command_key: ['reserve', 'ReserveDoc'],
      name: publicLang.CommandNameReserve,
      verb: lang.CommandVerbReserve,
      pageLeavingWarning: lang.ReservePageLeavingWarning,
      scope: "multiple",
      successMessages: {
        formatForNone: publicLang.ReserveItemsNoneMessage,
        formatForOne: publicLang.ReserveOneItemSuccessMessage,
        formatForTwo: publicLang.ReserveSomeItemsSuccessMessage,
        formatForFive: publicLang.ReserveManyItemsSuccessMessage
      },
      errorMessages: {
        formatForNone: publicLang.ReserveItemsNoneMessage,
        formatForOne: publicLang.ReserveOneItemFailMessage,
        formatForTwo: publicLang.ReserveSomeItemsFailMessage,
        formatForFive: publicLang.ReserveManyItemsFailMessage
      }
    },

    _performAction: function (node, options) {
      var deferred = $.Deferred();
      node.isReservedClicked = true;
      require([
        'csui/utils/contexts/factories/user'
      ], function (UserModelFactory) {
        var user = options.context.getModel(UserModelFactory);
        user.ensureFetched()
            .then(function () {
              return CommandHelper.updateNode(node, {
                reserved_user_id: user.get('id')
              });
            })
            .then(deferred.resolve, deferred.reject);
        }, deferred.reject);
      return deferred.promise();
    }
  });

  return ReserveCommand;
});
