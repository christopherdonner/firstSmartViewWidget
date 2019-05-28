/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['require', 'csui/lib/jquery', 'csui/lib/underscore',
  'csui/utils/base', 'csui/utils/commandhelper', 'csui/models/command'
], function (require, _, $, base, CommandHelper, CommandModel) {
  'use strict';

  var AddCategories = CommandModel.extend({

    defaults: {
      signature: "AddCategories"
    },

    enabled: function (status) {
      if (status && status.container) {
        var addableTypes = status.container.addableTypes;
        if (status.container.get('container') || (addableTypes && addableTypes.length > 0)) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },

    execute: function (status, options) {
      var self = this,
          deferred = $.Deferred();
      require(['csui/dialogs/node.picker/node.picker'
      ], function (NodePicker) {
        var pickerOptions = _.extend({
          command: 'addCategories',
          dialogTitle: 'Add Categories',
          initialContainer: status.container,
          globalSearch: true
        }, status);
        self.nodePicker = new NodePicker(pickerOptions);
        self.nodePicker
            .show()
            .done(function () {
              deferred.resolve.apply(deferred, arguments);
            })
            .fail(function () {
              deferred.reject.apply(deferred, arguments);
            });
      }, function (error) {
        deferred.reject(error);
      });
      return deferred.promise();
    }

  });

  _.extend(AddCategories, {

    version: "1.0"

  });

  return AddCategories;

});
