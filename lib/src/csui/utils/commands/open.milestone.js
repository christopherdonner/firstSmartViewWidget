/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/utils/commandhelper', 'csui/utils/commands/open.classic.page'
], function (CommandHelper, OpenClassicPageCommand) {

  var OpenMilestoneCommand = OpenClassicPageCommand.extend({

    defaults: {
      signature: 'OpenMilestone'
    },

    enabled: function (status) {
      var node = CommandHelper.getJustOneNode(status);
      return node && node.get('type') === 212;
    },

    getUrlQueryParameters: function (node, options) {
      return {
        func: 'll',
        objAction: 'BrowseMilestone',
        objId: node.get('id'),
        nexturl: location.href
      };
    }

  });

  return OpenMilestoneCommand;

});
