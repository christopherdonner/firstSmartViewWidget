/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */


define([
  'require', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/backbone',
  'csui/lib/marionette',
  'csui/utils/contexts/factories/connector',
  'csui/utils/base',
  'csui/utils/url',
  'csui/lib/numeral',
  'csui/lib/handlebars',
  'csui/controls/form/impl/fields/csformfield.view',
  'csui/controls/userpicker/userpicker.view',
  'csui/utils/user.avatar.color',
  'hbs!csui/controls/form/impl/fields/userfield/userfield',
  'i18n!csui/controls/form/impl/nls/lang',
  'css!csui/controls/form/impl/fields/userfield/userfield',
  'csui/lib/jquery.binary.ajax'
], function (require, _, $, Backbone, Marionette, ConnectorFactory, base, Url, numeral,
    Handlebars, FormFieldView, UserPickerView, UserAvatarColor, itemTemplate, lang) {

  var UserFieldView = FormFieldView.extend({

    constructor: function UserFieldView(options) {
      FormFieldView.apply(this, arguments);

      this.connector = this.options.context.getObject(ConnectorFactory);
      this.dropdownMenuVisible = false;
    },

    ui: {
      readField: '.cs-field-read-content', // There is no button input class in hbs
      readFieldInner: '.cs-field-read-inner',
      pickerContainer: '.picker-container',
      writeField: '.picker-container input',
      readArea: '.cs-field-read',
      personalizedImage: '.user-photo',
      personalizedDefaultImage: '.user-default-image',
      defaultUserImage: '.image_user_placeholder',
      defaultGroupImage: '.image_group_placeholder',
      membername: '.esoc-user-container',
      cancelIcon: '.edit-cancel',
      readContentArea: '.cs-field-read-content',
      userDisplayName: '.cs-name .esoc-user-container'
    },

    events: function () {
      var ret = base.isTouchBrowser() ? {} : {
        'mouseover @ui.personalizedImage': 'showMiniProfilePopup',
        'mouseover @ui.personalizedDefaultImage': 'showMiniProfilePopup',
        'mouseover @ui.userDisplayName': 'showMiniProfilePopup',
        'mouseleave @ui.personalizedImage': 'removeUnderline',
        'mouseleave @ui.personalizedDefaultImage': 'removeUnderline',
        'mouseleave @ui.userDisplayName': 'removeUnderline',
        'focusout @ui.userDisplayName': 'removeUnderline',
        'click @ui.userDisplayName': 'showUserProfileDialog'
      };

      if (base.isTouchBrowser() && !!this.model.get("schema").readonly) {
        _.extend(ret, {
          'click @ui.userDisplayName': 'showUserProfileDialog'
        });
      }

      _.extend(ret, {
        'click @ui.personalizedImage': 'showUserProfileDialog',
        'click @ui.personalizedDefaultImage': 'showUserProfileDialog',
        'keyup': 'onKeyUp',
        'keydown': 'onKeyDown',
        'click @ui.cancelIcon': 'onCancelClicked',
        'focusout @ui.writeField': 'onFocusOutWrite',
        'mousedown': 'onMouseDown'
      });

      return ret;
    },

    onRender: function () {

      this.data = this.model.get('data');
      this.editValue = this.data;
      this.curVal = this.editValue;
      this.onlyUsers = this.model.get("schema").type === "otcs_user_picker";
      this.placeHolderText = (this.onlyUsers ? lang.alpacaPlaceholderOTUserPicker :
                              lang.alpacaPlaceholderOTUserGroupPicker) || '';

      var memberFilter = this.onlyUsers ? [0] : [0, 1];
      if (this.options.alpaca) {
        var typeControl = this.options.alpaca.options.type_control;
        if (_.has(typeControl, this.data.id)) {
          typeControl = this.options.alpaca.options.type_control[this.data.id];
        } else if (_.has(typeControl, '?')) {
          typeControl = this.options.alpaca.options.type_control['?'];
        }

        if (typeControl) {
          if (_.has(typeControl, 'parameters')) {
            memberFilter = typeControl.parameters.select_types;
          }
        }
      }

      var ariaLabel = "";
      if (this.alpacaField && this.alpacaField.options &&
          this.alpacaField.options.isMultiFieldItem) {
        ariaLabel = (this.alpacaField.parent && this.alpacaField.parent.options) ?
                    this.alpacaField.parent.options.label : "";
      } else if (this.alpacaField && this.alpacaField.options) {
        ariaLabel = this.alpacaField.options.label ? this.alpacaField.options.label : "";
      }

      this.pickerView = new UserPickerView({
        context: this.options.context,
        memberFilter: {
          type: memberFilter
        },
        placeholder: this.placeHolderText,
        prettyScrolling: true,
        limit: 20,
        id: _.uniqueId(this.model.get('id')),
        id_input: this.model.get('id'),
        ariaLabel: ariaLabel,
        isRequired: this.options.alpacaField && this.options.alpacaField.isRequired(),
      });
      this.listenTo(this.pickerView, 'item:change', this.onItemChange);
      this.listenTo(this.pickerView, 'userpicker:open', this.onUserPickerOpen);
      this.listenTo(this.pickerView, 'userpicker:close', this.onUserPickerClose);
      this.listenTo(this.pickerView, 'render', this.disableField);
      this._isUserWidgetEnabled = false;

      this.isGroup = (this.data.type === 1);
      this.userPicked = true;
      this.dialogOpen = false;

      this.ui.pickerContainer.append(this.pickerView.$el);
      this.ui.writeField = this.$el.find('.picker-container input');
      this.getEditableBehavior().ui.writeField = this.ui.writeField;

      if (this.data.id && this.data.id !== -3) {
        this.pickerView.model.set(this.data);  // write field

        this._keyboardNavigationNotification();
        this._setDefaultProfilePicture();
        if (!this.isGroup && this.data.photo_url !== null) {
          var photoUrl = this.data.photo_url,
              that     = this;
          this._resolvePhoto(photoUrl).done(
              _.bind(function (photo) {
                that.url = URL.createObjectURL(photo);
                that.ui.personalizedImage.attr("src", that.url);
                that.ui.personalizedImage.addClass("esoc-userprofile-img-" + that.data.id);
                that.ui.defaultUserImage.addClass('binf-hidden');
                that.ui.defaultGroupImage.addClass('binf-hidden');
                that.ui.personalizedImage.removeClass('binf-hidden');
              })
          );
        }

      }
      this.pickerView.render();
    },

    disableField: function (e) {
      this.ui.pickerContainer.append(this.pickerView.$el);
      this.ui.writeField = this.$el.find('.picker-container input');
      this.getEditableBehavior().ui.writeField = this.ui.writeField;
      this.trigger("disable:field");
    },

    onUserPickerOpen: function (e) {
      this.options.isDropDownOpen = true;
      var scrollableCols = this.$el.closest('.csui-scrollable-writemode');
      if (!!scrollableCols && !scrollableCols.hasClass('csui-dropdown-open')) {
        scrollableCols.addClass('csui-dropdown-open');
      }
      if (!!this.getEditableBehavior().hideActions) {
        this.getEditableBehavior().hideActions(e);
      }
    },

    onUserPickerClose: function (e) {
      this.options.isDropDownOpen = false;
      var scrollableCols = this.$el.closest('.csui-scrollable-writemode');
      if (!!scrollableCols && scrollableCols.hasClass('csui-dropdown-open')) {
        scrollableCols.removeClass('csui-dropdown-open');
      }
      if (!!this.getEditableBehavior().showActions) {
        this.getEditableBehavior().showActions(e);
      }
    },

    removeUnderline: function (e) {
      if (!!this.isGroup || this.data.id === -3) {
        return;
      }
      this.ui.personalizedImage.removeClass("cs-user-photo-hover");
      this.ui.personalizedDefaultImage.removeClass("cs-user-photo-hover");
      this.ui.membername.removeClass("cs-user-container-hover").addClass(
          "cs-user-container-no-hover");
    },

    showUserProfileDialog: function (e) {
      if (!!this.isGroup || this.data.id === -3 || this.options.isInPopover) {
        return;
      } else {
        e.preventDefault();
        e.stopPropagation();
        if (this.userWidgetView) {
          this.dialogOpen = true;
          this.ui.personalizedImage.addClass("cs-user-photo-hover");
          this.ui.personalizedDefaultImage.addClass("cs-user-photo-hover");
          this.ui.membername.removeClass("cs-user-container-no-hover").addClass(
              "cs-user-container-hover");
          $('.esoc-mini-profile-popover').binf_popover('hide');

          this.userWidgetView.showUserProfileDialog(e);
        } else {
          this.setUserWidget('showUserProfileDialog', e);
        }
      }

    },

    showMiniProfilePopup: function (e) {
      this.options.isInPopover = this.$el.closest('.csui-colout-formitems').length > 0;
      if (!!this.isGroup || this.data.id === -3 || this.options.isInPopover) {
        return;
      } else {
        if (this.userWidgetView) {
          this.ui.personalizedImage.addClass("cs-user-photo-hover");
          this.ui.personalizedDefaultImage.addClass("cs-user-photo-hover");
          this.ui.membername.removeClass("cs-user-container-no-hover").addClass(
              "cs-user-container-hover");
          this.userWidgetView.showMiniProfilePopup(e);
        } else {
          this.setUserWidget('showMiniProfilePopup', e);
        }
      }
    },

    setUserWidget: function (methodName, e) {
      var esocUserMiniProfileEle = this.$el.find('.esoc-user-mini-profile');
      require(['esoc/controls/userwidget/userwidget.view'], _.bind(function (e, UserWidgetView) {
        this.userWidgetView = new UserWidgetView({
          userid: this.data.id,
          context: this.options.context,
          baseElement: this.ui.membername,
          showUserProfileLink: true,
          showMiniProfile: true,
          loggedUserId: this.data.id,
          connector: this.connector
        });
        clearTimeout(this.userWidgetView.profileTimer);
        var profileTimer = setTimeout(_.bind(function () {
          esocUserMiniProfileEle.binf_popover('show');
          this[methodName](e);
        }, this, e), 500);
        this.userWidgetView.profileTimer = profileTimer;
        this[methodName](e);
      }, this, e));
    },
    onCancelClicked: function (e) {
      this.userPicked = true;
    },

    allowEditOnClickReadArea: function (e) {
      var canChangeToEditMode = !(this.mode !== 'readonly' && !!this.dialogOpen);
      this.dialogOpen = false;
      return canChangeToEditMode || (!this._isUserWidgetEnabled || !this.model.get('data').id);
    },

    className: 'cs-formfield cs-userfield',
    template: itemTemplate,

    templateHelpers: function () {
      var multiFieldLabel = "",
          isRequired      = this.options.alpacaField && this.options.alpacaField.isRequired(),
          requiredTxt     = "",
          labelName       = "",
          isReadOnly      = false,
          noName          = "";

      requiredTxt = isRequired ? lang.requiredField : "";
      isReadOnly = this.model && this.model.attributes && this.model.attributes.schema &&
                   this.model.attributes.schema.readonly;
      if (this.alpacaField && this.alpacaField.options &&
          this.alpacaField.options.isMultiFieldItem) {
        multiFieldLabel = (this.alpacaField.parent && this.alpacaField.parent.options) ?
                          this.alpacaField.parent.options.label : "";
        isReadOnly = this.alpacaField.parent.options.readonly;
      }
      labelName = multiFieldLabel ? multiFieldLabel :
                  this.model.get('options') && this.model.get('options').label;
      var currentModelData = this.model.get('data'),
          displayName      = currentModelData.id === -3 ? lang.noOwner :
                             (currentModelData.display_name || currentModelData.name_formatted),
          displayName2Use  = displayName ? displayName : lang.noValue,
          userEditAria     = _.str.sformat(lang.fieldEditAria, labelName, displayName2Use) +
                             requiredTxt,
          readModeAria     = displayName ?
                             _.str.sformat(lang.userFieldReadOnlyAria, labelName, displayName2Use) +
                             requiredTxt : _.str.sformat(lang.emptyUserFieldReadOnlyAria, labelName,
              displayName2Use) +
                                           requiredTxt,
          data             = {
            name: displayName,
            isGroup: (currentModelData.type === 1),
            isTouch: base.isTouchBrowser(),
            idBtnLabel: this.options.labelId,
            applyFlag: this.options.applyFlag,
            multiFieldLabel: multiFieldLabel,
            readModeAria: readModeAria,
            userEditAria: isReadOnly ? readModeAria : userEditAria,
            noName: isReadOnly ? readModeAria : userEditAria,
            ariaRequired: isRequired
          };

      var ret = _.extend(FormFieldView.prototype.templateHelpers.apply(this), data);
      return ret;
    },

    setStateWrite: function (validate, focus) {
      var that = this;
      var data = (this.mode === 'writeonly') ? this.getEditValue() : this.model.get('data');
      this.pickerView.model.set(_.extend(data, {
        display_name: base.formatMemberName(data)
      }));
      this.pickerView.render();
      this.getStatesBehavior()._setStateWrite(validate, focus);
      focus && that.$('.picker-container input').focus().select();
      this.editValue = data;
      return true; // we did all
    },

    isReadyToSave: function () {
      var $dropdown = this.$('.typeahead.binf-dropdown-menu'),
          bRet      = ($dropdown.length === 0 || !$dropdown.is(':visible'));
      return bRet && this.userPicked;
    },

    onItemChange: function (args) {
      this.editValue = args.item.attributes;
      this.userPicked = true;
      if (!!this.getEditableBehavior().showActions) {
        this.getEditableBehavior().showActions(this);
      }
      this.options.isDropDownOpen = false;
      this.trigger('selection:changed');
    },

    getEditValue: function () {
      var fieldValue = this.pickerView.$el.find('input').val();
      if (!fieldValue) {
        this.editValue = {display_name: "", id: null, name: ""};
      }

      if (this.userPicked) {
        this.pickerView.$el.find('input').val(base.formatMemberName(this.editValue));
      }
      return this.editValue;
    },

    _getChangeValue: function () {
      return this.model.get('data').id;
    },

    _keyboardNavigationNotification: function () {
      if (this.options.model && this.options.model.attributes.options &&
          this.options.model.attributes.options.mode === 'create') {
        setTimeout(_.bind(function () {
          var event = $.Event('tab:content:field:changed');
          this.$el.trigger(event);
        }, this), 300);
      }
    },

    _setDefaultProfilePicture: function () {
      this.ui.personalizedImage.attr("src",
          "data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=");
      this.ui.personalizedImage.addClass("esoc-userprofile-img-" + this.data.id);
      this.ui.defaultUserImage.addClass("esoc-user-default-avatar-" + this.data.id);
      this.ui.defaultUserImage[0].innerText = this.options.model.attributes.data.initials;
      var userbackgroundcolor = UserAvatarColor.getUserAvatarColor(
          this.options.model.attributes.data);
      this.ui.defaultUserImage.css("background-color", userbackgroundcolor);
      if (this.isGroup) {
        this.ui.defaultGroupImage.removeClass('binf-hidden');
        this.ui.defaultUserImage.addClass('binf-hidden');
      } else {
        this.ui.defaultGroupImage.addClass('binf-hidden');
        this.ui.defaultUserImage.removeClass('binf-hidden');
      }
      this.ui.personalizedImage.addClass('binf-hidden');
    },

    getDisplayValue: function () {
      return this.getEditValue().name;
    },

    _resolvePhoto: function (photoUrl) {
      var context    = this.options.context,
          connector  = context.getObject(ConnectorFactory),
          connection = this.options.connection || connector.connection,
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

    onDestroy: function () {
      if (this.pickerView) {
        this.pickerView.destroy();
      }
      if (this.url) {
        URL.revokeObjectURL(this.url);
      }
    },

    _getChangeEventValue: function () {
      var ret = this.getValue().id;
      return ret;
    },

    onKeyPress: function (event) {
      if (event.keyCode === 13) { // enter:13
        event.preventDefault();
        event.stopPropagation();
        if (this.getStatesBehavior().isStateRead() && this.allowEditOnEnter()) {
          this.getEditableBehavior().setViewStateWriteAndEnterEditMode();
        } else if (this.getStatesBehavior().isStateWrite() && this.allowSaveOnEnter()) {
          this.getEditableBehavior().trySetValueAndLeaveEditMode(true, true);
        }
      }
      if (event.keyCode === 13 || event.keyCode === 9 || event.keyCode === 16 ||
          event.keyCode === 113) {
        if (this.alpacaField && this.alpacaField.refreshValidationState) {
          this.alpacaField.refreshValidationState(false);
        }
      } else {
        this.userPicked = false;
      }
      return true; // we handle it
    },

    onKeyDown: function (event) {
      if (event.keyCode === 27) {
        this.dropdownMenuVisible = this.options.isDropDownOpen;
        this.onUserPickerClose(event);
        event.preventDefault();
      } else if (event.keyCode === 13 || event.keyCode === 32) {
        if ($(event.target).hasClass('esoc-user-container')) {
          this.showUserProfileDialog(event);
        }
        if (this.alpacaField) {
          this.alpacaField.keyDown = true;
        }
      }
    },
    onKeyUp: function (event) {
      if (event.keyCode === 13) { // enter:13
        if (this.alpacaField && this.alpacaField.refreshValidationState &&
            !!this.alpacaField.keyDown) {
          this.alpacaField.refreshValidationState(false);
        }
        if (this.alpacaField) {
          this.alpacaField.keyDown = false;
        }
      } else if (event.keyCode === 8 || event.keyCode === 46) {
        if (event.target.value === '') {
          this.userPicked = true;
          if (this.mode === 'writeonly') {
            this.model.attributes.data = "";
          }
          if (!!this.getEditableBehavior().showActions) {
            this.getEditableBehavior().showActions(event);
          }
          this.options.isDropDownOpen = false;
        } else {
          this.userPicked = false;
        }
      } else if (event.keyCode === 27) { //escape:27
        if (this.dropdownMenuVisible) {
          event.preventDefault();
          event.stopPropagation();
        }
        this.dropdownMenuVisible = false;
      }

      this.userWidgetView = '';
    },

    handleTabKey: function (event) {
      if (!!this.options.isDropDownOpen) {
        this.pickerView.trigger('userpicker:close', event);
        event.preventDefault();
        event.stopPropagation();
      }
    },
    onMouseDown: function (event) {
      if (($(event.target.parentElement.parentElement).is('.csui-userpicker-item, .typeahead') ||
           $(event.target).hasClass('member-info')) &&
          !$(event.target).hasClass("csui-user-picker-no-results")) {
        this.userPicked = true;
      }
    }
  });

  return UserFieldView;
});