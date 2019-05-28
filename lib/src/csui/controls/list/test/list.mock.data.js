/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery.mockjax'], function (mockjax) {

  var DataManager = function DataManager() {},
      mocks       = [];

  DataManager.test = {

    enable: function () {

      mocks.push(mockjax({
        url: '/api/v1/list', responseTime: 0,
        responseText: [
          {title: "Hello 1"},
          {title: "Hello 2"}
        ]
      }));

    },

    disable: function () {
      var mock;
      while ((mock = mocks.pop()) != null) {
        mockjax.clear(mock);
      }
    }

  };

  return DataManager;

});
