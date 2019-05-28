/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["csui/lib/jquery", "csui/lib/underscore", "csui/utils/base", "csui/models/command"
], function ($, _, base, CommandModel) {

  var AddPropertiesSampleCommand = CommandModel.extend({

    defaults: {
      signature: 'AddPropertiesSampleCommand',
      scope: "single"
    },

    enabled: function (status, options) {
      return false;  // true
    },

    execute: function (status, options) {
      alert("Add Properties Sample Commmand");
      return $.Deferred().resolve();
    }

  });

  return AddPropertiesSampleCommand;

});
