/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery.mockjax'], function (mockjax) {

  var mocks = [];

  return {

    enable: function () {
      mocks.push(mockjax({
        url: new RegExp(
            '^//server/otcs/cs/api/v2/members/favorites\\?(.*)?$'
        ),
        responseTime: 0,
        responseText: {
          "results": []
        }
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/members/favorites/tabs?fields=properties&sort=order',
        responseTime: 0,
        responseText: {
          "results": []
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
