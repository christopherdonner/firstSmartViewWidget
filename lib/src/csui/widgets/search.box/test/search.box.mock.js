/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery.mockjax'
], function (_, mockjax) {

  var mocks = [];

  return {

    enable: function () {
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v1/searchbar(.*)$'),
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
      while ((mock = mocks.pop()) != null) {
        mockjax.clear(mock);
      }
    }

  };

});
