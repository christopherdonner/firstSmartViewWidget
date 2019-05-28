/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'require', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/utils/url', 'csui/utils/commandhelper', 'csui/utils/commands/download',
  'csui/utils/commands/open.plugins/open.plugins'
], function (module, require, _, $, Url, CommandHelper, DownloadCommand, openPlugins) {
  'use strict';

  var config = _.extend({
    openInNewTab: null,
    forceDownload: false
  }, module.config());

  var openAuthenticatedPage;

  var OpenCommand = DownloadCommand.extend({
    defaults: {
      signature: 'Open',
      command_key: ['default', 'open', 'download', 'Download'],
      scope: 'single'
    },

    enabled: function (status, options) {
      if (!DownloadCommand.__super__.enabled.apply(this, arguments)) {
        return false;
      }
      var node = CommandHelper.getJustOneNode(status);
      return _.contains([144, 749, 736], node.get('type'));
    },

    execute: function (status, options) {
      var node = CommandHelper.getJustOneNode(status);
      if (node.original && node.original.get('id') > 0) {
        var type = node.get('type');
        if (type === 1) {
          node = node.original;
        } else if (type === 2) {
          node.set({mime_type: node.original.get('mime_type')}, {silent: true});
        }
      }
      return this._openContent(node, options);
    },

    _openContent: function (node, options) {
      if (config.forceDownload) {
        return this._downloadContent(node, options, 'download');
      }
      var plugin = openPlugins.findByNode(node, {
            openInNewTab: config.openInNewTab
          });
      if (plugin) {
        if (config.openInNewTab) {
          return this._openWindow(plugin, node, window.open(''), options);
        }
        if (plugin.widgetView) {
          return this._openWidget(plugin.widgetView, node, options);
        }
        var content = config.openInNewTab === false ?
                      window : window.open('');
        return this._openWindow(plugin, node, content, options);
      }
      return this._downloadContent(node, options, 'download');
    },

    _openWidget: function (view, node, options) {
      var deferred = $.Deferred();
      require([
        'csui/utils/commands/impl/full.page.modal/full.page.modal.view',
        view
      ], function (FullPageModal, ViewerView) {
        var viewerView = new ViewerView({
              context: options.context,
              model: node
            }),
            fullPageModal = new FullPageModal({
              view: viewerView
            });
        fullPageModal.on('destroy', function () {
                       deferred.resolve();
                     })
                     .show();
      }, deferred.reject);
      return deferred.promise();
    },

    _openWindow: function (plugin, node, content, options) {
      var deferred = $.Deferred();
      var self = this;
      require([
        'csui/utils/open.authenticated.page'
      ], function () {
        openAuthenticatedPage = arguments[0];
        var promise = plugin.getUrl && plugin.getUrl(node) ||
                      plugin.getUrlQuery(node);
        promise.then(function (url) {
          return self._openURL(plugin, node, content, url, options);
        }, function (error) {
          if (content !== window) {
            content.close();
          }
          deferred.reject(error);
          return $.Deferred().reject();
        })
        .then(function () {
          content.focus();
          deferred.resolve();
        });
      }, deferred.reject);
      return deferred.promise();
    },

    _openURL: function (plugin, node, content, url, options) {
      var connector = node.connector || options.connector;
      if (!plugin.getUrl) {
        url = Url.appendQuery(
            new Url(connector.connection.url).getCgiScript(),
            Url.combineQueryString(url));
      }
      if (plugin.needsAuthentication && plugin.needsAuthentication(node)) {
        return openAuthenticatedPage(connector, url, {
          window: content,
          openInNewTab: config.openInNewTab
        });
      }
      content.location.href = url;
      return $.Deferred().resolve().promise();
    }
  });

  return OpenCommand;
});
