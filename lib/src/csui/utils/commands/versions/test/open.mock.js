/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery.mockjax'
], function (mockjax) {

  return {

    enable: function () {

      mockjax({
        url: '//server/otcs/cs/api/v1/contentauth?id=2001',
        responseText: {
          token: 'dummy'
        }
      });

    },

    disable: function () {
      mockjax.clear();
    }

  };

});
