/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/utils/commands/open','csui/utils/url'], function (OpenCommand, Url) {
  'use strict';
  var VersionOpenCommand = OpenCommand.extend({
    defaults: {
      signature: 'VersionOpen',
      command_key: ['versions_open'],
      scope: 'single'
    },

    _getContentUrl: function (node, options, action, token) {
      var url = Url.combine(node.connector.connection.url, "nodes",
          node.get('id'), "versions", node.get('version_number'), "content");
      return url + "?action=" + action + "&token=" + encodeURIComponent(token);
    }
  });

  return VersionOpenCommand;
});
