/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery.parse.param', 'csui/utils/commandhelper',
  'csui/utils/url', 'csui/utils/commands/open.classic.page',
  'i18n!csui/utils/commands/nls/localized.strings'
], function (parseParam, CommandHelper, Url, OpenClassicPageCommand, lang) {
  'use strict';

  var EditCommand = OpenClassicPageCommand.extend({

    defaults: {
      signature: 'Edit',
      command_key: 'edit',
      scope: 'single'
    },

    shouldCloseTabAfterRedirect: true,

    getUrl: function (node, options) {
      var signature = this.get("command_key"),
          action = this._getNodeActionForSignature(node, signature),
          url, connection;
      if (action) {
        url = action.get('href');
        if (url) {
          if (!new Url(url).isAbsolute()) {
            connection = (node.connector || options.connector).connection;
            if (url[0] !== '/') {
              url = Url.appendQuery(new Url(connection.url).getCgiScript(), url);
            } else {
              url = Url.combine(new Url(connection.url).getOrigin(), url);
            }
          }
          return url;
        }
      }
      throw new Error(lang.NoEditUrl);
    }

  });

  return EditCommand;

});
