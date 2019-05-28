/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery.mockjax'], function (mockjax) {

    var mocks = [];

    return {

      enable: function () {

        mocks.push(mockjax({
          url: '//server/otcs/cs/api/v1/auth',
          responseText: {
            "data": {
              "id": 1000,
              "name": "Admin"
            }
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
  }
);
