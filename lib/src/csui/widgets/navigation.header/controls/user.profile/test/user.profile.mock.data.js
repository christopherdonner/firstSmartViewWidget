/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/lib/jquery.mockjax'], function ($, mockjax) {

  var DataManager = function DataManager() {
    },
    test1Mocks = [],
    test2Mocks = [],
    test3Mocks = [],
    test4Mocks = [];


  DataManager.test1 = {

    enable: function () {
      test1Mocks.push(mockjax({
        url: new RegExp('^//server/otcs1/cs/api/v1/auth(.*)$'),
        responseText: {
          "data": {
            "id": 1000,
            "name": "userName",
            "first_name": 'fstName',
            "last_name": 'lstName',
            ticket: '1234567890'
          }
        }
      }));
      test1Mocks.push(mockjax({
        url: new RegExp('^//server/otcs1/cs/api/v1/searchbar(.*)$'),
        urlParams: ['enterprise_slices'],
        responseTime: 5,
        contentType: 'application/json',
        dataType: 'json',
        responseText: {
          "options": {
            "fields": {
              "slice": {
                "optionLabels": ['Enterprise Workspace', 'Enterprise Workspace [All versions]']
              }
            }
          },
          "schema": {
            "properties": {
              "slice": {
                "enum": [19760, 19761]
              }
            }
          }
        },

      }));

    },

    disable: function () {
      var mock;
      while ((mock = test1Mocks.pop()) != null) {
        mockjax.clear(mock);
      }
    }

  };

  DataManager.test2 = {

    enable: function () {
      test2Mocks.push(mockjax({
        url: new RegExp('^//server/otcs2/cs/api/v1/auth(.*)$'),
        responseText: {
          "data": {
            "id": 1000,
            "name": "userName",
            "first_name": 'fstName',
            "last_name": '',
            ticket: '1234567890'
          }
        }
      }));
    },

    disable: function () {
      var mock;
      while ((mock = test2Mocks.pop()) != null) {
        mockjax.clear(mock);
      }
    }

  };

  DataManager.test3 = {

    enable: function () {
      test3Mocks.push(mockjax({
        url: new RegExp('^//server/otcs3/cs/api/v1/auth(.*)$'),
        responseText: {
          "data": {
            "id": 1000,
            "name": "userName",
            "first_name": '',
            "last_name": 'lstName',
            ticket: '1234567890'
          }
        }
      }));
    },

    disable: function () {
      var mock;
      while ((mock = test3Mocks.pop()) != null) {
        mockjax.clear(mock);
      }
    }

  };

  DataManager.test4 = {

    enable: function () {
      test4Mocks.push(mockjax({
        url: new RegExp('^//server/otcs4/cs/api/v1/auth(.*)$'),
        responseText: {
          "data": {
            "id": 1000,
            "name": "userName",
            "first_name": '',
            "last_name": '',
            ticket: '1234567890'
          }
        }
      }));
    },

    disable: function () {
      var mock;
      while ((mock = test4Mocks.pop()) != null) {
        mockjax.clear(mock);
      }
    }

  };

  DataManager.mockData = [
    {
      fstName: 'fstName',
      lstName: 'lstName',
      userName: 'userName',
      status: 'start',
      url: '//server/otcs1/cs/api/v1/auth',
      test: DataManager.test1
    },

    {
      fstName: 'fstName',
      lstName: '',
      userName: 'userName',
      status: 'start',
      url: '//server/otcs2/cs/api/v1/auth',
      test: DataManager.test2
    },
    {
      fstName: '',
      lstName: 'lstName',
      userName: 'userName',
      status: 'start',
      url: '//server/otcs3/cs/api/v1/auth',
      test: DataManager.test3
    },
    {
      fstName: '',
      lstName: '',
      userName: 'userName',
      status: 'start',
      url: '//server/otcs4/cs/api/v1/auth',
      test: DataManager.test4
    }

  ];


  return DataManager;
});
