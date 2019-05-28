/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery.mockjax'], function (mockjax) {
  'use strict';

  var mocks = [];

  return {
    enable: function () {
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v1/auth(.*)$'),
        responseText: {
          "data": {
            first_name: 'Admin'
          }
        }
      }));
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v1/nodes/2001*'),
        responseText: { }
      }));
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/2001*'),
        responseText: { }
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
