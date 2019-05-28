/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'hbs!csui/dialogs/node.picker/impl/header/apply.properties.selector/impl/apply.properties.selector',
  'i18n!csui/dialogs/node.picker/impl/header/apply.properties.selector/impl/nls/lang',
  'css!csui/dialogs/node.picker/impl/header/apply.properties.selector/impl/apply.properties.selector',
  'csui/lib/binf/js/binf'
], function (_,
    $,
    Backbone,
    Marionette,
    TabableRegion,
    selectorTemplate,
    lang) {
  "use strict";

  var ApplyPropertiesSelectorView = Marionette.ItemView.extend({
    _applyOptions: undefined,

    selected: undefined,

    openSelectedProperties: false,

    className: 'cs-apply-properties-selector binf-dropdown',

    template: selectorTemplate,

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegion
      }
    },

    ui: {
      toggle: '>.binf-dropdown-toggle',
      selectedLabel: '>.binf-dropdown-toggle >.cs-label',
      iconOpenSelectedProperties: 'li.open-selected-properties > a > span.cs-icon'
    },

    events: {
      'click li[data-optionid]': 'onClickPropertiesOption',
      'click li.open-selected-properties': 'onClickOpenSelectedProperties',
      'keydown': 'onKeyInView',
      'keyup': 'onKeyUpInView'
    },

    constructor: function ApplyPropertiesSelectorView(options) {
      options || (options = {});
      _.defaults(options, {startSelection: ApplyPropertiesSelectorView.KEEP_ORIGINAL_PROPERTIES});

      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    },

    onKeyInView: function (event) {
      if (event.keyCode === 27 && this.$el.hasClass('binf-open')) {
        this.$el.removeClass('binf-open');
        this.$('*[tabindex = "0"]').focus();
        this.isKeydownClosedDropDown = true;
        return false;
      } else if (event.keyCode === 27 && !this.$el.hasClass('binf-open')) {
        this.isKeydownClosedDropDown = false;
      }
    },

    onKeyUpInView: function (event) {
      if (!this.isKeydownClosedDropDown && event.keyCode === 27) {
        return true;
      } else if (event.keyCode === 27) {
        return false;
      }
    },

    onClickPropertiesOption: function (e) {
      e.preventDefault();
      e.stopPropagation();

      this._setSelected(parseInt($(e.currentTarget).attr('data-optionid')));
      this._showSelected();
      this.ui.toggle.click();
      this.trigger('property:click:event');
      this.$el.trigger('setCurrentTabFocus');
    },

    onClickOpenSelectedProperties: function (e) {
      e.preventDefault();
      e.stopPropagation();

      this.openSelectedProperties = !this.openSelectedProperties;
      this._showOpenSelectedProperties();
      this.ui.toggle.click();
      this.$el.trigger('setCurrentTabFocus');
    },

    initialize: function () {
      this._setupApplyOptions();

      if (-1 !== _.indexOf(_.pluck(this._applyOptions, 'id'), this.options.selected)) {
        this._setSelected(this.options.selected);
      }
      else {
        this._setSelected(ApplyPropertiesSelectorView.KEEP_ORIGINAL_PROPERTIES);
      }

      this.listenTo(Backbone, 'closeToggleAction', this._closeToggle);
    },

    templateHelpers: function () {
      return {
        id: _.uniqueId('optionsDropdown'),
        applyPropertiesOptions: this._applyOptions,
        applyPropertiesAria: lang.ApplyPropertiesAria,
        openSelectedProperties: lang.OpenSelectedProperties
      };
    },

    currentlyFocusedElement: function () {
      return this.$el.find('button');
    },

    accDeactivateTabableRegion: function () {
      this._closeToggle();
    },

    onRender: function () {
      this.ui.toggle.binf_dropdown();
      this._showSelected();
      this._showOpenSelectedProperties();
    },

    _getOptionName: function (opt) {
      var i;
      var name;

      i = _.indexOf(_.pluck(this._applyOptions, 'id'), opt);
      name = (i === -1) ? '' : this._applyOptions[i].name;

      return name;
    },

    _setupApplyOptions: function () {
      this._applyOptions = [
        {
          id: ApplyPropertiesSelectorView.KEEP_ORIGINAL_PROPERTIES,
          name: lang.KeepOriginalProperties
        },
        {
          id: ApplyPropertiesSelectorView.APPLY_DESTINATION_PROPERTIES,
          name: lang.ApplyDestinationProperties
        }
      ];
      if (this.options.includeCombineProperties === true) {
        this._applyOptions.push({
          id: ApplyPropertiesSelectorView.COMBINE_ALL_PROPERTIES,
          name: lang.CombineAllProperties
        });
      }
    },

    _setSelected: function (applyPropertiesOption) {
      this.selected = applyPropertiesOption;
    },

    _showSelected: function () {
      this.ui.selectedLabel.text(this._getOptionName(this.selected));

      this.$el.find('li[data-optionid]').removeClass('binf-active');
      this.$el.find('li[data-optionid=' + this.selected + ']').addClass('binf-active');
    },

    _showOpenSelectedProperties: function () {
      if (this.openSelectedProperties === true) {
        this.ui.toggle.attr('aria-expanded', 'true');
        this.ui.iconOpenSelectedProperties
            .removeClass('icon-checkbox')
            .addClass('icon-checkbox-selected');
      }
      else {
        this.ui.toggle.attr('aria-expanded', 'false');
        this.ui.iconOpenSelectedProperties
            .removeClass('icon-checkbox-selected')
            .addClass('icon-checkbox');
      }
    },

    _closeToggle: function () {
      if (this.ui.toggle.parent && this.ui.toggle.parent().hasClass('binf-open')) {
        this.ui.toggle.binf_dropdown('toggle');
      }
    }
  });

  ApplyPropertiesSelectorView.KEEP_ORIGINAL_PROPERTIES = 1;
  ApplyPropertiesSelectorView.APPLY_DESTINATION_PROPERTIES = 2;
  ApplyPropertiesSelectorView.COMBINE_ALL_PROPERTIES = 3;

  return ApplyPropertiesSelectorView;

});
