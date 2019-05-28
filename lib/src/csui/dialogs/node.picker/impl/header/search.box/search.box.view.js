/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/dialogs/node.picker/impl/search.list/search.query.model',
  'csui/dialogs/node.picker/impl/header/search.box/impl/search.box.model',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'i18n!csui/dialogs/node.picker/impl/header/search.box/impl/nls/lang',
  'hbs!csui/dialogs/node.picker/impl/header/search.box/impl/search.box',
  'hbs!csui/dialogs/node.picker/impl/header/search.box/impl/search.slice.dropdown', 'i18n',
  'css!csui/dialogs/node.picker/impl/header/search.box/impl/search.box',
  'csui/lib/jquery.ui/js/jquery-ui'
], function (module, _, $, Marionette,
    SearchQueryModel, SearchBoxModel, TabableRegionBehavior, lang,
    template, SliceDropDownTemplate, i18n) {
  "use strict";

  var config = _.defaults({}, module.config(), {
    showInput: false,
    inputValue: '',
    nodeName: '',
    searchFromHere: true
  });

  var SearchBoxView = Marionette.ItemView.extend({
    className: 'csui-search-box',
    template: template,
    templateHelpers: function () {
      var messages = {
        placeholder: lang.placeholder,
        clearerTitle: lang.clearerTitle,
        searchIconTitle: lang.searchIconTitle,
        searchBoxTitle: lang.searchBoxTitle,
        searchOptionsTitle: lang.searchOptionsTitle,
        searchOptionsSelect: lang.searchOptionsSelect,
        startSearch: lang.startSearch,
        searchIconAria: lang.searchIconAria
      };
      return {
        messages: messages
      };
    },
    sliceDropDownTemplate: SliceDropDownTemplate,
    ui: {
      input: '.csui-input',
      clearer: '.csui-clearer',
      searchIcon: '.csui-header-search-icon'
    },
    events: {
      'click .csui-header-search-icon': 'searchIconClicked',
      'focusin @ui.input': 'hideStartLocations',
      'click @ui.input': 'hidePopover',
      'keyup @ui.input': 'inputTyped',
      'paste @ui.input': 'inputChanged',
      'keydown @ui.clearer': 'clearerClicked',
      'change @ui.input': 'inputChanged',
      'click @ui.clearer': 'clearerClicked',
      'click .csui-searchbox-option': 'selectSearchOption',
      'keydown .csui-slice-checkbox': 'changeSearchOption',
      'focusout @ui.input': 'hideSearchOptionsDropDown',
      'focusout .csui-search-options-dropdown': 'hideSearchOptionsDropDown',
      'mouseleave .csui-search-options-dropdown': 'hideSearchOptionsDropDown'
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    constructor: function SearchBoxView(options) {
      options || (options = {});
      options.data = _.defaults({}, options.data, config);
      this.direction = i18n.settings.rtl ? 'left' : 'right';

      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      this.model = new SearchQueryModel(undefined, options);
      this.searchboxModel = new SearchBoxModel(undefined, options);

      this.listenTo(this.searchboxModel, "change", this.prepareTargetBrowsedropdown);
      this.listenTo(this.searchboxModel, "change", this.searchIconToggle);
      this.listenTo(this.searchboxModel, "change", this.hideSearchBar);
      if (!!this.model.get("where")) {
        $(document).bind('click.' + this.cid + ' keydown.' + this.cid, this, this._hideSearchBar);
      }
    },

    isSearchbarVisible: function () {
      return this.$('.search-bar').is(':visible');
    },

    onRender: function () {
      var value = this.options.data.inputValue || this.model.get('where');
      if (value) {
        this._setInputValue(value);
        this.$el.find(".search-bar").show();
      }
      if (this.options.data.showInput || value) {
        this.triggerMethod('before:show:input', this);
        this.ui.input.show();
        this.triggerMethod('show:input', this);
      }
      this.ui.searchIcon.removeClass('icon-header-search_enabled').addClass('icon-header-search');
      var self = this;
      this.$el.find('*[data-cstabindex]').on('focus', function () {
        self._updateFocusables(this);
      });
    },

    _updateFocusables: function (ele) { 
      var target = $(ele);
      this.focusedElement &&
      this.focusedElement.removeClass(TabableRegionBehavior.accessibilityActiveElementClass);
      target.addClass(TabableRegionBehavior.accessibilityActiveElementClass);
      this.focusedElement = target;

    },

    currentlyFocusedElement: function (arg) {
      if (this.$el) {
        var focusables = this.$el.find('*[data-cstabindex=-1]');
        if (focusables.length) {
          focusables.prop('tabindex', 0);
        }
        var shiftKey = !!arg && arg.shiftKey;
        if (!shiftKey && this.$el.find(".search-bar").length &&
            this.$el.find(".search-bar").is(":visible")) {
          this.focusElement = this.$el.find('.csui-input');
        } else if (this.$el.find('a.csui-acc-focusable').length) {
          this.focusElement = this.$el.find('a.csui-acc-focusable');
        }
      }
      return this.focusElement;
    },

    onLastTabElement: function (shiftTab) {

      var tabItems = this.$('[data-cstabindex=-1]'),
          lastItem = tabItems.length - 1,
          self     = this;
      this.$el.find('*[data-cstabindex]').on('focus', function () {
        self._updateFocusables(this);
      });
      if (tabItems.length) {
        var focusElement = shiftTab ? tabItems[0] : tabItems[lastItem];
        this.$('.csui-focus').removeClass('csui-focus');
        return $(focusElement).hasClass(TabableRegionBehavior.accessibilityActiveElementClass);
      }

      return true;
    },

    resetPageDefaults: function (event) {
      this.model.resetDefaults = true;
    },

    searchIconClicked: function (event) {
      $(document).bind('click.' + this.cid + ' keydown.' + this.cid, this, this._hideSearchBar);
      this.ui.input.toggleClass(TabableRegionBehavior.accessibilityFocusableClass);
      this.resetPageDefaults(event);
      if (!!this.searchboxModel.nodeId && this.$el.find('.csui-searchbox-option').length > 0) {
        this.$el.find('.csui-searchbox-option')[0].checked = this.options.data.searchFromHere;
      }
      if (this.$el.find(".search-bar").is(':visible')) {
        this.$el.find('a.icon-global-search').attr('aria-expanded', 'true');
        var value = this.ui.input.val().trim();
        if (!!value) {
          this._setInputValue(value);
          $(event.currentTarget).attr("title", lang.startSearch).attr("aria-label",
              lang.startSearch);
        }
        var searchOption = "",
            _selOption   = this.$el.find(".csui-searchbox-option:checked");
        if (!!_selOption) {
          searchOption = _selOption.val();
        }
        if (!!history.state && !!history.state.search) {
          this.previousState = history.state.search;
        }
        if (!!value) {
          this.model.clear({silent: true});
          var params = {};
          params['location_id1'] = searchOption;
          if (value) {
            params['where'] = value;
          }
          this.model.set(params);
          this.trigger("change:searchterm", this.model);
          this._updateInput(event);
        }
        if (!!this.previousState) {
          this.model["prevSearchState"] = this.previousState;
        }
      } else {
        if (this.$el && this.$el.parents()) {
          var eleLoadContainer = this.$el.parents(".target-browse ").find(
              "div[class='load-container']");
          if (eleLoadContainer && !eleLoadContainer.hasClass("binf-hidden")) {
            this.$el.find('a.icon-global-search').attr('aria-expanded', 'true');
            var that = this;
            this.hideStartLocations();
            this.$el.find('.search-bar').show('blind', {direction: this.direction}, '200',
                function () {
                  that.ui.input.focus();
                });
            if (this.model.attributes.where === "") {
              $(event.currentTarget).title = ""; // TODO What case is this? why empty the title?
              $(event.currentTarget).addClass("icon-header-search-nohover");
            }
          }
        }
      }
    },

    showStartLocations: function (event) {
      this.trigger("show:startLocation");
    },

    hideStartLocations: function (event) {
      this.trigger("hide:startLocation");
    },

    inputTyped: function (event) {
      var value = this.ui.input.val().trim();
      if (event.which === 13) {
        event.preventDefault();
        event.stopPropagation();
        this._setInputValue(value);
        if (!!value) {
          this.searchIconClicked(event);
        }
        if (this.previousValue != value) {
          this.previousValue = value;
        }
      } else if (event.keyCode == 27) {
        if (this.ui.searchIcon.is(":focus")) {
          event.preventDefault();
          event.stopImmediatePropagation();
        } else {
          this.hideSearchBar();
          this.ui.searchIcon.focus();
          event && event.stopPropagation();

        }
      } else {
        if (event.which === 40 && $('.csui-search-options-dropdown').is(':visible')) {
          this.$el.find('.csui-selected-checkbox').focus().focus();
        }
        else {
          this.inputChanged(event);
        }
      }
    },

    inputChanged: function (event) {
      var value = this.ui.input.val();
      this.searchIconToggle();
      this.ui.clearer.toggle(!!value.length);
      this.showOptionsDropdown(event);
    },

    showOptionsDropdown: function (event) {
      var _e = event || window.event;
      if (this.searchboxModel.nodeId && _e.which !== 27) {
        this.$el.find('.csui-search-options-dropdown').show();
        if (this.$el.find('.csui-searchbox-option').length > 0) {
          this.$el.find('.csui-searchbox-option')[0].checked = this.options.data.searchFromHere;
        }
      }
    },

    prepareTargetBrowsedropdown: function (e) {
      if (this.searchboxModel.nodeId) {
        this.searchOptions = {};
        this.searchOptions.nodeId = this.searchboxModel.nodeId;
        this.searchOptions.nodeIdSO = _.uniqueId('csui-so-' + this.searchboxModel.nodeId);
        this.searchOptions.select = lang.searchOptionsSelect;
        this.searchOptions.fromHere = lang.searchFromHere;
        this.searchOptions.selectFromHereAria = lang.searchFromHereAria;
        var content = this.sliceDropDownTemplate(this.searchOptions);
        this.$el.find('.csui-search-options-dropdown').html(content);
        this.hideSearchOptionsDropDown();
        this.ui.searchIcon.show();
        this.ui.searchIcon.removeClass('icon-header-search_enabled').addClass('icon-header-search');
      } else {
        this.destroyOptionspopover();
      }
    },

    destroyOptionspopover: function (e) {
      this.$el.find('.csui-search-options-dropdown').html("");
      this.$el.find('.csui-search-options-dropdown').hide();
    },

    changeSearchOption: function (event) {
      if (event.keyCode === 13 || event.keyCode === 32) {
        var _selEle = this.$el.find(".csui-searchbox-option:checked");
        if (_selEle.length > 0) {
          this.$el.find('.csui-searchbox-option')[0].checked = false;
        } else {
          this.$el.find('.csui-searchbox-option')[0].checked = true;
        }
        this.selectSearchOption(event);
      }
    },

    selectSearchOption: function (e) {
      var _selEle = this.$el.find(".csui-searchbox-option:checked");
      if (_selEle.length > 0) {
        this.options.data.searchFromHere = true;
      } else {
        this.options.data.searchFromHere = false;
      }
    },

    hideSearchOptionsDropDown: function () {
      var that = this;
      var searchFromHereIcon = that.$el.find('.csui-searchbox-option');
      searchFromHereIcon.attr("tabindex", -1);
      setTimeout(function () {
        if (that.$el.find('.csui-selected-checkbox')[0] === document.activeElement) {
          return false;
        }
        else {
          var self = that;
          if (that.popoverTimer) {
            clearTimeout(that.popoverTimer);
          }
          that.popoverTimer = setTimeout(function () {
            self.showSearchOptionDropDown();
          }, 800);
          return true;
        }
      }, 100);
    },

    showSearchOptionDropDown: function () {
      if (!this.$el.find('.csui-search-options-dropdown').is(":hover")) {
        $('.csui-search-options-dropdown').hide();
      } else {
        if (this.popoverTimer) {
          clearTimeout(this.popoverTimer);
        }
      }
    },

    clearerClicked: function (event) {
      if (event.type === "click" || event.keyCode === 13) {
        event.preventDefault();
        event.stopPropagation();
        this._setInputValue('');
        this.ui.searchIcon.removeClass('icon-header-search_enabled').addClass('icon-header-search');
        this.hidePopover(event);
        this.ui.input.focus();
      }
    },

    setSlices: function (e) {
      e.preventDefault();
      e.stopPropagation();
      var sliceId           = $(e.target).data("sliceid"),
          _checkedEle       = this.$el.find(".csui-search-popover-checked"),
          _toggleCurrentEle = this.$el.find(".icon-listview-checkmark"),
          _isCurrentEle     = _toggleCurrentEle.length > 0 &&
                              _toggleCurrentEle.attr("id") === $(e.target).data("sliceid") + "";
      this.options.sliceString = "";
      $(_checkedEle).removeClass("icon-listview-checkmark");
      if (!_isCurrentEle) {
        $("#" + sliceId).addClass("icon-listview-checkmark");
        this.options.sliceString = "{" + sliceId + "}";
      }
      this.slice = this.options.sliceString;
    },

    hidePopover: function (event) {
      if ($('.csui-search-box-slice-popover').css("display") === "block") {
        $('.csui-search-box-slice-popover').binf_popover('hide');
      }
      this.showOptionsDropdown(event);
    },

    hideSearchBar: function (event) {
      var ele  = this.$el.find(".search-bar"),
          self = this;
      this.ui.input.val("");
      ele.hide('blind', {direction: this.direction}, '200', function () {
        self.showStartLocations();
      });
      this.$el.find('.csui-header-search-icon').removeClass(
          'icon-header-search_enabled').addClass('icon-header-search');
    },

    _hideSearchBar: function (event) {
      var _e   = event || window.event,
          ele  = $('.search-bar'),
          that = event.data;
      if (ele.is(':visible')) {
        if ((_e.type === 'keydown' && (_e.keyCode === 27 || _e.which === 27)) ||
            (!$(_e.target).closest(ele).length && _e.type === 'click') &&
            !$(_e.target).closest('.csui-header-search-icon').length &&
            !$(_e.target).closest('.esoc-activityfeed-invisiblebutton').length) {

          $(this).find(".icon-header-search-nohover").removeClass("icon-header-search-nohover");
          $(this).find('.csui-input').val('');
          that.$el.find(ele).hide('blind', {direction: event.data.direction}, '200', function () {
            that.showStartLocations();
            that.focusedElement = undefined;
            var fe = that.currentlyFocusedElement();
            fe.focus();
          });
          $(this).find('.csui-search-box-slice-popover').binf_popover('hide');
          $(this).find('.csui-search-box .csui-header-search-icon').attr('title',
              lang.searchIconTitle);
          $(this).find('.csui-search-box .csui-header-search-icon').attr('aria-label',
              lang.searchIconAria);
          $(this).find('.csui-search-box .csui-header-search-icon').attr('aria-expanded', 'false');
          event.data.slice = event.data.model.get('slice');
          event.data.options.data.searchFromHere = true;
          if (!!this.$el) {
            this.$el.parents(".csui-navbar").find(".binf-navbar-brand").addClass(
                "binf-navbar-collapse");
          }
          $(this).find('.csui-search-options-dropdown').hide();
          $(this).find('.csui-search-box .csui-header-search-icon').removeClass(
              'icon-header-search_enabled').addClass('icon-header-search');
          $(document).unbind('click.' + this.cid + ' keydown.' + this.cid);
        }
      }
    },
    _updateInput: function (event) {
      if (this._isRendered) {
        var value = this.model.get('where') || '';
        this._setInputValue(value);
      }
    },

    _setInputValue: function (value) {
      this.ui.input.val(value);
      this.ui.clearer.toggle(!!value.length);
      this.searchIconToggle();
    },

    searchIconToggle: function () {
      var value = this.ui.input.val().trim();
      if (!!value) {
        this.ui.searchIcon.removeClass("icon-header-search").addClass("icon-header-search_enabled");
        this.ui.input.addClass("csui-input-focus");
        $(this.ui.searchIcon).attr("title", lang.startSearch).attr("aria-label", lang.startSearch);
        $(this.ui.searchIcon).removeClass("icon-header-search-nohover");
      } else {
        this.ui.searchIcon.removeClass("icon-header-search_enabled").addClass("icon-header-search");
        this.ui.input.removeClass("csui-input-focus");
        if (this.$el.find('.search-bar').is(':visible')) {
          $(this.ui.searchIcon).addClass("icon-header-search-nohover");
          $(this.ui.searchIcon).attr("title", lang.searchBoxTitle).attr("aria-label",
              lang.searchBoxTitle);
        }
      }
    }

  });

  return SearchBoxView;

});
