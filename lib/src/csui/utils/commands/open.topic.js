/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/utils/commandhelper', 'csui/utils/commands/open.classic.page'
], function (CommandHelper, OpenClassicPageCommand) {

  var OpenTopicCommand = OpenClassicPageCommand.extend({

    defaults: {
      signature: 'OpenTopic'
    },

    enabled: function (status) {
      var node = CommandHelper.getJustOneNode(status),
          type = node && node.get('type');
      return type === 130 || type === 134;
    },

    getUrlQueryParameters: function (node, options) {
      return {
        func: 'll',
        objAction: 'view',
        objId: node.get('id'),
        show: 1,
        nexturl: location.href
      };
    }

  });

  return OpenTopicCommand;

});
