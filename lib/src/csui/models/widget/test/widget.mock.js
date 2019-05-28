/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'require', 'csui/lib/underscore', 'csui/lib/jquery.mockjax'
], function (require, _, mockjax) {
  'use strict';

  var localizedManifests = {};

  function defineWidgetManifests() {

    function clearArray() {
      this.setValue([]);
    }

    localizedManifests.favorites = {
      '$schema': 'http://json-schema.org/draft-04/schema#',
      'title': 'Favorites',
      'description': 'Shows favorite objects of the current user.',
      'kind': 'tile',
      'schema': {
        'type': 'object',
        'properties': {
          'title': {
            'title': 'Title',
            'description': 'Title text in the tile caption',
            'type': 'string',
            'default': 'My Favorites'
          },
          'titleBarIcon': {
            'title': 'Icon',
            'description': 'Icon in the tile caption',
            'type': 'string',
            'enum': [
              'csui-icon-star',
              'csui-icon-heart'
            ],
            'default': 'csui-icon-star'
          },
          'additionalClasses': {
            'title': 'Additional classes',
            'description': 'CSS classes to append to the common field class list',
            'type': 'array',
            'items': {
              'type': 'string'
            }
          }
        },
        'required': ['titleBarIcon']
      },
      'options': {
        'fields': {
          'titleBarIcon': {
            'type': 'select',
            'optionLabels': [
              'Star',
              'Heart'
            ]
          },
          'additionalClasses': {
            'toolbarSticky': true,
            'hideToolbarWithChildren': false,
            'toolbar': {
              'showLabels': true,
              'actions': [{
                'label': 'Clear',
                'action': 'clear',
                'click': clearArray
              }]
            }
          }
        }
      }
    };

    define('json!csui/widgets/favorites/favorites.manifest.json', {
      '$schema': 'http://json-schema.org/draft-04/schema#',
      'title': '{{widgetTitle}}',
      'description': '{{widgetDescription}}',
      'kind': 'tile',
      'schema': {
        'type': 'object',
        'properties': {
          'title': {
            'title': '{{widgetTitleLabel}}',
            'description': '{{widgetTitleDescription}}',
            'type': 'string',
            'default': '{{widgetTitleDefault}}'
          },
          'titleBarIcon': {
            'title': '{{widgetIconLabel}}',
            'description': '{{widgetIconDescription}}',
            'type': 'string',
            'enum': [
              'csui-icon-star',
              'csui-icon-heart'
            ],
            'default': 'csui-icon-star'
          },
          'additionalClasses': {
            'title': '{{widgetAdditionalClassesLabel}}',
            'description': '{{widgetAdditionalClassesDescription}}',
            'type': 'array',
            'items': {
              'type': 'string'
            }
          }
        },
        'required': ['titleBarIcon']
      },
      'options': {
        'fields': {
          'titleBarIcon': {
            'type': 'select',
            'optionLabels': [
              '{{widgetIconStar}}',
              '{{widgetIconHeart}}'
            ]
          },
          'additionalClasses': {
            'toolbarSticky': true,
            'hideToolbarWithChildren': false,
            'toolbar': {
              'showLabels': true,
              'actions': [{
                'label': '{{widgetAdditionalClassesActionClear}}',
                'action': 'clear',
                'click': clearArray
              }]
            }
          }
        }
      }
    });

    define('csui/widgets/favorites/impl/nls/favorites.manifest', {
      'root': true,
      'en-us': false,
      'en': false
    });

    define('csui/widgets/favorites/impl/nls/root/favorites.manifest', {
      'widgetTitle': 'Favorites',
      'widgetDescription': 'Shows favorite objects of the current user.',
      'widgetTitleLabel': 'Title',
      'widgetTitleDescription': 'Title text in the tile caption',
      'widgetTitleDefault': 'My Favorites',
      'widgetIconLabel': 'Icon',
      'widgetIconDescription': 'Icon in the tile caption',
      'widgetIconStar': 'Star',
      'widgetIconHeart': 'Heart',
      'widgetAdditionalClassesLabel': 'Additional classes',
      'widgetAdditionalClassesDescription': 'CSS classes to append to the common field class list',
      'widgetAdditionalClassesActionClear': 'Clear'
    });

    localizedManifests.shortcut = {
      '$schema': 'http://opentext.com/cs/json-schema/draft-04/schema#',
      'title': 'Shortcut',
      'description': 'Tile representing a hyperlink to an object; it navigates to its page when clicked',
      'kind': 'tile',
      'schema': {
        'type': 'object',
        'properties': {
          'id': {
            'title': 'Target object',
            'description': 'An object to open by this shortcut',
            'type': 'integer'
          },
          'type': {
            'title': 'Volume fallback',
            'description': 'Sub-type number of a global volume to open by this shortcut if no object has been selected',
            'type': 'integer',
            'enum': [
              141,
              142,
              133
            ],
            'default': 141
          },
          'background': {
            'title': 'Background',
            'description': 'Styling of the background below the shortcut tile',
            'type': 'string',
            'enum': [
              'cs-tile-background1',
              'cs-tile-background2',
              'cs-tile-background3'
            ]
          },
          'additionalClasses': {
            'title': 'Additional classes',
            'description': 'CSS classes to append to the common field class list',
            'type': 'array',
            'items': {
              'type': 'string'
            }
          }
        },
        'oneOf': [{
          'required': ['id']
        }, {
          'required': ['type']
        }]
      },
      'options': {
        'fields': {
          'type': {
            'type': 'select',
            'optionLabels': [
              'Enterprise',
              'Personal',
              'Categories'
            ]
          },
          'background': {
            'type': 'select',
            'optionLabels': [
              'Grey',
              'Green',
              'Orange'
            ]
          },
          'additionalClasses': {
            'toolbarSticky': true,
            'hideToolbarWithChildren': false,
            'toolbar': {
              'showLabels': true,
              'actions': [{
                'label': 'Clear',
                'action': 'clear',
                'click': clearArray
              }]
            }
          }
        }
      }
    };

    define('json!csui/widgets/shortcut/shortcut.manifest.json', {
      '$schema': 'http://opentext.com/cs/json-schema/draft-04/schema#',
      'title': '{{title}}',
      'description': '{{description}}',
      'kind': 'tile',
      'schema': {
        'type': 'object',
        'properties': {
          'id': {
            'title': '{{title}}',
            'description': '{{description}}',
            'type': 'integer'
          },
          'type': {
            'title': '{{title}}',
            'description': '{{description}}',
            'type': 'integer',
            'enum': [
              141,
              142,
              133
            ],
            'default': 141
          },
          'background': {
            'title': '{{title}}',
            'description': '{{description}}',
            'type': 'string',
            'enum': [
              'cs-tile-background1',
              'cs-tile-background2',
              'cs-tile-background3'
            ]
          },
          'additionalClasses': {
            'title': '{{dummy}}',
            'description': '{{dummy}}',
            'type': 'array',
            'items': {
              'type': 'string'
            }
          }
        },
        'oneOf': [{
          'required': ['id']
        }, {
          'required': ['type']
        }]
      },
      'options': {
        'fields': {
          'type': {
            'type': 'select',
            'optionLabels': [
              '{{placeholder}}',
              '{{placeholder}}',
              '{{placeholder}}'
            ]
          },
          'background': {
            'type': 'select',
            'optionLabels': [
              '{{placeholder}}',
              '{{placeholder}}',
              '{{placeholder}}'
            ]
          },
          'additionalClasses': {
            'toolbarSticky': true,
            'hideToolbarWithChildren': false,
            'toolbar': {
              'showLabels': true,
              'actions': [{
                'label': '{{label}}',
                'action': 'clear',
                'click': clearArray
              }]
            }
          }
        }
      }
    });

    define('csui/widgets/shortcut/impl/nls/shortcut.manifest', {
      'root': true,
      'en-us': false,
      'en': false
    });

    define('csui/widgets/shortcut/impl/nls/root/shortcut.manifest', {
      'title': 'Shortcut',
      'description': 'Tile representing a hyperlink to an object; it navigates to its page when clicked',
      'schema': {
        'properties': {
          'id': {
            'title': 'Target object',
            'description': 'An object to open by this shortcut'
          },
          'type': {
            'title': 'Volume fallback',
            'description': 'Sub-type number of a global volume to open by this shortcut if no object has been selected'
          },
          'background': {
            'title': 'Background',
            'description': 'Styling of the background below the shortcut tile'
          },
          'additionalClasses': {
            'title': 'Additional classes',
            'description': 'CSS classes to append to the common field class list'
          }
        }
      },
      'options': {
        'fields': {
          'type': {
            'optionLabels': [
              'Enterprise',
              'Personal',
              'Categories'
            ]
          },
          'background': {
            'optionLabels': [
              'Grey',
              'Green',
              'Orange'
            ]
          },
          'additionalClasses': {
            'toolbar': {
              'actions': [{
                'label': 'Clear'
              }]
            }
          }
        }
      }
    });

    localizedManifests.error = {
      '$schema': 'http://opentext.com/cs/json-schema/draft-04/schema#',
      'title': '{{widgetTitle}}',
      'description': '{{widgetDescription}}',
      'kind': 'tile',
      'schema': {
        'type': 'object',
        'properties': {
          'message': {
            'title': '{{messageTitle}}',
            'description': '{{messageDescription}}',
            'type': 'string'
          }
        }
      }
    };

    define('json!csui/widgets/error/error.manifest.json', {
      '$schema': 'http://opentext.com/cs/json-schema/draft-04/schema#',
      'title': '{{widgetTitle}}',
      'description': '{{widgetDescription}}',
      'kind': 'tile',
      'schema': {
        'type': 'object',
        'properties': {
          'message': {
            'title': '{{messageTitle}}',
            'description': '{{messageDescription}}',
            'type': 'string'
          }
        }
      }
    });

    localizedManifests.placeholder = {
      '$schema': 'http://opentext.com/cs/json-schema/draft-04/schema#',
      'title': 'Placeholder',
      'description': '{{widgetDescription}}',
      'kind': 'any',
      'schema': {
        'type': 'object',
        'properties': {
          'label': {
            'title': 'Label',
            'description': '{{labelDescription}}',
            'type': 'string'
          },
          'color': {
            'title': 'Foreground color',
            'description': '{{foregroundColorDescription}}',
            'type': 'string'
          },
          'bgcolor': {
            'title': 'Background color',
            'description': '{{backgroundColorDescription}}',
            'type': 'string'
          }
        }
      }
    };

    define('json!csui/widgets/placeholder/placeholder.manifest.json', {
      '$schema': 'http://opentext.com/cs/json-schema/draft-04/schema#',
      'title': '{{widgetTitle}}',
      'description': '{{widgetDescription}}',
      'kind': 'any',
      'schema': {
        'type': 'object',
        'properties': {
          'label': {
            'title': '{{labelTitle}}',
            'description': '{{labelDescription}}',
            'type': 'string'
          },
          'color': {
            'title': '{{foregroundColorTitle}}',
            'description': '{{foregroundColorDescription}}',
            'type': 'string'
          },
          'bgcolor': {
            'title': '{{backgroundColorTitle}}',
            'description': '{{backgroundColorDescription}}',
            'type': 'string'
          }
        }
      }
    });

    define('csui/widgets/placeholder/impl/nls/placeholder.manifest', {
      'root': true,
      'en-us': false,
      'en': false
    });

    define('csui/widgets/placeholder/impl/nls/root/placeholder.manifest', {
      'widgetTitle': 'Placeholder',
      'labelTitle': 'Label',
      'foregroundColorTitle': 'Foreground color',
      'backgroundColorTitle': 'Background color'
    });

  }

  function undefineWidgetManifests() {
    window.csui.require.undef('json!csui/widgets/favorites/favorites.manifest.json');
    window.csui.require.undef('csui/widgets/favorites/impl/nls/favorites.manifest');
    window.csui.require.undef('csui/widgets/favorites/impl/nls/root/favorites.manifest');
    window.csui.require.undef('json!csui/widgets/shortcut/shortcut.manifest.json');
    window.csui.require.undef('csui/widgets/shortcut/impl/nls/shortcut.manifest');
    window.csui.require.undef('csui/widgets/shortcut/impl/nls/root/shortcut.manifest');
    window.csui.require.undef('json!csui/widgets/error/error.manifest.json');
    window.csui.require.undef('json!csui/widgets/placeholder/placeholder.manifest.json');
    window.csui.require.undef('csui/widgets/placeholder/impl/nls/placeholder.manifest');
    window.csui.require.undef('csui/widgets/placeholder/impl/nls/root/placeholder.manifest');
  }

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
      },
      nodes = {
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
        }
      },
      nodesV2 = _.reduce(nodes, function (result, node, id) {
        result[id] = {
          'data': {
            properties: node
          },
          'metadata': {
            properties: nodeMetadata
          }
        };
        return result;
      }, {});

  var mocks = [];

  return {

    localizedManifests: localizedManifests,

    enable: function () {

      defineWidgetManifests();

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v1|v2/(nodes/2000|volumes/141)(\\?.*)?$'),
        responseText: {
          'data': {
            'id': 2000,
            'name': 'Enterprise',
            'type': 141
          }
        }
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v1|v2/(nodes/2003|volumes/142)(\\?.*)?$'),
        responseText: {
          'data': {
            'id': 2003,
            'name': 'Admin\'s Home',
            'type': 142
          }
        }
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/members/favorites(\\?.*)?'),
        urlParams: ['query', 'includeMetadata'],
        response: function () {
          this.responseText = {
            results: [
              nodesV2['3001'],
              nodesV2['3002'],
              nodesV2['3003'],
              nodesV2['3004'],
              nodesV2['3005'],
              nodesV2['4001'],
              nodesV2['5001']
            ]
          };
        }
      }));

      defineWidgetManifests();

    },

    disable: function () {
      var mock;
      while ((mock = mocks.pop()) != null) {
        mockjax.clear(mock);
      }

      undefineWidgetManifests();
    }

  };

});
