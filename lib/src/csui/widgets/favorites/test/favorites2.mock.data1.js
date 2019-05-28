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
        url: new RegExp('^//server/otcs/cs/api/v2/members/favorites/tabs.*'),
        responseTime: 0,
        responseText: {
          "results": [
            {"data": {"name": "first", "order": 1, "tab_id": 1}},
            {"data": {"name": "second", "order": 2, "tab_id": 2}},
            {"data": {"name": "third", "order": 3, "tab_id": 3}}
          ]
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
