/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/mixins/view.events.propagation/view.events.propagation.mixin',
  'hbs!csui/widgets/metadata/impl/header/rightbar/header.rightbar',
  'i18n!csui/widgets/metadata/impl/nls/lang', 'csui/controls/form/fields/booleanfield.view',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'css!csui/widgets/metadata/impl/header/rightbar/header.rightbar'
], function (_, $, Backbone, Marionette, ViewEventsPropagationMixin, template, lang,
    BooleanFieldView, TabableRegionBehavior) {

  var MetadataHeaderRightBarView = Marionette.ItemView.extend({

    className: 'metadata-header-right-bar',

    template: template,
    templateHelpers: function () {
      var templateValues = {
        show_close_icon: this.options.showCloseIcon,
        close_metadata_button_tooltip: lang.closeMetadataButtonTooltip
      };
      if (this.options.showShortcutSwitch && this.options.shortcutNode) {
        var right_static_label = lang.viewOriginalMessage;
        if (this.options.shortcutNode.original === this.node) {
          right_static_label = lang.viewShortcutMessage;
        }
        return _.extend(templateValues, {
          is_shortcut: true,
          right_label: right_static_label
        });
      } else {
        return templateValues;
      }
    },

    behaviors: function () {
      if ((this.options.showShortcutSwitch && this.options.shortcutNode) ||
          this.options.showCloseIcon) {
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
      shortcutSwitchLabel: 'a.shortcut-switch',
      closeIcon: '.cs-metadata-close'
    },

    events: {
      'keydown': 'onKeyInView',
      'click @ui.shortcutSwitchLabel': 'onClickShortcutSwitch',
      'click @ui.closeIcon': 'onClickClose'
    },

    constructor: function MetadataHeaderRightBarView(options) {
      options || (options = {});
      this.options = options;
      this.node = this.options.model;
      Marionette.ItemView.prototype.constructor.call(this, options);
    },

    onKeyInView: function (e) {
      var event = e || window.event;
      var target = event.target || event.srcElement;
      if (event.keyCode === 13 || event.keyCode === 32) {
        event.preventDefault();
        event.stopPropagation();
        setTimeout(function () {
          $(target).click();
        }, 200);
      }
    },

    currentlyFocusedElement: function () {
      if (this.options.showShortcutSwitch && this.options.shortcutNode) {
        return $(this.ui.shortcutSwitchLabel);
      } else if (this.options.showCloseIcon) {
        return $(this.ui.closeIcon);
      } else {
        return undefined;
      }
    },

    onClickShortcutSwitch: function (event) {
      event.preventDefault();
      event.stopPropagation();

      this.trigger('shortcut:switch');
    },

    onClickClose: function (event) {
      event.preventDefault();
      event.stopPropagation();

      this.trigger("metadata:close");
    }

  });

  _.extend(MetadataHeaderRightBarView.prototype, ViewEventsPropagationMixin);

  return MetadataHeaderRightBarView;

});
