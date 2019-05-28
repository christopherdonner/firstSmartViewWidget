/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery.mockjax'], function (mockjax) {

  var mocks = [];

  return {

    enable: function () {
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/members/favorites?metadata', responseTime: 0,
        responseText: [
          {id: '21', name: 'Customers', perspective: 'browse'},
          {id: '22', name: 'Orders', perspective: 'browse'},
          {id: '23', name: 'Vendors', perspective: 'browse'}
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

});
