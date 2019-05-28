/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/utils/commands/open.node.perspective',
  'csui/utils/commandhelper',
  'csui/utils/smart.nodes/smart.nodes'
], function (OpenNodePerspectiveCommand, CommandHelper, smartNodes) {
  'use strict';

  var OpenSpecificNodePerspectiveCommand = OpenNodePerspectiveCommand.extend({
    defaults: {
      signature: 'OpenSpecificNodePerspective'
    },

    enabled: function (status) {
      var node = CommandHelper.getJustOneNode(status);
      if (node) {
        return smartNodes.isSupported(node);
      }
    }
  });

  return OpenSpecificNodePerspectiveCommand;
});
