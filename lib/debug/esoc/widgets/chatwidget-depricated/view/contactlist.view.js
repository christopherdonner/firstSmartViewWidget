csui.define([
  "csui/lib/jquery",
  "csui/lib/backbone",
  "csui/lib/marionette",
  "esoc/widgets/chatwidget/view/contact.view"
], function ($, Backbone, Marionette, ContactView) {
  var ContactListView = Marionette.CollectionView.extend({
    tagName: 'ul',
    className: 'chat-contact-list',
    childView: ContactView,
    constructor: function ContactListView() {
      Marionette.CollectionView.prototype.constructor.apply(this, arguments);
    },
    events: {},
    onRender: function () {
      this.$el.find(".esoc-social-contact-list-item").hide();
    },
    loadMoreItems: function (e) {
    }
  });
  return ContactListView;
});
