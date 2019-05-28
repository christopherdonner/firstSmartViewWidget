/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/utils/commands/open.classic.page',
  'csui/utils/commandhelper',
  'csui/utils/classic.nodes/classic.nodes'
], function (OpenClassicPageCommand, CommandHelper, classicNodes) {
  'use strict';

  var OpenSpecificClassicPageCommand = OpenClassicPageCommand.extend({
    defaults: {
      signature: 'OpenSpecificClassicPage'
    },

    enabled: function (status) {
      var node = CommandHelper.getJustOneNode(status);
      if (node) {
        return classicNodes.isSupported(node);
      }
    },

    getUrl: function (node, options) {
      return classicNodes.getUrl(node);
    }
  });

  return OpenSpecificClassicPageCommand;
});
