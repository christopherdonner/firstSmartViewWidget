/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery.mockjax'], function (mockjax) {

  var mocks = [];

  return {

    enable: function () {
      mocks.push(mockjax({
        url: '//server/cgi/cs.exe/api/v1/nodes/18588/output?format=webreport',
        dataType: 'html',
        proxy: './mock.table.html'
      }));
      mocks.push(mockjax({
        url: '//server/cgi/cs.exe/api/v1/nodes/22550/output?format=webreport&myparm1=val1&myparm2=val2',
        dataType: 'html',
        proxy: './mock.text.html'
      }));
      mocks.push(mockjax({
        url: '//server/cgi/cs.exe/api/v1/auth',
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
      while ((mock = mocks.pop())) {
        mockjax.clear(mock);
      }
    }

  };

});
