/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['require', 'csui/lib/underscore', 'csui/lib/jquery',
  'csui/lib/jquery.mockjax', 'csui/utils/contexts/page/page.context',
  'csui/utils/contexts/factories/connector'
], function (require, _, $, mockjax, PageContext, ConnectorFactory) {

  _.extend($.mockjaxSettings, {
    responseTime: 0,
    headers: {}
  });
  var context   = new PageContext(),
      connector = context.getObject(ConnectorFactory),
      cgiUrl    = connector.connection.url.replace('/api/v1', '');
  var users            = {
        'Admin': {
          'id': 1000,
          'name': 'Admin',
          'first_name': 'God',
          'last_name': 'Administrator',
          'personal_volume_id': 2003
        },
        'kristen': {
          'id': 1001,
          'name': 'kristen',
          'first_name': 'Kristen',
          'last_name': 'Contributor',
          'personal_volume_id': 2004
        },
        'neil': {
          'id': 1002,
          'name': 'neil',
          'first_name': 'Neil',
          'last_name': 'Consumer',
          'personal_volume_id': 2005
        },
        'nick': {
          'id': 1003,
          'name': 'nick',
          'first_name': 'Nick',
          'last_name': 'Manager',
          'personal_volume_id': 2006
        }
      },
      userPerspectives = {
        'kristen': true,
        'neil': true,
        'nick': true
      };
  var nodeMetadata = {
    'create_date': {
      'include_time': true,
      'key': 'create_date',
      'name': 'Created',
      'read_only': true,
      'sort': true,
      'type': -7,
      'type_name': 'Date'
    },
    'create_user_id': {
      'key': 'create_user_id',
      'name': 'Created By',
      'read_only': false,
      'sort': true,
      'type': 2,
      'type_name': 'Integer'
    },
    'description': {
      'key': 'description',
      'multiline': true,
      'multilingual': true,
      'name': 'Description',
      'read_only': false,
      'type': -1,
      'type_name': 'String'
    },
    'id': {
      'key': 'id',
      'name': 'ID',
      'read_only': false,
      'sort': true,
      'type': 2,
      'type_name': 'Integer'
    },
    'modify_date': {
      'include_time': true,
      'key': 'modify_date',
      'name': 'Modified',
      'read_only': true,
      'sort': true,
      'type': -7,
      'type_name': 'Date'
    },
    'modify_user_id': {
      'key': 'modify_user_id',
      'name': 'Modified By',
      'read_only': false,
      'sort': true,
      'type': 2,
      'type_name': 'Integer'
    },
    'name': {
      'key': 'name',
      'multiline': false,
      'multilingual': true,
      'name': 'Name',
      'read_only': false,
      'sort': true,
      'type': -1,
      'type_name': 'String'
    },
    'owner_user_id': {
      'key': 'owner_user_id',
      'name': 'Owned By',
      'read_only': false,
      'sort': true,
      'type': 2,
      'type_name': 'Integer'
    },
    'parent_id': {
      'key': 'parent_id',
      'name': 'Parent ID',
      'read_only': false,
      'sort': true,
      'type': 2,
      'type_name': 'Integer'
    },
    'reserved': {
      'key': 'reserved',
      'name': 'Reserved',
      'read_only': false,
      'sort': true,
      'type': 5,
      'type_name': 'Boolean'
    },
    'reserved_date': {
      'include_time': true,
      'key': 'reserved_date',
      'name': 'Reserved',
      'read_only': false,
      'sort': true,
      'type': -7,
      'type_name': 'Date'
    },
    'reserved_user_id': {
      'key': 'reserved_user_id',
      'name': 'Reserved By',
      'read_only': false,
      'sort': true,
      'type': 2,
      'type_name': 'Integer'
    },
    'size': {
      'key': 'type',
      'name': 'Size',
      'read_only': true,
      'sort': true,
      'type': 2,
      'type_name': 'Integer'
    },
    'type': {
      'key': 'type',
      'name': 'Type',
      'read_only': true,
      'sort': true,
      'type': 2,
      'type_name': 'Integer'
    },
    'type_name': {
      'key': 'type_name',
      'multiline': false,
      'multilingual': false,
      'name': 'Type',
      'read_only': true,
      'type': -1,
      'type_name': 'String'
    }
  };
  var nodes = {
    '2000': {
      'actions': [
        {
          name: 'Open',
          signature: 'Browse'
        }
      ],
      'id': 2000,
      'name': 'Innovate',
      'type': 141,
      'container': true,
      'create_date': '2014-07-10T14:12:31',
      'create_user_id': 1000,
      'description': '',
      'modify_date': '2014-10-15T14:54:06',
      'modify_user_id': 1000,
      'parent_id': -1,
      'perm_create': true,
      'perm_delete': true,
      'perm_delete_versions': true,
      'perm_modify': true,
      'perm_modify_attributes': true,
      'perm_modify_permissions': true,
      'perm_reserve': true,
      'perm_see': true,
      'perm_see_contents': true,
      'size': 1
    },
    '2003': {
      'actions': [
        {
          name: 'Open',
          signature: 'Browse'
        }
      ],
      'id': 2003,
      'name': 'Josef\'s Home',
      'type': 142,
      'container': true,
      'create_date': '2014-07-10T14:12:31',
      'create_user_id': 1000,
      'description': '',
      'modify_date': '2014-10-15T14:54:06',
      'modify_user_id': 1000,
      'parent_id': -1,
      'perm_create': true,
      'perm_delete': true,
      'perm_delete_versions': true,
      'perm_modify': true,
      'perm_modify_attributes': true,
      'perm_modify_permissions': true,
      'perm_reserve': true,
      'perm_see': true,
      'perm_see_contents': true,
      'size': 0
    },
    '2004': {
      'actions': [
        {
          name: 'Open',
          signature: 'Browse'
        }
      ],
      'id': 2004,
      'name': 'Kristen\'s Home',
      'type': 142,
      'container': true,
      'create_date': '2014-07-10T14:12:31',
      'create_user_id': 1000,
      'description': '',
      'modify_date': '2014-10-15T14:54:06',
      'modify_user_id': 1001,
      'parent_id': -1,
      'perm_create': true,
      'perm_delete': true,
      'perm_delete_versions': true,
      'perm_modify': true,
      'perm_modify_attributes': true,
      'perm_modify_permissions': true,
      'perm_reserve': true,
      'perm_see': true,
      'perm_see_contents': true,
      'size': 0
    },
    '2005': {
      'actions': [
        {
          name: 'Open',
          signature: 'Browse'
        }
      ],
      'id': 2005,
      'name': 'Neil\'s Home',
      'type': 142,
      'container': true,
      'create_date': '2014-07-10T14:12:31',
      'create_user_id': 1000,
      'description': '',
      'modify_date': '2014-10-15T14:54:06',
      'modify_user_id': 1002,
      'parent_id': -1,
      'perm_create': true,
      'perm_delete': true,
      'perm_delete_versions': true,
      'perm_modify': true,
      'perm_modify_attributes': true,
      'perm_modify_permissions': true,
      'perm_reserve': true,
      'perm_see': true,
      'perm_see_contents': true,
      'size': 0
    },
    '2006': {
      'actions': [
        {
          name: 'Open',
          signature: 'Browse'
        }
      ],
      'id': 2006,
      'name': 'Nick\'s Home',
      'type': 142,
      'container': true,
      'create_date': '2014-07-10T14:12:31',
      'create_user_id': 1000,
      'description': '',
      'modify_date': '2014-10-15T14:54:06',
      'modify_user_id': 1003,
      'parent_id': -1,
      'perm_create': true,
      'perm_delete': true,
      'perm_delete_versions': true,
      'perm_modify': true,
      'perm_modify_attributes': true,
      'perm_modify_permissions': true,
      'perm_reserve': true,
      'perm_see': true,
      'perm_see_contents': true,
      'size': 0
    },
    '3001': {
      'actions': [
        {
          name: 'Open',
          signature: 'Browse'
        }
      ],
      'id': 3001,
      'name': 'CarbonFibre Project',
      'type': 202,
      'container': true,
      'create_date': '2014-11-10T14:12:31',
      'create_user_id': 1000,
      'description': '',
      'modify_date': '2014-12-15T14:54:06',
      'modify_user_id': 1003,
      'parent_id': 2000,
      'perm_create': true,
      'perm_delete': true,
      'perm_delete_versions': true,
      'perm_modify': true,
      'perm_modify_attributes': true,
      'perm_modify_permissions': true,
      'perm_reserve': true,
      'perm_see': true,
      'perm_see_contents': true,
      'size': 4
    },
    '3002': {
      'actions': [
        {
          name: 'Open',
          signature: 'Browse'
        }
      ],
      'id': 3002,
      'name': 'Iteration Planning',
      'type': 0,
      'container': true,
      'create_date': '2014-12-20T14:12:31',
      'create_user_id': 1003,
      'description': '',
      'modify_date': new Date().toISOString(),
      'modify_user_id': 1003,
      'parent_id': 3001,
      'perm_create': true,
      'perm_delete': true,
      'perm_delete_versions': true,
      'perm_modify': true,
      'perm_modify_attributes': true,
      'perm_modify_permissions': true,
      'perm_reserve': true,
      'perm_see': true,
      'perm_see_contents': true,
      'size': 0
    },
    '3003': {
      'actions': [
        {
          name: 'Open',
          signature: 'Browse'
        }
      ],
      'id': 3003,
      'name': 'Architecture Design',
      'type': 0,
      'container': true,
      'create_date': '2014-12-20T14:15:31',
      'create_user_id': 1003,
      'description': '',
      'modify_date': new Date(new Date() - 8 * 60 * 60 * 1000).toISOString(),
      'modify_user_id': 1001,
      'parent_id': 3001,
      'perm_create': true,
      'perm_delete': true,
      'perm_delete_versions': true,
      'perm_modify': true,
      'perm_modify_attributes': true,
      'perm_modify_permissions': true,
      'perm_reserve': true,
      'perm_see': true,
      'perm_see_contents': true,
      'size': 0
    },
    '3004': {
      'actions': [
        {
          name: 'Open',
          signature: 'Browse'
        }
      ],
      'id': 3004,
      'name': 'Team Workshops',
      'type': 0,
      'container': true,
      'create_date': '2014-12-20T14:18:31',
      'create_user_id': 1003,
      'description': '',
      'modify_date': new Date(new Date() - 16 * 24 * 60 * 60 * 1000).toISOString(),
      'modify_user_id': 1001,
      'parent_id': 3001,
      'perm_create': true,
      'perm_delete': true,
      'perm_delete_versions': true,
      'perm_modify': true,
      'perm_modify_attributes': true,
      'perm_modify_permissions': true,
      'perm_reserve': true,
      'perm_see': true,
      'perm_see_contents': true,
      'size': 0
    },
    '3005': {
      'actions': [
        {
          name: 'Open',
          signature: 'Browse'
        }
      ],
      'id': 3005,
      'name': 'Project Policies',
      'type': 0,
      'container': true,
      'create_date': '2014-12-20T14:21:31',
      'create_user_id': 1003,
      'description': '',
      'modify_date': new Date(new Date() - 9 * 24 * 60 * 60 * 1000).toISOString(),
      'modify_user_id': 1003,
      'parent_id': 3001,
      'perm_create': true,
      'perm_delete': true,
      'perm_delete_versions': true,
      'perm_modify': true,
      'perm_modify_attributes': true,
      'perm_modify_permissions': true,
      'perm_reserve': true,
      'perm_see': true,
      'perm_see_contents': true,
      'size': 0
    },
    '4001': {
      'actions': [
        {
          name: 'Open',
          signature: 'Navigate'
        }
      ],
      'id': 4001,
      'name': 'Project Dashboard',
      'type': 140,
      'create_date': '2014-12-20T14:24:31',
      'create_user_id': 1003,
      'description': '',
      'modify_date': new Date(new Date() - 13 * 60 * 60 * 1000).toISOString(),
      'modify_user_id': 1003,
      'parent_id': 3001,
      'perm_create': true,
      'perm_delete': true,
      'perm_delete_versions': true,
      'perm_modify': true,
      'perm_modify_attributes': true,
      'perm_modify_permissions': true,
      'perm_reserve': true,
      'perm_see': true,
      'perm_see_contents': true,
      'url': 'http://www.opentext.com'
    },
    '5001': {
      'actions': [
        {
          name: 'Open',
          signature: 'Open'
        },
        {
          name: 'Download',
          signature: 'Download'
        }
      ],
      'id': 5001,
      'name': 'Motivation.md',
      'type': 144,
      'create_date': '2014-12-20T14:27:31',
      'create_user_id': 1001,
      'description': '',
      'modify_date': new Date(new Date() - 27 * 60 * 60 * 1000).toISOString(),
      'modify_user_id': 1001,
      'parent_id': 3001,
      'perm_create': true,
      'perm_delete': true,
      'perm_delete_versions': true,
      'perm_modify': true,
      'perm_modify_attributes': true,
      'perm_modify_permissions': true,
      'perm_reserve': true,
      'perm_see': true,
      'perm_see_contents': true,
      'size': 1234
    },
    '6001': {
      'id': 6001,
      'name': 'Shortcut to CarbonFibre Architecture',
      'type': 1,
      'create_date': '2014-12-21T13:14:14',
      'create_user_id': 1001,
      'description': '',
      'modify_date': new Date(new Date() - 27 * 60 * 60 * 1000).toISOString(),
      'modify_user_id': 1001,
      'original_id': 3003,
      'parent_id': 2000,
      'perm_create': true,
      'perm_delete': true,
      'perm_delete_versions': true,
      'perm_modify': true,
      'perm_modify_attributes': true,
      'perm_modify_permissions': true,
      'perm_reserve': true,
      'perm_see': true,
      'perm_see_contents': true
    }
  };

  var categoriesVolume = {
    'id': 2006,
    'name': 'Categories',
    'type': 133
  };
  var enterpriseVolume = {
    "id": 2000,
    "name": "Enterprise",
    "type": 141
  };
  var personalVolume = {
    "id": 2004,
    "name": "Personal",
    "type": 142
  };
  var perspectiveAssetsVolume = {
    "id": 2007,
    "name": "Perspective Assets",
    "type": 954
  };

  var nodesV2 = _.reduce(nodes, function (result, node, id) {
    result[id] = {
      'element': {
        'data': {
          properties: node
        },
        'metadata': {
          properties: nodeMetadata
        }
      }
    };
    return result;
  }, {});
  var nodePerspectives = {
    '3001': 'tabbed.test',
    '3002': 'tabbed.test',
    '3003': 'tabbed.test',
    '3004': 'tabbed.test',
    '3005': 'tabbed.test'
  };
  var categories = {
    'data': [
      {
        'id': 52271,
        'name': 'Required Attributes',
        'cell_metadata': {
          'data': {
            'menu': 'api/v1/nodes/52275/categories/52271/actions'
          },
          'definitions': {
            'menu': {
              'body': '',
              'content_type': '',
              'display_hint': 'menu',
              'display_href': '',
              'handler': 'menu',
              'image': '',
              'method': 'GET',
              'name': '',
              'parameters': {},
              'tab_href': ''
            }
          }
        },
        'menu': null
      },
      {
        'id': 102877,
        'name': 'Special Properties',
        'cell_metadata': {
          'data': {
            'menu': 'api/v1/nodes/52275/categories/102877/actions'
          },
          'definitions': {
            'menu': {
              'body': '',
              'content_type': '',
              'display_hint': 'menu',
              'display_href': '',
              'handler': 'menu',
              'image': '',
              'method': 'GET',
              'name': '',
              'parameters': {},
              'tab_href': ''
            }
          }
        },
        'menu': null
      },
      {
        'id': 308936,
        'name': 'All Category attributes',
        'cell_metadata': {
          'data': {
            'menu': 'api/v1/nodes/52275/categories/308936/actions'
          },
          'definitions': {
            'menu': {
              'body': '',
              'content_type': '',
              'display_hint': 'menu',
              'display_href': '',
              'handler': 'menu',
              'image': '',
              'method': 'GET',
              'name': '',
              'parameters': {},
              'tab_href': ''
            }
          }
        },
        'menu': null
      }
    ],
    'definitions': {
      'id': {
        'key': 'id',
        'name': 'ID',
        'persona': 'node',
        'type': 2,
        'width_weight': 0
      },
      'name': {
        'key': 'name',
        'name': 'Name',
        'persona': '',
        'type': -1,
        'width_weight': 100
      }
    },
    'definitions_map': {
      'name': [
        'menu'
      ]
    },
    'definitions_order': [
      'name'
    ]
  };
  var mocks = [];

  return {

    enable: function () {
      mocks.push(mockjax({
        url: new RegExp('^' + cgiUrl + '/api/v1/(node|volume)s/([^/?]+)' +
                        '(\\?perspective=(\\w+))?(\\?expand=(\\w+))*$'),
        urlParams: ['resource', 'nodeIdOrType', 'query', 'includePerspective', 'expand'],
        response: function (settings) {
          var resource     = settings.urlParams.resource,
              nodeIdOrType = settings.urlParams.nodeIdOrType,
              userName     = connector.connection.session.ticket,
              user         = users[userName],
              nodeId       = resource === 'node' ? nodeIdOrType :
                             nodeIdOrType === '141' ? '2000' :
                             nodeIdOrType === '142' ? user && user.personal_volume_id &&
                                                      user.personal_volume_id.toString() :
                             null,
              node         = nodes[nodeId];
          this.responseText = {
            data: node
          };
        }
      }));
      mocks.push(mockjax({
        url: new RegExp(
            '^//server/otcs/cs/api/v1/volumes/133?expand=node&expand=member(.*)$'),
        responseText: categoriesVolume
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/2006/ancestors',
        responseTime: 0,
        responseText: {
          "ancestors": [{
            "id": 2006,
            "name": "Content Server Categories",
            "volume_id": -2006,
            "parent_id": -1,
            "type": 133,
            "type_name": "Categories Volume"
          }]
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/3003/categories',
        responseTime: 50,
        responseText: {
          'data': [
            {
              'id': 186529,
              'name': 'Manual Information',
              'cell_metadata': {
                'data': {'menu': 'api\/v1\/nodes\/3003\/categories\/186529\/actions'},
                'definitions': {
                  'menu': {
                    'body': '',
                    'content_type': '',
                    'display_hint': 'menu',
                    'display_href': '',
                    'handler': 'menu',
                    'image': '',
                    'method': 'GET',
                    'name': '',
                    'parameters': {},
                    'tab_href': ''
                  }
                }
              },
              'menu': null
            },
            {
              'id': 187420,
              'name': 'Library Classification',
              'cell_metadata': {
                'data': {'menu': 'api\/v1\/nodes\/3003\/categories\/187420\/actions'},
                'definitions': {
                  'menu': {
                    'body': '',
                    'content_type': '',
                    'display_hint': 'menu',
                    'display_href': '',
                    'handler': 'menu',
                    'image': '',
                    'method': 'GET',
                    'name': '',
                    'parameters': {},
                    'tab_href': ''
                  }
                }
              },
              'menu': null
            }],
          'definitions': {
            'id': {
              'key': 'id',
              'name': 'ID',
              'persona': 'node',
              'type': 2,
              'width_weight': 0
            },
            'name': {
              'key': 'name',
              'name': 'Name',
              'persona': '',
              'type': -1,
              'width_weight': 100
            }
          },
          'definitions_map': {'name': ['menu']},
          'definitions_order': ['name']
        }

      }));
      var categoryForm = {
        'forms': [{
          'data': {
            '186529_2': null,
            '186529_3': null,
            '186529_4': null,
            '186529_5': false
          },
          'options': {
            'fields': {
              '186529_2': {
                'hidden': false,
                'hideInitValidationError': true,
                'label': 'Manual Description',
                'readonly': false,
                'type': 'text'
              },
              '186529_3': {
                'hidden': false,
                'hideInitValidationError': true,
                'label': 'Manual Id',
                'readonly': false,
                'type': 'integer'
              },
              '186529_4': {
                'hidden': false,
                'hideInitValidationError': true,
                'label': 'Long Description',
                'readonly': false,
                'type': 'textarea'
              },
              '186529_5': {
                'hidden': false,
                'hideInitValidationError': true,
                'label': 'Type',
                'readonly': false,
                'type': 'checkbox'
              }
            },
            'form': {
              'attributes': {
                'action': 'api\/v1\/nodes\/103827\/categories\/186529',
                'method': 'PUT'
              }, 'renderForm': true
            }
          },
          'schema': {
            'properties': {
              '186529_2': {
                'maxLength': 32,
                'readonly': false,
                'required': false,
                'title': 'Manual Description',
                'type': 'string'
              },
              '186529_3': {
                'readonly': false,
                'required': false,
                'title': 'Manual Id',
                'type': 'integer'
              },
              '186529_4': {
                'readonly': false,
                'required': false,
                'title': 'Long Description',
                'type': 'string'
              },
              '186529_5': {
                'readonly': false,
                'required': true,
                'title': 'Type',
                'type': 'boolean'
              }
            }, 'type': 'object'
          }
        }]
      };
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/forms/nodes/categories/update?id=3001&category_id=66666',
        responseTime: 0,
        responseText: categoryForm

      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/forms/nodes/categories/update?id=3001&category_id=66667',
        responseTime: 0,
        responseText: categoryForm
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/forms/nodes/categories/update?id=3001&category_id=66668',
        responseTime: 0,
        responseText: categoryForm

      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/3001/categories',
        responseTime: 0,
        responseText: {
          data: [
            {
              id: 66666,
              name: 'BRFG-Payment'
            },
            {
              id: 66667,
              name: 'BC Asset Images'
            },
            {
              id: 66668,
              name: 'BC Event Photos'
            }
          ]
        }
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/3001/categories/66667/actions',
        responseTime: 0,
        responseText: {
          'data': {
            'categories_remove': 'api\/v1\/nodes\/3001\/categories\/66667',
            'categories_update': 'api\/v1\/forms\/nodes\/categories\/update?id=3001&category_id=66667'
          },
          'definitions': {
            'categories_remove': {
              'body': '',
              'content_type': '',
              'display_hint': '',
              'display_href': '',
              'handler': '',
              'image': '',
              'method': 'DELETE',
              'name': 'Remove',
              'parameters': {},
              'tab_href': ''
            },
            'categories_update': {
              'body': '',
              'content_type': '',
              'display_hint': '',
              'display_href': '',
              'handler': 'form',
              'image': '',
              'method': 'GET',
              'name': 'Update',
              'parameters': {},
              'tab_href': ''
            }
          },
          'definitions_map': {},
          'definitions_order': ['categories_remove', 'categories_update']
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/forms/nodes/properties/general?id=3001',
        responseTime: 0,
        responseText: {
          'forms': [
            {
              'data': {
                'name': 'Enterprise',
                'description': '',
                'create_date': '2010-10-20T18:31:01',
                'create_user_id': 'Admin',
                'type': 141,
                'type_name': 'Enterprise Workspace',
                'modify_date': '2015-03-26T15:45:22',
                'owner_user_id': 'Admin'
              },
              'options': {
                'fields': {
                  'name': {
                    'hidden': false,
                    'hideInitValidationError': true,
                    'label': 'Name',
                    'readonly': false,
                    'type': 'text'
                  },
                  'description': {
                    'hidden': false,
                    'hideInitValidationError': true,
                    'label': 'Description',
                    'readonly': false,
                    'type': 'textarea'
                  },
                  'create_date': {
                    'hidden': false,
                    'hideInitValidationError': true,
                    'label': 'Created',
                    'readonly': true,
                    'type': 'datetime'
                  },
                  'create_user_id': {
                    'hidden': false,
                    'hideInitValidationError': true,
                    'label': 'Created By',
                    'readonly': true,
                    'type': 'text'
                  },
                  'type': {
                    'hidden': true,
                    'hideInitValidationError': true,
                    'label': 'Type',
                    'readonly': true,
                    'type': 'integer'
                  },
                  'type_name': {
                    'hidden': false,
                    'hideInitValidationError': true,
                    'label': 'Type',
                    'readonly': true,
                    'type': 'text'
                  },
                  'modify_date': {
                    'hidden': false,
                    'hideInitValidationError': true,
                    'label': 'Modified',
                    'readonly': true,
                    'type': 'datetime'
                  },
                  'owner_user_id': {
                    'hidden': false,
                    'hideInitValidationError': true,
                    'label': 'Owned By',
                    'readonly': true,
                    'type': 'text'
                  }
                },
                'form': {
                  'attributes': {
                    'action': 'api/v1/nodes/2000',
                    'method': 'PUT'
                  },
                  'renderForm': true
                }
              },
              'schema': {
                'properties': {
                  'name': {
                    'maxLength': 248,
                    'minLength': 1,
                    'readonly': false,
                    'required': true,
                    'title': 'Name',
                    'type': 'string'
                  },
                  'description': {
                    'readonly': false,
                    'required': false,
                    'title': 'Description',
                    'type': 'string'
                  },
                  'create_date': {
                    'readonly': true,
                    'required': false,
                    'title': 'Created',
                    'type': 'string'
                  },
                  'create_user_id': {
                    'readonly': true,
                    'required': false,
                    'title': 'Created By',
                    'type': 'string'
                  },
                  'type': {
                    'readonly': true,
                    'required': false,
                    'title': 'Type',
                    'type': 'integer'
                  },
                  'type_name': {
                    'readonly': true,
                    'required': false,
                    'title': 'Type',
                    'type': 'string'
                  },
                  'modify_date': {
                    'readonly': true,
                    'required': false,
                    'title': 'Modified',
                    'type': 'string'
                  },
                  'owner_user_id': {
                    'readonly': true,
                    'required': false,
                    'title': 'Owned By',
                    'type': 'string'
                  }
                },
                'type': 'object'
              }
            }
          ]
        }

      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/forms/nodes/properties/general?id=104597',
        responseTime: 0,
        responseText: {
          'forms': [
            {
              'data': {
                'name': 'Enterprise',
                'description': '',
                'create_date': '2010-10-20T18:31:01',
                'create_user_id': 'Admin',
                'type': 141,
                'type_name': 'Enterprise Workspace',
                'modify_date': '2015-03-26T15:45:22',
                'owner_user_id': 'Admin'
              },
              'options': {
                'fields': {
                  'name': {
                    'hidden': false,
                    'hideInitValidationError': true,
                    'label': 'Name',
                    'readonly': false,
                    'type': 'text'
                  },
                  'description': {
                    'hidden': false,
                    'hideInitValidationError': true,
                    'label': 'Description',
                    'readonly': false,
                    'type': 'textarea'
                  },
                  'create_date': {
                    'hidden': false,
                    'hideInitValidationError': true,
                    'label': 'Created',
                    'readonly': true,
                    'type': 'datetime'
                  },
                  'create_user_id': {
                    'hidden': false,
                    'hideInitValidationError': true,
                    'label': 'Created By',
                    'readonly': true,
                    'type': 'text'
                  },
                  'type': {
                    'hidden': true,
                    'hideInitValidationError': true,
                    'label': 'Type',
                    'readonly': true,
                    'type': 'integer'
                  },
                  'type_name': {
                    'hidden': false,
                    'hideInitValidationError': true,
                    'label': 'Type',
                    'readonly': true,
                    'type': 'text'
                  },
                  'modify_date': {
                    'hidden': false,
                    'hideInitValidationError': true,
                    'label': 'Modified',
                    'readonly': true,
                    'type': 'datetime'
                  },
                  'owner_user_id': {
                    'hidden': false,
                    'hideInitValidationError': true,
                    'label': 'Owned By',
                    'readonly': true,
                    'type': 'text'
                  }
                },
                'form': {
                  'attributes': {
                    'action': 'api/v1/nodes/2000',
                    'method': 'PUT'
                  },
                  'renderForm': true
                }
              },
              'schema': {
                'properties': {
                  'name': {
                    'maxLength': 248,
                    'minLength': 1,
                    'readonly': false,
                    'required': true,
                    'title': 'Name',
                    'type': 'string'
                  },
                  'description': {
                    'readonly': false,
                    'required': false,
                    'title': 'Description',
                    'type': 'string'
                  },
                  'create_date': {
                    'readonly': true,
                    'required': false,
                    'title': 'Created',
                    'type': 'string'
                  },
                  'create_user_id': {
                    'readonly': true,
                    'required': false,
                    'title': 'Created By',
                    'type': 'string'
                  },
                  'type': {
                    'readonly': true,
                    'required': false,
                    'title': 'Type',
                    'type': 'integer'
                  },
                  'type_name': {
                    'readonly': true,
                    'required': false,
                    'title': 'Type',
                    'type': 'string'
                  },
                  'modify_date': {
                    'readonly': true,
                    'required': false,
                    'title': 'Modified',
                    'type': 'string'
                  },
                  'owner_user_id': {
                    'readonly': true,
                    'required': false,
                    'title': 'Owned By',
                    'type': 'string'
                  }
                },
                'type': 'object'
              }
            }
          ]
        }

      }));
      mocks.push(mockjax({
        url: new RegExp('^' + cgiUrl + '/api/v1/nodes/([^/]+)/nodes' +
                        '(\\?(extra=(\\w+))*(&actions=(\\w+))*&limit=(\\d+)&page=(\\d+)(&expand=(\\w+))*(&sort=(\\w+))*(&where_name=(\\w+))*)?$'),
        urlParams: ['nodeId', 'query', 'pageSize', 'pageIndex', 'expand', 'expand',
          'extra',
          'extra', 'actions', 'actions',
          'sortBy', 'sortBy', 'filterByName', 'filterByName'],
        response: function (settings) {
          var nodeId           = settings.urlParams.nodeId,
              pageSize         = +settings.urlParams.pageSize || 10,
              pageIndex        = +settings.urlParams.pageIndex || 1,
              sortBy           = settings.urlParams.sortBy || 'asc_name',
              filterByName     = settings.urlParams.filterByName || '',
              nodeIdValue      = +nodeId,
              allChildren      = _.filter(nodes, function (node) {
                return node.parent_id === nodeIdValue;
              }),
              nameFilter       = filterByName.toLowerCase(),
              filteredChildren = _.filter(allChildren, function (node) {
                if (nameFilter) {
                  return node.name.toLowerCase().indexOf(nameFilter) >= 0;
                }
                return true;
              }),
              sortProperty     = sortBy.substring(sortBy.indexOf('_') + 1),
              sortDirection    = sortBy.substring(0, sortBy.indexOf('_')),
              sortAscending    = sortDirection === 'asc',
              sortedChildren   = filteredChildren.sort(function (left, right) {
                return left[sortProperty] > right[sortProperty] === sortAscending;
              }),
              firstIndex       = (pageIndex - 1) * pageSize,
              lastIndex        = firstIndex + pageSize,
              limitedChildren  = sortedChildren.slice(firstIndex, lastIndex);
          this.responseText = {
            name: nodeId,
            data: limitedChildren,
            definitions: nodeMetadata,
            page: pageIndex,
            limit: pageSize,
            total_count: allChildren.length
          };
        }
      }));

      mocks.push(mockjax({
        url: new RegExp('//server/otcs/cs/api/v1/forms/nodes/update\\?id=(.+)$'),
        responseTime: 0,
        responseText: {
          "forms": [
            {
              "data": {
                "name": "minion1.jpg",
                "description": "",
                "create_date": "2018-04-26T14:15:36",
                "create_user_id": 1000,
                "type": 144,
                "type_name": "Document",
                "modify_date": "2018-05-14T16:15:59",
                "owner_user_id": 1000,
                "reserved_user_id": 1000,
                "reserved_date": "2018-04-30T11:26:55"
              },
              "options": {
                "fields": {
                  "name": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Name",
                    "readonly": false,
                    "type": "text"
                  },
                  "description": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Description",
                    "readonly": false,
                    "type": "textarea"
                  },
                  "create_date": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Created",
                    "readonly": true,
                    "type": "datetime"
                  },
                  "create_user_id": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Created By",
                    "readonly": true,
                    "type": "otcs_user_picker",
                    "type_control": {
                      "action": "api\/v1\/members",
                      "method": "GET",
                      "name": "Admin",
                      "parameters": {
                        "filter_types": [
                          0
                        ],
                        "select_types": [
                          0
                        ]
                      }
                    }
                  },
                  "type": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "label": "Type",
                    "readonly": true,
                    "type": "integer"
                  },
                  "type_name": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Type",
                    "readonly": true,
                    "type": "text"
                  },
                  "modify_date": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Modified",
                    "readonly": true,
                    "type": "datetime"
                  },
                  "owner_user_id": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Owned By",
                    "readonly": true,
                    "type": "otcs_user_picker",
                    "type_control": {
                      "action": "api\/v1\/members",
                      "method": "GET",
                      "name": "Admin",
                      "parameters": {
                        "filter_types": [
                          0
                        ],
                        "select_types": [
                          0
                        ]
                      }
                    }
                  },
                  "reserved_user_id": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Reserved By",
                    "readonly": true,
                    "type": "otcs_member_picker",
                    "type_control": {
                      "action": "api\/v1\/members",
                      "method": "GET",
                      "name": "Admin",
                      "parameters": {
                        "filter_types": [
                          0,
                          1
                        ],
                        "select_types": [
                          0,
                          1
                        ]
                      }
                    }
                  },
                  "reserved_date": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Reserved",
                    "readonly": true,
                    "type": "datetime"
                  }
                },
                "form": {
                  "attributes": {
                    "action": "api\/v1\/nodes\/24400",
                    "method": "PUT"
                  },
                  "renderForm": true
                }
              },
              "schema": {
                "properties": {
                  "name": {
                    "maxLength": 248,
                    "minLength": 1,
                    "readonly": false,
                    "required": true,
                    "title": "Name",
                    "type": "string"
                  },
                  "description": {
                    "readonly": false,
                    "required": false,
                    "title": "Description",
                    "type": "string"
                  },
                  "create_date": {
                    "readonly": true,
                    "required": false,
                    "title": "Created",
                    "type": "string"
                  },
                  "create_user_id": {
                    "readonly": true,
                    "required": false,
                    "title": "Created By",
                    "type": "otcs_user_picker"
                  },
                  "type": {
                    "readonly": true,
                    "required": false,
                    "title": "Type",
                    "type": "integer"
                  },
                  "type_name": {
                    "readonly": true,
                    "required": false,
                    "title": "Type",
                    "type": "string"
                  },
                  "modify_date": {
                    "readonly": true,
                    "required": false,
                    "title": "Modified",
                    "type": "string"
                  },
                  "owner_user_id": {
                    "readonly": true,
                    "required": false,
                    "title": "Owned By",
                    "type": "otcs_user_picker"
                  },
                  "reserved_user_id": {
                    "readonly": true,
                    "required": false,
                    "title": "Reserved By",
                    "type": "otcs_member_picker"
                  },
                  "reserved_date": {
                    "readonly": true,
                    "required": false,
                    "title": "Reserved",
                    "type": "string"
                  }
                },
                "type": "object"
              }
            },
            {
              "data": {
                "6390": {
                  "6390_3": 12,
                  "6390_1": {
                    "version_number": 2
                  }
                },
                "6963": {
                  "6963_2": "hello world",
                  "6963_1": {
                    "version_number": 2
                  }
                },
                "30205": {
                  "30205_2": "2",
                  "30205_1": {
                    "version_number": 2
                  }
                }
              },
              "options": {
                "fields": {
                  "6390": {
                    "fields": {
                      "6390_3": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Integer",
                        "readonly": false,
                        "type": "integer"
                      },
                      "6390_1": {
                        "hidden": true,
                        "hideInitValidationError": true,
                        "readonly": true,
                        "type": "object"
                      }
                    },
                    "hideInitValidationError": true,
                    "label": "Integer Field",
                    "type": "object"
                  },
                  "6963": {
                    "fields": {
                      "6963_2": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "TextField",
                        "readonly": false,
                        "type": "text"
                      },
                      "6963_1": {
                        "hidden": true,
                        "hideInitValidationError": true,
                        "readonly": true,
                        "type": "object"
                      }
                    },
                    "hideInitValidationError": true,
                    "label": "Text*",
                    "type": "object"
                  },
                  "30205": {
                    "fields": {
                      "30205_2": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Select field",
                        "readonly": false,
                        "type": "select"
                      },
                      "30205_1": {
                        "hidden": true,
                        "hideInitValidationError": true,
                        "readonly": true,
                        "type": "object"
                      }
                    },
                    "hideInitValidationError": true,
                    "label": "select field",
                    "type": "object"
                  }
                }
              },
              "role_name": "categories",
              "schema": {
                "properties": {
                  "6390": {
                    "properties": {
                      "6390_3": {
                        "readonly": false,
                        "required": true,
                        "title": "Integer",
                        "type": "integer"
                      },
                      "6390_1": {
                        "readonly": true,
                        "required": false,
                        "type": "object"
                      }
                    },
                    "title": "Integer Field",
                    "type": "object"
                  },
                  "6963": {
                    "properties": {
                      "6963_2": {
                        "maxLength": 32,
                        "readonly": false,
                        "required": true,
                        "title": "TextField",
                        "type": "string"
                      },
                      "6963_1": {
                        "readonly": true,
                        "required": false,
                        "type": "object"
                      }
                    },
                    "title": "Text",
                    "type": "object"
                  },
                  "30205": {
                    "properties": {
                      "30205_2": {
                        "enum": [
                          "1",
                          "2",
                          "3",
                          "4",
                          "5"
                        ],
                        "readonly": false,
                        "required": true,
                        "title": "Select field",
                        "type": "string"
                      },
                      "30205_1": {
                        "readonly": true,
                        "required": false,
                        "type": "object"
                      }
                    },
                    "title": "select field*",
                    "type": "object"
                  }
                },
                "title": "Categories",
                "type": "object"
              }
            }
          ]
        }
      }));
      mocks.push(mockjax({
        url: new RegExp('//server/otcs/cs/api/v1/nodes/(.+)/categories/(.+)/actions$'),
        responseTime: 0,
        responseText: {
          "data": {
            "categories_remove": "api\/v1\/nodes\/24400\/categories\/6390",
            "categories_update": "api\/v1\/forms\/nodes\/categories\/update?id=24400&category_id=6390"
          },
          "definitions": {
            "categories_remove": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "",
              "image": "",
              "method": "DELETE",
              "name": "Remove",
              "parameters": {},
              "tab_href": ""
            },
            "categories_update": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "",
              "method": "GET",
              "name": "Update",
              "parameters": {},
              "tab_href": ""
            }
          },
          "definitions_map": {},
          "definitions_order": [
            "categories_remove",
            "categories_update"
          ]
        }
      }));
      mocks.push(mockjax({
        url: new RegExp('//server/otcs/cs/api/v1/volumes/141'),
        responseTime: 0,
        responseText: enterpriseVolume
      }));
      mocks.push(mockjax({
        url: new RegExp('//server/otcs/cs/api/v1/volumes/142'),
        responseTime: 0,
        responseText: personalVolume
      }));
      mocks.push(mockjax({
        url: new RegExp('//server/otcs/cs/api/v1/volumes/133'),
        responseTime: 0,
        responseText: categoriesVolume
      }));
      mocks.push(mockjax({
        url: new RegExp('//server/otcs/cs/api/v1/volumes/954'),
        responseTime: 0,
        responseText: perspectiveAssetsVolume
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
