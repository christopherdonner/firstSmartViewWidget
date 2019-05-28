/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/marionette', 'csui/utils/log', 'csui/utils/base',
  'hbs!csui/dialogs/modal.alert/impl/modal.alert',
  'i18n!csui/dialogs/modal.alert/impl/nls/lang',
  'csui/behaviors/keyboard.navigation/tabkey.behavior',
  'csui/lib/binf/js/binf',
  'css!csui/dialogs/modal.alert/impl/modal.alert',
  'css!csui/controls/globalmessage/globalmessage_icons'
], function (module, _, $, Marionette, log, base, template, lang, TabKeyBehavior) {

  log = log(module.id);

  var ModalAlertView = Marionette.ItemView.extend({

    className: function () {
      var className = 'csui-alert cs-dialog binf-modal binf-fade';
      if (this.options.modalClass) {
        className += ' ' + this.options.modalClass;
      }
      return className;
    },

    template: template,

    ui: {
      defaultButton: '.binf-modal-footer > .csui-default'
    },

    triggers: {
      'click .csui-yes': 'click:yes',
      'click .csui-no': 'click:no'
    },

    events: {
      'shown.binf.modal': 'onShown',
      'hide.binf.modal': 'onHiding',
      'hidden.binf.modal': 'onHidden',
      'keydown': 'onKeyDown'
    },
    behaviors: {
      TabKeyBehavior: {
        behaviorClass: TabKeyBehavior,
        recursiveNavigation: true
      }
    },

    constructor: function ModalAlertView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      options = this.options;
      var buttonLabels = _.reduce(ModalAlertView.buttonLabels, function (result, value, key) {
        result['label' + key] = value;
        return result;
      }, {});
      options.buttons = _.defaults({}, _.isEmpty(options.buttons) ?
                                       ModalAlertView.buttons.Close :
                                       options.buttons, buttonLabels);
      _.defaults(options, ModalAlertView.defaultOptions.Information, {
        centerVertically: true,
        showHeader: options.title !== ''
      });
      this._deferred = $.Deferred();
    },

    templateHelpers: function () {
      var templateVals = _(this.options).clone();
      templateVals.dlgTitleId = _.uniqueId('dlgTitle'); //
      templateVals.dlgMsgId = _.uniqueId('dlgMsg');
      return templateVals;
    },

    show: function () {
      this.render();
      this.$el.attr('tabindex', 0);
      if (this.options.centerVertically) {
        this.centerVertically();
      }
      this.$el.binf_modal('show');
      this.triggerMethod('show');
      var promise = this._deferred.promise(),
          self    = this;
      promise.close = function () {
        self.$el.binf_modal('hide');
        return promise;
      };
      return promise;
    },

    centerVertically: function () {
      var $clone;
      var top;
      $clone = this.$el.clone();
      $clone.css('display', 'block');
      $clone.appendTo($.fn.binf_modal.getDefaultContainer());
      top = Math.round(($clone.height() - $clone.find('.binf-modal-content').height()) / 2);
      top = top > 0 ? top : 0;

      $clone.remove();
      this.$el.find('.binf-modal-content').css("margin-top", top);
    },

    onShown: function () {
      this._deferred.notify({state: 'shown'});
      this._setTabFocus(false);
    },

    onHiding: function () {
      this._deferred.notify({state: 'hiding'});
    },

    onHidden: function (event) {
      this.destroy();
      if (this.options.callback) {
        this.options.callback(this._result);
      }
      if (this._result) {
        this._deferred.resolve(this._result);
      } else {
        this._deferred.reject(this._result);
      }
    },

    onKeyDown: function (event) {
      var keyCode = event.keyCode;
      switch (keyCode) {
      case 13:
        if (event.target === this.el) {
          this.ui.defaultButton.click();
        }
        else {
          $(event.target).click();
        }
        break;
      case 9:
        return this._setTabFocus(event.shiftKey);
      }
    },

    onClickYes: function () {
      this._result = true;
    },

    onClickNo: function () {
      this._result = false;
    },
    _setTabFocus: function (tabShift) {
      var tabElements = this.$('*[tabindex=0]'),
          lastIndex   = tabElements.length - 1,
          i           = this._getStartIndex(lastIndex, tabShift, tabElements);
      if (lastIndex > -1) {
        var activeIndex = ( this.activeIndex !== undefined ) ? this.activeIndex :
                          (tabShift ? 0 : lastIndex);
        do {
          var $tabElem = $(tabElements[i]);
          if (base.isVisibleInWindowViewport($tabElem)) {
            this.activeIndex = i;
            $tabElem.focus();
            break;
          }
          if (tabShift) {
            i = (i === 0) ? lastIndex : i - 1;
          }
          else {
            i = ( i === lastIndex) ? 0 : i + 1;
          }
        }
        while (i != activeIndex);
      }
      return false;
    },
    _getStartIndex: function (lastIndex, tabShift) {
      var startIndex  = 0,
          activeIndex = this.activeIndex;
      if (tabShift) {
        startIndex = lastIndex;
        if (activeIndex !== undefined && activeIndex > 0) {
          startIndex = this.activeIndex - 1;
        }
      }
      else {
        if (activeIndex !== undefined && activeIndex < lastIndex) {
          startIndex = activeIndex + 1;
        }
      }
      return startIndex;
    }

  }, {

    defaultOptions: {
      Success: {
        title: lang.DefaultSuccessTitle,
        titleIcon: 'csui-icon-notification-success-white',
        showTitleIcon: true,
        titleCloseIcon: 'csui-icon-dismiss-white',
        showTitleCloseButton: false,
        headerClass: 'success-header'
      },
      Information: {
        title: lang.DefaultInfoTitle,
        titleIcon: 'csui-icon-notification-information-white',
        showTitleIcon: true,
        titleCloseIcon: 'csui-icon-dismiss-white',
        showTitleCloseButton: false,
        headerClass: 'info-header'
      },
      Warning: {
        title: lang.DefaultWarningTitle,
        titleIcon: 'csui-icon-notification-warning-white',
        showTitleIcon: true,
        titleCloseIcon: 'csui-icon-dismiss-white',
        showTitleCloseButton: false,
        headerClass: 'warning-header'
      },
      Error: {
        title: lang.DefaultErrorTitle,
        titleIcon: 'csui-icon-notification-error-white',
        showTitleIcon: true,
        titleCloseIcon: 'csui-icon-dismiss-white',
        showTitleCloseButton: false,
        headerClass: 'error-header'
      },
      Message: {
        title: lang.DefaultMessageTitle,
        titleIcon: '',
        showTitleIcon: false,
        titleCloseIcon: 'csui-icon-dismiss',
        showTitleCloseButton: false,
        headerClass: 'message-header'
      },
      Question: {
        title: lang.DefaultQuestionTitle,
        titleIcon: 'csui-icon-notification-confirmation-white',
        showTitleIcon: true,
        titleCloseIcon: 'csui-icon-dismiss-white',
        showTitleCloseButton: false,
        headerClass: 'question-header'
      }
    },

    buttons: {
      YesNoCancel: {
        showYes: true,
        showNo: true,
        showCancel: true
      },
      YesNo: {
        showYes: true,
        showNo: true,
        showCancel: false
      },
      OkCancel: {
        showYes: true,
        labelYes: lang.OkButtonLabel,
        showNo: false,
        showCancel: true
      },
      Ok: {
        showYes: true,
        labelYes: lang.OkButtonLabel,
        showNo: false,
        showCancel: false
      },
      Cancel: {
        showYes: false,
        showNo: false,
        showCancel: true
      },
      Close: {
        showYes: false,
        showNo: false,
        showCancel: true,
        labelCancel: lang.CloseButtonLabel
      }
    },

    buttonLabels: {
      Yes: lang.YesButtonLabel,
      No: lang.NoButtonLabel,
      Ok: lang.OkButtonLabel,
      Cancel: lang.CancelButtonLabel,
      Close: lang.CloseButtonLabel
    },

    showSuccess: function (callback, message, title, options) {
      options = this._makeOptions(arguments, ModalAlertView.defaultOptions.Success,
          ModalAlertView.buttons.Close);
      return this._show(options);
    },

    showInfo: function (callback, message, title, options) {
      this.showInformation.apply(this, arguments);
    },

    showInformation: function (callback, message, title, options) {
      options = this._makeOptions(arguments, ModalAlertView.defaultOptions.Information,
          ModalAlertView.buttons.Close);
      return this._show(options);
    },

    showWarning: function (callback, message, title, options) {
      options = this._makeOptions(arguments, ModalAlertView.defaultOptions.Warning,
          ModalAlertView.buttons.Close);
      return this._show(options);
    },

    showError: function (callback, message, title, options) {
      options = this._makeOptions(arguments, ModalAlertView.defaultOptions.Error,
          ModalAlertView.buttons.Close);
      return this._show(options);
    },

    showMessage: function (callback, message, title, options) {
      options = this._makeOptions(arguments, ModalAlertView.defaultOptions.Message,
          ModalAlertView.buttons.Close);
      return this._show(options);
    },

    confirmSuccess: function (callback, message, title, options) {
      options = this._makeOptions(arguments, ModalAlertView.defaultOptions.Success,
          ModalAlertView.buttons.YesNo);
      return this._show(options);
    },

    confirmInfo: function (callback, message, title, options) {
      log.warn('The method \'configInfo\' has been deprecated and will be removed.' +
               '  Use \'configInformation\' instead.') && console.warn(log.last);
      log.warn('Occurred ' + log.getStackTrace(2)) && console.warn(log.last);
      this.confirmInformation.apply(this, arguments);
    },

    confirmInformation: function (callback, message, title, options) {
      options = this._makeOptions(arguments, ModalAlertView.defaultOptions.Information,
          ModalAlertView.buttons.YesNo);
      return this._show(options);
    },

    confirmWarning: function (callback, message, title, options) {
      options = this._makeOptions(arguments, ModalAlertView.defaultOptions.Warning,
          ModalAlertView.buttons.YesNo);
      return this._show(options);
    },

    confirmError: function (callback, message, title, options) {
      options = this._makeOptions(arguments, ModalAlertView.defaultOptions.Error,
          ModalAlertView.buttons.YesNo);
      return this._show(options);
    },

    confirmQuestion: function (callback, message, title, options) {
      options = this._makeOptions(arguments, ModalAlertView.defaultOptions.Question,
          ModalAlertView.buttons.YesNo);
      return this._show(options);
    },

    confirmMessage: function (callback, message, title, options) {
      options = this._makeOptions(arguments, ModalAlertView.defaultOptions.Message,
          ModalAlertView.buttons.YesNo);
      return this._show(options);
    },

    _makeOptions: function (parameters, defaultOptions, defaultButtons) {
      var callback = parameters[0],
          message  = parameters[1],
          title    = parameters[2],
          options  = parameters[3];
      if (typeof callback !== 'function') {
        options = title;
        title = message;
        message = callback;
        callback = undefined;
      }
      if (typeof message === 'object') {
        options = _.clone(message);
      } else if (typeof title === 'object') {
        options = _.defaults({message: message}, title);
      } else {
        options = _.defaults({
          message: message,
          title: title
        }, options);
      }
      options.buttons = _.defaults({}, options.buttons, defaultButtons);
      options.callback = callback;
      defaultOptions.closeButtonAria = lang.CloseButtonAria;
      return _.defaults(options, defaultOptions);
    },

    _show: function (options) {
      var alert = new ModalAlertView(options);
      return alert.show();
    }

  });

  return ModalAlertView;

});
