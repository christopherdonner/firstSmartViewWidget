/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'require', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/jquery.mockjax'
], function (require, _, $, mockjax) {
  'use strict';
  var mocks = [];
  return {
    enable: function () {
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/auth',
        responseTime: 5,
        type: 'GET',
        responseText: {
          "data": {
            "birth_date": "1900-10-31T00:00:00",
            "business_email": "murdockadmin@opentext.com",
            "business_fax": "67352895",
            "business_phone": "+78-58476846565",
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
          }
        }
      })),
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/members/accessed?fields=properties%7Bid%2Cname%2Ctype%2Ctype_name%7D&fields=versions%7Bmime_type%7D.element(0)&actions=default&actions=open&actions=download',
        responseTime: 5,
        type: 'GET',
        responseText: {
          "links": {
              "data": {
                  "self": {
                      "body": "",
                      "content_type": "",
                      "href": "/api/v2/members/accessed?actions=open&actions=download&actions=properties&actions=followup&actions=initiateworkflow&fields=properties{id,name,type,type_name}&fields=versions{mime_type}.element(0)&where_type=144&where_type=955&where_type=0&where_type=298&where_type=145&where_type=899",
                      "method": "GET",
                      "name": ""
                  }
              }
          },
          "results": [
              {
                  "actions": {
                      "data": {
                          "download": {
                              "body": "",
                              "content_type": "",
                              "form_href": "",
                              "href": "/api/v2/nodes/12600207/content?download",
                              "method": "GET",
                              "name": "Download"
                          },
                          "FollowUp": {
                              "body": "",
                              "content_type": "",
                              "form_href": "",
                              "href": "",
                              "method": "GET",
                              "name": "Reminder"
                          },
                          "open": {
                              "body": "",
                              "content_type": "",
                              "form_href": "",
                              "href": "/api/v2/nodes/12600207/content",
                              "method": "GET",
                              "name": "Open"
                          },
                          "properties": {
                              "body": "",
                              "content_type": "",
                              "form_href": "",
                              "href": "/api/v2/nodes/12600207",
                              "method": "GET",
                              "name": "Properties"
                          }
                      },
                      "map": {
                          "default_action": "open",
                          "more": [
                              "properties"
                          ]
                      },
                      "order": [
                          "open",
                          "download",
                          "FollowUp"
                      ]
                  },
                  "data": {
                      "properties": {
                          "id": 12600207,
                          "name": "thtyhyjuj.jpg",
                          "type": 144,
                          "type_name": "Document"
                      },
                      "properties_user": {
                          "access_date_last": "2018-03-12T10:23:48Z"
                      },
                      "versions": {
                          "mime_type": "image/jpeg"
                      }
                  }
              }
          ]
      }
      })),
          mocks.push(mockjax({
            url: '//server/otcs/cs/api/v1/nodes/facets',
            responseTime: 5,
            type: 'GET',
            responseText: {}
          })),
          mocks.push(mockjax({
            url: '//server/otcs/cs/api/v1/nodes/addablenodetypes',
            responseTime: 5,
            type: 'GET',
            responseText: {}
          })),
          mocks.push(mockjax({
            url: '//server/otcs/cs/api/v2/members/favorites/tabs?fields=properties&sort=order',
            responseTime: 5,
            type: 'GET',
            responseText: {
              "links": {
                "data": {
                  "self": {
                    "body": "",
                    "content_type": "",
                    "href": "\/api\/v2\/members\/favorites?actions=open&actions=download&expand=properties{original_id}&fields=favorites{name,tab_id}&fields=properties{container,id,name,original_id,type,type_name}&fields=versions{mime_type}.element(0)&sort=order",
                    "method": "GET",
                    "name": ""
                  }
                }
              }
              ,
              "results": [{
                "actions": {
                  "data": {
                    "open": {
                      "body": "",
                      "content_type": "",
                      "form_href": "",
                      "href": "\/api\/v2\/nodes\/13142466\/nodes",
                      "method": "GET",
                      "name": "Open"
                    }
                  }, "map": {"default_action": "open"}, "order": ["open"]
                },
                "data": {
                  "favorites": {"name": "Empty Folder", "tab_id": 14216},
                  "properties": {
                    "container": true,
                    "id": 13142466,
                    "name": "Empty Folder",
                    "type": 0,
                    "type_name": "Folder"
                  }
                }
              }, {
                "actions": {
                  "data": {
                    "open": {
                      "body": "",
                      "content_type": "",
                      "form_href": "",
                      "href": "\/api\/v2\/nodes\/1723335\/nodes",
                      "method": "GET",
                      "name": "Open"
                    }
                  }, "map": {"default_action": "open"}, "order": ["open"]
                },
                "data": {
                  "favorites": {"name": "Olaf\u0027s Folder", "tab_id": 14217},
                  "properties": {
                    "container": true,
                    "id": 1723335,
                    "name": "Olaf\u0027s Folder",
                    "type": 0,
                    "type_name": "Folder"
                  }
                }
              }, {
                "actions": {
                  "data": {
                    "open": {
                      "body": "",
                      "content_type": "",
                      "form_href": "",
                      "href": "\/api\/v2\/nodes\/12231414\/nodes",
                      "method": "GET",
                      "name": "Open"
                    }
                  }, "map": {"default_action": "open"}, "order": ["open"]
                },
                "data": {
                  "favorites": {"name": "ECM Project Charters", "tab_id": 14217},
                  "properties": {
                    "container": true,
                    "id": 12231414,
                    "name": "ECM Project Charters",
                    "type": 0,
                    "type_name": "Folder"
                  }
                }
              }]
            }

          })),
          mocks.push(mockjax({
            url: '//server/otcs/cs/api/v2/members/favorites?fields=properties%7Bcontainer%2Cid%2Cname%2Coriginal_id%2Ctype%2Ctype_name%7D&fields=favorites%7Bname%2Ctab_id%7D&fields=versions%7Bmime_type%7D.element(0)&expand=properties%7Boriginal_id%7D&actions=default&actions=open&actions=download&sort=order',
            responseTime: 5,
            type: 'GET',
            responseText: {}
          })),
          mocks.push(mockjax({
            url: '//server/otcs/cs/api/v2/members/assignments?fields=assignments%7Bdate_due%2Cdescription%2Cid%2Cname%2Ctype%2Ctype_name%2Clocation_id%2Cfollowup_id%2Cworkflow_id%2Cworkflow_open_in_smart_ui%2Cworkflow_subworkflow_id%2Cworkflow_subworkflow_task_id%7D',
            responseTime: 5,
            type: 'GET',
            responseText: {
              "links": {
                "data": {
                  "self": {
                    "body": "",
                    "content_type": "",
                    "href": "\/api\/v2\/members\/assignments?fields=assignments{date_due,description,id,name,type,type_name,location_id,followup_id,workflow_id,workflow_open_in_smart_ui,workflow_subworkflow_id,workflow_subworkflow_task_id}",
                    "method": "GET",
                    "name": ""
                  }
                }
              },
              "results": [{
                "data": {
                  "assignments": {
                    "date_due": "2018-02-21T00:00:00",
                    "description": "",
                    "followup_id": 21,
                    "id": null,
                    "location_id": 7886377,
                    "name": "Test  Followup Type",
                    "type": 31214,
                    "type_name": "Reminder",
                    "workflow_id": null,
                    "workflow_open_in_smart_ui": false,
                    "workflow_subworkflow_id": null,
                    "workflow_subworkflow_task_id": null
                  }
                }
              }, {
                "data": {
                  "assignments": {
                    "date_due": "2018-02-24T00:00:00",
                    "description": "",
                    "followup_id": 25,
                    "id": null,
                    "location_id": 7509277,
                    "name": "Test  Followup Type",
                    "type": 31214,
                    "type_name": "Reminder",
                    "workflow_id": null,
                    "workflow_open_in_smart_ui": false,
                    "workflow_subworkflow_id": null,
                    "workflow_subworkflow_task_id": null
                  }
                }
              }, {
                "data": {
                  "assignments": {
                    "date_due": "2018-03-09T00:00:00",
                    "description": "",
                    "followup_id": 38,
                    "id": null,
                    "location_id": 12774648,
                    "name": "Test  Followup Type",
                    "type": 31214,
                    "type_name": "Reminder",
                    "workflow_id": null,
                    "workflow_open_in_smart_ui": false,
                    "workflow_subworkflow_id": null,
                    "workflow_subworkflow_task_id": null
                  }
                }
              }, {
                "data": {
                  "assignments": {
                    "date_due": "2018-04-11T00:00:00",
                    "description": "",
                    "followup_id": 41,
                    "id": null,
                    "location_id": 604999,
                    "name": "Test  Followup Type",
                    "type": 31214,
                    "type_name": "Reminder",
                    "workflow_id": null,
                    "workflow_open_in_smart_ui": false,
                    "workflow_subworkflow_id": null,
                    "workflow_subworkflow_task_id": null
                  }
                }
              }, {
                "data": {
                  "assignments": {
                    "date_due": null,
                    "description": "",
                    "followup_id": null,
                    "id": 67342,
                    "location_id": 67341,
                    "name": "Drag and Drop with Req Category (67232)",
                    "type": 398,
                    "type_name": "Personal Staging Folder",
                    "workflow_id": null,
                    "workflow_open_in_smart_ui": false,
                    "workflow_subworkflow_id": null,
                    "workflow_subworkflow_task_id": null
                  }
                }
              }]
            }
          })),
          mocks.push(mockjax({
            url: '//server/otcs/cs/api/v2/nodes/2000?expand=properties%7Boriginal_id%7D&fields=properties%7Bcontainer%2Cid%2Cname%2Coriginal_id%2Ctype%7D&fields=versions%7Bmime_type%7D.element(0)&actions=default&actions=open&actions=download',
            responseTime: 5,
            type: 'GET',
            responseText: {
              "links": {
                "data": {
                  "self": {
                    "body": "",
                    "content_type": "",
                    "href": "\/api\/v2\/nodes\/2000?actions=open&actions=download&expand=properties{original_id}&fields=properties{container,id,name,original_id,type}&fields=versions{mime_type}.element(0)",
                    "method": "GET",
                    "name": ""
                  }
                }
              },
              "results": {
                "actions": {
                  "data": {
                    "open": {
                      "body": "",
                      "content_type": "",
                      "form_href": "",
                      "href": "\/api\/v2\/nodes\/2000\/nodes",
                      "method": "GET",
                      "name": "Open"
                    }
                  }, "map": {"default_action": "open"}, "order": ["open"]
                },
                "data": {
                  "properties": {
                    "container": true,
                    "id": 2000,
                    "name": "Enterprise Workspace",
                    "type": 141
                  }
                }
              }
            }
          })),
          mocks.push(mockjax({
            url: '//server/otcs/cs/api/v1/searchbar?enterprise_slices=true',
            responseTime: 5,
            type: 'GET',
            responseText: {
              "data": {
                "fields": "actions",
                "options": "{\u0027featured\u0027,\u0027highlight_summaries\u0027}",
                "slice": 17567287,
                "where": ""
              },
              "options": {
                "fields": {
                  "fields": "hidden",
                  "options": "hidden",
                  "slice": {
                    "label": "Search in:",
                    "optionLabels": ["Enterprise", "Enterprise [All Versions]", "Only documents"],
                    "type": "select"
                  }
                },
                "form": {
                  "attributes": {"action": "api\/v2\/search", "method": "post"},
                  "buttons": {"submit": {"title": "Search", "value": "Search"}}
                },
                "renderForm": true
              },
              "schema": {
                "properties": {
                  "fields": {"type": "string"},
                  "options": {"type": "string"},
                  "slice": {"enum": [17567287, 17567290, 5133299], "required": true},
                  "where": {"title": "Search for:", "type": "string"}
                }
              }
            }
          })),
          mocks.push(mockjax({
            url: '//server/otcs/cs/api/v1/perspectives/398548',
            responseTime: 0,
            type: 'GET',
            responseText: {
              "perspectives": [
                  {
                      "av_id": 398548,
                      "cascading": true,
                      "constant_data": [],
                      "container_type": null,
                      "node": 0,
                      "node_path": "",
                      "override_id": 2926,
                      "override_type": "landingpage",
                      "perspective": "{\"options\":{\"widgets\":[{\"kind\":\"header\",\"options\":{\"message\":\"Hello Admin, you have a new accessible welcome video now.\",\"videoPoster\":\"\",\"videoSrc\":\"https:\\/\\/jira.opentext.com\\/secure\\/attachment\\/1369448\\/CS-IntroVideo_1e-revTL-v2.mp4\"},\"type\":\"csui\\/widgets\\/welcome.placeholder\"},{\"kind\":\"tile\",\"options\":{},\"type\":\"csui\\/widgets\\/myassignments\"},{\"kind\":\"tile\",\"options\":{},\"type\":\"csui\\/widgets\\/favorites\"},{\"kind\":\"tile\",\"options\":{},\"type\":\"csui\\/widgets\\/recentlyaccessed\"},{\"kind\":\"tile\",\"options\":{\"shortcutItems\":[{\"id\":2000,\"id_path\":\"Enterprise Workspace\",\"type\":\"141\"}],\"shortcutTheme\":\"csui-shortcut-theme-stone1\"},\"type\":\"csui\\/widgets\\/shortcuts\"},{\"kind\":\"tile\",\"options\":{\"shortcutItems\":[{\"id\":604999},{\"id\":408261},{\"id\":67449},{\"id\":77317}],\"shortcutTheme\":\"csui-shortcut-theme-teal1\"},\"type\":\"csui\\/widgets\\/shortcuts\"}]},\"type\":\"flow\"}",
                      "perspective_node_path": "Perspectives:Admin",
                      "priority": 2,
                      "rule_compatibility": 1,
                      "rule_data": [],
                      "rule_string": "",
                      "scope": "global",
                      "title": "Admin"
                  }
              ]
          }
          })),
          mocks.push(mockjax({
            url: '//server/otcs/cs/api/v1/perspectives/398548',
            responseTime: 0,
            type: 'PUT',
            responseText: {
          }
          })),
          mocks.push(mockjax({
            url: '//server/otcs/cs/api/v1/searchqueries/391383',
            responseTime: 5,
            type: 'GET',
            responseText: {
              "data": {
                  "BrowseLivelink": {
                      "BrowseLivelink_value1_ID": null
                  },
                  "Category": {
                      "Category_142987": {
                          "Category_142987_3_value1": "anydate",
                          "Category_142987_3_value2": "",
                          "Category_142987_3_value3": "",
                          "Category_142987__value1": ""
                      }
                  },
                  "FullText": {
                      "FullText_value1": "Demo"
                  },
                  "NlqComponent": {
                      "NlqComponent_value1": ""
                  },
                  "SystemAttributes": {
                      "SystemAttributes_value1": "",
                      "SystemAttributes_value2_ID": null,
                      "SystemAttributes_value3": "anydate",
                      "SystemAttributes_value4": "",
                      "SystemAttributes_value5": "",
                      "SystemAttributes_value6": ""
                  },
                  "templateId": 391383
              },
              "options": {
                  "fields": {
                      "BrowseLivelink": {
                          "fields": {
                              "BrowseLivelink_value1_ID": {
                                  "label": "Location",
                                  "name": "BrowseLivelink_value1_ID",
                                  "order": 1,
                                  "type": "otcs_node_picker",
                                  "type_control": {
                                      "action": "api/v1/volumes",
                                      "method": "GET",
                                      "name": "",
                                      "parameters": {
                                          "filter_types": [
                                              -2
                                          ],
                                          "select_types": []
                                      }
                                  }
                              }
                          },
                          "order": 650
                      },
                      "Category": {
                          "fields": {
                              "Category_142987": {
                                  "fields": {
                                      "Category_142987_3_value1": {
                                          "label": "DateField1",
                                          "name": "Category_142987_3_value1",
                                          "optionLabels": [
                                              "",
                                              "Any Date",
                                              "Past Day",
                                              "Past Week",
                                              "Past 2 Weeks",
                                              "Past Month",
                                              "Past 3 Months",
                                              "Past 6 Months",
                                              "Past Year",
                                              "Specific Date",
                                              "Date Range"
                                          ],
                                          "order": 3,
                                          "OTRegionName": "Attr_142987_4",
                                          "removeDefaultNone": true
                                      },
                                      "Category_142987_3_value1_DFor": {
                                          "dateFormat": "yyyy-mm-dd",
                                          "dependencies": {
                                              "Category_142987_3_value1": "specific"
                                          },
                                          "label": "For",
                                          "name": "Category_142987_3_value1_DFor"
                                      },
                                      "Category_142987_3_value1_DFrom": {
                                          "dateFormat": "yyyy-mm-dd",
                                          "dependencies": {
                                              "Category_142987_3_value1": "range"
                                          },
                                          "label": "From",
                                          "name": "Category_142987_3_value1_DFrom"
                                      },
                                      "Category_142987_3_value1_DTo": {
                                          "dateFormat": "yyyy-mm-dd",
                                          "dependencies": {
                                              "Category_142987_3_value1": "range"
                                          },
                                          "label": "To",
                                          "name": "Category_142987_3_value1_DTo"
                                      },
                                      "Category_142987_3_value2": {
                                          "label": "IntegerField1",
                                          "name": "Category_142987_3_value2",
                                          "order": 4,
                                          "OTRegionName": "Attr_142987_5"
                                      },
                                      "Category_142987_3_value3": {
                                          "label": "TextPopup",
                                          "name": "Category_142987_3_value3",
                                          "optionLabels": [
                                              "<None>",
                                              "Red",
                                              "Green",
                                              "Blue"
                                          ],
                                          "order": 5,
                                          "OTRegionName": "Attr_142987_6",
                                          "type": "select"
                                      },
                                      "Category_142987__value1": {
                                          "label": "TextField",
                                          "name": "Category_142987__value1",
                                          "order": 2,
                                          "OTRegionName": "Attr_142987_2"
                                      }
                                  },
                                  "order": 6
                              }
                          },
                          "order": 500
                      },
                      "FullText": {
                          "fields": {
                              "FullText_value1": {
                                  "label": "Search Terms",
                                  "name": "FullText_value1",
                                  "order": 7,
                                  "type": "text"
                              }
                          },
                          "order": 100
                      },
                      "NlqComponent": {
                          "fields": {
                              "NlqComponent_value1": {
                                  "label": "Enter a question or text",
                                  "name": "NlqComponent_value1",
                                  "type": "text"
                              }
                          },
                          "order": 150
                      },
                      "SystemAttributes": {
                          "fields": {
                              "SystemAttributes_value1": {
                                  "label": "Content Type",
                                  "name": "SystemAttributes_value1",
                                  "optionLabels": [
                                      "",
                                      "Any Type",
                                      "No Type Defined",
                                      "Document",
                                      "Folder",
                                      "Tasks",
                                      "Discussions",
                                      "Project",
                                      "Workflow Map",
                                      "Workflow",
                                      "Business Workspace",
                                      "Binder"
                                  ],
                                  "order": 8,
                                  "OTRegionName": "OTSubType",
                                  "type": "select"
                              },
                              "SystemAttributes_value2_ID": {
                                  "label": "Created By",
                                  "name": "SystemAttributes_value2_ID",
                                  "order": 9,
                                  "OTRegionName": "OTCreatedByName",
                                  "type": "otcs_user_picker",
                                  "type_control": {
                                      "action": "api/v1/members",
                                      "method": "GET",
                                      "name": "",
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
                              "SystemAttributes_value3": {
                                  "label": "Date",
                                  "name": "SystemAttributes_value3",
                                  "optionLabels": [
                                      "",
                                      "Any Date",
                                      "Past Day",
                                      "Past Week",
                                      "Past 2 Weeks",
                                      "Past Month",
                                      "Past 3 Months",
                                      "Past 6 Months",
                                      "Past Year",
                                      "Specific Date",
                                      "Date Range"
                                  ],
                                  "order": 10,
                                  "OTRegionName": "OTObjectDate",
                                  "removeDefaultNone": true
                              },
                              "SystemAttributes_value3_DFor": {
                                  "dateFormat": "yyyy-mm-dd",
                                  "dependencies": {
                                      "SystemAttributes_value3": "specific"
                                  },
                                  "label": "For",
                                  "name": "SystemAttributes_value3_DFor"
                              },
                              "SystemAttributes_value3_DFrom": {
                                  "dateFormat": "yyyy-mm-dd",
                                  "dependencies": {
                                      "SystemAttributes_value3": "range"
                                  },
                                  "label": "From",
                                  "name": "SystemAttributes_value3_DFrom"
                              },
                              "SystemAttributes_value3_DTo": {
                                  "dateFormat": "yyyy-mm-dd",
                                  "dependencies": {
                                      "SystemAttributes_value3": "range"
                                  },
                                  "label": "To",
                                  "name": "SystemAttributes_value3_DTo"
                              },
                              "SystemAttributes_value4": {
                                  "label": "Name",
                                  "name": "SystemAttributes_value4",
                                  "order": 11,
                                  "OTRegionName": "OTName"
                              },
                              "SystemAttributes_value5": {
                                  "label": "Description",
                                  "name": "SystemAttributes_value5",
                                  "order": 12,
                                  "OTRegionName": "OTDComment"
                              },
                              "SystemAttributes_value6": {
                                  "label": "Size",
                                  "name": "SystemAttributes_value6",
                                  "order": 13,
                                  "OTRegionName": "OTObjectSize"
                              }
                          },
                          "order": 300
                      },
                      "templateId": {
                          "type": "hidden"
                      }
                  }
              },
              "schema": {
                  "properties": {
                      "BrowseLivelink": {
                          "properties": {
                              "BrowseLivelink_value1_ID": {
                                  "type": "integer"
                              }
                          },
                          "title": "Location"
                      },
                      "Category": {
                          "properties": {
                              "Category_142987": {
                                  "OTCatVerNum": 1,
                                  "properties": {
                                      "Category_142987_3_value1": {
                                          "enum": [
                                              "anydate",
                                              "definedDate",
                                              "pastDay",
                                              "pastWeek",
                                              "past2Weeks",
                                              "pastMonth",
                                              "past3Months",
                                              "past6Months",
                                              "pastYear",
                                              "specific",
                                              "range"
                                          ]
                                      },
                                      "Category_142987_3_value1_DFor": {
                                          "dependencies": "Category_142987_3_value1",
                                          "format": "date"
                                      },
                                      "Category_142987_3_value1_DFrom": {
                                          "dependencies": "Category_142987_3_value1",
                                          "format": "date"
                                      },
                                      "Category_142987_3_value1_DTo": {
                                          "dependencies": "Category_142987_3_value1",
                                          "format": "date"
                                      },
                                      "Category_142987_3_value2": {},
                                      "Category_142987_3_value3": {
                                          "enum": [
                                              "",
                                              "Red",
                                              "Green",
                                              "Blue"
                                          ]
                                      },
                                      "Category_142987__value1": {}
                                  },
                                  "title": "Cat with set"
                              }
                          },
                          "title": "Categories..."
                      },
                      "FullText": {
                          "properties": {
                              "FullText_value1": {}
                          },
                          "title": "Full Text"
                      },
                      "NlqComponent": {
                          "properties": {
                              "NlqComponent_value1": {}
                          },
                          "title": "Natural Language Query"
                      },
                      "SystemAttributes": {
                          "properties": {
                              "SystemAttributes_value1": {
                                  "enum": [
                                      "",
                                      "__all__",
                                      "__none__",
                                      "144",
                                      "0",
                                      "206|212|204|205",
                                      "130|134|215",
                                      "202",
                                      "128",
                                      "189",
                                      "848",
                                      "31066"
                                  ]
                              },
                              "SystemAttributes_value2_ID": {},
                              "SystemAttributes_value3": {
                                  "enum": [
                                      "anydate",
                                      "definedDate",
                                      "pastDay",
                                      "pastWeek",
                                      "past2Weeks",
                                      "pastMonth",
                                      "past3Months",
                                      "past6Months",
                                      "pastYear",
                                      "specific",
                                      "range"
                                  ]
                              },
                              "SystemAttributes_value3_DFor": {
                                  "dependencies": "SystemAttributes_value3",
                                  "format": "date"
                              },
                              "SystemAttributes_value3_DFrom": {
                                  "dependencies": "SystemAttributes_value3",
                                  "format": "date"
                              },
                              "SystemAttributes_value3_DTo": {
                                  "dependencies": "SystemAttributes_value3",
                                  "format": "date"
                              },
                              "SystemAttributes_value4": {},
                              "SystemAttributes_value5": {},
                              "SystemAttributes_value6": {}
                          },
                          "title": "System Attributes"
                      },
                      "templateId": {}
                  },
                  "title": "Demo_Saved_query",
                  "type": "object"
              }
          }
          
          })),
          mocks.push(mockjax({
            url: '//server/otcs/cs/api/v2/nodes/391383?actions=default&actions=open&actions=download&fields=properties',
            responseTime: 5,
            type: 'GET',
            responseText: {
              "links": {
                  "data": {
                      "self": {
                          "body": "",
                          "content_type": "",
                          "href": "/api/v2/nodes/391383?actions=open&actions=download&fields=properties",
                          "method": "GET",
                          "name": ""
                      }
                  }
              },
              "results": {
                  "actions": {
                      "data": {},
                      "map": {
                          "default_action": ""
                      },
                      "order": []
                  },
                  "data": {
                      "properties": {
                          "container": false,
                          "container_size": 0,
                          "create_date": "2015-12-28T09:12:33Z",
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
                          "favorite": false,
                          "id": 391383,
                          "mime_type": null,
                          "modify_date": "2018-09-06T05:38:58Z",
                          "modify_user_id": 1000,
                          "name": "Demo_Saved_query",
                          "name_multilingual": {
                              "de_DE": "",
                              "en": "Demo_Saved_query",
                              "ja": ""
                          },
                          "owner": "Admin",
                          "owner_group_id": 1001,
                          "owner_user_id": 1000,
                          "parent_id": 386124,
                          "permissions_model": "advanced",
                          "reserved": false,
                          "reserved_date": null,
                          "reserved_shared_collaboration": false,
                          "reserved_user_id": 0,
                          "size": 2316,
                          "size_formatted": "1 Source",
                          "type": 258,
                          "type_name": "Search Query",
                          "versions_control_advanced": false,
                          "volume_id": -2000,
                          "wnd_comments": null
                      }
                  }
              }
            }
          
          })),
          mocks.push(mockjax({
            url: '//server/otcs/cs/api/v1/nodes/391383/ancestors',
            responseTime: 5,
            type: 'GET',
            responseText: {
              "ancestors": [
                  {
                      "name": "Enterprise Workspace",
                      "volume_id": -2000,
                      "parent_id": -1,
                      "type": 141,
                      "id": 2000,
                      "type_name": "Enterprise Workspace"
                  },
                  {
                      "name": "Hyd - Container AFW",
                      "volume_id": -2000,
                      "parent_id": 2000,
                      "type": 0,
                      "id": 386124,
                      "type_name": "Folder"
                  },
                  {
                      "name": "Demo_Saved_query",
                      "volume_id": -2000,
                      "parent_id": 386124,
                      "type": 258,
                      "id": 391383,
                      "type_name": "Unknown"
                  }
              ]
            }
          }))

          
    },
    disable: function () {
      var mock;
      while ((mock = mocks.pop()) != null) {
        mockjax.clear(mock);
      }
    }
  }
});
