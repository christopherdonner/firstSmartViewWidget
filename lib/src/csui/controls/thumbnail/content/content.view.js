/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'hbs!csui/controls/thumbnail/content/impl/content'
], function ($, _, Backbone, Marionette, template) {
  'use strict';

  var ContentView = Marionette.ItemView.extend({
    template: template,
    className: 'csui-thumbnail-content-item',

    templateHelpers: function () {
      var model = this.options.contentModel,
          columnName = model.get("name"),
          key = model.get("key"),
          value = this.model.get(key);
      return {
        value: value,
        displayLabel: this.options.displayLabel,
        label: this.options.displayLabel ? columnName : "",
        cid: this.model.cid
      };
    },

    constructor: function ContentView(options) {
      options || (options = {});
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    }
  });
  return ContentView;
});