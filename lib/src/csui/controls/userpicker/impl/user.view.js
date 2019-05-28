/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore',
  'csui/lib/jquery',
  'csui/lib/marionette',
  'csui/utils/base',
  'csui/utils/url',
  'csui/utils/user.avatar.color',
  'i18n!csui/controls/userpicker/nls/userpicker.lang',
  'hbs!csui/controls/userpicker/impl/user',
  'css!csui/controls/userpicker/impl/userpicker'
], function (_, $, Marionette, base, Url, UserAvatarColor, lang, template) {

  var UserView = Marionette.ItemView.extend({

    template: template,

    tagName: 'div',

    className: 'csui-userpicker-item',

    ui: {
      personalizedImage: '.csui-icon-user',
      defaultImage: '.csui-icon-paceholder'
    },

    templateHelpers: function () {
      return {
        'name': base.formatMemberName(this.model),
        'email': this.model.get('business_email'),
        'title': this.model.get('title'),
        'department': this.model.get('group_id') && this.model.get('group_id').name,
        'office': this.model.get('office_location'),
        'disabled': this.model.get('disabled'),
        'disabled-message': this.options.disabledMessage,
        'lightWeight': !!this.options.lightWeight,
        'userImgSrc': "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs="
      };
    },

    constructor: function UserView(options) {
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

    _displayProfileImage: function () {
      var photoUrl = this._getUserPhotoUrl();
      this.ui.personalizedImage.addClass("esoc-userprofile-img-" + this.model.get('id'));
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

    _assignUserColor: function(){
      var userbackgroundcolor = UserAvatarColor.getUserAvatarColor(this.model.attributes);
      this.ui.defaultImage.css("background",userbackgroundcolor);
    }

  });

  return UserView;
});
