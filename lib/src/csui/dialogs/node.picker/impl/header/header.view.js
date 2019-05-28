/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/dialogs/node.picker/impl/header/apply.properties.selector/apply.properties.selector.view',
  'csui/dialogs/node.picker/impl/header/start.location.selector/start.location.selector.view',
  'csui/dialogs/node.picker/impl/header/search.box/search.box.view',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'hbs!csui/dialogs/node.picker/impl/header/header',
  'i18n!csui/dialogs/node.picker/impl/nls/lang',
  'csui/lib/handlebars.helpers.xif',
  'css!csui/dialogs/node.picker/impl/header/header'
], function (_,
    $,
    Marionette,
    ApplyPropertiesSelectorView,
    StartLocationCollectionView,
    SearchBoxView,
    TabableRegionBehavior,
    headerTemplate,
    lang) {

  var HeaderView = Marionette.LayoutView.extend({
    template: headerTemplate,
    className: 'cs-header-control',
    regions: {
      startLocations: '.csui-start-locations',
      globalSearch: '.csui-global-search',
      properties: '.apply-properties-selector'
    },

    ui: {
      saveFilter: '.csui-filtername',
      saveFilterError: '.csui-filtername-error',
      startlocations: '.csui-start-locations'
    },

    events: {
      'keyup @ui.saveFilter': 'onChangeFilterName',
      'keydown @ui.startlocations': 'onStartLoaction',
      'focusout @ui.saveFilter': 'onFocusoutFilterName'
    },

    templateHelpers: function () {
      var options = this.options;
      return {
        title: options.title,
        locationSelector: options.locationSelector,
        propertiesSeletor: options.propertiesSeletor,
        saveFilter: options.saveFilter,
        placeHolderName: lang.placeHolderName,
        globalSearch: options.globalSearch,
        backButtonTooltip: lang.backButtonTooltip
      };
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    initialize: function () {
      var options = this.options;
      var defaultApplyPropertiesOption = ApplyPropertiesSelectorView.KEEP_ORIGINAL_PROPERTIES;
      if (options.propertiesSeletor) {
        this.propertiesView = new ApplyPropertiesSelectorView({
          selected: defaultApplyPropertiesOption,
          includeCombineProperties: this.options.includeCombineProperties
        });
      }

      if (options.locationSelector) {
        this.startLocationView = new StartLocationCollectionView({
          collection: this.options.locations,
          title: this.options.dialogTitle,
          selected: this.options.initialLocation
        });
      }
      if (options.globalSearch !== false) {
        var initialLocationID, initialLocationName;
        if (this.options.initialLocation) {
          var initialLocationFactory = this.options.initialLocation.get("factory");
          initialLocationID = (!!initialLocationFactory &&
                               !!initialLocationFactory.options.container) ?
                              initialLocationFactory.options.container.get("id") : null;
          initialLocationName = (!!initialLocationFactory &&
                                 !!initialLocationFactory.options.container) ?
                                initialLocationFactory.options.container.get("name") : null;
        }
        this.searchBoxView = new SearchBoxView({
          targetBrowseSearch: true,
          locationID: initialLocationID,
          locationName: initialLocationName
        });
        this.searchboxModel = this.searchBoxView.searchboxModel;
        this.searchQueryModel = this.searchBoxView.model;
      }
    },

    onRender: function () {
      var options = this.options;
      if (this.startLocationView) {
        this.startLocations.show(this.startLocationView);
      }

      if (this.propertiesView) {
        this.properties.show(this.propertiesView);
      }

      if (this.searchBoxView) {
        this.globalSearch.show(this.searchBoxView);
      }

      this.searchBoxView.on('show:startLocation', this.showStartLocations, this);
      this.searchBoxView.on('hide:startLocation', this.hideStartLocations, this);
      this.searchBoxView.on('close:dialog', this.onApplyProperties, this);      

      var self = this;
      this.$el.find('*[data-cstabindex]').on('focus', function () {
        var target = $(this);
        self.focusedElement &&
        self.focusedElement.removeClass(TabableRegionBehavior.accessibilityActiveElementClass);
        target.addClass(TabableRegionBehavior.accessibilityActiveElementClass);
        self.focusedElement = target;
      });
    },

    currentlyFocusedElement: function (arg) {
      if (this.$el) {
        var focusables = this.$('*[tabindex]');
        if (focusables.length) {
          focusables.prop('tabindex', 0);
        }
        var shiftKey = !!arg && arg.shiftKey;
        if (!shiftKey && this.$el.find(".csui-filtername").length) {
          return this.$el.find('.csui-filtername');
        } else {
          return !!focusables[0] && $(focusables[0]).focus();
        }
      }
    },

    onLastTabElement: function (shiftTab, event) {
      return (shiftTab && event.target === this.$('*[tabindex]')[0]);
    },

    onStartLoaction: function (event) {
      if (event.keyCode === 27) {
        !!this.ui.startlocations.is(':focus') ? '' : event.stopImmediatePropagation();
      }
    },

    onApplyProperties: function () {
      this.trigger('parent:destroydialog');
    },

    showStartLocations: function () {
      this.startLocationView.$el.removeClass("binf-hidden");
    },

    hideStartLocations: function () {
      this.startLocationView.$el.addClass("binf-hidden");
    },

    onDomRefresh: function () {
      if (this.startLocationView) {
        this.startLocationView.trigger('dom:refresh');
      }
      if (this.propertiesView) {
        this.propertiesView.trigger('dom:refresh');
      }
      if (this.searchBoxView) {
        this.searchBoxView.trigger('dom:refresh');
      }
    },

    hideStartLocationLabel: function (node) {
      this.startLocationView.hideDropDownLabel(node);
    },

    reset: function () {
      this.startLocationView.reset();
    },

    onChangeFilterName: function () {
      this.trigger('change:filterName');
    },

    onFocusoutFilterName: function () {
      this.trigger('focusout:filterName');
    },

    showErrorMessage: function (errorMessage) {
      this.$(this.ui.saveFilterError).html(errorMessage);
      this.ui.saveFilterError.removeClass("binf-hidden");
    },

    removeErrorMessage: function () {
      this.$(this.ui.saveFilterError).html("");
      this.ui.saveFilterError.addClass("binf-hidden");
    }
  });

  return HeaderView;
});
