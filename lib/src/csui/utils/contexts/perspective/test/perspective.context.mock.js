/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery.mockjax'], function (mockjax) {

  var mocks = [];

  return {

    enable: function () {

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v1/auth(\\?.*)?$'),
        responseText: {
          "data": {
            "id": 1000,
            "name": "Admin"
          },
          "perspective": {
            "landing.page": true
          }
        }
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/50(\\?.*)?$'),
        responseText: {
          "data": {
            "id": 50,
            "name": "Home",
            "container": true
          },
          "perspective": {
            "node.50": true
          }
        }
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/60(\\?.*)?$'),
        responseText: {
          "data": {
            "id": 60,
            "name": "Work",
            "container": true
          },
          "perspective": {
            "node.50": true
          }
        }
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/70(\\?.*)?$'),
        responseText: {
          "data": {
            "id": 70,
            "name": "Work",
            "container": true
          },
          "perspective": {
            "node.70": true
          }
        }
      }));

    },

    enableErrors: function () {

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/.*$'),
        status: 500,
        statusText: 'Internal Server Error',
        responseText: {
          error: 'Server is down.'
        }
      }));

    },

    disable: function () {
      var mock;
      while ((mock = mocks.pop()) != null) {
        mockjax.clear(mock);
      }
    },
    clear: function () {
      mockjax.clear();
    }

  };

});
