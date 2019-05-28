/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/handlebars',
  'csui/lib/marionette',
  'csui/utils/namedsessionstorage',
  'csui/utils/contexts/factories/user',
  'esoc/widgets/activityfeedwidget/util',
  'i18n!esoc/widgets/activityfeedwidget/impl/nls/lang',
  'hbs!esoc/widgets/activityfeedwidget/impl/activityfilter',
  'csui/lib/perfect-scrollbar'
], function ($, _, Handlebars, Marionette, NamedSessionStorage, UserModelFactory, Util,
    Lang, ActivityFeedFilterTemplate) {
  var self = null;
  var AcitivityFeedFilterView = Marionette.ItemView.extend({
    className: "esoc-activity-filter-view",
    isAlreadyClicked: false,
    template: ActivityFeedFilterTemplate,
    namedSessionStorage: new NamedSessionStorage("esoc-activity-filterinfo"),
    util: Util,
    templateHelpers: function () {
      return {
        messages: {
          fieldValue: this.fillFormFields(),
          hideupdatesfrom: this.options.hideupdatesfrom,
          contentupdates: Lang.contentupdates,
          attributeupdates: Lang.attributeupdates,
          statusupdates: Lang.statusupdates,
          allusers: Lang.allusers,
          iamfollowing: Lang.iamfollowing,
          myfollowers: Lang.myfollowers,
          myupdates: Lang.myupdates,
          mentions: Lang.mentions,
          myfavorites: Lang.myfavorites,
          activitytypes: Lang.activitytypes,
          refineby: Lang.refineby,
          updatesfrom: Lang.updatesfrom,
          allselectedlabel: Lang.allselectedlabel,
          widgetid: this.options.widgetId ||
                    this.options.collection.widgetOptions.activityfeed.widgetId
        }
      }
    },
    initialize: function (options) {
      this.options = options;
      self = this;
    },
    constructor: function AcitivityFeedFilterView(options, parentView) {
      options = options || {};
      Marionette.ItemView.prototype.constructor.call(this, options);
      this.firstFilterIndex = 0
      this.lastFilterIndex = 0
      this.parentView = parentView;
    },

    onKeyInView: function (event, isFirst) {
      var keyCode = event.keyCode,
          target  = $(event.target);
      switch (keyCode) {
      case 32:
      case 13:
        if (target.prop('checked')) {
          target.prop('checked', false);
        } else {
          target.prop('checked', true);
        }
        target.triggerHandler('click', true);
        break;
      case 38:
      case 40:
        this.moveToNextFilter(this, keyCode === 38, target, isFirst);
        break;
      default:
        return true;
      }
      return false;
    },

    moveToNextFilter: function (view, keyUp, target, isFirst) {
      if (isFirst) {
        this.processFilter(".csui-facet:first .csui-facet-item", keyUp, "firstFilter");
      } else {
        this.processFilter(".csui-facet:last .csui-facet-item", keyUp, "lastFilter");
      }
    },

    processFilter: function (className, keyUp, filterType) {
      var filterViewContainers  = this.$el.find(className),
          numViews              = filterViewContainers.length - 1,
          filterIndex           = filterType + "Index",
          filterElement         = filterType + "Element",
          previousFilterElement = $(filterViewContainers[this[filterIndex]]).find(
              '.esoc_activityfeed_filter');
      if (keyUp) {
        this[filterIndex] = this[filterIndex] === 0 ? numViews : --this[filterIndex];
      }
      else {
        this[filterIndex] = this[filterIndex] === numViews ? 0 : ++this[filterIndex];
      }

      this[filterElement] = $(filterViewContainers[this[filterIndex]]).find(
          '.esoc_activityfeed_filter');
      if (this.parentView) {
        Util.commonUtil.moveFocusFromSrcToDest(this.parentView, previousFilterElement,
            this[filterElement], true);
      }
      this[filterElement].attr("type") !== "radio" && this[filterElement].focus();
    },

    onAfterShow: function () {
      var that = this;
      var parentView;

      that.$el.find(".esoc_activityfeed_filter").click(function (event, isFromTriggerHandler) {
        if (isFromTriggerHandler) {
          that.updateActivityFeed(event);
          that.isAlreadyClicked = true;
        } else if (that.isAlreadyClicked) {
          that.isAlreadyClicked = false;
          event.preventDefault();
          event.stopPropagation();
          return false;
        } else {
          that.updateActivityFeed(event);
        }
      });

      if (this.parentView) {
        parentView = this.parentView;
        if (parentView.options.origin !== "userwidget") {
          that.$el.find(".cs-filter-group:first .esoc_activityfeed_filter").bind('keydown',
              function (event) {
                that.onKeyInView(event, true);
              });
          that.$el.find(".cs-filter-group:last .esoc_activityfeed_filter").bind('keydown',
              function (event) {
                that.onKeyInView(event, false);
              });
        } else {
          that.$el.find(".cs-filter-group .esoc_activityfeed_filter").bind('keydown',
              function (event) {
                that.onKeyInView(event, true);
              });
        }
      }
      this.$el.find(".esoc-activityfeed-filters").perfectScrollbar({suppressScrollX: true});
      this.options.connector.authenticator.on('loggedOut', function () {
        that.namedSessionStorage.storage.removeItem("esoc-activity-filterinfo");
      });
    },

    fillFormFields: function () {
      var feedType               = this.options.feedtype,
          feedTypes              = {'status': '', 'content': '', 'attribute': ''},
          updatesFrom            = {
            'all': '',
            'following': '',
            'followers': '',
            'myupdates': '',
            'mentions': '',
            'myfavorites': ''
          },
          filterOptions          = {},
          selectedFilterOptions  = {},
          widgetUniqueId         = self.options.widgetId ||
                                   self.options.collection.widgetOptions.activityfeed.widgetId,
          namedSessionStorageKey = self.options.filterSource ?
                                   self.options.filterSource + "_" +
                                   widgetUniqueId : widgetUniqueId;
      if (self.namedSessionStorage.get(namedSessionStorageKey)) {
        filterOptions = self.namedSessionStorage.get(namedSessionStorageKey);
        filterOptions["feedtype"] = filterOptions.feedtype;
        if (!!filterOptions.updatesfrom && !!filterOptions.updatesfrom.from) {
          filterOptions["updatesfrom"] = filterOptions.updatesfrom.from;
        }
      } else {
        filterOptions["feedtype"] = this.options.feedtype;
        if (!!self.options.updatesfrom && !!self.options.updatesfrom.from) {
          filterOptions["updatesfrom"] = self.options.updatesfrom.from;
        }
      }
      if (!!filterOptions.updatesfrom) {
        updatesFrom[filterOptions.updatesfrom] = "checked";
      }
      if (filterOptions.feedtype === "all") {
        $.each(feedTypes, function (key, value) {
          selectedFilterOptions[key] = "checked";
        });
      } else if (!!filterOptions.feedtype) {
        if (typeof filterOptions.feedtype === "string") {
          feedTypes = filterOptions.feedtype.split(',');
        }
        else {
          feedTypes = filterOptions.feedtype;
        }
        feedTypes.forEach(function (value) {
          selectedFilterOptions[value] = "checked";
        });
      }
      selectedFilterOptions["from"] = updatesFrom;
      return selectedFilterOptions;
    },
    onShow: function (e) {
      this.changeLabel();
    },
    updateActivityFeed: function (e) {
      if (this.parentView) {
        var focusedElement = $(e.target);
        focusedElement.prop("tabindex", "0").attr("data-cstabindex", "0");
        this.parentView.focusedElement = focusedElement;
      }

      if (!!this.parentView.activityview.adaptivepollObj) {
        this.parentView.activityview.adaptivepollObj.destroy();
      }

      this.changeLabel();
      this.util.commonUtil.updateSelection(e, this, "updatesfrom");
      var filterOptions         = {},
          feedTypeindex         = 0,
          feedTypesCheckedVal   = [],
          updatesFromCheckedVal = "";
      this.$el.find('input[type=checkbox]:checked').each(function () {
        feedTypesCheckedVal[feedTypeindex++] = $(this).val();
      });
      this.$el.find('input[type=radio][checked]').each(function () {
        updatesFromCheckedVal = $(this).val();
      });

      filterOptions = _.extend(filterOptions, {"feedtype": feedTypesCheckedVal});
      this.user = this.options.context ? this.options.context.getModel(UserModelFactory) :
                  undefined;

      if (!!updatesFromCheckedVal) {
        if ($.inArray(updatesFromCheckedVal, ["following", "followers"]) !== -1) {
          filterOptions = _.extend(filterOptions, {
            "updatesfrom": {
              "from": updatesFromCheckedVal,
              "id": !!self.user && !!self.user.get('id') ? self.user.get('id') : 0
            }
          });
        } else {
          filterOptions = _.extend(filterOptions, {
            "updatesfrom": {
              "from": updatesFromCheckedVal
            }
          });
        }
      }
      var widgetId = self.options.widgetId ||
                     self.options.collection.widgetOptions.activityfeed.widgetId;
      var loadFirstTime = false;
      if (!(this.namedSessionStorage.get(widgetId))) {
        this.storeFilterInfo(filterOptions);
        loadFirstTime = true;
      }
      if (loadFirstTime === true ||
          this.namedSessionStorage.get(widgetId).updatesfrom.from !== updatesFromCheckedVal ||
          e.currentTarget.name === "feedtype") {
        loadFirstTime = false;
        this.storeFilterInfo(filterOptions);
        this.trigger('select:filter', filterOptions);
      }
    },
    storeFilterInfo: function (filterOptions) {
      var otherUser = self.options.otherUser;
      if (!otherUser) {
        var widgetId               = self.options.widgetId ||
                                     self.options.collection.widgetOptions.activityfeed.widgetId,
            namedSessionStorageKey = (self.options.filterSource) ?
                                     self.options.filterSource + "_" + widgetId : widgetId;
        this.namedSessionStorage.set(namedSessionStorageKey, filterOptions);

      }
    },
    changeLabel: function () {
      var selectedCheckboxCount = this.$el.find("input[name='feedtype']:checked").length;
      if (selectedCheckboxCount === this.$el.find("input[name='feedtype']").length ||
          selectedCheckboxCount === 0) {
        this.$el.find('.esoc-activityfeed-allfilter-label').show();
        this.$el.find('.esoc-activityfeed-filter-feedtypes').hide();
      } else {
        this.$el.find('.esoc-activityfeed-filter-feedtypes').show();
        this.$el.find('.esoc-activityfeed-allfilter-label').hide();
      }
    }
  });
  return AcitivityFeedFilterView;
});