/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/utils/commandhelper',
  'csui/utils/commands/open.classic.page'
], function (CommandHelper, OpenClassicPageCommand) {

  var OpenChannelCommand = OpenClassicPageCommand.extend({

    defaults: {
      signature: 'OpenChannel'
    },

    enabled: function (status) {
      var node = CommandHelper.getJustOneNode(status);
      return node && node.get('type') === 207;
    },

    getUrlQueryParameters: function (node, options) {
      return {
        func: 'll',
        objAction: 'ViewChannel',
        objId: node.get('id'),
        nexturl: location.href
      };
    }

  });

  return OpenChannelCommand;

});

