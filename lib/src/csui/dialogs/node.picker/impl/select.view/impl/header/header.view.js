/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["csui/lib/underscore", "csui/lib/jquery", "csui/lib/marionette", 'csui/lib/backbone',
  "csui/behaviors/input/placeholder", "i18n!csui/controls/table/impl/nls/lang",
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  "hbs!csui/dialogs/node.picker/impl/select.view/impl/header/header",
  'i18n!csui/dialogs/node.picker/impl/nls/lang',
  "css!csui/dialogs/node.picker/impl/select.view/impl/header/header",
  'csui/lib/jquery.ui/js/jquery-ui'
], function (_, $, Marionette, Backbone, PlaceholderBehavior, lang, TabableRegionBehavior, template,
    dialogLang) {

  var HeaderView = Marionette.ItemView.extend({

    template: template,
    tagName: 'div',

    templateHelpers: function () {
      return {
        search_icon_tooltip: _.str.sformat(lang.searchIconTooltip, this.options.columnTitle),
        search_placeholder: lang.searchByNamePlaceholder,
        search_clear_icon_tooltip: lang.searchClearIconTooltip,
        title: this.title,
        backButtonTooltip: dialogLang.backButtonTooltip,
        type: dialogLang.Type,
        name: dialogLang.Name,
        location: dialogLang.Location,
        searchView: this.options.searchView,
        searchInButtonAria: _.str.sformat(lang.searchPlaceholder, this.title),
        clearSearchButtonAria: dialogLang.clearSearchButtonAria,
        collapseSearch: dialogLang.collapseSearch,
        backButtonAria: dialogLang.backButtonTooltip
      };
    },

    ui: {
      searchBox: '> form.cs-modal-filter',
      closeSearchIcon: '> form .csui-form-control-search',
      openSearchIcon: '> .csui-folder-name .icon-sv-search',
      headerTitle: '> .csui-folder-name',
      searchInput: '> form .cs-filter-input',
      clearer: '> form .binf-form-control-feedback',
      tabElements: '> *[tabindex]',
      backBtn: '.csui-targetbrowse-history'
    },

    events: {
      'click .icon-sv-search': 'searchClicked',
      'click .csui-form-control-search': 'searchClicked',
      'paste @ui.searchInput': 'contentPasted',
      'change @ui.searchInput': 'filterChanged',
      'click @ui.clearer': 'searchFieldClearerClicked',
      'submit @ui.searchBox': 'filterChanged',
      'keydown': 'onKeyInView'
    },

    behaviors: {
      Placeholder: {
        behaviorClass: PlaceholderBehavior
      },

      TabableRegionBehavior: {
        behaviorClass: TabableRegionBehavior
      }
    },

    constructor: function HeaderView(options) {
      this.options = options || {};
      this.container = options.container;
      this.lastFilterValue = "";
      this.title = options.title;
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      if (this.container) {
        this.listenTo(this.container, 'change:name', function (node) {
          this.title = node.get('name');
          this.render();
        });
      }
    },

    currentlyFocusedElement: function (event) {
      var focusables = this.$el.find('*[data-cstabindex=-1]');
      if (focusables.length) {
        focusables.prop('tabindex', 0);
      }
      if (focusables.length > 1) {
        if (this.$el.find('.cs-go-back:visible').length && !event.shiftKey) {
          return this.$el.find('.cs-go-back');
        } else if (this.$el.find('.csui-folder-name.binf-hidden').length && !event.shiftKey) {
          return this.$el.find('input');
        } else if (this.$el.find('.csui-folder-name.binf-hidden').length && event.shiftKey) {
          return this.$el.find('button');
        } else {
          return this.$el.find('.csui-folder-name .icon-sv-search');
        }
      } else {
        return focusables[0];
      }
      return true;
    },

    onLastTabElement: function (shiftTab) {
      var tabItems = this.$('[data-cstabindex=-1]'),
          lastItem = tabItems.length - 1;

      if (tabItems.length) {
        var focusElement = shiftTab ? tabItems[0] : tabItems[lastItem];
        this.$('.csui-focus').removeClass('csui-focus');
        return $(focusElement).hasClass(TabableRegionBehavior.accessibilityActiveElementClass) &&
               !shiftTab;
      }

      return true;
    },

    onKeyInView: function (event) {
      var bubbleEvent = false,
          target      = $(event.target);
      switch (event.keyCode) {
      case 13:
        target.removeClass(TabableRegionBehavior.accessibilityActiveElementClass);
        $(event.target).trigger('click');
        break;
      case 27:
        if (!$(event.target).hasClass('.icon-sv-search')) {
          this.$el.trigger('tabNextRegion');
        }
        break;
      default:
        return true;
      }
      return bubbleEvent;
    },

    onRender: function () {
      this.ui.clearer.toggle(false);
      this.ui.searchBox.toggleClass('binf-hidden');
      this.ui.closeSearchIcon.toggleClass('binf-hidden');
      this.ui.searchInput.hide();

      var self = this;
      this.ui.searchInput.keyup(function (e) {
        self.filterChanged(e);
      });
      this.$el.find('*[data-cstabindex]').on('focus', function () {
        var target = $(this);
        self.focusedElement &&
        self.focusedElement.removeClass(TabableRegionBehavior.accessibilityActiveElementClass);
        target.addClass(TabableRegionBehavior.accessibilityActiveElementClass);
        self.focusedElement = target;
      });
    },

    searchClicked: function (event) {
      event.preventDefault();
      event.stopPropagation();
      Backbone.trigger('closeToggleAction');

      this.ui.headerTitle.toggleClass('binf-hidden');
      this.ui.searchInput.toggleClass(TabableRegionBehavior.accessibilityFocusableClass);

      this.ui.clearer.toggle(false);
      if (this.getValue().length) {
        this.ui.searchInput.val('');
        this.filterChanged(event);
      }
      this.ui.searchInput.toggle(200, 'linear', _.bind(function () {
        this.ui.searchInput.focus();
        this.ui.closeSearchIcon.toggleClass('binf-hidden');
      }, this));

      this.ui.closeSearchIcon.toggleClass(TabableRegionBehavior.accessibilityFocusableClass);
      this.ui.closeSearchIcon.removeClass(TabableRegionBehavior.accessibilityActiveElementClass);

      this.ui.openSearchIcon.toggleClass(TabableRegionBehavior.accessibilityFocusableClass);
      this.ui.searchBox.toggleClass('binf-hidden');

      if ($(event.target).hasClass('form-control-search')) {
        this.ui.searchInput.removeClass(TabableRegionBehavior.accessibilityActiveElementClass);
        this.ui.openSearchIcon.addClass(TabableRegionBehavior.accessibilityActiveElementClass);
        this.$el.trigger('setCurrentTabFocus');
      }
      else {
        this.ui.searchInput.addClass(TabableRegionBehavior.accessibilityActiveElementClass);
        this.ui.openSearchIcon.removeClass(TabableRegionBehavior.accessibilityActiveElementClass);
      }
      this.trigger('changed:focus');
      this.focusElement && this.focusElement.focus();
    },

    searchFieldClearerClicked: function (e) {
      e.preventDefault();
      e.stopPropagation();
      this.ui.clearer.removeClass(TabableRegionBehavior.accessibilityFocusableClass);
      this.ui.clearer.removeClass(TabableRegionBehavior.accessibilityActiveElementClass);
      this.ui.searchInput.val('');
      this.filterChanged(e);
      this.ui.searchInput.focus();
      this.ui.searchInput.addClass(TabableRegionBehavior.accessibilityActiveElementClass);
    },

    getColumn: function () {
      return this.options.column;
    },

    getValue: function () {
      var filterValue;

      filterValue = this.ui.searchInput.val();
      if (filterValue === this.ui.searchInput.attr('placeholder')) {
        filterValue = '';
      }

      return filterValue;
    },

    setValue: function (val) {
      if (val && val.length) {
        this.ui.searchInput.val(val);
        this.lastFilterValue = val;
      }
    },

    getShown: function () {
      return this.ui.searchInput.hasClass('binf-show');
    },

    setShown: function (show) {
      if (show === true && this.ui.searchInput.hasClass('binf-hidden')) {
        this.ui.searchInput.toggleClass('show binf-hidden');
      } else if (show === false && this.ui.searchInput.hasClass('binf-show')) {
        this.ui.searchInput.toggleClass('show binf-hidden');
      }
    },

    setFocus: function () {
      var textLen = this.ui.searchInput.val().length;
      this.ui.searchInput.focus();
      this.ui.searchInput[0].setSelectionRange(textLen, textLen);
    },

    contentPasted: function (event) {
      this.applyFilter();
    },

    filterChanged: function (event) {
      this.applyFilter();

      return false;
    },

    applyFilter: function () {
      var filterValue = this.getValue();
      var filterHasValue = !!filterValue.length;
      this.ui.clearer.toggle(filterHasValue);

      if (filterHasValue) {
        this.ui.clearer.addClass(TabableRegionBehavior.accessibilityFocusableClass);
      }
      else {
        this.ui.clearer.removeClass(TabableRegionBehavior.accessibilityFocusableClass);
      }

      if (this.lastFilterValue != filterValue) {
        this.lastFilterValue = filterValue;
        var self = this;
        if (this.filterTimeout) {
          clearTimeout(this.filterTimeout);
        }
        this.filterTimeout = setTimeout(function () {
          self.filterTimeout = undefined;
          self.trigger('change:filterValue', {name: self.getValue()});
        }, 1000);
      }
    }

  });

  return HeaderView;

});
