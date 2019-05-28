/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["module", "csui/lib/jquery", "csui/lib/underscore", "csui/lib/backbone",
  "csui/utils/log", "csui/utils/base", "csui/models/action"
], function (module, $, _, Backbone, log, base, ActionModel) {
  "use strict";

  var ActionCollection = Backbone.Collection.extend({

    model: ActionModel,

    constructor: function ActionCollection(models, options) {
      Backbone.Collection.prototype.constructor.apply(this, arguments);
      this.options = options || {};
    },
    findRecursively: function (id) {
      var action = this.get({ cid: id }) || this.find(function (item) {
        return item.get('signature') === id;
      });
      if (!action)
      {
        action = _.find(this.map(function (item) {
          return item.children.findRecursively(id);
        }), function (item) {
          return item;
        });
      }
      return action;
    }

  });

  _.extend(ActionCollection, {
    version: '1.0'
  });

  return ActionCollection;

});
