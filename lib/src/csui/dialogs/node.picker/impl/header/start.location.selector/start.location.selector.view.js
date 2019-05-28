/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['csui/lib/underscore', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'hbs!csui/dialogs/node.picker/impl/header/start.location.selector/start.location.selector.item',
  'hbs!csui/dialogs/node.picker/impl/header/start.location.selector/start.location.selector',
  'i18n!csui/dialogs/node.picker/start.locations/impl/nls/lang',
  'css!csui/dialogs/node.picker/impl/header/start.location.selector/start.location.selector',
  'csui/lib/binf/js/binf'
], function (_, Backbone, Marionette, TabableRegion, itemTemplate, collectionTemplate, lang) {
  "use strict";

  var StartLocationItemView = Marionette.ItemView.extend({

    tagName: 'li',
    attributes: {
      role: 'presentation'
    },

    template: itemTemplate,
    templateHelpers: function () {
      return {
        iconClass: getIconClass(this.model)
      };
    },

    triggers: {
      'click >a': 'click:link'
    },

    constructor: function StartLocationItemView() {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
      this.listenTo(this.model, 'change', this.render);
    }

  });

  var StartLocationCollectionView = Marionette.CompositeView.extend({

    className: 'dropdown-locations',

    template: collectionTemplate,

    childView: StartLocationItemView,
    childViewContainer: '> .binf-dropdown-menu',
    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegion
      }
    },

    ui: {
      toggle: '> .binf-dropdown-toggle',
      selectedLabel: '>.binf-dropdown-toggle >.cs-label',
      selectedIcon: '>.binf-dropdown-toggle >.cs-icon:not(.icon-caret-down)',
      selectedLocation: '>.binf-dropdown-toggle >span:not(.icon-caret-down)'
    },

    events: {
      'keyup': 'onKeyInView'
    },
    constructor: function StartLocationCollectionView(options) {
      Marionette.CompositeView.prototype.constructor.apply(this, arguments);
      this.selected = new Backbone.Model();
      if (this.options.selected) {
        this._setSelection(this.options.selected.attributes);
      } else {
        this.resetSelection();
      }
      this.listenTo(this.collection, 'change', this._refreshSelection);
      this.listenTo(this.selected, 'change', this._updateSelection);
      this.listenTo(Backbone, 'closeToggleAction', this._closeToggle);
    },
    filter: function (child, index, collection) {
      return !child.get('hide');
    },

    currentlyFocusedElement: function () {
      return this.$el.find('button');
    },

    accDeactivateTabableRegion: function () {
      this._closeToggle();
    },

    reset: function () {
      this.resetSelection();
    },

    resetSelection: function () {
      this.selected.set({
        id: _.uniqueId(),
        name: lang.labelNoSelection,
        icon: ''
      });
    },

    serializeData: function () {
      var selectedData = _.pick(this.selected.toJSON(), ['id', 'name', 'icon']);
      return _.defaults({
        id: _.uniqueId()
      }, selectedData);
    },

    templateHelpers: function () {
      return {
        search: lang.labelSearch,
        iconClass: getIconClass(this.selected),
        labelSelectLocation: lang.labelSelectLocation
      };
    },

    onKeyInView: function (event) {
      var open = this.$el.hasClass('binf-open');
      if (event.keyCode === 27 && open) {
        this.$el.removeClass('binf-open');
        this.$('*[tabindex = "0"]').focus();
        return false;
      }
    },

    onRender: function () {
      this.ui.toggle.binf_dropdown();
    },

    onChildviewClickLink: function (childView) {
      this.ui.selectedLabel.removeClass('select-prompt');
      this._setSelection(childView.model.attributes);
      this.ui.toggle.binf_dropdown('toggle');
      this.ui.selectedLocation.removeClass('binf-hide');
      this.triggerMethod('change:location', childView.model);
      this.$el.trigger('setCurrentTabFocus');
    },

    hideDropDownLabel: function (node) {
      var locationFactory   = this.selected.get('factory'),
          locationContainer = locationFactory.getLocationParameters().container,
          locationId        = locationContainer && locationContainer.get('id'),
          nodeId            = node && node.get('id');
      if (nodeId !== locationId) {
        this._setSelection({name: lang.labelSelectLocation, id: ''});
        this.ui.selectedLabel.addClass('select-prompt');
        this.ui.selectedIcon.addClass('binf-hide');
      }
    },
    _setSelection: function (attributes) {
      this.selected.set(attributes);
    },

    _updateSelection: function () {
      this.ui.selectedLabel.text(this.selected.get('name'));
      this.ui.selectedIcon.attr('class', getIconClass(this.selected));
    },

    _refreshSelection: function (model) {
      if (model.get('id') === this.selected.get('id')) {
        this._setSelection(model.attributes);
      }
    },

    _closeToggle: function () {
      var locationSelector = this.$el;
      if (locationSelector.hasClass && locationSelector.hasClass('binf-open')) {
        this.ui.toggle.binf_dropdown('toggle');
      }
      this.ui.toggle && this.ui.toggle.attr && this.ui.toggle.attr('aria-expanded', 'false');
    }

  });

  function getIconClass(model) {
    var icon = model.get('icon') || '';
    if (icon && icon.indexOf('-') < 0) {
      icon = 'icon-menu-' + icon;
    }
    return 'cs-icon ' + icon;
  }

  return StartLocationCollectionView;

});
