/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/controls/tab.panel/impl/tab.link.view',
  'hbs!csui/controls/tab.panel/impl/tab.link.ext',
  'i18n!csui/controls/tab.panel/impl/nls/lang',
  'csui/lib/binf/js/binf'
], function (_, TabLinkView, tabLinkTemplate, lang) {
  "use strict";

  var TabLinkViewExt = TabLinkView.extend({

    template: tabLinkTemplate,
    templateHelpers: function () {
      return {
        required_tooltip: lang.requiredTooltip,
        delete_icon: this.options.delete_icon || 'circle_delete',
        delete_tooltip: this.options.delete_tooltip || lang.deleteTooltip,
        deleteCategoryAria: _.str.sformat(lang.deleteCategoryAria, this.model.get('title'))
      };
    },

    events: {
      'show.binf.tab > a': 'onShowingTab',
      'shown.binf.tab > a': 'onShownTab',
      'focus .cs-delete-icon': 'onFocusDeleteIcon',
      'blur .cs-delete-icon': 'onBlurDeleteIcon',
      'click .cs-tablink-delete': 'onDelete'
    },

    ui: {
      link: '>a',
      deleteIcon: '.cs-delete-icon',
      deleteIconParent: '.cs-tablink-delete'
    },

    constructor: function TabLinkViewExt(options) {
      this.options = options || {};
      TabLinkView.prototype.constructor.apply(this, arguments);

      this.listenTo(this.model, 'action:updated', function () {
        this._setRemoveable();
      });
    },

    onRender: function () {
      this._setRemoveable();
    },

    _setRemoveable: function () {
      if (!!this.model.get('removeable')) {
        this.ui.deleteIcon.addClass('removeable');
        this.ui.deleteIcon.attr('data-cstabindex', '0');
        this.ui.deleteIconParent.removeClass('binf-hidden');
      } else {
        this.ui.deleteIcon.removeClass('removeable');
        this.ui.deleteIcon.removeAttr('data-cstabindex');
        this.ui.deleteIconParent.addClass('binf-hidden');
      }
    },

    onFocusDeleteIcon: function () {
      this.ui.deleteIconParent.addClass('focused');
    },

    onBlurDeleteIcon: function () {
      this.ui.deleteIconParent.removeClass('focused');
    },

    onDelete: function (event) {
      event.preventDefault();
      event.stopPropagation();
      this.deleteCurrentTab();
    },

    deleteCurrentTab: function () {
      if (this.model.get('allow_delete') === true && this.model.get('removeable') === true) {
        this.triggerMethod('delete:tab');
      }
    }

  });

  return TabLinkViewExt;

});
