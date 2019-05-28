/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone', 'csui/lib/marionette',
  'csui/controls/mixins/layoutview.events.propagation/layoutview.events.propagation.mixin',
  'csui/behaviors/dropdown.menu/dropdown.menu.behavior',
  'csui/controls/tile/behaviors/perfect.scrolling.behavior', 'csui/utils/namedsessionstorage',
  'hbs!csui/widgets/favorites/impl/favorite.star/favorite.add.form',
  'hbs!csui/widgets/favorites/impl/favorite.star/favorite.add.form.group',
  'hbs!csui/widgets/favorites/impl/favorite.star/favorite.add.form.groups',
  'i18n!csui/widgets/favorites/impl/nls/lang'
], function (_, $, Backbone, Marionette, LayoutViewEventsPropagationMixin, DropdownMenuBehavior,
    PerfectScrollingBehavior, NamedSessionStorage, template, templateGroup, templateGroups, lang) {

  var csuiSessionStorage = new NamedSessionStorage();
  var constCSUIFavoriteTabID = 'csuiFavoriteTabID';

  var FavoriteGroupView = Marionette.ItemView.extend({

    tagName: 'li',

    attributes: function () {
      return {role: 'menuitem'};
    },

    template: templateGroup,

    triggers: {
      'click a': 'click:item'
    },

    constructor: function FavoriteGroupView(options) {
      Marionette.ItemView.prototype.constructor.apply(this, arguments);
    }

  });

  var FavoriteGroupsView = Marionette.CompositeView.extend({

    className: 'favorite-groups-dropdown-container binf-dropdown',

    template: templateGroups,

    behaviors: {
      PerfectScrolling: {
        behaviorClass: PerfectScrollingBehavior,
        contentParent: '.favorite-groups-dropdown',
        suppressScrollX: true
      },
      DropdownMenuBehavior: {
        behaviorClass: DropdownMenuBehavior
      }
    },

    ui: {
      toggle: '>.binf-dropdown-toggle',
      selectedLabel: '>.binf-btn >.selected-group-label',
      groupsScrollbarContainer: '.favorite-groups-dropdown'
    },

    events: {
      'shown.binf.dropdown': 'onShownDropdown'
    },

    childViewContainer: '.favorite-groups-dropdown',
    childView: FavoriteGroupView,
    childEvents: {
      'click:item': 'onClickItem',
      'render': '_onChildRender'
    },

    _onChildRender: function (childView) {
      var $item = childView.$el;
      if (childView.model.get('tab_id') === this.options.favModel.get('tab_id')) {
        $item.addClass('binf-active');
      }
    },

    constructor: function FavoriteGroupsView(options) {
      Marionette.CompositeView.call(this, options);
    },

    onRender: function () {
      var selectedModel = this.options.collection.findWhere({
        tab_id: this.options.favModel.get('tab_id')
      });
      var groupName = selectedModel.get('name');
      this.ui.selectedLabel.text(groupName);
      this.ui.selectedLabel.attr('title', groupName);
      this.ui.toggle.attr('aria-label', lang.addFavoriteGroupLabel + ' - ' + groupName);
      this.ui.toggle.binf_dropdown();
    },

    onClickItem: function (src) {
      this.$el.find('ul li').removeClass('binf-active');
      src.$el.addClass('binf-active');
      this.ui.toggle.binf_dropdown('toggle');
      this.ui.toggle.focus();
      var tabId = src.model.get('tab_id');
      this.options.favModel.set('tab_id', tabId);
      var groupName = src.model.get('name');
      this.ui.selectedLabel.text(groupName);
      this.ui.selectedLabel.attr('title', groupName);
      this.ui.toggle.attr('aria-label',  lang.addFavoriteGroupLabel + ' - ' + groupName);
      csuiSessionStorage.set(constCSUIFavoriteTabID, tabId);
    },

    _computeDropdownMenuMaxHeight: function () {
      var maxHeight = 170;  // default max-height to about 6 menu items
      var elem = this.ui.groupsScrollbarContainer[0];
      if (!elem.getBoundingClientRect) {
        return maxHeight;
      }
      var elRect = elem.getBoundingClientRect();
      maxHeight = $(window).height() - elRect.top - 16;
      return maxHeight;
    },

    onShownDropdown: function () {
      this.ui.groupsScrollbarContainer.css('max-height', this._computeDropdownMenuMaxHeight());
      this.ui.toggle.attr('aria-expanded', 'true');
      this.triggerMethod('dom:refresh');
    },

    closeDropdownMenu: function () {
      if (this.$el.hasClass('binf-open')) {
        this.ui.toggle.attr('aria-expanded', 'false');
        this.ui.toggle.binf_dropdown('toggle', false);
      }
    }

  });

  var FavoriteAddFormView = Marionette.LayoutView.extend({

    template: template,

    templateHelpers: function () {
      return {
        name_label: lang.addFavoriteNameLabel,
        name_place_holder: lang.addFavoriteNamePlaceHolder,
        name_input_id: _.uniqueId('nameInp'),
        favorite_name: this.options.favModel.get('name'),
        groups: this.showGroups,
        group_label: lang.addFavoriteGroupLabel,
        add_button_label: lang.addFavoriteAddButtonLabel,
        cancel_button_label: lang.addFavoriteCancelButtonLabel
      };
    },

    regions: {
      favGroupsRegion: '.favorite-groups-container'
    },

    triggers: {
      'click .add-btn': 'click:add:button',
      'click .cancel-btn': 'click:cancel:button'
    },

    ui: {
      nameInput: '.favorite-name-input',
      nameInputError: '.favorite-name-input-error',
      addButton: '.add-btn',
      cancelButton: '.cancel-btn'
    },

    events: {
      'click @ui.nameInput': 'onClickNameInput',
      'keyup': 'onKeyupEvent',
      'keyup @ui.nameInput': 'onNameInputEvent',  // validate Name field on key input
      'blur @ui.nameInput': 'onNameInputEvent',  // also validate Name field on leaving the field
      'keydown @ui.nameInput': 'controlsOnKeydownEvent',  // On Enter triggers save as UX asks
      'keydown @ui.addButton': 'controlsOnKeydownEvent',  // On Enter triggers save as UX asks
      'keydown @ui.cancelButton': 'cancelButtonOnKeydownEvent'
    },

    constructor: function FavoriteAddFormView(options) {
      Marionette.LayoutView.call(this, options);
      this.showGroups = true;
      if (this.options.collection.length === 1 &&
          this.options.collection.at(0).get('tab_id') === -1) {
        this.showGroups = false;
      }

      if (this.showGroups) {
        this.groupsView = new FavoriteGroupsView(options);
        var storedTabId = csuiSessionStorage.get(constCSUIFavoriteTabID);
        var storedGroup = this.options.collection.findWhere({tab_id: storedTabId});
        if (!storedGroup) {
          storedTabId = -1;
          csuiSessionStorage.set(constCSUIFavoriteTabID, storedTabId);
        }
        storedTabId && this.options.favModel && this.options.favModel.set('tab_id', storedTabId);
      }

      this.propagateEventsToRegions();
    },

    onRender: function () {
      if (this.showGroups) {
        this.groupsView.render();
        this.favGroupsRegion.show(this.groupsView);
      }
      this.validateNameInputAndSetAddButtonState(true);
    },

    currentlyFocusedElement: function (event) {
      return this.ui.nameInput;
    },

    showInlineError: function (error) {
      this.ui.nameInputError.attr('title', error);
      this.ui.nameInputError.text(error);
    },

    clearInlineError: function () {
      this.ui.nameInputError.attr('title', '');
      this.ui.nameInputError.text('');
    },

    validateNameInputAndSetAddButtonState: function (suppressError) {
      var valid = false;
      var name = this.ui.nameInput.val();
      name = name.trim();
      if (name.length < 1) {
        valid = false;  // this scope is needed to just disable the Add button
      } else if (name.length > 248) {
        suppressError !== true && this.showInlineError(lang.nameErrorMaxLengthExceed);
      } else if (name.indexOf(':') >= 0) {
        suppressError !== true && this.showInlineError(lang.nameErrorContainSemiColon);
      } else {
        this.clearInlineError();
        valid = true;
      }

      if (valid) {
        this.options.favModel.set('name', name);
        this.ui.addButton.prop('disabled', false);
      } else {
        this.ui.addButton.prop('disabled', true);
      }
      return valid;
    },

    cancelButtonOnKeydownEvent: function (event) {
      if (event && event.keyCode === 13) {  // Enter
        event.preventDefault();
        event.stopPropagation();
        this.trigger('click:cancel:button');
      }
    },

    controlsOnKeydownEvent: function (event) {
      if (event && event.keyCode === 13) {  // Enter
        event.preventDefault();
        event.stopPropagation();
        this.validateNameInputAndSetAddButtonState() && this.trigger('click:add:button');
      }
    },

    onKeyupEvent: function (event) {
      if (event && event.keyCode === 27) {  // Escape
        event.preventDefault();
        this.trigger('click:cancel:button');
      }
    },

    onNameInputEvent: function (event) {
      if (event && event.keyCode === 27) {  // Escape
        return;
      }
      var valid = this.validateNameInputAndSetAddButtonState();
    },

    onClickNameInput: function (event) {
      event && event.stopPropagation();
      this.groupsView && this.groupsView.closeDropdownMenu();
    }

  });

  _.extend(FavoriteAddFormView.prototype, LayoutViewEventsPropagationMixin);

  return FavoriteAddFormView;

});
