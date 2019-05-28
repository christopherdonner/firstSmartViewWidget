/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["module", "csui/lib/underscore", "csui/utils/log",
  "csui/utils/base", "csui/utils/commandhelper", "csui/models/command"
], function (module, _, log, base, CommandHelper, CommandModel) {

  var TimelineCommand = CommandModel.extend({

    defaults: {
      signature: "Timeline"
    },

    enabled: function (status) {
      if (status) {
        return status.nodes !== undefined;
      } else {
        return false;
      }
    },

    execute: function (status, options) {
      throw new Error("The \"Timeline\" action must be handled by the caller.");
    }

  });

  _.extend(TimelineCommand, {

    version: "1.0"

  });

  return TimelineCommand;

});
