/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/utils/commandhelper', 'csui/utils/commands/open.classic.page'
], function (CommandHelper, OpenClassicPageCommand) {

  var OpenFormCommand = OpenClassicPageCommand.extend({

    defaults: {
      signature: 'OpenForm'
    },

    enabled: function (status) {
      var node = CommandHelper.getJustOneNode(status);
      return node && node.get('type') === 223;
    },

    getUrlQueryParameters: function (node, options) {
      return {
        func: 'll',
        objAction: 'EditForm',
        objId: node.get('id'),
        nexturl: location.href
      };
    }

  });

  return OpenFormCommand;

});
