/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/utils/commandhelper', 'csui/utils/commands/open.classic.page'
], function (CommandHelper, OpenClassicPageCommand) {

  var OpenDiscussionCommand = OpenClassicPageCommand.extend({

    defaults: {
      signature: 'OpenDiscussion'
    },

    enabled: function (status) {
      var node = CommandHelper.getJustOneNode(status);
      return node && node.get('type') === 215;
    },

    getUrlQueryParameters: function (node, options) {
      return {
        func: 'll',
        objAction: 'view',
        objId: node.get('id'),
        nexturl: location.href
      };
    }

  });

  return OpenDiscussionCommand;

});
