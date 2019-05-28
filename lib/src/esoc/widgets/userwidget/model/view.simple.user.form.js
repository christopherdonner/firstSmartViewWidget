/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/utils/url', 'csui/models/form', 'csui/lib/moment',
  'csui/models/mixins/resource/resource.mixin','esoc/widgets/userwidget/util'
], function (_, Url, FormModel, moment, ResourceMixin, Util) {
  'use strict';

  var ViewSimpleUserFormModel = FormModel.extend({
    util: Util,
    constructor: function ViewSimpleUserFormModel(attributes, options) {
      FormModel.prototype.constructor.apply(this, arguments);

      this.makeResource(options);
    },

    clone: function () {
      return new this.constructor(this.attributes, {
        connector: this.connector
      });
    },

    url: function () {
      var url = Url.combine(this.connector.connection.url, 'forms', 'users', this.attributes.userId,
          'view');

      return url;
    },

    parse: function (response) {
      var form = !!response.forms && response.forms[0];
      return form;
    }

  });

  ResourceMixin.mixin(ViewSimpleUserFormModel.prototype);

  return ViewSimpleUserFormModel;

});
