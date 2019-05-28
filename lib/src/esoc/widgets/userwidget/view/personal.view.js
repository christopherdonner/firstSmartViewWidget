/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/handlebars',
  'csui/lib/marionette',
  'hbs!esoc/widgets/userwidget/impl/personal',
  'i18n!esoc/widgets/userwidget/nls/lang'
], function ($, _, Handlebars, Marionette, PersonalTemplate, Lang) {
  var self = null;
  var PersonalView = Marionette.ItemView.extend({
    tagName: "div",
    className: 'esoc-personal-tab',
    template: PersonalTemplate,
    initialize: function (options) {
      this.options = options;
      self = this;
    },
    constructor: function PersonalView(options) {
      options = options || {};
      Marionette.ItemView.prototype.constructor.call(this, options);

    },
    errorHandle: function (model, response) {
    }

  });
  return PersonalView;
});
