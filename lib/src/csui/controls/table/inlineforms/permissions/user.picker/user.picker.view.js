/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery',
  'csui/lib/underscore',
  "csui/lib/marionette",
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'i18n!csui/controls/table/inlineforms/permissions/user.picker/impl/nls/lang',
  "hbs!csui/controls/table/inlineforms/permissions/user.picker/impl/user.picker",
  "css!csui/controls/table/inlineforms/permissions/user.picker/impl/user.picker"
], function ($, _, Marionette, TabableRegionBehavior, lang, template) {

  var UserLookupView = Marionette.ItemView.extend({

    className: 'cs-inline-user-lookup',

    template: template,

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior,
        initialActivationWeight: 100
      }
    },

    ui: {
      cancelButton: '.cs-cancel-button',
      saveButton: '.cs-save-button',
      inputBox: '.cs-search'
    },

    events: {
      'click @ui.saveButton': 'saveClicked',
      'click @ui.cancelButton': 'cancelClicked',
      'focus @ui.inputBox': 'inputBoxFocus',
      'click': 'handleClick'
    },

    handleClick: function (event) {
      event.preventDefault();
      event.stopPropagation();
    },

    templateHelpers: function () {
      return {
        SaveButtonLabel: lang.SaveButtonLabel,
        CancelButtonLabel: lang.CancelButtonLabel
      };
    },

    initialize: function (options) {
      this.options = options;
    },

    constructor: function UserLookupView(options) {
      var self = this;
      options || (options = {});
      options.data || (options.data = {});
      this.options = options;
      Marionette.ItemView.prototype.constructor.call(this, options);
    },

    inputBoxFocus: function () {
      this.focusIndex = 0;
    },

    onShow: function () {
      var self = this;
      this.focusIndex = 0;
      require(['csui/controls/userpicker/userpicker.view'
      ], function (UserPickerView) {
        self.pickerView = new UserPickerView({
          context: self.options.context,
          limit: 5,
          memberFilter: self.options.memberFilter,
          widgetoptions: self.options,
          placeholder: lang.UserPickerPlaceHolder,
          prettyScrolling: true,
          scrollContainerHeight: 'auto',
          model: self.options.userPickerModel,
          id_input: _.uniqueId("csui-inline-permissions-user-picker-input"),
          lightWeight: false
        });
        var pickerRegion = new Marionette.Region({
          el: self.$el.find('#csui-inline-permissions-user-picker')
        });
        pickerRegion.show(self.pickerView);
        if (self.pickerView.$el.find("input")) {
          self.pickerView.$el.find("input").focus();
        }
        self.listenTo(self.pickerView, "item:change", self.processItemChange);
        self.listenTo(self.pickerView, "item:clear", self.processItemChange);
        self.$el.bind('keydown', _.bind(self.onKeyInView, self));
        self.$el.find('input').focus().attr('tabindex', '-1');
      });
    },

    processItemChange: function () {
      var selectedModel = arguments.length > 0 && arguments[0].item;
      this.param = selectedModel;
      if (selectedModel) {
        this.options.currentRow.find(".cs-save-button").removeAttr("disabled");
      } else {
        this.options.currentRow.find(".cs-save-button").attr('disabled', true);
        this.$el.find('input').focus();
      }
    },

    currentlyFocusedElement: function () {
      var focusedEl = this.$el.find('input');
      return focusedEl;
    },

    cancelClicked: function (event) {
      event.preventDefault();
      event.stopPropagation();
      this.options.currentRow.removeClass("csui-changeowner-permission");
      this.options.currentRow.find(".member-info").removeClass("binf-hidden");
      this.trigger("change:completed");
    },

    saveClicked: function (event) {
      event.preventDefault();
      event.stopPropagation();
      if (this.$(".cs-search").val() === this.param.get("name_formatted")) {
        this.trigger("member:selected:save", this.param);
      } else {
        this.$(".csui-change-user-error").addClass('csui-change-user-error-display').html(
            lang.InvalidUser);
      }
    },

    onKeyInView: function (event) {
      var that = this;
      var elements              = this.$el.find("[tabindex]").filter(function (index, ele) {
            return that.$(ele).is(':visible') && !that.$(ele).is(':disabled');
          }),

          elemNum               = elements.length,
          currentElementInFocus = elements[this.focusIndex],
          textBoxFocused        = this.$(event.target).hasClass('cs-search');
      if (textBoxFocused) {
        this.focusIndex = 0;
      }

      switch (event.keyCode) {
      case 37 : // left arrow

        if (this.focusIndex > 0) {
          this.focusIndex--;
          elements[this.focusIndex].focus();
          event.preventDefault();
        }
        event.stopPropagation();
        break;

      case 9: //tab key
        if (!event.shiftKey) {
          this.focusIndex++;
          if (this.focusIndex <= elements.length - 1 && this.focusIndex >= 0) {
            elements[this.focusIndex].focus();
          }
          event.preventDefault();
          event.stopPropagation();
        } else {
          this.focusIndex--;
          if (this.focusIndex >= 0 && this.focusIndex <= elements.length - 1) {
            elements[this.focusIndex].focus();
          }
          event.preventDefault();
          event.stopPropagation();
        }
        break;
      case 39: //right arrow
        event.stopPropagation();
        break;
      case 38: // arrow up
      case 40: //arrow down
        event.preventDefault();
        event.stopPropagation();
        break;
      case 32: //space
        event.stopPropagation();
        break;
      case 13: //enter
        this.$(event.target).trigger('click');
        event.preventDefault();
        event.stopPropagation();
        break;
      default:
        event.stopPropagation();
        break;
      }
    }
  });
  return UserLookupView;
});