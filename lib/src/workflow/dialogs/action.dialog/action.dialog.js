/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/controls/dialog/dialog.view',
  'csui/dialogs/modal.alert/modal.alert',
  'workflow/widgets/action/action.body/action.body.view',
  'i18n!workflow/dialogs/action.dialog/impl/nls/lang',
  'css!workflow/dialogs/action.dialog/impl/action.dialog'
], function (_, $, Marionette, DialogView, ModalAlert, ActionBodyView, lang) {
  'use strict';

  var ActionDialog = DialogView.extend({
    className: 'workflow-action-dialog',

    constructor: function ActionDialog(options) {
      var self = this;
      this.options = options || {};
      this.model = this.options.model;
      this.action = this.model.get('action');
      if (this.model.get('assignee')) {
        this.userId = this.model.get('assignee').get('id');
      }
      this.texts = options.model.get('texts') || {};
      var buttonArray = [];
      buttonArray.push({
        id: self.action.get('id'),
        label: this.texts.submitLabel || lang.submitButtonLabel,
        toolTip: this.texts.submitLabel || lang.submitButtonLabel,
        disabled: !this._isValidAuthInfoAndValidAssignee(),
        default: true,
        click: function () {
          self.onClickAction();
        }
      })
      ;
      buttonArray.push({
        label: this.texts.cancelLabel || lang.cancelButtonLabel,
        toolTip: this.texts.cancelLabel || lang.cancelButtonLabel,
        close: true,
        click: function () {
          self.model.set('comment', '');
        }
      });
      var title = this.model.get('title');
      if (_.isUndefined(title)) {
        title = _.str.sformat(lang.DialogDefaultTitle, this.action.get('label'));
      }

      _.defaults(options, {
        title: title,
        buttons: buttonArray
      });
      var actionBodyView = new ActionBodyView(options);
      _.extend(options, {
        view: actionBodyView
      });
      DialogView.prototype.constructor.call(this, options);
      this.listenTo(this.model, 'change:assignee', this.onChangedAssignee);

      this.listenTo(this.model, 'change:authentication_info', this.onChangedAuthenticationInfo);
    },

    onChangedAuthenticationInfo: function(){
        this.updateButton(this.action.get('id'), {disabled: !this._isValidAuthInfoAndValidAssignee()});
    },

    onClickAction: function () {
      if (_.isFunction(this.options.callback)) {
        this.options.callback(this.model);
      }
      this.destroy();
    },

    onChangedAssignee: function () {
        this.updateButton(this.action.get('id'), {disabled: !this._isValidAuthInfoAndValidAssignee()});
    },

    _isValidAuthInfo:function (){
      var ret = false;
      if(this.model.get('authentication')) {
        if ((this.model.get('authentication_info')) && (this.model.get('authentication_info').password !== "")) {
           ret = true;
        }
      }
      else{
        ret = true;
      }
      return ret;
    },

    _isValidAssignee: function () {
      var ret = false;
      if (this.model.get('requireAssignee')) {
        if (this.model.get('assignee')) {
          if (this.model.get('assignee').get('id') !== this.userId) {
            ret = true;
          }
        }
      } else{
        ret = true;
      }
      return ret;
    },

    _isValidAuthInfoAndValidAssignee: function(){
      var ret = false;
      if(this._isValidAssignee() && this._isValidAuthInfo()){
        ret = true;
      }
      return ret;
    }

  });

  return ActionDialog;

});
