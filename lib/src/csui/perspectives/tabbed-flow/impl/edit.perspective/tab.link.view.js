/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/controls/tab.panel/impl/tab.link.view',
  'hbs!csui/perspectives/tabbed-flow/impl/edit.perspective/tab.link',
  'i18n!csui/perspectives/tabbed-flow/impl/nls/lang',
  'csui/lib/binf/js/binf',
  'css!csui/perspectives/tabbed-flow/impl/edit.perspective/tab.link',
], function (_, TabLinkView, tabLinkTemplate, lang) {
  var EditPerspectiveTabLink = TabLinkView.extend({
    template: tabLinkTemplate,

    templateHelpers: function () {
      return {
        removeTab: lang.removeTab
      };
    },

    className: function () {
      return this._isOptionActiveTab() ? 'pman-edit-tab binf-active' : 'pman-edit-tab';
    },

    events: function () {
      return _.extend(TabLinkView.prototype.events, {
        'click @ui.link': '_onShowTab',
        'dblclick @ui.tabLink': '_onTabClick',
        'keyup @ui.editInput': '_onInputKeydown',
        'focusout @ui.editInput': '_onInputFocusOut',
        'click @ui.tabRemove': '_onTabRemove'
      });
    },

    ui: function () {
      return _.extend(TabLinkView.prototype.ui, {
        'editInput': '.csui-pman-editinput',
        'tabLink': '.cs-tablink-text',
        'tabRemove': '.cs-delete-icon'
      });
    },

    _onShowTab: function (event) {
      if (!this.model.get('title')) {
        event.preventDefault();
        event.stopPropagation();
      }
    },

    _onTabRemove: function () {
      var self = this;
      require(['csui/dialogs/modal.alert/modal.alert'], function (alertDialog) {
        alertDialog.confirmQuestion(lang.deleteConfirmMsg, lang.deleteConfirmTitle)
            .done(function (yes) {
              if (yes) {
                self._doRemoveTab();
              }
            });
      });
    },

    _doRemoveTab: function () {
      if (!this.model.get('title')) {
        this.trigger('enable:addTab');
      }
      this.trigger('remove:tab', this.model);
    },

    _onTabClick: function (event) {
      event.preventDefault();
      event.stopPropagation();
      this._editTab();
    },

    _editTab: function () {
      var text;
      if (this.ui.tabLink.text()) {
        text = this.ui.tabLink.text();
        this.ui.editInput.val(text);
      }
      else {
        text = lang.newTabInput;
        this.ui.editInput.attr('placeholder', lang.newTabInput);
      }
      this._adjustInputWidth(text);
      this._setEdit(true);
    },

    _adjustInputWidth: function (text) {
      this.ui.editInput.css('width', ( ((text.length + 1) * 8) + 5 + 'px'));
    },

    _setEdit: function (isEdit) {
      if (isEdit) {
        this.ui.tabLink.addClass('binf-hidden');
        this.ui.editInput.removeClass('binf-hidden');
        this.ui.editInput.focus();
      } else {
        this.ui.tabLink.removeClass('binf-hidden');
        this.ui.editInput.addClass('binf-hidden');
      }
    },

    _onInputFocusOut: function () {
      if (!this.model.get('title')) {
        this._doRemoveTab();
        return;
      }
      this._setEdit(false);
      this.trigger('enable:addTab');
    },

    _onInputKeydown: function (event) {
      var value = event.target.value;
      this._adjustInputWidth(value);
      if ((!value || value.length === 0) && (event.which == 13 || event.which == 27)) {
        this._doRemoveTab();
        return;
      }
      switch (event.which) {
      case 13:
        this._setTabTitle(value);
        break;
      case 27:
        this._setEdit(false);
        break;
      }
    },

    _setTabTitle: function (newTitle) {
      this.ui.tabLink.text(newTitle);
      this.model.set('title', newTitle);
      this._setEdit(false);
    },

    onShow: function () {
      if (!this.model.get('title')) {
        this.trigger('disable:addTab');
        this._editTab();
      }
    },

    constructor: function EditPerspectiveTabLink() {
      TabLinkView.prototype.constructor.apply(this, arguments);
    }
  });
  return EditPerspectiveTabLink;
});