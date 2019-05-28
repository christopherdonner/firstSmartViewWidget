/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/handlebars',
  "csui/lib/marionette",
  "csui/lib/jquery",
  "csui/utils/connector",
  "esoc/widgets/chatwidget/view/chatwidget.view",
  'csui/utils/contexts/factories/connector',
  "css!esoc/widgets/chatwidget/impl/chatwidget.css"
], function (_, Handlebars, Marionette, $, Connector, ChatWidgetView, ConnectorFactory) {
  function ChatWidget(options) {

    var chatDialog = document.createElement('div');
    chatDialog.id = 'esoc-social-chat-widget';
    chatDialog.setAttribute("class", "esoc-social-chat-widget chat-container");

    if (!options.connector) {
      options.connector = options.context.getObject(ConnectorFactory);
    }

    this.show = function () {
      $("body").append(chatDialog);
      this.initializeWidget();
    };

    this.initializeWidget = function () {
      var chatwidgetView = new ChatWidgetView(options);
      var chatHeaderContainerRegion = new Marionette.Region({
        el: chatDialog
      });
      chatHeaderContainerRegion.show(chatwidgetView);
      $(chatDialog).css({display: "block"});
      $(chatDialog).animate({opacity: 1.0});
    };

    this.getConfig = function () {
      return options;
    };
  }

  return ChatWidget;
});
