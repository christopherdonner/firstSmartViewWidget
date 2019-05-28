/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/utils/base',
  'csui/controls/thumbnail/content/content.registry',
  'hbs!csui/controls/thumbnail/content/member/impl/member'
], function ($, _, Backbone, Marionette, base, ContentRegistry, template) {
  'use strict';

  var MemberrView = Marionette.ItemView.extend({
    template: template,
    className: 'csui-thumbnail-user-container',

    templateHelpers: function () {
      var columnName = this.options.column.name,
          value      = this.model.get(columnName + "_expand") ||
                       this.model.get(columnName) || '',
          label      = this.options.contentModel.get("name"),
          text;
      if (_.isObject(value)) {
        text = base.formatMemberName(value);
      } else {
        text = this.model.get(columnName + "_formatted") || value.toString();
      }
      return {
        label: label,
        value: text
      };
    },

    constructor: function MemberrView(options) {
      options || (options = {});
      this.options = options;
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    }
  });
  ContentRegistry.registerByDataType(14, MemberrView);
  ContentRegistry.registerByDataType(19, MemberrView);
  ContentRegistry.registerByKey('owner_id', MemberrView);
  return MemberrView;
});