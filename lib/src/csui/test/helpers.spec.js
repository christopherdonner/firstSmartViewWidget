/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(function () {
  'use strict';

  describe('Global helpers: csui.*', function () {
    it('getVersion returns the full version number', function () {
      expect(csui.getVersion()).toMatch(/^\d+\.\d+\.\d+\.\d+$/);
    });

    it('getExtensionModules returns information about csui', function (done) {
      csui.printExtensionModules();
      csui.getExtensionModules(function (serverModules) {
        var csui = serverModules.filter(function (module) {
          return module.id === 'csui';
        });
        expect(csui.length).toEqual(1);
        expect(csui[0].version).toBeTruthy();
        done();
      });
    });

    describe('setLanguage', function () {
      beforeAll(function () {
        window.csui.require.config({
          config: {
            i18n: {}
          }
        });
        this.i18n = csui.require.s.contexts._.config.config.i18n;
      });

      afterAll(function () {
        window.csui.require.config({
          config: {
            i18n: {
              locale: 'root',
              rtl: false
            }
          }
        });
      });

      it('supports single parameter supplying locale', function () {
        csui.setLanguage('en-us');
        expect(this.i18n.locale).toEqual('en-us');
      });

      it('supports two parameters supplying language and country',
          function () {
            csui.setLanguage('en', 'us');
            expect(this.i18n.locale).toEqual('en-us');
          });

      it('supports an object supplying locale as a property', function () {
        csui.setLanguage({locale: 'en-us'});
        expect(this.i18n.locale).toEqual('en-us');
      });

      it('normalizes the single parameter supplying locale', function () {
        csui.setLanguage('EN_US');
        expect(this.i18n.locale).toEqual('en-us');
      });

      it('normalizes the two parameters supplying language and country',
          function () {
            csui.setLanguage('EN', 'US');
            expect(this.i18n.locale).toEqual('en-us');
          });

      it('normalizes object supplying locale as a property', function () {
        csui.setLanguage({locale: 'EN_US'});
        expect(this.i18n.locale).toEqual('en-us');
      });

      it('sets the RTL mode to false by default for an LTR locale',
          function () {
            csui.setLanguage('en');
            expect(this.i18n.rtl).toBe(false);
          });

      it('sets the RTL mode to true by default for an RTL locale',
          function () {
            csui.setLanguage('ar');
            expect(this.i18n.rtl).toBe(true);
          });

      it('leaves the RTL mode intact if set explicitly as a parameter',
          function () {
            csui.setLanguage({
              locale: 'en',
              rtl: true
            });
            expect(this.i18n.rtl).toBe(true);
          });
    });

    describe('needsRTL', function () {
      it('returns false for LTR languages', function () {
        expect(csui.needsRTL('af')).toBe(false);
        expect(csui.needsRTL('en')).toBe(false);
        expect(csui.needsRTL('en-US')).toBe(false);
      });

      it('returns true for RTL languages', function () {
        expect(csui.needsRTL('ar')).toBe(true);
        expect(csui.needsRTL('ar-EG')).toBe(true);
        expect(csui.needsRTL('fa')).toBe(true);
        expect(csui.needsRTL('he')).toBe(true);
        expect(csui.needsRTL('ur')).toBe(true);
        expect(csui.needsRTL('yi')).toBe(true);
      });
    });

    describe('onReady', function () {
      it('loads fixed modules for compatibility', function (done) {
        csui.onReady(function () {
          expect(typeof csui.Connector === 'function').toBeTruthy();
          expect(typeof csui.util === 'object').toBeTruthy();
          expect(typeof csui.util.Connector === 'function').toBeTruthy();
          expect(typeof csui.FolderBrowserWidget === 'function').toBeTruthy();
          expect(typeof csui.widget === 'object').toBeTruthy();
          expect(typeof csui.widget.FolderBrowserWidget === 'function').toBeTruthy();
          done();
        });
      });
    });

    describe('onReady2', function () {
      it('loads a specified module', function (done) {
        csui.onReady2(['csui/utils/connector'], function (Connector) {
          expect(typeof Connector === 'function').toBeTruthy();
          done();
        });
      });
    });
  });
});
