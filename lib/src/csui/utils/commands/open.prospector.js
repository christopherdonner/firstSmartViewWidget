/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/utils/commandhelper', 'csui/utils/commands/open.classic.page'
], function (CommandHelper, OpenClassicPageCommand) {

  var OpenProspectorCommand = OpenClassicPageCommand.extend({

    defaults: {
      signature: 'OpenProspector'
    },

    enabled: function (status) {
      var node = CommandHelper.getJustOneNode(status);
      return node && node.get('type') === 384;
    },

    getUrlQueryParameters: function (node, options) {
      return {
        func: 'll',
        objAction: 'ProspectorBrowse',
        objId: node.get('id'),
        order: '-SCORE',
        summaries: 1,
        nexturl: location.href
      };
    }

  });

  return OpenProspectorCommand;

});
