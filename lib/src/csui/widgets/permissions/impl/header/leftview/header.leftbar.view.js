/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'hbs!csui/widgets/permissions/impl/header/leftview/header.leftbar',
  'i18n!csui/widgets/permissions/impl/nls/lang',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/node-type.icon/node-type.icon.view',
  'css!csui/widgets/permissions/impl/header/leftview/header.leftbar'
], function (_, $, Marionette, template, lang, TabableRegionBehavior, NodeTypeIconView) {

  var PermissionsHeaderLeftBarView = Marionette.ItemView.extend({

    className: 'permissions-header-left-bar',

    template: template,
    templateHelpers: function () {
      return {
        back_button: this.options.showBackIcon,
        go_back_tooltip: lang.goBackTooltip,
        name: this.options.nodeName
      };
    },

    behaviors: function () {
      if (this.options.showBackIcon) {
        return {
          TabableRegionBehavior: {
            behaviorClass: TabableRegionBehavior
          }
        };
      } else {
        return {};
      }
    },

    ui: {
      back: '.cs-go-back',
      name: '.csui-permission-header-name'
    },

    events: {
      'keydown': 'onKeyInView',
      'click @ui.back': 'onClickClose'
    },

    onKeyInView: function (e) {
      var event = e || window.event;
      var target = event.target || event.srcElement;
      if (event.keyCode === 13 || event.keyCode === 32) {
        event.preventDefault();
        event.stopPropagation();
        $(target).click();
      }
    },

    constructor: function PermissionsHeaderLeftBarView(options) {
      options || (options = {});
      this.options = options;
      this.node = this.options.model;
      Marionette.ItemView.prototype.constructor.call(this, options);
    },

    currentlyFocusedElement: function () {
      if (this.options.showBackIcon) {
        return $(this.ui.back);
      }
      return undefined;
    },

    onClickClose: function (event) {
      this.trigger('permissions:close');
    }

  });
  return PermissionsHeaderLeftBarView;
});