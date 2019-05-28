/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  "csui/lib/jquery",
  "csui/lib/jquery.ui/js/jquery-ui",
  "csui/lib/backbone",
  "csui/lib/marionette",
  "csui/lib/handlebars",
  "hbs!esoc/widgets/chatwidget/impl/chatheader",
  "esoc/widgets/chatwidget/view/chatminimize.view",
  "csui/lib/binf/js/binf"
], function ($, $ui, Backbone, Marionette, Handlebars, ChatHeaderTemplate, ChatMinimizeView) {
  var self = null;
  var ChatHeaderView = Marionette.ItemView.extend({
    options: {},
    template: ChatHeaderTemplate,
    _elements: {},
    tagName: "div",
    className: 'esoc-social-chat-title-bar binf-col-lg-12 col-md-12 binf-col-sm-12 binf-col-xs-12',
    events: {
      "click .esoc-social-chat-close-button": "onCloseButton",
      "click #esoc-social-chat-minimize-button": "onMinimize"
    },
    onRender: function (e) {
    },
    onCloseButton: function (e) {
      $("[id*=esoc-social-chat-container]").remove();
    },
    onMinimize: function (e) {
      var chatIcon = document.createElement('div');
      chatIcon.id = 'esoc-social-chat-minimized-view';
      $("body").append(chatIcon);
      var chatMinimizeRegion = new Marionette.Region({
        el: "#esoc-social-chat-minimized-view"
      });
      var chatMinimizeView = new ChatMinimizeView();
      $("#esoc-social-chat-widget").hide();
      chatMinimizeRegion.show(chatMinimizeView);
    },
    onShow: function (e) {
      var dragOpts = {
        cursor: "move",
        handle: "#esoc-social-chat-title-bar",
        containment: "window"
      };
      $("#esoc-social-chat-widget").draggable(dragOpts);
    }
  });
  return ChatHeaderView;
});
