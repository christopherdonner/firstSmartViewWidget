/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/models/permission/nodepermission.model',
  'hbs!csui/widgets/permissions/impl/edit/permission.level.selector/impl/permission.level.selector',
  'i18n!csui/widgets/permissions/impl/nls/lang',
  'css!csui/widgets/permissions/impl/permissions',
  'csui/lib/binf/js/binf'
], function (_,
    $,
    Marionette,
    TabableRegion,
    NodePermissionModel,
    selectorTemplate,
    lang) {
  "use strict";

  var PermissionLevelSelectorView = Marionette.ItemView.extend({
    _permissionLevelOptions: undefined,

    selected: undefined,

    openSelectedProperties: false,

    className: 'cs-permission-level-selector',

    template: selectorTemplate,

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegion
      }
    },

    events: {
      'click li[data-optionid]': 'onClickOption',
      'keydown': 'onKeyInView'
    },

    constructor: function PermissionLevelSelectorView(options) {
      options || (options = {});
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },

    initialize: function () {
      this.focusIndex = 0;
      this._setupPermissionLevelOptions();

      var selectedLevel = this.options.selected ||
                          this.options.permissionModel.getPermissionLevel();

      if (-1 !== _.indexOf(_.pluck(this._permissionLevelOptions, 'id'), selectedLevel)) {
        this._setSelected(selectedLevel);
      }
      else {
        this._setSelected(NodePermissionModel.PERMISSION_LEVEL_NONE);
      }
    },

    onKeyInView: function (event) {
      var keyCode    = event.keyCode,
          focusables = this.$el.find('a[tabindex]');
      if (focusables.length) {
        if (event.keyCode === 13) { //Enter Key
          $(focusables[this.focusIndex]).parent().click();
          event.stopPropagation();
          event.preventDefault();

        }
        else if (keyCode === 38 || keyCode === 40) {
          if (keyCode === 38) { //up arrow
            this.focusIndex > 0 && --this.focusIndex;
          }
          else {//down arrow
            this.focusIndex < (focusables.length - 1) && ++this.focusIndex;
          }
          $(focusables[this.focusIndex]).focus();

          event.stopPropagation();
          event.preventDefault();
        }
        else if (keyCode === 9) {
          var popoverTarget = this.$el.parents('body').find(
              '.csui-edit-permission-popover-container' +
              ' .binf-popover');
          popoverTarget.binf_popover('destroy');
        }
      }
    },

    onClickOption: function (e) {
      e.preventDefault();
      e.stopPropagation();

      this._setSelected(parseInt($(e.currentTarget).attr('data-optionid')));
      this._showSelected();
      this.trigger('permission:level:selected');
      this.$el.trigger('setCurrentTabFocus');
    },

    templateHelpers: function () {
      return {
        permissionLevelOptions: this._permissionLevelOptions
      };
    },

    currentlyFocusedElement: function () {
      var focusables = this.$el.find('a[tabindex]');
      if (focusables.length) {
        return $(focusables[this.focusIndex]);
      }
    },

    accDeactivateTabableRegion: function () {
    },

    onRender: function () {
      this._showSelected();
    },

    _getOptionName: function (opt) {
      var i;
      var name;

      i = _.indexOf(_.pluck(this._permissionLevelOptions, 'id'), opt);
      name = (i === -1) ? '' : this._permissionLevelOptions[i].name;

      return name;
    },

    _setupPermissionLevelOptions: function () {
      this._permissionLevelOptions = [
        {
          id: NodePermissionModel.PERMISSION_LEVEL_NONE,
          name: lang.permissionLevelNone
        },
        {
          id: NodePermissionModel.PERMISSION_LEVEL_READ,
          name: lang.permissionLevelRead
        },
        {
          id: NodePermissionModel.PERMISSION_LEVEL_WRITE,
          name: lang.permissionLevelWrite
        },
        {
          id: NodePermissionModel.PERMISSION_LEVEL_FULL_CONTROL,
          name: lang.permissionLevelFullControl
        },
        {
          id: NodePermissionModel.PERMISSION_LEVEL_CUSTOM,
          name: lang.permissionLevelCustom,
          showActionIcon: true
        }
      ];
    },

    _setSelected: function (selectedOption) {
      this.selected = selectedOption;
    },

    _showSelected: function () {
      var allOptions = this.$el.find('li[data-optionid]');
      allOptions.find('.cs-icon').removeClass('icon-listview-checkmark');
      allOptions.removeAttr("aria-selected");

      var selectedItem = this.$el.find('li[data-optionid=' + this.selected + ']');
      selectedItem.find('.cs-icon').addClass('icon-listview-checkmark');
      selectedItem.attr("aria-selected", "true");
    },

    _showOpenSelectedProperties: function () {
      if (this.openSelectedProperties === true) {
        this.ui.toggle.attr('aria-expanded', 'true');
        this.ui.iconOpenSelectedProperties
            .removeClass('icon-checkbox')
            .addClass('icon-checkbox-selected');
      }
      else {
        this.ui.toggle.attr('aria-expanded', 'false');
        this.ui.iconOpenSelectedProperties
            .removeClass('icon-checkbox-selected')
            .addClass('icon-checkbox');
      }
    },

    getSelectedPermissions: function () {
      return NodePermissionModel.getPermissionsByLevelExceptCustom(this.selected,
          this.options.isContainer);
    }

  });

  return PermissionLevelSelectorView;

});
