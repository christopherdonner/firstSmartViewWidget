/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/log',
  'csui/utils/base', 'csui/utils/commandhelper', 'csui/models/command'
], function (module, _, $, log, base, CommandHelper, CommandModel) {
  'use strict';

  var FilterCommand = CommandModel.extend({
    defaults: {
      signature: 'Filter'
    },

    enabled: function (status) {
      var config = module.config();
      if (config.enabled === false) {
        return false;
      }
      var isContainer = status.container && !!status.container.get('container');
      return !!isContainer && this._isSupported(status.container);
    },

    _isSupported: function (container) {
      var notSupportedObjects = [136, 298],
          support             = $.inArray(container.get('type'), notSupportedObjects) === -1;
      return support;
    },

    execute: function (status, options) {
      throw new Error('The \'Filter\' action must be handled by the caller.');
    }
  });

  return FilterCommand;
});
