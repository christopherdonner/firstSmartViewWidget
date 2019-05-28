/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/utils/commandhelper', 'csui/utils/commands/open.classic.page'
], function (CommandHelper, OpenClassicPageCommand) {

  var OpenPollCommand = OpenClassicPageCommand.extend({

    defaults: {
      signature: 'OpenPoll'
    },

    enabled: function (status) {
      var node = CommandHelper.getJustOneNode(status);
      return node && node.get('type') === 218;
    },

    getUrlQueryParameters: function (node, options) {
      return {
        func: 'll',
        objAction: 'OpenPoll',
        objId: node.get('id'),
        nexturl: location.href
      };
    }

  });

  return OpenPollCommand;

});
