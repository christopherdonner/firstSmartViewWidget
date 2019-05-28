/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["module",
  "csui/lib/marionette",
  'i18n!csui/widgets/favorites/impl/nls/lang',
  'hbs!csui/widgets/favorites/impl/favorites2.groups.header',
  'css!csui/widgets/favorites/impl/favorites2.groups.header.view',
], function (module,
    Marionette,
    lang,
    template
) {
  'use strict';

  var FavoriteGroupsHeaderView = Marionette.ItemView.extend({
    className: 'csui-favorite-groups-header',
    template: template,

    initialize: function (options) {
      this._useEditMode = options && options.useEditMode;
      this._isGroupsEditing = false;
    },

    ui: {
      addButton: '.csui-groups-header-plus',
      editModeOn: '.csui-groups-header-edit-on',
      editModeOff: '.csui-groups-header-edit-off'
    },

    events: {
      'click @ui.addButton': '_addItem',
      'click @ui.editModeOn': '_switchEditModeOn',
      'click @ui.editModeOff': '_switchEditModeOff'
    },

    templateHelpers: function () {
      return {
        groupAddButtonTitle: lang.groupAddButtonTitle,
        text: lang.groupAdd,
        startEditMode: lang.startEditMode,
        endEditMode: lang.endEditMode,
        hasEditModeSwitch: this._useEditMode
      };
    },

    _addItem: function (event) {
      event.preventDefault();
      event.stopPropagation();
      this.triggerMethod('add:item');
    },

    _switchEditModeOn: function (event) {
      event.preventDefault();
      event.stopPropagation();
      this.triggerMethod('toggleEditMode:on');
    },

    _switchEditModeOff: function (event) {
      event.preventDefault();
      event.stopPropagation();
      this.triggerMethod('toggleEditMode:off');
    },

    isAddEnabled: function (enable) {
      if (enable !== undefined) {
        this._isAddEnabled = enable;
        if (enable) {
          this.ui.addButton.removeClass('binf-disabled');
        } else {
          this.ui.addButton.addClass('binf-disabled');
        }
      }
      return !!this._isAddEnabled;
    }
  });

  return FavoriteGroupsHeaderView;
});
