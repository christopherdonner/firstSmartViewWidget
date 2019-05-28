/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/handlebars',
  'csui/lib/marionette',
  'i18n!esoc/widgets/utils/chat/impl/nls/lang',
  'esoc/widgets/utils/chat/impl/util',
  'hbs!esoc/widgets/utils/chat/impl/chatbutton',
  "css!esoc/widgets/utils/chat/impl/chat.css"
], function ($, _, Handlebars, Marionette, lang, ChatUtil, ChatBtnTemplate) {
  var self = null;
  var ChatView = Marionette.ItemView.extend({
    className: 'esoc-social-chat-control',
    template: function (options) {
      return options.messages.customtemplate ? options.messages.customtemplate :
             ChatBtnTemplate(options);
    },
    templateHelpers: function () {
      return {
        messages: {
          tguser: this.options.tguser,
          labeltext: lang.labeltext,
          customtemplate: this.options.customtemplate
        }
      };
    },
    events: {
      "click": "launchChatWindow"
    },
    launchChatWindow: function (e) {
      ChatUtil.launchChatWindow(this.options);
    },
    constructor: function ChatView(options) {
      options = options || {};
      this.options = options;
      Marionette.ItemView.prototype.constructor.call(this, options);
    }
  });
  return ChatView;
});
