/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
    'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/jquery.mockjax',
    'csui/lib/jquery.parse.param', 'json!./thumbnail.data.json',
    'csui/utils/deepClone/deepClone'
  ], function (_, $, mockjax, parseParam, mocked) {
    'use strict';

    _.extend($.mockjaxSettings, {
        responseTime: 0,
        headers: {}
      });
  
    _.each(_.range(2002, 2105, 1), function (id) {
      var node = _.deepClone(mocked.nodes[2001]);
      node.id = id;
      node.name = 'Child ' + (id - 2000);
      mocked.nodes[id] = node;
    });
  
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
        var path = includeSelf ? [node] : [],
            parent_id = node.parent_id.id || node.parent_id;
        if (parent_id > 0) {
          path = getAncestors(parent_id, true).concat(path);
        }
        return path;
      }
    }
  
    function getNodeActions(node) {
      return _.chain(mocked.actions[node.type] || [])
              .reduce(function (result, action) {
                result[action] = {};
                return result;
              }, {})
              .value();
    }

  
    return {
    enable: function () {
      var newNodeName,
          newNodeRoles;
      
      mockjax({
        url: '//server/otcs/cs/api/v1/nodes/2000/addablenodetypes',
        type: 'GET',
        responseText: {"data":{"Collection":"api\/v1\/forms\/nodes\/create?type=298&parent_id=5752567","compound_document":"api\/v1\/forms\/nodes\/create?type=136&parent_id=5752567","document":"api\/v1\/forms\/nodes\/create?type=144&parent_id=5752567","email_folder":"api\/v1\/forms\/nodes\/create?type=751&parent_id=5752567","folder":"api\/v1\/forms\/nodes\/create?type=0&parent_id=5752567","physical_item":"api\/v1\/forms\/nodes\/create?type=411&parent_id=5752567","shortcut":"api\/v1\/forms\/nodes\/create?type=1&parent_id=5752567","tasklist":"api\/v1\/forms\/nodes\/create?type=204&parent_id=5752567","url":"api\/v1\/forms\/nodes\/create?type=140&parent_id=5752567","Wiki":"api\/v1\/forms\/nodes\/create?type=5573&parent_id=5752567"},"definitions":{"Collection":{"body":"","content_type":"","display_hint":"","display_href":"","handler":"form","image":"\/alphasupport\/collections\/collection.gif","method":"GET","name":"Collection","parameters":{},"tab_href":"","type":298},"compound_document":{"body":"","content_type":"","display_hint":"","display_href":"","handler":"form","image":"\/alphasupport\/webdoc\/cd.gif","method":"GET","name":"Compound Document","parameters":{},"tab_href":"","type":136},"document":{"body":"","content_type":"","display_hint":"","display_href":"","handler":"form","image":"\/alphasupport\/webdoc\/doc.gif","method":"GET","name":"Document","parameters":{},"tab_href":"","type":144},"email_folder":{"body":"","content_type":"","display_hint":"","display_href":"","handler":"form","image":"\/alphasupport\/otemail\/emailfolder.gif","method":"GET","name":"Email Folder","parameters":{},"tab_href":"","type":751},"folder":{"body":"","content_type":"","display_hint":"","display_href":"","handler":"form","image":"\/alphasupport\/webdoc\/folder.gif","method":"GET","name":"Folder","parameters":{},"tab_href":"","type":0},"physical_item":{"body":"","content_type":"","display_hint":"","display_href":"","handler":"form","image":"\/alphasupport\/physicalobjects\/physical_item.gif","method":"GET","name":"Physical Item","parameters":{},"tab_href":"","type":411},"shortcut":{"body":"","content_type":"","display_hint":"","display_href":"","handler":"form","image":"\/alphasupport\/tinyali.gif","method":"GET","name":"Shortcut","parameters":{},"tab_href":"","type":1},"tasklist":{"body":"","content_type":"","display_hint":"","display_href":"","handler":"form","image":"\/alphasupport\/task\/16tasklist.gif","method":"GET","name":"Task List","parameters":{},"tab_href":"","type":204},"url":{"body":"","content_type":"","display_hint":"","display_href":"","handler":"form","image":"\/alphasupport\/webdoc\/url.gif","method":"GET","name":"URL","parameters":{},"tab_href":"","type":140},"Wiki":{"body":"","content_type":"","display_hint":"","display_href":"","handler":"form","image":"\/alphasupport\/wiki\/wiki.gif","method":"GET","name":"Wiki","parameters":{},"tab_href":"","type":5573}},"definitions_map":{},"definitions_order":["Collection","compound_document","document","email_folder","folder","physical_item","shortcut","tasklist","url","Wiki"]}
      });

      mockjax({
        url: '//server/otcs/cs/api/v2/nodes/actions?reference_id=2000&ids=604999&ids=16958113&ids=749454&ids=1275805&ids=16874073&ids=205659&ids=2904354&ids=69544&ids=422005&ids=12961203&ids=69554&ids=2597252&ids=2597472&ids=2597473&ids=2597474&ids=2597475&ids=2598132&ids=16888373&ids=10130097&ids=1708595&ids=9343940&ids=220123&ids=408261&ids=17237852&ids=17778262&ids=1450416&ids=1725994&ids=67449&ids=17574212&ids=386124&actions=addversion&actions=browse&actions=copy&actions=delete&actions=edit&actions=rename&actions=move&actions=permissions&actions=properties&actions=reserve&actions=unreserve',
        type: 'GET',
        responseText: {
          "links":{
            "data":{
              "self":{
                "body":"",
                "content_type":"",
                "href":"\/api\/v2\/nodes\/actions?actions=addversion&actions=copy&actions=delete&actions=edit&actions=rename&actions=move&actions=permissions&actions=properties&actions=reserve&actions=unreserve&ids=604999&ids=16958113&ids=749454&ids=1275805&ids=16874073&ids=205659&ids=2904354&ids=69544&ids=422005&ids=12961203&ids=69554&ids=2597252&ids=2597472&ids=2597473&ids=2597474&ids=2597475&ids=2598132&ids=16888373&ids=10130097&ids=1708595&ids=9343940&ids=220123&ids=408261&ids=17237852&ids=17778262&ids=1450416&ids=1725994&ids=67449&ids=17574212&ids=386124&reference_id=2000","method":"GET","name":""
              }
            }
          },
          "results":{
            "67449":{
              "data":{
                "copy":{
                  "body":"",
                  "content_type":"",
                  "form_href":"\/api\/v2\/forms\/nodes\/copy?id=67449","href":"\/api\/v2\/nodes","method":"POST","name":"Copy"},
                  "delete":{
                    "body":"",
                    "content_type":"",
                    "form_href":"",
                    "href":"\/api\/v2\/nodes\/67449","method":"DELETE","name":"Delete"},
                    "move":{
                      "body":"",
                      "content_type":"",
                      "form_href":"\/api\/v2\/forms\/nodes\/move?id=67449",
                      "href":"\/api\/v2\/nodes\/67449","method":"PUT","name":"Move"},
                      "permissions":{
                        "body":"",
                        "content_type":"",
                        "form_href":"",
                        "href":"",
                        "method":"",
                        "name":"Permissions"
                      },
                      "properties":{
                        "body":"",
                        "content_type":"",
                        "form_href":"",
                        "href":"\/api\/v2\/nodes\/67449","method":"GET","name":"Properties"
                      },
                      "rename":{
                        "body":"",
                        "content_type":"",
                        "form_href":"\/api\/v2\/forms\/nodes\/rename?id=67449",
                        "href":"\/api\/v2\/nodes\/67449","method":"PUT","name":"Rename"}
                      },
                      "map":{
                        "default_action":"open",
                        "more":["properties"]
                      },
                      "order":["rename","copy","move","permissions","delete"]
                    },
                    "69544":{
                      "data":{
                        "copy":{
                          "body":"",
                          "content_type":"",
                          "form_href":"\/api\/v2\/forms\/nodes\/copy?id=69544","href":"\/api\/v2\/nodes","method":"POST","name":"Copy"},
                          "delete":{"body":"","content_type":"","form_href":"","href":"\/api\/v2\/nodes\/69544","method":"DELETE","name":"Delete"},
                          "move":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/move?id=69544","href":"\/api\/v2\/nodes\/69544","method":"PUT","name":"Move"},
                          "permissions":{"body":"","content_type":"","form_href":"","href":"","method":"","name":"Permissions"},
                          "properties":{"body":"","content_type":"","form_href":"","href":"\/api\/v2\/nodes\/69544","method":"GET","name":"Properties"},
                          "rename":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/rename?id=69544","href":"\/api\/v2\/nodes\/69544","method":"PUT","name":"Rename"}},
                          "map":{"default_action":"open","more":["properties"]},
                          "order":["rename","copy","move","permissions","delete"]},
                          "69554":{"data":{"copy":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/copy?id=69554","href":"\/api\/v2\/nodes","method":"POST","name":"Copy"},
                          "delete":{"body":"","content_type":"","form_href":"","href":"\/api\/v2\/nodes\/69554","method":"DELETE","name":"Delete"},
                          "move":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/move?id=69554","href":"\/api\/v2\/nodes\/69554","method":"PUT","name":"Move"},"permissions":{"body":"","content_type":"","form_href":"","href":"","method":"","name":"Permissions"},
                          "properties":{"body":"","content_type":"","form_href":"","href":"\/api\/v2\/nodes\/69554","method":"GET","name":"Properties"},
                          "rename":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/rename?id=69554","href":"\/api\/v2\/nodes\/69554","method":"PUT","name":"Rename"}},"map":{"default_action":"open","more":["properties"]},"order":["rename","copy","move","permissions","delete"]},
                          "205659":{"data":{
                            "copy":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/copy?id=205659","href":"\/api\/v2\/nodes","method":"POST","name":"Copy"},"delete":{"body":"","content_type":"","form_href":"","href":"\/api\/v2\/nodes\/205659","method":"DELETE","name":"Delete"},
                            "move":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/move?id=205659","href":"\/api\/v2\/nodes\/205659","method":"PUT","name":"Move"},"permissions":{"body":"","content_type":"","form_href":"","href":"","method":"","name":"Permissions"},
                            "properties":{"body":"","content_type":"","form_href":"","href":"\/api\/v2\/nodes\/205659","method":"GET","name":"Properties"},
                            "rename":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/rename?id=205659","href":"\/api\/v2\/nodes\/205659","method":"PUT","name":"Rename"}},"map":{"default_action":"open","more":["properties"]},"order":["rename","copy","move","permissions","delete"]},
                            "220123":{"data":{
                              "copy":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/copy?id=220123","href":"\/api\/v2\/nodes","method":"POST","name":"Copy"},
                              "delete":{"body":"","content_type":"","form_href":"","href":"\/api\/v2\/nodes\/220123","method":"DELETE","name":"Delete"},
                              "move":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/move?id=220123","href":"\/api\/v2\/nodes\/220123","method":"PUT","name":"Move"},"permissions":{"body":"","content_type":"","form_href":"","href":"","method":"","name":"Permissions"},
                              "properties":{"body":"","content_type":"","form_href":"","href":"\/api\/v2\/nodes\/220123","method":"GET","name":"Properties"},
                              "rename":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/rename?id=220123","href":"\/api\/v2\/nodes\/220123","method":"PUT","name":"Rename"}},"map":{"default_action":"open","more":["properties"]},"order":["rename","copy","move","permissions","delete"]},
                              "386124":{"data":{"copy":{"body":"","content_type":"",
                              "form_href":"\/api\/v2\/forms\/nodes\/copy?id=386124","href":"\/api\/v2\/nodes","method":"POST","name":"Copy"},
                              "delete":{"body":"","content_type":"","form_href":"","href":"\/api\/v2\/nodes\/386124","method":"DELETE",
                              "name":"Delete"},"move":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/move?id=386124",
                              "href":"\/api\/v2\/nodes\/386124","method":"PUT","name":"Move"},
                              "permissions":{"body":"","content_type":"","form_href":"","href":"","method":"","name":"Permissions"},
                              "properties":{"body":"","content_type":"","form_href":"","href":"\/api\/v2\/nodes\/386124","method":"GET","name":"Properties"},
                              "rename":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/rename?id=386124","href":"\/api\/v2\/nodes\/386124","method":"PUT","name":"Rename"}},"map":{"default_action":"open","more":["properties"]},"order":["rename","copy","move","permissions","delete"]},
                              "408261":{"data":{"copy":{"body":"","content_type":"",
                              "form_href":"\/api\/v2\/forms\/nodes\/copy?id=408261","href":"\/api\/v2\/nodes","method":"POST","name":"Copy"},"delete":{"body":"","content_type":"","form_href":"",
                              "href":"\/api\/v2\/nodes\/408261","method":"DELETE","name":"Delete"},"move":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/move?id=408261","href":"\/api\/v2\/nodes\/408261","method":"PUT","name":"Move"},"permissions":{"body":"","content_type":"","form_href":"","href":"","method":"","name":"Permissions"},
                              "properties":{"body":"","content_type":"","form_href":"","href":"\/api\/v2\/nodes\/408261","method":"GET","name":"Properties"},
                              "rename":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/rename?id=408261","href":"\/api\/v2\/nodes\/408261","method":"PUT","name":"Rename"}},"map":{"default_action":"open","more":["properties"]},"order":["rename","copy","move","permissions","delete"]},
                              "422005":{"data":{"copy":{"body":"","content_type":"",
                              "form_href":"\/api\/v2\/forms\/nodes\/copy?id=422005","href":"\/api\/v2\/nodes","method":"POST","name":"Copy"},
                              "delete":{"body":"","content_type":"","form_href":"","href":"\/api\/v2\/nodes\/422005","method":"DELETE","name":"Delete"},
                              "move":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/move?id=422005","href":"\/api\/v2\/nodes\/422005","method":"PUT","name":"Move"},"permissions":{"body":"","content_type":"","form_href":"","href":"","method":"","name":"Permissions"},
                              "properties":{"body":"","content_type":"","form_href":"","href":"\/api\/v2\/nodes\/422005","method":"GET","name":"Properties"},
                              "rename":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/rename?id=422005","href":"\/api\/v2\/nodes\/422005","method":"PUT","name":"Rename"}},"map":{"default_action":"open","more":["properties"]},"order":["rename","copy","move","permissions","delete"]},"604999":{"data":{"copy":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/copy?id=604999","href":"\/api\/v2\/nodes","method":"POST","name":"Copy"},"delete":{"body":"","content_type":"","form_href":"","href":"\/api\/v2\/nodes\/604999","method":"DELETE","name":"Delete"},"move":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/move?id=604999","href":"\/api\/v2\/nodes\/604999","method":"PUT","name":"Move"},"permissions":{"body":"","content_type":"","form_href":"","href":"","method":"","name":"Permissions"},"properties":{"body":"","content_type":"","form_href":"","href":"\/api\/v2\/nodes\/604999","method":"GET","name":"Properties"},"rename":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/rename?id=604999","href":"\/api\/v2\/nodes\/604999","method":"PUT","name":"Rename"}},"map":{"default_action":"open","more":["properties"]},"order":["rename","copy","move","permissions","delete"]},"749454":{"data":{"copy":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/copy?id=749454","href":"\/api\/v2\/nodes","method":"POST","name":"Copy"},"delete":{"body":"","content_type":"","form_href":"","href":"\/api\/v2\/nodes\/749454","method":"DELETE","name":"Delete"},"move":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/move?id=749454","href":"\/api\/v2\/nodes\/749454","method":"PUT","name":"Move"},"permissions":{"body":"","content_type":"","form_href":"","href":"","method":"","name":"Permissions"},"properties":{"body":"","content_type":"","form_href":"","href":"\/api\/v2\/nodes\/749454","method":"GET","name":"Properties"},"rename":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/rename?id=749454","href":"\/api\/v2\/nodes\/749454","method":"PUT","name":"Rename"}},"map":{"default_action":"open","more":["properties"]},"order":["rename","copy","move","permissions","delete"]},"1275805":{"data":{"copy":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/copy?id=1275805","href":"\/api\/v2\/nodes","method":"POST","name":"Copy"},"delete":{"body":"","content_type":"","form_href":"","href":"\/api\/v2\/nodes\/1275805","method":"DELETE","name":"Delete"},"move":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/move?id=1275805","href":"\/api\/v2\/nodes\/1275805","method":"PUT","name":"Move"},"permissions":{"body":"","content_type":"","form_href":"","href":"","method":"","name":"Permissions"},"properties":{"body":"","content_type":"","form_href":"","href":"\/api\/v2\/nodes\/1275805","method":"GET","name":"Properties"},"rename":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/rename?id=1275805","href":"\/api\/v2\/nodes\/1275805","method":"PUT","name":"Rename"}},"map":{"default_action":"open","more":["properties"]},"order":["rename","copy","move","permissions","delete"]},"1450416":{"data":{"copy":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/copy?id=1450416","href":"\/api\/v2\/nodes","method":"POST","name":"Copy"},"delete":{"body":"","content_type":"","form_href":"","href":"\/api\/v2\/nodes\/1450416","method":"DELETE","name":"Delete"},"move":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/move?id=1450416","href":"\/api\/v2\/nodes\/1450416","method":"PUT","name":"Move"},"permissions":{"body":"","content_type":"","form_href":"","href":"","method":"","name":"Permissions"},"properties":{"body":"","content_type":"","form_href":"","href":"\/api\/v2\/nodes\/1450416","method":"GET","name":"Properties"},"rename":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/rename?id=1450416","href":"\/api\/v2\/nodes\/1450416","method":"PUT","name":"Rename"}},"map":{"default_action":"open","more":["properties"]},"order":["rename","copy","move","permissions","delete"]},"1708595":{"data":{"copy":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/copy?id=1708595","href":"\/api\/v2\/nodes","method":"POST","name":"Copy"},"delete":{"body":"","content_type":"","form_href":"","href":"\/api\/v2\/nodes\/1708595","method":"DELETE","name":"Delete"},"move":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/move?id=1708595","href":"\/api\/v2\/nodes\/1708595","method":"PUT","name":"Move"},"permissions":{"body":"","content_type":"","form_href":"","href":"","method":"","name":"Permissions"},"properties":{"body":"","content_type":"","form_href":"","href":"\/api\/v2\/nodes\/1708595","method":"GET","name":"Properties"},"rename":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/rename?id=1708595","href":"\/api\/v2\/nodes\/1708595","method":"PUT","name":"Rename"}},"map":{"default_action":"open","more":["properties"]},"order":["rename","copy","move","permissions","delete"]},"1725994":{"data":{"copy":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/copy?id=1725994","href":"\/api\/v2\/nodes","method":"POST","name":"Copy"},"delete":{"body":"","content_type":"","form_href":"","href":"\/api\/v2\/nodes\/1725994","method":"DELETE","name":"Delete"},"move":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/move?id=1725994","href":"\/api\/v2\/nodes\/1725994","method":"PUT","name":"Move"},"permissions":{"body":"","content_type":"","form_href":"","href":"","method":"","name":"Permissions"},"properties":{"body":"","content_type":"","form_href":"","href":"\/api\/v2\/nodes\/1725994","method":"GET","name":"Properties"},"rename":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/rename?id=1725994","href":"\/api\/v2\/nodes\/1725994","method":"PUT","name":"Rename"}},"map":{"default_action":"open","more":["properties"]},"order":["rename","copy","move","permissions","delete"]},"2597252":{"data":{"permissions":{"body":"","content_type":"","form_href":"","href":"","method":"","name":"Permissions"},"properties":{"body":"","content_type":"","form_href":"","href":"\/api\/v2\/nodes\/2597252","method":"GET","name":"Properties"}},"map":{"default_action":"","more":["properties"]},"order":["permissions"]},"2597472":{"data":{"permissions":{"body":"","content_type":"","form_href":"","href":"","method":"","name":"Permissions"},"properties":{"body":"","content_type":"","form_href":"","href":"\/api\/v2\/nodes\/2597472","method":"GET","name":"Properties"}},"map":{"default_action":"","more":["properties"]},"order":["permissions"]},"2597473":{"data":{"permissions":{"body":"","content_type":"","form_href":"","href":"","method":"","name":"Permissions"},"properties":{"body":"","content_type":"","form_href":"","href":"\/api\/v2\/nodes\/2597473","method":"GET","name":"Properties"}},"map":{"default_action":"","more":["properties"]},"order":["permissions"]},"2597474":{"data":{"permissions":{"body":"","content_type":"","form_href":"","href":"","method":"","name":"Permissions"},"properties":{"body":"","content_type":"","form_href":"","href":"\/api\/v2\/nodes\/2597474","method":"GET","name":"Properties"}},"map":{"default_action":"","more":["properties"]},"order":["permissions"]},"2597475":{"data":{"permissions":{"body":"","content_type":"","form_href":"","href":"","method":"","name":"Permissions"},"properties":{"body":"","content_type":"","form_href":"","href":"\/api\/v2\/nodes\/2597475","method":"GET","name":"Properties"}},"map":{"default_action":"","more":["properties"]},"order":["permissions"]},"2598132":{"data":{"permissions":{"body":"","content_type":"","form_href":"","href":"","method":"","name":"Permissions"},"properties":{"body":"","content_type":"","form_href":"","href":"\/api\/v2\/nodes\/2598132","method":"GET","name":"Properties"}},"map":{"default_action":"","more":["properties"]},"order":["permissions"]},"2904354":{"data":{"copy":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/copy?id=2904354","href":"\/api\/v2\/nodes","method":"POST","name":"Copy"},"delete":{"body":"","content_type":"","form_href":"","href":"\/api\/v2\/nodes\/2904354","method":"DELETE","name":"Delete"},"move":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/move?id=2904354","href":"\/api\/v2\/nodes\/2904354","method":"PUT","name":"Move"},"permissions":{"body":"","content_type":"","form_href":"","href":"","method":"","name":"Permissions"},"properties":{"body":"","content_type":"","form_href":"","href":"\/api\/v2\/nodes\/2904354","method":"GET","name":"Properties"},"rename":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/rename?id=2904354","href":"\/api\/v2\/nodes\/2904354","method":"PUT","name":"Rename"}},"map":{"default_action":"open","more":["properties"]},"order":["rename","copy","move","permissions","delete"]},"9343940":{"data":{"copy":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/copy?id=9343940","href":"\/api\/v2\/nodes","method":"POST","name":"Copy"},"delete":{"body":"","content_type":"","form_href":"","href":"\/api\/v2\/nodes\/9343940","method":"DELETE","name":"Delete"},"move":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/move?id=9343940","href":"\/api\/v2\/nodes\/9343940","method":"PUT","name":"Move"},"permissions":{"body":"","content_type":"","form_href":"","href":"","method":"","name":"Permissions"},"properties":{"body":"","content_type":"","form_href":"","href":"\/api\/v2\/nodes\/9343940","method":"GET","name":"Properties"},"rename":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/rename?id=9343940","href":"\/api\/v2\/nodes\/9343940","method":"PUT","name":"Rename"}},"map":{"default_action":"open","more":["properties"]},"order":["rename","copy","move","permissions","delete"]},"10130097":{"data":{"copy":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/copy?id=10130097","href":"\/api\/v2\/nodes","method":"POST","name":"Copy"},"delete":{"body":"","content_type":"","form_href":"","href":"\/api\/v2\/nodes\/10130097","method":"DELETE","name":"Delete"},"move":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/move?id=10130097","href":"\/api\/v2\/nodes\/10130097","method":"PUT","name":"Move"},"permissions":{"body":"","content_type":"","form_href":"","href":"","method":"","name":"Permissions"},"properties":{"body":"","content_type":"","form_href":"","href":"\/api\/v2\/nodes\/10130097","method":"GET","name":"Properties"},"rename":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/rename?id=10130097","href":"\/api\/v2\/nodes\/10130097","method":"PUT","name":"Rename"}},"map":{"default_action":"open","more":["properties"]},"order":["rename","copy","move","permissions","delete"]},"12961203":{"data":{"copy":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/copy?id=12961203","href":"\/api\/v2\/nodes","method":"POST","name":"Copy"},"delete":{"body":"","content_type":"","form_href":"","href":"\/api\/v2\/nodes\/12961203","method":"DELETE","name":"Delete"},"move":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/move?id=12961203","href":"\/api\/v2\/nodes\/12961203","method":"PUT","name":"Move"},"permissions":{"body":"","content_type":"","form_href":"","href":"","method":"","name":"Permissions"},"properties":{"body":"","content_type":"","form_href":"","href":"\/api\/v2\/nodes\/12961203","method":"GET","name":"Properties"},"rename":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/rename?id=12961203","href":"\/api\/v2\/nodes\/12961203","method":"PUT","name":"Rename"}},"map":{"default_action":"open","more":["properties"]},"order":["rename","copy","move","permissions","delete"]},"16874073":{"data":{"copy":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/copy?id=16874073","href":"\/api\/v2\/nodes","method":"POST","name":"Copy"},"delete":{"body":"","content_type":"","form_href":"","href":"\/api\/v2\/nodes\/16874073","method":"DELETE","name":"Delete"},"move":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/move?id=16874073","href":"\/api\/v2\/nodes\/16874073","method":"PUT","name":"Move"},"permissions":{"body":"","content_type":"","form_href":"","href":"","method":"","name":"Permissions"},"properties":{"body":"","content_type":"","form_href":"","href":"\/api\/v2\/nodes\/16874073","method":"GET","name":"Properties"},"rename":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/rename?id=16874073","href":"\/api\/v2\/nodes\/16874073","method":"PUT","name":"Rename"}},"map":{"default_action":"","more":["properties"]},"order":["rename","copy","move","permissions","delete"]},"16888373":{"data":{"addversion":{"body":"","content_type":"","form_href":"","href":"\/api\/v2\/nodes\/16888373\/versions","method":"POST","name":"Add Version"},"copy":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/copy?id=16888373","href":"\/api\/v2\/nodes","method":"POST","name":"Copy"},"delete":{"body":"","content_type":"","form_href":"","href":"\/api\/v2\/nodes\/16888373","method":"DELETE","name":"Delete"},"edit":{"body":"","content_type":"","form_href":"","href":"func=Edit.Edit&nodeid=16888373&uiType=2","method":"GET","name":"Edit"},"move":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/move?id=16888373","href":"\/api\/v2\/nodes\/16888373","method":"PUT","name":"Move"},"permissions":{"body":"","content_type":"","form_href":"","href":"","method":"","name":"Permissions"},"properties":{"body":"","content_type":"","form_href":"","href":"\/api\/v2\/nodes\/16888373","method":"GET","name":"Properties"},"rename":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/rename?id=16888373","href":"\/api\/v2\/nodes\/16888373","method":"PUT","name":"Rename"},"reserve":{"body":"reserved_user_id=1000","content_type":"application\/x-www-form-urlencoded","form_href":"","href":"\/api\/v2\/nodes\/16888373","method":"PUT","name":"Reserve"}},"map":{"default_action":"open","more":["properties"]},"order":["edit","addversion","rename","copy","move","permissions","reserve","delete"]},"16958113":{"data":{"copy":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/copy?id=16958113","href":"\/api\/v2\/nodes","method":"POST","name":"Copy"},"delete":{"body":"","content_type":"","form_href":"","href":"\/api\/v2\/nodes\/16958113","method":"DELETE","name":"Delete"},"move":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/move?id=16958113","href":"\/api\/v2\/nodes\/16958113","method":"PUT","name":"Move"},"permissions":{"body":"","content_type":"","form_href":"","href":"","method":"","name":"Permissions"},"properties":{"body":"","content_type":"","form_href":"","href":"\/api\/v2\/nodes\/16958113","method":"GET","name":"Properties"},"rename":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/rename?id=16958113","href":"\/api\/v2\/nodes\/16958113","method":"PUT","name":"Rename"}},"map":{"default_action":"open","more":["properties"]},"order":["rename","copy","move","permissions","delete"]},"17237852":{"data":{"copy":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/copy?id=17237852","href":"\/api\/v2\/nodes","method":"POST","name":"Copy"},"delete":{"body":"","content_type":"","form_href":"","href":"\/api\/v2\/nodes\/17237852","method":"DELETE","name":"Delete"},"move":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/move?id=17237852","href":"\/api\/v2\/nodes\/17237852","method":"PUT","name":"Move"},"permissions":{"body":"","content_type":"","form_href":"","href":"","method":"","name":"Permissions"},"properties":{"body":"","content_type":"","form_href":"","href":"\/api\/v2\/nodes\/17237852","method":"GET","name":"Properties"},"rename":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/rename?id=17237852","href":"\/api\/v2\/nodes\/17237852","method":"PUT","name":"Rename"}},"map":{"default_action":"","more":["properties"]},"order":["rename","copy","move","permissions","delete"]},"17574212":{"data":{"copy":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/copy?id=17574212","href":"\/api\/v2\/nodes","method":"POST","name":"Copy"},"delete":{"body":"","content_type":"","form_href":"","href":"\/api\/v2\/nodes\/17574212","method":"DELETE","name":"Delete"},"move":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/move?id=17574212","href":"\/api\/v2\/nodes\/17574212","method":"PUT","name":"Move"},"permissions":{"body":"","content_type":"","form_href":"","href":"","method":"","name":"Permissions"},"properties":{"body":"","content_type":"","form_href":"","href":"\/api\/v2\/nodes\/17574212","method":"GET","name":"Properties"},"rename":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/rename?id=17574212","href":"\/api\/v2\/nodes\/17574212","method":"PUT","name":"Rename"}},"map":{"default_action":"open","more":["properties"]},"order":["rename","copy","move","permissions","delete"]},"17778262":{"data":{"copy":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/copy?id=17778262","href":"\/api\/v2\/nodes","method":"POST","name":"Copy"},"delete":{"body":"","content_type":"","form_href":"","href":"\/api\/v2\/nodes\/17778262","method":"DELETE","name":"Delete"},"move":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/move?id=17778262","href":"\/api\/v2\/nodes\/17778262","method":"PUT","name":"Move"},"permissions":{"body":"","content_type":"","form_href":"","href":"","method":"","name":"Permissions"},"properties":{"body":"","content_type":"","form_href":"","href":"\/api\/v2\/nodes\/17778262","method":"GET","name":"Properties"},"rename":{"body":"","content_type":"","form_href":"\/api\/v2\/forms\/nodes\/rename?id=17778262","href":"\/api\/v2\/nodes\/17778262","method":"PUT","name":"Rename"}},"map":{"default_action":"open","more":["properties"]},"order":["rename","copy","move","permissions","delete"]}}}
      });

      mockjax({
        url: '//server/otcs/cs/api/v2/nodes/actions?ids=604999&actions=addcategory&actions=editactivex&actions=editofficeonline&actions=editwebdav&actions=favorite&actions=nonfavorite&actions=favorite_rename&actions=description&actions=thumbnail&actions=savefilter&actions=collectionCanCollect&actions=removefromcollection',
        type: 'GET',
        responseText: {"links":{"data":{"self":{"body":"","content_type":"","href":"\/api\/v2\/nodes\/actions?actions=addcategory&actions=editactivex&actions=editofficeonline&actions=collectioncancollect&actions=removefromcollection&ids=604999","method":"GET","name":""}}},"results":{"604999":{"data":{"addcategory":{"body":"","content_type":"","form_href":"","href":"\/api\/v2\/nodes\/604999\/categories","method":"POST","name":"Add Category"}},"map":{"default_action":"open"},"order":["addcategory"]}}}
      });

      mockjax({
        url: '//server/otcs/cs/api/v1/nodes/2000/nodes?extra=false&actions=false&expand=%5Bobject+Object%5D&commands=default&commands=open&commands=download&limit=30&page=1&sort=asc_name',
        type: 'GET',
        responseText: {}
      });
        mockjax({
          url: new RegExp('^//server/otcs/cs/api/v2/nodes/actions(?:\\?(.*))?$'),
          urlParams: ['query'], // ids, actions
          responseText: {  
              "links":{  
                 "data":{  
                    "self":{  
                       "body":"",
                       "content_type":"",
                       "href":"\/api\/v2\/nodes\/actions?actions=addversion&actions=copy&actions=delete&actions=edit&actions=rename&actions=move&actions=permissions&actions=properties&actions=reserve&actions=unreserve&ids=5752677&ids=5752347&reference_id=5752567",
                       "method":"GET",
                       "name":""
                    }
                 }
              },
              "results":{  
                 "5752347":{  
                    "data":{  
                       "addversion":{  
                          "body":"",
                          "content_type":"",
                          "form_href":"",
                          "href":"\/api\/v2\/nodes\/5752347\/versions",
                          "method":"POST",
                          "name":"Add Version"
                       },
                       "copy":{  
                          "body":"",
                          "content_type":"",
                          "form_href":"\/api\/v2\/forms\/nodes\/copy?id=5752347",
                          "href":"\/api\/v2\/nodes",
                          "method":"POST",
                          "name":"Copy"
                       },
                       "delete":{  
                          "body":"",
                          "content_type":"",
                          "form_href":"",
                          "href":"\/api\/v2\/nodes\/5752347",
                          "method":"DELETE",
                          "name":"Delete"
                       },
                       "edit":{  
                          "body":"",
                          "content_type":"",
                          "form_href":"",
                          "href":"func=Edit.Edit&nodeid=5752347&uiType=2",
                          "method":"GET",
                          "name":"Edit"
                       },
                       "move":{  
                          "body":"",
                          "content_type":"",
                          "form_href":"\/api\/v2\/forms\/nodes\/move?id=5752347",
                          "href":"\/api\/v2\/nodes\/5752347",
                          "method":"PUT",
                          "name":"Move"
                       },
                       "permissions":{  
                          "body":"",
                          "content_type":"",
                          "form_href":"",
                          "href":"",
                          "method":"",
                          "name":"Permissions"
                       },
                       "properties":{  
                          "body":"",
                          "content_type":"",
                          "form_href":"",
                          "href":"\/api\/v2\/nodes\/5752347",
                          "method":"GET",
                          "name":"Properties"
                       },
                       "rename":{  
                          "body":"",
                          "content_type":"",
                          "form_href":"\/api\/v2\/forms\/nodes\/rename?id=5752347",
                          "href":"\/api\/v2\/nodes\/5752347",
                          "method":"PUT",
                          "name":"Rename"
                       },
                       "reserve":{  
                          "body":"reserved_user_id=1000",
                          "content_type":"application\/x-www-form-urlencoded",
                          "form_href":"",
                          "href":"\/api\/v2\/nodes\/5752347",
                          "method":"PUT",
                          "name":"Reserve"
                       }
                    },
                    "map":{  
                       "default_action":"open",
                       "more":[  
                          "properties"
                       ]
                    },
                    "order":[  
                       "edit",
                       "addversion",
                       "rename",
                       "copy",
                       "move",
                       "permissions",
                       "reserve",
                       "delete"
                    ]
                 },
                 "5752677":{  
                    "data":{  
                       "addversion":{  
                          "body":"",
                          "content_type":"",
                          "form_href":"",
                          "href":"\/api\/v2\/nodes\/5752677\/versions",
                          "method":"POST",
                          "name":"Add Version"
                       },
                       "copy":{  
                          "body":"",
                          "content_type":"",
                          "form_href":"\/api\/v2\/forms\/nodes\/copy?id=5752677",
                          "href":"\/api\/v2\/nodes",
                          "method":"POST",
                          "name":"Copy"
                       },
                       "delete":{  
                          "body":"",
                          "content_type":"",
                          "form_href":"",
                          "href":"\/api\/v2\/nodes\/5752677",
                          "method":"DELETE",
                          "name":"Delete"
                       },
                       "edit":{  
                          "body":"",
                          "content_type":"",
                          "form_href":"",
                          "href":"func=Edit.Edit&nodeid=5752677&uiType=2",
                          "method":"GET",
                          "name":"Edit"
                       },
                       "move":{  
                          "body":"",
                          "content_type":"",
                          "form_href":"\/api\/v2\/forms\/nodes\/move?id=5752677",
                          "href":"\/api\/v2\/nodes\/5752677",
                          "method":"PUT",
                          "name":"Move"
                       },
                       "permissions":{  
                          "body":"",
                          "content_type":"",
                          "form_href":"",
                          "href":"",
                          "method":"",
                          "name":"Permissions"
                       },
                       "properties":{  
                          "body":"",
                          "content_type":"",
                          "form_href":"",
                          "href":"\/api\/v2\/nodes\/5752677",
                          "method":"GET",
                          "name":"Properties"
                       },
                       "rename":{  
                          "body":"",
                          "content_type":"",
                          "form_href":"\/api\/v2\/forms\/nodes\/rename?id=5752677",
                          "href":"\/api\/v2\/nodes\/5752677",
                          "method":"PUT",
                          "name":"Rename"
                       },
                       "reserve":{  
                          "body":"reserved_user_id=1000",
                          "content_type":"application\/x-www-form-urlencoded",
                          "form_href":"",
                          "href":"\/api\/v2\/nodes\/5752677",
                          "method":"PUT",
                          "name":"Reserve"
                       }
                    },
                    "map":{  
                       "default_action":"open",
                       "more":[  
                          "properties"
                       ]
                    },
                    "order":[  
                       "edit",
                       "addversion",
                       "rename",
                       "copy",
                       "move",
                       "permissions",
                       "reserve",
                       "delete"
                    ]
                 }
              }
           }
        });
        mockjax({
          url: new RegExp('^//server/otcs/cs/api/v2/nodes/([^/?]+)(?:\\?(.*))?$'),
          urlParams: ['nodeId', 'query'], // actions, perspective
          type: 'GET',
          response: function (settings) {
            var nodeId = +settings.urlParams.nodeId,
                node = mocked.nodes[nodeId];
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
        });
        mockjax({
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
        });
        mockjax({
          url: new RegExp('^//server/otcs/cs/api/v1/nodes/([^/]+)/ancestors'),
          urlParams: ['nodeId'],
          response: function (settings) {
            var nodeId = +settings.urlParams.nodeId;
            this.responseText = {
              ancestors: getAncestors(nodeId, true)
            };
          },
          responseTime: 0,
        });
        mockjax({
          url: new RegExp('^//server/otcs/cs/api/v1/nodes/([^/]+)/addablenodetypes'),
          responseText: {
            data: {},
            definitions: {}
          },
          responseTime: 0,
        });
        mockjax({
          url: new RegExp('^//server/otcs/cs/api/v1/nodes/([^/]+)/facets'),
          urlParams: ['nodeId'],
          responseText: {
            facets: mocked.facets
          },
          responseTime: 0,
        });
  
        mockjax({
          url: new RegExp('^//server/otcs/cs/api/v2/members/favorites(\\?.*)?'),
          responseText: {
            results: []
          },
          responseTime: 0,
        });
        mockjax({
          url: new RegExp('^//server/otcs/cs/api/v1/forms/nodes/update(\\?.*)?'),
          responseText: {
            "forms": [
                {
                    "data": {
                        "name": "Test",
                        "description": "",
                        "create_date": "2018-10-15T10:55:44Z",
                        "create_user_id": 1000,
                        "type": 0,
                        "type_name": "Folder",
                        "modify_date": "2018-10-15T10:55:44Z",
                        "owner_user_id": 1000
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
                                    "action": "api/v1/members",
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
                                    "action": "api/v1/members",
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
                            }
                        },
                        "form": {
                            "attributes": {
                                "action": "api/v1/nodes/18813975",
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
                            }
                        },
                        "type": "object"
                    }
                },
                {
                    "data": {},
                    "options": {
                        "fields": {}
                    },
                    "role_name": "categories",
                    "schema": {
                        "properties": {},
                        "title": "Categories",
                        "type": "object"
                    }
                },
                {
                    "data": {
                        "followup_id": null,
                        "status": null
                    },
                    "options": {
                        "fields": {
                            "followup_id": {
                                "hidden": false,
                                "hideInitValidationError": true,
                                "label": "Reminder ID",
                                "readonly": false,
                                "type": "integer"
                            },
                            "status": {
                                "hidden": false,
                                "hideInitValidationError": true,
                                "label": "Status",
                                "readonly": false,
                                "type": "integer"
                            }
                        }
                    },
                    "role_name": "followups",
                    "schema": {
                        "properties": {
                            "followup_id": {
                                "readonly": false,
                                "required": true,
                                "title": "Reminder ID",
                                "type": "integer"
                            },
                            "status": {
                                "readonly": false,
                                "required": true,
                                "title": "Status",
                                "type": "integer"
                            }
                        },
                        "title": "Reminder",
                        "type": "object"
                    }
                },
                {
                    "data": {
                        "versions_control_advanced": null
                    },
                    "options": {
                        "fields": {
                            "versions_control_advanced": {
                                "hidden": false,
                                "hideInitValidationError": true,
                                "label": "Versions Control Advanced",
                                "readonly": false,
                                "type": "checkbox"
                            }
                        }
                    },
                    "role_name": "versionscontrol",
                    "schema": {
                        "properties": {
                            "versions_control_advanced": {
                                "readonly": false,
                                "required": true,
                                "title": "Versions Control Advanced",
                                "type": "boolean"
                            }
                        },
                        "title": "Versions Control",
                        "type": "object"
                    }
                }
            ]
        },
          responseTime: 0,
        });
        mockjax({
          url: new RegExp('^//server/otcs/cs/api/v1/forms/nodes/properties/general(\\?.*)?'),
          responseText: {
            "forms": [
                {
                    "data": {
                        "name": "Test",
                        "description": "",
                        "create_date": "2018-10-15T10:55:44Z",
                        "create_user_id": 1000,
                        "type": 0,
                        "type_name": "Folder",
                        "modify_date": "2018-10-15T10:55:44Z",
                        "owner_user_id": 1000
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
                                    "action": "api/v1/members",
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
                                    "action": "api/v1/members",
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
                            }
                        },
                        "form": {
                            "attributes": {
                                "action": "api/v1/nodes/18813975",
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
                            }
                        },
                        "type": "object"
                    }
                }
            ]
        },
          responseTime: 0,
        });
        mockjax({
          url: new RegExp('^//server/otcs/cs/api/v1/members/1000(\\?.*)?'),
          responseText: {
            "available_actions": [
                {
                    "parameterless": true,
                    "read_only": false,
                    "type": "delete",
                    "type_name": "Delete",
                    "webnode_signature": null
                },
                {
                    "parameterless": false,
                    "read_only": false,
                    "type": "create",
                    "type_name": "Create",
                    "webnode_signature": null
                },
                {
                    "parameterless": false,
                    "read_only": false,
                    "type": "update",
                    "type_name": "Update",
                    "webnode_signature": null
                }
            ],
            "data": {
                "birth_date": "1900-10-31T00:00:00",
                "business_email": "admin@murdock.com",
                "business_fax": "67352895",
                "business_phone": "+78-5847684656500",
                "cell_phone": "9876543210",
                "deleted": false,
                "display_name": "Admin",
                "first_name": "Admin",
                "gender": null,
                "group_id": 2426,
                "home_address_1": null,
                "home_address_2": null,
                "home_fax": null,
                "home_phone": null,
                "id": 1000,
                "initials": "A",
                "last_name": null,
                "middle_name": null,
                "name": "Admin",
                "office_location": "Hyderabad",
                "pager": null,
                "personal_email": null,
                "personal_interests": null,
                "personal_url_1": null,
                "personal_url_2": null,
                "personal_url_3": null,
                "personal_website": null,
                "photo_id": 0,
                "photo_url": null,
                "privilege_login": true,
                "privilege_modify_groups": true,
                "privilege_modify_users": true,
                "privilege_public_access": true,
                "privilege_system_admin_rights": true,
                "privilege_user_admin_rights": true,
                "time_zone": 6,
                "title": "Murdock Administrator ",
                "type": 0,
                "type_name": "User"
            },
            "definitions": {
                "birth_date": {
                    "allow_undefined": false,
                    "bulk_shared": false,
                    "default_value": null,
                    "description": null,
                    "hidden": false,
                    "include_time": false,
                    "key": "birth_date",
                    "key_value_pairs": false,
                    "multi_value": false,
                    "name": "Birthday",
                    "persona": "",
                    "read_only": false,
                    "required": false,
                    "type": -7,
                    "type_name": "Date",
                    "valid_values": [],
                    "valid_values_name": []
                },
                "business_email": {
                    "allow_undefined": false,
                    "bulk_shared": false,
                    "default_value": null,
                    "description": null,
                    "hidden": false,
                    "key": "business_email",
                    "key_value_pairs": false,
                    "max_length": null,
                    "min_length": null,
                    "multi_value": false,
                    "multiline": false,
                    "multilingual": false,
                    "name": "Business E-mail",
                    "password": false,
                    "persona": "",
                    "read_only": false,
                    "regex": "",
                    "required": false,
                    "type": -1,
                    "type_name": "String",
                    "valid_values": [],
                    "valid_values_name": []
                },
                "business_fax": {
                    "allow_undefined": false,
                    "bulk_shared": false,
                    "default_value": null,
                    "description": null,
                    "hidden": false,
                    "key": "business_fax",
                    "key_value_pairs": false,
                    "max_length": null,
                    "min_length": null,
                    "multi_value": false,
                    "multiline": false,
                    "multilingual": false,
                    "name": "Business Fax",
                    "password": false,
                    "persona": "",
                    "read_only": false,
                    "regex": "",
                    "required": false,
                    "type": -1,
                    "type_name": "String",
                    "valid_values": [],
                    "valid_values_name": []
                },
                "business_phone": {
                    "allow_undefined": false,
                    "bulk_shared": false,
                    "default_value": null,
                    "description": null,
                    "hidden": false,
                    "key": "business_phone",
                    "key_value_pairs": false,
                    "max_length": null,
                    "min_length": null,
                    "multi_value": false,
                    "multiline": false,
                    "multilingual": false,
                    "name": "Business Phone",
                    "password": false,
                    "persona": "",
                    "read_only": false,
                    "regex": "",
                    "required": false,
                    "type": -1,
                    "type_name": "String",
                    "valid_values": [],
                    "valid_values_name": []
                },
                "cell_phone": {
                    "allow_undefined": false,
                    "bulk_shared": false,
                    "default_value": null,
                    "description": null,
                    "hidden": false,
                    "key": "cell_phone",
                    "key_value_pairs": false,
                    "max_length": null,
                    "min_length": null,
                    "multi_value": false,
                    "multiline": false,
                    "multilingual": false,
                    "name": "Cell Phone",
                    "password": false,
                    "persona": "",
                    "read_only": false,
                    "regex": "",
                    "required": false,
                    "type": -1,
                    "type_name": "String",
                    "valid_values": [],
                    "valid_values_name": []
                },
                "deleted": {
                    "allow_undefined": false,
                    "bulk_shared": false,
                    "default_value": null,
                    "description": null,
                    "hidden": false,
                    "key": "deleted",
                    "key_value_pairs": false,
                    "multi_value": false,
                    "name": "Deleted",
                    "persona": "",
                    "read_only": true,
                    "required": false,
                    "type": 5,
                    "type_name": "Boolean",
                    "valid_values": [],
                    "valid_values_name": []
                },
                "first_name": {
                    "allow_undefined": false,
                    "bulk_shared": false,
                    "default_value": null,
                    "description": null,
                    "hidden": false,
                    "key": "first_name",
                    "key_value_pairs": false,
                    "max_length": null,
                    "min_length": null,
                    "multi_value": false,
                    "multiline": false,
                    "multilingual": false,
                    "name": "First Name",
                    "password": false,
                    "persona": "",
                    "read_only": false,
                    "regex": "",
                    "required": false,
                    "type": -1,
                    "type_name": "String",
                    "valid_values": [],
                    "valid_values_name": []
                },
                "gender": {
                    "allow_undefined": false,
                    "bulk_shared": false,
                    "default_value": null,
                    "description": null,
                    "hidden": false,
                    "key": "gender",
                    "key_value_pairs": false,
                    "max_value": null,
                    "min_value": null,
                    "multi_value": false,
                    "name": "Gender",
                    "persona": "",
                    "read_only": false,
                    "required": false,
                    "type": 2,
                    "type_name": "Integer",
                    "valid_values": [],
                    "valid_values_name": []
                },
                "group_id": {
                    "allow_undefined": false,
                    "bulk_shared": false,
                    "default_value": null,
                    "description": null,
                    "hidden": false,
                    "key": "group_id",
                    "key_value_pairs": false,
                    "max_value": null,
                    "min_value": null,
                    "multi_value": false,
                    "name": "Group",
                    "persona": "group",
                    "read_only": false,
                    "required": false,
                    "type": 2,
                    "type_name": "Integer",
                    "valid_values": [],
                    "valid_values_name": []
                },
                "home_address_1": {
                    "allow_undefined": false,
                    "bulk_shared": false,
                    "default_value": null,
                    "description": null,
                    "hidden": false,
                    "key": "home_address_1",
                    "key_value_pairs": false,
                    "max_length": null,
                    "min_length": null,
                    "multi_value": false,
                    "multiline": false,
                    "multilingual": false,
                    "name": "Home Address",
                    "password": false,
                    "persona": "",
                    "read_only": false,
                    "regex": "",
                    "required": false,
                    "type": -1,
                    "type_name": "String",
                    "valid_values": [],
                    "valid_values_name": []
                },
                "home_address_2": {
                    "allow_undefined": false,
                    "bulk_shared": false,
                    "default_value": null,
                    "description": null,
                    "hidden": false,
                    "key": "home_address_2",
                    "key_value_pairs": false,
                    "max_length": null,
                    "min_length": null,
                    "multi_value": false,
                    "multiline": false,
                    "multilingual": false,
                    "name": "Home Address",
                    "password": false,
                    "persona": "",
                    "read_only": false,
                    "regex": "",
                    "required": false,
                    "type": -1,
                    "type_name": "String",
                    "valid_values": [],
                    "valid_values_name": []
                },
                "home_fax": {
                    "allow_undefined": false,
                    "bulk_shared": false,
                    "default_value": null,
                    "description": null,
                    "hidden": false,
                    "key": "home_fax",
                    "key_value_pairs": false,
                    "max_length": null,
                    "min_length": null,
                    "multi_value": false,
                    "multiline": false,
                    "multilingual": false,
                    "name": "Home Fax",
                    "password": false,
                    "persona": "",
                    "read_only": false,
                    "regex": "",
                    "required": false,
                    "type": -1,
                    "type_name": "String",
                    "valid_values": [],
                    "valid_values_name": []
                },
                "home_phone": {
                    "allow_undefined": false,
                    "bulk_shared": false,
                    "default_value": null,
                    "description": null,
                    "hidden": false,
                    "key": "home_phone",
                    "key_value_pairs": false,
                    "max_length": null,
                    "min_length": null,
                    "multi_value": false,
                    "multiline": false,
                    "multilingual": false,
                    "name": "Home Phone",
                    "password": false,
                    "persona": "",
                    "read_only": false,
                    "regex": "",
                    "required": false,
                    "type": -1,
                    "type_name": "String",
                    "valid_values": [],
                    "valid_values_name": []
                },
                "id": {
                    "allow_undefined": false,
                    "bulk_shared": false,
                    "default_value": null,
                    "description": null,
                    "hidden": false,
                    "key": "id",
                    "key_value_pairs": false,
                    "max_value": null,
                    "min_value": null,
                    "multi_value": false,
                    "name": "ID",
                    "persona": "",
                    "read_only": false,
                    "required": true,
                    "type": 2,
                    "type_name": "Integer",
                    "valid_values": [],
                    "valid_values_name": []
                },
                "last_name": {
                    "allow_undefined": false,
                    "bulk_shared": false,
                    "default_value": null,
                    "description": null,
                    "hidden": false,
                    "key": "last_name",
                    "key_value_pairs": false,
                    "max_length": null,
                    "min_length": null,
                    "multi_value": false,
                    "multiline": false,
                    "multilingual": false,
                    "name": "Last Name",
                    "password": false,
                    "persona": "",
                    "read_only": false,
                    "regex": "",
                    "required": false,
                    "type": -1,
                    "type_name": "String",
                    "valid_values": [],
                    "valid_values_name": []
                },
                "middle_name": {
                    "allow_undefined": false,
                    "bulk_shared": false,
                    "default_value": null,
                    "description": null,
                    "hidden": false,
                    "key": "middle_name",
                    "key_value_pairs": false,
                    "max_length": null,
                    "min_length": null,
                    "multi_value": false,
                    "multiline": false,
                    "multilingual": false,
                    "name": "Middle Name",
                    "password": false,
                    "persona": "",
                    "read_only": false,
                    "regex": "",
                    "required": false,
                    "type": -1,
                    "type_name": "String",
                    "valid_values": [],
                    "valid_values_name": []
                },
                "name": {
                    "allow_undefined": false,
                    "bulk_shared": false,
                    "default_value": null,
                    "description": null,
                    "hidden": false,
                    "key": "name",
                    "key_value_pairs": false,
                    "max_length": null,
                    "min_length": null,
                    "multi_value": false,
                    "multiline": false,
                    "multilingual": false,
                    "name": "Name",
                    "password": false,
                    "persona": "",
                    "read_only": false,
                    "regex": "",
                    "required": true,
                    "type": -1,
                    "type_name": "String",
                    "valid_values": [],
                    "valid_values_name": []
                },
                "office_location": {
                    "allow_undefined": false,
                    "bulk_shared": false,
                    "default_value": null,
                    "description": null,
                    "hidden": false,
                    "key": "office_location",
                    "key_value_pairs": false,
                    "max_length": null,
                    "min_length": null,
                    "multi_value": false,
                    "multiline": false,
                    "multilingual": false,
                    "name": "OfficeLocation",
                    "password": false,
                    "persona": "",
                    "read_only": false,
                    "regex": "",
                    "required": false,
                    "type": -1,
                    "type_name": "String",
                    "valid_values": [],
                    "valid_values_name": []
                },
                "pager": {
                    "allow_undefined": false,
                    "bulk_shared": false,
                    "default_value": null,
                    "description": null,
                    "hidden": false,
                    "key": "pager",
                    "key_value_pairs": false,
                    "max_length": null,
                    "min_length": null,
                    "multi_value": false,
                    "multiline": false,
                    "multilingual": false,
                    "name": "Pager",
                    "password": false,
                    "persona": "",
                    "read_only": false,
                    "regex": "",
                    "required": false,
                    "type": -1,
                    "type_name": "String",
                    "valid_values": [],
                    "valid_values_name": []
                },
                "personal_email": {
                    "allow_undefined": false,
                    "bulk_shared": false,
                    "default_value": null,
                    "description": null,
                    "hidden": false,
                    "key": "personal_email",
                    "key_value_pairs": false,
                    "max_length": null,
                    "min_length": null,
                    "multi_value": false,
                    "multiline": false,
                    "multilingual": false,
                    "name": "Personal Email",
                    "password": false,
                    "persona": "",
                    "read_only": false,
                    "regex": "",
                    "required": false,
                    "type": -1,
                    "type_name": "String",
                    "valid_values": [],
                    "valid_values_name": []
                },
                "personal_interests": {
                    "allow_undefined": false,
                    "bulk_shared": false,
                    "default_value": null,
                    "description": null,
                    "hidden": false,
                    "key": "personal_interests",
                    "key_value_pairs": false,
                    "max_length": null,
                    "min_length": null,
                    "multi_value": false,
                    "multiline": false,
                    "multilingual": false,
                    "name": "Interests",
                    "password": false,
                    "persona": "",
                    "read_only": false,
                    "regex": "",
                    "required": false,
                    "type": -1,
                    "type_name": "String",
                    "valid_values": [],
                    "valid_values_name": []
                },
                "personal_url_1": {
                    "allow_undefined": false,
                    "bulk_shared": false,
                    "default_value": null,
                    "description": null,
                    "hidden": false,
                    "key": "personal_url_1",
                    "key_value_pairs": false,
                    "max_length": null,
                    "min_length": null,
                    "multi_value": false,
                    "multiline": false,
                    "multilingual": false,
                    "name": "Favorites",
                    "password": false,
                    "persona": "",
                    "read_only": false,
                    "regex": "",
                    "required": false,
                    "type": -1,
                    "type_name": "String",
                    "valid_values": [],
                    "valid_values_name": []
                },
                "personal_url_2": {
                    "allow_undefined": false,
                    "bulk_shared": false,
                    "default_value": null,
                    "description": null,
                    "hidden": false,
                    "key": "personal_url_2",
                    "key_value_pairs": false,
                    "max_length": null,
                    "min_length": null,
                    "multi_value": false,
                    "multiline": false,
                    "multilingual": false,
                    "name": "Favorites",
                    "password": false,
                    "persona": "",
                    "read_only": false,
                    "regex": "",
                    "required": false,
                    "type": -1,
                    "type_name": "String",
                    "valid_values": [],
                    "valid_values_name": []
                },
                "personal_url_3": {
                    "allow_undefined": false,
                    "bulk_shared": false,
                    "default_value": null,
                    "description": null,
                    "hidden": false,
                    "key": "personal_url_3",
                    "key_value_pairs": false,
                    "max_length": null,
                    "min_length": null,
                    "multi_value": false,
                    "multiline": false,
                    "multilingual": false,
                    "name": "Favorites",
                    "password": false,
                    "persona": "",
                    "read_only": false,
                    "regex": "",
                    "required": false,
                    "type": -1,
                    "type_name": "String",
                    "valid_values": [],
                    "valid_values_name": []
                },
                "personal_website": {
                    "allow_undefined": false,
                    "bulk_shared": false,
                    "default_value": null,
                    "description": null,
                    "hidden": false,
                    "key": "personal_website",
                    "key_value_pairs": false,
                    "max_length": null,
                    "min_length": null,
                    "multi_value": false,
                    "multiline": false,
                    "multilingual": false,
                    "name": "Home Page",
                    "password": false,
                    "persona": "",
                    "read_only": false,
                    "regex": "",
                    "required": false,
                    "type": -1,
                    "type_name": "String",
                    "valid_values": [],
                    "valid_values_name": []
                },
                "photo_id": {
                    "allow_undefined": false,
                    "bulk_shared": false,
                    "default_value": null,
                    "description": null,
                    "hidden": false,
                    "key": "photo_id",
                    "key_value_pairs": false,
                    "max_value": null,
                    "min_value": null,
                    "multi_value": false,
                    "name": "Photo ID",
                    "persona": "",
                    "read_only": false,
                    "required": false,
                    "type": 2,
                    "type_name": "Integer",
                    "valid_values": [],
                    "valid_values_name": []
                },
                "privilege_login": {
                    "allow_undefined": false,
                    "bulk_shared": false,
                    "default_value": null,
                    "description": null,
                    "hidden": false,
                    "key": "privilege_login",
                    "key_value_pairs": false,
                    "multi_value": false,
                    "name": "Log-in",
                    "persona": "",
                    "read_only": false,
                    "required": false,
                    "type": 5,
                    "type_name": "Boolean",
                    "valid_values": [],
                    "valid_values_name": []
                },
                "privilege_modify_groups": {
                    "allow_undefined": false,
                    "bulk_shared": false,
                    "default_value": null,
                    "description": null,
                    "hidden": false,
                    "key": "privilege_modify_groups",
                    "key_value_pairs": false,
                    "multi_value": false,
                    "name": "Create/Modify Groups",
                    "persona": "",
                    "read_only": false,
                    "required": false,
                    "type": 5,
                    "type_name": "Boolean",
                    "valid_values": [],
                    "valid_values_name": []
                },
                "privilege_modify_users": {
                    "allow_undefined": false,
                    "bulk_shared": false,
                    "default_value": null,
                    "description": null,
                    "hidden": false,
                    "key": "privilege_modify_users",
                    "key_value_pairs": false,
                    "multi_value": false,
                    "name": "Create/Modify Users",
                    "persona": "",
                    "read_only": false,
                    "required": false,
                    "type": 5,
                    "type_name": "Boolean",
                    "valid_values": [],
                    "valid_values_name": []
                },
                "privilege_public_access": {
                    "allow_undefined": false,
                    "bulk_shared": false,
                    "default_value": null,
                    "description": null,
                    "hidden": false,
                    "key": "privilege_public_access",
                    "key_value_pairs": false,
                    "multi_value": false,
                    "name": "Public Access",
                    "persona": "",
                    "read_only": false,
                    "required": false,
                    "type": 5,
                    "type_name": "Boolean",
                    "valid_values": [],
                    "valid_values_name": []
                },
                "privilege_system_admin_rights": {
                    "allow_undefined": false,
                    "bulk_shared": false,
                    "default_value": null,
                    "description": null,
                    "hidden": false,
                    "key": "privilege_system_admin_rights",
                    "key_value_pairs": false,
                    "multi_value": false,
                    "name": "System Administration Rights",
                    "persona": "",
                    "read_only": false,
                    "required": false,
                    "type": 5,
                    "type_name": "Boolean",
                    "valid_values": [],
                    "valid_values_name": []
                },
                "privilege_user_admin_rights": {
                    "allow_undefined": false,
                    "bulk_shared": false,
                    "default_value": null,
                    "description": null,
                    "hidden": false,
                    "key": "privilege_user_admin_rights",
                    "key_value_pairs": false,
                    "multi_value": false,
                    "name": "User Administration Rights",
                    "persona": "",
                    "read_only": false,
                    "required": false,
                    "type": 5,
                    "type_name": "Boolean",
                    "valid_values": [],
                    "valid_values_name": []
                },
                "time_zone": {
                    "allow_undefined": false,
                    "bulk_shared": false,
                    "default_value": -1,
                    "description": null,
                    "hidden": false,
                    "key": "time_zone",
                    "key_value_pairs": false,
                    "max_value": null,
                    "min_value": null,
                    "multi_value": false,
                    "name": "TimeZone",
                    "persona": "",
                    "read_only": false,
                    "required": false,
                    "type": 2,
                    "type_name": "Integer",
                    "valid_values": [],
                    "valid_values_name": []
                },
                "title": {
                    "allow_undefined": false,
                    "bulk_shared": false,
                    "default_value": null,
                    "description": null,
                    "hidden": false,
                    "key": "title",
                    "key_value_pairs": false,
                    "max_length": null,
                    "min_length": null,
                    "multi_value": false,
                    "multiline": false,
                    "multilingual": false,
                    "name": "Title",
                    "password": false,
                    "persona": "",
                    "read_only": false,
                    "regex": "",
                    "required": false,
                    "type": -1,
                    "type_name": "String",
                    "valid_values": [],
                    "valid_values_name": []
                },
                "type": {
                    "allow_undefined": false,
                    "bulk_shared": false,
                    "default_value": null,
                    "description": null,
                    "hidden": false,
                    "key": "type",
                    "key_value_pairs": false,
                    "max_value": null,
                    "min_value": null,
                    "multi_value": false,
                    "name": "Type",
                    "persona": "",
                    "read_only": true,
                    "required": false,
                    "type": 2,
                    "type_name": "Integer",
                    "valid_values": [],
                    "valid_values_name": []
                },
                "type_name": {
                    "allow_undefined": false,
                    "bulk_shared": false,
                    "default_value": null,
                    "description": null,
                    "hidden": false,
                    "key": "type_name",
                    "key_value_pairs": false,
                    "max_length": null,
                    "min_length": null,
                    "multi_value": false,
                    "multiline": false,
                    "multilingual": false,
                    "name": "Type",
                    "password": false,
                    "persona": "",
                    "read_only": true,
                    "regex": "",
                    "required": false,
                    "type": -1,
                    "type_name": "String",
                    "valid_values": [],
                    "valid_values_name": []
                }
            },
            "definitions_order": [
                "id",
                "type",
                "type_name",
                "name",
                "deleted",
                "first_name",
                "last_name",
                "middle_name",
                "group_id",
                "title",
                "business_email",
                "business_phone",
                "business_fax",
                "office_location",
                "time_zone",
                "privilege_login",
                "privilege_public_access",
                "privilege_modify_users",
                "privilege_modify_groups",
                "privilege_user_admin_rights",
                "privilege_system_admin_rights",
                "birth_date",
                "cell_phone",
                "personal_url_1",
                "personal_url_2",
                "personal_url_3",
                "gender",
                "home_address_1",
                "home_address_2",
                "home_fax",
                "personal_website",
                "home_phone",
                "personal_interests",
                "pager",
                "personal_email",
                "photo_id"
            ],
            "type": 0,
            "type_name": "User"
        },
          responseTime: 0,
        });

        
        mockjax({
          url: '//server/otcs/cs/api/v2/members/favorites/tabs?fields=properties&sort=order',
            responseText: { 
                "links":{  
                   "data":{  
                      "self":{  
                         "body":"",
                         "content_type":"",
                         "href":"\/api\/v2\/members\/favorites\/tabs?fields=properties",
                         "method":"GET",
                         "name":""
                      }
                   }
                },
                "results":[  
             
                ]
          },
          responseTime: 0,
        });

        mockjax({
          url: '//server/otcs/cs/api/v1/nodes/5002/thumbnails/medium/content?suppress_response_codes',
            responseText: {
          },
          responseTime: 0,
        });

        mockjax({
          url: '//server/otcs/cs/api/v1/nodes/5001/thumbnails/medium/content?suppress_response_codes',
            responseText: {
          },
          responseTime: 0,
        });

        mockjax({
          url: '//server/otcs/cs/api/v1/nodes/5003/thumbnails/medium/content?suppress_response_codes',
            responseText: {
          },
          responseTime: 0,
        });
        
        mockjax({
          url: '//server/otcs/cs/api/v1/volumes/141',
            responseText: {
          },
          responseTime: 0,
        });

        mockjax({
          url: '//server/otcs/cs/api/v1/volumes/142',
            responseText: {
          },
          responseTime: 0,
        });

        mockjax({
          url: '//server/otcs/cs/api/v1/volumes/133',
            responseText: {
          },
          responseTime: 0,
        });

        mockjax({
          url: '//server/otcs/cs/api/v1/volumes/954',
            responseText: {
          },
          responseTime: 0,
        });

        mockjax({
          url: '//server/otcs/cs/api/v2/members/targets?fields=properties&fields=versions.element(0)&expand=properties%7Boriginal_id%7D&orderBy=asc_name&actions=',
            responseText:{
              "links": {
                "data": {
                  "self": {
                    "body": "",
                    "content_type": "",
                    "href": "/api/v2/members/targets?actions&expand=properties{original_id}&fields=properties&fields=versions.element(0)",
                    "method": "GET",
                    "name": ""
                  }
                }
              },
              "results": [
                {
                  "actions": {
                    "data": {
                      "addcategory": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/7247375/categories",
                        "method": "POST",
                        "name": "Add Category"
                      },
                      "AddRMClassifications": {
                        "body": "{\"displayPrompt\":false,\"enabled\":false,\"inheritfrom\":false,\"managed\":false}",
                        "content_type": "application/x-www-form-urlencoded",
                        "form_href": "",
                        "href": "/api/v2/nodes/7247375/rmclassifications",
                        "method": "POST",
                        "name": "Add RM Classification"
                      },
                      "audit": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/7247375/audit?limit=1000",
                        "method": "GET",
                        "name": "Audit"
                      },
                      "docview": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "?func=doc.viewdoc&nodeid=7247375",
                        "method": "GET",
                        "name": "View"
                      },
                      "makefavorite": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/members/favorites/7247375",
                        "method": "POST",
                        "name": "Add to Favorites"
                      },
                      "more": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "",
                        "method": "",
                        "name": "..."
                      },
                      "open": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/7247375/nodes",
                        "method": "GET",
                        "name": "Open"
                      },
                      "permissions": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "",
                        "method": "",
                        "name": "Permissions"
                      },
                      "properties": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/7247375",
                        "method": "GET",
                        "name": "Properties"
                      }
                    },
                    "map": {
                      "default_action": "",
                      "more": [
                        "properties",
                        "audit"
                      ]
                    },
                    "order": [
                      "docview",
                      "open",
                      "addcategory",
                      "makefavorite",
                      "permissions",
                      "AddRMClassifications",
                      "more"
                    ]
                  },
                  "data": {
                    "properties": {
                      "container": true,
                      "container_size": 7,
                      "create_date": "2017-08-22T00:16:19",
                      "create_user_id": 1000,
                      "description": "",
                      "description_multilingual": {
                        "de_DE": ""
                      },
                      "external_create_date": null,
                      "external_identity": "",
                      "external_identity_type": "",
                      "external_modify_date": null,
                      "external_source": "",
                      "favorite": false,
                      "id": 7247375,
                      "mime_type": null,
                      "modify_date": "2018-03-12T01:34:43",
                      "modify_user_id": 1000,
                      "name": "00 MultiValueAttributes",
                      "name_multilingual": {
                        "de_DE": "00 MultiValueAttributes"
                      },
                      "owner": "Admin",
                      "owner_group_id": 1001,
                      "owner_user_id": 1000,
                      "parent_id": 616849,
                      "permissions_model": "advanced",
                      "reserved": false,
                      "reserved_date": null,
                      "reserved_shared_collaboration": false,
                      "reserved_user_id": 0,
                      "size": 7,
                      "size_formatted": "7 Items",
                      "type": 132,
                      "type_name": "Category Folder",
                      "versions_control_advanced": false,
                      "volume_id": -2004
                    }
                  }
                },
                {
                  "actions": {
                    "data": {
                      "addcategory": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/10879731/categories",
                        "method": "POST",
                        "name": "Add Category"
                      },
                      "AddClassifications": {
                        "body": "",
                        "content_type": "application/x-www-form-urlencoded",
                        "form_href": "",
                        "href": "/api/v2/nodes/10879731/classifications",
                        "method": "POST",
                        "name": "Add Classification"
                      },
                      "AddReminder": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "",
                        "method": "GET",
                        "name": "Reminder"
                      },
                      "AddRMClassifications": {
                        "body": "{\"displayPrompt\":false,\"enabled\":true,\"inheritfrom\":false,\"managed\":true}",
                        "content_type": "application/x-www-form-urlencoded",
                        "form_href": "",
                        "href": "/api/v2/nodes/10879731/rmclassifications",
                        "method": "POST",
                        "name": "Add RM Classification"
                      },
                      "ApplyHold": {
                        "body": "",
                        "content_type": "application/x-www-form-urlencoded",
                        "form_href": "",
                        "href": "",
                        "method": "",
                        "name": "Apply Hold"
                      },
                      "AssignXRef": {
                        "body": "",
                        "content_type": "application/x-www-form-urlencoded",
                        "form_href": "",
                        "href": "",
                        "method": "",
                        "name": "Assign Cross-Reference"
                      },
                      "audit": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/10879731/audit?limit=1000",
                        "method": "GET",
                        "name": "Audit"
                      },
                      "collect": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/10879731",
                        "method": "PUT",
                        "name": "Collect"
                      },
                      "comment": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "",
                        "method": "POST",
                        "name": "Comments"
                      },
                      "copy": {
                        "body": "",
                        "content_type": "",
                        "form_href": "/api/v2/forms/nodes/copy?id=10879731",
                        "href": "/api/v2/nodes",
                        "method": "POST",
                        "name": "Copy"
                      },
                      "delete": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/10879731",
                        "method": "DELETE",
                        "name": "Delete"
                      },
                      "docview": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "?func=doc.viewdoc&nodeid=10879731",
                        "method": "GET",
                        "name": "View"
                      },
                      "makefavorite": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/members/favorites/10879731",
                        "method": "POST",
                        "name": "Add to Favorites"
                      },
                      "more": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "",
                        "method": "",
                        "name": "..."
                      },
                      "move": {
                        "body": "",
                        "content_type": "",
                        "form_href": "/api/v2/forms/nodes/move?id=10879731",
                        "href": "/api/v2/nodes/10879731",
                        "method": "PUT",
                        "name": "Move"
                      },
                      "open": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/10879731/nodes",
                        "method": "GET",
                        "name": "Open"
                      },
                      "permissions": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "",
                        "method": "",
                        "name": "Permissions"
                      },
                      "properties": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/10879731",
                        "method": "GET",
                        "name": "Properties"
                      },
                      "rename": {
                        "body": "",
                        "content_type": "",
                        "form_href": "/api/v2/forms/nodes/rename?id=10879731",
                        "href": "/api/v2/nodes/10879731",
                        "method": "PUT",
                        "name": "Rename"
                      }
                    },
                    "map": {
                      "default_action": "open",
                      "more": [
                        "properties",
                        "audit"
                      ]
                    },
                    "order": [
                      "docview",
                      "open",
                      "addcategory",
                      "rename",
                      "makefavorite",
                      "copy",
                      "collect",
                      "move",
                      "AddReminder",
                      "permissions",
                      "AddClassifications",
                      "AddRMClassifications",
                      "ApplyHold",
                      "AssignXRef",
                      "delete",
                      "comment",
                      "more"
                    ]
                  },
                  "data": {
                    "properties": {
                      "container": true,
                      "container_size": 18,
                      "create_date": "2018-01-01T20:37:52",
                      "create_user_id": 1000,
                      "description": "",
                      "description_multilingual": {
                        "de_DE": ""
                      },
                      "external_create_date": null,
                      "external_identity": "",
                      "external_identity_type": "",
                      "external_modify_date": null,
                      "external_source": "",
                      "favorite": false,
                      "id": 10879731,
                      "mime_type": null,
                      "modify_date": "2018-09-05T19:40:22",
                      "modify_user_id": 1000,
                      "name": "0 yamini",
                      "name_multilingual": {
                        "de_DE": "0 yamini"
                      },
                      "owner": "Admin",
                      "owner_group_id": 1001,
                      "owner_user_id": 1000,
                      "parent_id": 604999,
                      "permissions_model": "advanced",
                      "reserved": false,
                      "reserved_date": null,
                      "reserved_shared_collaboration": false,
                      "reserved_user_id": 0,
                      "size": 18,
                      "size_formatted": "18 Items",
                      "type": 0,
                      "type_name": "Folder",
                      "versions_control_advanced": false,
                      "volume_id": -2000
                    }
                  }
                },
                {
                  "actions": {
                    "data": {
                      "addcategory": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/11445223/categories",
                        "method": "POST",
                        "name": "Add Category"
                      },
                      "AddClassifications": {
                        "body": "",
                        "content_type": "application/x-www-form-urlencoded",
                        "form_href": "",
                        "href": "/api/v2/nodes/11445223/classifications",
                        "method": "POST",
                        "name": "Add Classification"
                      },
                      "AddReminder": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "",
                        "method": "GET",
                        "name": "Reminder"
                      },
                      "AddRMClassifications": {
                        "body": "{\"displayPrompt\":false,\"enabled\":true,\"inheritfrom\":false,\"managed\":true}",
                        "content_type": "application/x-www-form-urlencoded",
                        "form_href": "",
                        "href": "/api/v2/nodes/11445223/rmclassifications",
                        "method": "POST",
                        "name": "Add RM Classification"
                      },
                      "ApplyHold": {
                        "body": "",
                        "content_type": "application/x-www-form-urlencoded",
                        "form_href": "",
                        "href": "",
                        "method": "",
                        "name": "Apply Hold"
                      },
                      "AssignXRef": {
                        "body": "",
                        "content_type": "application/x-www-form-urlencoded",
                        "form_href": "",
                        "href": "",
                        "method": "",
                        "name": "Assign Cross-Reference"
                      },
                      "audit": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/11445223/audit?limit=1000",
                        "method": "GET",
                        "name": "Audit"
                      },
                      "collect": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/11445223",
                        "method": "PUT",
                        "name": "Collect"
                      },
                      "comment": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "",
                        "method": "POST",
                        "name": "Comments"
                      },
                      "copy": {
                        "body": "",
                        "content_type": "",
                        "form_href": "/api/v2/forms/nodes/copy?id=11445223",
                        "href": "/api/v2/nodes",
                        "method": "POST",
                        "name": "Copy"
                      },
                      "delete": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/11445223",
                        "method": "DELETE",
                        "name": "Delete"
                      },
                      "docview": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "?func=doc.viewdoc&nodeid=11445223",
                        "method": "GET",
                        "name": "View"
                      },
                      "makefavorite": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/members/favorites/11445223",
                        "method": "POST",
                        "name": "Add to Favorites"
                      },
                      "more": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "",
                        "method": "",
                        "name": "..."
                      },
                      "move": {
                        "body": "",
                        "content_type": "",
                        "form_href": "/api/v2/forms/nodes/move?id=11445223",
                        "href": "/api/v2/nodes/11445223",
                        "method": "PUT",
                        "name": "Move"
                      },
                      "open": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/11445223/nodes",
                        "method": "GET",
                        "name": "Open"
                      },
                      "permissions": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "",
                        "method": "",
                        "name": "Permissions"
                      },
                      "properties": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/11445223",
                        "method": "GET",
                        "name": "Properties"
                      },
                      "rename": {
                        "body": "",
                        "content_type": "",
                        "form_href": "/api/v2/forms/nodes/rename?id=11445223",
                        "href": "/api/v2/nodes/11445223",
                        "method": "PUT",
                        "name": "Rename"
                      }
                    },
                    "map": {
                      "default_action": "open",
                      "more": [
                        "properties",
                        "audit"
                      ]
                    },
                    "order": [
                      "docview",
                      "open",
                      "addcategory",
                      "rename",
                      "makefavorite",
                      "copy",
                      "collect",
                      "move",
                      "AddReminder",
                      "permissions",
                      "AddClassifications",
                      "AddRMClassifications",
                      "ApplyHold",
                      "AssignXRef",
                      "delete",
                      "comment",
                      "more"
                    ]
                  },
                  "data": {
                    "properties": {
                      "container": true,
                      "container_size": 42,
                      "create_date": "2018-01-18T21:44:48",
                      "create_user_id": 1000,
                      "description": "dada",
                      "description_multilingual": {
                        "en": "dada",
                        "ja": ""
                      },
                      "external_create_date": null,
                      "external_identity": "",
                      "external_identity_type": "",
                      "external_modify_date": null,
                      "external_source": "",
                      "favorite": false,
                      "id": 11445223,
                      "mime_type": null,
                      "modify_date": "2018-09-16T20:34:32",
                      "modify_user_id": 1000,
                      "name": "000 Bala Test Folder",
                      "name_multilingual": {
                        "en": "000 Bala Test Folder",
                        "ja": "000 Bala Test Folder"
                      },
                      "owner": "Admin",
                      "owner_group_id": 1001,
                      "owner_user_id": 1000,
                      "parent_id": 604999,
                      "permissions_model": "advanced",
                      "reserved": false,
                      "reserved_date": null,
                      "reserved_shared_collaboration": false,
                      "reserved_user_id": 0,
                      "size": 42,
                      "size_formatted": "42 Items",
                      "type": 0,
                      "type_name": "Folder",
                      "versions_control_advanced": false,
                      "volume_id": -2000
                    }
                  }
                },
                {
                  "actions": {
                    "data": {
                      "addcategory": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/616849/categories",
                        "method": "POST",
                        "name": "Add Category"
                      },
                      "AddRMClassifications": {
                        "body": "{\"displayPrompt\":false,\"enabled\":false,\"inheritfrom\":false,\"managed\":false}",
                        "content_type": "application/x-www-form-urlencoded",
                        "form_href": "",
                        "href": "/api/v2/nodes/616849/rmclassifications",
                        "method": "POST",
                        "name": "Add RM Classification"
                      },
                      "audit": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/616849/audit?limit=1000",
                        "method": "GET",
                        "name": "Audit"
                      },
                      "docview": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "?func=doc.viewdoc&nodeid=616849",
                        "method": "GET",
                        "name": "View"
                      },
                      "makefavorite": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/members/favorites/616849",
                        "method": "POST",
                        "name": "Add to Favorites"
                      },
                      "more": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "",
                        "method": "",
                        "name": "..."
                      },
                      "open": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/616849/nodes",
                        "method": "GET",
                        "name": "Open"
                      },
                      "permissions": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "",
                        "method": "",
                        "name": "Permissions"
                      },
                      "properties": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/616849",
                        "method": "GET",
                        "name": "Properties"
                      }
                    },
                    "map": {
                      "default_action": "",
                      "more": [
                        "properties",
                        "audit"
                      ]
                    },
                    "order": [
                      "docview",
                      "open",
                      "addcategory",
                      "makefavorite",
                      "permissions",
                      "AddRMClassifications",
                      "more"
                    ]
                  },
                  "data": {
                    "properties": {
                      "container": true,
                      "container_size": 72,
                      "create_date": "2016-05-13T01:29:53",
                      "create_user_id": 1000,
                      "description": "",
                      "description_multilingual": {
                        "en": ""
                      },
                      "external_create_date": null,
                      "external_identity": "",
                      "external_identity_type": "",
                      "external_modify_date": null,
                      "external_source": "",
                      "favorite": false,
                      "id": 616849,
                      "mime_type": null,
                      "modify_date": "2018-09-16T23:33:13",
                      "modify_user_id": 1000,
                      "name": "000 Hyderabad",
                      "name_multilingual": {
                        "en": "000 Hyderabad"
                      },
                      "owner": "Admin",
                      "owner_group_id": 1001,
                      "owner_user_id": 1000,
                      "parent_id": 2004,
                      "permissions_model": "advanced",
                      "reserved": false,
                      "reserved_date": null,
                      "reserved_shared_collaboration": false,
                      "reserved_user_id": 0,
                      "size": 72,
                      "size_formatted": "72 Items",
                      "type": 132,
                      "type_name": "Category Folder",
                      "versions_control_advanced": false,
                      "volume_id": -2004
                    }
                  }
                },
                {
                  "actions": {
                    "data": {
                      "addcategory": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/12729103/categories",
                        "method": "POST",
                        "name": "Add Category"
                      },
                      "AddClassifications": {
                        "body": "",
                        "content_type": "application/x-www-form-urlencoded",
                        "form_href": "",
                        "href": "/api/v2/nodes/12729103/classifications",
                        "method": "POST",
                        "name": "Add Classification"
                      },
                      "AddReminder": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "",
                        "method": "GET",
                        "name": "Reminder"
                      },
                      "AddRMClassifications": {
                        "body": "{\"displayPrompt\":false,\"enabled\":true,\"inheritfrom\":false,\"managed\":true}",
                        "content_type": "application/x-www-form-urlencoded",
                        "form_href": "",
                        "href": "/api/v2/nodes/12729103/rmclassifications",
                        "method": "POST",
                        "name": "Add RM Classification"
                      },
                      "ApplyHold": {
                        "body": "",
                        "content_type": "application/x-www-form-urlencoded",
                        "form_href": "",
                        "href": "",
                        "method": "",
                        "name": "Apply Hold"
                      },
                      "AssignXRef": {
                        "body": "",
                        "content_type": "application/x-www-form-urlencoded",
                        "form_href": "",
                        "href": "",
                        "method": "",
                        "name": "Assign Cross-Reference"
                      },
                      "audit": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/12729103/audit?limit=1000",
                        "method": "GET",
                        "name": "Audit"
                      },
                      "collect": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/12729103",
                        "method": "PUT",
                        "name": "Collect"
                      },
                      "comment": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "",
                        "method": "POST",
                        "name": "Comments"
                      },
                      "copy": {
                        "body": "",
                        "content_type": "",
                        "form_href": "/api/v2/forms/nodes/copy?id=12729103",
                        "href": "/api/v2/nodes",
                        "method": "POST",
                        "name": "Copy"
                      },
                      "delete": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/12729103",
                        "method": "DELETE",
                        "name": "Delete"
                      },
                      "docview": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "?func=doc.viewdoc&nodeid=12729103",
                        "method": "GET",
                        "name": "View"
                      },
                      "makefavorite": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/members/favorites/12729103",
                        "method": "POST",
                        "name": "Add to Favorites"
                      },
                      "more": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "",
                        "method": "",
                        "name": "..."
                      },
                      "move": {
                        "body": "",
                        "content_type": "",
                        "form_href": "/api/v2/forms/nodes/move?id=12729103",
                        "href": "/api/v2/nodes/12729103",
                        "method": "PUT",
                        "name": "Move"
                      },
                      "open": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/12729103/nodes",
                        "method": "GET",
                        "name": "Open"
                      },
                      "permissions": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "",
                        "method": "",
                        "name": "Permissions"
                      },
                      "properties": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/12729103",
                        "method": "GET",
                        "name": "Properties"
                      },
                      "rename": {
                        "body": "",
                        "content_type": "",
                        "form_href": "/api/v2/forms/nodes/rename?id=12729103",
                        "href": "/api/v2/nodes/12729103",
                        "method": "PUT",
                        "name": "Rename"
                      }
                    },
                    "map": {
                      "default_action": "open",
                      "more": [
                        "properties",
                        "audit"
                      ]
                    },
                    "order": [
                      "docview",
                      "open",
                      "addcategory",
                      "rename",
                      "makefavorite",
                      "copy",
                      "collect",
                      "move",
                      "AddReminder",
                      "permissions",
                      "AddClassifications",
                      "AddRMClassifications",
                      "ApplyHold",
                      "AssignXRef",
                      "delete",
                      "comment",
                      "more"
                    ]
                  },
                  "data": {
                    "properties": {
                      "container": true,
                      "container_size": 4,
                      "create_date": "2018-03-06T11:11:33",
                      "create_user_id": 1000,
                      "description": "",
                      "description_multilingual": {
                        "ja": ""
                      },
                      "external_create_date": null,
                      "external_identity": "",
                      "external_identity_type": "",
                      "external_modify_date": null,
                      "external_source": "",
                      "favorite": false,
                      "id": 12729103,
                      "mime_type": null,
                      "modify_date": "2018-09-05T19:42:26",
                      "modify_user_id": 1000,
                      "name": "000_subfolder",
                      "name_multilingual": {
                        "ja": "000_subfolder"
                      },
                      "owner": "Admin",
                      "owner_group_id": 1001,
                      "owner_user_id": 1000,
                      "parent_id": 749454,
                      "permissions_model": "advanced",
                      "reserved": false,
                      "reserved_date": null,
                      "reserved_shared_collaboration": false,
                      "reserved_user_id": 0,
                      "size": 4,
                      "size_formatted": "4 Items",
                      "type": 0,
                      "type_name": "Folder",
                      "versions_control_advanced": false,
                      "volume_id": -2000
                    }
                  }
                },
                {
                  "actions": {
                    "data": {
                      "addcategory": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/77317/categories",
                        "method": "POST",
                        "name": "Add Category"
                      },
                      "AddClassifications": {
                        "body": "",
                        "content_type": "application/x-www-form-urlencoded",
                        "form_href": "",
                        "href": "/api/v2/nodes/77317/classifications",
                        "method": "POST",
                        "name": "Add Classification"
                      },
                      "AddReminder": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "",
                        "method": "GET",
                        "name": "Reminder"
                      },
                      "AddRMClassifications": {
                        "body": "{\"displayPrompt\":false,\"enabled\":true,\"inheritfrom\":false,\"managed\":true}",
                        "content_type": "application/x-www-form-urlencoded",
                        "form_href": "",
                        "href": "/api/v2/nodes/77317/rmclassifications",
                        "method": "POST",
                        "name": "Add RM Classification"
                      },
                      "ApplyHold": {
                        "body": "",
                        "content_type": "application/x-www-form-urlencoded",
                        "form_href": "",
                        "href": "",
                        "method": "",
                        "name": "Apply Hold"
                      },
                      "AssignXRef": {
                        "body": "",
                        "content_type": "application/x-www-form-urlencoded",
                        "form_href": "",
                        "href": "",
                        "method": "",
                        "name": "Assign Cross-Reference"
                      },
                      "audit": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/77317/audit?limit=1000",
                        "method": "GET",
                        "name": "Audit"
                      },
                      "collect": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/77317",
                        "method": "PUT",
                        "name": "Collect"
                      },
                      "comment": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "",
                        "method": "POST",
                        "name": "Comments"
                      },
                      "copy": {
                        "body": "",
                        "content_type": "",
                        "form_href": "/api/v2/forms/nodes/copy?id=77317",
                        "href": "/api/v2/nodes",
                        "method": "POST",
                        "name": "Copy"
                      },
                      "delete": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/77317",
                        "method": "DELETE",
                        "name": "Delete"
                      },
                      "docview": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "?func=doc.viewdoc&nodeid=77317",
                        "method": "GET",
                        "name": "View"
                      },
                      "makefavorite": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/members/favorites/77317",
                        "method": "POST",
                        "name": "Add to Favorites"
                      },
                      "more": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "",
                        "method": "",
                        "name": "..."
                      },
                      "move": {
                        "body": "",
                        "content_type": "",
                        "form_href": "/api/v2/forms/nodes/move?id=77317",
                        "href": "/api/v2/nodes/77317",
                        "method": "PUT",
                        "name": "Move"
                      },
                      "open": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/77317/nodes",
                        "method": "GET",
                        "name": "Open"
                      },
                      "permissions": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "",
                        "method": "",
                        "name": "Permissions"
                      },
                      "properties": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/77317",
                        "method": "GET",
                        "name": "Properties"
                      },
                      "rename": {
                        "body": "",
                        "content_type": "",
                        "form_href": "/api/v2/forms/nodes/rename?id=77317",
                        "href": "/api/v2/nodes/77317",
                        "method": "PUT",
                        "name": "Rename"
                      }
                    },
                    "map": {
                      "default_action": "open",
                      "more": [
                        "properties",
                        "audit"
                      ]
                    },
                    "order": [
                      "docview",
                      "open",
                      "addcategory",
                      "rename",
                      "makefavorite",
                      "copy",
                      "collect",
                      "move",
                      "AddReminder",
                      "permissions",
                      "AddClassifications",
                      "AddRMClassifications",
                      "ApplyHold",
                      "AssignXRef",
                      "delete",
                      "comment",
                      "more"
                    ]
                  },
                  "data": {
                    "properties": {
                      "container": true,
                      "container_size": 23,
                      "create_date": "2015-03-27T04:53:30",
                      "create_user_id": 1000,
                      "description": "",
                      "description_multilingual": {
                        "de_DE": "",
                        "en": ""
                      },
                      "external_create_date": null,
                      "external_identity": "",
                      "external_identity_type": "",
                      "external_modify_date": null,
                      "external_source": "",
                      "favorite": false,
                      "id": 77317,
                      "mime_type": null,
                      "modify_date": "2018-09-13T04:54:21",
                      "modify_user_id": 1000,
                      "name": "Specifications",
                      "name_multilingual": {
                        "de_DE": "Specifications",
                        "en": "Specifications"
                      },
                      "owner": "Admin",
                      "owner_group_id": 1001,
                      "owner_user_id": 1000,
                      "parent_id": 2000,
                      "permissions_model": "advanced",
                      "reserved": false,
                      "reserved_date": null,
                      "reserved_shared_collaboration": false,
                      "reserved_user_id": 0,
                      "size": 23,
                      "size_formatted": "23 Items",
                      "type": 0,
                      "type_name": "Folder",
                      "versions_control_advanced": false,
                      "volume_id": -2000
                    }
                  }
                },
                {
                  "actions": {
                    "data": {
                      "addcategory": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/7563230/categories",
                        "method": "POST",
                        "name": "Add Category"
                      },
                      "AddReminder": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "",
                        "method": "GET",
                        "name": "Reminder"
                      },
                      "AddRMClassifications": {
                        "body": "{\"displayPrompt\":false,\"enabled\":true,\"inheritfrom\":false,\"managed\":true}",
                        "content_type": "application/x-www-form-urlencoded",
                        "form_href": "",
                        "href": "/api/v2/nodes/7563230/rmclassifications",
                        "method": "POST",
                        "name": "Add RM Classification"
                      },
                      "ApplyHold": {
                        "body": "",
                        "content_type": "application/x-www-form-urlencoded",
                        "form_href": "",
                        "href": "",
                        "method": "",
                        "name": "Apply Hold"
                      },
                      "AssignXRef": {
                        "body": "",
                        "content_type": "application/x-www-form-urlencoded",
                        "form_href": "",
                        "href": "",
                        "method": "",
                        "name": "Assign Cross-Reference"
                      },
                      "audit": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/7563230/audit?limit=1000",
                        "method": "GET",
                        "name": "Audit"
                      },
                      "collect": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/7563230",
                        "method": "PUT",
                        "name": "Collect"
                      },
                      "comment": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "",
                        "method": "POST",
                        "name": "Comments"
                      },
                      "copy": {
                        "body": "",
                        "content_type": "",
                        "form_href": "/api/v2/forms/nodes/copy?id=7563230",
                        "href": "/api/v2/nodes",
                        "method": "POST",
                        "name": "Copy"
                      },
                      "delete": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/7563230",
                        "method": "DELETE",
                        "name": "Delete"
                      },
                      "docview": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "?func=doc.viewdoc&nodeid=7563230",
                        "method": "GET",
                        "name": "View"
                      },
                      "makefavorite": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/members/favorites/7563230",
                        "method": "POST",
                        "name": "Add to Favorites"
                      },
                      "more": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "",
                        "method": "",
                        "name": "..."
                      },
                      "move": {
                        "body": "",
                        "content_type": "",
                        "form_href": "/api/v2/forms/nodes/move?id=7563230",
                        "href": "/api/v2/nodes/7563230",
                        "method": "PUT",
                        "name": "Move"
                      },
                      "open": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/7563230/nodes",
                        "method": "GET",
                        "name": "Open"
                      },
                      "permissions": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "",
                        "method": "",
                        "name": "Permissions"
                      },
                      "properties": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/7563230",
                        "method": "GET",
                        "name": "Properties"
                      },
                      "rename": {
                        "body": "",
                        "content_type": "",
                        "form_href": "/api/v2/forms/nodes/rename?id=7563230",
                        "href": "/api/v2/nodes/7563230",
                        "method": "PUT",
                        "name": "Rename"
                      }
                    },
                    "map": {
                      "default_action": "open",
                      "more": [
                        "properties",
                        "audit"
                      ]
                    },
                    "order": [
                      "docview",
                      "open",
                      "addcategory",
                      "rename",
                      "makefavorite",
                      "copy",
                      "collect",
                      "move",
                      "AddReminder",
                      "permissions",
                      "AddRMClassifications",
                      "ApplyHold",
                      "AssignXRef",
                      "delete",
                      "comment",
                      "more"
                    ]
                  },
                  "data": {
                    "properties": {
                      "container": true,
                      "container_size": 9,
                      "create_date": "2017-08-31T22:47:14",
                      "create_user_id": 1000,
                      "description": "789456123",
                      "description_multilingual": {
                        "de_DE": "",
                        "en": "789456123"
                      },
                      "external_create_date": null,
                      "external_identity": "",
                      "external_identity_type": "",
                      "external_modify_date": null,
                      "external_source": "",
                      "favorite": false,
                      "id": 7563230,
                      "mime_type": null,
                      "modify_date": "2018-09-05T19:40:20",
                      "modify_user_id": 1000,
                      "name": "00 Folder without any required category attributes",
                      "name_multilingual": {
                        "de_DE": "000 Test",
                        "en": "00 Folder without any required category attributes"
                      },
                      "owner": "Admin",
                      "owner_group_id": 1001,
                      "owner_user_id": 1000,
                      "parent_id": 604999,
                      "permissions_model": "advanced",
                      "reserved": false,
                      "reserved_date": null,
                      "reserved_shared_collaboration": false,
                      "reserved_user_id": 0,
                      "size": 9,
                      "size_formatted": "9 Items",
                      "type": 0,
                      "type_name": "Folder",
                      "versions_control_advanced": false,
                      "volume_id": -2000
                    }
                  }
                },
                {
                  "actions": {
                    "data": {
                      "addcategory": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/11806985/categories",
                        "method": "POST",
                        "name": "Add Category"
                      },
                      "AddClassifications": {
                        "body": "",
                        "content_type": "application/x-www-form-urlencoded",
                        "form_href": "",
                        "href": "/api/v2/nodes/11806985/classifications",
                        "method": "POST",
                        "name": "Add Classification"
                      },
                      "AddReminder": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "",
                        "method": "GET",
                        "name": "Reminder"
                      },
                      "AddRMClassifications": {
                        "body": "{\"displayPrompt\":false,\"enabled\":false,\"inheritfrom\":false,\"managed\":true}",
                        "content_type": "application/x-www-form-urlencoded",
                        "form_href": "",
                        "href": "/api/v2/nodes/11806985/rmclassifications",
                        "method": "POST",
                        "name": "Add RM Classification"
                      },
                      "ApplyHold": {
                        "body": "",
                        "content_type": "application/x-www-form-urlencoded",
                        "form_href": "",
                        "href": "",
                        "method": "",
                        "name": "Apply Hold"
                      },
                      "AssignXRef": {
                        "body": "",
                        "content_type": "application/x-www-form-urlencoded",
                        "form_href": "",
                        "href": "",
                        "method": "",
                        "name": "Assign Cross-Reference"
                      },
                      "audit": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/11806985/audit?limit=1000",
                        "method": "GET",
                        "name": "Audit"
                      },
                      "collect": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/11806985",
                        "method": "PUT",
                        "name": "Collect"
                      },
                      "comment": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "",
                        "method": "POST",
                        "name": "Comments"
                      },
                      "copy": {
                        "body": "",
                        "content_type": "",
                        "form_href": "/api/v2/forms/nodes/copy?id=11806985",
                        "href": "/api/v2/nodes",
                        "method": "POST",
                        "name": "Copy"
                      },
                      "delete": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/11806985",
                        "method": "DELETE",
                        "name": "Delete"
                      },
                      "docview": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "?func=doc.viewdoc&nodeid=11806985",
                        "method": "GET",
                        "name": "View"
                      },
                      "FinalizeRecord": {
                        "body": "false",
                        "content_type": "application/x-www-form-urlencoded",
                        "form_href": "",
                        "href": "/api/v2/nodes/11806985",
                        "method": "PUT",
                        "name": "Finalize Record"
                      },
                      "makefavorite": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/members/favorites/11806985",
                        "method": "POST",
                        "name": "Add to Favorites"
                      },
                      "more": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "",
                        "method": "",
                        "name": "..."
                      },
                      "move": {
                        "body": "",
                        "content_type": "",
                        "form_href": "/api/v2/forms/nodes/move?id=11806985",
                        "href": "/api/v2/nodes/11806985",
                        "method": "PUT",
                        "name": "Move"
                      },
                      "open": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/11806985/nodes",
                        "method": "GET",
                        "name": "Open"
                      },
                      "permissions": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "",
                        "method": "",
                        "name": "Permissions"
                      },
                      "properties": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/11806985",
                        "method": "GET",
                        "name": "Properties"
                      },
                      "rename": {
                        "body": "",
                        "content_type": "",
                        "form_href": "/api/v2/forms/nodes/rename?id=11806985",
                        "href": "/api/v2/nodes/11806985",
                        "method": "PUT",
                        "name": "Rename"
                      }
                    },
                    "map": {
                      "default_action": "open",
                      "more": [
                        "properties",
                        "audit"
                      ]
                    },
                    "order": [
                      "docview",
                      "open",
                      "addcategory",
                      "rename",
                      "makefavorite",
                      "copy",
                      "collect",
                      "move",
                      "AddReminder",
                      "permissions",
                      "AddClassifications",
                      "AddRMClassifications",
                      "ApplyHold",
                      "AssignXRef",
                      "delete",
                      "FinalizeRecord",
                      "comment",
                      "more"
                    ]
                  },
                  "data": {
                    "properties": {
                      "container": true,
                      "container_size": 20,
                      "create_date": "2018-01-31T01:53:24",
                      "create_user_id": 1000,
                      "description": "sadsd",
                      "description_multilingual": {
                        "en": "sadsd",
                        "ja": ""
                      },
                      "external_create_date": null,
                      "external_identity": "",
                      "external_identity_type": "",
                      "external_modify_date": null,
                      "external_source": "",
                      "favorite": false,
                      "id": 11806985,
                      "mime_type": null,
                      "modify_date": "2018-09-16T23:43:46",
                      "modify_user_id": 1000,
                      "name": "00000 test suresh",
                      "name_multilingual": {
                        "en": "00000 test suresh",
                        "ja": "00000testsuresh"
                      },
                      "owner": "Admin",
                      "owner_group_id": 1001,
                      "owner_user_id": 1000,
                      "parent_id": 604999,
                      "permissions_model": "advanced",
                      "reserved": false,
                      "reserved_date": null,
                      "reserved_shared_collaboration": false,
                      "reserved_user_id": 0,
                      "size": 20,
                      "size_formatted": "20 Items",
                      "type": 0,
                      "type_name": "Folder",
                      "versions_control_advanced": false,
                      "volume_id": -2000
                    }
                  }
                },
                {
                  "actions": {
                    "data": {
                      "addcategory": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/1286747/categories",
                        "method": "POST",
                        "name": "Add Category"
                      },
                      "AddRMClassifications": {
                        "body": "{\"displayPrompt\":false,\"enabled\":false,\"inheritfrom\":false,\"managed\":false}",
                        "content_type": "application/x-www-form-urlencoded",
                        "form_href": "",
                        "href": "/api/v2/nodes/1286747/rmclassifications",
                        "method": "POST",
                        "name": "Add RM Classification"
                      },
                      "audit": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/1286747/audit?limit=1000",
                        "method": "GET",
                        "name": "Audit"
                      },
                      "docview": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "?func=doc.viewdoc&nodeid=1286747",
                        "method": "GET",
                        "name": "View"
                      },
                      "makefavorite": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/members/favorites/1286747",
                        "method": "POST",
                        "name": "Add to Favorites"
                      },
                      "more": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "",
                        "method": "",
                        "name": "..."
                      },
                      "open": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/1286747/nodes",
                        "method": "GET",
                        "name": "Open"
                      },
                      "permissions": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "",
                        "method": "",
                        "name": "Permissions"
                      },
                      "properties": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/1286747",
                        "method": "GET",
                        "name": "Properties"
                      }
                    },
                    "map": {
                      "default_action": "",
                      "more": [
                        "properties",
                        "audit"
                      ]
                    },
                    "order": [
                      "docview",
                      "open",
                      "addcategory",
                      "makefavorite",
                      "permissions",
                      "AddRMClassifications",
                      "more"
                    ]
                  },
                  "data": {
                    "properties": {
                      "container": true,
                      "container_size": 12,
                      "create_date": "2016-07-14T01:50:49",
                      "create_user_id": 1000,
                      "description": "",
                      "description_multilingual": {
                        "en": ""
                      },
                      "external_create_date": null,
                      "external_identity": "",
                      "external_identity_type": "",
                      "external_modify_date": null,
                      "external_source": "",
                      "favorite": false,
                      "id": 1286747,
                      "mime_type": null,
                      "modify_date": "2018-03-12T18:21:38",
                      "modify_user_id": 1000,
                      "name": "007 Ravi",
                      "name_multilingual": {
                        "en": "007 Ravi"
                      },
                      "owner": "Admin",
                      "owner_group_id": 1001,
                      "owner_user_id": 1000,
                      "parent_id": 2004,
                      "permissions_model": "advanced",
                      "reserved": false,
                      "reserved_date": null,
                      "reserved_shared_collaboration": false,
                      "reserved_user_id": 0,
                      "size": 12,
                      "size_formatted": "12 Items",
                      "type": 132,
                      "type_name": "Category Folder",
                      "versions_control_advanced": false,
                      "volume_id": -2004
                    }
                  }
                },
                {
                  "actions": {
                    "data": {
                      "addcategory": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/8230344/categories",
                        "method": "POST",
                        "name": "Add Category"
                      },
                      "AddClassifications": {
                        "body": "",
                        "content_type": "application/x-www-form-urlencoded",
                        "form_href": "",
                        "href": "/api/v2/nodes/8230344/classifications",
                        "method": "POST",
                        "name": "Add Classification"
                      },
                      "AddReminder": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "",
                        "method": "GET",
                        "name": "Reminder"
                      },
                      "AddRMClassifications": {
                        "body": "{\"displayPrompt\":false,\"enabled\":true,\"inheritfrom\":false,\"managed\":true}",
                        "content_type": "application/x-www-form-urlencoded",
                        "form_href": "",
                        "href": "/api/v2/nodes/8230344/rmclassifications",
                        "method": "POST",
                        "name": "Add RM Classification"
                      },
                      "ApplyHold": {
                        "body": "",
                        "content_type": "application/x-www-form-urlencoded",
                        "form_href": "",
                        "href": "",
                        "method": "",
                        "name": "Apply Hold"
                      },
                      "AssignXRef": {
                        "body": "",
                        "content_type": "application/x-www-form-urlencoded",
                        "form_href": "",
                        "href": "",
                        "method": "",
                        "name": "Assign Cross-Reference"
                      },
                      "audit": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/8230344/audit?limit=1000",
                        "method": "GET",
                        "name": "Audit"
                      },
                      "collect": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/8230344",
                        "method": "PUT",
                        "name": "Collect"
                      },
                      "comment": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "",
                        "method": "POST",
                        "name": "Comments"
                      },
                      "copy": {
                        "body": "",
                        "content_type": "",
                        "form_href": "/api/v2/forms/nodes/copy?id=8230344",
                        "href": "/api/v2/nodes",
                        "method": "POST",
                        "name": "Copy"
                      },
                      "delete": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/8230344",
                        "method": "DELETE",
                        "name": "Delete"
                      },
                      "docview": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "?func=doc.viewdoc&nodeid=8230344",
                        "method": "GET",
                        "name": "View"
                      },
                      "makefavorite": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/members/favorites/8230344",
                        "method": "POST",
                        "name": "Add to Favorites"
                      },
                      "more": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "",
                        "method": "",
                        "name": "..."
                      },
                      "move": {
                        "body": "",
                        "content_type": "",
                        "form_href": "/api/v2/forms/nodes/move?id=8230344",
                        "href": "/api/v2/nodes/8230344",
                        "method": "PUT",
                        "name": "Move"
                      },
                      "open": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/8230344/nodes",
                        "method": "GET",
                        "name": "Open"
                      },
                      "permissions": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "",
                        "method": "",
                        "name": "Permissions"
                      },
                      "properties": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/8230344",
                        "method": "GET",
                        "name": "Properties"
                      },
                      "rename": {
                        "body": "",
                        "content_type": "",
                        "form_href": "/api/v2/forms/nodes/rename?id=8230344",
                        "href": "/api/v2/nodes/8230344",
                        "method": "PUT",
                        "name": "Rename"
                      }
                    },
                    "map": {
                      "default_action": "open",
                      "more": [
                        "properties",
                        "audit"
                      ]
                    },
                    "order": [
                      "docview",
                      "open",
                      "addcategory",
                      "rename",
                      "makefavorite",
                      "copy",
                      "collect",
                      "move",
                      "AddReminder",
                      "permissions",
                      "AddClassifications",
                      "AddRMClassifications",
                      "ApplyHold",
                      "AssignXRef",
                      "delete",
                      "comment",
                      "more"
                    ]
                  },
                  "data": {
                    "properties": {
                      "container": true,
                      "container_size": 103,
                      "create_date": "2017-08-11T14:34:25",
                      "create_user_id": 1000,
                      "description": "",
                      "description_multilingual": {
                        "en": ""
                      },
                      "external_create_date": null,
                      "external_identity": "",
                      "external_identity_type": "",
                      "external_modify_date": null,
                      "external_source": "",
                      "favorite": false,
                      "id": 8230344,
                      "mime_type": null,
                      "modify_date": "2018-09-05T19:39:24",
                      "modify_user_id": 1000,
                      "name": "100 folders",
                      "name_multilingual": {
                        "en": "100 folders"
                      },
                      "owner": "Admin",
                      "owner_group_id": 1001,
                      "owner_user_id": 1000,
                      "parent_id": 913574,
                      "permissions_model": "advanced",
                      "reserved": false,
                      "reserved_date": null,
                      "reserved_shared_collaboration": false,
                      "reserved_user_id": 0,
                      "size": 103,
                      "size_formatted": "103 Items",
                      "type": 0,
                      "type_name": "Folder",
                      "versions_control_advanced": false,
                      "volume_id": -2000
                    }
                  }
                },
                {
                  "actions": {
                    "data": {
                      "addcategory": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/11486653/categories",
                        "method": "POST",
                        "name": "Add Category"
                      },
                      "AddReminder": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "",
                        "method": "GET",
                        "name": "Reminder"
                      },
                      "AddRMClassifications": {
                        "body": "{\"displayPrompt\":false,\"enabled\":true,\"inheritfrom\":false,\"managed\":true}",
                        "content_type": "application/x-www-form-urlencoded",
                        "form_href": "",
                        "href": "/api/v2/nodes/11486653/rmclassifications",
                        "method": "POST",
                        "name": "Add RM Classification"
                      },
                      "ApplyHold": {
                        "body": "",
                        "content_type": "application/x-www-form-urlencoded",
                        "form_href": "",
                        "href": "",
                        "method": "",
                        "name": "Apply Hold"
                      },
                      "AssignXRef": {
                        "body": "",
                        "content_type": "application/x-www-form-urlencoded",
                        "form_href": "",
                        "href": "",
                        "method": "",
                        "name": "Assign Cross-Reference"
                      },
                      "audit": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/11486653/audit?limit=1000",
                        "method": "GET",
                        "name": "Audit"
                      },
                      "collect": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/11486653",
                        "method": "PUT",
                        "name": "Collect"
                      },
                      "comment": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "",
                        "method": "POST",
                        "name": "Comments"
                      },
                      "copy": {
                        "body": "",
                        "content_type": "",
                        "form_href": "/api/v2/forms/nodes/copy?id=11486653",
                        "href": "/api/v2/nodes",
                        "method": "POST",
                        "name": "Copy"
                      },
                      "delete": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/11486653",
                        "method": "DELETE",
                        "name": "Delete"
                      },
                      "docview": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "?func=doc.viewdoc&nodeid=11486653",
                        "method": "GET",
                        "name": "View"
                      },
                      "makefavorite": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/members/favorites/11486653",
                        "method": "POST",
                        "name": "Add to Favorites"
                      },
                      "more": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "",
                        "method": "",
                        "name": "..."
                      },
                      "move": {
                        "body": "",
                        "content_type": "",
                        "form_href": "/api/v2/forms/nodes/move?id=11486653",
                        "href": "/api/v2/nodes/11486653",
                        "method": "PUT",
                        "name": "Move"
                      },
                      "open": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/11486653/nodes",
                        "method": "GET",
                        "name": "Open"
                      },
                      "permissions": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "",
                        "method": "",
                        "name": "Permissions"
                      },
                      "properties": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/11486653",
                        "method": "GET",
                        "name": "Properties"
                      },
                      "rename": {
                        "body": "",
                        "content_type": "",
                        "form_href": "/api/v2/forms/nodes/rename?id=11486653",
                        "href": "/api/v2/nodes/11486653",
                        "method": "PUT",
                        "name": "Rename"
                      }
                    },
                    "map": {
                      "default_action": "open",
                      "more": [
                        "properties",
                        "audit"
                      ]
                    },
                    "order": [
                      "docview",
                      "open",
                      "addcategory",
                      "rename",
                      "makefavorite",
                      "copy",
                      "collect",
                      "move",
                      "AddReminder",
                      "permissions",
                      "AddRMClassifications",
                      "ApplyHold",
                      "AssignXRef",
                      "delete",
                      "comment",
                      "more"
                    ]
                  },
                  "data": {
                    "properties": {
                      "container": true,
                      "container_size": 5,
                      "create_date": "2018-01-21T18:44:35",
                      "create_user_id": 1000,
                      "description": "",
                      "description_multilingual": {
                        "en": "",
                        "ja": ""
                      },
                      "external_create_date": null,
                      "external_identity": "",
                      "external_identity_type": "",
                      "external_modify_date": null,
                      "external_source": "",
                      "favorite": false,
                      "id": 11486653,
                      "mime_type": null,
                      "modify_date": "2018-09-05T19:40:44",
                      "modify_user_id": 1000,
                      "name": "Shankar's folder",
                      "name_multilingual": {
                        "en": "Shankar's folder",
                        "ja": "Shankar's folder"
                      },
                      "owner": "Admin",
                      "owner_group_id": 1001,
                      "owner_user_id": 1000,
                      "parent_id": 604999,
                      "permissions_model": "advanced",
                      "reserved": false,
                      "reserved_date": null,
                      "reserved_shared_collaboration": false,
                      "reserved_user_id": 0,
                      "size": 5,
                      "size_formatted": "5 Items",
                      "type": 0,
                      "type_name": "Folder",
                      "versions_control_advanced": false,
                      "volume_id": -2000
                    }
                  }
                },
                {
                  "actions": {
                    "data": {
                      "addcategory": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/11995091/categories",
                        "method": "POST",
                        "name": "Add Category"
                      },
                      "AddReminder": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "",
                        "method": "GET",
                        "name": "Reminder"
                      },
                      "AddRMClassifications": {
                        "body": "{\"displayPrompt\":false,\"enabled\":true,\"inheritfrom\":false,\"managed\":true}",
                        "content_type": "application/x-www-form-urlencoded",
                        "form_href": "",
                        "href": "/api/v2/nodes/11995091/rmclassifications",
                        "method": "POST",
                        "name": "Add RM Classification"
                      },
                      "ApplyHold": {
                        "body": "",
                        "content_type": "application/x-www-form-urlencoded",
                        "form_href": "",
                        "href": "",
                        "method": "",
                        "name": "Apply Hold"
                      },
                      "AssignXRef": {
                        "body": "",
                        "content_type": "application/x-www-form-urlencoded",
                        "form_href": "",
                        "href": "",
                        "method": "",
                        "name": "Assign Cross-Reference"
                      },
                      "audit": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/11995091/audit?limit=1000",
                        "method": "GET",
                        "name": "Audit"
                      },
                      "collect": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/11995091",
                        "method": "PUT",
                        "name": "Collect"
                      },
                      "comment": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "",
                        "method": "POST",
                        "name": "Comments"
                      },
                      "copy": {
                        "body": "",
                        "content_type": "",
                        "form_href": "/api/v2/forms/nodes/copy?id=11995091",
                        "href": "/api/v2/nodes",
                        "method": "POST",
                        "name": "Copy"
                      },
                      "delete": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/11995091",
                        "method": "DELETE",
                        "name": "Delete"
                      },
                      "docview": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "?func=doc.viewdoc&nodeid=11995091",
                        "method": "GET",
                        "name": "View"
                      },
                      "makefavorite": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/members/favorites/11995091",
                        "method": "POST",
                        "name": "Add to Favorites"
                      },
                      "more": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "",
                        "method": "",
                        "name": "..."
                      },
                      "move": {
                        "body": "",
                        "content_type": "",
                        "form_href": "/api/v2/forms/nodes/move?id=11995091",
                        "href": "/api/v2/nodes/11995091",
                        "method": "PUT",
                        "name": "Move"
                      },
                      "open": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/11995091/nodes",
                        "method": "GET",
                        "name": "Open"
                      },
                      "permissions": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "",
                        "method": "",
                        "name": "Permissions"
                      },
                      "properties": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/11995091",
                        "method": "GET",
                        "name": "Properties"
                      },
                      "rename": {
                        "body": "",
                        "content_type": "",
                        "form_href": "/api/v2/forms/nodes/rename?id=11995091",
                        "href": "/api/v2/nodes/11995091",
                        "method": "PUT",
                        "name": "Rename"
                      }
                    },
                    "map": {
                      "default_action": "open",
                      "more": [
                        "properties",
                        "audit"
                      ]
                    },
                    "order": [
                      "docview",
                      "open",
                      "addcategory",
                      "rename",
                      "makefavorite",
                      "copy",
                      "collect",
                      "move",
                      "AddReminder",
                      "permissions",
                      "AddRMClassifications",
                      "ApplyHold",
                      "AssignXRef",
                      "delete",
                      "comment",
                      "more"
                    ]
                  },
                  "data": {
                    "properties": {
                      "container": true,
                      "container_size": 18,
                      "create_date": "2018-02-05T23:22:30",
                      "create_user_id": 1000,
                      "description": "ddd",
                      "description_multilingual": {
                        "ja": "ddd"
                      },
                      "external_create_date": null,
                      "external_identity": "",
                      "external_identity_type": "",
                      "external_modify_date": null,
                      "external_source": "",
                      "favorite": false,
                      "id": 11995091,
                      "mime_type": null,
                      "modify_date": "2018-09-05T19:39:32",
                      "modify_user_id": 1000,
                      "name": "All CS Object Types",
                      "name_multilingual": {
                        "ja": "All CS Object Types"
                      },
                      "owner": "Admin",
                      "owner_group_id": 1001,
                      "owner_user_id": 1000,
                      "parent_id": 1282482,
                      "permissions_model": "advanced",
                      "reserved": false,
                      "reserved_date": null,
                      "reserved_shared_collaboration": false,
                      "reserved_user_id": 0,
                      "size": 18,
                      "size_formatted": "18 Items",
                      "type": 0,
                      "type_name": "Folder",
                      "versions_control_advanced": false,
                      "volume_id": -2000
                    }
                  }
                },
                {
                  "actions": {
                    "data": {
                      "addcategory": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/12820733/categories",
                        "method": "POST",
                        "name": "Add Category"
                      },
                      "AddClassifications": {
                        "body": "",
                        "content_type": "application/x-www-form-urlencoded",
                        "form_href": "",
                        "href": "/api/v2/nodes/12820733/classifications",
                        "method": "POST",
                        "name": "Add Classification"
                      },
                      "AddReminder": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "",
                        "method": "GET",
                        "name": "Reminder"
                      },
                      "AddRMClassifications": {
                        "body": "{\"displayPrompt\":false,\"enabled\":true,\"inheritfrom\":false,\"managed\":true}",
                        "content_type": "application/x-www-form-urlencoded",
                        "form_href": "",
                        "href": "/api/v2/nodes/12820733/rmclassifications",
                        "method": "POST",
                        "name": "Add RM Classification"
                      },
                      "ApplyHold": {
                        "body": "",
                        "content_type": "application/x-www-form-urlencoded",
                        "form_href": "",
                        "href": "",
                        "method": "",
                        "name": "Apply Hold"
                      },
                      "AssignXRef": {
                        "body": "",
                        "content_type": "application/x-www-form-urlencoded",
                        "form_href": "",
                        "href": "",
                        "method": "",
                        "name": "Assign Cross-Reference"
                      },
                      "audit": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/12820733/audit?limit=1000",
                        "method": "GET",
                        "name": "Audit"
                      },
                      "collect": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/12820733",
                        "method": "PUT",
                        "name": "Collect"
                      },
                      "comment": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "",
                        "method": "POST",
                        "name": "Comments"
                      },
                      "copy": {
                        "body": "",
                        "content_type": "",
                        "form_href": "/api/v2/forms/nodes/copy?id=12820733",
                        "href": "/api/v2/nodes",
                        "method": "POST",
                        "name": "Copy"
                      },
                      "delete": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/12820733",
                        "method": "DELETE",
                        "name": "Delete"
                      },
                      "docview": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "?func=doc.viewdoc&nodeid=12820733",
                        "method": "GET",
                        "name": "View"
                      },
                      "makefavorite": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/members/favorites/12820733",
                        "method": "POST",
                        "name": "Add to Favorites"
                      },
                      "more": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "",
                        "method": "",
                        "name": "..."
                      },
                      "move": {
                        "body": "",
                        "content_type": "",
                        "form_href": "/api/v2/forms/nodes/move?id=12820733",
                        "href": "/api/v2/nodes/12820733",
                        "method": "PUT",
                        "name": "Move"
                      },
                      "open": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/12820733/nodes",
                        "method": "GET",
                        "name": "Open"
                      },
                      "permissions": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "",
                        "method": "",
                        "name": "Permissions"
                      },
                      "properties": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/12820733",
                        "method": "GET",
                        "name": "Properties"
                      },
                      "rename": {
                        "body": "",
                        "content_type": "",
                        "form_href": "/api/v2/forms/nodes/rename?id=12820733",
                        "href": "/api/v2/nodes/12820733",
                        "method": "PUT",
                        "name": "Rename"
                      }
                    },
                    "map": {
                      "default_action": "open",
                      "more": [
                        "properties",
                        "audit"
                      ]
                    },
                    "order": [
                      "docview",
                      "open",
                      "addcategory",
                      "rename",
                      "makefavorite",
                      "copy",
                      "collect",
                      "move",
                      "AddReminder",
                      "permissions",
                      "AddClassifications",
                      "AddRMClassifications",
                      "ApplyHold",
                      "AssignXRef",
                      "delete",
                      "comment",
                      "more"
                    ]
                  },
                  "data": {
                    "properties": {
                      "container": true,
                      "container_size": 5,
                      "create_date": "2018-03-08T22:01:59",
                      "create_user_id": 1000,
                      "description": "Nam at tortor in tellus interdum sagittis. Nulla neque dolor, sagittis eget, iaculis quis, molestie non, velit. Nullam tincidunt adipiscing enim.\n\nCurabitur at lacus ac velit ornare lobortis. Aenean commodo ligula eget dolor. Sed magna purus, fermentum eu, tincidunt eu, varius ut, felis.\n\nVestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Fusce id purus. Donec mollis hendrerit risus. Nulla porta dolor.",
                      "description_multilingual": {
                        "en": "Nam at tortor in tellus interdum sagittis. Nulla neque dolor, sagittis eget, iaculis quis, molestie non, velit. Nullam tincidunt adipiscing enim.\n\nCurabitur at lacus ac velit ornare lobortis. Aenean commodo ligula eget dolor. Sed magna purus, fermentum eu, tincidunt eu, varius ut, felis.\n\nVestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Fusce id purus. Donec mollis hendrerit risus. Nulla porta dolor.",
                        "ja": ""
                      },
                      "external_create_date": null,
                      "external_identity": "",
                      "external_identity_type": "",
                      "external_modify_date": null,
                      "external_source": "",
                      "favorite": false,
                      "id": 12820733,
                      "mime_type": null,
                      "modify_date": "2018-09-05T19:40:02",
                      "modify_user_id": 1000,
                      "name": "Container types",
                      "name_multilingual": {
                        "en": "Container types",
                        "ja": "444"
                      },
                      "owner": "Admin",
                      "owner_group_id": 1001,
                      "owner_user_id": 1000,
                      "parent_id": 2609792,
                      "permissions_model": "advanced",
                      "reserved": false,
                      "reserved_date": null,
                      "reserved_shared_collaboration": false,
                      "reserved_user_id": 0,
                      "size": 5,
                      "size_formatted": "5 Items",
                      "type": 0,
                      "type_name": "Folder",
                      "versions_control_advanced": false,
                      "volume_id": -2000
                    }
                  }
                },
                {
                  "actions": {
                    "data": {
                      "addcategory": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/2609792/categories",
                        "method": "POST",
                        "name": "Add Category"
                      },
                      "AddClassifications": {
                        "body": "",
                        "content_type": "application/x-www-form-urlencoded",
                        "form_href": "",
                        "href": "/api/v2/nodes/2609792/classifications",
                        "method": "POST",
                        "name": "Add Classification"
                      },
                      "AddReminder": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "",
                        "method": "GET",
                        "name": "Reminder"
                      },
                      "AddRMClassifications": {
                        "body": "{\"displayPrompt\":false,\"enabled\":false,\"inheritfrom\":false,\"managed\":true}",
                        "content_type": "application/x-www-form-urlencoded",
                        "form_href": "",
                        "href": "/api/v2/nodes/2609792/rmclassifications",
                        "method": "POST",
                        "name": "Add RM Classification"
                      },
                      "ApplyHold": {
                        "body": "",
                        "content_type": "application/x-www-form-urlencoded",
                        "form_href": "",
                        "href": "",
                        "method": "",
                        "name": "Apply Hold"
                      },
                      "AssignXRef": {
                        "body": "",
                        "content_type": "application/x-www-form-urlencoded",
                        "form_href": "",
                        "href": "",
                        "method": "",
                        "name": "Assign Cross-Reference"
                      },
                      "audit": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/2609792/audit?limit=1000",
                        "method": "GET",
                        "name": "Audit"
                      },
                      "collect": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/2609792",
                        "method": "PUT",
                        "name": "Collect"
                      },
                      "comment": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "",
                        "method": "POST",
                        "name": "Comments"
                      },
                      "copy": {
                        "body": "",
                        "content_type": "",
                        "form_href": "/api/v2/forms/nodes/copy?id=2609792",
                        "href": "/api/v2/nodes",
                        "method": "POST",
                        "name": "Copy"
                      },
                      "delete": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/2609792",
                        "method": "DELETE",
                        "name": "Delete"
                      },
                      "docview": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "?func=doc.viewdoc&nodeid=2609792",
                        "method": "GET",
                        "name": "View"
                      },
                      "FinalizeRecord": {
                        "body": "false",
                        "content_type": "application/x-www-form-urlencoded",
                        "form_href": "",
                        "href": "/api/v2/nodes/2609792",
                        "method": "PUT",
                        "name": "Finalize Record"
                      },
                      "makefavorite": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/members/favorites/2609792",
                        "method": "POST",
                        "name": "Add to Favorites"
                      },
                      "more": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "",
                        "method": "",
                        "name": "..."
                      },
                      "move": {
                        "body": "",
                        "content_type": "",
                        "form_href": "/api/v2/forms/nodes/move?id=2609792",
                        "href": "/api/v2/nodes/2609792",
                        "method": "PUT",
                        "name": "Move"
                      },
                      "open": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/2609792/nodes",
                        "method": "GET",
                        "name": "Open"
                      },
                      "permissions": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "",
                        "method": "",
                        "name": "Permissions"
                      },
                      "properties": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/2609792",
                        "method": "GET",
                        "name": "Properties"
                      },
                      "rename": {
                        "body": "",
                        "content_type": "",
                        "form_href": "/api/v2/forms/nodes/rename?id=2609792",
                        "href": "/api/v2/nodes/2609792",
                        "method": "PUT",
                        "name": "Rename"
                      }
                    },
                    "map": {
                      "default_action": "open",
                      "more": [
                        "properties",
                        "audit"
                      ]
                    },
                    "order": [
                      "docview",
                      "open",
                      "addcategory",
                      "rename",
                      "makefavorite",
                      "copy",
                      "collect",
                      "move",
                      "AddReminder",
                      "permissions",
                      "AddClassifications",
                      "AddRMClassifications",
                      "ApplyHold",
                      "AssignXRef",
                      "delete",
                      "FinalizeRecord",
                      "comment",
                      "more"
                    ]
                  },
                  "data": {
                    "properties": {
                      "container": true,
                      "container_size": 20,
                      "create_date": "2017-03-22T00:41:01",
                      "create_user_id": 327084,
                      "description": "This folder is created for Kaveri team demo purpose. Please don't update anything in it :)",
                      "description_multilingual": {
                        "de_DE": "This folder is created for Kaveri team demo purpose. Please don't update anything in it :) :)",
                        "en": "This folder is created for Kaveri team demo purpose. Please don't update anything in it :)"
                      },
                      "external_create_date": null,
                      "external_identity": "",
                      "external_identity_type": "",
                      "external_modify_date": null,
                      "external_source": "",
                      "favorite": false,
                      "id": 2609792,
                      "mime_type": null,
                      "modify_date": "2018-09-10T18:30:31",
                      "modify_user_id": 1000,
                      "name": "000 Kaveri team demo folder",
                      "name_multilingual": {
                        "de_DE": "000 Kaveri team demo folder",
                        "en": "000 Kaveri team demo folder"
                      },
                      "owner": "Kuchana, Navya",
                      "owner_group_id": 1001,
                      "owner_user_id": 327084,
                      "parent_id": 604999,
                      "permissions_model": "advanced",
                      "reserved": false,
                      "reserved_date": null,
                      "reserved_shared_collaboration": false,
                      "reserved_user_id": 0,
                      "size": 20,
                      "size_formatted": "20 Items",
                      "type": 0,
                      "type_name": "Folder",
                      "versions_control_advanced": false,
                      "volume_id": -2000
                    }
                  }
                },
                {
                  "actions": {
                    "data": {
                      "addcategory": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/1282482/categories",
                        "method": "POST",
                        "name": "Add Category"
                      },
                      "AddClassifications": {
                        "body": "",
                        "content_type": "application/x-www-form-urlencoded",
                        "form_href": "",
                        "href": "/api/v2/nodes/1282482/classifications",
                        "method": "POST",
                        "name": "Add Classification"
                      },
                      "AddReminder": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "",
                        "method": "GET",
                        "name": "Reminder"
                      },
                      "AddRMClassifications": {
                        "body": "{\"displayPrompt\":false,\"enabled\":false,\"inheritfrom\":false,\"managed\":true}",
                        "content_type": "application/x-www-form-urlencoded",
                        "form_href": "",
                        "href": "/api/v2/nodes/1282482/rmclassifications",
                        "method": "POST",
                        "name": "Add RM Classification"
                      },
                      "ApplyHold": {
                        "body": "",
                        "content_type": "application/x-www-form-urlencoded",
                        "form_href": "",
                        "href": "",
                        "method": "",
                        "name": "Apply Hold"
                      },
                      "AssignXRef": {
                        "body": "",
                        "content_type": "application/x-www-form-urlencoded",
                        "form_href": "",
                        "href": "",
                        "method": "",
                        "name": "Assign Cross-Reference"
                      },
                      "audit": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/1282482/audit?limit=1000",
                        "method": "GET",
                        "name": "Audit"
                      },
                      "collect": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/1282482",
                        "method": "PUT",
                        "name": "Collect"
                      },
                      "comment": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "",
                        "method": "POST",
                        "name": "Comments"
                      },
                      "copy": {
                        "body": "",
                        "content_type": "",
                        "form_href": "/api/v2/forms/nodes/copy?id=1282482",
                        "href": "/api/v2/nodes",
                        "method": "POST",
                        "name": "Copy"
                      },
                      "delete": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/1282482",
                        "method": "DELETE",
                        "name": "Delete"
                      },
                      "docview": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "?func=doc.viewdoc&nodeid=1282482",
                        "method": "GET",
                        "name": "View"
                      },
                      "more": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "",
                        "method": "",
                        "name": "..."
                      },
                      "move": {
                        "body": "",
                        "content_type": "",
                        "form_href": "/api/v2/forms/nodes/move?id=1282482",
                        "href": "/api/v2/nodes/1282482",
                        "method": "PUT",
                        "name": "Move"
                      },
                      "open": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/1282482/nodes",
                        "method": "GET",
                        "name": "Open"
                      },
                      "permissions": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "",
                        "method": "",
                        "name": "Permissions"
                      },
                      "properties": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/nodes/1282482",
                        "method": "GET",
                        "name": "Properties"
                      },
                      "removefavorite": {
                        "body": "",
                        "content_type": "",
                        "form_href": "",
                        "href": "/api/v2/members/favorites/1282482",
                        "method": "DELETE",
                        "name": "Remove Favorite"
                      },
                      "rename": {
                        "body": "",
                        "content_type": "",
                        "form_href": "/api/v2/forms/nodes/rename?id=1282482",
                        "href": "/api/v2/nodes/1282482",
                        "method": "PUT",
                        "name": "Rename"
                      }
                    },
                    "map": {
                      "default_action": "open",
                      "more": [
                        "properties",
                        "audit"
                      ]
                    },
                    "order": [
                      "docview",
                      "open",
                      "addcategory",
                      "rename",
                      "removefavorite",
                      "copy",
                      "collect",
                      "move",
                      "AddReminder",
                      "permissions",
                      "AddClassifications",
                      "AddRMClassifications",
                      "ApplyHold",
                      "AssignXRef",
                      "delete",
                      "comment",
                      "more"
                    ]
                  },
                  "data": {
                    "properties": {
                      "container": true,
                      "container_size": 26,
                      "create_date": "2016-07-14T00:49:07",
                      "create_user_id": 1000,
                      "description": "",
                      "description_multilingual": {
                        "de_DE": "",
                        "en": "",
                        "ja": ""
                      },
                      "external_create_date": null,
                      "external_identity": "",
                      "external_identity_type": "",
                      "external_modify_date": null,
                      "external_source": "",
                      "favorite": true,
                      "id": 1282482,
                      "mime_type": null,
                      "modify_date": "2018-09-05T19:39:31",
                      "modify_user_id": 1000,
                      "name": "<!-- 007 Ravi Lab -->",
                      "name_multilingual": {
                        "de_DE": "0 0 7 Ravi Lab",
                        "en": "<!-- 007 Ravi Lab -->",
                        "ja": "<!-- 007 Ravi Lab -->"
                      },
                      "owner": "Admin",
                      "owner_group_id": 1001,
                      "owner_user_id": 1000,
                      "parent_id": 604999,
                      "permissions_model": "advanced",
                      "reserved": false,
                      "reserved_date": null,
                      "reserved_shared_collaboration": false,
                      "reserved_user_id": 0,
                      "size": 26,
                      "size_formatted": "26 Items",
                      "type": 0,
                      "type_name": "Folder",
                      "versions_control_advanced": false,
                      "volume_id": -2000
                    }
                  }
                }
              ]
            },
          responseTime: 0,
        });
        
      },
      disable: function () {
        mockjax.clear();
      }
    };
  });
  