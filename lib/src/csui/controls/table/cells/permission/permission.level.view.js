/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/table/cells/templated/templated.view',
  'csui/controls/table/cells/cell.registry',
  'i18n!csui/controls/table/cells/permission/impl/nls/localized.strings',
  'hbs!csui/controls/table/cells/permission/impl/permission.level'
], function ($, _, Backbone, Marionette, TemplatedCellView, cellViewRegistry,
    lang, template) {
  'use strict';

  var PermissionLevelCellView = TemplatedCellView.extend({

    template: template,

    ui: {
      permissionLevel: '.csui-permission-level',
      permissionTree: '.csui-tree'
    },

    events: {
      'click @ui.permissionLevel': 'onClickPermissionLevel',
      'keydown': 'onKeyInView'
    },

    onKeyInView: function (event) {
      if (event.keyCode === 32 || event.keyCode === 13) {
        this.$el.find('.csui-permission-level').click();
      }
    },

    getValueData: function () {
      var permissions_level_array = this.model.get("permissions"),
          value                   = this.getPermissionLevel(permissions_level_array), ownername;
      if (this.model.get("type") === "public") {
        ownername = lang.publicaccess;
      } else {
        ownername = (!!this.model && !!this.model.get('right_id_expand')) ?
                    this.model.get('right_id_expand').name : '';
      }

      if (value === null) {
        return TemplatedCellView.prototype.getValueData.apply(this, arguments);
      }
      return {
        value: value,
        permissionLevelAria: _.str.sformat(lang.permissionfor, value, ownername),
        formattedValue: value
      };
    },

    getPermissionLevel: function (permissions_level_array) {
      var value = null;
      if (permissions_level_array && permissions_level_array.length > 0) {
        if (permissions_level_array.indexOf("edit_permissions") >= 0 &&
            permissions_level_array.length === (this.model.collection.isContainer ? 10 : 9)) {
          value = lang.FullControl;
        } else if (permissions_level_array.indexOf("edit_permissions") < 0 &&
                   permissions_level_array.indexOf("delete") >= 0 &&
                   permissions_level_array.length === (this.model.collection.isContainer ? 9 : 8)) {
          value = lang.Write;
        } else if (permissions_level_array.indexOf("see_contents") >= 0 &&
                   permissions_level_array.length === 2) {
          value = lang.Read;
        } else {
          value = lang.Custom;
        }
      } else if (this.model.get("type") === "public" || !!this.model.get("right_id")) {
        value = lang.None;
      }
      return value;
    },

    constructor: function PermissionLevelCellView(options) {
      PermissionLevelCellView.__super__.constructor.apply(this, arguments);

      this.$ = $;
    },

    onClickPermissionLevel: function (e) {
      var membersTypeSupport = [0, 1];
      if (membersTypeSupport.indexOf(
              this.options.model.get("right_id_expand") &&
              this.options.model.get("right_id_expand").type) < 0 &&
          this.options.model.get("type") === "custom") {
        if (this.options.originatingView) {
          this.options.originatingView.trigger("permission:level:focus",
              {cellView: this});
        }
      } else {
        if (this.options.originatingView) {
          this.options.originatingView.trigger("permission:level:clicked",
              {cellView: this});
        }
        this.trigger("cell:content:clicked", this);
      }
    }

  }, {
    hasFixedWidth: false,
    columnClassName: 'csui-permission-level',
    widthFactor: 1
  });

  cellViewRegistry.registerByColumnKey('permissions', PermissionLevelCellView);

  return PermissionLevelCellView;
});