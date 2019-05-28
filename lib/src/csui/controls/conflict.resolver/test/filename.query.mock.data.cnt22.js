/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery.mockjax'], function (mockjax) {
  var DataManager = function DataManager() {
  };
  var mocks = [];
  var id = 1;

  DataManager.enable = function () {
    mocks.push(mockjax({
      url: new RegExp('^//server/otcs/cs/api/v1/validation/nodes(.*)$'),
      responseTime: 0,
      type: 'POST',
      contentType: 'application/json',
      dataType: 'json',

      response: function (settings) {
        var retData = [];

        this.responseText = {};
        this.status = 200;

        var numfiles = 22;      // 22 files
        for (var i = 0; i < numfiles; i++) {
          if ((i % 2) > 0) {
            retData.push({
              name: 'file ' + i,
              id: id++
            });
          }
        }
        this.responseText.results = retData;
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
