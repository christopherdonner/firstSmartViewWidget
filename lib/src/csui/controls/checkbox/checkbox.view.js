/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'i18n!csui/controls/checkbox/impl/nls/lang',
  'hbs!csui/controls/checkbox/impl/checkbox.view',
  'css!csui/controls/control/impl/control',
  'css!csui/controls/checkbox/impl/checkbox.view'
], function ($, _, Backbone, Marionette, lang, template) {
  'use strict';

  return Marionette.ItemView.extend({
    className: 'csui-control-view csui-checkbox-view',
    template: template,

    templateHelpers: function () {
      var checked = this.model.get("checked");
      return {
        disabled: this.model.get('disabled') ? 'disabled' : '',
        ariaChecked: checked,
        title: this.title ? this.title : lang.title,
        ariaLabel: this.ariaLabel ? this.ariaLabel : lang.ariaLabel
      };
    },

    modelEvents: {
      'change:disabled': '_handleDisableChanged',
      'change:checked': '_handleCheckedChanged'
    },

    ui: {
      cb: 'button.csui-control.csui-checkbox'
    },

    events: {
      'click': '_toggleChecked'
    },

    constructor: function Checkbox(options) {
      options || (options = {});

      this.ariaLabel = options.ariaLabel;
      this.title = options.title;

      if (!options.model) {

        options.model = new Backbone.Model(
            {disabled: options.disabled === undefined ? false : options.disabled}
        );

      }
      Marionette.ItemView.prototype.constructor.call(this, options);
      this._setChecked(options.checked, {silent: true});
    },

    setDisabled: function (d) {
      this.model.set('disabled', !!d);
    },

    setChecked: function (state) {
      var options = {silent: false};
      if (this.model.get('disabled')) {
        options.silent = true;
      }
      this._setChecked(state, options);
    },

    _handleDisableChanged: function () {
      this.ui.cb.prop('disabled', this.model.get('disabled'));
    },

    _handleCheckedChanged: function () {
      var checked = this.model.get("checked");
      this.ui.cb.attr('aria-checked', checked);
    },

    _setChecked: function (state, options) {
      switch (state) {
      case 'true':
      case true:
        this.model.set('checked', 'true', options);
        break;
      case 'mixed':
        this.model.set('checked', 'mixed', options);
        break;
      default:
        this.model.set('checked', 'false', options);
        break;
      }
    },

    _toggleChecked: function () {
      if (this.model.get('disabled')) {
        return; // don't change checkbox and don't fire events, because it's disabled
      }
      var currentState = this.model.get('checked');
      var args = {sender: this, model: this.model};
      this.triggerMethod('clicked', args);

      if (!args.cancel) {
        if (!currentState || currentState === 'false' || currentState === 'mixed') {
          this.model.set('checked', 'true');
        } else {
          this.model.set('checked', 'false');
        }
      }
    }

  });
});