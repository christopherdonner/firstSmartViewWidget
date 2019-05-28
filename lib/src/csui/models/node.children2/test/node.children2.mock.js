/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery.mockjax',
  'csui/lib/jquery.parse.param', 'json!./node.children2.data.json'
], function (_, mockjax, parseParam, mocked) {
  'use strict';

  function getV2Node(node, actions) {
    return {
      actions: getNodeActions(node, actions),
      data: {
        columns: node.container && mocked.columns,
        properties: node
      },
      metadata: {
        properties: mocked.definitions
      }
    };
  }

  function getNodeActions(node, actions) {
    return _.chain(node.actions || {})
            .keys()
            .reduce(function (result, action) {
              if (!actions || !actions.length || _.contains(actions, action)) {
                result[action] = {};
              }
              return result;
            }, {})
            .value();
  }

  var mocks = [];

  return {
    enable: function () {
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/actions(?:\\?(.*))?$'),
        urlParams: ['query'], // ids, actions
        response: function (settings) {
          var parameters = parseParam(settings.urlParams.query),
              filteredNodes = _.filter(mocked.nodes, function (node) {
                return _.contains(parameters.ids, node.id.toString());
              });
          this.responseText = {
            results: _.reduce(filteredNodes, function (results, node) {
              if (node) {
                results[node.id] = {
                  data: _.reduce(node.actions, function (result, action, signature) {
                    if (_.contains(parameters.actions, signature)) {
                      result[signature] = action;
                    }
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
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/([^/]+)/nodes(?:\\?(.*))?$'),
        urlParams: ['nodeId', 'query'],
        response: function (settings) {
          var nodeId = +settings.urlParams.nodeId,
              parent = mocked.nodes[nodeId],
              allChildren = _.filter(mocked.nodes, function (node) {
                var parent_id = node.parent_id.id || node.parent_id;
                return parent_id === nodeId;
              }),
              parameters = parseParam(settings.urlParams.query),
              actions = parameters.actions,
              filterBy = _.chain(_.keys(parameters))
                          .filter(function (key) {
                            return key.indexOf('where_') === 0 && parameters[key];
                          })
                          .map(function (key) {
                            return {
                              property: key.substring(6),
                              value: parameters[key]
                            };
                          })
                          .value(),
              filteredChildren = _.filter(allChildren, function (node) {
                return _.all(filterBy, function (filterBy) {
                  var property = filterBy.property,
                      filterValue = filterBy.value.toLowerCase(),
                      actualValue = node[property];
                  switch (property) {
                    case 'type':
                      return filterValue == -1 ? node.container :
                             filterValue == actualValue;
                  }
                  if (_.isString(actualValue)) {
                    return actualValue.toLowerCase().indexOf(filterValue) >= 0;
                  }
                  return actualValue == filterValue;
                });
              }),
              sortBy = parameters.sort,
              sortValues = sortBy ? _.isArray(sortBy) && sortBy || [sortBy] : [],
              sortCriteria = _.chain(sortValues.concat('asc_name'))
                              .compact()
                              .unique()
                              .map(function (sortBy) {
                                sortBy = sortBy.split(/_(.+)/, 2);
                                return {
                                  ascending: sortBy[0] === 'asc',
                                  property: sortBy[1]
                                };
                              })
                              .value(),
              sortedChildren = filteredChildren.sort(function (left, right) {
                function getValues(property) {
                  var leftValue = left[property],
                      rightValue = right[property];
                  if (property === 'type') {
                    left.container || (leftValue += 1000000);
                    right.container || (rightValue += 1000000);
                  } else if (property.indexOf('date') >= 0) {
                    leftValue && (leftValue = new Date(leftValue));
                    rightValue && (rightValue = new Date(rightValue));
                  }
                  return {
                    left: leftValue || null,
                    right: rightValue || null
                  };
                }

                var sortBy = _.find(sortCriteria, function (sortBy) {
                  var values = getValues(sortBy.property);
                  return values.left != values.right;
                });
                if (sortBy) {
                  var values = getValues(sortBy.property);
                  return values.left > values.right === sortBy.ascending;
                }
              }),
              pageSize = +parameters.limit || 10,
              pageIndex = +parameters.page || 1,
              firstIndex = (pageIndex - 1) * pageSize,
              lastIndex = firstIndex + pageSize,
              limitedChildren = sortedChildren.slice(firstIndex, lastIndex);
          if (!parent) {
            this.status = 400;
            this.statusText = 'Bad Request';
            this.dataType = 'json';
            this.responseText = {
              error: 'Invalid node identifier.'
            };
            return;
          }
          this.dataType = 'json';
          this.responseText = {
            results: limitedChildren.map(function (node) {
              return getV2Node(node, actions);
            }),
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
    },

    disable: function () {
      var mock;
      while ((mock = mocks.pop()) != null) {
        mockjax.clear(mock);
      }
    }
  };
});
