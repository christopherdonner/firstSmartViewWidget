/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery',
  'csui/utils/url', 'csui/utils/base',
  'csui/utils/command.error', 'csui/models/version',
  'json!csui/utils/commands/open.types.json', 'csui/utils/content.helper'
], function (_, $, Url, base, CommandError, VersionModel, openMimeTypes,
    contentHelper) {
  'use strict';

  var config = window.csui.requirejs.s.contexts._.config
                   .config['csui/utils/commands/open'] || {},
      mimeTypesFromPlugins = _.chain(navigator.plugins || [])
                              .map(function (plugin) {
                                return _.chain(plugin)
                                        .map(function (mimeType) {
                                          return mimeType.type;
                                        })
                                        .value();
                              })
                              .flatten()
                              .compact()
                              .invoke('toLowerCase')
                              .value();

  config = _.extend({
    mimeTypesForOpen: openMimeTypes.mimeTypesForOpen,
    officeMimeTypes: openMimeTypes.officeMimeTypes,
    forceDownloadForMimeTypes: [],
    useContentPage: false
  }, config);

  config.mimeTypesForOpen = _.invoke(config.mimeTypesForOpen, 'toLowerCase');
  config.officeMimeTypes = _.invoke(config.officeMimeTypes, 'toLowerCase');
  config.forceDownloadForMimeTypes = _.invoke(
      config.forceDownloadForMimeTypes, 'toLowerCase');
  config.mimeTypesForOpen = _.chain(config.mimeTypesForOpen)
                             .concat(mimeTypesFromPlugins)
                             .unique()
                             .invoke('toLowerCase')
                             .value();

  function BrowserPlugin() {
  }

  BrowserPlugin.prototype.getUrl = function (node) {
    return config.useContentPage ? getPageUrl(node) : getRestApiUrl(node);
  };

  BrowserPlugin.isSupported = function (node) {
    var mimeType = node.get('mime_type');
    if (mimeType) {
      mimeType = mimeType.toLowerCase();
      return base.isAppleMobile() ||
             config.mimeTypesForOpen.indexOf(mimeType) >= 0 &&
             config.forceDownloadForMimeTypes.indexOf(mimeType) < 0;
    }
  };

  BrowserPlugin.prototype.needsAuthentication = function (node) {
    return config.useContentPage;
  };

  function getPageUrl(node) {
    var contentUrl = contentHelper.getContentPageUrl(node);
    return $.Deferred().resolve(contentUrl).promise();
  }

  function getRestApiUrl(node) {
    return node.connector.requestContentAuthToken(node)
               .then(function (data) {
                 var url = Url.combine(
                     new Url(node.connector.connection.url).getApiBase(),
                     'nodes', node.get('id'));
                 if (node instanceof VersionModel) {
                   url = Url.combine(url, 'versions',
                       node.get('version_number'), 'content');
                 } else if (node.get('version_number')) {
                   url = Url.combine(url, 'versions',
                       node.get('version_number'), 'content');
                 } else {
                   url = Url.combine(url, 'content');
                 }
                 var mimeType = (node.get('mime_type') || '').toLowerCase(),
                     action = !base.isAppleMobile() &&
                              config.officeMimeTypes.indexOf(mimeType) >= 0 ?
                              'download' : 'open',
                     query = Url.combineQueryString({
                       action: action,
                       token: data.token
                     });
                 return Url.appendQuery(url, query);
               }, function (error) {
                 return $.Deferred()
                         .reject(new CommandError(error))
                         .promise();
               });
  }

    return BrowserPlugin;
});
