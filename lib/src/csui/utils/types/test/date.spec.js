/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'require', 'csui/lib/moment', 'csui/utils/types/date'
], function (require, moment, date) {
  'use strict';

  function switchToUnknownServerTimeZone(done) {
    window.csui.requirejs.config({
      config: {
        'csui/utils/types/date': {
          formatIsoDateTimeInUtc: false,
          formatIsoDateTimeInTimeZone: null
        }
      }
    });
    window.csui.requirejs.undef('csui/utils/types/date');

    require(['csui/utils/types/date'], function (date) {
      this.testDate = date;
      done();
    }.bind(this));
  }

  function switchToUTC(done) {
    window.csui.requirejs.config({
      config: {
        'csui/utils/types/date': {
          formatIsoDateTimeInUtc: true,
          formatIsoDateTimeInTimeZone: null
        }
      }
    });
    window.csui.requirejs.undef('csui/utils/types/date');
    require(['csui/utils/types/date'], done);
  }

  function switchToGermanTimeZone(done) {
    window.csui.requirejs.config({
      config: {
        'csui/utils/types/date': {
          formatIsoDateTimeInUtc: false,
          formatIsoDateTimeInTimeZone: 'Europe/Berlin'
        }
      }
    });
    window.csui.requirejs.undef('csui/utils/types/date');

    require(['csui/utils/types/date'], function (date) {
      this.testDate = date;
      done();
    }.bind(this));
  }

  describe('date', function () {
    beforeAll(function () {
        this.dateFormat = moment.localeData().longDateFormat('LTS');
    });

    describe('serializeDateTime', function () {
      describe('when in the UTC mode', function () {
        describe('when passed a date', function () {
          beforeAll(function () {
            this.date = new Date('2017-09-10T13:51:14Z');
          });

          it('returns a date/time format in UTC by default', function () {
            var string = date.serializeDateTime(this.date);
            expect(string).toEqual('2017-09-10T13:51:14Z');
          });
        });

        describe('when passed a string', function () {
          beforeAll(function () {
            this.date = moment('2017-09-10T13:51:14Z').format('L LTS');
          });

          it('returns a date/time format in UTC by default', function () {
            var string = date.serializeDateTime(this.date),
                expected = this.dateFormat === 'LT' ?
                  '2017-09-10T13:51:00Z' : '2017-09-10T13:51:14Z';
            expect(string).toEqual(expected);
          });
        });
      });

      describe('when in a known server time zone', function () {
        if (!window.require) {
          return it('Modules cannot be unloaded in the release mode.');
        }

        beforeAll(switchToGermanTimeZone, 5000);

        afterAll(switchToUTC, 5000);

        describe('when passed a date', function () {
          beforeAll(function () {
            this.date = new Date('2017-09-10T13:51:14Z');
          });

          it('returns a date/time in the server time zone', function () {
            var string = this.testDate.serializeDateTime(this.date);
            expect(string).toEqual('2017-09-10T15:51:14');
          });
        });

        describe('when passed a string', function () {
          beforeAll(function () {
            this.date = moment('2017-09-10T13:51:14Z').format('L LTS');
          });

          it('returns a date/time format in the server time zone', function () {
            var string = this.testDate.serializeDateTime(this.date),
                expected = this.dateFormat === 'LT' ?
                  '2017-09-10T15:51:00' : '2017-09-10T15:51:14';
            expect(string).toEqual(expected);
          });
        });
      });

      describe('when in the unknown server time zone', function () {
        if (!window.require) {
          return it('Modules cannot be unloaded in the release mode.');
        }

        beforeAll(switchToUnknownServerTimeZone, 5000);

        afterAll(switchToUTC, 5000);

        describe('when passed a date', function () {
          beforeAll(function () {
            this.date = new Date('2017-09-10T13:51:14');
          });

          it('returns a date/time format with an unchanged value', function () {
            var string = this.testDate.serializeDateTime(this.date);
            expect(string).toEqual('2017-09-10T13:51:14');
          });
        });

        describe('when passed a string', function () {
          beforeAll(function () {
            this.date = moment('2017-09-10T13:51:14').format('L LTS');
          });

          it('returns a date/time format with an unchanged value', function () {
            var string = this.testDate.serializeDateTime(this.date),
                expected = this.dateFormat === 'LT' ?
                  '2017-09-10T13:51:00' : '2017-09-10T13:51:14';
            expect(string).toEqual(expected);
          });
        });
      });
    });

    describe('serializeDate', function () {
      describe('when in the UTC mode', function () {
        describe('when passed a date', function () {
          beforeAll(function () {
            this.date = new Date('2017-09-10T13:51:14Z');
          });

          it('returns a date-only format', function () {
            var string = date.serializeDate(this.date);
            expect(string).toEqual('2017-09-10');
          });
        });

        describe('when passed a string', function () {
          beforeAll(function () {
            this.date = moment('2017-09-10T13:51:14Z').format('L');
          });

          it('returns a date-only format', function () {
            var string = date.serializeDate(this.date);
            expect(string).toEqual('2017-09-10');
          });
        });
      });

      describe('when in the unknown server time zone', function () {
        if (!window.require) {
          return it('Modules cannot be unloaded in the release mode.');
        }

        beforeAll(switchToUnknownServerTimeZone, 5000);

        afterAll(switchToUTC, 5000);

        describe('when passed a date', function () {
          beforeAll(function () {
            this.date = new Date('2017-09-10T13:51:14');
          });

          it('returns a date-only format', function () {
            var string = this.testDate.serializeDate(this.date);
            expect(string).toEqual('2017-09-10');
          });
        });

        describe('when passed a string', function () {
          beforeAll(function () {
            this.date = moment('2017-09-10T13:51:14Z').format('L');
          });

          it('returns a date-only format', function () {
            var string = this.testDate.serializeDate(this.date);
            expect(string).toEqual('2017-09-10');
          });
        });
      });
    });
  });
});
