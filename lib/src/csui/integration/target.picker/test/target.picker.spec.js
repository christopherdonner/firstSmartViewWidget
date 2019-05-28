/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/integration/target.picker/target.picker',
  './target.picker.mock.js'
], function ($, TargetPicker, TargetPickerMock) {
  "use strict";

  describe('TargetPicker', function () {

    beforeAll(function () {
      TargetPickerMock.enable();
    });

    afterAll(function () {
      TargetPickerMock.disable();
    });

    it('can be constructed', function () {
      var targetPicker = new TargetPicker();
      expect(targetPicker instanceof TargetPicker).toBeTruthy();
    });

    it('can get all parameters in the constructor', function (done) {
      var targetPicker = new TargetPicker({
            connection: {
              url: '//server/otcs/cs/api/v1',
              supportPath: '/support',
              session: {
                ticket: 'dummy'
              }
            }
          });

      targetPicker.show();
      setTimeout(function() {
        done();
      }, 2000);

    });

    it('can get all parameters in the show method', function (done) {
      var targetPicker = new TargetPicker();

      targetPicker.show({
        connection: {
          url: '//server/otcs/cs/api/v1',
          supportPath: '/support',
          session: {
            ticket: 'dummy'
          }
        }
      });
      setTimeout(function() {
        done();
      }, 2000);
    });

  });

});
