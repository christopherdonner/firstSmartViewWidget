/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/utils/url'
], function (_, Url) {
  'use strict';

  var ServerAdaptorMixin = {
    mixin: function (prototype) {
      return _.extend(prototype, {
        makeServerAdaptor: function (options) {
          return this;
        },

        url: function () {
          var url   = this.connector.connection.url.replace('/v1', '/v2'),
              query = Url.combineQueryString(
                  this.getAdditionalResourcesUrlQuery(),
                  this.getResourceFieldsUrlQuery(),
                  this.getExpandableResourcesUrlQuery(),
                  this.getRequestedCommandsUrlQuery(),
                  this._getSubtypesUrlQuery()
              );
          url = Url.combine(url, '/members/accessed');
          return query ? url + '?' + query : url;
        },
    
        parse: function (response, options) {
          this.parseBrowsedState(response, options);
          this.columns && this.columns.resetColumnsV2(response, this.options);
          return this.parseBrowsedItems(response, options);
        },
    
        _getSubtypesUrlQuery: function () {
          var where_types = "";
    
          if (this.options.recentlyAccessedSubtypes) {
            for (var i = 0; i < this.options.recentlyAccessedSubtypes.length; i++) {
              where_types = where_types.concat("where_type=", this.options.recentlyAccessedSubtypes[i],
                  "&");
            }
          }
          return where_types;
        }

      });
    }
  };

  return ServerAdaptorMixin;
});
