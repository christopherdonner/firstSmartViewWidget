/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery.mockjax', 'csui/models/mixins/uploadable/uploadable.mixin'
], function (mockjax, UploadableMixin) {

  return {

    enable: function () {

      var newNodeName,
          newNodeRoles;

      UploadableMixin.mock = true;

      mockjax({
        url: '//server/otcs/cs/api/v1/validation/nodes',
        responseText: {
          results: [
            {
              id: null,
              name: 'test.txt',
              type: 144
            }
          ]
        }
      });

      mockjax({
        url: '//server/otcs/cs/api/v1/forms/nodes/create*',
        responseText: {
          forms: [
            {
              'data': {
                'parent_id': 2000,
                'type': 144
              },
              'options': {
                fields: {}
              },
              'schema': {
                properties: {}
              }
            }
          ]
        }
      });

      mockjax({
        url: '//server/otcs/cs/api/v1/nodes',
        response: function (settings) {
          newNodeName = settings.data.name;
          newNodeRoles = settings.data.roles;
          this.responseText = {
            id: settings.files.file.name === 'test.txt' ? 2001 : 2002
          };
        }
      });

      mockjax({
        url: '//server/otcs/cs/api/v2/nodes/2001*',
        responseText: {
          id: 2001,
          favorite: false,
          name: newNodeName,
          type: 144,
          create_date: '2014-07-10T14:11:31',
          create_user_id: 1000,
          description: '',
          modify_date: '2014-07-10T14:11:31',
          modify_user_id: 1000,
          parent_id: 2000,
          perm_create: true,
          perm_delete: true,
          perm_delete_versions: true,
          perm_modify: true,
          perm_modify_attributes: true,
          perm_modify_permissions: true,
          perm_reserve: true,
          perm_see: true,
          perm_see_contents: true,
          volume_id: -2000,
          mime_type: 'text/plain',
          reserved: false,
          reserved_date: null,
          reserved_user_id: null,
          size: 100,
          file_size: 100,
          roles: newNodeRoles
        }
      });

      mockjax({
        url: '//server/otcs/cs/api/v2/nodes/2002*',
        status: 500,
        responseText: {
          error: 'Unpredicted Error'
        }
      });

    },

    disable: function () {
      mockjax.clear();
      UploadableMixin.mock = false;
    }

  };

});
