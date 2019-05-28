/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'require', 'csui/lib/jquery', 'csui/lib/underscore',
  'csui/models/command', 'csui/utils/node.links/node.links',
  'i18n!csui/integration/folderbrowser/commands/nls/localized.strings'
], function (module, require, $, _, CommandModel, nodeLinks, lang) {
  'use strict';

  var OpenFullPageWorkpsace = CommandModel.extend({
    defaults: {
      signature: 'Page',
      name: lang.OpenFullPageContainer
    },

    enabled: function (status, options) {
      var config = _.extend({
        enabled: false
      }, module.config());
      return config.enabled && !!status.container;
    },

    execute: function (status, options) {
      window.open(nodeLinks.getUrl(status.container));
      return $.Deferred().resolve().promise();
    }
  });

  return OpenFullPageWorkpsace;
});
