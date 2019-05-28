csui.define([
  'module',
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/handlebars',
  'csui/lib/marionette',
  'csui/utils/contexts/factories/user',
  'csui/utils/user.avatar.color',
  'esoc/widgets/userwidget/model/userwidget.model',
  'esoc/widgets/userwidget/view/miniprofile.view',
  'esoc/widgets/userwidget/view/userprofile.view',
  'esoc/widgets/userwidget/view/simple.userwidget.view',
  'esoc/widgets/userwidget/userprofile',
  'esoc/widgets/userwidget/util',
  'hbs!esoc/widgets/userwidget/impl/userwidget',
  'i18n!esoc/widgets/userwidget/nls/lang',
  'esoc/widgets/userwidget/chat/chatfactory',
  'css!esoc/widgets/userwidget/impl/userwidget.css'
], function (module, $, _, Handlebars, Marionette, UserModelFactory, UserAvatarColor, UserWidgetModel,
    MiniProfileView, UserProfileView, SimpleUserWidgetView, UserProfile, Util, UserWidgetTemplate, lang, ChatFactory) {
  var self           = null,
      userDialog     = null,
      UserWidgetView = Marionette.ItemView.extend({
        tagName: 'span',
        className: 'esoc-userwidget-wrapper',
        template: UserWidgetTemplate,
        util: Util,
        ui: {
            initialsPlaceholder: '.image_user_placeholder'
        },
        templateHelpers: function () {
          return {
            messages: {
              showPresenceIndicator: this.options.showPresenceIndicator,
              showMiniProfile: this.options.showMiniProfile,
              showUserProfileLink: this.options.showUserProfileLink,
              showUserProfilePicture: this.showProfilePic,
              showUserDisplayName: !this.showProfilePic,
              userWidgetWrapperClass: this.options.userWidgetWrapperClass,
              myProfile: lang.myProfile,
              othersProfile: lang.othersProfile,
              userid: this.options.userid,
              uniqueId: _.uniqueId(),
              xFrame: this.options.xFrame
            }
          };
        },
        initialize: function (options) {
          this.options = options;
          var loggedUserId = this.options.context.getModel(UserModelFactory).get("id") || this.options.loggedUserId;
          this.options.model.attributes.otherUser = parseInt(loggedUserId, 10) !==
                                                    parseInt(this.options.userid, 10);
          self = this;
          if (this.options.showPresenceIndicator !== undefined &&
              this.options.showPresenceIndicator) {
            setInterval(this.getCurrentUserStatus(), 5000);
          }
          this.showProfilePic = !!this.options.showUserWidgetFor &&
                                this.options.showUserWidgetFor === "profilepic";  
        },
        onRender: function (e) {
          if (!this.options.unKnownUser && this.showProfilePic &&
              this.options.model.attributes.photo_url !== undefined) {
            var userProfilePicOptions = {
              context: this.options.context,
              userid: this.options.userid,
              photoElement: this.$el.find(
                  '[class^="esoc-userprofile-img-' + Util.escapeSelector(this.options.userid) + '"]'),
              defaultPhotElement: this.$el.find(
                  ".esoc-user-default-avatar-" + Util.escapeSelector(this.options.userid))
            }
            Util.commonUtil.setProfilePic(userProfilePicOptions);
          }
          if (this.options.showMiniProfile) {
            // triggering mouseover to initialize popover
            this.$el.find(".esoc-user-mini-profile").trigger('mouseover');
          }
        },
        getCurrentUserStatus: function () {
        },
        events: {
          'click .esoc-user-profile-link': 'showUserProfileDialog',
          'keydown .esoc-user-profile-link': 'showUserProfileDialogWithSpaceKey',
          'mouseover .esoc-user-mini-profile': 'showMiniProfilePopup'
        },
        showUserProfileDialogWithSpaceKey: function (e) {
          if ((e.keyCode || e.which) === 32) {
            e.preventDefault();
            $(e.currentTarget).click();
          }
        },
        showMiniProfilePopup: function (e) {
          // Render mini profile only if it is of user type
          if (this.model.attributes.type === 0) {
            var _evt = e || window.event;
            this.options.targetEle = _evt.target;
            this.options.userWidgetView = this;
            this.options.userprofileView = UserProfileView;
            var miniProfileView = new MiniProfileView(this.options);
            miniProfileView.render(e);
          }
        },
        showUserProfileDialog: function (e) {
          // Render user profile only if it is of user type
          if (this.model.attributes.type === 0) {
            if (e) {
              this.options.targetEle = e.currentTarget;
            }
            this.options.originatingView &&
            this.options.originatingView.disengageModalKeyboardFocusOnClose &&
            this.options.originatingView.disengageModalKeyboardFocusOnClose();
            Util.showUserProfileDialog(this, UserProfileView, SimpleUserWidgetView);
            var alreadyPushed = ((Util.userStack.length > 0 &&
                                  Util.userStack[Util.userStack.length - 1].model.id ===
                                  this.model.id) ? true : false);
            //push the userwidget view if the it is not pushed
            if (!alreadyPushed) {
              Util.userStack.push(this);
            }
          }

        },
        constructor: function UserWidgetView(options) {
          var self = this;
          options = options || {};
          options = this.setDefaultWidgetOptions(options);

          ChatFactory.initializeApplication(options);

          if (options.model) {
            options.model.connector = options.connector;
            options.model.userid = options.model.attributes.id;
            options.model.attributes.userid = options.model.attributes.id;
          } else {
            var userWidgetOptions = {
              userid: options.userid,
              connector: options.connector,
              context: options.context
            };
            options.model = Util.commonUtil.getUserWidgetModel(userWidgetOptions);
            this.isUserModelLoaded = false;
            options.model.ensureFetched().done(function () {
              if (options.source === "extendedInfoText") {
                if (self.$el) {
                  options.parentView.trigger("view:shown");
                } else {
                  self.isUserModelLoaded = true;
                  self.parentView = options.parentView;
                }
              }
              options.model.userid = options.model.attributes.id;
              options.model.attributes.userid = options.model.attributes.id;
              options.model.attributes.department_name = options.model.attributes.group_id ?
                                                         options.model.attributes.group_id["name"] :
                                                         "";
            });
          }
          var config = module.config();
          if (!!config) {
            options.enableSimpleSettingsModel = config.enableSimpleUserProfile;
            options.enableUploadProfilePicture = config.enableProfilePicture;
          }
          Marionette.ItemView.prototype.constructor.call(this, options);
          this.model.on('change', this.render, this);
          this.model.on('error', this.errorHandle, this);
          this.listenTo(this, 'render', this._assignUserColor);
        },
        onShow: function () {
          if (this.isUserModelLoaded && this.parentView) {
            this.parentView.isUserModelLoaded = true;
          }
        },
        setDefaultWidgetOptions: function (options) {
          options.unKnownUser = options.userid === -3;
          options.showMiniProfile = !options.unKnownUser &&
                                    (options.showMiniProfile ? options.showMiniProfile : false);
          options.showUserProfileLink = !options.unKnownUser &&
                                        (options.showUserProfileLink ? options.showUserProfileLink :
                                         false);
          // chat is not in scope, for now hard coded value to false
          options.showPresenceIndicator = !options.unKnownUser && false;
          return options;
        },
        errorHandle: function (model, response) {
        },
        _assignUserColor: function(){
            var userbackgroundcolor = UserAvatarColor.getUserAvatarColor(this.model.attributes);
            this.ui.initialsPlaceholder.css("background",userbackgroundcolor);
        }
      });
  return UserWidgetView;
});

