/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'require',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/marionette',
  'esoc/widgets/userwidget/chat/chatfactory',
  'esoc/widgets/userwidget/chat/skype/skypeucwa.attribute.model',
  'esoc/widgets/userwidget/chat/model/presence.model',
  'hbs!esoc/widgets/userwidget/chat/impl/presence',
  'esoc/widgets/common/util',
  'css!esoc/widgets/userwidget/chat/chat.css',
  'csui/lib/handlebars.helpers.xif'
], function (require, $, _, Marionette, ChatFactory, SkypeAttributeModel, PresenceModel,
    PresenceIconTemplate, CommonUtil) {
  var PresenceView = Marionette.ItemView.extend({
    template: PresenceIconTemplate,
    templateHelpers: function () {
      return {
        messages: {}
      };
    },
    initialize: function (options) {
      this.options = options;
      var that = this;
      var dfd = ChatFactory.initializeApplication(options);
      dfd.promise().done(function () {
        var chatEnabled = SkypeAttributeModel.getChatEnabled();
        var presenceEnabled = SkypeAttributeModel.getPresenceEnabled();
        if (chatEnabled && presenceEnabled) {
          that.model.attributes.chatEnabled = chatEnabled;
          that.model.attributes.presenceEnabled = presenceEnabled;
          var presenceOptions = _.extend({}, that.options);
          if (!!that.options.username) {
            presenceOptions.email = that.options.username +
                                    CommonUtil.globalConstants.AT_SIGN_SYMBOL +
                                    SkypeAttributeModel.getChatDomain();
            presenceOptions.presenceHolder = "esoc-chat-presence-indicator-" +
                                             that.options.model.attributes.id;
          }
          if (presenceOptions.subscribeEvent) {
            ChatFactory.getProvider().updateEventPresence(presenceOptions);
          } else {
            ChatFactory.getProvider().showUserPresence(presenceOptions);
          }
        }
      });
    },
    constructor: function PresenceView(options) {
      options.model = new PresenceModel(options);
      options = options || {};
      Marionette.ItemView.prototype.constructor.call(this, options);
      this.model.on('change.presencestatus', this.render, this);
    }
  });
  return PresenceView;
});