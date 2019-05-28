/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/utils/commands/download', 'csui/utils/url',
  'i18n!csui/utils/commands/nls/localized.strings'
], function (DownloadCommand, Url, lang) {
  'use strict';

  var VersionDownloadCommand = DownloadCommand.extend({

    defaults: {
      signature: 'VersionDownload',
      command_key: ['versions_download'],
      name: lang.CommandNameDownload,
      verb: lang.CommandVerbDownload,
      doneVerb: lang.CommandDoneVerbDownload,
      scope: 'single'
    },

    _getContentUrl: function (node, options, action, token) {
      var url = Url.combine(node.connector.connection.url, "nodes",
          node.get('id'), "versions", node.get('version_number'), "content");
      return url + "?action=" + action + "&token=" + encodeURIComponent(token);
    }

  });

  return VersionDownloadCommand;

});
