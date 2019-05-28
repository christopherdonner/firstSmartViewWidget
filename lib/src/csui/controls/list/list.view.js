/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/marionette',
  'csui/utils/base', 'csui/controls/list/emptylist.view',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior', 'i18n',
  'hbs!csui/controls/list/impl/list', 'i18n!csui/controls/list/impl/nls/lang',
  'css!csui/controls/list/impl/list', 'csui/lib/jquery.ui/js/jquery-ui'
], function (_, $, Marionette, base, EmptyListView,
    PerfectScrollingBehavior, i18n, listTemplate, lang) {

  var ListItemView = Marionette.ItemView.extend({

    constructor: function ListItemView() {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    }

  });

  var ListView = Marionette.CompositeView.extend({

    direction: !!i18n.settings.rtl ? 'left' : 'right',

    constructor: function ListView(options) {
      options || (options = {});
      _.defaults(options, {
        filterValue: ''
      });
      if (!(this.behaviors && _.any(this.behaviors, function (behavior, key) {
        return behavior.behaviorClass === PerfectScrollingBehavior;
      }))) {
        this.behaviors = _.extend({
          PerfectScrolling: {
            behaviorClass: PerfectScrollingBehavior,
            contentParent: '> .tile-content',
            suppressScrollX: true,
            scrollYMarginOffset: 15
          }
        }, this.behaviors);
      }

      Marionette.CompositeView.prototype.constructor.call(this, options);
      var currentListTitle = !!this.templateHelpers() && !!this.templateHelpers().title ?
                             ' ' + this.templateHelpers().title.toLowerCase() : '',
          messages         = {
            'expandTitle': _.str.sformat(lang.expandView, currentListTitle),
            'expandAria': lang.expandAria,
            'searchTooltip': _.str.sformat(lang.searchView, currentListTitle),
            'collapseSearchTooltip': lang.collapseSearch
          };
      this.templateHelpers = _.defaults(this.templateHelpers(), lang, messages);
    },

    templateHelpers: function () {
    },

    setValidator: function () {
      this.validator = setInterval(_.bind(this.validateInput, this), 10);
    },

    unsetValidator: function () {
      clearInterval(this.validator);
    },

    className: 'cs-list tile content-tile',
    template: listTemplate,

    childViewContainer: '.binf-list-group',
    childView: ListItemView,
    childViewOptions: function () {
      return {
        template: this.options.childViewTemplate
      };
    },

    emptyView: EmptyListView,

    ui: {
      headerTitle: '.tile-title',
      searchIcon: '.cs-search-icon',
      searchBox: '.search-box',
      searchInput: '.search',
      clearer: '.clearer',
      tileExpand: '.tile-expand',
      fadeout: '.fadeout'
    },

    events: {
      'keydown': 'onKeyDown'
    },

    triggers: {
      'click .tile-header': 'click:header'
    },
    onKeyDown: function (event) {
    },

    onRender: function () {
      this.ui.searchInput.hide();
      this.ui.clearer.toggle(false);

      this.ui.searchIcon.on('click', _.bind(this.searchClicked, this));
      this.ui.searchBox.on('click', _.bind(this.searchBoxClicked, this));
      this.ui.clearer.on('click', _.bind(this.searchFieldClearerClicked, this));
      this.ui.searchInput.on('input', _.bind(this.searchInput, this));

      this.srOnly = this.$el.find('.tile-content .binf-sr-only');
      this.tileHeader = this.$el.find('.tile-header');

      this.titleId = _.uniqueId("dlgTitle");
      this.$(this.ui.headerTitle).find('.csui-heading').attr('id', this.titleId);
      this.$(this.tileHeader).parent().attr('role', 'region').attr('aria-labelledby', this.titleId);
      this.tileHeader.focusin(_.bind(this.focusinAria, this));
      this.tileHeader.focusout(_.bind(this.focusoutAria, this));
    },

    focusinAria: function () {
      this.srOnly.attr('aria-live', 'polite');
      this.setElementsVisibleAria();
    },

    focusoutAria: function () {
      this.srOnly.attr('aria-live', 'off');
      this.srOnly.html('');
    },

    searchBoxClicked: function (event) {
      event.stopPropagation();
    },

    searchFieldClearerClicked: function () {
      this.ui.searchInput.val('');
      this.filterChanged();
      this.ui.searchInput.focus();
    },

    isSearchOpen: function () {
      return this.ui.searchInput.is && this.ui.searchInput.is(":visible");
    },

    searchClicked: function (event) {
      this.ui.searchInput.val('');
      this.ui.clearer.toggle(false);

      this.ui.headerTitle.toggle('fade', _.bind(function () {
        this._resetFilter();
      }, this));

      this.ui.searchInput.toggle('blind', {direction: this.direction}, 200, _.bind(function () {
        if (this.isSearchOpen()) {
          this.setValidator();
          this.ui.searchInput.prop('tabindex', '0');
          this.ui.searchInput.focus();
          this.ui.fadeout.show();
          this.iconsAriaLabel = this.$(this.ui.searchIcon).attr("aria-label");
          this.$(this.ui.searchIcon).attr("title", lang.collapseSearch).attr("aria-expanded",
              "true").attr("aria-label", lang.collapseAria);
          this.$(this.ui.searchIcon).addClass('icon-search-hide');
        } else {
          this.unsetValidator();
          this.ui.fadeout.hide();
          this.$(this.ui.searchIcon).attr("title", this.templateHelpers.searchTooltip).attr(
              "aria-expanded", "false").attr("aria-label", this.iconsAriaLabel);
          this.$(this.ui.searchIcon).removeClass('icon-search-hide');
        }
        return;
      }, this));

      event && event.stopPropagation();

      return;
    },

    validateInput: function () {
      if (!this.ui.searchInput.val) {
        return;
      }
      var bIsFilled = this.ui.searchInput.val && !!this.ui.searchInput.val().length;
      this.ui.clearer.toggle(bIsFilled);
      this.ui.clearer.prop('tabindex', bIsFilled ? '0' : '-1');
    },

    searchInput: function (event) {
      if (this.keyInputTimer) {
        clearTimeout(this.keyInputTimer);
      }
      this.keyInputTimer = setTimeout(_.bind(function () {
        this.keyInputTimer = undefined;
        this.filterChanged();
      }, this), 300);
    },

    filterChanged: function () {
      this.options.filterValue = this.ui.searchInput.val();
      this.trigger('change:filterValue');
      this.setElementsVisibleAria();
    },

    setElementsVisibleAria: function () {
      var numElements = this.collection ? this.collection.size() : '0';
      this.srOnly.html(_.str.sformat(lang.elementsVisibleAria, numElements));
    },

    _resetFilter: function () {
      this.ui.searchInput.val('');
      this.filterChanged();
    },
    getElementByIndex: function (index) {
      if (isNaN(index) || (index < 0)) {
        return null;
      }
      var targetEle   = this.showInlineActionBar ? 'div.csui-item-standard:nth-child({0})' :
                        'div a:nth-child({0})',
          nthChildSel = _.str.sformat(targetEle, index + 1),
          $item       = this.$(nthChildSel);
      return $($item[0]);
    }

  });

  return ListView;

});
