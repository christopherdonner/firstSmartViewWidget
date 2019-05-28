/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'module', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/utils/authenticators/basic.authenticator',
  'csui/utils/authenticators/credentials.authenticator',
  'csui/utils/contexts/page/page.context',
  'csui/utils/connector', 'csui/utils/contexts/factories/connector',
  'csui/lib/marionette', 'hbs!csui/controls/signin/impl/signin',
  'i18n!csui/controls/signin/impl/nls/localized.strings',
  'css!csui/controls/signin/impl/css/signin'
], function (module, _, $, BasicAuthenticator, CredentialsAuthenticator,
    PageContext, Connector, ConnectorFactory, Marionette, template, lang) {
  'use strict';

  var config = _.extend({
    useBasicAuthentication: false
  }, module.config());

  var SignInView = Marionette.ItemView.extend({
    constructor: function SignInView() {
      Marionette.ItemView.apply(this, arguments);
    },

    className: 'cs-signin',

    template: template,

    triggers: {
      'click button': 'click:button',
      'mousedown @ui.usernameclearer': 'click:usernameclearer',
      'mousedown @ui.passwordclearer': 'click:passwordclearer',
      'focus @ui.username': 'focus:username',
      'focus @ui.password': 'focus:password',
      'change @ui.password': 'change:password',
      'change @ui.username': 'change:username'
    },

    ui: {
      username: '#inputUsername',
      password: '#inputPassword',
      button: '#buttonSubmit',
      passwordclearer: '#passwordclearer',
      usernameclearer: '#usernameclearer',
      loginerror: '#loginError'
    },

    onRender: function () {
      this.ui.usernameclearer.toggle(false);
      this.ui.passwordclearer.toggle(false);
        this.ui.username.prop('autofocus', true);
    },

    onClickPasswordclearer: function (event) {
      this.ui.password.val('').focus();
      this._unsetErrorStyle();
      this.ui.passwordclearer.hide();
    },

    onClickUsernameclearer: function (event) {
      this.ui.username.val('').focus();
      this._unsetErrorStyle();
      this.ui.usernameclearer.hide();
    },

    onFocusUsername: function () {
        this.validate();
    },

    onFocusPassword: function () {
        this.validate();
    },

    onChangeUsername: function () {
        this.validate();
    },

    onChangePassword: function () {
        this.validate();
    },

    templateHelpers: function () {
      return {
        buttontext: lang.signinButtonText,
        copyright: lang.signinCopyright,
        forgotpassword: lang.signinForgotPassword,
        placeholderusername: lang.signinPlaceholderUsername,
        usernameAria: lang.usernameAria,
        placeholderpassword: lang.signinPlaceholderPassword,
        passwordAria: lang.passwordAria
      };
    },

    events: {
      'keyup .binf-form-control': 'validate',
      'keydown button': 'onKeyPress'
    },

    onKeyPress: function (event) {
      var isButtonDisabled = this.ui.button.prop("disabled");
      if (!isButtonDisabled && event.which === 13) {
        this.ui.button.toggleClass('login-btn-enabled');
      }
    },

    validate: function (event) {
      this._unsetErrorStyle();

      var bIsUserNameSet = !!this.ui.username.val().length,
        bIsPasswordSet = true, //!!this.ui.password.val().length, // allow for empty pw
        bIsValidInput = bIsUserNameSet && bIsPasswordSet,
        bUserNameHasFocus = $(document.activeElement).is(this.ui.username),
        bPasswordHasFocus = $(document.activeElement).is(this.ui.password);
      this.ui.usernameclearer.toggle(bIsUserNameSet && bUserNameHasFocus);
      this.ui.passwordclearer.toggle(bIsPasswordSet && bPasswordHasFocus);
      this.ui.button.prop("disabled", !bIsValidInput);
      this.ui.button.toggleClass('login-btn-enabled', bIsValidInput);
      if (bIsValidInput && event && event.which === 13) {
        event.preventDefault();
        this.ui.button.click();
      }
    },

    onClickButton: function () {
      this.ui.button.toggleClass('login-btn-enabled', false);
      var credentials = {
            username: this.ui.username.val(),
            password: this.ui.password.val()
          },
          useBasicAuthentication = config.useBasicAuthentication;

      if (!this.authenticator) {
        var connection = _.defaults({
              credentials: credentials
            }, this.options.connection),
            Authenticator = useBasicAuthentication ? BasicAuthenticator :
                            CredentialsAuthenticator,
            authenticator = new Authenticator({
              connection: connection
            }).on('loggedIn', _.bind(function () {
              this.ui.button.toggleClass('login-btn-enabled', true);
              this.trigger('success', {
                username: credentials.username,
                session: connection.session
              });
            }, this));
        this.authenticator = authenticator;
      }
      var successHandler = _.bind(function () {
            var context = new PageContext(),
                connector = context.getObject(ConnectorFactory),
                session = this.authenticator.connection.session;
            connector.authenticator.updateAuthenticatedSession(session);
          }, this),
          errorHandler = _.bind(function (error, connection) {
            this.ui.button.toggleClass('login-btn-enabled', true);
            this._setErrorStyle();
            this.trigger('failure', {
              username: credentials.username,
              error: error
            });
          }, this);
      if (useBasicAuthentication) {
        this.authenticator.check({
          credentials: credentials,
        }, successHandler, errorHandler);
      } else {
        this.authenticator.login({
          data: credentials
        }, successHandler, errorHandler);
      }
    },

    _setErrorStyle: function () {
      this.ui.username.focus().select();
      this.ui.password.val('');
      this.ui.usernameclearer.toggle(true);
      this.ui.passwordclearer.toggle(true);
      this.ui.loginerror.html(lang.signinInvalidUsernameOrPassword);

      this.$('.binf-form-group').addClass('binf-has-error');
      this.$('.clearer').removeClass('clear-icon').addClass('error-icon');
    },

    _unsetErrorStyle: function () {
      this.ui.loginerror.html('');
      this.$('.binf-form-group').removeClass('binf-has-error');
      this.$('.clearer').removeClass('error-icon').addClass('clear-icon');
    }
  });

  return SignInView;
});
