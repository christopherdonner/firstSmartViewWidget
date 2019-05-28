/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/utils/base',
  'csui/utils/url',
  'csui/utils/user.avatar.color',
  'csui/behaviors/keyboard.navigation/tabable.region.behavior',
  'hbs!csui/dialogs/members.picker/impl/selectedMembers/impl/selectedMember',
  'i18n!csui/dialogs/members.picker/impl/nls/lang'
], function (_, $, Marionette, base, Url, UserAvatarColor, TabableRegion, template, lang) {

  var SelectedMemberView = Marionette.ItemView.extend({
    template: template,
    tagName: 'div',
    className: 'csui-userpicker-item',
    ui: {
      closeButton: '.close',
      personalizedImage: '.csui-icon-user',
      defaultImage: '.csui-icon-paceholder'
    },

    behaviors: {
      TabableRegion: {
        behaviorClass: TabableRegion
      }
    },

    events: {
      'click @ui.closeButton': 'onRemoveButtonClicked'
    },

    currentlyFocusedElement: function () {
      return this.ui.closeButton;
    },

    templateHelpers: function () {
      return {
        'name': base.formatMemberName(this.model),
        'department': this.model.get('group_id') && this.model.get('group_id').name,
        'id': this.model.get('id'),
        'initials': this.model.get('initials'),
        'userImgSrc': "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=",
        'removeSelectedUser': lang.removeSelectedUser,
        'removeSelectedUserAria': _.str.sformat(lang.removeSelectedUserAria,
            this.model.get('name_formatted'))
      };
    },

    constructor: function SelectedMemberView(options) {
      options || (options = {});
      options.disabledMessage || (options.disabledMessage = '');
      Marionette.ItemView.prototype.constructor.call(this, options);
      this.listenTo(this, 'render', this._assignUserColor);
    },

    onRender: function () {
      if (!this.options.lightWeight) {
        this._displayProfileImage();
      }
    },

    onDestroy: function () {
      this._releasePhotoUrl();
    },

    onRemoveButtonClicked: function (event) {
      event.stopPropagation();
      event.preventDefault();
      this._parent.trigger('remove:selectItem', this.model);
    },

    _displayProfileImage: function () {
      var photoUrl = this._getUserPhotoUrl();
      this.ui.personalizedImage.addClass("esoc-userprofile-img-" + this.model.get('id'));
      if (photoUrl) {
        var getPhotoOptions = this.options.model.connector.extendAjaxOptions({
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
      var connection = (this.options.model && this.options.model.connector.connection) ||
                       (this.options.connector && this.options.connector.connection),
          cgiUrl     = new Url(connection.url).getCgiScript(),
          photoPath  = this.model.get('photo_url');
      if (photoPath && photoPath.indexOf('?') > 0) {
        return Url.combine(cgiUrl, photoPath);
      }
    },

    _showPersonalizedImage: function (imageContent) {
      this._releasePhotoUrl();
      this._photoUrl = URL.createObjectURL(imageContent);
      this.ui.personalizedImage.attr("src", this._photoUrl);
      this.ui.defaultImage.addClass('binf-hidden');
      this.ui.personalizedImage.removeClass('binf-hidden');
    },

    _showDefaultImage: function (imageContent) {
      this._releasePhotoUrl();
      this.ui.personalizedImage.addClass('binf-hidden');
      this.ui.defaultImage.removeClass('binf-hidden');
    },

    _releasePhotoUrl: function () {
      if (this._photoUrl) {
        URL.revokeObjectURL(this._photoUrl);
        this._photoUrl = undefined;
      }
    },

    _assignUserColor: function () {
      var userbackgroundcolor = UserAvatarColor.getUserAvatarColor(this.model.attributes);
      this.ui.defaultImage.css("background", userbackgroundcolor);
    }

  });

  return SelectedMemberView;
});
