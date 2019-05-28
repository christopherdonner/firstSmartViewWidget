csui.define([
  "csui/lib/jquery",
  "csui/lib/backbone",
  "csui/lib/marionette",
  "csui/lib/handlebars",
  "esoc/widgets/chatwidget/view/chatheader.view",
  "esoc/widgets/chatwidget/view/chatbody.view",
  "hbs!esoc/widgets/chatwidget/impl/chatwidget",
  "csui/lib/binf/js/binf"
], function ($, Backbone, Marionette, Handlebars, ChatHeaderView, ChatBodyView,
    ChatWidgetTemplate) {
  var self = null;
  var ChatWidgetView = Marionette.LayoutView.extend({

    tagName: "div",
    template: ChatWidgetTemplate,
    regions: {
      chatHeaderRegion: "#esoc-social-chat-title-bar",
      chatBodyRegion: '#esoc-chat-body'
    },
    _elements: {},
    initialize: function (options) {
      this.setChatHeader();
      this.setChatBody();
    },
    constructor: function ChatWidgetView(options) {
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
    },
    events: {},
    onRender: function (e) {
      this.chatHeaderRegion.show(this.chatHeaderView);
      this.chatBodyRegion.show(this.chatBodyView);
    },
    setChatHeader: function () {
      this.chatHeaderView = new ChatHeaderView(this.options);
    },
    setChatBody: function () {
      this.chatBodyView = new ChatBodyView(this.options);
    }
  });
  return ChatWidgetView;
});

