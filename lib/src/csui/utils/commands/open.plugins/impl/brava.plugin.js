/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/models/version'
], function (_, $, VersionModel) {
  'use strict';

  var config = window.csui.requirejs.s.contexts._.config
                   .config['csui/utils/commands/open'] || {};

  config = _.extend({
    isBravaViewerAvailable: false,
    supportedBravaViewerMimeTypes: [],
    bravaView: 'brava/widgets/bravaviewer/bravaviewer.view'
  }, config);

  config.supportedBravaViewerMimeTypes = _.invoke(
      config.supportedBravaViewerMimeTypes, 'toLowerCase');

  function BravaPlugin() {
  }

  BravaPlugin.prototype.widgetView = config.bravaView;

  BravaPlugin.prototype.getUrlQuery = function (node) {
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

  BravaPlugin.prototype.needsAuthentication = function (node) {
    return true;
  };

  BravaPlugin.isSupported = function (node) {
    var mimeType = node.get('mime_type');
    return mimeType && config.isBravaViewerAvailable &&
           config.supportedBravaViewerMimeTypes.indexOf(mimeType.toLowerCase()) >= 0;
  };

  return BravaPlugin;
});
