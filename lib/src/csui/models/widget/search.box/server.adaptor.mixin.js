/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/url'
], function (_, $, Url) {
  'use strict';

  var ServerAdaptorMixin = {

    mixin: function (prototype) {

      return _.extend(prototype, {
        makeServerAdaptor: function (options) {
          return this;
        },

        url: function () {
          return Url.combine(this.connector.connection.url, "searchbar?enterprise_slices=true");
        },

        parse: function (response, options) {
          var sliceLabels = response.options.fields.slice.optionLabels,
            sliceIds = response.schema.properties.slice.enum,
            returnData = {};
          returnData.slices = [];
          $.each(sliceIds, function (sliceIdx) {
            returnData.slices.push({
              sliceId: sliceIds[sliceIdx],
              sliceDisplayName: sliceLabels[sliceIdx]
            });
          });
          return returnData;
        }

      });
    }
  };

  return ServerAdaptorMixin;
});
