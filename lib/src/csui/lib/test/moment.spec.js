/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'require', 'i18n'
], function (require, i18n) {
  'use strict';

  describe('Moment', function () {
    if (!window.require) {
      return it('Modules cannot be unloaded in the release mode.');
    }

    var originalLocale = i18n.settings.preferredLocales[0].locale,
        newLocale, moment;

    function restoreTestSettings() {
      requirejs.config({
        config: {
          'csui/lib/moment': {
            locale: originalLocale,
            longDateFormat: null
          }
        }
      });
    }

    function reloadTestModules(done) {
      requirejs.undef('csui/lib/moment');
      requirejs.undef('csui/lib/moment-timezone');
      require(['csui/lib/moment'], function (localMoment) {
        moment = localMoment;
        done();
      });
    }

    describe('when switched to other locale', function () {
      beforeAll(function (done) {
        newLocale = originalLocale.indexOf('de') === 0 ? 'fr' : 'de';
        requirejs.config({
          config: {
            'csui/lib/moment': {
              locale: newLocale,
              longDateFormat: null
            }
          }
        });
        reloadTestModules(done);
      });

      afterAll(function (done) {
        restoreTestSettings();
        reloadTestModules(done);
      });

      it('recognizes the other locale', function () {
        expect(moment.locale()).toEqual(newLocale);
      });

      it('retains the other locale\'s formats', function () {
        var data = moment.localeData(),
            date = data.longDateFormat('L'),
            time = data.longDateFormat('LTS'),
            formats = {
              de: {
                L: 'DD.MM.YYYY',
                LTS: 'HH:mm:ss'
              },
              fr: {
                L: 'DD/MM/YYYY',
                LTS : 'HH:mm:ss'
              }
            },
            format = formats[newLocale];
        expect(date).toEqual(format.L);
        // Count with the configurable second suppression
        expect(time === format.LTS || time === 'LT').toBeTruthy();
      });
    });

    describe('when overriding date and time formats', function () {
      var longDateFormat = {
        L: 'DD.MM YYYY',
        LTS: 'HH,mm.ss'
      };

      beforeAll(function (done) {
        requirejs.config({
          config: {
            'csui/lib/moment': {
              locale: originalLocale,
              longDateFormat: longDateFormat
            }
          }
        });
        reloadTestModules(done);
      });

      afterAll(function (done) {
        restoreTestSettings();
        reloadTestModules(done);
      });

      it('retains the original locale', function () {
        var locale = moment.locale(),
            originaLanguage = originalLocale.replace(/[-_]\w+$/, '');
        expect(locale === originalLocale || locale === originaLanguage).toBeTruthy();
      });

      it('replaces selected date and time formats', function () {
        var data = moment.localeData(),
            date = data.longDateFormat('L'),
            time = data.longDateFormat('LTS');
        expect(date).toEqual(longDateFormat.L);
        expect(time).toEqual(longDateFormat.LTS);
      });
    });
  });
});
