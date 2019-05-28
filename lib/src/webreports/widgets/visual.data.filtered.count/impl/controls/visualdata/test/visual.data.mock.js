/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery.mockjax'], function (mockjax) {

  var mocks = [];

  return {

    enable: function () {
      mocks.push(mockjax({
        url: '//server/cgi/cs.exe/api/v1/nodes/218890/output?format=webreport*',
        dataType: 'html',
        proxy: './mock.animals.json'
      }));
      mocks.push(mockjax({
        url: '//server/cgi/cs.exe/api/v1/nodes/239645/output?format=webreport*',
        dataType: 'html',
        proxy: './mock.doctypes.json'
      }));
      mocks.push(mockjax({
        url: '//server/cgi/cs.exe/api/v1/nodes/255548/output?format=webreport*',
        dataType: 'html',
        proxy: './mock.docsize.json'
      }));
      mocks.push(mockjax({
        url: '//server/cgi/cs.exe/api/v1/nodes/255591/output?format=webreport*',
        dataType: 'html',
        proxy: './mock.audit.json'
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

