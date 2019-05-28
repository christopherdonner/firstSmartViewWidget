/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/utils/base',
  'csui/controls/dialog/dialog.view',
  'i18n',
  'csui/models/permission/nodepermission.model',
  'csui/widgets/permissions/impl/edit/permission.level.selector/permission.level.selector.view',
  'csui/widgets/permissions/impl/edit/permission.attributes/permission.attributes.view',
  'csui/widgets/permissions/impl/edit/apply.permission/apply.permission.view',
  'csui/widgets/permissions/impl/edit/apply.permission/impl/header/apply.permission.header.view',
  'csui/controls/progressblocker/blocker',
  'i18n!csui/widgets/permissions/impl/nls/lang'
], function (_,
    $,
    Marionette,
    base,
    DialogView,
    i18n,
    NodePermissionModel,
    PermissionLevelSelectorView,
    PermissionAttributesView,
    ApplyPermissionView,
    ApplyPermissionHeaderView,
    BlockingView,
    lang) {
  "use strict";

  var EditPermissionHelper = Marionette.Object.extend({

    constructor: function EditPermissionHelper(options) {
      Marionette.Object.prototype.constructor.apply(this, arguments);
    },

    initialize: function (options) {
      this.uniqueViewId = 'view' + _.uniqueId();
      if (!this.options.readonly) {
        this._showSelectPermissionLevelPopover();
      }
    },

    _showSelectPermissionLevelPopover: function () {
      this.permissionLevelSelectorView && this.permissionLevelSelectorView.destroy();
      this.permissionLevelSelectorView = new PermissionLevelSelectorView({
        permissionModel: this.options.permissionModel
      });
      this.permissionLevelSelectorView.render();
      this.listenTo(this.permissionLevelSelectorView, 'permission:level:selected',
          this._permissionLevelSelected);

      this.currentPopoverView = this.permissionLevelSelectorView;
      this.popoverContainerClassname = "";
      this.showPopover();
    },

    showCustomPermissionPopover: function () {
      this.permissionAttributesView && this.permissionAttributesView.destroy();
      this.permissionAttributesView = new PermissionAttributesView({
        model: this.options.permissionModel,
        readonly: this.options.readonly,
        node: this.options.originatingView && this.options.originatingView.model
      });
      this.permissionAttributesView.render();
      this.listenTo(this.permissionAttributesView, 'permission:attribute:save:clicked',
          this._permissionAttributesSelected);

      this.listenTo(this.permissionAttributesView, 'permission:attribute:cancel:clicked',
          this.closePopover);

      this.currentPopoverView = this.permissionAttributesView;
      this.popoverContainerClassname = "csui-permission-attribute-popover-container ";
      this.showPopover();
    },

    _permissionLevelSelected: function () {
      var selectedLevel = this.permissionLevelSelectorView.selected;
      if (selectedLevel !== NodePermissionModel.PERMISSION_LEVEL_CUSTOM) {
        this.showingPopover && this.closePopover(true);
        this.permissions = NodePermissionModel.getPermissionsByLevelExceptCustom(selectedLevel, this.options.originatingView ?  this.options.originatingView.model.get('container') : true);
        if (this.options.originatingView && this.options.originatingView.model &&
            this.options.originatingView.model.get("container") &&
            this.options.originatingView.model.get("permissions_model") === "advanced") {
          this._applyDialog = this.showApplyPermissionDialog();
          this._applyDialog.show();
        } else {
          this.triggerMethod('permissions:selected', {permissions: this.permissions});
        }
      } else {
        this.showCustomPermissionPopover();
      }
    },

    showApplyPermissionDialog: function () {
      var headerView = new ApplyPermissionHeaderView();
      this._view = new ApplyPermissionView({
        context: this.options.originatingView.context,
        model: this.options.originatingView.model,
        applyTo: this.options.applyTo,
        permissionModel: this.options.permissionModel
      });
      var dialog = new DialogView({
        headerView: headerView,
        view: this._view,
        className: "csui-permissions-apply-dialog",
        midSize: true,
        buttons: [
          {
            id: 'apply',
            label: lang.applyButtonLabel,
            toolTip: lang.applyButtonLabel,
            'default': true,
            click: _.bind(this.onClickApplyButton, this)
          },
          {
            label: lang.cancelButtonLabel,
            toolTip: lang.cancelButtonLabel,
            close: true
          }
        ]
      });
      dialog.listenTo(dialog, 'hide', _.bind(this.onHideDialog, this));
      BlockingView.imbue(dialog);
      return dialog;
    },

    onClickApplyButton: function (event) {
      var selectedSubItems = event.dialog.$el.find(".csui-subtypes-option:checked").map(
          function () {
            return this.value;
          }).toArray(),
          container        = event.dialog.options.view.model.get("container"),
          right_id         = event.dialog.options.view.options.permissionModel &&
                             event.dialog.options.view.options.permissionModel.get("right_id"),
          permissionModel  = event.dialog.options.view.model.get("permissions_model"),
          apply_to         = (container && permissionModel === "advanced") &&
                             event.dialog.options.view.subFolderSelected ? 2 :
                             (container && permissionModel === "advanced") ? 3 : 0;

      var deferredResp = this.triggerMethod('permissions:selected',
          {
            permissions: this.permissions,
            apply_to: apply_to,
            right_id: right_id,
            include_sub_types: selectedSubItems
          });
      this._applyDialog.destroy();
      this._blockActions();
    },

    onHideDialog: function () {
      var origView = this.options.originatingView;
      origView && origView.trigger("unblock:view:actions");
    },

    _blockActions: function () {
      var origView = this.options.originatingView;
      origView && origView.blockActions && origView.blockActions();
    },

    _unblockActions: function () {
      var origView = this.options.originatingView;
      origView && origView.unblockActions && origView.unblockActions();
    },

    unblockActions: function () {
      this._unblockActions();
    },

    _permissionAttributesSelected: function (permissions) {
      this.permissions = permissions;
      this.showingPopover && this.closePopover(true);
      if (this.options.originatingView && this.options.originatingView.model &&
          this.options.originatingView.model.get("container")) {
        this._applyDialog = this.showApplyPermissionDialog();
        this._applyDialog.show();
      } else {
        this.triggerMethod('permissions:selected', {permissions: this.permissions});
      }
    },

    showPopover: function () {
      var placement = this.options.popoverPlacement,
          isRtl     = false;
      if (i18n && i18n.settings.rtl) {
        placement = (placement === 'left') ? 'right' : 'left';
        isRtl = true;
      }

      var popoverOptions = {
        html: true,
        content: _.bind(function () {
          return this.currentPopoverView.el;
        }, this),
        trigger: 'manual',
        placement: placement
      };

      if (this.options.popoverAtBodyElement) {
        this.popoverContainerClassname += 'csui-edit-permission-popover-container ' +
                                          this.uniqueViewId;
        this.popoverContainerSelector = '.csui-edit-permission-popover-container.' +
                                        this.uniqueViewId;
        if (!this.$popoverEl) {
          $('body').append(
              '<div class="binf-widgets ' + this.popoverContainerClassname + '"></div>');
        } else {
          this._getPopoverParent().addClass(this.popoverContainerClassname);
        }
        popoverOptions = _.extend(popoverOptions, {container: this.popoverContainerSelector});
      }
      this.$popoverEl = this.options.popoverTragetElement;
      this.$popoverEl.binf_popover(popoverOptions).binf_popover('show');
      var $popoverDiv  = this._getPopoverParent().find('.binf-popover'),
          adjustSplitsHeight,
          adjustSplitsRight,
          adjustSplitsSeparator,
          adjustSplits = this._getPopoverParent().find('.binf-popover').find(".csui-tree-split"),
          adjustedLeft;
      for (var i = adjustSplits.length - 1, j = 0; i >= 0, j < adjustSplits.length; i--, j++) {
        adjustSplitsRight = $(adjustSplits[i]).width() * j;
        adjustSplitsSeparator = $(adjustSplits[i]).closest(".csui-tree-child").find(
            '.csui-separator');
        if (adjustSplits[i] === adjustSplits[adjustSplits.length - 1]) {
          adjustSplitsHeight = $popoverDiv.find('.csui-permission-attribute-tree').outerHeight();
        } else {
          adjustSplitsHeight = Math.round(($(adjustSplits[i]).closest("li").position().top) +
                                          $(adjustSplits[i]).closest(
                                              ".csui-tree-child").outerHeight());
          adjustSplitsRight = adjustSplitsRight + j;
        }
        if (isRtl) {
          $(adjustSplits[i]).css({'height': adjustSplitsHeight, 'left': adjustSplitsRight});
          adjustSplitsSeparator.css({
            'width': ($popoverDiv.find('.csui-tree-container').width() - adjustSplitsRight),
            'left': adjustSplitsRight
          });
          $(adjustSplits[i]).closest('.csui-tree-child').css(
              {'padding-left': adjustSplitsRight + $(adjustSplits[i]).width()});
        }
        else {
          $(adjustSplits[i]).css({'height': adjustSplitsHeight, 'right': adjustSplitsRight});
          adjustSplitsSeparator.css({
            'width': ($popoverDiv.find('.csui-tree-container').width() - adjustSplitsRight),
            'right': adjustSplitsRight
          });
          $(adjustSplits[i]).closest('.csui-tree-child').css(
              {'padding-right': adjustSplitsRight + $(adjustSplits[i]).width()});
        }
      }
      if (i18n && i18n.settings.rtl) {
        adjustedLeft = parseInt($popoverDiv.css('left')) + $popoverDiv.find('.binf-arrow').outerWidth();
      } else {
        adjustedLeft = parseInt($popoverDiv.css('left')) - $popoverDiv.find('.binf-arrow').outerWidth();
      }
      $popoverDiv.css('left', adjustedLeft);
      this.$popoverEl.on('shown.binf.popover', _.bind(function (event) {
        if (this.currentPopoverView && this.currentPopoverView.currentlyFocusedElement) {
          this.currentPopoverView.currentlyFocusedElement().focus();
        }
        $(document).on('mousedown.' + this.uniqueViewId, {view: this}, this._handleClickEvent);
        $(window).bind('resize.' + this.uniqueViewId, {view: this}, this._onWindowResize);
        if (this.options.popoverAtBodyElement) {
          $(document).on('scroll', {view: this}, this._handleScrollEvent);
          this.options.originatingView &&
          this.listenToOnce(this.options.originatingView, 'scroll', function (event) {
            event.data = {view: this};
            this._handleScrollEvent(event);
          });
        }
        $('body').on('keydown.' + this.uniqueViewId, {view: this}, this._handleKeyEvents);
        this.triggerMethod('shown:permission:level:popover');
      }, this));

      this.$popoverEl.on('hidden.binf.popover', _.bind(function (event) {
        this.$popoverEl.focus();
        this.currentPopoverView && this.currentPopoverView.destroy();
        this.currentPopoverView = undefined;
        this.options.popoverAtBodyElement && $(this.popoverContainerSelector).remove();
      }, this));

      this.showingPopover = true;
    },

    _onWindowResize: function (event) {
      if (event && event.data && event.data.view) {
        var self = event.data.view;
        self.showingPopover && self.closePopover();
      }
    },

    _handleKeyEvents: function (event) {
      if (event && event.data && event.data.view) {
        var self = event.data.view;
        if ((self.getOption("readonly") && (event.keyCode === 9 || event.keyCode === 13)) ||
            event.keyCode === 27) {
          self.showingPopover && self.closePopover();
        }
      }
    },

    _handleClickEvent: function (event) {
      if (!$(event.target).closest('.binf-popover').length) {
        var self;
        if (event && event.data && event.data.view) {
          self = event.data.view;
          $(document).off('mousedown.' + this.uniqueViewId, self._handleClickEvent);
        }
        self && self.closePopover();
      }
    },

    _handleScrollEvent: function (event) {
      if (!$(event.target).closest('.binf-popover').length) {
        var self;
        if (event && event.data && event.data.view) {
          self = event.data.view;
          $(document).off('scroll', self._handleScrollEvent);
        }
        self && self.closePopover();
      }
    },

    closePopover: function (triggerNoEvent) {
      if (this.$popoverEl && this.$popoverEl.data('binf.popover')) {
        $(document).off('mousedown.' + this.uniqueViewId, this._handleClickEvent);
        $(document).off('scroll', this._handleScrollEvent);
        $(window).unbind('resize.' + this.uniqueViewId, this._onWindowResize);
        this.currentPopoverView &&
        this.currentPopoverView.$el.off('keydown', this._handleKeyEvents);

        this.$popoverEl.binf_popover('destroy');
        this.showingPopover = false;

        if (!triggerNoEvent) {
          this.triggerMethod('closed:permission:level:popover');
        }
      }
      this.$popoverEl.focus();
    },

    _getPopoverParent: function () {
      return this.options.popoverAtBodyElement ? $(this.popoverContainerSelector) :
             this.$popoverEl.parent();
    },

    onBeforeDestroy: function () {
      this.closePopover(true);
    }
  });

  return EditPermissionHelper;

});
