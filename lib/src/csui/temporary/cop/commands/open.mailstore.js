/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/utils/commandhelper',
  'csui/utils/commands/open.classic.page'
], function (CommandHelper, OpenClassicPageCommand) {
  'use strict';

  var OpenMailStoreCommand = OpenClassicPageCommand.extend({

    defaults: {
      signature: 'OpenMailStore'
    },

    enabled: function (status) {
      var node = CommandHelper.getJustOneNode(status),
          type = node && node.get('type');
      return type === 3030331;
    },

    getUrlQueryParameters: function (node, options) {
      var mailStore = node.get('type') === 3030331;
      if (mailStore) {
        return {
          func: 'll',
          objAction: 'browse',
          objId: node.get('id'),
          viewType: 1,
          nexturl: location.href
        };
      }
    }
  });

  return OpenMailStoreCommand;

});

