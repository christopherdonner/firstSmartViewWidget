/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette', 'i18n',
  'i18n!csui/controls/globalmessage/impl/nls/globalmessage.lang',
  'hbs!csui/controls/globalmessage/impl/messagedialog',
  'css!csui/controls/globalmessage/impl/messagedialog',
  'css!csui/controls/globalmessage/globalmessage_icons'
], function (_, $, Marionette, i18n, lang, template, css) {
  'use strict';

  var messageClassMap = {
    info: "csui-info",
    success: "csui-success",
    success_with_link: "csui-success-with-link",
    warning: "csui-warning",
    error: "csui-error",
    processing: "csui-processing",
    none: "csui-none"
  };

  var stateIconClassMap = {
    info: "csui-icon-notification-information-white",
    success: "csui-icon-notification-success-white",
    success_with_link: "csui-icon-notification-success-white",
    warning: "csui-icon-notification-warning-white",
    error: "csui-icon-notification-error-white",
    processing: null,
    none: null
  };

  var closeIconClassMap = {
    info: "csui-icon-dismiss-white",
    success: "csui-icon-dismiss-white",
    success_with_link: "csui-icon-dismiss-white",
    warning: "csui-icon-dismiss-white",
    error: "csui-icon-dismiss-white",
    processing: null,
    none: "csui-icon-dismiss"
  };

  var className = "csui-messagepanel";

  var View = Marionette.ItemView.extend({

    constructor: function MessageDialog(options) {
      this.css = css;
      options.info || (options.info = "info");
      this.className = className + " " + messageClassMap[options.info];

      if (options.context && options.nextNodeModelFactory) {
        this._nextNode = options.context.getModel(options.nextNodeModelFactory);
      }

      Marionette.ItemView.prototype.constructor.call(this, options);
    },

    className: className + " " + messageClassMap["info"],
    template: template,

    ui: {
      closeAction: '.csui-header .csui-action-close',
      collapseAction: '.csui-details .csui-action-fewerdetails',
      expandAction: '.csui-details .csui-action-moredetails',
      stateIcon: '.csui-state-icon',
      closeIcon: '.csui-action-close',
      messageLink: '.csui-message-link'
    },

    events: {
      'click @ui.closeAction': 'doClose',
      'click @ui.collapseAction': 'doCollapse',
      'click @ui.expandAction': 'doExpand',
      'click @ui.messageLink': 'onClickLink',
      'focusout @ui.closeIcon': 'replaceDummyBackImg'
    },

    doResize: function () {
      var header = this.$el.find(".csui-header");
      var details = this.$el.find(".csui-details");
      details.width(header.width());
      if (this.options.sizeToParentContainer) {
        var width = this.$el.width();
        var parentWidth = this.$el.parent().width();
        var translateX = (parentWidth - width) / 2;
        translateX > 0 || (translateX = 0);
        translateX = !!i18n.settings.rtl ? -translateX : translateX;
        translateX = 'translateX(' + translateX + 'px)';
        this.$el.css({'transform': translateX});
      }
    },

    doCollapse: function (animated) {
      this._clearTimeout();
      animated = (animated === false) ? false : true;
      var details = this.$el.find(".csui-details");
      var detailsText = details.find(".csui-text");
      this.options.messageHelper.switchField(details, ".csui-action", "moredetails",
          ["moredetails", "fewerdetails"]);
      var panel = _.extend({csuiAfterHide: function () { details.css("width", ""); }},
          this);
      this.options.messageHelper.collapsePanel(panel, details, detailsText, animated);
      this.stateExpandCollapse = "collapsed";
    },

    doExpand: function (animated) {
      this._clearTimeout();
      animated = (animated === false) ? false : true;
      var details = this.$el.find(".csui-details");
      var detailsText = details.find(".csui-text");
      this.options.messageHelper.switchField(details, ".csui-action", "fewerdetails",
          ["moredetails", "fewerdetails"]);
      details.css("width", this.$el.find(".csui-header").width());
      this.options.messageHelper.expandPanel(this, details, detailsText, animated);
      this.stateExpandCollapse = "expanded";
    },

    doShow: function (relatedView, parentView) {
      var existingDialogs = parentView.$el.find('.csui-global-message.position-show');
      if (existingDialogs.length) {
        var latestDialog        = existingDialogs.last().find('.csui-header'),
            existingDialogCount = existingDialogs.length,
            currentDialogHeader = this.$el.find('.csui-header');
        currentDialogHeader.css({
          'top': 4 * existingDialogCount + 'px',
          'margin': '0 ' + (-8 * existingDialogCount) + 'px'
        });
        var currentDialogDetailsWrapper = this.$el.find('.csui-details-wrapper');
        if (currentDialogDetailsWrapper.length) {
          currentDialogDetailsWrapper.css({
            'margin-right': (-8 * existingDialogCount) + (-5) + 'px',
            'margin-left': (-8 * existingDialogCount) + (-5) + 'px'
          });
        }
      }
      if (this.options.info === "success") {
        var self = this;
        var panel = _.extend({
          csuiAfterShow: function () {
            self.doResize();
            self._setTimeout();
          }
        }, this);
        this.options.messageHelper.showPanel(panel, relatedView, parentView);
      } else {
        this.options.messageHelper.showPanel(this, relatedView, parentView);
      }
      this.doResize();
      this.$el.trigger('globalmessage.shown', this);
      this.$el.find('.csui-action-close').focus();
    },

    doClose: function () {
      this._clearTimeout();
      var self = this, panel = _.extend({
        csuiAfterHide: function () {
          self.destroy();
          self.trigger('escaped:focus');
        }
      }, this);
      this.options.messageHelper.fadeoutPanel(panel);
    },

    _setTimeout: function () {
      var self = this;
      if (!this.options.enablePermanentHeaderMessages) {
        this.options.timeout = window.setTimeout(function () {
          self.doClose();
        }, 5000);
      }
    },

    _clearTimeout: function () {
      if (this.options.timeout) {
        window.clearTimeout(this.options.timeout);
        this.options.timeout = undefined;
      }
    },

    headerId: undefined,
    detailsId: undefined,

    templateHelpers: function () {
      var closeAria = lang.closeDialogAria;
      if (!this.headerId) {
        this.headerId = _.uniqueId('header');
      }
      if (!this.detailsId) {
        this.detailsId = this.options.details ? _.uniqueId('details') : undefined;
      }

      var info = {
        header_text: this.options.message,
        headerId: this.headerId,
        details_text: this.options.details,
        detailsId: this.detailsId,
        action_moredetails: lang.MoreDetails,
        action_fewerdetails: lang.FewerDetails,
        closeDialog: lang.CloseDialog,
        closeDialogAria: closeAria
      };

      if (this.options.link_url && this.options.targetFolder) {
        info = _.extend(info, {
          message_with_link: true,
          link_label: lang.GotoLocationLinkLabel,
          link_url: this.options.link_url
        });
      }

      return info;
    },

    onClickLink: function (event) {
      event.preventDefault();
      event.stopPropagation();
      this.doClose();
      if (this.options.targetFolder && this._nextNode) {
        this._nextNode.set('id', this.options.targetFolder.get('id'));
      }
    },

    onRender: function () {
      this.$el.attr('role', 'alertdialog');
      this.$el.attr('aria-labelledby', this.headerId);
      if (this.detailsId) {
        this.$el.attr('aria-describedby', this.detailsId);
      }
      var stateClass = stateIconClassMap[this.options.info];
      if (stateClass) {
        this.ui.stateIcon.addClass(stateClass);
      } else {
        this.$el.addClass('csui-no-icon');
      }
      var closeClass = closeIconClassMap[this.options.info];
      if (closeClass) {
        this.ui.closeIcon.addClass(closeClass);
      }
      if (!this.stateExpandCollapse) {
        var arrow = this.$el.find(".csui-details .csui-action").find(
            ":not(.binf-hidden)");
        if (arrow.hasClass("csui-action-fewerdetails")) {
          this.doExpand(false);
        } else if (arrow.hasClass("csui-action-moredetails")) {
          this.doCollapse(false);
        }
      }
    },

    replaceDummyBackImg: function(){
      this.ui.closeIcon.addClass('csui-action-close-replace-dummy');
    }

  });

  return View;

});
