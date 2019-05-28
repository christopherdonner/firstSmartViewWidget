/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["module", "csui/lib/underscore", "csui/utils/log",
  "csui/utils/commandhelper", "csui/models/command"
], function (module, _, log, CommandHelper, CommandModel) {

  var OriginalCommand = CommandModel.extend({

    defaults: {
      signature: "Original"
    },

    execute: function (status, options) {
      throw new Error("The \"Original\" action must be handled by the caller.");
    }

  });

  _.extend(OriginalCommand, {

    version: "1.0"

  });

  return OriginalCommand;

});
