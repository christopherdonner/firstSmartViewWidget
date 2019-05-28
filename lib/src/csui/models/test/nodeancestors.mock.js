/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery.mockjax', 'json!./nodeancestors.data.json'
], function (mockjax, mocked) {

  return {

    enable: function () {

      mockjax({
        url: '//server/otcs/cs/api/v1/nodes/2000/ancestors',
        responseText: {
          ancestors: mocked.ancestors['2000']
        }
      });

    },

    disable: function () {
      mockjax.clear();
    }

  };

});
