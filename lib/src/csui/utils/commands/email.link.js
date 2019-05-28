/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/utils/url', 'csui/utils/command.error',
  'csui/models/command', 'csui/utils/commandhelper',
  'csui/utils/node.links/node.links',
  'i18n!csui/utils/commands/nls/lang',
  'i18n!csui/utils/commands/nls/localized.strings',
  'csui/lib/underscore.string'
], function (module, _, $, Url, CommandError, CommandModel,
    CommandHelper, nodeLinks, publicLang, lang) {
  'use strict';

  var config = _.extend({
    rewriteApplicationURL: false,
    enableAppleSupport: false,
    appleNodeLinkBase: 'x-otm-as-cs16://?launchUrl=nodes/'
  }, module.config());

  var EmailLinkCommand = CommandModel.extend({
    defaults: {
      signature: 'EmailLink',
      name: lang.CommandNameEmailLink,
      verb: lang.CommandVerbEmailLink
    },

    enabled: function (status) {
      var nodes = CommandHelper.getAtLeastOneNode(status);
      return nodes && nodes.length;
    },

    execute: function (status, options) {
      var deferred = $.Deferred();
      var nodes = CommandHelper.getAtLeastOneNode(status),
          context = status.context || (options && options.context),
          applicationUrl = this._getApplicationUrl(nodes, context),
          body = this._getNodesLinks(nodes, applicationUrl),
          newHref = 'mailto:?subject=' + encodeURIComponent(publicLang.EmailLinkSubject) +
                    '&body=' + encodeURIComponent(body),
          error = this._openNewHref(newHref);
      if (error) {
        deferred.reject(error);
      } else {
        deferred.resolve();
      }
      return deferred.promise();
    },

    _getApplicationUrl: function (nodes) {
      var connector = nodes.first().connector;
      return Url.combine(new Url(connector.connection.url).getCgiScript(), '/app');
    },

    _openNewHref: function (newHref) {
      if (newHref.length > 2048) {
        return new CommandError(lang.EmailLinkCommandFailedWithTooMuchItemsErrorMessage);
      } else {
        window.location.href = newHref;
      }
    },

    _getNodesLinks: function(nodes, applicationUrl) {
      var iOSEnabled = config.enableAppleSupport,
          iOSText = lang.EmailAppleLinkFormat,
          androidText = publicLang.EmailLinkDesktop + '\n',
          desktopText = nodes.map(function (node) {
            var actionUrl = nodeLinks.getUrl(node),
                name = node.get('name') + ":";

            if (config.rewriteApplicationURL) {
            var hash = actionUrl.lastIndexOf('#');
            if (hash >= 0) {
              actionUrl = applicationUrl + '/' + actionUrl.substr(hash + 1);
            }
          }

          if (iOSEnabled) {
              var nodeId = (node.get('type') === 1)?node.original.get('id'):node.get('id');
              iOSText += '\n' + name + '\n' + config.appleNodeLinkBase + nodeId;
          }

          return name + '\n' + actionUrl;
        }).join('\n');

      return iOSEnabled ? androidText + desktopText + "\n\n" + iOSText : desktopText;

    }
  });

  return EmailLinkCommand;
});
