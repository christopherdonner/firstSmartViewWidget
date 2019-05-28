/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/behaviors/keyboard.navigation/retainfocus.behavior',
  'i18n!csui/controls/disclosure/impl/nls/lang',
  'hbs!csui/controls/disclosure/impl/disclosure.view',
  'css!csui/controls/control/impl/control',
  'css!csui/controls/disclosure/impl/disclosure.view'
], function ($, _, Backbone, Marionette, RetainFocusBehavior, lang, template) {
  'use strict';

  return Marionette.ItemView.extend({
    className: 'csui-control-view csui-disclosure-view',
    template: template,

    templateHelpers: function () {
      var expanded = this.model.get("expanded");
      return {
        disabled: this.model.get('disabled') ? 'disabled' : '',
        ariaExpanded: expanded,
        title: expanded ? (this.titleExpanded ? this.titleExpanded : lang.titleExpanded) :
               (this.titleDisclosed ? this.titleDisclosed : lang.titleDisclosed),
        ariaLabel: this.ariaLabel ? this.ariaLabel : lang.ariaLabel
      };
    },

    modelEvents: {
      'change:disabled': 'render',
      'change:expanded': 'render'
    },

    events: {
      'click': '_toggleExpanded'
    },

    behaviors: {
      RetainFocusBehavior: {behaviorClass: RetainFocusBehavior}
    },

    constructor: function Disclosure(options) {
      options || (options = {});

      this.ariaLabel = options.ariaLabel;
      this.titleDisclosed = options.titleDisclosed;
      this.titleExpanded = options.titleExpanded;

      if (!options.model) {

        options.model = new Backbone.Model(
            {
              disabled: options.disabled === undefined ? false : options.disabled
            });

      }
      Marionette.ItemView.prototype.constructor.call(this, options);
      this.setExpanded(options.expanded);
    },

    setDisabled: function (d) {
      this.model.set('disabled', !!d);
    },

    setExpanded: function (expanded) {
      var options = {silent: false};
      if (this.model.get('disabled')) {
        options.silent = true;
      }
      switch (expanded) {
      case 'true':
      case true:
        this.model.set('expanded', true, options);
        break;
      default:
        this.model.set('expanded', false, options);
        break;
      }
    },

    _toggleExpanded: function () {
      if (this.model.get('disabled')) {
        return; // don't change checkbox and don't fire events, because it's disabled
      }
      var currentState = this.model.get('expanded');
      var args = {sender: this, model: this.model};
      this.triggerMethod('clicked', args);

      if (!args.cancel) {
        this.model.set('expanded', !currentState);  // toggle expanded state
      }
    }

  });
});