/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery.mockjax',
  'csui/lib/jquery.parse.param', 'json!./add.version.data.json'
], function (_, mockjax, parseParam, mockData) {
  'use strict';

  function getV2Node(node) {
    return {
      actions: getNodeActions(node),
      data: {
        properties: node
      },
      metadata: {
        properties: mockData.nodeMetadata
      }
    };
  }

  function getV2Template(template) {
    return {
      data: {
        properties: template
      }
    };
  }

  function getAncestors(nodeId, includeSelf) {
    var node = mockData.nodes[nodeId];
    if (node) {
      var path      = includeSelf ? [node] : [],
          parent_id = node.parent_id.id || node.parent_id;
      if (parent_id > 0) {
        path = getAncestors(parent_id, true).concat(path);
      }
      return path;
    }
  }

  function getNodeActions(node) {
    return _
        .chain(mockData.nodeActions[node.type] || [])
        .reduce(function (result, action) {
          result[action] = {};
          return result;
        }, {})
        .value();
  }

  return {

    enable: function () {

      mockjax({
        name: 'utils/commands/test/add.version.mock',
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/([^/?]+)(?:\\?(.*))?$'),
        urlParams: ['nodeId', 'query'], // actions, perspective
        type: 'GET',
        response: function (settings) {
          var nodeId = +settings.urlParams.nodeId,
              node   = mockData.nodes[nodeId];
          this.responseText = getV2Node(node);
        }
      });

      mockjax({
        name: 'utils/commands/test/add.version.mock',
        url: new RegExp('^//server/otcs/cs/api/v1/nodes/([^/]+)/nodes(?:\\?(.*))?$'),
        urlParams: ['nodeId', 'query'],
        response: function (settings) {
          var nodeId           = +settings.urlParams.nodeId,
              parent           = mockData.nodes[nodeId],
              allChildren      = _.filter(mockData.nodes, function (node) {
                var parent_id = node.parent_id.id || node.parent_id;
                return parent_id === nodeId;
              }),
              parameters       = parseParam(settings.urlParams.query),
              filterBy         = _.chain(_.keys(parameters))
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
                  var property    = filterBy.property,
                      filterValue = filterBy.value.toLowerCase(),
                      actualValue = node[property];
                  if (actualValue != null) {
                    actualValue = actualValue.toString().toLowerCase();
                  }
                  switch (property) {
                  case 'type':
                    return filterValue === '-1' ? node.container :
                           filterValue === actualValue;
                  }
                  if (_.isString(actualValue)) {
                    return actualValue.toLowerCase().indexOf(filterValue) >= 0;
                  }
                  return actualValue === filterValue;
                });
              }),
              sortBy           = parameters.sort,
              sortValues       = sortBy ? _.isArray(sortBy) && sortBy || [sortBy] : [],
              sortCriteria     = _.chain(sortValues.concat('asc_name'))
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
              sortedChildren   = filteredChildren.sort(function (left, right) {
                function getValues(property) {
                  var leftValue  = left[property],
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
                  return values.left !== values.right;
                });
                if (sortBy) {
                  var values = getValues(sortBy.property);
                  return values.left > values.right === sortBy.ascending;
                }
              }),
              pageSize         = +parameters.limit || 10,
              pageIndex        = +parameters.page || 1,
              firstIndex       = (pageIndex - 1) * pageSize,
              lastIndex        = firstIndex + pageSize,
              limitedChildren  = sortedChildren.slice(firstIndex, lastIndex);
          _.each(limitedChildren, function (node) {
            node.actions = getNodeActions(node);
          });
          this.responseText = {
            data: limitedChildren,
            definitions: mockData.nodeMetadata,
            definitions_order: ['type', 'name', 'size', 'modify_date', 'wnd_comments'],
            page: pageIndex,
            limit: pageSize,
            total_count: filteredChildren.length,
            page_total: Math.round(filteredChildren.length / pageSize),
            range_min: 1,
            range_max: Math.round(filteredChildren.length / pageSize),
            sort: sortBy || 'asc_name'
          };
        }
      });

      mockjax({
        name: 'utils/commands/test/add.version.mock',
        url: new RegExp('^//server/otcs/cs/api/v1/nodes/([^/?]+)/versions/([^/?]+)(?:\\?(.*))?$'),
        urlParams: ['nodeId', 'versionNum', 'query'], // actions, perspective
        type: 'GET',
        response: function (settings) {
          var nodeId = +settings.urlParams.nodeId,
              node   = mockData.nodes[nodeId];
          if (!node || node.id != 2001) {
            this.status = 400;
            this.statusText = 'Bad Request';
            this.responseText = {
              error: 'Invalid node.'
            };
            return;
          }
          this.responseText = node;
        }
      });

      mockjax({
        name: 'utils/commands/test/add.version.mock',
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/([^/?]+)/versions/([^/?]+)(?:\\?(.*))?$'),
        urlParams: ['nodeId', 'versionNum', 'query'], // actions, perspective
        type: 'GET',
        response: function (settings) {
          var nodeId = +settings.urlParams.nodeId,
              node   = mockData.nodes[nodeId];
          if (!node || node.id != 2001) {
            this.status = 400;
            this.statusText = 'Bad Request';
            this.responseText = {
              error: 'Invalid node.'
            };
            return;
          }
          this.responseText = node;
        }
      });

      mockjax({
        name: 'utils/commands/test/add.version.mock',
        url: new RegExp('^//server/otcs/cs/api/v1/nodes/([^/]+)/versions(?:\\?.*)?$'),
        urlParams: ['nodeId', 'query'],
        type: 'POST',
        response: function (settings) {
          var nodeId = +settings.urlParams.nodeId,
              node   = mockData.nodes[nodeId],
              file   = settings.files && settings.files.file;
          if (!node || node.id != 2001) {
            this.status = 400;
            this.statusText = 'Bad Request';
            this.responseText = {
              error: 'Invalid node.'
            };
            return;
          }
          if (!_.isObject(file)) {
            this.status = 400;
            this.statusText = 'Bad Request';
            this.responseText = {
              error: 'Missing file.'
            };
            return;
          }
          node.modify_date = new Date().toISOString().replace(/\..+$/, '');
          node.size = file.size;
          node.mime_type = file.type;
          ++node.version_number;
          this.responseText = node;
        }
      });

    },

    disable: function () {
      mockjax.clear();
    }

  };

});
