/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery.mockjax'
], function (_, mockjax) {
  'use strict';

  var mocks = [];

  var allChildren = [
    {id: 1, name: 'first', type: 1},
    {id: 2, name: 'second', type: 1},
    {id: 3, name: 'third', type: 2},
    {id: 4, name: 'fourth', type: 2},
    {id: 5, name: 'fifth', type: 3},
    {id: 6, name: 'sixth', type: 3},
    {id: 7, name: 'seventh', type: 3}
  ];

  var node2003Collection = {
    data: [],
    limit: 30,
    page: 1,
    page_total: 0,
    range_max: 0,
    range_min: 1,
    sort: "asc_name",
    total_count: 0,
    where_facet: [],
    where_name: "",
    where_type: []
  };

  return {

    enable: function () {
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v1/nodes/2000/nodes(\\?.*)?$'),
        urlParams: ['query'],
        response: function (settings) {
          var query = (settings.urlParams.query || '').substring(1).split('&'),
              parameters = _.chain(query)
                  .filter(function (parameter) {
                    return parameter.indexOf('where_') < 0;
                  })
                  .reduce(function (result, parameter) {
                    var parts = parameter.split('=');
                    result[parts[0]] = parts[1];
                    return result;
                  }, {})
                  .value(),
              pageSize = +parameters.limit || 0,
              pageIndex = +parameters.page || 1,
              sortBy = parameters.sort || '',
              filters = _.chain(query)
                  .filter(function (parameter) {
                    return parameter.indexOf('where_') === 0;
                  })
                  .map(function (parameter) {
                    var parts = parameter.split('=');
                    return {
                      name: parts[0].substring(6),
                      value: parts[1]
                    };
                  })
                  .reduce(function (result, filter) {
                    var value = result[filter.name];
                    if (value === undefined) {
                      result[filter.name] = filter.value;
                    } else {
                      if (_.isArray(value)) {
                        value.push(filter.value);
                      } else {
                        result[filter.name] = [value, filter.value];
                      }
                    }
                    return result;
                  }, {})
                  .value(),
              filteredChildren = _.isEmpty(filters) ? _.clone(allChildren) :
                                 _.filter(allChildren, function (node) {
                                   return _.all(filters, function (value, name) {
                                     var hay = node[name].toString();
                                     if (_.isArray(value)) {
                                       return _.any(value, function (value) {
                                         return hay.indexOf(value) >= 0;
                                       });
                                     }
                                     return hay.indexOf(value) >= 0;
                                   });
                                 }),
              sortProperty = sortBy && sortBy.substring(sortBy.indexOf('_') + 1),
              sortDirection = sortBy && sortBy.substring(0, sortBy.indexOf('_')),
              sortAscending = sortDirection === 'asc' ? 1 : -1,
              sortedChildren = sortBy ? filteredChildren.sort(function (left, right) {
                                        left = left[sortProperty];
                                        right = right[sortProperty];
                                        if (left != right) {
                                          if (left > right || right === void 0) {
                                            return 1 * sortAscending;
                                          }
                                          if (left < right || left === void 0) {
                                            return -1 * sortAscending;
                                          }
                                        }
                                        return 0;
                                      }) : filteredChildren,
              firstIndex = (pageIndex - 1) * pageSize,
              lastIndex = pageSize ? firstIndex + pageSize : sortedChildren.length,
              limitedChildren = sortedChildren.slice(firstIndex, lastIndex);
          this.responseText = {
            data: limitedChildren,
            page: pageIndex,
            limit: pageSize,
            total_count: allChildren.length
          };
        }
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/members/favorites(\\?.*)?$'),
        urlParams: ['query'],
        responseText: {
          results: allChildren
        }
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v1/nodes/2003/nodes(\\?.*)?$'),
        urlParams: ['query'],
        responseText: node2003Collection
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
