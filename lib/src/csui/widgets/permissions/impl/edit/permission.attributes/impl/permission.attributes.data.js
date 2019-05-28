/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/marionette',
  'csui/models/permission/permissionlevel',
  'i18n!csui/widgets/permissions/impl/nls/lang'
], function ($, _, Marionette, PermissionLevelCollection, lang) {

  function getPermissionAttributes(options) {
    var readonly       = options.readonly !== false ? true : false,
        permissions    = options.permissions || [],
        permissionData = [
          {
            nodeName: lang.see,
            nodeId: "see",
            readonly: readonly,
            checked: permissions.indexOf("see") >= 0,
            nodes: [
              {
                nodeName: lang.see_contents,
                nodeId: "see_contents",
                nodeClass: "",
                nodeSplit: true,
                splitName: lang.Read,
                splitClass: "csui-split-read",
                readonly: readonly,
                checked: permissions.indexOf("see_contents") >= 0,
              },
              {
                nodeName: lang.modify,
                nodeId: "modify",
                readonly: readonly,
                checked: permissions.indexOf("modify") >= 0,
                nodes: [
                  {
                    nodeName: lang.edit_attributes,
                    nodeId: "edit_attributes",
                    readonly: readonly,
                    checked: permissions.indexOf("edit_attributes") >= 0
                  },
                  {
                    nodeName: lang.reserve,
                    nodeId: "reserve",
                    readonly: readonly,
                    checked: permissions.indexOf("reserve") >= 0,
                    nodes: [
                      {
                        nodeName: lang.addMajorVersion,
                        nodeId: "add_major_version",
                        readonly: readonly,
                        checked: permissions.indexOf("add_major_version") >= 0
                      }
                    ]
                  },
                  {
                    nodeName: lang.delete_versions,
                    nodeId: "delete_versions",
                    readonly: readonly,
                    checked: permissions.indexOf("delete_versions") >= 0,
                    nodes: [
                      {
                        nodeName: lang.delete,
                        nodeId: "delete",
                        nodeSplit: true,
                        splitName: lang.Write,
                        splitClass: "csui-split-write",
                        readonly: readonly,
                        checked: permissions.indexOf("delete") >= 0,
                        nodes: [
                          {
                            nodeName: lang.edit_permissions,
                            nodeId: "edit_permissions",
                            nodeSplit: true,
                            splitName: lang.FullControl,
                            splitClass: "csui-split-fullcontrol",
                            readonly: readonly,
                            checked: permissions.indexOf("edit_permissions") >= 0
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ];

    if (options.node && options.node.get('container')) {
      permissionData[0].nodes[1].nodes.splice(1, 0, {
        nodeName: lang.add_items,
        nodeId: "add_items",
        readonly: readonly,
        checked: permissions.indexOf("add_items") >= 0
      });
    }

    return new PermissionLevelCollection(permissionData);
  }

  return {

    getPermissionAttributes: getPermissionAttributes
  };
});