/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/utils/commands/open.plugins/impl/brava.plugin',
  'csui/utils/commands/open.plugins/impl/csv.plugin',
  'csui/utils/commands/open.plugins/impl/browser.plugin'
], function (BravaPlugin, CSViewerPlugin, BrowserPlugin) {
  'use strict';

  return [
    {
      sequence: 200,
      plugin: BravaPlugin,
      decides: BravaPlugin.isSupported
    },
    {
      sequence: 400,
      plugin: CSViewerPlugin,
      decides: CSViewerPlugin.isSupported
    },
    {
      sequence: 600,
      plugin: BrowserPlugin,
      decides: BrowserPlugin.isSupported
    }
  ];
});
