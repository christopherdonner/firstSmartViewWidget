/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/lib/handlebars',
  'hbs!esoc/widgets/chatwidget/impl/contact',
  "esoc/widgets/chatwidget/model/chathistorycollection.model",
  "esoc/widgets/chatwidget/view/chathistorycollection.view"
], function (_, $, Backbone, Marionette, Handlebars, ContactTemplate, ChatHistoryCollectionModel,
    ChatHistoryCollectionView) {
  var ContactView = Marionette.ItemView.extend({
    tagName: "li",
    className: 'esoc-social-contact-list-item binf-col-lg-12 col-md-12 binf-col-sm-12 binf-col-xs-12',
    template: ContactTemplate,
    initialize: function (options) {
      this.listenTo(this.model, "change", this.render);
    },
    events: {
      "click .esoc-social-contact-item": "renderHistoryView"
    },
    _elements: {},
    constructor: function ContactView() {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },

    onRender: function (e) {
    },
    renderHistoryView: function (e) {
      var userid = $(e.target).attr("data-id");
      var historyOptions = {
        connector: this.options.model.collection.connector,
        userid: userid
      };

      var chatHistoryModel = new ChatHistoryCollectionModel(historyOptions);
      historyOptions.model = chatHistoryModel;

      var chatHistoryRegion = new Marionette.Region({
        el: "#esoc-social-chat-history-body"
      });
      var chatHistoryView = new ChatHistoryCollectionView({collection: chatHistoryModel});
      chatHistoryRegion.show(chatHistoryView);
      chatHistoryModel.fetch({
        success: chatHistoryModel.fetchSuccess,
        error: chatHistoryModel.fetchError
      });
    },
    onShow: function (e) {
      var contactItemId = this.model.id;
      $("#esoc-chat-contact_" + contactItemId).draggable({
        helper: "clone",
        cursor: "move",
        scroll: false,
        appendTo: "#esoc-social-chat-history-body"
      });
      $(".esoc-social-chat-history-body").droppable({
        drop: function (event, ui) {
          if ($("div[id^='esoc-chat-user_']").attr("data-id") !== $(ui.draggable).attr("data-id") &&
              $(this).find("#" + $(ui.draggable).attr("id")).length === 0) {
            $(ui.draggable).clone().appendTo($(this));
          }
        }
      });
    }
  });
  return ContactView;
});
