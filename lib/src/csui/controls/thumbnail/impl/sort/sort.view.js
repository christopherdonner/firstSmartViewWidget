/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['module',
  'require',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/utils/log',
  'i18n!csui/controls/thumbnail/impl/nls/lang',
  'hbs!csui/controls/thumbnail/impl/sort/impl/sort.menu',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/lib/binf/js/binf'
], function (module, require, $, _, Backbone, Marionette, log, lang, template,
    PerfectScrollingBehavior, TabableRegionBehavior) {

  var SortingView = Marionette.ItemView.extend({

    className: 'cs-sort-links',
    template: template,

    constants: {
      NAME_ASC: "asc_name",
      NAME_DESC: "desc_name",
      MODIFIED_ASC: "asc_modify_date",
      MODIFIED_DESC: "desc_modify_date",
      SIZE_ASC: "asc_size",
      SIZE_DESC: "desc_size"
    },

    templateHelpers: function () {
      var self          = this,
          sortListArray = [];
      _.each(this.constants, function (val, key) {
        sortListArray.push({key: val, value: lang[val], selected: false});
      });

      var isfound = _.any(sortListArray, function (a) {
        return (a.value === self.actualValue) ? a.selected = true : a.selected = false;
      }, self);

      return {
        id: _.uniqueId('sortButton'),
        selectedValue: self.selectedValue,
        selectedArrow: self.selectedArrow,
        sortListArray: sortListArray
      };
    },

    ui: {
      sortOrderBtn: '#search-sort-btn'
    },

    events: {
      'click .binf-dropdown-menu > li > a': 'onSortOptionClick'
    },

    constructor: function SortingView(options) {
      Marionette.ItemView.prototype.constructor.call(this, options);
      var state_order = options.collection.sorting.sort[0].value;
      var setLableName = state_order || this.constants.NAME_ASC;
      var labelName = this.OverlapDisplayText(setLableName);
      this.selectedValue = labelName;
      this.actualValue = lang[state_order] || lang[this.constants.NAME_ASC];
      this.selectedArrow = this.options.collection.orderstate || "icon-sortArrowDown";
      this.config = this.options.config || {};
    },

    onSortOptionClick: function (event) {
      event.preventDefault();
      event.stopPropagation();
      this.$el.find(".csui-search-sort-options li>a").removeClass("binf-active");
      this.$el.find(".csui-search-sort-options li>a>span").removeClass("icon-listview-checkmark");
      this.$(event.currentTarget).addClass('binf-active');
      this.resetSelection(event.currentTarget.children[1].id);
    },

    resetSelection: function (name) {
      switch (name) {
      case this.constants.NAME_ASC:
        this.collection.setOrder("name asc");
        this.selectedValue = lang[name];
        this.actualValue = lang.name;
        this.selectedArrow = "icon-sortArrowDown";
        this.options.collection.state = this.constants.NAME_ASC;
        this.options.collection.sorting.sort[0].value = this.constants.NAME_ASC;
        this.options.collection.orderstate = this.selectedArrow;
        break;
      case this.constants.NAME_DESC:
        this.collection.setOrder("name desc");
        this.selectedValue = lang[name];
        this.actualValue = lang.name;
        this.selectedArrow = "icon-sortArrowUp";
        this.options.collection.state = this.constants.NAME_DESC;
        this.options.collection.sorting.sort[0].value = this.constants.NAME_DESC;
        this.options.collection.orderstate = this.selectedArrow;
        break;
      case this.constants.MODIFIED_ASC:
        this.collection.setOrder("modify_date asc");
        this.selectedValue = lang[name];
        this.actualValue = lang.modified;
        this.selectedArrow = "icon-sortArrowDown";
        this.options.collection.state = this.constants.MODIFIED_ASC;
        this.options.collection.sorting.sort[0].value = this.constants.MODIFIED_ASC;
        this.options.collection.orderstate = this.selectedArrow;
        break;
      case this.constants.MODIFIED_DESC:
        this.collection.setOrder("modify_date desc");
        this.selectedValue = lang[name];
        this.actualValue = lang.modified;
        this.selectedArrow = "icon-sortArrowUp";
        this.options.collection.state = this.constants.MODIFIED_DESC;
        this.options.collection.sorting.sort[0].value = this.constants.MODIFIED_DESC;
        this.options.collection.orderstate = this.selectedArrow;
        break;
      case this.constants.SIZE_ASC:
        this.collection.setOrder("size asc");
        this.selectedValue = lang[name];
        this.actualValue = lang.size;
        this.selectedArrow = "icon-sortArrowDown";
        this.options.collection.state = this.constants.SIZE_ASC;
        this.options.collection.sorting.sort[0].value = this.constants.SIZE_ASC;
        this.options.collection.orderstate = this.selectedArrow;
        break;
      case this.constants.SIZE_DESC:
        this.collection.setOrder("size desc");
        this.selectedValue = lang[name];
        this.actualValue = lang.size;
        this.selectedArrow = "icon-sortArrowUp";
        this.options.collection.state = this.constants.SIZE_DESC;
        this.options.collection.sorting.sort[0].value = this.constants.SIZE_DESC;
        this.options.collection.orderstate = this.selectedArrow;
        break;
      }

      var self = this;
      this.options.collection.fetch({silent: true})
          .then(function () {
            self.trigger('render:sortmenu', name);
            self.$el.find('.binf-dropdown-toggle >span').innerText = lang[name];
            self.$el.find('.csui-sort-option.binf-active >span.cs-icon').addClass('icon-listview-checkmark');
            var labelName = self.OverlapDisplayText(name);
            self.$el.find('.binf-dropdown-toggle >span.cs-label').html(labelName);
            self.$el.find('.csui-sort-arrow').removeClass('icon-sortArrowDown');
            self.$el.find('.csui-sort-arrow').removeClass('icon-sortArrowUp');
            self.$el.find('.csui-sort-arrow').addClass(self.selectedArrow);
            self.$el.find('.csui-search-sort-options').removeClass('binf-open');
          }, self);

    },

    OverlapDisplayText: function (displayname) {
      var labelName = "";
      switch (displayname) {
      case this.constants.NAME_ASC:
        labelName = lang.name;
        break;
      case this.constants.NAME_DESC:
        labelName = lang.name;
        break;
      case this.constants.MODIFIED_ASC:
        labelName = lang.modified;
        break;
      case this.constants.MODIFIED_DESC:
        labelName = lang.modified;
        break;
      case this.constants.SIZE_ASC:
        labelName = lang.size;
        break;
      case this.constants.SIZE_DESC:
        labelName = lang.size;
        break;
      default:
        labelName = lang.name;
      }
      return labelName;
    },

    onRender: function () {
      var self = this;
      self.$el.find('.csui-search-sort-options li>a span.cs-label').each(function () {
        if ($(this).text().trim() === self.selectedValue) {
          $(this).siblings().addClass("icon-listview-checkmark");
        }
      }, self);
    }
  });
  return SortingView;
});
