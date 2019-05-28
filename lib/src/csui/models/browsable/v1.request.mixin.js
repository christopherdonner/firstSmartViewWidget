/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery', 'csui/utils/url'
], function (_, $, Url) {

  var BrowsableV1RequestMixin = {

    mixin: function (prototype) {
      return _.extend(prototype, {

        makeBrowsableV1Request: function (options) {
          return this;
        },

        getBrowsableUrlQuery: function () {
          var query = {};
          var limit = this.topCount || 0;
          if (limit) {
            query.limit = limit;
            query.page = Math.floor((this.skipCount || 0) / limit) + 1;
          }
          if (this.orderBy) {
            var first = this.orderBy.split(',')[0].split(' ');
            query.sort = (first[1] || 'asc') + '_' + first[0];
          }
          query = $.param(query);
          if (!$.isEmptyObject(this.filters)) {
            for (var name in this.filters) {
              if (_.has(this.filters, name)) {
                var value = makeFilterValue(this.filters[name], name);
                if (value !== undefined) {
                  if (query) {
                    query += '&';
                  }
                  query += value;
                }
              }
            }
          }
          return query;
        }

      });
    }

  };

  function makeFilterValue(value, name) {
    if (value !== undefined && value !== null && value !== "") {
      if ($.isArray(value)) {
        value = Url.makeMultivalueParameter("where_" + name, value);
      }
      else {
        value = "where_" + name + "=" + encodeURIComponent(value.toString());
      }
      if (value.length > 0) {
        return value;
      }
    }
  }

  return BrowsableV1RequestMixin;

});
