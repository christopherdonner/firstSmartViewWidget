/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery.mockjax',
  'csui/lib/jquery.parse.param', 'json!./mock.data.json',
  'json!./landing.page.json', 'json!./default.container.json'
], function (_, mockjax, parseParam, mockData,
    landingPagePerspective, defaultContainerPerspective) {
  'use strict';

  var users = mockData.users,
      nodeMetadata = mockData.nodeMetadata,
      nodeColumns = mockData.nodeColumns,
      nodes = mockData.nodes;
  _.each(nodes, function (node) {
    if (_.contains([0, 141, 142, 202], node.type)) {
      node.container = true;
      node.size = node.container_size = _.reduce(nodes, function (result, child) {
        if (child.parent_id === node.id) {
          ++result;
        }
        return result;
      }, 0);
    } else if (node.type === 144) {
      node.file_size = node.size;
    }
  });
  _.each(nodes, function (node) {
    if (node.type === 1 || node.type === 2) {
      var original = nodes[node.original_id];
      original && (node.original_id = node.original_id = original);
    }
    if (node.parent_id > 0) {
      node.parent_id = nodes[node.parent_id];
    }
    if (node.create_user_id > 0) {
      node.create_user_id = users[node.create_user_id];
    }
  });

  function getV2Node(node) {
    return {
      actions: getNodeActions(node),
      data: {
        columns: node.container && nodeColumns,
        properties: node
      },
      metadata: {
        properties: nodeMetadata
      }
    };
  }

  function getNodeActions(node) {
    return _.chain(node.actions || [])
            .reduce(function (result, action) {
              result[action.signature] = {};
              return result;
            }, {})
            .value();
  }

  var mocks = [];

  return {
    enable: function () {
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v1/auth(\\?.*)?$'),
        responseText: {
          data: users['1000'],
          perspective: landingPagePerspective
        }
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/actions(?:\\?(.*))?$'),
        urlParams: ['query'], // ids, actions
        response: function (settings) {
          var parameters = parseParam(settings.urlParams.query),
              filteredNodes = _.filter(nodes, function (node) {
                return _.contains(parameters.ids, node.id.toString());
              });
          this.responseText = {
            results: _.reduce(filteredNodes, function (results, node) {
              if (node) {
                results[node.id] = {
                  data: _.reduce(node.actions, function (result, action) {
                    result[action.signature] = {
                      name: action.name
                    };
                    return result;
                  }, {})
                };
              }
              return results;
            }, {})
          };
        }
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/(v1|v2)/(node|volume)s/([^/?]+)(?:\\?(.*))?$'),
        urlParams: ['version', 'resource', 'nodeIdOrType', 'query'], // perspective, expand
        response: function (settings) {
          var resource = settings.urlParams.resource,
              nodeIdOrType = settings.urlParams.nodeIdOrType,
              nodeId = resource === 'node' ? nodeIdOrType :
                       nodeIdOrType === '141' ? '2000' :
                       nodeIdOrType === '142' ? '2003' :
                       null,
              node = nodes[nodeId];
          this.responseText = {
            data: node,
            perspective: defaultContainerPerspective
          };
        }
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/([^/]+)/nodes(?:\\?(.*))?$'),
        urlParams: ['nodeId', 'query'],
        response: function (settings) {
          var nodeId = settings.urlParams.nodeId,
              nodeIdValue = +nodeId,
              query = (settings.urlParams.query || '').substring(1).split('&'),
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
              allChildren = _.filter(nodes, function (node) {
                var parent_id = node.parent_id.id || node.parent_id;
                return parent_id === nodeIdValue;
              }),
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
            results: limitedChildren.map(getV2Node),
            collection: {
              paging: {
                page: pageIndex,
                limit: pageSize,
                total_count: filteredChildren.length,
                page_total: Math.round(filteredChildren.length / pageSize),
                range_min: 1,
                range_max: Math.round(filteredChildren.length / pageSize),
              },
              sorting: {
                sort: [sortBy || 'asc_name']
              }
            }
          };
        }
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v1/nodes/([^/]+)/addablenodetypes'),
        urlParams: ['nodeId'],
        response: function (settings) {
          var nodeId = settings.urlParams.nodeId,
              node = nodes[nodeId];
          this.responseText = {};
        }
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/members/favorites(\\?.*)?'),
        responseText: {
          results: []
        }
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/members/accessed(\\?.*)$'),
        urlParams: ['query', 'includeMetadata'],
        responseText: {
          results: []
        }
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/members/assignments(\\?.*)*$'),
        responseText: {
          results: []
        }
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v1/nodes/([^/]+)/facets'),
        urlParams: ['nodeId'],
        responseText: {
          facets: {
            available_values: [],
            properties: [],
            selected_values: []
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
