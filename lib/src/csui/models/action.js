/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([ "module", "require", "csui/lib/jquery", "csui/lib/underscore",
  "csui/lib/backbone", "csui/utils/log", "csui/utils/base"
], function (module, _require, $, _, Backbone, log, base) {
  "use strict";
  var ActionCollection;

  var ActionModel = Backbone.Model.extend({

    idAttribute: 'signature',

    constructor: function ActionModel(attributes, options) {
      Backbone.Model.prototype.constructor.apply(this, arguments);
      options && options.connector && options.connector.assignTo(this);
      if (!ActionCollection) {
        ActionCollection = _require("csui/models/actions");
      }
      var children = _.isArray(attributes && attributes.children) &&
                     attributes.children || [];
      this.children = new ActionCollection(children);
    },
    url: function () {
      return base.Url.combine(this.connector.connection.url,
        "actions", this.get("signature"));
    },

    fetch: function (options) {
      log.debug("Fetching action with the ID {0}.", this.get("signature")) &&
      console.log(log.last);
      return Backbone.Model.prototype.fetch.call(this, options);
    },

    parse: function (response) {
      var action = response;

      if (this.children) {
        var children = _.isArray(action.children) && action.children || [];
        this.children.reset(children);
      }

      return action;
    }

  });

  return ActionModel;

});
