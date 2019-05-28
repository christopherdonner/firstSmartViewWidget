/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery',
  'csui/lib/underscore',
  'csui/lib/marionette',
  'i18n!csui/controls/table/cells/permission/impl/nls/localized.strings'
], function ($, _, Marionette, lang) {

  return [
    {
      nodeName: lang.see,
      nodeId: "see",
      nodes: [
        {
          nodeName: lang.see_contents,
          nodeId: "see_contents",
          nodeClass: "",
          nodeSplit: true,
          splitName: lang.Read,
          splitClass: "csui-split-read"
        },
        {
          nodeName: lang.modify,
          nodeId: "modify",
          nodes: [
            {nodeName: lang.edit_attributes, nodeId: "edit_attributes"},
            {nodeName: lang.add_items, nodeId: "add_items"},
            {nodeName: lang.reserve, nodeId: "reserve"},
            {
              nodeName: lang.delete_versions,
              nodeId: "delete_versions",
              nodes: [
                {
                  nodeName: lang.delete,
                  nodeId: "delete",
                  nodeSplit: true,
                  splitName: lang.Write,
                  splitClass: "csui-split-write",
                  nodes: [
                    {
                      nodeName: lang.edit_permissions,
                      nodeId: "edit_permissions",
                      nodeSplit: true,
                      splitName: lang.FullControl,
                      splitClass: "csui-split-fullcontrol"
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
});