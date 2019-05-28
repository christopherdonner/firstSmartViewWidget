/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'i18n!csui/widgets/navigation.header/controls/breadcrumbs/impl/nls/localized.strings',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/utils/contexts/factories/application.scope.factory',
  'csui/utils/contexts/factories/next.node', 'csui/lib/radio',
  'hbs!csui/widgets/navigation.header/controls/breadcrumbs/impl/breadcrumbs'
], function (_, $, Marionette, localizedStrings, TabableRegionBehavior,
    ApplicationScopeModelFactory, NextNodeModelFactory, Radio, template) {
  'use strict';

  var BreadcrumbsView = Marionette.ItemView.extend({
    tagName: 'div',

    className: 'breadcrumbs-handle',

    ui: {
      caretShowBreadcrumbs: '.caret-show-breadcrumb',
      btnShowBreadcrumbs: '.btn-show-breadcrumb',
      caretHideBreadcrumbs: '.caret-hide-breadcrumb',
      btnHideBreadcrumbs: '.btn-hide-breadcrumb'
    },

    serializeData: function () {
      return {
        showBreadcrumbs: localizedStrings.ShowBreadcrumbs,
        showBreadcrumbsAria: localizedStrings.ShowBreadcrumbs,
        hideBreadcrumbs: localizedStrings.HideBreadcrumbs,
        hideBreadcrumbsAria: localizedStrings.HideBreadcrumbs,
      };
    },

    template: template,

    triggers: {
      'mouseenter .caret-show-breadcrumb .icon-expandArrowDown': 'mouseenter:caret:show:breadcrumbs',
      'mouseleave .btn-show-breadcrumb': 'mouseleave:btn:show:breadcrumbs',
      'click .caret-show-breadcrumb, .btn-show-breadcrumb': 'click:show:breadcrumbs',
      'mouseenter .caret-hide-breadcrumb .icon-expandArrowUp': 'mouseenter:caret:hide:breadcrumbs',
      'mouseleave .btn-hide-breadcrumb': 'mouseleave:btn:hide:breadcrumbs',
      'click .caret-hide-breadcrumb, .btn-hide-breadcrumb': 'click:hide:breadcrumbs'
    },

    events: {
      'focus': 'onFocus',
      'blur': 'onBlur',
      'keydown': 'onKeyInView'
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    currentlyFocusedElement: function () {
      if (this.isBreadcrumbsHandleVisible()) {
        return this.$el;
      }
      return undefined;
    },

    constructor: function BreadcrumbsView(options) {
      Marionette.ItemView.call(this, options);

      this.ignoreNextMouseleave = false;
      this.ignoreFocusBlur = false;

      this.applicationScope = options.context.getModel(ApplicationScopeModelFactory);
      this.nextNode = options.context.getModel(NextNodeModelFactory);
      this.listenTo(this.applicationScope, 'change:id', this._showOrHideBreadcrumb)
          .listenTo(this, 'show:breadcrumbs', this.onShowBreadcrumbs)
          .listenTo(this, 'hide:breadcrumbs', this.onHideBreadcrumbs)
          .listenTo(this, 'before:destroy', this._stopReplying);
      this._startReplying();
    },

    _startReplying: function () {
      this.breadcrumbsChannel = Radio.channel('csui:breadcrumbs');
      this.breadcrumbsChannel.reply('hide:handle', this.hideBreadcrumbsHandle.bind(this))
                             .reply('arrow:up', this.showBreadcrumbsUpArrow.bind(this))
                             .reply('arrow:down', this.showBreadcrumbsDownArrow.bind(this));
    },

    _stopReplying: function () {
      this.breadcrumbsChannel.stopReplying();
    },

    _showOrHideBreadcrumb: function () {
      var hasNode = this.nextNode && this.nextNode.get('id') !== undefined;
      if (!hasNode) {
        this.options.parentView.triggerMethod('change:breadcrumbs', {isBreadcrumbsEmpty: true});
      }
    },

    onHideBreadcrumbs: function () {
      this.options.parentView.trigger('hide:breadcrumbs');
    },

    onShowBreadcrumbs: function () {
      this.options.parentView.trigger('show:breadcrumbs');
    },

    onFocus: function () {
      if (!this.ignoreFocusBlur) {
        if (this.breadcrumbVisible) {
          this.onMouseenterCaretHideBreadcrumbs();
        } else {
          this.onMouseenterCaretShowBreadcrumbs();
        }
      }
    },

    onBlur: function () {
      if (!this.ignoreFocusBlur) {
        if (this.breadcrumbVisible) {
          this.onMouseleaveBtnHideBreadcrumbs();
        } else {
          this.onMouseleaveBtnShowBreadcrumbs();
        }
      }
    },

    onKeyInView: function (event) {
      switch (event.keyCode) {
      case 9:
        this.ignoreFocusBlur = false;
        break;
      case 13:
      case 32:
        this.ignoreFocusBlur = false;
        if (this.breadcrumbVisible) {
          this.trigger('hide:breadcrumbs');
        } else {
          this.trigger('show:breadcrumbs');
        }
        break;
      }
    },

    onClickHideBreadcrumbs: function () {
      this.ignoreNextMouseleave = true;
      this.trigger('hide:breadcrumbs');
    },

    onClickShowBreadcrumbs: function () {
      this.ignoreNextMouseleave = true;
      this.trigger('show:breadcrumbs');
    },

    onMouseenterCaretShowBreadcrumbs: function () {
      this.ignoreFocusBlur = true;
      this.ui.caretShowBreadcrumbs.css({display: 'none'});
      this.ui.caretHideBreadcrumbs.css({display: 'none'});
      this.ui.btnHideBreadcrumbs.css({display: 'none'});
      this.ui.btnShowBreadcrumbs.css({display: 'block'});
    },

    onMouseleaveBtnShowBreadcrumbs: function () {
      this.ignoreFocusBlur = false;
      if (!this.ignoreNextMouseleave) {
        this.ui.btnShowBreadcrumbs.css({display: 'none'});
        this.ui.btnHideBreadcrumbs.css({display: 'none'});
        this.ui.caretHideBreadcrumbs.css({display: 'none'});
        this.ui.caretShowBreadcrumbs.css({display: 'block'});
      }
      else {
        this.ignoreNextMouseleave = false;
      }
    },

    onMouseenterCaretHideBreadcrumbs: function () {
      this.ignoreFocusBlur = true;
      this.ui.caretHideBreadcrumbs.css({display: 'none'});
      this.ui.caretShowBreadcrumbs.css({display: 'none'});
      this.ui.btnShowBreadcrumbs.css({display: 'none'});
      this.ui.btnHideBreadcrumbs.css({display: 'block'});
    },

    onMouseleaveBtnHideBreadcrumbs: function () {
      this.ignoreFocusBlur = false;
      if (!this.ignoreNextMouseleave) {
        this.ui.btnHideBreadcrumbs.css({display: 'none'});
        this.ui.btnShowBreadcrumbs.css({display: 'none'});
        this.ui.caretShowBreadcrumbs.css({display: 'none'});
        this.ui.caretHideBreadcrumbs.css({display: 'block'});
      }
      else {
        this.ignoreNextMouseleave = false;
      }
    },

    isBreadcrumbsHandleVisible: function () {
      return this.ui.btnHideBreadcrumbs.css('display') !== 'none' ||
             this.ui.caretHideBreadcrumbs.css('display') !== 'none' ||
             this.ui.btnShowBreadcrumbs.css('display') !== 'none' ||
             this.ui.caretShowBreadcrumbs.css('display') !== 'none';
    },

    hideBreadcrumbsHandle: function () {
      this.ui.btnHideBreadcrumbs.css({display: 'none'});
      this.ui.caretHideBreadcrumbs.css({display: 'none'});
      this.ui.btnShowBreadcrumbs.css({display: 'none'});
      this.ui.caretShowBreadcrumbs.css({display: 'none'});
      this.triggerMethod("refresh:tabindexes");
    },

    showBreadcrumbsUpArrow: function () {
      this.breadcrumbVisible = true;
      this.hideBreadcrumbsHandle();
      this.ui.caretHideBreadcrumbs.css({display: 'block'});
      this.triggerMethod("refresh:tabindexes");
    },

    showBreadcrumbsDownArrow: function () {
      this.breadcrumbVisible = false;
      this.hideBreadcrumbsHandle();
      this.ui.caretShowBreadcrumbs.css({display: 'block'});
      this.triggerMethod("refresh:tabindexes");
    }
  });

  return BreadcrumbsView;
});
