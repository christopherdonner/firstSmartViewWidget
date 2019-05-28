/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'require', 'csui/lib/underscore', 'csui/utils/types/localizable', 'i18n'
], function (require, _, localizable, i18n) {
  'use strict';

  function switchToTest(done) {
    this.originalLocale = i18n.settings.locale;
    this.originalDefaultLocale = i18n.settings.defaultLocale;
    window.csui.requirejs.config({
      config: {
        i18n: {
          locale: 'test-TEST',
          defaultLocale: 'default-TEST'
        }
      }
    });
    window.csui.requirejs.undef('i18n');
    window.csui.requirejs.undef('csui/utils/types/localizable');

    require(['csui/utils/types/localizable', 'i18n'], function (localizable, i18n) {
      this.testLocalizable = localizable;
      expect(i18n.settings.locale).toEqual('test-test');
      expect(i18n.settings.defaultLocale).toEqual('default-test');
      done();
    }.bind(this));
  }

  function switchToGerman(done) {
    this.originalLocale = i18n.settings.locale;
    window.csui.requirejs.config({
      config: {
        i18n: {locale: 'de'}
      }
    });
    window.csui.requirejs.undef('i18n');
    window.csui.requirejs.undef('csui/utils/types/localizable');

    require(['i18n', 'csui/utils/types/localizable'], function (i18n, localizable) {
      this.testLocalizable = localizable;
      expect(i18n.settings.locale).toEqual('de');
      done();
    }.bind(this));
  }

  function switchToOriginal(done) {
    window.csui.requirejs.config({
      config: {
        i18n: {
          locale: this.originalLocale,
          defaultLocale: this.originalDefaultLocale
        }
      }
    });
    window.csui.requirejs.undef('i18n');
    window.csui.requirejs.undef('csui/utils/types/localizable');
    require(['csui/utils/types/localizable'], done);
  }

  describe('localizable', function () {
    describe('getClosestLocalizedString', function () {
      if (!window.require) {
        return it('Modules cannot be unloaded in the release mode.');
      }

      beforeAll(switchToTest, 5000);

      afterAll(switchToOriginal, 5000);

      it('returns always a string by stringifying primitive values', function () {
        expect(this.testLocalizable.getClosestLocalizedString()).toEqual('');
        expect(this.testLocalizable.getClosestLocalizedString(null)).toEqual('');
        expect(this.testLocalizable.getClosestLocalizedString(0)).toEqual('0');
        expect(this.testLocalizable.getClosestLocalizedString(1)).toEqual('1');
        expect(this.testLocalizable.getClosestLocalizedString('a')).toEqual('a');
      });

      it('returns the value for the current locale', function () {
        expect(this.testLocalizable.getClosestLocalizedString({
          'test-TEST': 'localized',
          'language': 'language',
          'other-TEST': 'other'
        })).toEqual('localized');
      });

      it('returns the value for the current language as the first fall-back',
          function () {
            expect(this.testLocalizable.getClosestLocalizedString({
              'test': 'localized',
              'other-TEST': 'other'
            })).toEqual('localized');
          });

      it('returns the value for the default locale as the next fall-back', function () {
        expect(this.testLocalizable.getClosestLocalizedString({
          'default-TEST': 'localized',
          'default': 'language',
          'other-TEST': 'other'
        })).toEqual('localized');
      });

      it('returns the value for the default language as the next fall-back', function () {
        expect(this.testLocalizable.getClosestLocalizedString({
          'default': 'localized',
          'other-TEST': 'other'
        })).toEqual('localized');
      });

      it('returns the specified fallback parameter as the last fall-back', function () {
        expect(this.testLocalizable.getClosestLocalizedString({
          'other-TEST': 'other'
        }, 'localized')).toEqual('localized');
      });

      it('recognizes locale format used in multilingual metadata', function () {
        expect(this.testLocalizable.getClosestLocalizedString({
          'test_TEST': 'localized',
          'language': 'language',
          'other_TEST': 'other'
        })).toEqual('localized');
        expect(this.testLocalizable.getClosestLocalizedString({
          'default_TEST': 'localized',
          'default': 'language',
          'other_TEST': 'other'
        })).toEqual('localized');
      });

      it('handles the locale identifiers case-insensitively', function () {
        expect(this.testLocalizable.getClosestLocalizedString({
          'tEsT-TeSt': 'localized',
          'language': 'language',
          'other-TEST': 'other'
        })).toEqual('localized');
        expect(this.testLocalizable.getClosestLocalizedString({
          'tEsT': 'localized',
          'other-TEST': 'other'
        })).toEqual('localized');
        expect(this.testLocalizable.getClosestLocalizedString({
          'dEfAuLt-TeSt': 'localized',
          'default': 'language',
          'other-TEST': 'other'
        })).toEqual('localized');
        expect(this.testLocalizable.getClosestLocalizedString({
          'dEfAuLt': 'localized',
          'other-TEST': 'other'
        })).toEqual('localized');
      });
    });

    describe('localeCompareString', function () {
      if (!window.require) {
        return it('Modules cannot be unloaded in the release mode.');
      }

      if (!_.contains(navigator.languages, 'de')) {
        it('cannot be tested without German locale ("de") enabled in web browser settings');
        return;
      }

      beforeAll(switchToGerman, 5000);

      afterAll(switchToOriginal, 5000);

      it('when sorting, differs in case and transliterations', function () {
        expect(this.testLocalizable.localeCompareString('MÄẞIGKEIT', 'mäßigkeit',
            {usage: 'sort'})).toEqual(1);
        expect(this.testLocalizable.localeCompareString('Mäßigkeit', 'Maessigkeit',
            {usage: 'sort'})).toEqual(1);
      });

      it('when searching, ignores case and transliterations', function () {
        expect(this.testLocalizable.localeCompareString('Mäßigkeit', 'mäßigkeit',
            {usage: 'search'})).toEqual(0);
        expect(this.testLocalizable.localeCompareString('Mäßigkeit', 'Maessigkeit',
            {usage: 'search'})).toEqual(0);
      });

      it('when sorting, recognizes numbers in strings', function () {
        expect(this.testLocalizable.localeCompareString('12', '0120',
            {usage: 'sort'})).toEqual(-1);
        expect(this.testLocalizable.localeCompareString('12', '012',
            {usage: 'sort'})).toEqual(0);
      });

      it('when searching, takes digits for alphabetical characters', function () {
        expect(this.testLocalizable.localeCompareString('12', '0120',
            {usage: 'search'})).toEqual(1);
        expect(this.testLocalizable.localeCompareString('12', '012',
            {usage: 'search'})).toEqual(1);
      });

      it('uses the search mode by default', function () {
        expect(this.testLocalizable.localeCompareString('Mäßigkeit', 'maessigkeit')).toEqual(0);
      });
    });

    describe('formatMessage', function () {
      beforeAll(function () {
        this.formats = {
          formatForNone: 'žádný soubor',
          formatForOne: '{0} soubor',
          formatForTwo: '{0} soubory',
          formatForFive: '{0} souborů{1}'
        };
      });

      it('recognizes count 0', function () {
        var result = localizable.formatMessage(0, this.formats);
        expect(result).toEqual('žádný soubor');
      });

      it('recognizes count 1', function () {
        var result = localizable.formatMessage(1, this.formats);
        expect(result).toEqual('1 soubor');
      });

      it('recognizes count 2', function () {
        var result = localizable.formatMessage(2, this.formats);
        expect(result).toEqual('2 soubory');
      });

      it('recognizes count 3', function () {
        var result = localizable.formatMessage(3, this.formats);
        expect(result).toEqual('3 soubory');
      });

      it('recognizes count 4', function () {
        var result = localizable.formatMessage(4, this.formats);
        expect(result).toEqual('4 soubory');
      });

      it('recognizes count 5', function () {
        var result = localizable.formatMessage(5, this.formats);
        expect(result).toEqual('5 souborů');
      });

      it('recognizes count 6', function () {
        var result = localizable.formatMessage(6, this.formats);
        expect(result).toEqual('6 souborů');
      });

      it('supports a fallback for count 0', function () {
        var result = localizable.formatMessage(0,
          _.omit(this.formats, 'formatForNone'));
        expect(result).toEqual('0 souborů');
      });

      it('supports additional parameters', function () {
        var result = localizable.formatMessage(7, this.formats, '.');
        expect(result).toEqual('7 souborů.');
      });
    });
  });
});
