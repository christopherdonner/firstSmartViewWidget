/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/utils/commandhelper', 'csui/utils/commands/open.classic.page'
], function (CommandHelper, OpenClassicPageCommand) {

  var RunLiveReportCommand = OpenClassicPageCommand.extend({

    defaults: {
      signature: 'RunLiveReport'
    },

    enabled: function (status) {
      var node = CommandHelper.getJustOneNode(status);
      return node && node.get('type') === 299;
    },

    getUrlQueryParameters: function (node, options) {
      return {
        func: 'll',
        objAction: 'RunReport',
        objId: node.get('id'),
        nexturl: location.href
      };
    }

  });

  return RunLiveReportCommand;

});
