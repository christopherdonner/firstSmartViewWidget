/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery', 'csui/lib/underscore', 'csui/utils/url', 'i18n!csui/models/impl/nls/lang'
], function ($, _, Url, lang) {
  'use strict';

  var ServerAdaptorMixin = {
    mixin: function (prototype) {

      return _.extend(prototype, {
        makeServerAdaptor: function (options) {
          return this;
        },

        url: function () {
          return Url.combine(this.options.connector.connection.url.replace('/v1', '/v2'),
            'members/favorites', this.get('id'));
        },

        _serverCallPreCheck: function () {
          if (this.isNew()) {
            return {error: lang.serverCallPrecheckFailedModelIsNew};
          }
          if (!this.options || !this.options.connector) {
            return {error: lang.serverCallPrecheckFailedMissingConnector};
          }
          return undefined;
        },

        _serverCallUpdateFavorite: function (ajaxMethod, deferred, selected) {
          var error = this._serverCallPreCheck();
          if (error !== undefined) {
            deferred.reject(error);
            return;
          }

          var options = {
            type: ajaxMethod,
            url: this.url()
          };
          this.options.connector.extendAjaxOptions(options);

          if (ajaxMethod === 'POST') {
            var tabId = this.get('tab_id');
            var name = this.get('name');
            if (tabId !== undefined || name !== undefined) {
              var data = {};
              name !== undefined && _.extend(data, {name: name});
              (tabId !== undefined && tabId !== -1) && _.extend(data, {tab_id: tabId});
              _.extend(options, {data: {body: JSON.stringify(data)}});
            }
          }

          $.ajax(options)
            .done(_.bind(function (resp) {
              this.set('selected', selected);
              if (window.csui && window.csui.mobile) {
                var selectedNode = this.get('node');
                selectedNode.fetch({
                  force: true
                });
              }
              deferred.resolve(resp);
            }, this))
            .fail(function (err) {
              deferred.reject(err);
            });
        }

      });
    }
  };

  return ServerAdaptorMixin;
});
