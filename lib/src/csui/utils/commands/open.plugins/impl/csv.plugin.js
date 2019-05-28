/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/models/version'
], function (_, $, VersionModel) {
  'use strict';

  var config = window.csui.requirejs.s.contexts._.config
                   .config['csui/utils/commands/open'] || {};

  config = _.extend({
    CSViewerIsAvailable: false,
    CSViewerSupportedMimeTypes: [],
    csViewerView: 'csv/widgets/csviewer/csviewer.view'
  }, config);

  config.CSViewerSupportedMimeTypes = _.invoke(
      config.CSViewerSupportedMimeTypes, 'toLowerCase');

  function ContentSuiteViewerPlugin() {
  }

  ContentSuiteViewerPlugin.prototype.widgetView = config.csViewerView;

  ContentSuiteViewerPlugin.prototype.getUrlQuery = function (node) {
    var query = {
      func: 'doc.ViewDoc',
      nodeid: node.get('id')
    };
    if (node instanceof VersionModel) {
      query.vernum = node.get('version_number');
    }
    return $.Deferred()
            .resolve(query)
            .promise();
  };

  ContentSuiteViewerPlugin.prototype.needsAuthentication = function (node) {
    return true;
  };

  ContentSuiteViewerPlugin.isSupported = function (node) {
    var mimeType = node.get('mime_type');
    return mimeType && config.CSViewerIsAvailable &&
           config.CSViewerSupportedMimeTypes.indexOf(mimeType.toLowerCase()) >= 0;
  };

  return ContentSuiteViewerPlugin;
});
