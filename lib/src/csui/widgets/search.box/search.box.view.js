/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/models/node/node.model', 'csui/utils/contexts/factories/search.box.factory',
  'csui/utils/contexts/factories/search.query.factory',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'i18n!csui/widgets/search.box/impl/nls/lang',
  'csui/utils/namedsessionstorage',
  'hbs!csui/widgets/search.box/impl/search.box',
  'hbs!csui/widgets/search.box/impl/search.slices.popover',
  'hbs!csui/widgets/search.box/impl/search.slice.dropdown', 'i18n',
  'css!csui/widgets/search.box/impl/search.box',
  'csui/lib/jquery.ui/js/jquery-ui', 'csui/lib/binf/js/binf'
], function (module, _, $, Marionette, NodeModel, SearchBoxFactory,
    SearchQueryModelFactory, TabableRegionBehavior, lang, NamedSessionStorage, template,
    SlicePopOverTemplate, SliceDropDownTemplate, i18n) {
  "use strict";

  var config = _.defaults({}, module.config(), {
    showOptionsDropDown: true,
    showSearchInput: false,
    showInput: false,
    inputValue: '',
    slice: '',
    nodeId: '',
    nodeName: '',
    searchFromHere: true,
    customSearchIconClass: "icon-header-search",
    customSearchIconNoHoverClass: "icon-header-search-nohover",
    customSearchIconEnabledClass: "icon-header-search_enabled"
  });

  var SearchBoxView = Marionette.ItemView.extend({
    className: 'csui-search-box',
    template: template,
    templateHelpers: function () {
      var messages = {
        showOptionsDropDown: this.options.data.showOptionsDropDown,
        placeholder: this.options.data.placeholder || lang.placeholder,
        clearerTitle: lang.clearerTitle,
        searchIconTitle: lang.searchIconTitle,
        searchIconAria: lang.searchIconAria,
        searchBoxTitle: lang.searchBoxTitle,
        searchOptionsTitle: lang.searchOptionsTitle,
        searchOptionsSelect: lang.searchOptionsSelect,
        startSearch: lang.startSearch,
        searchLandmarkAria: lang.searchLandmarkAria
      };
      return {
        messages: messages
      };
    },
    slicePopOverTemplate: SlicePopOverTemplate,
    sliceDropDownTemplate: SliceDropDownTemplate,
    namedSessionStorage: new NamedSessionStorage(),
    ui: {
      input: '.csui-input',
      clearer: '.csui-clearer',
      searchIcon: '.csui-header-search-icon',
      downCaret: '.csui-search-box-slice-popover'
    },
    events: {
      'click @ui.searchIcon': 'searchIconClicked',
      'keydown .csui-header-search-icon': 'searchIconKeyPressed',
      'click @ui.input': 'hidePopover',
      'keydown @ui.input': 'inputTyped',
      'paste @ui.input': 'inputChanged',
      'change @ui.input': 'inputChanged',
      'click @ui.clearer': 'clearerClicked',
      'keydown @ui.clearer': 'keyDownOnClear',
      'click .csui-search-popover-row': 'setSlices',
      'click .csui-searchbox-option': 'selectSearchOption',
      'click .csui-search-box-slice-popover': 'prepareSlicepopover',
      'focusout .csui-search-box-slice-popover': 'focusOutSlicePopover',
      'keydown .csui-search-box-slice-popover': 'accessibility',
      'keydown .csui-search-popover-row': 'accessibility',
      'focusout @ui.input': 'hideSearchOptionsDropDown',
      'focusout .csui-search-popover-row': 'focusOutSlicePopoverRow',
      'mouseup .csui-search-popover-row': 'togglePopover',
      'touchend .csui-search-popover-row': 'togglePopover',
      'focusout .csui-searchbox-option': 'hideSearchOptionsDropDown',
      'mouseleave .csui-search-options-dropdown': 'hideSearchOptionsDropDown'
    },

    currentlyFocusedElement: 'a.csui-acc-focusable',

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    constructor: function SearchBoxView(options) {
      options || (options = {});
      options.data = _.defaults({}, options.data, config);
      this.direction = i18n.settings.rtl ? 'left' : 'right';

      var context = options.context;
      if (!options.model) {
        options.model = context.getModel(SearchQueryModelFactory);
      }

      Marionette.ItemView.prototype.constructor.apply(this, arguments);

      this.listenTo(this.model, 'change:where', this._updateInput);
      if (this.options.data.showOptionsDropDown) {
        this.searchBoxFactory = context.getFactory(SearchBoxFactory);
        this.searchboxModel = this.searchBoxFactory.property;
        this.listenTo(context, 'sync:perspective', this._perspectiveSynced);
        this.listenTo(context, 'sync', this._dataSynced);
        this.listenTo(this.searchboxModel, "change", this.prepareSlicepopover);
        this.listenTo(this.searchboxModel, "change", this.prepareOptionsdropdown);
        this.listenTo(this.searchboxModel, "change", this.searchIconToggle);
      }
      if (!!this.model.get("where") || this.options.data.showSearchInput) {
        $(document).bind('click.' + this.cid + ' keydown.' + this.cid, this, this._hideSearchBar);
      }
      $(document).on('keydown', this, this._shortcutToQuery);
    },

    _shortcutToQuery: function (event) {
      if (event.ctrlKey && event.keyCode == 114) {
        var self = event.data;
        if (self.isSearchInputVisible()) {
          self.ui.input.focus();
        } else {
          self.searchIconClicked();
        }
      }
    },

    onBeforeDestroy: function () {
      $(document).off('keydown', this._shortcutToQuery);
    },

    isSearchbarVisible: function () {
      return this.$('.search-bar').is(':visible');
    },

    isSearchInputVisible: function () {
      return this.$('.csui-input').is(':visible');
    },

    focusOutSlicePopover: function (event) {
      if (this.$(".binf-popover").find(event.relatedTarget).length === 0) {
        this.$el.find('.csui-search-box-slice-popover').binf_popover('hide');
      }
      this.toggleIcon(event);
    },

    focusOutSlicePopoverRow: function (event) {
      if (this.$(".binf-popover").find(event.relatedTarget).length === 0) {
        if (event.relatedTarget &&
            !event.relatedTarget.classList.contains("csui-search-box-slice-popover")) {
          this.$el.find('.csui-search-box-slice-popover').binf_popover('hide');
        }
      }
    },

    _perspectiveSynced: function (context, perspectiveSource) {
      if (perspectiveSource instanceof NodeModel &&
          perspectiveSource.get('container')) {
        this.searchboxModel.nodeId = perspectiveSource.get('id');
        this.searchboxModel.nodeName = perspectiveSource.get('name');
        this.namedSessionStorage.set(this.searchboxModel.nodeId, this.searchboxModel.nodeName);
        this.searchboxModel.trigger("change");
      } else {
        this.searchboxModel.nodeId = undefined;
        this.searchboxModel.nodeName = undefined;
        this.searchboxModel.trigger("change");
      }
    },

    _dataSynced: function (context, perspectiveSource) {
      if (!this.searchboxModel.fetched) {
        this.searchBoxFactory.fetch();
      }
    },

    onRender: function (event) {
      if (this.options.data.showSearchInput) {
        this.$el.find(".search-bar").show();
        this.searchIconToggle();
      }
      var value = this.options.data.inputValue || this.model.get('where');
      this.slice = this.options.data.slice || this.model.get('slice');
      if (value) {
        this._setInputValue(value);
        this.$el.find(".search-bar").show();
      }
      if (this.options.data.showInput || value) {
        this.triggerMethod('before:show:input', this);
        this.ui.input.show();
        this.triggerMethod('show:input', this);
      }

      if (event && event.data) {
        this.$el.find('.csui-search-box .csui-header-search-icon').removeClass(
            event.data.options.data.customSearchIconEnabledClass).addClass(
            event.data.options.data.customSearchIconClass);
      }

    },

    prepareSlicepopover: function (e) {
      if (this.options.data.showOptionsDropDown) {
        if (this.searchboxModel.attributes.slices) {
          for (var slice in this.searchboxModel.attributes.slices) {
            if (this.searchboxModel.attributes.slices.hasOwnProperty(slice)) {
              this.searchboxModel.attributes.slices[slice].select = lang.searchOptionsSelect;
            }
          }
          this.$el.find('.csui-search-box-slice-popover').binf_popover({
            content: this.slicePopOverTemplate(this.searchboxModel.attributes),
            html: true
          });
          var titleVal = this.$el.find('.csui-search-box-slice-popover').attr(
              'data-original-title');
          if (!titleVal) { // TODO why is this needed to get a stable title?
            titleVal = lang.searchOptionsTitle;
          }
          this.$el.find('.csui-search-box-slice-popover').attr('title', titleVal);
          if (this.slice) {
            this._setSliceValue(this.slice);
          }
        }
        if ($('.search-bar').is(':visible')) {
          $(".binf-navbar-brand").removeClass("binf-navbar-collapse");
        }
      }
      this.toggleIcon(e); //toggle the 'downcart' based on if popover is open or not.

    },

    toggleIcon: function (e, isToggle) {
      if (!!e && e.type === "click" && this.ui.downCaret.hasClass('dropup') ||
          (!!e && e.type === "focusout" &&
           this.$(".binf-popover").find(e.relatedTarget).length === 0) || !!isToggle) {//handle click and focusout.
        this.ui.downCaret.removeClass('dropup');
        this.ui.downCaret.attr('aria-expanded', 'false');
      } else if ($('.search-bar-content .binf-popover').is(":visible")) {
        this.ui.downCaret.addClass('dropup');
        this.ui.downCaret.attr('aria-expanded', 'true');
      }
    },

    accessibility: function (event) {
      var e     = this.$el.find('.csui-search-slice-container'),
          elms  = e.children('.csui-search-popover-row'),
          index = elms.index(elms.filter('.active'));

      if (event.keyCode === 13 && $(elms[index]).hasClass('active')) {
        $(elms[index]).trigger('click');
        this.togglePopover(event);
      } else if (event.keyCode === 32 &&
                 this.$el.find(document.activeElement).is('.csui-search-box-slice-popover')) {
        event.preventDefault();
        this.ui.downCaret.trigger('click');
      } else if (event.keyCode === 9 || event.keyCode === 27) {
        $('.csui-search-box-slice-popover').binf_popover('hide');
        this.ui.downCaret.focus();
        this.toggleIcon(event, true);
      } else {
        if (event.keyCode === 38 || event.keyCode === 40) {
          $(elms).removeClass('active');
          event.preventDefault();
          if (event.keyCode === 38) { // up arrow key
            index = index === -1 ? (elms.length - 1) : index - 1;
          }
          if (event.keyCode === 40) { // down arrow key
            index = index === (elms.length - 1) ? -1 : index + 1;
          }
          if (index === -1) {
            this.ui.downCaret.focus();
          } else {
            $(elms[index]).addClass('active').focus();
          }
        }
      }

    },

    togglePopover: function (event) {
      var that = this;
      setTimeout(function () {
        var canHidePopover         = that.$el.find(document.activeElement).is(
            '.csui-search-popover-row,.csui-search-box-slice-popover'),
            canSetFocusOnDownCaret = (event.keyCode === 13 || event.type === 'mouseup' ||
                                      event.type === 'touchend');
        if (canHidePopover || canSetFocusOnDownCaret) {
          $('.csui-search-box-slice-popover').binf_popover('hide');
        }
        if (canSetFocusOnDownCaret) {
          that.ui.downCaret.focus();
        }
      }, 100);
      this.toggleIcon(event, true); //always show drop-down icon. therefore, send "true" flag.
    },

    hidePopover: function (event) {
      if (this.options.data.showOptionsDropDown) {
        if ($('.csui-search-box-slice-popover').css("display") === "block") {
          $('.csui-search-box-slice-popover').binf_popover('hide');
        }
        this.showOptionsDropdown(event);
      }
    },

    resetPageDefaults: function (event) {
      this.model.resetDefaults = true;
    },

    searchIconKeyPressed: function (event) {
      if (event.keyCode === 32) {
        event.preventDefault();
        this.searchIconClicked(event);
      }
    },

    searchIconClicked: function (event) {
      this.ui.searchIcon.attr('aria-expanded', 'true');
      $(document).bind('click.' + this.cid + ' keydown.' + this.cid, this, this._hideSearchBar);
      this.resetPageDefaults(event);
      if (this.options.data.showOptionsDropDown) {
        this.searchboxModel.nodeId !== undefined ?
        (this.$el.find('.csui-searchbox-option')[0].checked = this.options.data.searchFromHere) :
        "";
      }
      if ($('.search-bar').is(':visible')) {
        var value = this.ui.input.val().trim();
        if (!!value) {
          this._setInputValue(value);
          $(event.currentTarget).attr("title", lang.startSearch);
          this.trigger("hide:breadcrumbspanel");
        }
        var searchOption = "",
            _selOption   = this.$el.find(".csui-searchbox-option:checked");
        if (this.options.data.showOptionsDropDown) {
          if (!!_selOption) {
            searchOption = _selOption.val();
          }
        } else {
          searchOption = this.options.data.nodeId;
        }

        if (!!history.state && !!history.state.search) {
          this.previousState = history.state.search;
        }
        if (!!value) {
          this._setSearchQuery(value, this.options.sliceString, searchOption, event);
          this._updateInput();
          if (!this.options.data.searchFromHere) {
            this.destroyOptionspopover();
          }
          this.options.data.searchFromHere = true;
        }
        if (!!this.previousState) {
          this.model["prevSearchState"] = this.previousState;
        }
      } else {
        var that = this;
        $('.search-bar').show('blind', {direction: this.direction}, '200', function () {
          that.ui.input.focus();
          that.ui.input.prop('tabindex', 0);
          that.ui.downCaret.prop('tabindex', 0);
        });
        this._updateInput();
        $(".binf-navbar-brand").removeClass("binf-navbar-collapse");
        if (this.options.data.showOptionsDropDown) {
          this.prepareSlicepopover();
        }
        if (this.model.attributes.where === "") {
          event.currentTarget.title = "";
          $(event.currentTarget).addClass(this.options.data.customSearchIconNoHoverClass);
        }
      }

    },

    _setSliceValue: function (sliceVal) {
      if ($('[id^="popover"]').css("display") === "block") {
        if (!!sliceVal && sliceVal !== "{}") {
          this.$el.find("#" + sliceVal.substring(1, sliceVal.length - 1)).addClass(
              "icon-listview-checkmark");
        }
      }
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
      }
      else {
        if (event.which === 40 && $('.csui-search-options-dropdown').is(':visible')) {
          this.$el.find('.csui-searchbox-option').focus();
        }
        else {
          this.inputChanged(event);
        }
      }
    },

    inputChanged: function (event) {
      var value = this.ui.input.val();
      this.ui.clearer.prop('tabindex', value !== '' ? 0 : -1);
      this.searchIconToggle();
      this.ui.clearer.toggle(!!value.length);
      if (this.options.data.showOptionsDropDown) {
        this.showOptionsDropdown(event);
      }
    },

    showOptionsDropdown: function (event) {
      if (this.options.data.showOptionsDropDown) {
        var _e = event || window.event;
        if (this.searchboxModel.nodeId && _e.keyCode !== 27) {
          this.$el.find('.csui-search-options-dropdown').show();
          this.$el.find('.csui-searchbox-option')[0].checked = this.options.data.searchFromHere;
        }
      }
    },

    prepareOptionsdropdown: function (e) {
      if (this.options.data.showOptionsDropDown) {
        if (!this.searchboxModel.nodeId && this.model.get('location_id1')) {
          this.searchboxModel.nodeId = this.model.get('location_id1');
          if (!!this.namedSessionStorage.get(this.searchboxModel.nodeId)) {
            this.searchboxModel.nodeName = this.namedSessionStorage.get(this.searchboxModel.nodeId);
          }
        }
        if (this.searchboxModel.nodeId) {
          this.searchOptions = {};
          this.searchOptions.nodeId = this.searchboxModel.nodeId;
          this.searchOptions.nodeIdSO = _.uniqueId('csui-so-' + this.searchboxModel.nodeId);
          if (!this.searchboxModel.nodeName && this.options.data.nodeName) {
            this.searchboxModel.nodeName = this.options.data.nodeName;
          }
          if (this.searchboxModel.nodeName) {
            this.searchOptions.nodeName = " (" + this.searchboxModel.nodeName + ")";
          }
          this.searchOptions.select = lang.searchOptionsSelect;
          this.searchOptions.fromHere = lang.searchFromHere;
          this.searchOptions.checked = this.options.data.searchFromHere ? 'checked' : '';
          var content = this.sliceDropDownTemplate(this.searchOptions);
          this.$el.find('.csui-search-options-dropdown').html(content);
          this.hideSearchOptionsDropDown();
        } else {
          this.destroyOptionspopover();
        }
      }
    },

    destroyOptionspopover: function (e) {
      this.$el.find('.csui-search-options-dropdown').html("");
      this.$el.find('.csui-search-options-dropdown').hide();
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
      setTimeout(function () {
        if (that.$el.find('.csui-searchbox-option')[0] === document.activeElement) {
          return false;
        } else if (that.options.data.showOptionsDropDown) {
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
      if (this.options.data.showOptionsDropDown) {
        if (!$('.csui-search-options-dropdown').is(":hover")) {
          $('.csui-search-options-dropdown').hide();
        } else {
          if (this.popoverTimer) {
            clearTimeout(this.popoverTimer);
          }
        }
      }
    },

    keyDownOnClear: function (event) {
      if (event.keyCode === 13) {
        this.clearerClicked(event);
      }
    },
    clearerClicked: function (event) {
      event.preventDefault();
      event.stopPropagation();

      this._setInputValue('');
      this.ui.searchIcon.removeClass(this.options.data.customSearchIconEnabledClass).addClass(
          this.options.data.customSearchIconClass);
      this.hidePopover(event);
      this.ui.input.focus();
    },

    _setSearchQuery: function (value, sliceString, searchOption, event) {
      this.model.clear({silent: true});
      var params = {};
      if (!!sliceString) {
        params['slice'] = sliceString;
      }
      if (!!searchOption) {
        params['location_id1'] = searchOption;
      }
      if (value) {
        params['where'] = value;
      }
      this.model.set(params);
      this.hidePopover(event);
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

    _hideSearchBar: function (event) {
      var _e  = event || window.event,
          ele = $('.search-bar');
      if (ele.is(':visible')) {
        if ((_e.type === 'keydown' && (_e.keyCode === 27 || _e.which === 27) &&
             !$('.search-bar-content .binf-popover').is(":visible")) ||
            (!$(_e.target).closest(ele).length &&
            _e.type === 'click') && !$(_e.target).closest('.csui-header-search-icon').length &&
            !$(_e.target).closest('.esoc-activityfeed-invisiblebutton').length) {
          $(this).find("." + event.data.options.data.customSearchIconNoHoverClass).removeClass(
              event.data.options.data.customSearchIconNoHoverClass);
          $(this).find('.csui-input').val('');
          $(this).find(ele).hide('blind', {direction: event.data.direction}, '200', function () {
            $(".binf-navbar-brand").addClass("binf-navbar-collapse");
          });
          $(this).find('.csui-search-box-slice-popover').binf_popover('hide');
          $(this).find('.csui-search-box .csui-header-search-icon')[0].title = lang.searchIconTitle;
          $($(this).find('.csui-search-box .csui-header-search-icon')[0]).attr("aria-expanded",
              'false');
          event.data.slice = event.data.model.get('slice');
          event.data.options.data.searchFromHere = true;
          $(this).find('.csui-search-options-dropdown').hide();
          $(this).find('.csui-search-box .csui-header-search-icon').removeClass(
              event.data.options.data.customSearchIconEnabledClass).addClass(
              event.data.options.data.customSearchIconClass);

          $(document).unbind('click.' + this.cid + ' keydown.' + this.cid);

          var view = event.data;
          view.trigger("hide:searchbar");
          $('.csui-search-box-slice-popover').prop('tabindex', -1);
          $('.csui-input').prop('tabindex', -1);

        }
      }
    },
    _updateInput: function () {
      if (this._isRendered) {
        var value = this.model.get('where') || '';
        this._setInputValue(value);
      }
    },
    _setInputValue: function (value) {
      this.ui.input.val(value);
      this.ui.clearer.toggle(!!value.length);
      this.searchIconToggle();
      if (this.options.data.showOptionsDropDown) {
        this.options.data.nodeName = this.searchboxModel.nodeName;
      }
    },
    searchIconToggle: function () {
      var value = this.ui.input.val().trim();
      if (!!value) {
        this.ui.searchIcon.removeClass(this.options.data.customSearchIconClass).addClass(
            this.options.data.customSearchIconEnabledClass);
        this.ui.input.addClass("csui-input-focus");
        $(this.ui.searchIcon).attr("title", lang.startSearch);
        $(this.ui.searchIcon).removeClass(this.options.data.customSearchIconNoHoverClass);
      } else {
        this.ui.searchIcon.removeClass(this.options.data.customSearchIconEnabledClass).addClass(
            this.options.data.customSearchIconClass);
        this.ui.input.removeClass("csui-input-focus");
        if ($('.search-bar').is(':visible')) {
          $(this.ui.searchIcon).attr("title", lang.searchBoxTitle).addClass(
              this.options.data.customSearchIconNoHoverClass);
        }
      }
    }

  });

  return SearchBoxView;

});
