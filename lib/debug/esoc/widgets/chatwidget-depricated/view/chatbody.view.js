csui.define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/lib/handlebars',
  "esoc/widgets/chatwidget/view/contactlist.view",
  "esoc/widgets/chatwidget/model/contactlist.model",
  'hbs!esoc/widgets/chatwidget/impl/chatbody'
], function (_, $, Backbone, Marionette, Handlebars, ContactListView, ContactListModel,
    ChatBodyTemplate) {
  var ChatBodyView = Marionette.LayoutView.extend({
    template: ChatBodyTemplate,
    regions: {
      contactListRegion: "#esoc-social-chat-contacts-list"
    },
    events: {},
    _elements: {},
    initialize: function (options) {
      this.setContactList();
    },
    constructor: function ChatBodyView() {
      Marionette.LayoutView.prototype.constructor.apply(this, arguments);
    },
    onRender: function (e) {
      var listView = new ContactListView(this.contactListView);
      this.contactListRegion.show(listView);
    },
    setContactList: function () {
      var contactListModel = new ContactListModel(this.options);
      this.contactListView = new ContactListView({collection: contactListModel});
      // get the contacts from the server
      contactListModel.fetch({
        success: contactListModel.fetchSuccess,
        error: contactListModel.fetchError
      });
    }
  });
  return ChatBodyView;
});

