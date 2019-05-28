/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery.mockjax'
], function (mockjax) {
  'use strict';

  var mocks = [];

  return {

    enable: function () {
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/draftprocesses'),
        type: 'POST',
        responseText: {
          success: true,
          results: {
            draftprocess_id: 4711
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
