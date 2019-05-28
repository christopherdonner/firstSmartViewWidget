csui.define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/controls/form/form.view',
  'esoc/widgets/userwidget/util',
  'hbs!esoc/controls/form/view.simple.user.info/impl/view.simple.user.form'
], function (_, $, FormView, Util, formTemplate) {
  

  var ViewSimpleUserForm = FormView.extend({

    className: 'cs-form esoc-simple-user-widget-view-form',
    formTemplate: formTemplate,
    util: Util,
    formTemplateHelpers: function () {
      return {
        cid: this.model.cid
      };
    },

    constructor: function ViewSimpleUserForm(options) {
      FormView.prototype.constructor.call(this, options);
      this.listenTo(this, 'change:field', this._saveField);
      this.onWinResize = _.bind(this.windowResize, this);
      $(window).bind("resize.app", this.onWinResize);
      this.originalHeight = 0;
    },
    windowResize: function () {
      this.formHeight();
      this.triggerMethod('dom:refresh');
    },
    formHeight: function () {
      if (this.originalHeight === 0) {
        this.originalHeight = $(
            '.esoc-simple-user-widget-body .tab-links-bar > .esoc-simple-user-widget-form-body').length >
                              0 ? $('.esoc-simple-user-widget-form-content').height() + 52 :
                              $('.esoc-simple-user-widget-body').height();
      }
      //Added extra 2px to height, because top and bottom borders of popover had 1px
      $('.esoc-simple-user-widget-dialog .binf-modal-content').css('height',
          ( this.originalHeight + $('.esoc-simple-user-widget-header').height() +
            $('.esoc-simple-user-widget-dialog .esoc-simple-user-widget-footer').height() + 2));
      $('.esoc-simple-user-widget-body').css('height',
          ( $('.esoc-simple-user-widget-dialog .binf-modal-content').height() - $('.esoc-simple-user-widget-header').height() -
            $('.esoc-simple-user-widget-dialog .esoc-simple-user-widget-footer').height()));
      if ($('.esoc-simple-user-widget-body .tab-links-bar > .esoc-simple-user-widget-form-body').length > 0) {
        $('.esoc-simple-user-widget-form-body').css('height', $('.esoc-simple-user-widget-body').height() - 48);
      }
      $('.esoc-simple-user-widget-dialog .esoc-simple-user-widget-footer').css('display', 'block');
      this.options.orginatingView.triggerMethod('update:scrollbar');
    },
    onRenderForm: function () {
      this.formHeight();
      this.handleManagerAttributes();
      this.options.orginatingView.trigger("view:shown");
    },
    _getLayout: function () {
      var template = this.getOption('formTemplate'),
          html     = template.call(this, {
            data: this.alpaca.data,
            mode: this.mode
          }),
          bindings = this._getBindings(),
          view     = {
            parent: 'bootstrap-csui',
            layout: {
              template: html,
              bindings: bindings
            }
          };
      return view;
    },
    _getBindings: function () {
      var bindings = {
        reportsToID: _.str.sformat('reportsToID-{0}', this.model.cid),
        OfficeLocation: _.str.sformat('OfficeLocation-{0}', this.model.cid),
        MailAddress: _.str.sformat('MailAddress-{0}', this.model.cid),
        Contact: _.str.sformat('Contact-{0}', this.model.cid),
        CellularPhone: _.str.sformat('CellularPhone-{0}', this.model.cid)
      };
      return bindings;
    },
    _saveField: function (args) {
      var formData  = new FormData(),
          newValue  = args.value,
          connector = this.model.connector;
      if (args.name == 'reportsToID') {
        formData.append(this.util.commonUtil.globalConstants.ACTION,
            this.util.commonUtil.globalConstants.UPDATE_EXTENDED_INFO);
        formData.append("reportsTo", newValue);

        var ajaxParams = {
          "itemview": this,
          "url": this.util.commonUtil.getV2Url(connector.connection.url) +
                 this.util.commonUtil.REST_URLS.pulseRestUrl +
                 args.model.attributes.userId,
          "type": "PUT",
          "data": formData,
          connector: connector
        };
      }
      else {
        switch (args.name) {
        case 'OfficeLocation':
          formData.append("office_location", newValue);
          break;
        case 'MailAddress':
          formData.append("business_email", newValue);
          break;
        case 'Contact':
          formData.append("business_phone", newValue);
          break;
        case 'CellularPhone':
          formData.append("cell_phone", newValue);
          break;
        }

        var ajaxParams = {
          "itemview": this,
          "url": this.util.commonUtil.getV2Url(connector.connection.url) +
                 "/members/" +
                 args.model.attributes.userId,
          "type": "PUT",
          "data": formData,
          connector: connector
        };
      }
      this.util.updateAjaxCall(ajaxParams);
      this.handleManagerAttributes();
    },
    handleManagerAttributes: function () {
      this.$el.find(".cs-field-read-inner button").attr("tabindex", "0");
      this.$el.find(".esoc-user-container").bind("keypress", function (e) {
        e.stopPropagation();
      });
    }

  });

  return ViewSimpleUserForm;

});



