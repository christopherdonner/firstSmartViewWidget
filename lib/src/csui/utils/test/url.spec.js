/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/utils/url'], function (Url) {
  'use strict';

  describe('Url', function () {
    beforeAll(function () {
      this.url = new Url('//server/otcs/cs/api/v1');
    });

    describe('getCgiScript', function () {
      it('returns the path without the API suffix', function () {
        expect(this.url.getCgiScript()).toEqual('//server/otcs/cs');
      });

      it('works if the path ends with slash', function () {
        var url = new Url('//server/otcs/cs/api/v1/');
        expect(url.getCgiScript()).toEqual('//server/otcs/cs');
      });

      it('works if the path does not start with two other parts', function () {
        var url = new Url('//server/test/api/v1');
        expect(url.getCgiScript()).toEqual('//server/test');
      });

      it('always returns an absolute URL', function () {
        var url = new Url('/otcs/cs/api/v1/');
        expect(url.getCgiScript()).toEqual(window.location.origin + '/otcs/cs');
      });
    });

    describe('getApiBase', function () {
      it('appends the trailing slash', function () {
        var url = this.url.getApiBase();
        expect(url.charAt(url.length - 1)).toEqual('/');
      });

      it('returns the v1 URL base by default', function () {
        expect(this.url.getApiBase()).toEqual('//server/otcs/cs/api/v1/');
      });

      it('returns the v2 URL if requested by "v2"', function () {
        expect(this.url.getApiBase('v2')).toEqual('//server/otcs/cs/api/v2/');
      });

      it('returns the v2 URL if requested by 2', function () {
        expect(this.url.getApiBase(2)).toEqual('//server/otcs/cs/api/v2/');
      });

      it('works if the path ends with slash', function () {
        var url = new Url('//server/otcs/cs/api/v1/');
        expect(url.getApiBase()).toEqual('//server/otcs/cs/api/v1/');
      });

      it('works if the path does not start with two other parts', function () {
        var url = new Url('//server/test/api/v1');
        expect(url.getApiBase()).toEqual('//server/test/api/v1/');
      });
    });
  });
});
