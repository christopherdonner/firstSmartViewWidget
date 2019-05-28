/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'require', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/url',
  'csui/utils/commandhelper', 'csui/models/command',
  'i18n!csui/utils/commands/nls/localized.strings'
], function (module, require, _, $, Url, CommandHelper, CommandModel, lang) {
  'use strict';

  var config = _.extend({
    openInNewTab: true
  }, module.config());

  var OpenClassicPageCommand = CommandModel.extend({

    execute: function (status, options) {
      if (config.classicUnsupported) {
        return this._classicUnsupported(status);
      }
      var node = CommandHelper.getJustOneNode(status);
      return this._navigateTo(node, _.extend({}, status, options));
    },

    getUrl: function (node, options) {
      var connector = node.connector || options.connector,
          url = new Url(connector.connection.url).getCgiScript(),
          urlQuery = this.getUrlQueryParameters(node, options);
      if (urlQuery && !_.isString(urlQuery)) {
        urlQuery = $.param(urlQuery);
      }
      if (urlQuery) {
        url += '?' + urlQuery;
      }
      return url;
    },

    getUrlQueryParameters: function (node, options) {
    },

    openInNewTab: function () {
      return config.openInNewTab;
    },

    shouldCloseTabAfterRedirect: false,

    _classicUnsupported: function (status) {
      var deferred = $.Deferred();
      status.suppressFailMessage = true;
      require(['csui/dialogs/modal.alert/modal.alert'], function (ModalAlert) {
        ModalAlert.showInfo(lang.viewTypeUnsupported);
      });
      return deferred.reject();
    },

    _navigateTo: function (node, options) {
      var url, openInNewTab, shouldCloseTabAfterRedirect,
          config, closeUrl, connection;
      try {
        url = this.getUrl(node, options);
      } catch (error) {
        return $
            .Deferred()
            .reject(error)
            .promise();
      }

      openInNewTab = this.openInNewTab;
      if (_.isFunction(openInNewTab)) {
        openInNewTab = openInNewTab.call(this);
      }

      shouldCloseTabAfterRedirect = this.shouldCloseTabAfterRedirect;
      if (_.isFunction(shouldCloseTabAfterRedirect)) {
        shouldCloseTabAfterRedirect = shouldCloseTabAfterRedirect.call(this);
      }
      if (shouldCloseTabAfterRedirect) {
        if (openInNewTab) {
          connection = (node.connector || options.connector).connection;
          closeUrl = module.config().closeUrl ||
                     Url.combine(connection.supportPath,
                         'csui/pages/close.html');
          if (!new Url(closeUrl).isAbsolute()) {
            if (closeUrl[0] !== '/') {
              closeUrl = Url.appendQuery(
                  new Url(connection.url).getCgiScript(), closeUrl);
            } else {
              closeUrl = Url.combine(
                  new Url(connection.url).getOrigin(), closeUrl);
            }
          }
        } else {
          closeUrl = location.href;
        }
        url = Url.appendQuery(url, Url.combineQueryString({
          nextURL: closeUrl
        }));
      }

      if (openInNewTab) {
        window
            .open(url, '_blank')
            .focus();
      } else {
        location.href = url;
      }

      return $.Deferred().resolve().promise();
    }

  }, {
    openInNewTab: config.openInNewTab
  });

  return OpenClassicPageCommand;

});
