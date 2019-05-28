/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery.mockjax'], function (mockjax) {
  'use strict';

  var mocks = [];

  return {
    enable: function () {
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/test/1',
        responseText: {
          name: 'test'
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/test/2',
        responseText: {
          type: 1
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/test/3',
        status: 400,
        statusText: 'Bad Request',
        responseText: {
          failure: true
        }
      }));
    },

    disable: function () {
      var mock;
      while ((mock = mocks.pop()) != null) {
        mockjax.clear(mock);
      }
    }
  };
});
