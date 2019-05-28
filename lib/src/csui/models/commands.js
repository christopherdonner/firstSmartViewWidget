/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["module", "csui/lib/underscore", "csui/lib/backbone", "csui/utils/log",
  "csui/models/command"
], function (module, _, Backbone, log, CommandModel) {

  var CommandCollection = Backbone.Collection.extend({

    model: CommandModel,

    constructor: function CommandCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
    },

    getAllSignatures: function () {
      return _.chain(this.pluck('command_key'))
          .map(function (signature) {
            if (_.isArray(signature)) {
              var result = signature[0];
              if (result === 'default') {
                result = ['default', 'open', signature[2]];
              }
              return result;
            }
            return signature;
          })
          .flatten()
          .compact()
          .unique()
          .value();
    }

  });

  return CommandCollection;

});
