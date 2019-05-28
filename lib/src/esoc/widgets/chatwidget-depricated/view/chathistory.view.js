/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/lib/handlebars',
  'hbs!esoc/widgets/chatwidget/impl/history'
], function (_, $, Backbone, Marionette, Handlebars, HistoryTemplate) {
  var ChatHistoryView = Marionette.ItemView.extend({
    tagName: "li",
    className: 'esoc-social-chat-history-item binf-col-lg-12 col-md-12 binf-col-sm-12 binf-col-xs-12',
    template: HistoryTemplate,
    events: {},
    _elements: {},
    constructor: function ChatHistoryView() {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },
    onRender: function (e) {
    }
  });
  return ChatHistoryView;
});
