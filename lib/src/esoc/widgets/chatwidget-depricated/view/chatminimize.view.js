/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  "csui/lib/jquery",
  "csui/lib/backbone",
  "csui/lib/marionette",
  "csui/lib/handlebars",
  "hbs!esoc/widgets/chatwidget/impl/chatminimize",
  "csui/lib/binf/js/binf"
], function ($, Backbone, Marionette, Handlebars, ChatMinimizeTemplate) {
  var self = null;
  var ChatMinimizeView = Marionette.ItemView.extend({
    initialize: function (options) {
      this.options = options;
      self = this;
    },
    options: {},
    template: ChatMinimizeTemplate,
    _elements: {},
    tagName: "div",
    events: {
      "click .esoc-social-chat-minimized-icon": "onMaximize"
    },
    onMaximize: function (e) {
      $("#esoc-social-chat-minimized-view").remove();
      $("#esoc-social-chat-widget").show();
    }
  });
  return ChatMinimizeView;
});
