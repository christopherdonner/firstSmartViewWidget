/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define(['csui/lib/underscore', 'csui/lib/jquery',
  'csui/controls/listitem/listitemstandard.view',
  'csui/utils/url',
  'csui/utils/user.avatar.color',
  'hbs!csui/dialogs/members.picker/impl/member.list/list.item',
  'hbs!csui/dialogs/node.picker/impl/search.list/search.location.item',
  'i18n!csui/dialogs/members.picker/impl/nls/lang',
  'css!csui/dialogs/members.picker/impl/members.picker'
], function (_, $, StandardListItem, Url, UserAvatarColor, itemTemplate, searchLocationTemplate,
    lang) {

  var ListItem = StandardListItem.extend({

    template: itemTemplate,
    searchLocationTemplate: searchLocationTemplate,

    templateHelpers: function () {
      return {
        defaultProfilePictureClass: this._isGroup() ? 'image_group_placeholder_permission' :
                                    'image_user_placeholder',
        imgAlt: this._isGroup() ? lang.groupSymbolAlt : lang.userSymbolAlt,
        totalcount: !this.options.model.collection.totalCount,
        isGroup: !!this._isGroup(),
        name: this.options.model.get("name_formatted"),
        selected: this.selected ? 'icon-listview-checkmark' : '',
        imgSrc: "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs="
      };
    },

    tagName: 'li',

    events: {
      'keydown': 'onKeyInView'
    },

    ui: {
      link: '.csui-list-group-item'
    },

    onKeyInView: function (event) {
      if (event.keyCode === 39 || event.keyCode === 32 || event.keyCode === 13) {
        this.$el.trigger('click');
        this.$el.focus();
        return false;
      }
      return true;
    },

    _isUser: function () {
      return (this.options.model.get("type") === 0);
    },

    _isGroup: function () {
      return (this.options.model.get("type") === 1);
    },

    _isInActiveUser: function () {
      return (this.options.model.get("type") < 0);
    },

    constructor: function ListItem(options) {
      StandardListItem.apply(this, arguments);
      this.browsed = false;
    },

    toggleSelect: function () {
      this.selected = !this.selected;
      this.render();
    },

    toggleBrowse: function () {
      this.browsed = !this.browsed;
      this.render();
    },

    assignedBrowseNSelect: function () {
      this.browsed = this.selected = true;
      this.render();
    },

    unassignBrowseNSelect: function () {
      if (!this.isDestroyed) {
        this.browsed = this.selected = false;
        this.render();
      }
    },

    isSelected: function () {
      return this.selected;
    },

    isBrowsed: function () {
      return this.browsed;
    },

    setValidity: function (valid) {
      this.valid = valid;
    },

    onRender: function () {
      this.$el.addClass('cs-left-item-' + this.model.get('id'));
      this.$el.removeClass('select');
      this.$el.removeClass('browse');
      this.ui.link.removeAttr('aria-selected');
      this.$el.attr('role', 'option');
      var elementNamePlus = _.str.sformat(lang.itemTypeNameAria, this.model.get('type_name'),
          this.model.get('name'));
      if (!this.valid) {
        elementNamePlus = _.str.sformat(lang.disabledItemTypeNameAria, this.model.get('type_name'),
            this.model.get('name'));
      }
      this.$el.attr('aria-label', elementNamePlus);

      if (this.selected) {
        if (this._isGroup()) {
          this.$el.find("span").removeClass('binf-hidden');
        }
        this.$el.addClass('select');
        this.$el.attr('aria-selected', 'true');
      } else if (this.browsed) {
        this.$el.addClass('browse');
        this.$el.find("span.csui-end-icon").removeClass('binf-hidden');
      }

      if (this._isBrowsable(this.model)) {
        this.ui.link.attr('aria-haspopup', 'true');
        this.ui.link.attr('aria-expanded', 'false');
      }
      this._renderPhoto();
    },

    _renderPhoto: function () {
      var photoUrl = this.model.get("photo_url");
      var userbackgroundcolor = UserAvatarColor.getUserAvatarColor(
          this.options.model.attributes.data.properties);
      this.$el.find('.csui-user-default-picture-dlg.image_user_placeholder').css("background-color",
          userbackgroundcolor);
      if (this._isGroup() || photoUrl === null) {

      } else {
        var that = this;
        this._resolvePhoto(photoUrl).done(
            _.bind(function (photo) {
              var profieEle = that.$el.find('.csui-user-profile-picture-dlg');
              that.$el.find('.csui-user-default-picture-dlg').addClass('binf-hidden');
              that.url = URL.createObjectURL(photo);
              profieEle
                  .removeClass('binf-hidden')
                  .attr("src", that.url);
            })
        ).fail(function () {
          var profieEle = that.$el.find('.csui-user-profile-picture-dlg');
          profieEle
              .attr("src",
                  "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=");
        });
      }
    },

    _resolvePhoto: function (photoUrl) {
      var connector  = this.options.model.connector,
          connection = connector.connection,
          cgiUrl     = new Url(connection.url).getCgiScript(),
          dPhoto     = $.Deferred(),
          imgUrl     = Url.combine(cgiUrl, photoUrl);

      var getPhotoConnector = connector.extendAjaxOptions({
        url: imgUrl,
        dataType: 'binary',
        connection: connection
      });

      $.ajax(getPhotoConnector).done(function (response) {
        dPhoto.resolve(response);
      }).fail(dPhoto.reject);

      return dPhoto.promise();
    },

    _isBrowsable: function (node) {
      return node.get('container') && node.get('perm_see_contents') !== false;
    }

  });

  return ListItem;
});