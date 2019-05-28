/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'require', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/models/command', 'csui/utils/commandhelper', 'csui/utils/url',
  'i18n!csui/utils/commands/nls/localized.strings',
  'csui/utils/commands/open.classic.page'
], function (module, require, _, $, CommandModel, CommandHelper,
    Url, lang, OpenClassicPageCommand) {
  'use strict';

  var ConnectorFactory, NodeModelFactory;

  var config = _.extend({
    enabled: true,
    openInNewTab: null
  }, module.config());
  if (config.openInNewTab == null) {
    config.openInNewTab = OpenClassicPageCommand.openInNewTab;
  }

  var SwitchToClassicCommand = CommandModel.extend({

    defaults: {
      signature: 'SwitchToClassic',
      name: lang.SwitchToClassicCommandName
    },

    enabled: function (status, options) {
      if (!config.enabled) {
        return false;
      }
      var context = status.context || options && options.context,
          applicationScope = context.getModel('applicationScope');
      applicationScope = applicationScope && applicationScope.get('id');
      return applicationScope === '' || applicationScope === 'node';
    },

    execute: function (status, options) {
      var deferred = $.Deferred(),
          context = status.context || options && options.context,
          target = config.openInNewTab && window.open('', '_blank') || window,
          self = this;
      target.focus();
      require(['csui/utils/contexts/factories/connector',
               'csui/utils/contexts/factories/node'
      ], function () {
        ConnectorFactory = arguments[0];
        NodeModelFactory = arguments[1];
        target.location.href = self._getUrl(context, status);
        deferred.resolve();
      }, deferred.reject);
      return deferred.promise();
    },

    _getUrl: function (context, status) {
      var connector = context.getObject(ConnectorFactory),
          cgiUrl = new Url(connector.connection.url).getCgiScript(),
          urlQueryParameters = this._getUrlQueryParameters(context, status),
          urlQuery = Url.combineQueryString(urlQueryParameters);
      return Url.appendQuery(cgiUrl, urlQuery);
    },

    _getUrlQueryParameters: function (context, status) {
      var node = CommandHelper.getJustOneNode(status) ||
                 context.getModel(NodeModelFactory),
          parameters;
      if (node !== undefined && node.get('id') > 0) {
        parameters = {
          func: 'll',
          objId: node.get('id')
        };
        if (node.get('container')) {
          parameters.objAction = 'browse';
          parameters.viewType = 1;
        } else {
          parameters.objAction = 'properties';
        }
      } else {
        parameters = {};
      }
      return parameters;
    }

  });

  return SwitchToClassicCommand;

});
