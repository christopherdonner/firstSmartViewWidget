/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/underscore', 'csui/lib/jquery.mockjax',
  'csui/lib/jquery.parse.param', 'json!./virtualfolder.nodestable.data.json',
  'csui/utils/deepClone/deepClone'
], function (_, mockjax, parseParam, mocked) {
  'use strict';

  function getV2Node(node) {
    return {
      actions: getNodeActions(node),
      data: {
        columns: node.container && mocked.columns,
        properties: node
      },
      metadata: {
        properties: mocked.definitions
      }
    };
  }

  function getAncestors(nodeId, includeSelf) {
    var node = mocked.nodes[nodeId];
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
        .chain(mocked.actions[node.type] || [])
        .reduce(function (result, action) {
          result[action] = {};
          return result;
        }, {})
        .value();
  }

  function listChildren(nodeId, parameters) {
    var parent           = mocked.nodes[nodeId],
        allChildren      = _.filter(mocked.nodes, function (node) {
          var parent_id = node.parent_id.id || node.parent_id;
          return parent_id === nodeId;
        }),
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
            return values.left != values.right;
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
    if (!parent) {
      this.status = 400;
      this.statusText = 'Bad Request';
      this.dataType = 'json';
      this.responseText = {
        error: 'Invalid node identifier.'
      };
      return;
    }
    return {
      pageIndex: pageIndex,
      pageSize: pageSize,
      sortBy: sortBy,
      limitedChildren: limitedChildren,
      filteredChildren: filteredChildren
    };
  }

  var mocks = [];

  return {
    enable: function () {
      mocks.push(mockjax({
        url: new RegExp('^^//server/otcs/cs/api/v2/nodes/actions(?:\\?(.*))?$'),
        urlParams: ['query'], // ids, actions
        response: function (settings) {
          var parameters    = parseParam(settings.urlParams.query),
              filteredNodes = _.filter(mocked.nodes, function (node) {
                return _.contains(parameters.ids, node.id.toString());
              });
          _.each(filteredNodes, function (node) {
            node.actions = getNodeActions(node);
          });
          this.responseText = {
            results: _.reduce(filteredNodes, function (results, node) {
              if (node) {
                results[node.id] = {
                  data: node.actions
                };
              }
              return results;
            }, {})
          };
        }
      }));
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/([^/?]+)(?:\\?(.*))?$'),
        urlParams: ['nodeId', 'query'], // actions, perspective
        type: 'GET',
        response: function (settings) {
          var nodeId = +settings.urlParams.nodeId,
              node   = mocked.nodes[nodeId];
          if (!node) {
            this.status = 400;
            this.statusText = 'Bad Request';
            this.dataType = 'json';
            this.responseText = {
              error: 'Invalid node identifier.'
            };
            return;
          }
          this.responseText = getV2Node(node);
        }
      }));
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v1/nodes/([^/]+)/nodes(?:\\?(.*))?$'),
        urlParams: ['nodeId', 'query'],
        response: function (settings) {
          var nodeId     = +settings.urlParams.nodeId,
              parameters = parseParam(settings.urlParams.query),
              result     = listChildren.call(this, nodeId, parameters);
          if (!result) {
            return;
          }
          _.each(result.limitedChildren, function (node) {
            node.actions = getNodeActions(node);
          });
          this.dataType = 'json';
          this.responseText = {
            data: result.limitedChildren,
            definitions: mocked.definitions,
            definitions_order: ['type', 'name', 'size'],
            page: result.pageIndex,
            limit: result.pageSize,
            total_count: result.filteredChildren.length,
            page_total: Math.round(result.filteredChildren.length / result.pageSize),
            range_min: 1,
            range_max: Math.round(result.filteredChildren.length / result.pageSize),
            sort: result.sortBy || 'asc_name'
          };
        }
      }));
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/([^/]+)/nodes(?:\\?(.*))?$'),
        urlParams: ['nodeId', 'query'],
        response: function (settings) {
          var nodeId     = +settings.urlParams.nodeId,
              parameters = parseParam(settings.urlParams.query),
              result     = listChildren.call(this, nodeId, parameters);
          if (!result) {
            return;
          }
          this.dataType = 'json';
          this.responseText = {
            results: result.limitedChildren.map(getV2Node),
            collection: {
              paging: {
                page: result.pageIndex,
                limit: result.pageSize,
                total_count: result.filteredChildren.length,
                page_total: Math.round(result.filteredChildren.length / result.pageSize),
                range_min: 1,
                range_max: Math.round(result.filteredChildren.length / result.pageSize),
              },
              sorting: {
                sort: [result.sortBy || 'asc_name']
              }
            }
          };
        }
      }));
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v1/nodes/([^/]+)/ancestors'),
        urlParams: ['nodeId'],
        response: function (settings) {
          var nodeId = +settings.urlParams.nodeId;
          this.responseText = {
            ancestors: getAncestors(nodeId, true)
          };
        }
      }));
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v1/nodes/([^/]+)/addablenodetypes'),
        responseText: {
          data: {},
          definitions: {}
        }
      }));
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v1/volumes/([^/]+)'),
        responseText: {}
      }));
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v1/nodes/([^/]+)/facets'),
        urlParams: ['nodeId'],
        responseText: {
          "facets": {
            "available_values": [
              {
                "3321": [
                  {
                    "name": "Folder",
                    "percentage": 11.7647058823529,
                    "total": 4,
                    "value": "0"
                  },
                  {
                    "name": "Document",
                    "percentage": 55.8823529411765,
                    "total": 19,
                    "value": "144"
                  },
                  {
                    "name": "Category",
                    "percentage": 29.4117647058824,
                    "total": 10,
                    "value": "131"
                  },
                  {
                    "name": "URL",
                    "percentage": 2.94117647058824,
                    "total": 1,
                    "value": "140"
                  }
                ]
              },
              {
                "3324": [
                  {
                    "name": "Microsoft Word",
                    "percentage": 14.7058823529412,
                    "total": 5,
                    "value": "23"
                  },
                  {
                    "name": "Adobe PDF",
                    "percentage": 5.88235294117647,
                    "total": 2,
                    "value": "9"
                  }
                ]
              },
              {
                "3325": [
                  {
                    "name": "Images",
                    "percentage": 41.1764705882353,
                    "total": 14,
                    "value": "332"
                  },
                  {
                    "name": "Office",
                    "percentage": 20.5882352941176,
                    "total": 7,
                    "value": "331"
                  }
                ]
              },
              {
                "3322": [
                  {
                    "name": "Last week",
                    "percentage": 11.7647058823529,
                    "total": 4,
                    "value": "re09"
                  },
                  {
                    "name": "Three weeks ago",
                    "percentage": 2.94117647058824,
                    "total": 1,
                    "value": "re11"
                  },
                  {
                    "name": "Last month",
                    "percentage": 44.1176470588235,
                    "total": 15,
                    "value": "re12"
                  },
                  {
                    "name": "Older",
                    "percentage": 44.1176470588235,
                    "total": 15,
                    "value": "re13"
                  }
                ]
              }
            ],
            "properties": {
              "3321": {
                "data_source": "sys_ObjectType",
                "data_source_type": 305,
                "display_mode": 1,
                "display_priority": 50,
                "id": 3321,
                "items_to_show": 5,
                "name": "Content Type",
                "name_multilingual": {
                  "en_US": "Content Type"
                },
                "show_as_numbers": true,
                "show_text_in_more": false,
                "type": 305
              },
              "3322": {
                "data_source": "sys_ModifyDate",
                "data_source_type": -7,
                "display_mode": 4,
                "display_priority": 50,
                "id": 3322,
                "items_to_show": 5,
                "name": "Modified Date",
                "name_multilingual": {
                  "en_US": "Modified Date"
                },
                "show_as_numbers": true,
                "show_text_in_more": false,
                "type": -7
              },
              "3324": {
                "data_source": "dc_1",
                "data_source_type": 400,
                "display_mode": 1,
                "display_priority": 50,
                "id": 3324,
                "items_to_show": 5,
                "name": "Application",
                "name_multilingual": {
                  "en_US": "Application"
                },
                "show_as_numbers": true,
                "show_text_in_more": false,
                "type": 400
              },
              "3325": {
                "data_source": "dc_336",
                "data_source_type": 400,
                "display_mode": 1,
                "display_priority": 50,
                "id": 3325,
                "items_to_show": 5,
                "name": "Document Type",
                "name_multilingual": {
                  "en_US": "Document Type"
                },
                "show_as_numbers": true,
                "show_text_in_more": false,
                "type": 400
              }
            },
            "selected_values": []
          }
        }
      }));
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v1/nodes/([^/]+)/facets?where_facet=3321%3A0'),
        urlParams: ['nodeId'],
        responseText: {
          "facets": {
            "available_values": [
              {
                "3322": [
                  {
                    "name": "Yesterday",
                    "percentage": null,
                    "total": 1,
                    "value": "re01"
                  },
                  {
                    "name": "Last week",
                    "percentage": null,
                    "total": 2,
                    "value": "re09"
                  },
                  {
                    "name": "Last month",
                    "percentage": null,
                    "total": 1,
                    "value": "re12"
                  },
                  {
                    "name": "Older",
                    "percentage": null,
                    "total": 3,
                    "value": "re13"
                  }
                ]
              }
            ],
            "properties": {
              "3321": {
                "data_source": "sys_ObjectType",
                "data_source_type": 305,
                "display_mode": 1,
                "display_priority": 50,
                "id": 3321,
                "items_to_show": 5,
                "name": "Content Type",
                "name_multilingual": {
                  "en_US": "Content Type"
                },
                "show_as_numbers": true,
                "show_text_in_more": false,
                "type": 305
              },
              "3322": {
                "data_source": "sys_ModifyDate",
                "data_source_type": -7,
                "display_mode": 4,
                "display_priority": 50,
                "id": 3322,
                "items_to_show": 5,
                "name": "Modified Date",
                "name_multilingual": {
                  "en_US": "Modified Date"
                },
                "show_as_numbers": true,
                "show_text_in_more": false,
                "type": -7
              }
            },
            "selected_values": [
              {
                "3321": [
                  {
                    "name": "Folder",
                    "value": "0"
                  }
                ]
              }
            ]
          }
        }
      }));
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes'),
        responseText: {
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "\/api\/v2\/nodes",
                "method": "POST",
                "name": ""
              }
            }
          },
          "results": {
            "data": {
              "properties": {
                "container": true,
                "container_size": 0,
                "create_date": "2017-08-18T16:36:33",
                "create_user_id": 1000,
                "description": "",
                "description_multilingual": {
                  "en_US": ""
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": false,
                "id": 57766,
                "location_column_visible": true,
                "location_id": 2000,
                "mime_type": null,
                "modify_date": "2017-08-18T16:36:33",
                "modify_user_id": 1000,
                "name": "TestVirtualFolder",
                "name_multilingual": {
                  "en_US": "TestVirtualFolder"
                },
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": 2000,
                "reserved": false,
                "reserved_date": null,
                "reserved_user_id": 0,
                "selected_facets": [
                  [
                    "3324",
                    [
                      "9"
                    ]
                  ]
                ],
                "selected_facets_visible": true,
                "selected_location_visible": true,
                "size": 0,
                "size_formatted": "",
                "type": 899,
                "type_name": "Virtual Folder",
                "versions_control_advanced": false,
                "volume_id": -2000
              }
            }
          }
        }
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/members/favorites(\\?.*)?'),
        responseText: {
          results: []
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
