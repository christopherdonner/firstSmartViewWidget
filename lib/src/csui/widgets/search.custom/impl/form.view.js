/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['module', 'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/marionette',
  'csui/lib/alpaca/js/alpaca',
  'csui/controls/form/form.view'
], function (module, $, _, Marionette, Alpaca, FormView) {

  var CustomSearchFormView = FormView.extend({
    constructor: function CustomSearchFormView(options) {
      this.options = options || {};
      FormView.prototype.constructor.call(this, _.extend(options, {custom: {adjustHeight: true}}));
      this.jQuery = $;
      var that = this;
      this.customFlatten = function (x, result, prefix) {
        if (_.isObject(x)) {
          _.each(x, function (v, k) {
            that.customFlatten(v, result, k);
          });
        } else {
          if (/^(anydate|anyvalue)/i.test(x)) {
            x = "";
          }
          result[prefix] = x;
        }
        return result;
      };

      this.customFilter = function () {
        var that        = this,
            result      = [],
            flattenData = that.customFlatten(that.objectList(that.getValues()), {});
        if (_.isObject(flattenData)) {
          _.each(flattenData, function (v, k) {
            if (that.customEndsWith(k, '_DFrom') || that.customEndsWith(k, '_DFor') ||
                that.customEndsWith(k, '_DTo')) {
              var original_k = k.substr(0, k.lastIndexOf('_'));
              if (!v && !!flattenData[original_k]) {
                flattenData[original_k] = "";
              }
            }
            if (v) {
              result.push(v);
            }
          });
        }
        return result;
      };

      this.customEndsWith = function (string, substring) {
        return string.indexOf(substring, string.length - substring.length) !== -1;
      };

      this.objectList = function (data) {
        var list = [];
        _.each(data, function (item) {
          if (_.isObject(item)) {
            list.push(item);
          }
        });
        return _.flatten(list);
      };

      this.$el.on("keydown", function (event) {

        if (event.keyCode === 13 &&
            (event.target.type === "text" || event.target.type === 'search') &&
            event.target.value.trim() !== "") {
          if ($(event.target).is('input.typeahead') &&
              $(event.target).siblings('.typeahead.scroll-container:visible').length !== 0) {
            return;
          }
          that.triggerSearch(event);
        } else if (event.keyCode === 13 &&
                   that.jQuery(".binf-dropdown-menu").parent(".binf-open").length >= 1) {
          event.stopImmediatePropagation();
        } else if (event.keyCode === 13) {
          if (event.target.value === "") {
            var defaultValues = that.customFilter();
            if (!!defaultValues && defaultValues.length === 0) {
              that.jQuery(".csui-custom-search-form-submit").addClass("binf-disabled").addClass(
                  "csui-search-form-submit-disabled");
            } else {
              that.triggerSearch(event);
            }
          } else {
            that.jQuery(".csui-custom-search-form-submit").removeClass("binf-disabled").removeClass(
                "csui-search-form-submit-disabled");
          }
        }
      });

      this.$el.on("keyup", function (event) {
        if (event.target.type === "text") {
          if (event.target.value === "") {
            var defaultValues = that.customFilter();
            if (!!defaultValues && defaultValues.length === 0) {
              that.jQuery(".csui-custom-search-form-submit").addClass("binf-disabled").addClass(
                  "csui-search-form-submit-disabled");
            }
          } else {
            that.jQuery(".csui-custom-search-form-submit").removeClass("binf-disabled").removeClass(
                "csui-search-form-submit-disabled");
          }
        }
      });
    },

    triggerSearch: function (event) {
      var that = this;
      setTimeout(function (event) {
        if (!that.jQuery(".csui-custom-search-form-submit").hasClass("binf-disabled")) {
          that.$el.closest('.csui-custom-view-search').find(
              '.csui-custom-search-form-submit').click();
        }
      }, 50);
    },

    updateRenderedForm: function () {
      return false;
    },

    onRenderForm: function () {
      this.options.customView.triggerMethod("render:form");
    },

    onChangeField: function (event) {
      var defaultValues = this.customFilter();
      if (defaultValues.length === 0) {
        this.jQuery(".csui-custom-search-form-submit").addClass("binf-disabled").addClass(
            "csui-search-form-submit-disabled");
      } else {
        this.jQuery(".csui-custom-search-form-submit").removeClass("binf-disabled").removeClass(
            "csui-search-form-submit-disabled");
      }
      if (window.event && (window.event.keyCode === 13 || window.event.which === 13)) {
        if (!!event.value) {
          this.jQuery(".csui-custom-search-form-submit").removeClass("binf-disabled").removeClass(
              "csui-search-form-submit-disabled");
          this.options.customView.triggerMethod("field:updated");
        } else {
          if (!!defaultValues && defaultValues.length === 0) {
            this.jQuery(".csui-custom-search-form-submit").addClass("binf-disabled").addClass(
                "csui-search-form-submit-disabled");
          } else if (defaultValues && defaultValues.length !== 0) {
            this.options.customView.triggerMethod("field:updated");
          }
        }
      }
    }
  });
  return CustomSearchFormView;
});
