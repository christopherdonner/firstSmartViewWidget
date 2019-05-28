/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["csui/lib/underscore", "csui/lib/jquery", "csui/lib/marionette", 'csui/lib/backbone',
  "csui/behaviors/input/placeholder",
  "i18n!csui/controls/table/impl/nls/lang",
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/models/member/member.model',
  'csui/models/member/membercollection',
  "hbs!csui/dialogs/members.picker/impl/select.view/impl/header/header",
  'i18n!csui/dialogs/node.picker/impl/nls/lang',
  'i18n!csui/dialogs/members.picker/impl/nls/root/lang'
], function (_, $, Marionette, Backbone, PlaceholderBehavior, lang, TabableRegionBehavior,
    MemberModel, MemberChildrenCollection, template, dialogLang, memberPickerDialogLang) {

  var HeaderView = Marionette.ItemView.extend({

    template: template,
    tagName: 'div',

    templateHelpers: function () {
      return {
        title: this.options.title ||
               !!this.options && !!this.options.container && this.options.container.get('name'),
        search_icon_tooltip: _.str.sformat(lang.searchIconTooltip, this.options.columnTitle),
        search_placeholder: lang.searchByNamePlaceholder,
        search_clear_icon_tooltip: lang.searchClearIconTooltip,
        backButtonTooltip: dialogLang.backButtonTooltip || lang.backButtonTooltip,
        type: dialogLang.Type,
        name: dialogLang.Name,
        location: dialogLang.Location,
        searchView: this.options.searchView,
        searchInButtonAria: _.str.sformat(lang.searchPlaceholder, this.title),
        clearSearchButtonAria: dialogLang.clearSearchButtonAria,
        allMembers: (this.container.id || this.container.groupId) ? false : true,
        openSearchBar: memberPickerDialogLang.openSearchBar,
        closeSearchBar: memberPickerDialogLang.closeSearchBar,
        collapseSearch: dialogLang.collapseSearch,
        backButtonAria: lang.backButtonTooltip
      };
    },

    ui: {
      searchBox: '> form.cs-modal-filter',
      openSearchIcon: '> .csui-folder-name .icon-sv-search',
      headerTitle: '> .csui-folder-name',
      searchInput: '> form .cs-filter-input',
      clearer: '> form .binf-form-control-feedback',
      tabElements: '> *[tabindex]',
      closeSearchButton: '> form .csui-form-control-search',
      backButton: ".csui-targetbrowse-arrow-back"
    },

    events: {
      'click .icon-sv-search': 'searchClicked',
      'click @ui.closeSearchButton': 'searchClicked',
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
      this.title = options.title;
      this.headerView = this;
      Marionette.ItemView.prototype.constructor.apply(this, arguments);

      if (this.container) {
        this.listenTo(this.container, 'change:name', function (member) {
          this.title = member.get('name');
          this.render();
        });
      }
    },

    onRender: function () {
      this.ui.clearer.toggle(false);
      this.ui.searchBox.toggleClass('binf-hidden');
      this.ui.closeSearchButton.toggleClass('binf-hidden');
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

    currentlyFocusedElement: function () {
      var focusables = this.$el.find('*[data-cstabindex=-1]');
      if (focusables.length) {
        focusables.prop('tabindex', 0);
      }
      if (this.focusedElement) {
        return this.focusedElement;
      }
      if (this.$el.find('.csui-folder-name.binf-hidden').length) {
        this.focusElement = this.$el.find('input');
      } else if (this.$el.find('.csui-targetbrowse-arrow-back .cs-go-back').is(':visible')) {
        this.focusElement = this.$el.find('.csui-targetbrowse-arrow-back .cs-go-back');
      }
      else {
        if (this.$el.find('.csui-folder-name .icon-sv-search').is(':visible')) {
          this.focusElement = this.$el.find('.csui-folder-name .icon-sv-search');
        }

      }
      return this.focusElement;
    },

    onLastTabElement: function (shiftTab) {
      var tabItems = this.$('[data-cstabindex=-1]'),
          lastItem = tabItems.length - 1;
      if (tabItems.length) {
        var focusElement,
            focusElementIndex = 0,
            lastIndex = lastItem + 1,
            change = 1;
        if(!shiftTab){
          focusElementIndex = lastItem;
          lastIndex = -1;
          change = -1;
        }
        for(var i= focusElementIndex; i!=lastIndex ; i=i+change){
          if($(tabItems[i]).is(':visible')){
            focusElementIndex = i;
            break;
          }
        }
        if(focusElementIndex >= 0 && focusElementIndex <= lastItem){
          focusElement = tabItems[focusElementIndex];
        }
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
      }, this));

      this.ui.closeSearchButton.toggleClass(TabableRegionBehavior.accessibilityFocusableClass);
      this.ui.closeSearchButton.removeClass(TabableRegionBehavior.accessibilityActiveElementClass);

      this.ui.openSearchIcon.toggleClass(TabableRegionBehavior.accessibilityFocusableClass);
      this.ui.searchBox.toggleClass('binf-hidden');
      this.ui.closeSearchButton.toggleClass('binf-hidden');

      if ($(event.target).hasClass('form-control-search')) {
        this.ui.searchInput.removeClass(TabableRegionBehavior.accessibilityActiveElementClass);
        this.ui.openSearchIcon.addClass(TabableRegionBehavior.accessibilityActiveElementClass);
        this.$el.trigger('setCurrentTabFocus');
      } else {
        this.ui.searchInput.addClass(TabableRegionBehavior.accessibilityActiveElementClass);
        this.ui.openSearchIcon.removeClass(TabableRegionBehavior.accessibilityActiveElementClass);
      }
      this.trigger('changed:focus');
      this.focusElement.focus();
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
      } else {
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
          self.trigger('change:filterValue',
              {name: self.getValue(), collection: self.options.collection});
        }, 1000);
      }
    }
  });

  return HeaderView;
});
