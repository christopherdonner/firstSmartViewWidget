/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore'
], function (_) {
  'use strict';

  var VersionsV2ResponseMixin = {

    mixin: function (prototype) {
      return _.extend(prototype, {

        makeVersionableV2Response: function (options) {
          return this;
        },

        parseVersionsResponse: function (response) {
          if (!!response.results && !!response.results.data) {
            return response.results.data.versions;
          }
          return response;
        }

      });
    }
  };
  return VersionsV2ResponseMixin;
});
