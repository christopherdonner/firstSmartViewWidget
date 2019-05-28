/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module',
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette'
], function (module, _, $, Marionette) {
  'use strict';

  var ListKeyboardBehavior = Marionette.Behavior.extend({

    defaults: {
      'currentlyFocusedElementSelector': 'li:nth-child({0})'
    },

    constructor: function ListKeyboardBehavior(options, view) {
      Marionette.Behavior.prototype.constructor.apply(this, arguments);
      _.extend(view, {
        selectedIndex: 0,
        $inlineItems: undefined,
        inlineItemIndex: 0,
        inlineDropDownIsOpenSelector: "",
        $inlineItemsDropDown: undefined,
        inlineItemDropDownIndex: -1,
        onKeyDown: function (e) {
          var $preElem;
          switch (e.keyCode) {
          case 27: //escape
            this.inlineItemDropDownIndex = -1;
            break;
          case 38: // up
            if ((this.$inlineItemsDropDown !== undefined) && (this.$inlineItemsDropDown.length !== 0) && (this.$(this.inlineDropDownIsOpenSelector).length > 0 )){
              this._moveInlineMenu(e, this._selectPreviousInlineElementMenu());
            }else {
              $preElem = this.currentlyFocusedElement();
              this._moveTo(e, this._selectPrevious(), $preElem);
            }
            break;
          case 40: // down
            if ((this.$inlineItemsDropDown !== undefined) && (this.$inlineItemsDropDown.length !== 0) && (this.$(this.inlineDropDownIsOpenSelector).length > 0 )){
              this._moveInlineMenu(e, this._selectNextInlineElementMenu());
            }else {
              $preElem = this.currentlyFocusedElement();
              this._moveTo(e, this._selectNext(), $preElem);
            }
            break;
          case 39: //key right
            if (!($(e.target).hasClass('cs-input'))) {
              if ((this.$inlineItems.length !== 0) &&
                  (this.$(this.inlineDropDownIsOpenSelector).length === 0 )) {
                this._moveInline(e, this._selectNextInlineElement());
              }
            }
            break;
          case 37: //key left
            if (!($(e.target).hasClass('cs-input'))) {
              if ((this.$inlineItems.length !== 0) && (this.$(this.inlineDropDownIsOpenSelector).length === 0 )) {
                this._moveInline(e, this._selectPreviousInlineElement());
              }
            }
            break;
          }
        },

        _moveInlineMenu: function (event, $elem) {
          event.preventDefault();
          event.stopPropagation();

          setTimeout(_.bind(function () {
            this.$inlineItemsDropDown.prop('tabindex', '-1');
            $elem.focus();
            $elem.prop('tabindex', '0');
          }, this), 50);
        },

        _selectNextInlineElementMenu: function () {
          if (this.inlineItemDropDownIndex < this.$inlineItemsDropDown.length - 1) {
            this.inlineItemDropDownIndex++;
          }
          return this.$(this.$inlineItemsDropDown[this.inlineItemDropDownIndex]);
        },

        _selectPreviousInlineElementMenu: function () {
          if (this.inlineItemDropDownIndex > 0) {
            this.inlineItemDropDownIndex--;
          }
          return this.$(this.$inlineItemsDropDown[this.inlineItemDropDownIndex]);
        },

        _moveInline: function (event, $elem) {
          event.preventDefault();
          event.stopPropagation();

          setTimeout(_.bind(function () {
            this.$inlineItems.prop('tabindex', '-1');
            $elem.focus();
            $elem.prop('tabindex', '0');
          }, this), 50);
        },

        _selectNextInlineElement: function () {
          if (this.inlineItemIndex < this.$inlineItems.length - 1) {
            this.inlineItemIndex++;
          }
          return this.$(this.$inlineItems[this.inlineItemIndex]);
        },

        _selectPreviousInlineElement: function () {
          if (this.inlineItemIndex > 0) {
            this.inlineItemIndex--;
          }
          return this.$(this.$inlineItems[this.inlineItemIndex]);
        },

        _moveTo: function (event, $elem, $preElem) {
          event.preventDefault();
          event.stopPropagation();

          setTimeout(_.bind(function () {
            $elem.focus();
            $preElem.prop('tabindex', '-1');
            $elem.prop('tabindex', '0');
          }, this), 50);
        },

        _selectNext: function () {
          var collection = this.collection || this.model;
          if (this.selectedIndex < collection.length - 1) {
            this.selectedIndex++;
          }
          return this.currentlyFocusedElement();
        },

        _selectPrevious: function () {
          if (this.selectedIndex > 0) {
            this.selectedIndex--;
          }
          return this.currentlyFocusedElement();
        },

        currentlyFocusedElementSelector: this.options.currentlyFocusedElementSelector,

        currentlyFocusedElement: function () {
          var collection = this.collection || this.model;
          if ((this.selectedIndex !== 0) && (this.selectedIndex >= collection.length)) {
            this.selectedIndex = collection.length - 1;
          }
          var $item = this.$(this.currentlyFocusedElementSelector);
          var elementOfFocus = ($item.length > this.selectedIndex) ?
                               this.$($item[this.selectedIndex]) : null;
          return elementOfFocus;
        }
      });
    } // constructor
  });

  return ListKeyboardBehavior;
});

