/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery.mockjax'], function (mockjax) {
  'use strict';

  var mocks = [];

  return {

    enable: function () {

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/2001(\\?.*)?$'),
        responseText: {
          id: 2001,
          name: 'Test'
        }
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v1/nodes/2001/versions'),
        responseText: {
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
