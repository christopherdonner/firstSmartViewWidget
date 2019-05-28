/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['require', 'i18n'
], function (require, i18n) {
  'use strict';

  describe('i18n', function () {
    if (!window.require) {
      return it('Modules cannot be unloaded in the release mode.');
    }

    var originalLocale = i18n.settings.locale,
        originalPreferredLocales = i18n.settings.preferredLocales;

    function restoreTestSettings() {
      requirejs.config({
        config: {
          i18n: {
            locale: originalLocale,
            preferredLocales: originalPreferredLocales
          }
        }
      });
    }

    function unloadTestModules() {
      requirejs.undef('i18n');
      requirejs.undef('csui/lib/test/nls/lang');
      requirejs.undef('csui/lib/test/nls/root/lang');
      requirejs.undef('csui/lib/test/nls/test/lang');
      requirejs.undef('i18n!csui/lib/test/nls/lang');
      requirejs.undef('i18n!csui/lib/test/nls/lang:preferred');
    }

    describe('by default', function () {
      var testLang;

      beforeEach(function (done) {
        requirejs.config({
          config: {
            i18n: {
              locale: undefined,
              preferredLocales: undefined
            }
          }
        });
        unloadTestModules();

        require(['i18n!csui/lib/test/nls/lang'], function (lang) {
          testLang = lang;
          done();
        });
      }, 5000);

      afterEach(function () {
        restoreTestSettings();
        unloadTestModules();
      });

      it('loads the configured UI language', function () {
        expect(testLang.test).toEqual('no');
      });
    });

    describe('with the forced default', function () {
      var testLang;

      beforeEach(function (done) {
        requirejs.config({
          config: {
            i18n: {
              locale: undefined,
              preferredLocales: undefined
            }
          }
        });
        unloadTestModules();

        require(['i18n!csui/lib/test/nls/lang:configured'], function (lang) {
          testLang = lang;
          done();
        });
      }, 5000);

      afterEach(function () {
        restoreTestSettings();
        unloadTestModules();
      });

      it('loads the configured UI language', function () {
        expect(testLang.test).toEqual('no');
      });

      it('allows overriding of texts in the default language', function () {
        expect(testLang.overridable).toEqual('second');
      });
    });

    describe('with a specific locale', function () {
      var testLang;

      beforeEach(function (done) {
        requirejs.config({
          config: {
            i18n: {
              locale: undefined,
              preferredLocales: undefined
            }
          }
        });
        unloadTestModules();

        require(['i18n!csui/lib/test/nls/test/lang'], function (lang) {
          testLang = lang;
          done();
        });
      }, 5000);

      afterEach(function () {
        restoreTestSettings();
        unloadTestModules();
      });

      it('loads specific settings', function () {
        expect(testLang.test).toEqual('yes');
      });

      it('allows overriding of texts in the specified language', function () {
        expect(testLang.overridable).toEqual('third');
      });
    });

    describe('with a preferred locale', function () {
      var testLang;

      beforeEach(function (done) {
        requirejs.config({
          config: {
            i18n: {
              locale: undefined,
              preferredLocales: [{locale: 'test'}]
            }
          }
        });
        unloadTestModules();

        require(['i18n!csui/lib/test/nls/lang:preferred'], function (lang) {
          testLang = lang;
          done();
        });
      }, 5000);

      afterEach(function () {
        restoreTestSettings();
        unloadTestModules();
      });

      it('loads preferred settings', function () {
        expect(testLang.test).toEqual('yes');
      });
    });
  });
});
