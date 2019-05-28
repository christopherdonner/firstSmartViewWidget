/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['require',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/controls/table/cells/templated/templated.view',
  'csui/controls/table/cells/cell.registry',
  'csui/utils/base',
  'csui/utils/commands',
  'csui/utils/url',
  'csui/dialogs/members.picker/members.picker.wizard',
  'csui/utils/contexts/factories/connector',
  'csui/utils/user.avatar.color',
  'i18n!csui/controls/table/cells/user/impl/nls/localized.strings',
  'hbs!csui/controls/table/cells/user/impl/user'
], function (require, $, _, Backbone, Marionette, TemplatedCellView, cellViewRegistry, base,
    commands, Url, MembersPickerDialog, ConnectorFactory, UserAvatarColor, lang, template) {
  var UserCellView = TemplatedCellView.extend({

    template: template,
    ui: {
      personalizedImage: '.csui-icon-user',
      defaultImage: '.csui-icon-paceholder',
      userDisplayName: '.csui-user-display-name',
      addOwnerOrGroup: '.csui-add-owner-or-group',
      addOwnerOrGroupIcon: '.csui-add-owner-or-group .icon-edit',
      userPlaceHolder: '.image_user_placeholder_permission'
    },

    events: function () {
      var ret = base.isTouchBrowser() ? {
        'click @ui.addOwnerOrGroup': 'addOwnerOrGroupIconClicked'
      } : {
        'mouseover @ui.personalizedImage': 'showMiniProfilePopup',
        'mouseover @ui.defaultImage': 'showMiniProfilePopup',
        'mouseover @ui.userDisplayName': 'showMiniProfilePopup',
        'mouseover @ui.addOwnerOrGroup': 'showAddOwnerOrGroupIcon',
        'mouseleave @ui.personalizedImage': 'removeUnderline',
        'mouseleave @ui.defaultImage': 'removeUnderline',
        'mouseleave @ui.userDisplayName': 'removeUnderline',
        'mouseleave @ui.addOwnerOrGroup': 'removeAddOwnerOrGroupIcon',
        'click @ui.addOwnerOrGroupIcon': 'addOwnerOrGroupIconClicked',
        'keydown': 'onKeyInView'
      };

      _.extend(ret, {
        'click @ui.userDisplayName': 'showUserProfileDialog',
        'click @ui.personalizedImage': 'showUserProfileDialog',
        'click @ui.defaultImage': 'showUserProfileDialog'
      });

      return ret;
    },
    getValueData: function () {
      var userType        = this.model.get("type"),
          right_id_expand = this.model.get("right_id_expand");
      return {
        includeInlineToolBarPlaceholder: this.options.includeInlineToolBarPlaceholder,
        inlineToolBarPlaceholderClass: this.options.inlineToolBarPlaceholderClass,
        name: this.getDispalyName(),
        disabled: this.hasPermissions(),
        showProfileImg: !this.options.showOnlyUserName,
        isPublicPermission: userType === "public",
        publicAccesslabel: lang.publicAccess,
        isOwner: userType === "owner",
        ariaUserLabel: this.prepareUserName(),
        ariaUserType: this.prepareUserType(),
        isOwnerGroup: userType === "group",
        isOwnerOrOwnerGroup: userType === "owner" || userType === "group",
        initials: !!right_id_expand ? right_id_expand.initials : '',
        isUser: userType !== "owner" && userType !== "group" &&
                right_id_expand && right_id_expand.type === 0,
        title: userType === "owner" ? lang.ownerAccessTitle :
               userType === "group" ? lang.groupOwnerAccessTitle : "",
        isGroup: this.model.get("right_id_expand") && this.model.get("right_id_expand").type === 1,
        addOwnerOrGroup: this.addOwnerOrGroup,
        usrImgSrc: "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=",
        selectedUsername: this.model.selectedUser && this.model.selectedUser.get("name")
      };
    },

    constructor: function UserCellView(options) {
      UserCellView.__super__.constructor.apply(this, arguments);
      var columnAttributes = this.options.column.attributes;
      this.options.connector = this.options.context.getModel(ConnectorFactory);
      if (this.options.includeInlineToolBarPlaceholder === undefined) {
        this.options.includeInlineToolBarPlaceholder = (columnAttributes &&
                                                        columnAttributes.containsInlineActions);
      }
      this.options.inlineToolBarPlaceholderClass ||
      (this.options.inlineToolBarPlaceholderClass = 'csui-inlinetoolbar');
      this.noOwnerOrGroup = this.model.get("type") === "owner" && this.hasPermissions();
      if (this.noOwnerOrGroup) {
        this.commands = commands;
        this.addOwnerOrGroupCommand = this.commands.findWhere({signature: 'addownerorgroup'});
        this.status = {
          context: this.options.context,
          permissionCollection: this.model.collection,
          connector: this.options.connector,
          applyTo: this.options.applyTo,
          nodeId: this.model.collection.options.nodeId,
          nodeModel: this.model.collection.options.node
        };
        this.addOwnerOrGroup = this.noOwnerOrGroup && this.addOwnerOrGroupCommand &&
                               this.addOwnerOrGroupCommand.enabled(this.status);
      }
      this.listenTo(this, 'render', this._assignUserColor);
    },

    onRender: function () {
      var userData = this.model.get("right_id_expand");
      if (!!userData) {
        this.isGroup = (userData.type === 1);
        this.userId = userData.id;
      } else {
        this.isGroup = true;
        this.userId = -1; //Public group
      }
      var renderOnlyName    = this.options.showOnlyUserName,
          isOwnerOfDocument = this.model.get("type") === "owner" ||
                              this.model.get("type") === "group";
      if (!renderOnlyName && !isOwnerOfDocument) {
        this._displayProfileImage();
      }
    },

    onDestroy: function () {
      this._releasePhotoUrl();
    },

    prepareUserName: function () {
      var text         = !!this.model.attributes && !!this.model.attributes.right_id_expand &&
                         this.model.attributes.right_id_expand.name,
          preparedText = !!text && text;
      return preparedText;
    },

    prepareUserType: function () {
      return !!this.model && this.model.get('type');
    },

    hasPermissions: function () {
      var hasPermission = false;
      if (!this.model.get("permissions")) {
        hasPermission = true;
      }
      return hasPermission;
    },
    getDispalyName: function () {
      var displayName;
      if (this.model.get("right_id_expand")) {
        displayName = base.formatMemberName(this.model.get("right_id_expand"));
      } else if (this.model.get("type") === "owner" && this.hasPermissions()) {
        displayName = this.addOwnerOrGroup ? lang.addOwnerOrGroup :
                      lang.noOwnerAssigned;
      } else if (this.model.get("type") === "group" && this.hasPermissions()) {
        displayName = lang.noGroupAssigned;
      }
      return displayName;
    },

    _displayProfileImage: function () {
      var photoUrl = this._getUserPhotoUrl();
      this.ui.personalizedImage.addClass("esoc-userprofile-img-" + this.userId);
      this.ui.defaultImage.addClass("esoc-user-default-avatar-" + this.userId);
      if (photoUrl) {
        var getPhotoOptions = this.options.connector.extendAjaxOptions({
          url: photoUrl,
          dataType: 'binary'
        });
        this._releasePhotoUrl();
        $.ajax(getPhotoOptions)
            .always(_.bind(function (response, statusText, jqxhr) {
              if (jqxhr.status === 200) {
                this._showPersonalizedImage(response);
              } else {
                this._showDefaultImage();
              }
            }, this));
      } else {
        this._showDefaultImage();
      }
    },

    _getUserPhotoUrl: function () {
      var connection = this.options.connector.connection,
          cgiUrl     = new Url(connection.url).getCgiScript(),
          photoPath  = this.model.get("right_id_expand") ?
                       this.model.get("right_id_expand").photo_url : null;
      if (photoPath && photoPath.indexOf('?') > 0) {
        return Url.combine(cgiUrl, photoPath);
      }
    },

    _showPersonalizedImage: function (imageContent) {
      this._releasePhotoUrl();
      this._photoUrl = URL.createObjectURL(imageContent);
      if (typeof this.ui.personalizedImage === "object") {
        this.ui.personalizedImage.attr("src", this._photoUrl);
        this.ui.personalizedImage.removeClass('binf-hidden');
      }
      if (typeof this.ui.defaultImage === "object") {
        this.ui.defaultImage.addClass('binf-hidden');
      }

    },

    _showDefaultImage: function (imageContent) {
      this._releasePhotoUrl();
      if (typeof this.ui.personalizedImage === "object") {
        this.ui.personalizedImage.addClass('binf-hidden');
      }
      if (typeof this.ui.defaultImage === "object") {
        this.ui.defaultImage.removeClass('binf-hidden');
      }
    },

    showAddOwnerOrGroupIcon: function () {
      if (this.addOwnerOrGroupCommand && this.addOwnerOrGroupCommand.enabled(this.status)) {
        this.ui.addOwnerOrGroup.find('.csui-icon').addClass("icon-edit");
      }
    },

    removeAddOwnerOrGroupIcon: function () {
      this.ui.addOwnerOrGroup.find('.csui-icon').removeClass("icon-edit");
    },

    addOwnerOrGroupIconClicked: function () {
      var self = this;
      if (this.addOwnerOrGroupCommand && this.addOwnerOrGroupCommand.enabled(this.status)) {
        this.addOwnerOrGroupCommand.execute(this.status).done(_.bind(function (resp) {
          if (resp.get("addOwnerGroup")) {
            self.model && self.model.collection && self.model.collection.addOwnerOrGroup(resp);
          }
        }));
      }
    },

    _releasePhotoUrl: function () {
      if (this._photoUrl) {
        URL.revokeObjectURL(this._photoUrl);
        this._photoUrl = undefined;
      }
    },

    removeUnderline: function (e) {
      if (!!this.isGroup || this.userId === -3) {
        return;
      }
      this.ui.personalizedImage.removeClass("cs-user-photo-hover");
      this.ui.defaultImage.removeClass("cs-user-photo-hover");
      this.ui.userDisplayName.removeClass("cs-user-container-hover").addClass(
          "cs-user-container-no-hover");
    },

    onKeyInView: function (e) {
      if (e.keyCode === 32 || e.keyCode === 13) {
        this.showUserProfileDialog(e);
      }
    },

    showUserProfileDialog: function (e) {
      if (this.userId < 0) {
      } else if (!!this.isGroup) {
        var self = this;
        var membersPickerDialog = new MembersPickerDialog({
          context: self.options.context,
          connector: self.options.connector,
          groupId: self.model.attributes.right_id,
          edit_permission: self.options.column.attributes.containsInlineActions,
          dialogClass: 'cs-permission-group-picker',
          startLocations: ['current.group'],
          authUser: self.options.originatingView.user,
          selectedGroup: self.model,
          displayName: base.formatMemberName(this.model.get("right_id_expand")),
          unselectableTypes: [0, 1],
          add: true,
          buttons: [
            {
              id: 'Add',
              label: lang.addButtonLabel,
              default: true,
              hidden: true,
              disabled: true,
              toolTip: lang.addButtonTooltip
            },
            {
              id: 'Cancel',
              label: lang.cancelButtonLabel,
              disabled: false,
              close: true,
              toolTip: lang.cancelButtonTooltip
            }
          ]
        });
        var that = this;
        membersPickerDialog
            .show()
            .always(function () {
              that.$el.focus();
            }).done();

        return;
      } else {
        e.preventDefault();
        e.stopPropagation();
        if (this.userWidgetView) {
          this.dialogOpen = true;
          this.ui.personalizedImage.addClass("cs-user-photo-hover");
          this.ui.defaultImage.addClass("cs-user-photo-hover");
          this.ui.userDisplayName.removeClass("cs-user-container-no-hover").addClass(
              "cs-user-container-hover");
          $('.popover.esoc-mini-profile-popover').hide();
          this.userWidgetView.showUserProfileDialog(e);
        } else {
          this.setUserWidget('showUserProfileDialog', e);
        }
      }

    },

    showMiniProfilePopup: function (e) {
      if (!!this.isGroup || this.userId === -3) {
        return;
      } else {
        if (this.userWidgetView) {

          this.ui.personalizedImage.addClass("cs-user-photo-hover");
          this.ui.defaultImage.addClass("cs-user-photo-hover");
          this.ui.userDisplayName.removeClass("cs-user-container-no-hover").addClass(
              "cs-user-container-hover");
          this.userWidgetView.showMiniProfilePopup(e);

        } else {
          this.setUserWidget('showMiniProfilePopup', e);
        }
      }
    },

    setUserWidget: function (methodName, e) {
      var that = this;
      require(['esoc/controls/userwidget/userwidget.view'], function (UserWidgetView) {
        that.userWidgetView = new UserWidgetView({
          userid: that.userId,
          context: that.options.context,
          baseElement: that.ui.userDisplayName,
          showUserProfileLink: true,
          showMiniProfile: true,
          loggedUserId: that.userId,
          connector: that.options.connector
        });
        that[methodName](e);
      });
    },

    _assignUserColor: function () {
      var user                = this.model.get("right_id_expand"),
          userbackgroundcolor = UserAvatarColor.getUserAvatarColor(user);
      this.ui.userPlaceHolder.css("background", userbackgroundcolor);
    }
  }, {
    hasFixedWidth: false,
    widthFactor: 2
  });
  cellViewRegistry.registerByColumnKey('right_id', UserCellView);
  return UserCellView;
});
