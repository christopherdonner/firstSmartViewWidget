/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'csui/lib/underscore', 'csui/lib/marionette',
  'csui/utils/focusable'
], function (module, _, Marionette, focusable) {
  'use strict';

  var config = _.extend({
    multiValueSeparator: ', '
  }, module.config());

  var CellView = Marionette.View.extend({
    tagName: 'td',

    constructor: function CellView(options) {
      Marionette.View.prototype.constructor.apply(this, arguments);
      this.listenTo(this, 'before:render', this._detachClickHandler)
          .listenTo(this, 'before:destroy', this._detachClickHandler);
    },

    render: function () {
      this._ensureViewIsIntact();
      this.triggerMethod('before:render', this);
      this._renderContent();
      this.bindUIElements();
      this._attachClickHandler();
      this.triggerMethod('render', this);
      return this;
    },

    _renderContent: function () {
      var classes = _.result(this, 'className');
      if (classes) {
        this.$el.addClass(classes);
      }
      var column = this.options.column;
      if (column) {
        var columnName = column.name;
        this.$el.attr('data-csui-attribute', columnName);
        if (!!this.model.get("addEmptyAttribute") && !this.model.get(columnName) &&
            this.model.get(columnName) !== undefined) {
          this.el.setAttribute('data-csui-empty-cell', true);
        }
      }
      this.renderValue();
      this._ensureAriaLabel();
    },

    _ensureAriaLabel: function () {
      if (this.needsAriaLabel === false) {
        return;
      }
      if (this.needsAriaLabel === undefined) {
        var focusables = focusable.findFocusables(this.el);
        if (focusables.length === 1) {
          return;
        }
      }
      var label = this.getAriaLabel();
      if (label) {
        this.$el.attr('aria-label', label);
      }
    },

    _attachClickHandler: function () {
      var self = this;
      this.$el.on('click.' + this.cid, function (event) {
        self.triggerMethod('clicked:cell', event);
      });
    },

    _detachClickHandler: function () {
      this.$el.off('click.' + this.cid);
    },

    renderValue: function () {
      var text = this.getValueText();
      this.$el.text(text);
      this.$el.attr('title', text);
    },

    getValueText: function () {
      var column = this.options.column;
      if (column) {
        var columnName = column.name,
            model = this.model,
            value = model.get(columnName + "_formatted");
        if (value === null || value === undefined) {
          value = model.get(columnName);
          if (value === null || value === undefined) {
            value = '';
          }
        }
        return this.getSingleOrMultipleValueText(value);
      }
      return '';
    },

    getAriaLabel: function () {
      return this.getValueText();
    },

    getSingleOrMultipleValueText: function (propertyValue, formatter) {
      var value;

      formatter = this._validateFormater(formatter);
      if (Array.isArray(propertyValue)) {
        value = this.concatenateTextValues(propertyValue, formatter);
      } else {
        value = formatter(propertyValue);
      }
      return value;
    },

    concatenateTextValues: function (array, formatter) {
      formatter = this._validateFormater(formatter);
      return array.map(formatter).join(config.multiValueSeparator);
    },

    _validateFormater: function (formatter) {
      return formatter || function (value) { return value };
    }
  }, {
    hasFixedWidth: false,
    columnClassName: '',

    getValue: function (model, column) {
      var value = model.get(column.name);
      if (Array.isArray(value)) {
        for (var i = 0; i< value.length; i++) {
          if (value[i] !== undefined && value[i] !== null) {
            value = value[i];
            break;
          }
        }
      }
      return value !== undefined ? value : null;
    }
  });

  return CellView;
});
