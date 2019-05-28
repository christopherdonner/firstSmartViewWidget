/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery.mockjax'], function (mockjax) {

  var DataManager = function DataManager() {
  };
  var mocks = [];

  DataManager.enable = function () {

    mocks.push(mockjax({
      url: new RegExp("^//server/otcs/cs/api/v1/validation/nodes(.*)$"),
      responseTime: 0,
      type: 'POST',
      contentType: 'application/json',
      dataType: 'json',

      response: function (settings) {
        this.responseText = { error: 'MyErr: call failed' };
        this.status = 400;            // error
      }
    }));
  };

  DataManager.disable = function () {
    var mock;
    while ((mock = mocks.pop()) != null) {
      mockjax.clear(mock);
    }
  };

  return DataManager;
});

