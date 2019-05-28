/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["module", "csui/lib/jquery", "csui/lib/underscore", "csui/lib/backbone",
  "csui/utils/log", "csui/utils/base", "csui/models/nodeforms"
], function (module, $, _, Backbone, log, base, NodeFormCollection) {
  "use strict";

  var NodeCreateFormCollection = NodeFormCollection.extend({

      constructor: function NodeCreateFormCollection(models, options) {
        NodeFormCollection.prototype.constructor.apply(this, arguments);
        this.type = options.type;
        this.docParentId = options.docParentId;
        if (this.type === undefined) {
          throw new Error(this.ERR_CONSTRUCTOR_NO_TYPE_GIVEN);
        }
      },

      clone: function () {
        return new this.constructor(this.models, {
          node: this.node,
          type: this.type
        });
      },

      url: function () {
        var path = 'forms/nodes/create',
            params = {
              parent_id: this.docParentId ? this.docParentId : this.node.get("id"),
              type: this.type
            },
          resource = path + '?' + $.param(params);
        return base.Url.combine(this.node.connector.connection.url, resource);
      },

      parse: function (response) {
        var forms = response.forms;
        _.each(forms, function (form) {
          form.id = form.schema.title;
        });
        forms.length && (forms[0].id = "general");

        return forms;
      }

    },
    {
      ERR_CONSTRUCTOR_NO_TYPE_GIVEN: "No creation type given in constructor"
    });

  _.extend(NodeCreateFormCollection, {
    version: '1.0'
  });

  return NodeCreateFormCollection;

});

