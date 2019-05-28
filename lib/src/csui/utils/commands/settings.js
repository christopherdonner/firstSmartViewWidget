/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["module", "csui/lib/underscore", "csui/utils/log",
  "csui/utils/base", "csui/utils/commandhelper", "csui/models/command"
], function (module, _, log, base, CommandHelper, CommandModel) {

  var SettingsCommand = CommandModel.extend({

    defaults: {
      signature: "Settings"
    },

    enabled: function (status) {
      return true;
    },

    execute: function (status, options) {
      throw new Error("The \"Settings\" action must be handled by the caller.");
    }

  });

  _.extend(SettingsCommand, {

    version: "1.0"

  });

  return SettingsCommand;

});
