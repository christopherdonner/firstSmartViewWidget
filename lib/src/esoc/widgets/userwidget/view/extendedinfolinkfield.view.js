/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/handlebars',
  'csui/lib/marionette',
  'esoc/widgets/userwidget/view/extendedinfo.view',
  'esoc/widgets/userwidget/util',
  'hbs!esoc/widgets/userwidget/impl/extendedinfolinkfield',
  'i18n!esoc/widgets/userwidget/nls/lang',
  'csui/lib/perfect-scrollbar'
], function ($, _, Handlebars, Marionette, ExtendedInfoView, Util, ExtendedInfoLinkFieldTemplate,
    Lang) {
  var self = null;
  var ExtendedInfoLinkFieldView = ExtendedInfoView.extend({
    tagName: "div",
    className: 'esoc-user-extended-info-link binf-col-lg-12 binf-col-md-12 binf-col-sm-12 binf-col-xs-12',
    template: ExtendedInfoLinkFieldTemplate,
    util: Util,
    initialize: function (options) {
      this.extendedInfo = options;
      self = this;
    },
    events: {
      'click .esoc-user-update': 'updateExtendedInfoField',
      'click .esoc-user-cancel': 'cancelUpdateExtendedInfoField',
      'click .esoc-user-extended-edit, .esoc-user-default-content': 'onEditClick',
      'mouseenter .esoc-user-links, .esoc-user-default-content-mode': 'showEditLinkForText',
      'mouseleave .esoc-user-links, .esoc-user-default-content-mode': 'hideEditLinkForText',
      'focusin .esoc-user-links': 'showEditLinkForText',
      'focusout .esoc-user-links': 'hideEditLinkForText',
      'keypress .esoc-user-extended-edit-text': 'submitOnEnter'
    },
    constructor: function ExtendedInfoLinkFieldView(options) {
      options = options || {};
      Marionette.ItemView.prototype.constructor.call(this, options);
    },
    onEditClick: function (e) {
      if (this.model.attributes.isEditable) {
        var content = this.model.attributes.content;
        this.$el.find(".esoc-user-extended-view-mode").hide();
        this.$el.find(".esoc-user-extended-edit-mode").show();
        this.$el.find(".esoc-user-extended-edit-input").focus();
        this.$el.find(".esoc-user-label").removeClass("esoc-cursor-pointer");
        this.$el.find(".esoc-user-extended-edit").removeClass('esoc-edit-icon');
        if (content === undefined || content.length === 0) {
          this.$el.find(".esoc-user-extended-edit-input").val(
              this.util.commonUtil.globalConstants.HTTP_LINK);
        }
      }
    },
    updateExtendedInfoField: function (e) {
      var formData  = new FormData(),
          newValue  = this.$el.find(".esoc-user-extended-edit-input").val(),
          regExp    = /(^(https?):\/\/)/i,
          connector = this.options.connector;
      if (newValue.length > 0 && newValue.match(regExp) === null) {
        newValue = this.util.commonUtil.globalConstants.HTTP_LINK + newValue;
        this.$el.find(".esoc-user-extended-edit-input").val(newValue);
      }
      this.$el.find(".esoc-user-extended-edit-mode").addClass("esoc-extendedinfo-update-mask");
      this.$el.find(".esoc-user-extended-edit-input").prop('disabled',
          true);
      formData.append(this.util.commonUtil.globalConstants.ACTION,
          this.util.commonUtil.globalConstants.UPDATE_EXTENDED_INFO);
      formData.append(this.model.attributes.formField, newValue);
      var ajaxParams = {
        "itemview": this,
        "url": this.util.commonUtil.getV2Url(connector.connection.url) +
               this.util.commonUtil.REST_URLS.pulseRestUrl +
               this.model.attributes.userid,
        "type": "POST",
        "data": formData,
        "requestType": "updateExtendedLink",
        "targetElement": $(e.target),
        connector: connector
      };
      this.util.updateAjaxCall(ajaxParams);
    },
    onShow: function () {
      this.addEllipsisOnFocus();
      this.trigger("view:shown");
    },
    cancelUpdateExtendedInfoField: function (e) {
      this.$el.find(".esoc-user-extended-edit-mode").hide();
      this.$el.find(".esoc-user-extended-edit-input").val(this.model.attributes.content);
      this.$el.find(".esoc-user-extended-view-mode").show();
      if (this.model.attributes.content) {
        this.$el.find('.esoc-user-messages a').focus();
      } else {
        this.$el.find('.esoc-user-default-content').focus();
      }
    },
    addEllipsisOnFocus: function () {
      var that = this;
      this.$el.find(".esoc-user-links .esoc-user-messages").each(function (i) {
        if ($(this).innerWidth() < $(this)[0].scrollWidth) {
          that.$el.find(".esoc-user-messages a").addClass("esoc-user-links-ellipsis-onfocus");
        }
      });
    }
  });
  return ExtendedInfoLinkFieldView;
});
