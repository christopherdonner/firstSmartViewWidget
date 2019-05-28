/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/models/member',
  'hbs!workflow/widgets/message/impl/message',
  'i18n!workflow/widgets/message/impl/nls/lang',
  'css!workflow/widgets/message/impl/message'
], function (_, $, Marionette, TabableRegionBehavior, MemberModel, template, lang) {
  'use strict';

  var MessageTypeConstants = {
    message: function (subject, body) {
      var ret = subject;
      switch (subject) {
      case 'delegate':
        ret = body ? lang.delegateMessage : lang.delegateMessageNoComment;
        break;
      case 'reassign':
        ret = body ? lang.reassignMessage : lang.reassignMessageNoComment;
        break;
      case 'review':
        ret = body ? lang.reviewMessage : lang.reviewMessageNoComment;
        break;
      case 'review_return':
        ret = body ? lang.reviewReturnMessage : lang.reviewReturnMessageNoComment;
        break;
      }
      return ret;
    }
  };
  var MessageView = Marionette.ItemView.extend({

    className: 'workflow-message',

    template: template,

    templateHelpers: function () {
      return {
        subjectPre: this.subjectPre,
        subjectPost: this.subjectPost,
        sender: this.sender,
        subjectAria: this.subjectPre + this.sender + this.subjectPost + this.messageText,
        ariaDescribedById: _.uniqueId("id_"),
        messageText: this.messageText,
        seeMore: lang.seeMore,
        seeLess: lang.seeLess,
        seeMoreMessages: lang.seeMoreMessages,
        seeLessMessages: lang.seeLessMessages
      };
    },

    ui: {
      toggleButton: '.toggle-button',
      toggleIcon: '.toggle-button > span',
      messageBody: '.message-body'
    },

    events: {
      'click @ui.toggleButton': 'onClickToggle'
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    constructor: function MessageView(options) {
      if (_.isUndefined(options) || _.isUndefined(options.model)) {
        throw new Error('Message model is missing!');
      }
      var model = options.model;
      var connector = options.connector;
      this.messageText = model.get('text');
      var subject = model.get('subject');
      if (!_.isUndefined(subject)) {
        subject = MessageTypeConstants.message(subject, this.messageText);
        var parts = subject.split('{0}');
        if (parts.length === 2) {
          this.subjectPre = subject.split('{0}')[0];
          this.subjectPost = subject.split('{0}')[1];
        } else {
          this.subjectPre = null;
          this.subjectPost = subject;
        }
      }
      var sender = model.get('sender');
      if (_.isNumber(sender)) {
        var self = this;
        var member = new MemberModel({id: sender}, {connector: connector});
        member.fetch().done(function (data, result) {
          if (result === 'success') {
            self.sender = data.data.display_name;
            self.render();
          }
        });
      } else if (_.isString(sender)) {
        this.sender = sender;
      } else {
        this.sender = lang.anonymousUserName;
      }
      Marionette.ItemView.prototype.constructor.call(this, options);
    },

    onClickToggle: function (e) {
      if (this.ui.messageBody.hasClass('binf-in')) {
        this.ui.toggleIcon.removeClass('icon-expandArrowUp');
        this.ui.toggleIcon.addClass('icon-expandArrowDown');
        if (this.ui.toggleButton &&
            this.ui.toggleButton.hasClass('toggle-button csui-acc-focusable-active')) {
          this.ui.toggleButton[0].title = lang.seeMore;
          this.ui.toggleButton.attr('aria-label', lang.seeMoreMessages);
        }
      }
      else {
        this.ui.toggleIcon.removeClass('icon-expandArrowDown');
        this.ui.toggleIcon.addClass('icon-expandArrowUp');
        if (this.ui.toggleButton &&
            this.ui.toggleButton.hasClass('toggle-button csui-acc-focusable-active')) {
          this.ui.toggleButton[0].title = lang.seeLess;
          this.ui.toggleButton.attr('aria-label', lang.seeLessMessages);
        }
      }
    },

    currentlyFocusedElement: function () {
      return $(this.ui.toggleButton);
    }
  });
  return MessageView;
});