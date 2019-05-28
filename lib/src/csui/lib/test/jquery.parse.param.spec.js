/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

// jQuery.parseParams 0.1.0
// https://gist.github.com/prantlf/061e3911cd450491f84aac40292b7e7c
//
// Copyright (c) 2015-2017 Ferdinand Prantl
// Licensed under the MIT license.

// [OT] Modifications done:
//
// * Replace module pattern csui AMD at the top and bottom of the file
// * Replace to.deep.equal from chai with custom toDeepEqual

// [OT] Declare a csui module
define(['csui/lib/jquery', 'csui/lib/underscore'], function ($, _) {
  'use strict';

  describe('jQuery.parseParams', function () {
    // [OT] Implement custom toDeepEqual
    beforeEach(function() {
      jasmine.addMatchers({
        toDeepEqual: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: _.isEqual(actual, expected)
              };
            }
          }
        }
      });
    });
    // [OT] Replace to.deep.equal with toDeepEqual below

    describe('returns empty object', function () {
      it('for undefined', function () {
        expect($.parseParams(undefined)).toDeepEqual({});
      });

      it('for null', function () {
        expect($.parseParams(null)).toDeepEqual({});
      });

      it('for empty string', function () {
        expect($.parseParams('')).toDeepEqual({});
      });

      it('for single question mark', function () {
        expect($.parseParams('?')).toDeepEqual({});
      });
    });

    describe('parses single parameter', function () {
      it('without value', function () {
        expect($.parseParams('a=')).toDeepEqual({a: ''});
      });

      it('with value', function () {
        expect($.parseParams('a=1')).toDeepEqual({a: '1'});
      });
    });

    describe('parses two parameters with different names', function () {
      it('without values', function () {
        expect($.parseParams('a=&b=')).toDeepEqual({a: '', b: ''});
      });

      it('with values', function () {
        expect($.parseParams('a=1&b=2')).toDeepEqual({a: '1', b: '2'});
      });
    });

    describe('parses two parameters with the same name', function () {
      it('without values', function () {
        expect($.parseParams('a=&a=')).toDeepEqual({a: ['', '']});
      });

      it('with values', function () {
        expect($.parseParams('a=1&a=2')).toDeepEqual({a: ['1', '2']});
      });
    });

    describe('supports URL encoding', function () {
      it('in parameter name', function () {
        expect($.parseParams('a%2F=1')).toDeepEqual({'a/': '1'});
      });

      it('in parameter value', function () {
        expect($.parseParams('a=%2F')).toDeepEqual({a: '/'});
      });

      it('with space as "%20"', function () {
        expect($.parseParams('a=%20')).toDeepEqual({a: ' '});
      });

      it('with space as "+"', function () {
        expect($.parseParams('a=+')).toDeepEqual({a: ' '});
      });
    });

    it('skips parameters without name', function () {
      expect($.parseParams('=1')).toDeepEqual({});
    });

    it('ignores leading question mark', function () {
      expect($.parseParams('?a=1')).toDeepEqual({a: '1'});
    });
  });
});