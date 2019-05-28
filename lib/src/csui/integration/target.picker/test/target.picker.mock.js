/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/underscore', 'csui/lib/jquery.mockjax'
], function (_, mockjax) {
  "use strict";

  var users = {
    "1000": {
      "id": 1000,
      "name": "Admin",
      "first_name": "Chief",
      "last_name": "Administrator",
      "personal_volume_id": 2003
    }
  };

  var nodeMetadata = {
      "create_date": {
        "include_time": true,
        "key": "create_date",
        "name": "Created",
        "read_only": true,
        "sort": true,
        "type": -7,
        "type_name": "Date"
      },
      "create_user_id": {
        "key": "create_user_id",
        "name": "Created By",
        "read_only": false,
        "sort": true,
        "type": 2,
        "type_name": "Integer"
      },
      "description": {
        "key": "description",
        "multiline": true,
        "multilingual": true,
        "name": "Description",
        "read_only": false,
        "type": -1,
        "type_name": "String"
      },
      "id": {
        "key": "id",
        "name": "ID",
        "read_only": false,
        "sort": true,
        "type": 2,
        "type_name": "Integer"
      },
      "modify_date": {
        "include_time": true,
        "key": "modify_date",
        "name": "Modified",
        "read_only": true,
        "sort": true,
        "type": -7,
        "type_name": "Date"
      },
      "modify_user_id": {
        "key": "modify_user_id",
        "name": "Modified By",
        "read_only": false,
        "sort": true,
        "type": 2,
        "type_name": "Integer"
      },
      "name": {
        "key": "name",
        "multiline": false,
        "multilingual": true,
        "name": "Name",
        "read_only": false,
        "sort": true,
        "type": -1,
        "type_name": "String"
      },
      "owner_user_id": {
        "key": "owner_user_id",
        "name": "Owned By",
        "read_only": false,
        "sort": true,
        "type": 2,
        "type_name": "Integer"
      },
      "parent_id": {
        "key": "parent_id",
        "name": "Parent ID",
        "read_only": false,
        "sort": true,
        "type": 2,
        "type_name": "Integer"
      },
      "reserved": {
        "key": "reserved",
        "name": "Reserved",
        "read_only": false,
        "sort": true,
        "type": 5,
        "type_name": "Boolean"
      },
      "reserved_date": {
        "include_time": true,
        "key": "reserved_date",
        "name": "Reserved",
        "read_only": false,
        "sort": true,
        "type": -7,
        "type_name": "Date"
      },
      "reserved_user_id": {
        "key": "reserved_user_id",
        "name": "Reserved By",
        "read_only": false,
        "sort": true,
        "type": 2,
        "type_name": "Integer"
      },
      "size": {
        "key": "type",
        "name": "Size",
        "read_only": true,
        "sort": true,
        "type": 2,
        "type_name": "Integer"
      },
      "type": {
        "key": "type",
        "name": "Type",
        "read_only": true,
        "sort": true,
        "type": 2,
        "type_name": "Integer"
      },
      "type_name": {
        "key": "type_name",
        "multiline": false,
        "multilingual": false,
        "name": "Type",
        "read_only": true,
        "type": -1,
        "type_name": "String"
      }
    },
    nodes = {
      "2000": {
        "actions": [
          {
            name: "Open",
            signature: "Browse"
          }
        ],
        "id": 2000,
        "name": "Innovate",
        "type": 141,
        "create_date": "2014-07-10T14:12:31",
        "create_user_id": 1000,
        "description": "",
        "modify_date": "2014-10-15T14:54:06",
        "modify_user_id": 1000,
        "parent_id": -1,
        "volume_id": 2000
      },
      "2003": {
        "actions": [
          {
            name: "Open",
            signature: "Browse"
          }
        ],
        "id": 2003,
        "name": "Chief's Home",
        "type": 142,
        "create_date": "2014-07-10T14:12:31",
        "create_user_id": 1000,
        "description": "",
        "modify_date": "2014-10-15T14:54:06",
        "modify_user_id": 1000,
        "parent_id": -1,
        "volume_id": 2003
      },
      "2004": {
        "actions": [
          {
            name: "Open",
            signature: "Browse"
          }
        ],
        "id": 2004,
        "name": "Room Category",
        "type": 133,
        "create_date": "2014-07-10T14:12:31",
        "create_user_id": 1000,
        "description": "",
        "modify_date": "2014-10-15T14:54:06",
        "modify_user_id": 1000,
        "parent_id": -1,
        "volume_id": -2004
      },
      "2100": {
        "actions": [
          {
            name: "Open",
            signature: "Open"
          }
        ],
        "id": 2100,
        "name": "Overview.pptx",
        "type": 144,
        "create_date": "2014-08-10T14:12:31",
        "create_user_id": 1000,
        "description": "",
        "modify_date": "2014-11-15T14:54:06",
        "modify_user_id": 1000,
        "parent_id": 2000,
        "size": 678,
        "mime_type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "volume_id": 2000
      },
      "2200": {
        "actions": [
          {
            name: "Open",
            signature: "Open"
          }
        ],
        "id": 2200,
        "name": "Details.txt",
        "type": 144,
        "create_date": "2014-08-10T14:12:31",
        "create_user_id": 1000,
        "description": "",
        "modify_date": "2014-11-15T14:54:06",
        "modify_user_id": 1000,
        "parent_id": 2000,
        "size": 678,
        "mime_type": "text/plain",
        "volume_id": 2000
      },
      "2103": {
        "actions": [
          {
            name: "Open",
            signature: "Open"
          }
        ],
        "id": 2103,
        "name": "Photo.jpg",
        "type": 144,
        "create_date": "2013-08-10T14:12:31",
        "create_user_id": 1000,
        "description": "",
        "modify_date": "2013-11-15T14:54:06",
        "modify_user_id": 1000,
        "parent_id": 2003,
        "size": 12345,
        "mime_type": "image/jpg",
        "volume_id": 2003
      }
    },
    nodesV2 = _.reduce(nodes, function (result, node, id) {
      result[id] = {
        "data": {
          properties: node
        },
        "metadata": {
          properties: nodeMetadata
        }
      };
      return result;
    }, {});
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

  var mocks = [];

  return {

    enable: function () {

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v1/auth(\\?.*)?$'),
        responseText: {
          "data": users['1000']
        }
      }));
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v1/volumes/142\\?.*$'),
        response: function (settings) {
          var nodeId = 2003,
            node = nodes[nodeId];
          if (node) {
            this.responseText = {
              data: node
            };
          } else {
            this.status = 404;
            this.statusText = 'Not Found';
          }
        }
      }));
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v1/volumes/141\\?.*$'),
        response: function (settings) {
          var nodeId = 2000,
            node = nodes[nodeId];
          if (node) {
            this.responseText = {
              data: node
            };
          } else {
            this.status = 404;
            this.statusText = 'Not Found';
          }
        }
      }));
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v1/volumes/133\\?.*$'),
        response: function (settings) {
          var nodeId = 2003,
            node = nodes[nodeId];
          if (node) {
            this.responseText = {
              data: node
            };
          } else {
            this.status = 404;
            this.statusText = 'Not Found';
          }
        }
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v1/(node|volume)s(/[^/?]+)(.*)$'),
        urlParams: ['resource', 'nodeIdOrType'],
        response: function (settings) {
          var resource = settings.urlParams.resource,
            nodeIdOrType = settings.urlParams.nodeIdOrType,
            nodeId = resource === 'node' ? nodeIdOrType :
              nodeIdOrType === '/141' ? '2000' :
                nodeIdOrType === '/142' ? '2003' :
                  nodeIdOrType === '/133' ? '2003' :
                    null,
            node = nodes[nodeId];
          if (node) {
            this.responseText = {
              data: node
            };
          } else {
            this.status = 404;
            this.statusText = 'Not Found';
          }
        }
      }));
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/members/targets\\?.*$'),
        responseText: {
          results: []         // TODO: check
        }
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v1/(node|volume)s/([^/]+)/nodes(\\?.*)?$'),
        urlParams: ['resource', 'nodeIdOrType'],
        response: function (settings) {
          var resource = settings.urlParams.resource,
            nodeIdOrType = settings.urlParams.nodeIdOrType,
            nodeId = resource === 'node' ? nodeIdOrType :
              nodeIdOrType === '141' ? '2000' :
                nodeIdOrType === '142' ? '2003' :
                  null,
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
            data: limitedChildren,
            definitions: nodeMetadata,
            page: pageIndex,
            limit: pageSize,
            total_count: allChildren.length
          };
        }
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/members/favorites(\\?.*)?'),
        responseText: {
          results: [
            nodesV2['2100']
          ]
        }
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v1/(node|volume)s/([^/]+)/ancestors'),
        urlParams: ['resource', 'nodeIdOrType'],
        response: function (settings) {
          function getAncestors(nodeId) {
            var node = nodes[nodeId],
              path = [node],
              parent_id = node.parent_id.id || node.parent_id;
            if (parent_id > 0) {
              path = getAncestors(parent_id).concat(path);
            }
            return path;
          }

          var resource = settings.urlParams.resource,
            nodeIdOrType = settings.urlParams.nodeIdOrType,
            nodeId = resource === 'node' ? nodeIdOrType :
              nodeIdOrType === '141' ? '2000' :
                nodeIdOrType === '142' ? '2003' :
                  null,
            nodeIdValue = +nodeId,
            ancestors = getAncestors(nodeIdValue);
          this.responseText = {
            ancestors: ancestors
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
