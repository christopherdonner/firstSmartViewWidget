/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore'
], function (_) {

  var BrowsableV1ResponseMixin = {

    mixin: function (prototype) {
      return _.extend(prototype, {

        makeBrowsableV1Response: function (options) {
          return this;
        },

        parseBrowsedState: function (response, options) {
          if (response.page) {
            this.actualSkipCount = (response.page - 1) * (response.limit || 0);
          }
          var totalCount = response.total_count ? response.total_count : 0;
          this.totalCount = totalCount;
          this.filteredCount = response.filtered_count || totalCount;
        },

        parseBrowsedItems: function (response, options) {
          return response.data;
        }

      });
    }

  };

  return BrowsableV1ResponseMixin;

});
