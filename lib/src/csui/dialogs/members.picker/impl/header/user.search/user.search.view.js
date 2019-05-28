/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery',
  'csui/lib/underscore',
  "csui/lib/marionette",
  'csui/behaviors/keyboard.navigation/tabable.region.behavior', 'i18n',
  'i18n!csui/dialogs/members.picker/impl/nls/lang',
  "hbs!csui/dialogs/members.picker/impl/header/user.search/user.search"
], function ($, _, Marionette, TabableRegionBehavior, i18n, lang, template) {

  var UserSearchView = Marionette.ItemView.extend({

    className: 'csui-user-lookup',
    template: template,

    templateHelpers: {
      searchIconTitle: lang.searchIconTitle,
      searchIconAria: lang.searchIconAria
    },

    ui: {
      input: '.cs-search',
      userPickerIcon: '.csui-header-userpicker-icon'
    },

    events: {
      'click @ui.userPickerIcon': 'userPickerIconClicked'
    },

    initialize: function (options) {
      this.options = options;
    },

    constructor: function UserSearchView(options) {
      var self = this;
      options || (options = {});
      options.data || (options.data = {});
      this.options = options;
      this.direction = i18n.settings.rtl ? 'left' : 'right';
      Marionette.ItemView.prototype.constructor.call(this, options);
    },

    onShow: function () {
      var self = this;
      require(['csui/controls/userpicker/userpicker.view'
      ], function (UserPickerView) {
        self.pickerView = new UserPickerView({
          context: self.options.context,
          limit: 5,
          memberFilter: {type: [0, 1]},
          widgetoptions: self.options,
          placeholder: self.options.placeHolder || lang.UserPickerPlaceHolder,
          prettyScrolling: true,
          scrollContainerHeight: 'auto',
          model: self.options.userPickerModel,
          id_input: _.uniqueId("csui-inline-permissions-user-picker-input"),
          lightWeight: false
        });
        var pickerRegion = new Marionette.Region({
          el: self.$el.find('.csui-user-search-bar')
        });
        pickerRegion.show(self.pickerView);
        self.listenTo(self.pickerView, "item:change", self.processItemChange);
        self.listenTo(self.pickerView, "item:clear", self.processItemChange);
      });
    },

    processItemChange: function () {
      var selectedModel = arguments.length > 0 && arguments[0].item;
      this.param = selectedModel;
      this.trigger("show:selectItem", this.param);
      this.processAfterSelect();
    },

    processAfterSelect: function () {
      if (this.pickerView.ui.searchbox.val() !== "") {
        this.pickerView && this.pickerView.ui && this.pickerView.ui.searchclear &&
        this.pickerView.ui.searchclear.trigger("click");
      }
    },

    updatePlaceHolder: function (memberExists) {
      if (memberExists) {
        this.$el.find("input").attr("placeholder", lang.addAnotherNamePlaceHolder);
      } else {
        this.$el.find("input").attr("placeholder", lang.UserPickerPlaceHolder);
      }
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

    userPickerIconClicked: function (event) {
      $(document).bind('click.' + this.cid + ' keydown.' + this.cid, this, this._hideSearchBar);
      this.ui.input.toggleClass(TabableRegionBehavior.accessibilityFocusableClass);
      if (this.$el.find(".csui-user-search-container").is(':visible')) {
      } else {
        if (this.$el && this.$el.parents()) {
          var that = this;
          this.hideStartLocations();
          this.$el.find('.csui-user-search-container').show('blind', {direction: this.direction},
              '200',
              function () {
                that.$el.find('.csui-user-search-container input').focus();
              });
        }
      }
      this.ui.userPickerIcon.attr('aria-expanded', true);
    },

    _hideSearchBar: function (event) {
      var _e   = event || window.event,
          ele  = $('.csui-user-search-container'),
          that = event.data;
      if (ele.is(':visible')) {
        if ((_e.type === 'keydown' && (_e.keyCode === 27 || _e.which === 27)) ||
            (!$(_e.target).closest(ele).length &&
            _e.type === 'click') && !$(_e.target).closest('.csui-header-userpicker-icon').length) {
          that.$el.find('.csui-user-search-container input').val('');
          that.$el.find(ele).hide('blind', {direction: event.data.direction}, '200', function () {
            that.showStartLocations();
            that.focusedElement = undefined;
            var fe = that.currentlyFocusedElement();
            fe.focus();
          });
          $(document).unbind('click.' + that.cid + ' keydown.' + that.cid);
          if (that.ui.userPickerIcon instanceof Object) {
            that.ui.userPickerIcon.attr('aria-expanded', false);
          }
        }
      }
    },

    showStartLocations: function (event) {
      this.trigger("show:startLocation");
    },

    hideStartLocations: function (event) {
      this.trigger("hide:startLocation");
    }
  });
  return UserSearchView;
});
