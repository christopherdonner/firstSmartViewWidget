/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/dialogs/node.picker/impl/header/start.location.selector/start.location.selector.view',
  'csui/dialogs/members.picker/impl/header/user.search/user.search.view',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'hbs!csui/dialogs/members.picker/impl/header/members.picker.header',
  'i18n!csui/dialogs/members.picker/impl/nls/lang',
  'css!csui/dialogs/members.picker/impl/header/members.picker.header'
], function (_, $, Marionette, StartLocationCollectionView, UserSearchView, TabableRegionBehavior,
    headerTemplate, lang) {

  var HeaderView = Marionette.LayoutView.extend({
    template: headerTemplate,
    className: 'cs-header-control',
    regions: {
      startLocations: '.csui-start-locations',
      userSearch: '.csui-member-picker'
    },

    templateHelpers: function () {
      return {
        adduserorgroup: this.options.adduserorgroup,
        locationSelector: this.options.locationSelector,
        displayStartLocation: this.options.displayStartLocation,
        isNotDeleted: !(this.options.headerViewoptions.selectedGroup && 
                        this.options.headerViewoptions.selectedGroup.get("right_id_expand").deleted),
        title: this.options.title ? this.options.title : lang.dialogTitle,
        addMemberTitle: lang.AddMember
      };
    },

    ui: {
      addIcon: '.csui-add-member.icon-toolbarAdd',
      memberPickerContainer: '.csui-member-picker-container',
      viewSeparator: '.csui-view-separator',
      headerTitle: '.member-picker-view-header'
    },

    events: {
      'click @ui.addIcon': 'onAddMemberClick',
      'keyup': 'onKeyInView'
    },

    onAddMemberClick: function (event) {
      event.stopPropagation();
      event.preventDefault();
      this.ui.addIcon.addClass("binf-hidden");
      this.ui.viewSeparator.removeClass("binf-hidden");
      this.ui.headerTitle.html(lang.AddUserOrGroup);
      if (this.editPermission) {
        this.showUserSearchView(event);
      }
      this.trigger("enable:add");
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegionBehavior
      }
    },

    currentlyFocusedElement: function (args) {
      if (this.$el) {
        var focusables = this.$('*[tabindex]:visible');
        if (focusables.length) {
          focusables.prop('tabindex', 0);
        }
        return !!focusables[0] && $(focusables[0]);
      }
    },

    onKeyInView: function (event) {
      if (event.keyCode === 13) {
        if ($(event.target).hasClass('csui-add-member')) {
          $(event.target).trigger('click');
        }
      }
    },

    initialize: function () {
      var options = this.options;

      if (options.locationSelector && options.adduserorgroup) {
        this.startLocationView = new StartLocationCollectionView({
          collection: this.options.locations,
          title: this.options.dialogTitle,
          selected: this.options.initialLocation
        });

        options.placeHolder = this.options.selectedMember !== undefined ?
                              lang.addAnotherNamePlaceHolder : lang.userSearchPlaceHolder;
        options.addAnotherNamePlaceHolder = lang.addAnotherNamePlaceHolder;
        this.options = options;
      }
    },

    onRender: function () {
      var options = this.options;
      var loginUserId    = this.options.authUser && this.options.authUser.get("id"),
          groupLeaderId  = this.options.headerViewoptions.selectedGroup &&
                           this.options.headerViewoptions.selectedGroup.get(
                               "right_id_expand").leader_id,
          editPermission = false;
      if (groupLeaderId && groupLeaderId === loginUserId) {
        editPermission = true;
      }
      this.editPermission = editPermission || this.options.authUser &&
                            this.options.authUser.get("privilege_user_admin_rights");
      if (this.editPermission) {
        this.ui.addIcon.removeClass('binf-hidden');
      } else {
        this.ui.addIcon.addClass('binf-hidden');
      }
      if (this.options.showUserPicker) {
        this.ui.addIcon.addClass('binf-hidden');
        this.showUserSearchView();
        this.trigger("enable:add");
      }
      if (this.startLocationView && options.adduserorgroup) {
        this.startLocations.show(this.startLocationView);
        if (this.options.showUserPicker) {
          this.showUserSearchView();
          this.userSearchView.on('show:startLocation', this.showStartLocations, this);
          this.userSearchView.on('hide:startLocation', this.hideStartLocations, this);
        }
      }
    },

    showUserSearchView: function (event) {
      this.userSearchView = new UserSearchView(this.options);
      this.userSearch.show(this.userSearchView);
      this.userSearchView.userPickerIconClicked(event);
      this.userSearchView.on('show:selectItem', this.selectUsers, this);
    },

    selectUsers: function (selectedMember) {
      if (selectedMember) {
        this.trigger("show:selectItem", selectedMember);
      }
    },

    showStartLocations: function () {
      this.startLocationView.$el.removeClass("binf-hidden");
    },

    hideStartLocations: function () {
      this.startLocationView.$el.addClass("binf-hidden");
    },

    onDestroy: function () {
      if (this.startLocationView) {
        this.startLocationView.destroy();
      }
    }
  });

  return HeaderView;
});

