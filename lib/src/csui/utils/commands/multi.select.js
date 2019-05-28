/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["csui/utils/commandhelper",
  "csui/utils/commands/node"
], function (CommandHelper, NodeCommand  ) {
  'use strict';

  var MultiSelect = NodeCommand.extend({

    defaults: {
      signature: "Select",
      command_key: ['select', 'Select']
    },

    enabled: function (status) {
      var node = CommandHelper.getJustOneNode(status);
      if (node && status.collection && status.collection.length > 0) {
        return true;
      }
    }

  });

  return MultiSelect;

});
