/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/models/command',
  'csui/utils/commands/multiple.items'
], function (_, CommandModel, MultipleItemsCommand) {

  var NodeCommand = CommandModel.extend({

    _performAction: function (node, options) {
      throw new Error('Method not implemented in the descendant command.');
    }

  });

  _.extend(NodeCommand.prototype, MultipleItemsCommand);

  return NodeCommand;

});
