/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  "csui/lib/marionette",
  "hbs!csui/controls/table/rows/error/impl/errorrow",
  "css!csui/controls/table/rows/error/impl/errorrow"
], function (_, Marionette, template) {

  var ErrorRowView = Marionette.ItemView.extend({

    className: "csui-table-error-view binf-container-fluid",

    template: template,

    templateHelpers: function () {
      return {errorMessage: this.options.errorMessage ? this.options.errorMessage : '' };
    },

    ui: {},

    events: {},

    constructor: function ErrorRowView(options) {
      this.options = options || {};
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    }

  });

  return ErrorRowView;

});
