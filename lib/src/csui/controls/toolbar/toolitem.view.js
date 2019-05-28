/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery', 'csui/lib/underscore', 'csui/lib/marionette',
  'hbs!csui/controls/toolbar/toolitem', 'csui/lib/binf/js/binf'
], function ($, _, Marionette, template) {
  'use strict';

  var ToolItemView = Marionette.ItemView.extend({
    tagName: 'li',

    className: function () {
      var className = this.model.get('className') || '';
      if (this.model.isSeparator()) {
        className += ' binf-divider';
      }
      return className;
    },

    attributes: function () {
      var attrs = {};
      if (this.model.isSeparator()) {
        attrs['aria-hidden'] = 'true';
      } else {
        var signature = this.model.get('signature') || '';
        attrs['data-csui-command'] = signature.toLowerCase();
      }
      if (this.options.role) {
        attrs['role'] = this.options.role;
      } else {
        attrs['role'] = 'menuitem';
      }
      return attrs;
    },

    template: template,

    templateHelpers: function () {
      var data = {
        renderIconAndText: this.options.renderIconAndText === true,
        renderTextOnly: this.options.renderTextOnly === true,
        isSeparator: this.model.isSeparator(),
        toolItemAria: this.model.get("toolItemAria"),
        hasToolItemAriaExpand: this.model.get("toolItemAriaExpand") !== undefined,
        toolItemAriaExpand : this.model.get("toolItemAriaExpand")
      };
      data.title = !!this.model.get('title') ? this.model.get('title') : this.model.get('name');
      return data;
    },

    events: {
      'click a': '_handleClick',
      'keydown': 'onKeyInView'
    },

    constructor: function ToolItemView(options) {
      this.options = options || {};
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },

    onKeyInView: function (event) {
      var target = $(event.target);
      if (event.keyCode === 13 || event.keyCode === 32) {  // enter(13) and space(32)
        this._handleClick(event);
        return false;
      }
    },

    renderIconAndText: function () {
      this.options.renderIconAndText = true;
      this.render();  // re-render
      this.options.renderIconAndText = false;
    },

    renderTextOnly: function () {
      this.options.renderTextOnly = true;
      this.render();  // re-render
      this.options.renderTextOnly = false;
    },
    isSeparator: function () {
      return this.model.isSeparator();
    },

    closeDropdown: function () {
      var dropdownEl = this.$el.closest('li.binf-dropdown.binf-open');
      var dropdownToggleEl = dropdownEl.find('.binf-dropdown-toggle');
      dropdownToggleEl.binf_dropdown('toggle');
    },

    _handleClick: function (event) {
      event.preventDefault();
      if (this.model.get('menuWithMoreOptions') === true) {
        event.stopPropagation();
      } else {
        this.closeDropdown();
      }

      var args = {toolItem: this.model};
      this.triggerMethod('before:toolitem:action', args);
      if (!args.cancel) {
        this.triggerMethod('toolitem:action', args);
      }
    }
  });

  return ToolItemView;
});
