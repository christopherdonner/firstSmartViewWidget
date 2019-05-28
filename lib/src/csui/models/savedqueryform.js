/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/utils/url', 'csui/utils/log', 'csui/models/form',
  'csui/models/mixins/resource/resource.mixin'
], function (module, _, $, Url, log, FormModel, ResourceMixin) {
  'use strict';

  var SavedQueryFormModel = FormModel.extend({

    constructor: function SavedQueryFormModel(attributes, options) {
      FormModel.prototype.constructor.apply(this, arguments);

      this.makeResource(options);
    },

    clone: function () {
      return new this.constructor(this.attributes, {
        connector: this.connector
      });
    },
    parse: function (response) {
      delete response.options.renderForm;
      return FormModel.prototype.parse.apply(this, arguments);
    },

    url: function () {
      return Url.combine(this.connector.connection.url, 'searchqueries',
          this.get('id'));
    },

    toString: function () {
      return "query:" + this.get("id");
    }

  });

  ResourceMixin.mixin(SavedQueryFormModel.prototype);

  return SavedQueryFormModel;

});
