/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery.mockjax'], function (mockjax) {

  var mocks = [];

  return {

    enable: function () {
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/auth',
        responseTime: 5,
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',

        response: function (settings) {

          this.status = 400;
          this.responseText = { error: 'Authentication failed' };

          if (settings.data.username === 'Admin'
            && settings.data.password === 'livelink') {

            this.status = 200;
            this.responseText = {
              ticket: '1234567890'
            };
          }
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

