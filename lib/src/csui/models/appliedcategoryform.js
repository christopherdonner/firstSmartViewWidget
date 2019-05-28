/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/backbone', 'csui/utils/url',
  'csui/models/form', 'csui/models/mixins/node.connectable/node.connectable.mixin'
], function (_, Backbone, Url, FormModel, NodeConnectableMixin) {
  'use strict';

  var AppliedCategoryFormModel = FormModel.extend({

    constructor: function AppliedCategoryFormModel(attributes, options) {
      FormModel.prototype.constructor.call(this, attributes, options);

      this.makeNodeConnectable(options);
    },

    clone: function () {
      return new this.constructor(this.attributes, {node: this.node});
    },

    url: function () {
      var url = _.str.sformat('forms/nodes/categories/{0}?id={1}&category_id={2}',
          this.options.action, this.options.node.get('id'), this.options.categoryId);
      return Url.combine(this.connector.connection.url, url);
    },

    parse: function (response, options) {
      var form = _.extend({
            data: {},
            schema: {},
            options: {}
          }, response.form || response.forms && response.forms[0] || response),
          title = form.title || this.get('title');

      form.options = _.omit(form.options, 'form');
      if (form.schema.title === undefined) {
        form.schema.title = title;
      }
      if (!form.title) {
        form.title = title;
      }
      if (form.role_name === undefined) {
        form.role_name = "categories";
      }

      return form;
    }

  });

  NodeConnectableMixin.mixin(AppliedCategoryFormModel.prototype);

  return AppliedCategoryFormModel;

});
