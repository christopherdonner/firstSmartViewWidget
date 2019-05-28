/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'require', 'csui/lib/underscore', 'csui/utils/types/number', 'i18n'
], function (require, _, number, i18n) {
  'use strict';

  function switchToGerman(done) {
    this.originalLocale = i18n.settings.locale;
    window.csui.requirejs.config({
      config: {
        i18n: {locale: 'de'}
      }
    });
    window.csui.requirejs.undef('i18n');
    window.csui.requirejs.undef('csui/lib/numeral');
    window.csui.requirejs.undef('csui/utils/types/number');

    require(['i18n', 'csui/utils/types/number'], function (i18n, number) {
      this.testNumber = number;
      expect(i18n.settings.locale).toEqual('de');
      done();
    }.bind(this));
  }

  function switchToOriginal(done) {
    window.csui.requirejs.config({
      config: {
        i18n: {locale: this.originalLocale}
      }
    });
    window.csui.requirejs.undef('i18n');
    window.csui.requirejs.undef('csui/lib/numeral');
    window.csui.requirejs.undef('csui/utils/types/number');
    require(['csui/utils/types/number', 'csui/lib/numeral'], done);
  }

  describe('number', function () {
    describe('formatInteger', function () {
      it('renders zero for an empty input', function () {
        expect(number.formatInteger(undefined)).toEqual('0');
        expect(number.formatInteger(null)).toEqual('0');
      });

      it('renders zero for an invalid input', function () {
        expect(number.formatInteger('')).toEqual('0');
        expect(number.formatInteger('a')).toEqual('0');
      });

      it('uses English formatting by default', function () {
        expect(number.formatInteger(12345)).toEqual('12,345');
      });

      it('supports negative numbers', function () {
        expect(number.formatInteger(-6789)).toEqual('-6,789');
      });

      it('rounds real numbers to integers', function () {
        expect(number.formatInteger(12.345)).toEqual('12');
        expect(number.formatInteger(67.89)).toEqual('68');
        expect(number.formatInteger(-12.345)).toEqual('-12');
        expect(number.formatInteger(-67.89)).toEqual('-68');
      });

      it('accepts the number as a string too', function () {
        expect(number.formatInteger('12345')).toEqual('12,345');
        expect(number.formatInteger('-6789')).toEqual('-6,789');
      });

      it('recognizes the thousands-delimiter when parsing a string input', function () {
        expect(number.formatInteger('12,345')).toEqual('12,345');
      });

      it('recognizes the decimal point when parsing a string input', function () {
        expect(number.formatInteger('12.345')).toEqual('12');
      });

      describe('when initialized with the German locale', function () {
        if (!window.require) {
          return it('Modules cannot be unloaded in the release mode.');
        }

        if (!_.contains(navigator.languages, 'de')) {
          it('cannot be tested without  German locale ("de") enabled in web browser settings');
          return;
        }

        beforeAll(switchToGerman, 5000);

        afterAll(switchToOriginal, 5000);

        it('uses German formatting', function () {
          expect(this.testNumber.formatInteger(12345)).toEqual('12 345');
        });

        it('recognizes the thousands-delimiter when parsing a string input', function () {
          expect(this.testNumber.formatInteger('12 345')).toEqual('12 345');
        });

        it('recognizes the decimal point when parsing a string input', function () {
          expect(this.testNumber.formatInteger('12,345')).toEqual('12');
        });
      });
    });
  });
});
