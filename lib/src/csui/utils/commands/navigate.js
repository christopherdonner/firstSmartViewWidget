/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/log',
  'csui/utils/base', 'csui/utils/commandhelper', 'csui/models/command',
  'csui/models/node/node.model'
], function (module, _, $, log, base, CommandHelper, CommandModel, NodeModel) {
  'use strict';

  var config = _.extend({
    openInNewTab: true
  }, module.config());

  var NavigateCommand = CommandModel.extend({

    defaults: {
      signature: 'Navigate'
    },
    enabled: function (status) {
      var node = CommandHelper.getJustOneNode(status);
      return node && node.get('type') === 140;
    },

    execute: function (status, options) {
      var node = CommandHelper.getJustOneNode(status);
      return this._navigateTo(node, options);
    },

    _navigateTo: function (node, options) {
      var url         = node.get('url'),
          absoluteUrl = node.get('absoluteUrl'),
          promise     = $.Deferred(),
          content;

      function finish() {
        content || (content = window);
        if (!!absoluteUrl) {
          content.location.href = absoluteUrl;
        } else {
          content.location.href = url.match(/^[a-zA-Z]+:\/\//) ?
                                  url : 'http://' + url;
        }
        content.focus();
        promise.resolve();
      }

      if (config.openInNewTab) {
        content = window.open('', '_blank');
      }
      if (url) {
        finish();
      } else {
        node = new NodeModel({id: node.get('id')},
            {connector: node.connector});
        node.fetch()
            .done(function () {
              url = node.get('url');
              finish();
            })
            .fail(function (request) {
              if (content) {
                content.close();
              }
              promise.reject(new base.Error(request));
            });
      }
      return promise.promise();
    }

  });

  return NavigateCommand;
});
