/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'require', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/models/command', 'csui/utils/commandhelper', 'csui/utils/url',
  'i18n!csui/utils/commands/nls/localized.strings'
], function (module, require, _, $, CommandModel, CommandHelper, Url, lang) {
  'use strict';

  var ConnectorFactory, PerspectiveRouter;

  var config = _.extend({
    signInPageUrl: 'signin.html'
  }, module.config());

  var SignOutCommand = CommandModel.extend({

    defaults: {
      signature: 'SignOut',
      name: lang.SignOutCommandName
    },

    enabled: function (status, options) {
      return true;
    },

    execute: function (status, options) {
      var deferred = $.Deferred(),
          context = status.context || options && options.context,
          self = this;
      require([
        'csui/utils/contexts/factories/connector',
        'csui/pages/start/impl/perspective.router'
      ], function () {
        ConnectorFactory = arguments[0];
        PerspectiveRouter = arguments[1];
        self._signOut(context)
            .done(deferred.resolve)
            .fail(deferred.reject);
      }, deferred.reject);
      return deferred.promise();
    },

    _signOut: function (context) {
      var connector = context.getObject(ConnectorFactory),
          cgiUrl = new Url(connector.connection.url).getCgiScript();
      if (PerspectiveRouter.routesWithSlashes()) {
        return $.ajax(connector.extendAjaxOptions({
                  url: Url.combine(cgiUrl, 'api/v1/auth/logouttoken')
                }))
                .then(function (response) {
                  connector.authenticator.unauthenticate({reason: 'logged-out'});
                  location.href = cgiUrl + '?func=csui.dologout&secureRequestToken=' +
                                  encodeURIComponent(response.token);
                });
      }
      connector.authenticator.unauthenticate({reason: 'logged-out'});
      var signInPageUrl = config.signInPageUrl,
          query = location.search;
      query += query ? '&' : '?';
      query += 'nextUrl=' + encodeURIComponent(location.pathname);
      location.href = signInPageUrl + query + location.hash;
      return $.Deferred().resolve().promise();
    }

  });

  return SignOutCommand;

});
