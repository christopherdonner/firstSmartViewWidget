csui.define(['csui/utils/commandhelper', 'csui/utils/commands/open.classic.page'
], function (CommandHelper, OpenClassicPageCommand) {

  var OpenROICommand = OpenClassicPageCommand.extend({

    defaults: {
      signature: 'OpenROI'
    },

    enabled: function (status) {
      var node = CommandHelper.getJustOneNode(status);
      return node && node.get('type') === 952;
    },

    getUrlQueryParameters: function (node, options) {
      return {
        func: 'll',
        objAction: 'info',
        objId: node.get('id'),
        nexturl: location.href
      };
    }

  });

  return OpenROICommand;

});
