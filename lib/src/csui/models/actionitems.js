/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/backbone', 'csui/models/actionitem'
], function (_, Backbone, ActionItemModel) {
  'use strict';

  var ActionItemCollection = Backbone.Collection.extend({

    model: ActionItemModel,
    comparator: 'sequence',

    constructor: function ActionItemCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
    },

    findByNode: function (node) {
      return this.find(function (item) {
        return item.enabled(node);
      });
    },

    getAllSignatures: function () {
      return _.chain(this.pluck('signature'))
          .unique()
          .value();
    },

    getAllCommandSignatures: function (commands) {
      return _.chain(this.getAllSignatures())
          .map(function (signature) {
            var command = commands.get(signature);
            if (command) {
              signature = command.get('command_key');
              if (_.isArray(signature)) {
                var result = signature[0];
                if (result === 'default') {
                  result = ['default', 'open', signature[2]];
                }
                return result;
              }
              return signature;
            }
          })
          .flatten()
          .compact()
          .unique()
          .value();
    },

    getPromotedCommandsSignatures: function () {
      return _.chain(this.getAllSignatures())
          .flatten()
          .compact()
          .unique()
          .value();
    }

  });

  return ActionItemCollection;

});
