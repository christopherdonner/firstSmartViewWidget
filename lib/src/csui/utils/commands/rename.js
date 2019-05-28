/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/models/command', 'csui/utils/commandhelper'
], function (CommandModel, CommandHelper) {

  var RenameCommand = CommandModel.extend({

    defaults: {
      signature: 'Rename',
      command_key: ['rename', 'Rename'],
      scope: "single"
    },
    rename: function (node, name) {
      return node
          .save({name: name}, {
            wait: true,
            patch: true
          });
    },

    execute: function (status, options) {
      throw new Error('The \'Rename\' action must be handled by the caller.');
    }

  });

  return RenameCommand;

});
