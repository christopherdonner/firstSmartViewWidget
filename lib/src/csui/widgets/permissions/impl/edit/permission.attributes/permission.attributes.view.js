/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/marionette',
  'csui/utils/base',
  'i18n',
  'csui/behaviors/keyboard.navigation/tabables.behavior',
  'csui/controls/tree/tree.view',
  'csui/widgets/permissions/impl/edit/permission.attributes/impl/permission.attributes.data',
  'hbs!csui/widgets/permissions/impl/edit/permission.attributes/impl/permission.attributes',
  'i18n!csui/widgets/permissions/impl/nls/lang'
], function ($, _, Marionette, base, i18n, TabablesBehavior, TreeView, permissionAttributes,
    template, lang) {

  var PermissionAttributesView = Marionette.LayoutView.extend({
    className: "csui-permission-attributes",

    template: template,

    regions: {
      treeRegion: ".csui-permission-attribute-tree"
    },

    events: {
      "click button.cs-save-btn": "onClickSave",
      "click button.cs-cancel-btn": "onClickCancel",
      "keydown": '_handleKeyEvents'
    },

    behaviors: {
      TabablesBehavior: {
        behaviorClass: TabablesBehavior
      }
    },

    _handleKeyEvents: function (event) {
      var focusables = this.$el.find('input.csui-tree-checkbox');
      if (!!event && event.shiftKey && event.keyCode === 9) {

        $(focusables[focusables.length]).focus();
      }
      else if (event.target.textContent === "Cancel" && event.keyCode === 9) {

        if (focusables.length) {
          $(focusables[0]).focus();
        }
      }

    },
    currentlyFocusedElement: function (event) {
      var tabElements = this.$('*[tabindex]');
      if (tabElements.length) {
        tabElements.prop('tabindex', 0);
      }
      if (!!event && event.shiftKey) {
        return $(tabElements[tabElements.length - 1]);
      } else {
        return $(tabElements[0]);
      }
    },

    templateHelpers: function () {
      var showButtons = this.options.showButtons;
      if (showButtons === undefined) {
        showButtons = !this.options.readonly;
      }
      return {
        save_button_label: lang.saveButtonLabel,
        cancel_button_label: lang.cancelButtonLabel,
        showButtons: showButtons
      };
    },

    constructor: function PermissionAttributesView(options) {
      options || (options = {});
      Marionette.LayoutView.prototype.constructor.call(this, options);
      this.options = options;
      this.focusIndex = 0;
    },

    onRender: function () {
      var permissionLevelCollection = permissionAttributes.getPermissionAttributes({
        readonly: this.options.readonly,
        node: this.options.node,
        permissions: this.options.permissions || this.model.get("permissions")
      });

      this.treeView = new TreeView({
        collection: permissionLevelCollection
      });
      this.treeRegion.show(this.treeView);
      this.listenTo(this.treeView, 'node:selected', this.onPermissionNodeSelected);
      this.listenTo(this.treeView, 'node:unselected', this.onPermissionNodeUnselected);
    },

    onPermissionNodeSelected: function (target) {
      var view = this.treeView,
          dependentNodes;
      if (target.attributes.name.value === "edit_permissions") {
        dependentNodes = view.$el.find("input.csui-tree-checkbox");
      }
      else {
        dependentNodes = view.$el.find(target).closest(".csui-tree-root").parents(
            ".csui-tree-root").children(".csui-tree-child").find("input.csui-tree-checkbox");
      }
      dependentNodes.prop('checked', true);
      if (dependentNodes.length) {
        view.$el.find("#node_see_contents")[0].checked = true;
      }
    },

    onPermissionNodeUnselected: function (target) {
      var view = this.treeView,
          dependentNodes;
      if (target.attributes.name.value === "see_contents") {
        dependentNodes = view.$el.find(target).closest(".csui-tree-root").siblings(
            ".csui-tree-root").find("input.csui-tree-checkbox");
      }
      else {
        dependentNodes = view.$el.find(target).closest(".csui-tree-root").children("ul").find(
            "input.csui-tree-checkbox");
        if (!dependentNodes.length || target.attributes.name.value === "reserve") {
          view.$el.find("#node_edit_permissions")[0].checked = false;
        }
      }
      dependentNodes.prop('checked', false);
    },

    onClickSave: function () {
      var permissions = this.getSelectedPermissions();
      this.trigger("permission:attribute:save:clicked", permissions);
    },

    onClickCancel: function () {
      this.trigger("permission:attribute:cancel:clicked");
    },

    onDestroy: function () {
    },

    getSelectedPermissions: function () {
      var treeNodes   = this.treeView.$el.find('input.csui-tree-checkbox'),
          permissions = [];
      for (var i = 0; i < treeNodes.length; i++) {
        if (treeNodes[i].checked) {
          permissions.push(treeNodes[i].name);
        }
      }
      return permissions;
    }

  });
  return PermissionAttributesView;
});