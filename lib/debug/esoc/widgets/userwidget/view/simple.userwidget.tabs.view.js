csui.define([
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/handlebars',
  'csui/lib/marionette',
  'csui/utils/url',
  'csui/controls/tab.panel/tab.links.ext.scroll.mixin',
  'csui/behaviors/keyboard.navigation/tabables.behavior',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'esoc/widgets/userwidget/userprofile',
  'esoc/widgets/userwidget/view/simple.userwidget.form.view',
  'csui-ext!esoc/widgets/userprofile/tab.extension',
  'hbs!esoc/widgets/userwidget/impl/simple.userwidget.tabs',
  'i18n!esoc/widgets/userwidget/nls/lang',
  'css!esoc/widgets/userwidget/impl/userwidget.css'
], function ($, _, Backbone, Handlebars, Marionette, Url,
    TabLinksScrollMixin, TabablesBehavior, TabableRegionBehavior, LayoutViewEventsPropagationMixin,
    UserProfile, SimpleUserWidgetFormView, extraTabs, simpleUserWidgetTabsTemplate, Lang) {

  var UserProfileTabContentCollectionView, UserProfileTabPanelView, UserProfileTabLinkCollectionView;
  var loadItems = function () {
    var deferred = $.Deferred();
    if (!!UserProfileTabContentCollectionView && !!UserProfileTabPanelView &&
        !!UserProfileTabLinkCollectionView) {
      deferred.resolve();
    } else {
      require(['csui/controls/tab.panel/tab.panel.view',
            'csui/controls/tab.panel/impl/tab.contents.view',
            'csui/controls/tab.panel/impl/tab.links.view'],
          function (TabPanelView, TabContentCollectionView,
              TabLinkCollectionView) {
            UserProfileTabContentCollectionView = TabContentCollectionView.extend({
              className: 'esoc-simple-user-widget-tab-view',
              constructor: function UserProfileTabContentCollectionView(options) {
                options || (options = {});
                _.defaults(options, {
                  toolbar: true,
                  searchTabContentForTabableElements: true
                });
                TabContentCollectionView.prototype.constructor.apply(this, arguments);
              }
            });
            UserProfileTabPanelView = TabPanelView.extend({
              className: 'esoc-simple-user-widget-tab-view',
              constructor: function UserProfileTabPanelView(options) {
                options || (options = {});
                _.defaults(options, {
                  toolbar: true,
                  searchTabContentForTabableElements: true
                });
                TabPanelView.prototype.constructor.apply(this, arguments);

              },
              behaviors: {
                TabableRegionBehavior: {
                  behaviorClass: TabableRegionBehavior
                }
              },
              currentlyFocusedElement: function (shiftTab) {
                var element = this.options.focusedElement;
                if (shiftTab === undefined || shiftTab.shiftKey === false) {
                  return $(this.$el.find("a[title]").filter(":visible").filter(":not(a:empty)")[0]);
                } else if (element && $(element).length) {
                  return element;
                }
              },
              onLastTabElement: function (shiftTab) {
                var tabableElements = this.$el.find(
                    "[tabindex=" + this.options.tabCount + "]").filter(
                    ":visible").filter(":not(a:empty)");
                var focusElement = shiftTab ? this.$el.find("a[title]").filter(":visible").filter(
                    ":not(a:empty)")[0] : tabableElements.last();
                if (!shiftTab && tabableElements.length === 1 &&
                    this.options.tabIndex + 1 === this.options.tabCount) {
                  this.options.tabIndex = 0;
                  return true;
                }
                return $(focusElement).hasClass(
                    TabableRegionBehavior.accessibilityActiveElementClass);
              }
            });
            UserProfileTabLinkCollectionView = TabLinkCollectionView.extend({
              className: 'esoc-simple-user-widget-tab-view',
              constructor: function UserProfileTabLinkCollectionView(options) {
                options || (options = {});
                _.defaults(options, {
                  toolbar: true,
                  searchTabContentForTabableElements: true
                });
                TabLinkCollectionView.prototype.constructor.apply(this, arguments);
              }
            });
            deferred.resolve();
          }, deferred.reject);
    }
    return deferred.promise();
  };

  var SimpleUserWidgetViewTabs = Marionette.ItemView.extend({
    className: 'esoc-simple-user-widget-tab-view',
    template: simpleUserWidgetTabsTemplate,
    templateHelpers: function () {
      return {
        uniqueId: this.options.uniqueId,
        extraTabs: this.getExtraTabs(extraTabs),
        messages: {
          profile: Lang.profile,
          settings: Lang.settings
        }
      };
    },
    events: {
      'click .esoc-user-profile-tab': 'showTab'
    },
    behaviors: {
      TabableRegionBehavior: {
        behaviorClass: TabableRegionBehavior
      }
    },
    constructor: function SimpleUserWidgetViewTabs(options) {
      options = options || {};
      _.defaults(options, {
        toolbar: true,
        tabClickedOnce: false,
        initialActivationWeight: 1
      });
      Marionette.ItemView.prototype.constructor.call(this, options);
      this.uniqueId= _.uniqueId();

    },
    onRender: function (e) {
      var that = this;
      loadItems().done(function () {
        that.propagateEventsToRegions();
        var UserProfileTabPanelViewClass = new UserProfileTabPanelView(_.extend(that));
        UserProfileTabPanelViewClass.tabLinks = new UserProfileTabLinkCollectionView(_.extend(
            that));
        UserProfileTabPanelViewClass.tabContent = new UserProfileTabContentCollectionView(_.extend(
            that));
        UserProfileTabPanelViewClass.options = that.options;
        $.extend(that, UserProfileTabPanelViewClass);
        that._initializeOthers();
      });
    },
    onShow: function () {
      if (this.templateHelpers().extraTabs.length === 0) {
        this.options.userwidgetmodel = this.options.model;
        var simpleUserWidgetFormView = new SimpleUserWidgetFormView(this.options),
            contentRegion            = new Marionette.Region({
              el: this.$el.find('#esoc-simple-user-widget-form-body-' + this.options.uniqueId)
            });
        contentRegion.show(simpleUserWidgetFormView);
      }
    },
    onAfterShow: function () {
      loadItems();
    },
    _initializeOthers: function () {
      var options = {
        gotoPreviousTooltip: Lang.previous,
        gotoNextTooltip: Lang.next
      };
      this._initializeToolbars(options);
      this._listenToTabEvent();

      // delay this a bit since the initial dialog fade in makes the tab to be hidden
      setTimeout(_.bind(this._enableToolbarState, this), 300);
    },
    showTab: function (e) {
      UserProfile.showTab(e.currentTarget.id, "esoc-simple-user-widget-form-body-" + this.options.uniqueId,
          this.options, this);
    },
    getExtraTabs: function (extraTabs) {
      var that = this;
      extraTabs = _.flatten(extraTabs, true);
      _.each(extraTabs, function (tab) {
        if (!!tab.tabCount) {
          tab.tabCount.count = tab.tabCount.getItemCount(that.model, that.options);
        }
        tab.show = true;
        if (!!tab.showTab) {
          tab.show = tab.showTab(that.model, that.options);
        }
      });
      return extraTabs;
    }
  });
  _.extend(SimpleUserWidgetViewTabs.prototype, TabLinksScrollMixin);
  _.extend(SimpleUserWidgetViewTabs.prototype, LayoutViewEventsPropagationMixin);
  return SimpleUserWidgetViewTabs;
});