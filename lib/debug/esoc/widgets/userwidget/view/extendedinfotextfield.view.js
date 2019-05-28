/**
 *  This is to handle events on input text and text area fields
 */
csui.define(['require',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/handlebars',
  'csui/lib/marionette',
  'esoc/widgets/userwidget/view/extendedinfo.view',
  'esoc/widgets/userwidget/util',
  'esoc/widgets/userwidget/view/customuserpicker.view',
  'hbs!esoc/widgets/userwidget/impl/extendedinfotextfield',
  'i18n!esoc/widgets/userwidget/nls/lang',
  'csui/lib/perfect-scrollbar'
], function (_require, $, _, Handlebars, Marionette, ExtendedInfoView, Util, UserPickerView,
    ExtendedInfoTextFieldTemplate, Lang) {
  var self = null;
  var ExtendedInfoTextFieldView = ExtendedInfoView.extend({
    tagName: "div",
    className: 'esoc-user-extended-info-text-field binf-col-lg-12 binf-col-md-12 binf-col-sm-12 binf-col-xs-12',
    template: ExtendedInfoTextFieldTemplate,
    util: Util,

    initialize: function (options) {
      this.extendedInfo = options;
      self = this;
    },
    events: {
      'focusin .esoc-user-extended-edit-mode': 'onStatusInputFocusIn',
      'focusout .esoc-user-extended-edit-mode': 'onStatusInputFocusOut',
      'click #esoc-user-status-update': 'postStatus',
      'click .esoc-user-update': 'updateExtendedInfoField',
      'click .esoc-user-cancel': 'cancelUpdateExtendedInfoField',
      'click .esoc-user-extended-edit, .esoc-user-messages-content, .esoc-user-default-content': 'onEditClick',
      'click .esoc-user-see-more': 'showMoreContent',
      'click .esoc-user-see-less': 'showLessContent',
      'click .esoc-user-messages-content': 'onContentClick',
      'mouseenter .esoc-user-default-content-mode, .esoc-user-extendedinfo, .esoc-user-manager-field': 'showEditLinkForText',
      'mouseleave .esoc-user-default-content-mode, .esoc-user-extendedinfo, .esoc-user-manager-field': 'hideEditLinkForText',
      'focusin .esoc-user-manager-field': 'showEditLinkForText',
      'focusout .esoc-user-manager-field': 'hideEditLinkForText',
      'keypress .esoc-user-extended-edit-text': 'submitOnEnter',
      'change #esoc-social-status-input': 'onStatusChange',
      'input #esoc-social-status-input': 'onStatusChange'
    },
    constructor: function ExtendedInfoTextAreaView(options) {
      options = options || {};
      this.options = options;
      Marionette.ItemView.prototype.constructor.call(this, options);
    },
    onRender: function () {
      if (!!this.options.model.attributes.userInputField) {
        if (this.options.model.attributes.isEditable) {
          this.pickerView = new UserPickerView({
            context: this.options.context,
            memberFilter: {type: [0]},
            widgetoptions: {
              connector: this.options.connector,
              showActions: false
            }
          });
          var pickerRegion = new Marionette.Region({
            el: this.$el.find('.esoc-user-manager-picker-holder')
          });
          pickerRegion.show(this.pickerView);
          this.listenTo(this.pickerView, 'item:change', this.onItemChange);
        }
        if (!!this.options.model.attributes.content) {
          Util.displayUserWidget(this.options.context, this.$el);
          var userWidgetOptions = {
            userid: this.options.model.attributes.content,
            context: this.options.context,
            placeholder: this.$el.find('.esoc-user-manager-avatar-container'),
            showUserProfileLink: true,
            showMiniProfile: true,
            showUserWidgetFor: 'profilepic',
            source: 'extendedInfoText',
            parentView: this
          };
          var UserWidget = _require('esoc/widgets/userwidget/userwidget');
          UserWidget.getUser(userWidgetOptions);
        } else {
          this.trigger("view:shown");
        }
      }
    },
    onStatusChange: function (event) {
      var statusString = this.$el.find("#esoc-social-status-input").val(),
          _e           = event || window.event,
          maxCharLimit = this.util.commonUtil.globalConstants.MAX_CHAR_LIMIT;
      if (statusString.length > maxCharLimit) {
        var statusStr = statusString.substr(0, maxCharLimit);
        this.$el.find("#esoc-social-status-input")[0].innerHTML = statusStr;
        this.$el.find("#esoc-social-status-header").html("")[0].textContent = statusStr;
        this.util.commonUtil.addEmoji(this.$el.find("#esoc-social-status-header"), false,
            this.options.connector);
        this.$el.find("#esoc-social-status-header").focus();
        this.util.commonUtil.placeCaretAtEnd(this.$el.find("#esoc-social-status-header"));
        _e.preventDefault();
      }
    },
    onItemChange: function (args) {
      this.managerID = args.item.attributes.id;
      this.$el.find(".esoc-user-extended-edit-text").val(args.item.attributes.id);
    },
    updateExtendedInfoField: function (e) {
      if (!!this.options.model.attributes.userInputField) {
        var fieldValue = this.pickerView.$el.find('input').val().trim();
        if (!fieldValue) {
          this.managerID = "";
          this.$el.find(".esoc-user-extended-edit-text").val("");
        }
      }
      var formData  = new FormData(),
          newValue  = this.$el.find(".esoc-user-extended-edit-input").val(),
          connector = this.options.connector;
      formData.append(this.util.commonUtil.globalConstants.ACTION,
          this.util.commonUtil.globalConstants.UPDATE_EXTENDED_INFO);
      formData.append(this.model.attributes.formField, newValue);
      this.$el.find(".esoc-user-extended-edit-mode").addClass("esoc-extendedinfo-update-mask");
      this.$el.find(".esoc-user-extended-edit-input").prop('disabled',
          true);
      var ajaxParams = {
        "itemview": this,
        "url": this.util.commonUtil.getV2Url(connector.connection.url) +
               this.util.commonUtil.REST_URLS.pulseRestUrl +
               this.model.attributes.userid,
        "type": "POST",
        "data": formData,
        "requestType": "updateExtendedTextField",
        "newValue": newValue,
        "targetElement": $(e.target),
        connector: connector
      };
      this.util.updateAjaxCall(ajaxParams);
    },
    postStatus: function (e) {
      var formData  = new FormData(),
          newValue  = this.$el.find(".esoc-user-extended-edit-input").val(),
          connector = this.options.connector;
      formData.append(this.model.attributes.formField, newValue);
      this.$el.find(".esoc-user-extended-edit-mode").addClass("esoc-extendedinfo-update-mask");
      this.$el.find(".esoc-user-extended-edit-input").prop('disabled',
          true);
      var ajaxParams = {
        "itemview": this,
        "url": connector.connection.url +
               this.util.commonUtil.REST_URLS.csPostCommentRESTUrl,
        "type": "POST",
        "data": formData,
        "requestType": "postStatus",
        "newValue": newValue,
        "targetElement": $(e.target),
        connector: connector
      };
      this.util.updateAjaxCall(ajaxParams);
    },
    onShow: function (e) {
      this.showSeeMoreLink(e);
      if (!this.options.model.attributes.userInputField) {
        this.trigger("view:shown");
      } else if (this.isUserModelLoaded) {
        this.trigger("view:shown");
      }
    },
    showSeeMoreLink: function (e) {
      var content = this.$el.find(".esoc-user-content");
      if (content.length > 0) {
        if (this.model.attributes.formField === 'status') {
          content[0].innerHTML = content.text();
          content.addClass("esoc-see-more-content");
          if (Util.commonUtil.isTextOverflown(content[0])) {
            this.$el.find(".esoc-user-see-more").show();
          }
          this.util.commonUtil.addEmoji(this.$el.find('.esoc-user-content'), true,
              this.options.connector);
        } else {
          content.html(Util.commonUtil.onClickableUrl(content.html(), true));
          content.addClass("esoc-see-more-content");
          if (Util.commonUtil.isTextOverflown(content[0])) {
            this.$el.find(".esoc-user-see-more").show();
          }
        }
      }
    },
    onContentClick: function (e) {
      e.stopPropagation();
      if (this.$el.find(".esoc-user-see-more").is(':visible')) {
        this.showMoreContent(e);
      } else if (this.$el.find(".esoc-user-see-less").is(':visible')) {
        this.showLessContent(e);
      }
    },
    showMoreContent: function (e) {
      if (window.getSelection().toString() === "") {
        this.$el.find(".esoc-user-see-less").show();
        this.$el.find(".esoc-user-see-more").hide();
        this.$el.find(".esoc-user-content").removeClass("esoc-see-more-content");
        $("#esoc-user-focus-element").focus();
      }
    },
    showLessContent: function (e) {
      if (window.getSelection().toString() === "") {
        this.$el.find(".esoc-user-see-less").hide();
        this.$el.find(".esoc-user-see-more").show();
        this.$el.find(".esoc-user-content").addClass("esoc-see-more-content");
        $("#esoc-user-focus-element").focus();
        this.options.parentView.triggerMethod('update:scrollbar');
      }
    },
    cancelUpdateExtendedInfoField: function (e) {
      this.render();
      this.trigger("change:content");
      if (this.model.attributes.content) {
        if (!!this.model.attributes.userInputField) {
          this.$el.find('.esoc-user-messages a').focus();
        } else {
          this.$el.find('.esoc-user-messages').focus();
        }
      } else {
        this.$el.find('.esoc-user-default-content').focus();
      }
      this.showSeeMoreLink(e);
      this.options.parentView.triggerMethod('update:scrollbar');
    },
    onStatusInputFocusIn: function (e) {
      this.$el.find('.esoc-status-header-emoji').addClass('esoc-status-header-emoji-focus');
    },
    onStatusInputFocusOut: function (e) {
      this.$el.find('.esoc-status-header-emoji').removeClass('esoc-status-header-emoji-focus');
    }
  });
  return ExtendedInfoTextFieldView;
});
