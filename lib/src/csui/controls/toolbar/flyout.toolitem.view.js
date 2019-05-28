/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/controls/toolbar/toolitem.view',
  'hbs!csui/controls/toolbar/impl/flyout.toolitem',
  'i18n!csui/controls/toolbar/impl/nls/localized.strings'
], function (_, $, Marionette, ToolItemView, template, lang) {
  'use strict';

  var FlyoutMenuItemView = ToolItemView.extend({
    constructor: function FlyoutMenuItemView() {
      ToolItemView.prototype.constructor.apply(this, arguments);
      this.listenTo(this, 'render', this._promote);
    },

    _promote: function () {
      var method = this.model.get('promoted') ? 'addClass' : 'removeClass';
      this.$el[method]('csui-promoted');
    }
  });

  var FlyoutToolItemView = Marionette.CompositeView.extend({
    tagName: 'li',
    className: 'csui-flyout binf-dropdown',
    attributes: function () {
      var signature = this.model.get('signature') || '';
      return {
        'data-csui-command': signature.toLowerCase()
      };
    },

    template: template,
    templateHelpers: function () {
      var name                = this.model.get('name'),
          promoted            = this.model.get('promoted') || this.model.toolItems.findWhere({
            promoted: true
          }),
          flyoutArrowDisabled = this.model.toolItems.length <= 1;
      if (!name) {
        name = (promoted || this.model.toolItems.first()).get('name');
      }
      return {
        name: name,
        disabled: !promoted,
        expandTitle: lang.showMoreLabel,
        flyoutArrowDisabled: flyoutArrowDisabled
      };
    },

    childViewContainer: '.binf-dropdown-menu',
    childView: FlyoutMenuItemView,
    childEvents: {
      'toolitem:action': function (childView, args) {
        this.triggerMethod('toolitem:action', args);
      }
    },

    events: {
      'click > a': function (event) {
        event.preventDefault();
        if (this.model.toolItems.length <= 1) {
          if(this.model.get('promoted')) {
            var args = {toolItem: this.model};
            this.triggerMethod('toolitem:action', args);
          } else {
            var promoted = this.model.toolItems.findWhere({
              promoted: true
            });
            if (promoted) {
              this.triggerMethod('toolitem:action');
            }
          }
        }
      }
    },

    constructor: function FlyoutToolItemView() {
      Marionette.CompositeView.prototype.constructor.apply(this, arguments);
      this.listenTo(this.collection, 'add change reset', function (models) {
        this.render();
      });
    },

    onKeyInView: function (event) {
      var target = $(event.target);
      if (event.keyCode === 13) {
        this._handleClick(event);
        return false;
      }
    },
  });

  return FlyoutToolItemView;
});
