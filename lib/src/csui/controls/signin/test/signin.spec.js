/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/utils/contexts/page/page.context',
  'csui/utils/contexts/factories/connector',
  'csui/controls/signin/signin.view', './signin.mock.data.js', 'i18n',
  'csui/lib/jquery.simulate'
], function (_, PageContext, ConnectorFactory, SigninView, mock, i18n) {
  'use strict';

  describe('The SigninView Control', function () {
    if (!window.require) {
      return it('Modules cannot be unloaded in the release mode.');
    }

    var sTitle,
        validUsername = 'aUser',
        validPassword = 'theCredential',
        connUrl = '//server/otcs/cs/api/v1',
        w;

    beforeEach(function (done) {
      if (!w) {
        sTitle = 'testTitle';

        require.config({
          config: {
            i18n: {locale: 'test'}
          }
        });

        var callback = _.after(1, function () {
          w = new SigninView({
            connection: {
              url: connUrl,
              supportPath: '/otcssupport'
            }
          });
          mock.enable(connUrl, validUsername, validPassword);
          done();
        });
        var originalLocale = i18n.settings.locale;
        require.undef('i18n');
        require.undef('csui/controls/signin/signin.view');
        require.undef('i18n!csui/controls/signin/impl/nls/localized.strings');

        require(['csui/controls/signin/signin.view'], function (localSigninView) {
          SigninView = localSigninView;
          require.config({
            config: {
              i18n: {locale: originalLocale}
            }
          });
          require.undef('i18n');
          require.undef('csui/controls/signin/signin.view');
          require.undef('i18n!csui/controls/signin/impl/nls/localized.strings');
        });

        callback();
      } else {
        mock.enable(connUrl, validUsername, validPassword);            // do this outside of require-block
        done();
      }
    });

    afterEach(function () {
      mock.disable();
    });

    it('can be instantiated and rendered', function (done) {
      expect(w).toBeDefined();
      expect(w.$el.length > 0).toBeTruthy();
      w.render();
      expect(w.$el.length > 0).toBeTruthy();
      done();
    });

    it('throws event \'success\' when submitted with valid credentials', function (done) {
      w.ui.username.val(validUsername);
      w.ui.password.val(validPassword);

      w.on('success', function (opts) {
        expect(w.authenticator.connection.session.ticket).toBeDefined();
        done();
      });

      expect(w.authenticator).toBeUndefined();
      w.ui.button.click();
    }, 5000);

    it('throws event \'failure\' when submitted with invalid password', function (done) {
      w.ui.username.val(validUsername);
      w.ui.password.val('yyy');

      w.on('failure', function (opts) {
        expect(w.authenticator.connection.session).toBeUndefined();
        done();
      });

      w.on('success', function (opts) {
        done();
      });

      w.$('button').trigger('click');
    }, 5000);

    it('throws event \'failure\' when submitted with invalid username', function (done) {
      w.ui.username.val('xxx');
      w.ui.password.val(validPassword);

      w.on('failure', function (opts) {
        expect(w.authenticator.connection.session).toBeUndefined();
        done();
      });

      w.$('button').trigger('click');
    }, 5000);

    describe('has a reactive submit button', function () {
      var button;

      beforeEach(function () {
        if (!button) {
          button = w.$('button');
        }
      });

      it('which is disabled, as long as username field is not filled', function () {
        w.ui.username.val('');
        w.ui.password.val('');
        w.ui.password.trigger('keyup');
        expect(w.ui.button.prop('disabled')).toBeTruthy();
        w.ui.username.val('x');
        w.ui.password.trigger('keyup');
        expect(w.ui.button.prop('disabled')).toBeFalsy();
        w.ui.username.val('');
        w.ui.password.val('x');
        w.ui.password.trigger('keyup');
        expect(w.ui.button.prop('disabled')).toBeTruthy();
        w.ui.username.val('x');
        w.ui.password.val('x');
        w.ui.password.trigger('keyup');
        expect(w.ui.button.prop('disabled')).toBeFalsy();
      });

      it('which is enabled, as soon as both input fields are filled', function () {
        w.ui.username.val('x');
        w.ui.password.val('x');
        w.ui.password.trigger('keyup');
        expect(w.ui.button.prop('disabled')).toBeFalsy();
      });
    });

    describe('when the user signed in successfully', function () {
      it('creates a session cookie (resp. an entry in the session store)',
          function (done) {
            w.ui.username.val(validUsername);
            w.ui.password.val(validPassword);

            w.on('success', function () {
              expect(w.authenticator.connection.session.ticket).toBeDefined();
              expect(w.authenticator.connection.session.ticket).toEqual('1234567890'); // from mock
              done();
            });

            w.$('button').trigger('click');
          }, 5000);

      it('sets the ticket to the the shared connector', function () {
        var context = new PageContext(),
            connector = context.getObject(ConnectorFactory);
        expect(connector.connection.session).toBeDefined();
        expect(connector.connection.session.ticket).toBeDefined();
      });
    });

    describe('when the sign in failed', function () {
      it('a error message is shown and error state is enabled', function (done) {
        w.ui.username.val('asdf');
        w.ui.password.val('qwer');

        w.on('failure', function () {
          expect(w.$('.binf-form-group').hasClass('binf-has-error')).toBeTruthy();
          expect(w.ui.passwordclearer.hasClass('error-icon')).toBeTruthy();
          expect(w.ui.usernameclearer.hasClass('error-icon')).toBeTruthy();
          expect(w.ui.passwordclearer.hasClass('clear-icon')).toBeFalsy();
          expect(w.ui.usernameclearer.hasClass('clear-icon')).toBeFalsy();
          done();
        });

        w.$('button').trigger('click');
      });
    });

    describe('is localized', function () {
      var w2;

      beforeEach(function (done) {
        require.config({
          config: {
            i18n: {locale: 'test'}
          }
        });

        require.undef('i18n');
        require.undef('csui/controls/signin/signin.view');
        require.undef('i18n!csui/controls/signin/impl/nls/localized.strings');

        require(['csui/controls/signin/signin.view'], function (SigninView) {
          w2 = new SigninView({
            connection: {
              url: '//server/otcs/cs/api/v1',
              supportPath: '/otcssupport'
            }
          });

          w2.render();
          done();
        });
      });

      afterEach(function () {
        require.config({
          config: {
            i18n: {locale: undefined}
          }
        });

        require.undef('i18n');
        require.undef('csui/controls/signin/signin.view');
        require.undef('i18n!csui/controls/signin/impl/nls/localized.strings');
      });

      it('for signin button text', function () {
        expect(w2.ui.button.text()).toEqual('signinButtonText');
      });

      it('for username placeholder', function () {
        expect(w2.ui.username.attr('placeholder')).toEqual('signinPlaceholderUsername');
      });

      it('for password placeholder', function () {
        expect(w2.ui.password.attr('placeholder')).toEqual('signinPlaceholderPassword');
      });

      it('for error message', function (done) {
        w2.ui.username.val('asdf');
        w2.ui.password.val('qwer');

        w2.on('failure', function () {
          expect(w2.$('.login-error').html()).toEqual('signinInvalidUsernameOrPassword');
          done();
        });

        w2.$('button').trigger('click');
      });
    });
  });
});
