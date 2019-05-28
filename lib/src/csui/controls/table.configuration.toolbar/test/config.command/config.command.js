/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['require', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/utils/base', 'csui/utils/log',
  'csui/models/command', 'csui/utils/commandhelper'
], function (require, $, Backbone, base, log, CommandModel, CommandHelper) {
  'use strict';
  var ConfigCommandView;

  var ConfigTestCommand = CommandModel.extend({

    defaults: {
      signature: 'config-test-command',
      name: 'Config Test Command'
    },

    enabled: function (status) {
      return true;
    },

    execute: function (status, options) {
      var self = this,
          deferred = $.Deferred();
      require(['./config.command.view/config.command.view'], function (ConfigCommandView) {
        var node = CommandHelper.getJustOneNode(status);
        var viewOptions = {
          status: status,
          model: node
        };
        deferred.resolve({viewClass: ConfigCommandView, viewOptions: viewOptions});
      }, function (error) {
        deferred.reject(error);
      });

      return deferred.promise();
    }

  });

  return ConfigTestCommand;

});
