/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery', 'csui/lib/jquery.mockjax'], function ($, mockjax) {

  var mocks           = [],
      foundResults    = {
        "collection": {
          "paging": {
            "limit": 10,
            "links": {
              "next": {
                "body": "",
                "content_type": "",
                "href": "/api/v2/search?actions=addcategory&actions=addversion&actions=open&actions=copy&actions=delete&actions=download&actions=edit&actions=rename&actions=move&actions=properties&actions=reserve&actions=unreserve&expand=properties{original_id,owner_user_id,create_user_id,owner_id,reserved_user_id}&limit=10&options=highlight_summaries&options=facets&page=2&query_id=43996&cache_id=1853314691",
                "method": "GET",
                "name": "Next"
              }
            },
            "page": 1,
            "page_total": 12,
            "range_max": 10,
            "range_min": 1,
            "result_header_string": "Results 1 to 10 of 117 sorted by Relevance",
            "total_count": 117
          },
          "searching": {
            "cache_id": 1853314691,
            "facets": {
              "available": [
                {
                  "count": 9,
                  "count_exceeded": false,
                  "display_name": "Creation Date",
                  "facet_items": [
                    {
                      "count": 1,
                      "display_name": "Last 2 weeks",
                      "value": "ly2w"
                    },
                    {
                      "count": 117,
                      "display_name": "Last 2 months",
                      "value": "lx2m"
                    },
                    {
                      "count": 117,
                      "display_name": "Last 6 months",
                      "value": "lw6m"
                    },
                    {
                      "count": 117,
                      "display_name": "Last 12 months",
                      "value": "lv1y"
                    },
                    {
                      "count": 117,
                      "display_name": "Last 3 years",
                      "value": "lu3y"
                    },
                    {
                      "count": 117,
                      "display_name": "Last 5 years",
                      "value": "lt5y"
                    }
                  ],
                  "name": "OTCreateDate",
                  "type": "Date"
                },
                {
                  "count": 29,
                  "count_exceeded": false,
                  "display_name": "Content Type",
                  "facet_items": [
                    {
                      "count": 45,
                      "display_name": "LiveReport",
                      "value": "299"
                    },
                    {
                      "count": 20,
                      "display_name": "Category",
                      "value": "131"
                    },
                    {
                      "count": 14,
                      "display_name": "Document",
                      "value": "144"
                    },
                    {
                      "count": 10,
                      "display_name": "Category Folder",
                      "value": "132"
                    },
                    {
                      "count": 3,
                      "display_name": "Folder",
                      "value": "0"
                    },
                    {
                      "count": 2,
                      "display_name": "Workflow Map",
                      "value": "128"
                    },
                    {
                      "count": 2,
                      "display_name": "ActiveView",
                      "value": "30309"
                    },
                    {
                      "count": 1,
                      "display_name": "Blog Volume",
                      "value": "123461"
                    },
                    {
                      "count": 1,
                      "display_name": "Pulse",
                      "value": "1282"
                    },
                    {
                      "count": 1,
                      "display_name": "Active Editing Sessions",
                      "value": "1298"
                    },
                    {
                      "count": 1,
                      "display_name": "Failed Editing Sessions",
                      "value": "1299"
                    },
                    {
                      "count": 1,
                      "display_name": "Categories Volume",
                      "value": "133"
                    },
                    {
                      "count": 1,
                      "display_name": "Search Query",
                      "value": "258"
                    },
                    {
                      "count": 1,
                      "display_name": "Personal Frontpage Volume",
                      "value": "3030003"
                    },
                    {
                      "count": 1,
                      "display_name": "Community XSL Volume",
                      "value": "3030205"
                    },
                    {
                      "count": 1,
                      "display_name": "XML DTD Volume",
                      "value": "336"
                    },
                    {
                      "count": 1,
                      "display_name": "Directory Tree",
                      "value": "373"
                    },
                    {
                      "count": 1,
                      "display_name": "Content Move Volume",
                      "value": "795"
                    },
                    {
                      "count": 1,
                      "display_name": "Content Move Job Folder",
                      "value": "796"
                    },
                    {
                      "count": 1,
                      "display_name": "Perspectives Volume",
                      "value": "908"
                    }
                  ],
                  "name": "OTSubType",
                  "type": "Text"
                },
                {
                  "count": 13,
                  "count_exceeded": false,
                  "display_name": "Size",
                  "facet_items": [
                    {
                      "count": 72,
                      "display_name": "< 100 M",
                      "value": "all_t100m"
                    },
                    {
                      "count": 72,
                      "display_name": "< 10 M",
                      "value": "all_u10m"
                    },
                    {
                      "count": 72,
                      "display_name": "< 1 M",
                      "value": "all_v1m"
                    },
                    {
                      "count": 68,
                      "display_name": "< 100 K",
                      "value": "all_w100k"
                    },
                    {
                      "count": 58,
                      "display_name": "< 10 K",
                      "value": "all_x10k"
                    },
                    {
                      "count": 47,
                      "display_name": "< 1 K",
                      "value": "all_y1k"
                    },
                    {
                      "count": 39,
                      "display_name": "< 100",
                      "value": "all_z100b"
                    }
                  ],
                  "name": "OTObjectSize",
                  "type": "FileSize"
                },
                {
                  "count": 9,
                  "count_exceeded": false,
                  "display_name": "File Type",
                  "facet_items": [
                    {
                      "count": 45,
                      "display_name": "Software Report",
                      "value": "Software Report"
                    },
                    {
                      "count": 25,
                      "display_name": "UNKNOWN",
                      "value": "UNKNOWN"
                    },
                    {
                      "count": 20,
                      "display_name": "Classification",
                      "value": "Classification"
                    },
                    {
                      "count": 12,
                      "display_name": "Adobe PDF",
                      "value": "Adobe PDF"
                    },
                    {
                      "count": 9,
                      "display_name": "Folder",
                      "value": "Folder"
                    },
                    {
                      "count": 2,
                      "display_name": "ActiveView",
                      "value": "ActiveView"
                    },
                    {
                      "count": 2,
                      "display_name": "Microsoft Word",
                      "value": "Microsoft Word"
                    },
                    {
                      "count": 2,
                      "display_name": "Workflow",
                      "value": "Workflow"
                    }
                  ],
                  "name": "OTFileType",
                  "type": "Text"
                },
                {
                  "count": 23,
                  "count_exceeded": false,
                  "display_name": "Container",
                  "facet_items": [
                    {
                      "count": 45,
                      "display_name": "Content Server Reports",
                      "value": "2003"
                    },
                    {
                      "count": 14,
                      "display_name": "Enterprise : Documents",
                      "value": "3880"
                    },
                    {
                      "count": 6,
                      "display_name": "TKL : Set",
                      "value": "4215"
                    },
                    {
                      "count": 5,
                      "display_name": "Enterprise",
                      "value": "2000"
                    },
                    {
                      "count": 5,
                      "display_name": "Content Server Categories : TKL",
                      "value": "3878"
                    },
                    {
                      "count": 3,
                      "display_name": "Content Server Categories",
                      "value": "2006"
                    },
                    {
                      "count": 3,
                      "display_name": "Content Server Categories : Userfield",
                      "value": "6105"
                    },
                    {
                      "count": 2,
                      "display_name": "O365 Office Online Volume",
                      "value": "2455"
                    },
                    {
                      "count": 2,
                      "display_name": "Enterprise : TKL Issues With Form Fields",
                      "value": "2462"
                    },
                    {
                      "count": 2,
                      "display_name": "TKL : Standalone",
                      "value": "3879"
                    },
                    {
                      "count": 2,
                      "display_name": "TKL : Required",
                      "value": "5068"
                    },
                    {
                      "count": 2,
                      "display_name": "Enterprise : Custom Search View789",
                      "value": "5203"
                    },
                    {
                      "count": 2,
                      "display_name": "TKL : Performance Check",
                      "value": "5786"
                    },
                    {
                      "count": 1,
                      "display_name": "Admin Home",
                      "value": "2004"
                    },
                    {
                      "count": 1,
                      "display_name": "Community Directory",
                      "value": "2064"
                    },
                    {
                      "count": 1,
                      "display_name": "Content Move Volume",
                      "value": "2872"
                    },
                    {
                      "count": 1,
                      "display_name": "Perspectives",
                      "value": "3116"
                    },
                    {
                      "count": 1,
                      "display_name": "Content Server Categories : Text",
                      "value": "5064"
                    },
                    {
                      "count": 1,
                      "display_name": "Text : Required",
                      "value": "5065"
                    }
                  ],
                  "name": "OTParentID",
                  "type": "Text"
                }
              ]
            },
            "result_title": "Search Result"
          },
          "sorting": {
            "links": {
              "asc_OTObjectDate": {
                "body": "",
                "content_type": "",
                "href": "/api/v2/search?actions=addcategory&actions=addversion&actions=open&actions=copy&actions=delete&actions=download&actions=edit&actions=rename&actions=move&actions=properties&actions=reserve&actions=unreserve&expand=properties{original_id,owner_user_id,create_user_id,owner_id,reserved_user_id}&limit=10&options=highlight_summaries&options=facets&page=1&query_id=43996&cache_id=1853314691&sort=asc_OTObjectDate",
                "method": "GET",
                "name": "Date (Ascending)"
              },
              "asc_OTObjectSize": {
                "body": "",
                "content_type": "",
                "href": "/api/v2/search?actions=addcategory&actions=addversion&actions=open&actions=copy&actions=delete&actions=download&actions=edit&actions=rename&actions=move&actions=properties&actions=reserve&actions=unreserve&expand=properties{original_id,owner_user_id,create_user_id,owner_id,reserved_user_id}&limit=10&options=highlight_summaries&options=facets&page=1&query_id=43996&cache_id=1853314691&sort=asc_OTObjectSize",
                "method": "GET",
                "name": "Size (Ascending)"
              },
              "desc_OTObjectDate": {
                "body": "",
                "content_type": "",
                "href": "/api/v2/search?actions=addcategory&actions=addversion&actions=open&actions=copy&actions=delete&actions=download&actions=edit&actions=rename&actions=move&actions=properties&actions=reserve&actions=unreserve&expand=properties{original_id,owner_user_id,create_user_id,owner_id,reserved_user_id}&limit=10&options=highlight_summaries&options=facets&page=1&query_id=43996&cache_id=1853314691&sort=desc_OTObjectDate",
                "method": "GET",
                "name": "Date (Descending)"
              },
              "desc_OTObjectSize": {
                "body": "",
                "content_type": "",
                "href": "/api/v2/search?actions=addcategory&actions=addversion&actions=open&actions=copy&actions=delete&actions=download&actions=edit&actions=rename&actions=move&actions=properties&actions=reserve&actions=unreserve&expand=properties{original_id,owner_user_id,create_user_id,owner_id,reserved_user_id}&limit=10&options=highlight_summaries&options=facets&page=1&query_id=43996&cache_id=1853314691&sort=desc_OTObjectSize",
                "method": "GET",
                "name": "Size (Descending)"
              },
              "relevance": {
                "body": "",
                "content_type": "",
                "href": "/api/v2/search?actions=addcategory&actions=addversion&actions=open&actions=copy&actions=delete&actions=download&actions=edit&actions=rename&actions=move&actions=properties&actions=reserve&actions=unreserve&expand=properties{original_id,owner_user_id,create_user_id,owner_id,reserved_user_id}&limit=10&options=highlight_summaries&options=facets&page=1&query_id=43996&cache_id=1853314691",
                "method": "GET",
                "name": "Relevance"
              }
            }
          }
        },
        "links": {
          "data": {
            "self": {
              "body": "",
              "content_type": "",
              "href": "/api/v2/search?actions=addcategory&actions=addversion&actions=open&actions=copy&actions=delete&actions=download&actions=edit&actions=rename&actions=move&actions=properties&actions=reserve&actions=unreserve&expand=properties{original_id,owner_user_id,create_user_id,owner_id,reserved_user_id}&limit=10&options=highlight_summaries&options=facets&page=1&query_id=43996&cache_id=1853314691",
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
                  "href": "/api/v2/nodes/2462/categories",
                  "method": "POST",
                  "name": "Add Category"
                },
                "copy": {
                  "body": "",
                  "content_type": "",
                  "form_href": "/api/v2/forms/nodes/copy?id=2462",
                  "href": "/api/v2/nodes",
                  "method": "POST",
                  "name": "Copy"
                },
                "delete": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "/api/v2/nodes/2462",
                  "method": "DELETE",
                  "name": "Delete"
                },
                "move": {
                  "body": "",
                  "content_type": "",
                  "form_href": "/api/v2/forms/nodes/move?id=2462",
                  "href": "/api/v2/nodes/2462",
                  "method": "PUT",
                  "name": "Move"
                },
                "open": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "/api/v2/nodes/2462/nodes",
                  "method": "GET",
                  "name": "Open"
                },
                "properties": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "/api/v2/nodes/2462",
                  "method": "GET",
                  "name": "Properties"
                },
                "rename": {
                  "body": "",
                  "content_type": "",
                  "form_href": "/api/v2/forms/nodes/rename?id=2462",
                  "href": "/api/v2/nodes/2462",
                  "method": "PUT",
                  "name": "Rename"
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
                "addcategory",
                "rename",
                "copy",
                "move",
                "delete"
              ]
            },
            "data": {
              "properties": {
                "container": true,
                "container_size": 4,
                "create_date": "2017-08-07T14:46:27",
                "create_user_id": 1000,
                "create_user_id_expand": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "first_name": null,
                  "gender": null,
                  "group_id": 1001,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "last_name": null,
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": null,
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_url": null,
                  "time_zone": null,
                  "title": null,
                  "type": 0,
                  "type_name": "User"
                },
                "description": "",
                "description_multilingual": {
                  "en": "",
                  "en_IN": ""
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": false,
                "id": 2462,
                "mime_type": null,
                "modify_date": "2017-09-05T09:11:46",
                "modify_user_id": 1000,
                "name": "TKL Issues With Form Fields",
                "name_multilingual": {
                  "en": "TKL Issues With Form Fields",
                  "en_IN": "TKL Issues With Form Fields"
                },
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "owner_user_id_expand": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "first_name": null,
                  "gender": null,
                  "group_id": 1001,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "last_name": null,
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": null,
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_url": null,
                  "time_zone": null,
                  "title": null,
                  "type": 0,
                  "type_name": "User"
                },
                "parent_id": 2000,
                "reserved": false,
                "reserved_date": null,
                "reserved_user_id": 0,
                "short_summary": [
                  ""
                ],
                "size": 4,
                "size_formatted": "4 Items",
                "summary": [
                  ""
                ],
                "type": 0,
                "type_name": "Folder",
                "versions_control_advanced": false,
                "volume_id": -2000
              }
            },
            "links": {
              "ancestors": [
                {
                  "href": "api/v1/nodes/2000",
                  "name": "Enterprise"
                }
              ],
              "ancestors_nodes": [
                {
                  "href": "api/v1/nodes/2000/nodes",
                  "name": "Enterprise"
                }
              ],
              "parent": {
                "href": "api/v1/nodes/2000",
                "name": "Enterprise"
              },
              "parent_nodes": {
                "href": "api/v1/nodes/2000/nodes",
                "name": "Enterprise"
              }
            },
            "search_result_metadata": {
              "current_version": null,
              "object_href": null,
              "object_id": "DataId=2462&Version=0",
              "result_type": "264",
              "source_id": "3139",
              "version_type": null
            }
          },
          {
            "actions": {
              "data": {
                "addcategory": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "/api/v2/nodes/5203/categories",
                  "method": "POST",
                  "name": "Add Category"
                },
                "copy": {
                  "body": "",
                  "content_type": "",
                  "form_href": "/api/v2/forms/nodes/copy?id=5203",
                  "href": "/api/v2/nodes",
                  "method": "POST",
                  "name": "Copy"
                },
                "delete": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "/api/v2/nodes/5203",
                  "method": "DELETE",
                  "name": "Delete"
                },
                "move": {
                  "body": "",
                  "content_type": "",
                  "form_href": "/api/v2/forms/nodes/move?id=5203",
                  "href": "/api/v2/nodes/5203",
                  "method": "PUT",
                  "name": "Move"
                },
                "open": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "/api/v2/nodes/5203/nodes",
                  "method": "GET",
                  "name": "Open"
                },
                "properties": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "/api/v2/nodes/5203",
                  "method": "GET",
                  "name": "Properties"
                },
                "rename": {
                  "body": "",
                  "content_type": "",
                  "form_href": "/api/v2/forms/nodes/rename?id=5203",
                  "href": "/api/v2/nodes/5203",
                  "method": "PUT",
                  "name": "Rename"
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
                "addcategory",
                "rename",
                "copy",
                "move",
                "delete"
              ]
            },
            "data": {
              "properties": {
                "container": true,
                "container_size": 2,
                "create_date": "2017-08-11T10:20:10",
                "create_user_id": 1000,
                "create_user_id_expand": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "first_name": null,
                  "gender": null,
                  "group_id": 1001,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "last_name": null,
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": null,
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_url": null,
                  "time_zone": null,
                  "title": null,
                  "type": 0,
                  "type_name": "User"
                },
                "description": "",
                "description_multilingual": {
                  "en_IN": ""
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": false,
                "id": 5203,
                "mime_type": null,
                "modify_date": "2017-09-06T10:23:51",
                "modify_user_id": 1000,
                "name": "Custom Search View789",
                "name_multilingual": {
                  "en_IN": "Custom Search View789"
                },
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "owner_user_id_expand": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "first_name": null,
                  "gender": null,
                  "group_id": 1001,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "last_name": null,
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": null,
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_url": null,
                  "time_zone": null,
                  "title": null,
                  "type": 0,
                  "type_name": "User"
                },
                "parent_id": 2000,
                "reserved": false,
                "reserved_date": null,
                "reserved_user_id": 0,
                "short_summary": [
                  ""
                ],
                "size": 2,
                "size_formatted": "2 Items",
                "summary": [
                  ""
                ],
                "type": 0,
                "type_name": "Folder",
                "versions_control_advanced": false,
                "volume_id": -2000
              }
            },
            "links": {
              "ancestors": [
                {
                  "href": "api/v1/nodes/2000",
                  "name": "Enterprise"
                }
              ],
              "ancestors_nodes": [
                {
                  "href": "api/v1/nodes/2000/nodes",
                  "name": "Enterprise"
                }
              ],
              "parent": {
                "href": "api/v1/nodes/2000",
                "name": "Enterprise"
              },
              "parent_nodes": {
                "href": "api/v1/nodes/2000/nodes",
                "name": "Enterprise"
              }
            },
            "search_result_metadata": {
              "current_version": null,
              "object_href": null,
              "object_id": "DataId=5203&Version=0",
              "result_type": "264",
              "source_id": "3139",
              "version_type": null
            }
          },
          {
            "actions": {
              "data": {
                "addcategory": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "/api/v2/nodes/3880/categories",
                  "method": "POST",
                  "name": "Add Category"
                },
                "copy": {
                  "body": "",
                  "content_type": "",
                  "form_href": "/api/v2/forms/nodes/copy?id=3880",
                  "href": "/api/v2/nodes",
                  "method": "POST",
                  "name": "Copy"
                },
                "delete": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "/api/v2/nodes/3880",
                  "method": "DELETE",
                  "name": "Delete"
                },
                "move": {
                  "body": "",
                  "content_type": "",
                  "form_href": "/api/v2/forms/nodes/move?id=3880",
                  "href": "/api/v2/nodes/3880",
                  "method": "PUT",
                  "name": "Move"
                },
                "open": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "/api/v2/nodes/3880/nodes",
                  "method": "GET",
                  "name": "Open"
                },
                "properties": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "/api/v2/nodes/3880",
                  "method": "GET",
                  "name": "Properties"
                },
                "rename": {
                  "body": "",
                  "content_type": "",
                  "form_href": "/api/v2/forms/nodes/rename?id=3880",
                  "href": "/api/v2/nodes/3880",
                  "method": "PUT",
                  "name": "Rename"
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
                "addcategory",
                "rename",
                "copy",
                "move",
                "delete"
              ]
            },
            "data": {
              "properties": {
                "container": true,
                "container_size": 4,
                "create_date": "2017-08-10T11:17:47",
                "create_user_id": 1000,
                "create_user_id_expand": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "first_name": null,
                  "gender": null,
                  "group_id": 1001,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "last_name": null,
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": null,
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_url": null,
                  "time_zone": null,
                  "title": null,
                  "type": 0,
                  "type_name": "User"
                },
                "description": "",
                "description_multilingual": {
                  "en_IN": ""
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": false,
                "id": 3880,
                "mime_type": null,
                "modify_date": "2017-08-24T16:15:29",
                "modify_user_id": 1000,
                "name": "Documents",
                "name_multilingual": {
                  "en_IN": "Documents"
                },
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "owner_user_id_expand": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "first_name": null,
                  "gender": null,
                  "group_id": 1001,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "last_name": null,
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": null,
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_url": null,
                  "time_zone": null,
                  "title": null,
                  "type": 0,
                  "type_name": "User"
                },
                "parent_id": 2000,
                "reserved": false,
                "reserved_date": null,
                "reserved_user_id": 0,
                "short_summary": [
                  ""
                ],
                "size": 4,
                "size_formatted": "4 Items",
                "summary": [
                  ""
                ],
                "type": 0,
                "type_name": "Folder",
                "versions_control_advanced": false,
                "volume_id": -2000
              }
            },
            "links": {
              "ancestors": [
                {
                  "href": "api/v1/nodes/2000",
                  "name": "Enterprise"
                }
              ],
              "ancestors_nodes": [
                {
                  "href": "api/v1/nodes/2000/nodes",
                  "name": "Enterprise"
                }
              ],
              "parent": {
                "href": "api/v1/nodes/2000",
                "name": "Enterprise"
              },
              "parent_nodes": {
                "href": "api/v1/nodes/2000/nodes",
                "name": "Enterprise"
              }
            },
            "search_result_metadata": {
              "current_version": null,
              "object_href": null,
              "object_id": "DataId=3880&Version=0",
              "result_type": "264",
              "source_id": "3139",
              "version_type": null
            }
          },
          {
            "actions": {
              "data": {
                "addcategory": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "/api/v2/nodes/3878/categories",
                  "method": "POST",
                  "name": "Add Category"
                },
                "open": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "/api/v2/nodes/3878/nodes",
                  "method": "GET",
                  "name": "Open"
                },
                "properties": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "/api/v2/nodes/3878",
                  "method": "GET",
                  "name": "Properties"
                }
              },
              "map": {
                "default_action": "",
                "more": [
                  "properties"
                ]
              },
              "order": [
                "open",
                "addcategory"
              ]
            },
            "data": {
              "properties": {
                "container": true,
                "container_size": 5,
                "create_date": "2017-08-09T12:50:55",
                "create_user_id": 1000,
                "create_user_id_expand": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "first_name": null,
                  "gender": null,
                  "group_id": 1001,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "last_name": null,
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": null,
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_url": null,
                  "time_zone": null,
                  "title": null,
                  "type": 0,
                  "type_name": "User"
                },
                "description": "",
                "description_multilingual": {
                  "en_IN": ""
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": false,
                "id": 3878,
                "mime_type": null,
                "modify_date": "2017-08-18T12:12:56",
                "modify_user_id": 1000,
                "name": "TKL",
                "name_multilingual": {
                  "en_IN": "TKL"
                },
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "owner_user_id_expand": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "first_name": null,
                  "gender": null,
                  "group_id": 1001,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "last_name": null,
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": null,
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_url": null,
                  "time_zone": null,
                  "title": null,
                  "type": 0,
                  "type_name": "User"
                },
                "parent_id": 2006,
                "reserved": false,
                "reserved_date": null,
                "reserved_user_id": 0,
                "short_summary": [
                  ""
                ],
                "size": 5,
                "size_formatted": "5 Items",
                "summary": [
                  ""
                ],
                "type": 132,
                "type_name": "Category Folder",
                "versions_control_advanced": false,
                "volume_id": -2006
              }
            },
            "links": {
              "ancestors": [
                {
                  "href": "api/v1/nodes/2006",
                  "name": "Content Server Categories"
                }
              ],
              "ancestors_nodes": [
                {
                  "href": "api/v1/nodes/2006/nodes",
                  "name": "Content Server Categories"
                }
              ],
              "parent": {
                "href": "api/v1/nodes/2006",
                "name": "Content Server Categories"
              },
              "parent_nodes": {
                "href": "api/v1/nodes/2006/nodes",
                "name": "Content Server Categories"
              }
            },
            "search_result_metadata": {
              "current_version": null,
              "object_href": null,
              "object_id": "DataId=3878&Version=0",
              "result_type": "264",
              "source_id": "3139",
              "version_type": null
            }
          },
          {
            "actions": {
              "data": {
                "addcategory": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "/api/v2/nodes/6105/categories",
                  "method": "POST",
                  "name": "Add Category"
                },
                "open": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "/api/v2/nodes/6105/nodes",
                  "method": "GET",
                  "name": "Open"
                },
                "properties": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "/api/v2/nodes/6105",
                  "method": "GET",
                  "name": "Properties"
                }
              },
              "map": {
                "default_action": "",
                "more": [
                  "properties"
                ]
              },
              "order": [
                "open",
                "addcategory"
              ]
            },
            "data": {
              "properties": {
                "container": true,
                "container_size": 2,
                "create_date": "2017-08-14T10:55:37",
                "create_user_id": 1000,
                "create_user_id_expand": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "first_name": null,
                  "gender": null,
                  "group_id": 1001,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "last_name": null,
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": null,
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_url": null,
                  "time_zone": null,
                  "title": null,
                  "type": 0,
                  "type_name": "User"
                },
                "description": "",
                "description_multilingual": {
                  "en_IN": ""
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": false,
                "id": 6105,
                "mime_type": null,
                "modify_date": "2017-08-14T15:14:28",
                "modify_user_id": 1000,
                "name": "Userfield",
                "name_multilingual": {
                  "en_IN": "Userfield"
                },
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "owner_user_id_expand": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "first_name": null,
                  "gender": null,
                  "group_id": 1001,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "last_name": null,
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": null,
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_url": null,
                  "time_zone": null,
                  "title": null,
                  "type": 0,
                  "type_name": "User"
                },
                "parent_id": 2006,
                "reserved": false,
                "reserved_date": null,
                "reserved_user_id": 0,
                "short_summary": [
                  ""
                ],
                "size": 2,
                "size_formatted": "2 Items",
                "summary": [
                  ""
                ],
                "type": 132,
                "type_name": "Category Folder",
                "versions_control_advanced": false,
                "volume_id": -2006
              }
            },
            "links": {
              "ancestors": [
                {
                  "href": "api/v1/nodes/2006",
                  "name": "Content Server Categories"
                }
              ],
              "ancestors_nodes": [
                {
                  "href": "api/v1/nodes/2006/nodes",
                  "name": "Content Server Categories"
                }
              ],
              "parent": {
                "href": "api/v1/nodes/2006",
                "name": "Content Server Categories"
              },
              "parent_nodes": {
                "href": "api/v1/nodes/2006/nodes",
                "name": "Content Server Categories"
              }
            },
            "search_result_metadata": {
              "current_version": null,
              "object_href": null,
              "object_id": "DataId=6105&Version=0",
              "result_type": "264",
              "source_id": "3139",
              "version_type": null
            }
          },
          {
            "actions": {
              "data": {
                "addcategory": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "/api/v2/nodes/5064/categories",
                  "method": "POST",
                  "name": "Add Category"
                },
                "open": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "/api/v2/nodes/5064/nodes",
                  "method": "GET",
                  "name": "Open"
                },
                "properties": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "/api/v2/nodes/5064",
                  "method": "GET",
                  "name": "Properties"
                }
              },
              "map": {
                "default_action": "",
                "more": [
                  "properties"
                ]
              },
              "order": [
                "open",
                "addcategory"
              ]
            },
            "data": {
              "properties": {
                "container": true,
                "container_size": 3,
                "create_date": "2017-08-11T10:12:41",
                "create_user_id": 1000,
                "create_user_id_expand": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "first_name": null,
                  "gender": null,
                  "group_id": 1001,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "last_name": null,
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": null,
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_url": null,
                  "time_zone": null,
                  "title": null,
                  "type": 0,
                  "type_name": "User"
                },
                "description": "",
                "description_multilingual": {
                  "en_IN": ""
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": false,
                "id": 5064,
                "mime_type": null,
                "modify_date": "2017-09-06T10:22:27",
                "modify_user_id": 1000,
                "name": "Text",
                "name_multilingual": {
                  "en_IN": "Text"
                },
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "owner_user_id_expand": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "first_name": null,
                  "gender": null,
                  "group_id": 1001,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "last_name": null,
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": null,
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_url": null,
                  "time_zone": null,
                  "title": null,
                  "type": 0,
                  "type_name": "User"
                },
                "parent_id": 2006,
                "reserved": false,
                "reserved_date": null,
                "reserved_user_id": 0,
                "short_summary": [
                  ""
                ],
                "size": 3,
                "size_formatted": "3 Items",
                "summary": [
                  ""
                ],
                "type": 132,
                "type_name": "Category Folder",
                "versions_control_advanced": false,
                "volume_id": -2006
              }
            },
            "links": {
              "ancestors": [
                {
                  "href": "api/v1/nodes/2006",
                  "name": "Content Server Categories"
                }
              ],
              "ancestors_nodes": [
                {
                  "href": "api/v1/nodes/2006/nodes",
                  "name": "Content Server Categories"
                }
              ],
              "parent": {
                "href": "api/v1/nodes/2006",
                "name": "Content Server Categories"
              },
              "parent_nodes": {
                "href": "api/v1/nodes/2006/nodes",
                "name": "Content Server Categories"
              }
            },
            "search_result_metadata": {
              "current_version": null,
              "object_href": null,
              "object_id": "DataId=5064&Version=0",
              "result_type": "264",
              "source_id": "3139",
              "version_type": null
            }
          },
          {
            "actions": {
              "data": {
                "addcategory": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "/api/v2/nodes/5065/categories",
                  "method": "POST",
                  "name": "Add Category"
                },
                "open": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "/api/v2/nodes/5065/nodes",
                  "method": "GET",
                  "name": "Open"
                },
                "properties": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "/api/v2/nodes/5065",
                  "method": "GET",
                  "name": "Properties"
                }
              },
              "map": {
                "default_action": "",
                "more": [
                  "properties"
                ]
              },
              "order": [
                "open",
                "addcategory"
              ]
            },
            "data": {
              "properties": {
                "container": true,
                "container_size": 1,
                "create_date": "2017-08-11T10:12:49",
                "create_user_id": 1000,
                "create_user_id_expand": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "first_name": null,
                  "gender": null,
                  "group_id": 1001,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "last_name": null,
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": null,
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_url": null,
                  "time_zone": null,
                  "title": null,
                  "type": 0,
                  "type_name": "User"
                },
                "description": "",
                "description_multilingual": {
                  "en_IN": ""
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": false,
                "id": 5065,
                "mime_type": null,
                "modify_date": "2017-08-11T10:12:58",
                "modify_user_id": 1000,
                "name": "Required",
                "name_multilingual": {
                  "en_IN": "Required"
                },
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "owner_user_id_expand": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "first_name": null,
                  "gender": null,
                  "group_id": 1001,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "last_name": null,
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": null,
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_url": null,
                  "time_zone": null,
                  "title": null,
                  "type": 0,
                  "type_name": "User"
                },
                "parent_id": 5064,
                "reserved": false,
                "reserved_date": null,
                "reserved_user_id": 0,
                "short_summary": [
                  ""
                ],
                "size": 1,
                "size_formatted": "1 Item",
                "summary": [
                  ""
                ],
                "type": 132,
                "type_name": "Category Folder",
                "versions_control_advanced": false,
                "volume_id": -2006
              }
            },
            "links": {
              "ancestors": [
                {
                  "href": "api/v1/nodes/2006",
                  "name": "Content Server Categories"
                },
                {
                  "href": "api/v1/nodes/5064",
                  "name": "Text"
                }
              ],
              "ancestors_nodes": [
                {
                  "href": "api/v1/nodes/2006/nodes",
                  "name": "Content Server Categories"
                },
                {
                  "href": "api/v1/nodes/5064/nodes",
                  "name": "Text"
                }
              ],
              "parent": {
                "href": "api/v1/nodes/5064",
                "name": "Text"
              },
              "parent_nodes": {
                "href": "api/v1/nodes/5064/nodes",
                "name": "Text"
              }
            },
            "search_result_metadata": {
              "current_version": null,
              "object_href": null,
              "object_id": "DataId=5065&Version=0",
              "result_type": "264",
              "source_id": "3139",
              "version_type": null
            }
          },
          {
            "actions": {
              "data": {
                "addcategory": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "/api/v2/nodes/4193/categories",
                  "method": "POST",
                  "name": "Add Category"
                },
                "delete": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "/api/v2/nodes/4193",
                  "method": "DELETE",
                  "name": "Delete"
                },
                "properties": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "/api/v2/nodes/4193",
                  "method": "GET",
                  "name": "Properties"
                },
                "rename": {
                  "body": "",
                  "content_type": "",
                  "form_href": "/api/v2/forms/nodes/rename?id=4193",
                  "href": "/api/v2/nodes/4193",
                  "method": "PUT",
                  "name": "Rename"
                }
              },
              "map": {
                "default_action": "",
                "more": [
                  "properties"
                ]
              },
              "order": [
                "addcategory",
                "rename",
                "delete"
              ]
            },
            "data": {
              "properties": {
                "container": false,
                "container_size": 0,
                "create_date": "2017-08-09T12:06:17",
                "create_user_id": 1000,
                "create_user_id_expand": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "first_name": null,
                  "gender": null,
                  "group_id": 1001,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "last_name": null,
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": null,
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_url": null,
                  "time_zone": null,
                  "title": null,
                  "type": 0,
                  "type_name": "User"
                },
                "description": "",
                "description_multilingual": {
                  "en_IN": ""
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": false,
                "id": 4193,
                "mime_type": null,
                "modify_date": "2017-08-11T12:36:26",
                "modify_user_id": 1000,
                "name": "TKL Issues With Form template attributes",
                "name_multilingual": {
                  "en_IN": "TKL Issues With Form template attributes"
                },
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "owner_user_id_expand": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "first_name": null,
                  "gender": null,
                  "group_id": 1001,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "last_name": null,
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": null,
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_url": null,
                  "time_zone": null,
                  "title": null,
                  "type": 0,
                  "type_name": "User"
                },
                "parent_id": 2462,
                "reserved": false,
                "reserved_date": null,
                "reserved_user_id": 0,
                "short_summary": [
                  ""
                ],
                "size": null,
                "size_formatted": "4 KB",
                "summary": [
                  ""
                ],
                "type": 128,
                "type_name": "Initiate Workflow",
                "versions_control_advanced": false,
                "volume_id": -2000
              }
            },
            "links": {
              "ancestors": [
                {
                  "href": "api/v1/nodes/2000",
                  "name": "Enterprise"
                },
                {
                  "href": "api/v1/nodes/2462",
                  "name": "TKL Issues With Form Fields"
                }
              ],
              "ancestors_nodes": [
                {
                  "href": "api/v1/nodes/2000/nodes",
                  "name": "Enterprise"
                },
                {
                  "href": "api/v1/nodes/2462/nodes",
                  "name": "TKL Issues With Form Fields"
                }
              ],
              "parent": {
                "href": "api/v1/nodes/2462",
                "name": "TKL Issues With Form Fields"
              },
              "parent_nodes": {
                "href": "api/v1/nodes/2462/nodes",
                "name": "TKL Issues With Form Fields"
              }
            },
            "search_result_metadata": {
              "current_version": true,
              "object_href": null,
              "object_id": "DataId=4193&Version=9",
              "result_type": "264",
              "source_id": "3139",
              "version_type": null
            }
          },
          {
            "actions": {
              "data": {
                "addcategory": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "/api/v2/nodes/5732/categories",
                  "method": "POST",
                  "name": "Add Category"
                },
                "delete": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "/api/v2/nodes/5732",
                  "method": "DELETE",
                  "name": "Delete"
                },
                "properties": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "/api/v2/nodes/5732",
                  "method": "GET",
                  "name": "Properties"
                },
                "rename": {
                  "body": "",
                  "content_type": "",
                  "form_href": "/api/v2/forms/nodes/rename?id=5732",
                  "href": "/api/v2/nodes/5732",
                  "method": "PUT",
                  "name": "Rename"
                }
              },
              "map": {
                "default_action": "",
                "more": [
                  "properties"
                ]
              },
              "order": [
                "addcategory",
                "rename",
                "delete"
              ]
            },
            "data": {
              "properties": {
                "container": false,
                "container_size": 7,
                "create_date": "2017-08-11T11:17:21",
                "create_user_id": 1000,
                "create_user_id_expand": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "first_name": null,
                  "gender": null,
                  "group_id": 1001,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "last_name": null,
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": null,
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_url": null,
                  "time_zone": null,
                  "title": null,
                  "type": 0,
                  "type_name": "User"
                },
                "description": "",
                "description_multilingual": {
                  "en_IN": ""
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": false,
                "id": 5732,
                "mime_type": null,
                "modify_date": "2017-08-11T15:40:21",
                "modify_user_id": 1000,
                "name": "WF- w/o template attributes",
                "name_multilingual": {
                  "en_IN": "WF- w/o template attributes"
                },
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "owner_user_id_expand": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "first_name": null,
                  "gender": null,
                  "group_id": 1001,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "last_name": null,
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": null,
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_url": null,
                  "time_zone": null,
                  "title": null,
                  "type": 0,
                  "type_name": "User"
                },
                "parent_id": 2462,
                "reserved": false,
                "reserved_date": null,
                "reserved_user_id": 0,
                "short_summary": [
                  ""
                ],
                "size": null,
                "size_formatted": "5 KB",
                "summary": [
                  ""
                ],
                "type": 128,
                "type_name": "Initiate Workflow",
                "versions_control_advanced": false,
                "volume_id": -2000
              }
            },
            "links": {
              "ancestors": [
                {
                  "href": "api/v1/nodes/2000",
                  "name": "Enterprise"
                },
                {
                  "href": "api/v1/nodes/2462",
                  "name": "TKL Issues With Form Fields"
                }
              ],
              "ancestors_nodes": [
                {
                  "href": "api/v1/nodes/2000/nodes",
                  "name": "Enterprise"
                },
                {
                  "href": "api/v1/nodes/2462/nodes",
                  "name": "TKL Issues With Form Fields"
                }
              ],
              "parent": {
                "href": "api/v1/nodes/2462",
                "name": "TKL Issues With Form Fields"
              },
              "parent_nodes": {
                "href": "api/v1/nodes/2462/nodes",
                "name": "TKL Issues With Form Fields"
              }
            },
            "search_result_metadata": {
              "current_version": true,
              "object_href": null,
              "object_id": "DataId=5732&Version=6",
              "result_type": "264",
              "source_id": "3139",
              "version_type": null
            }
          },
          {
            "actions": {
              "data": {
                "addcategory": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "/api/v2/nodes/5954/categories",
                  "method": "POST",
                  "name": "Add Category"
                },
                "delete": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "/api/v2/nodes/5954",
                  "method": "DELETE",
                  "name": "Delete"
                },
                "properties": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "/api/v2/nodes/5954",
                  "method": "GET",
                  "name": "Properties"
                },
                "rename": {
                  "body": "",
                  "content_type": "",
                  "form_href": "/api/v2/forms/nodes/rename?id=5954",
                  "href": "/api/v2/nodes/5954",
                  "method": "PUT",
                  "name": "Rename"
                }
              },
              "map": {
                "default_action": "",
                "more": [
                  "properties"
                ]
              },
              "order": [
                "addcategory",
                "rename",
                "delete"
              ]
            },
            "data": {
              "properties": {
                "container": false,
                "container_size": 0,
                "create_date": "2017-08-11T10:25:54",
                "create_user_id": 1000,
                "create_user_id_expand": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "first_name": null,
                  "gender": null,
                  "group_id": 1001,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "last_name": null,
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": null,
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_url": null,
                  "time_zone": null,
                  "title": null,
                  "type": 0,
                  "type_name": "User"
                },
                "description": "",
                "description_multilingual": {
                  "en_IN": ""
                },
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": false,
                "id": 5954,
                "mime_type": null,
                "modify_date": "2017-09-06T10:20:47",
                "modify_user_id": 1000,
                "name": "Custom Search View",
                "name_multilingual": {
                  "en_IN": "Custom Search View"
                },
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "owner_user_id_expand": {
                  "birth_date": null,
                  "business_email": null,
                  "business_fax": null,
                  "business_phone": null,
                  "cell_phone": null,
                  "first_name": null,
                  "gender": null,
                  "group_id": 1001,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 1000,
                  "last_name": null,
                  "middle_name": null,
                  "name": "Admin",
                  "name_formatted": "Admin",
                  "office_location": null,
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_url": null,
                  "time_zone": null,
                  "title": null,
                  "type": 0,
                  "type_name": "User"
                },
                "parent_id": 5203,
                "reserved": false,
                "reserved_date": null,
                "reserved_user_id": 0,
                "short_summary": [
                  ""
                ],
                "size": 5000,
                "size_formatted": "1 Source",
                "summary": [
                  ""
                ],
                "type": 258,
                "type_name": "Search Query",
                "versions_control_advanced": false,
                "volume_id": -2000
              }
            },
            "links": {
              "ancestors": [
                {
                  "href": "api/v1/nodes/2000",
                  "name": "Enterprise"
                },
                {
                  "href": "api/v1/nodes/5203",
                  "name": "Custom Search View789"
                }
              ],
              "ancestors_nodes": [
                {
                  "href": "api/v1/nodes/2000/nodes",
                  "name": "Enterprise"
                },
                {
                  "href": "api/v1/nodes/5203/nodes",
                  "name": "Custom Search View789"
                }
              ],
              "parent": {
                "href": "api/v1/nodes/5203",
                "name": "Custom Search View789"
              },
              "parent_nodes": {
                "href": "api/v1/nodes/5203/nodes",
                "name": "Custom Search View789"
              }
            },
            "search_result_metadata": {
              "current_version": null,
              "object_href": null,
              "object_id": "DataId=5954&Version=4",
              "result_type": "264",
              "source_id": "3139",
              "version_type": null
            }
          }
        ]
      },
      resultsNotFound = {
        "collection": {
          "paging": {
            "limit": 10,
            "page": 1,
            "page_total": 1,
            "range_max": 0,
            "range_min": 1,
            "result_header_string": "No results found",
            "total_count": 0
          },
          "searching": {
            "cache_id": 2019192119,
            "result_title": "Search Result"
          },
          "sorting": {
            "links": {
              "asc_OTObjectDate": {
                "body": "",
                "content_type": "",
                "href": "/api/v2/search?actions=addclassifications&actions=addcategory&actions=addversion&actions=open&actions=copy&actions=delete&actions=download&actions=edit&actions=rename&actions=move&actions=properties&actions=reserve&actions=unreserve&actions=comment&actions=setasdefaultpage&actions=unsetasdefaultpage&actions=initiateworkflow&actions=initiatedocumentworkflow&expand=properties{original_id,owner_user_id,create_user_id,owner_id,reserved_user_id}&limit=10&options=highlight_summaries&options=facets&page=1&query_id=43996&cache_id=2019192119&sort=asc_OTObjectDate",
                "method": "GET",
                "name": "Date (Ascending)"
              },
              "asc_OTObjectSize": {
                "body": "",
                "content_type": "",
                "href": "/api/v2/search?actions=addclassifications&actions=addcategory&actions=addversion&actions=open&actions=copy&actions=delete&actions=download&actions=edit&actions=rename&actions=move&actions=properties&actions=reserve&actions=unreserve&actions=comment&actions=setasdefaultpage&actions=unsetasdefaultpage&actions=initiateworkflow&actions=initiatedocumentworkflow&expand=properties{original_id,owner_user_id,create_user_id,owner_id,reserved_user_id}&limit=10&options=highlight_summaries&options=facets&page=1&query_id=43996&cache_id=2019192119&sort=asc_OTObjectSize",
                "method": "GET",
                "name": "Size (Ascending)"
              },
              "desc_OTObjectDate": {
                "body": "",
                "content_type": "",
                "href": "/api/v2/search?actions=addclassifications&actions=addcategory&actions=addversion&actions=open&actions=copy&actions=delete&actions=download&actions=edit&actions=rename&actions=move&actions=properties&actions=reserve&actions=unreserve&actions=comment&actions=setasdefaultpage&actions=unsetasdefaultpage&actions=initiateworkflow&actions=initiatedocumentworkflow&expand=properties{original_id,owner_user_id,create_user_id,owner_id,reserved_user_id}&limit=10&options=highlight_summaries&options=facets&page=1&query_id=43996&cache_id=2019192119&sort=desc_OTObjectDate",
                "method": "GET",
                "name": "Date (Descending)"
              },
              "desc_OTObjectSize": {
                "body": "",
                "content_type": "",
                "href": "/api/v2/search?actions=addclassifications&actions=addcategory&actions=addversion&actions=open&actions=copy&actions=delete&actions=download&actions=edit&actions=rename&actions=move&actions=properties&actions=reserve&actions=unreserve&actions=comment&actions=setasdefaultpage&actions=unsetasdefaultpage&actions=initiateworkflow&actions=initiatedocumentworkflow&expand=properties{original_id,owner_user_id,create_user_id,owner_id,reserved_user_id}&limit=10&options=highlight_summaries&options=facets&page=1&query_id=43996&cache_id=2019192119&sort=desc_OTObjectSize",
                "method": "GET",
                "name": "Size (Descending)"
              },
              "relevance": {
                "body": "",
                "content_type": "",
                "href": "/api/v2/search?actions=addclassifications&actions=addcategory&actions=addversion&actions=open&actions=copy&actions=delete&actions=download&actions=edit&actions=rename&actions=move&actions=properties&actions=reserve&actions=unreserve&actions=comment&actions=setasdefaultpage&actions=unsetasdefaultpage&actions=initiateworkflow&actions=initiatedocumentworkflow&expand=properties{original_id,owner_user_id,create_user_id,owner_id,reserved_user_id}&limit=10&options=highlight_summaries&options=facets&page=1&query_id=43996&cache_id=2019192119",
                "method": "GET",
                "name": "Relevance"
              }
            }
          }
        },
        "links": {
          "data": {
            "self": {
              "body": "",
              "content_type": "",
              "href": "/api/v2/search?actions=addclassifications&actions=addcategory&actions=addversion&actions=open&actions=copy&actions=delete&actions=download&actions=edit&actions=rename&actions=move&actions=properties&actions=reserve&actions=unreserve&actions=comment&actions=setasdefaultpage&actions=unsetasdefaultpage&actions=initiateworkflow&actions=initiatedocumentworkflow&expand=properties{original_id,owner_user_id,create_user_id,owner_id,reserved_user_id}&limit=10&options=highlight_summaries&options=facets&page=1&query_id=43996&cache_id=2019192119",
              "method": "GET",
              "name": ""
            }
          }
        },
        "results": []
      };

  return {

    enable: function () {
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/9999/customviewsearchforms',
        responseTime: 0,
        responseText: {
          "data": [
            {
              "id": 8888,
              "priority": null
            }
          ],
          "definitions": {
            "id": {
              "persona": "node",
              "type": 2
            },
            "priority": {
              "type": 2
            }
          }
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/searchqueries/8888',
        responseTime: 0,
        responseText: {
          "data": {
            "BrowseLivelink": {
              "BrowseLivelink_value1_ID": null
            },
            "Category": {
              "Category_4302": {
                "Category_4302__value1": "anydate",
                "Category_4302__value2": "",
                "Category_4302__value4": "",
                "Category_4302__value5": "",
                "Category_4302__value6": "",
                "Category_4302__value7": "",
                "Category_4302__value8": "",
                "Category_4302__value9_ID": null
              }
            },
            "Collections": {
              "collections_search_selected": [
                2474
              ]
            },
            "FullText": {
              "FullText_value1": "jpg"
            },
            "SystemAttributes": {
              "SystemAttributes_value1": "",
              "SystemAttributes_value2_ID": null
            },
            "templateId": 4082
          },
          "options": {
            "fields": {
              "BrowseLivelink": {
                "fields": {
                  "BrowseLivelink_value1_ID": {
                    "label": "Location:",
                    "name": "BrowseLivelink_value1_ID",
                    "type": "otcs_node_picker",
                    "type_control": {
                      "action": "api/v1/volumes",
                      "method": "GET",
                      "name": "",
                      "parameters": {
                        "filter_types": [],
                        "select_types": [
                          0,
                          130,
                          132,
                          133,
                          134,
                          136,
                          138,
                          139,
                          141,
                          142,
                          148,
                          149,
                          154,
                          180,
                          201,
                          202,
                          205,
                          206,
                          208,
                          210,
                          211,
                          212,
                          233,
                          236,
                          268,
                          269,
                          270,
                          275,
                          276,
                          290,
                          327,
                          336,
                          370,
                          398,
                          403,
                          480,
                          481,
                          482,
                          483,
                          484,
                          525,
                          526,
                          527,
                          528,
                          529,
                          530,
                          532,
                          541,
                          542,
                          557,
                          731,
                          732,
                          751,
                          753,
                          795,
                          796,
                          870,
                          899,
                          900,
                          901,
                          905,
                          919,
                          921,
                          950,
                          951,
                          1259,
                          1260,
                          1261,
                          1262,
                          1264,
                          1265,
                          1266,
                          1267,
                          1280,
                          1281,
                          2504,
                          32657,
                          298,
                          215,
                          143,
                          203,
                          150
                        ]
                      }
                    }
                  }
                }
              },
              "Category": {
                "fields": {
                  "Category_4302": {
                    "fields": {
                      "Category_4302__value1": {
                        "label": "mydate:",
                        "name": "Category_4302__value1",
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
                        ]
                      },
                      "Category_4302__value1_DFor": {
                        "dateFormat": "yy-mm-dd",
                        "dependencies": {
                          "Category_4302__value1": "specific"
                        },
                        "label": "For:",
                        "name": "Category_4302__value1_DFor"
                      },
                      "Category_4302__value1_DFrom": {
                        "dateFormat": "yy-mm-dd",
                        "dependencies": {
                          "Category_4302__value1": "range"
                        },
                        "label": "From:",
                        "name": "Category_4302__value1_DFrom"
                      },
                      "Category_4302__value1_DTo": {
                        "dateFormat": "yy-mm-dd",
                        "dependencies": {
                          "Category_4302__value1": "range"
                        },
                        "label": "To:",
                        "name": "Category_4302__value1_DTo"
                      },
                      "Category_4302__value2": {
                        "label": "datepopup:",
                        "name": "Category_4302__value2",
                        "optionLabels": [
                          "<None>",
                          "2015-11-10T00:00:00",
                          "2015-11-26T00:00:00"
                        ]
                      },
                      "Category_4302__value4": {
                        "label": "myInteger:",
                        "name": "Category_4302__value4"
                      },
                      "Category_4302__value5": {
                        "label": "IntegerPopup:",
                        "name": "Category_4302__value5",
                        "optionLabels": [
                          "<None>",
                          2,
                          1,
                          3,
                          4
                        ]
                      },
                      "Category_4302__value6": {
                        "label": "MyTxt:",
                        "name": "Category_4302__value6"
                      },
                      "Category_4302__value7": {
                        "label": "MYTextarea:",
                        "name": "Category_4302__value7"
                      },
                      "Category_4302__value8": {
                        "label": "txtpopup:",
                        "name": "Category_4302__value8",
                        "optionLabels": [
                          "<None>",
                          "jpg",
                          "test",
                          "abc"
                        ]
                      },
                      "Category_4302__value9_ID": {
                        "label": "myuserpick:",
                        "name": "Category_4302__value9_ID",
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
                      }
                    }
                  }
                }
              },
              "Collections": {
                "fields": {
                  "collections_search_selected": {
                    "dataSource": {
                      "2474": "Enterprise",
                      "2477": "Enterprise [All Versions]"
                    },
                    "label": "Slices:",
                    "multiple": true,
                    "name": "collections_search_selected",
                    "size": 6,
                    "type": "select"
                  }
                }
              },
              "FullText": {
                "fields": {
                  "FullText_value1": {
                    "label": "Search Terms:",
                    "name": "FullText_value1",
                    "type": "text"
                  }
                }
              },
              "SystemAttributes": {
                "fields": {
                  "SystemAttributes_value1": {
                    "label": "Content Type:",
                    "name": "SystemAttributes_value1",
                    "optionLabels": [
                      "",
                      "Any Type",
                      "No Type Defined",
                      "Documents",
                      "Folders",
                      "Tasks",
                      "Discussions",
                      "Projects",
                      "WorkFlow Map",
                      "WorkFlow Status"
                    ]
                  },
                  "SystemAttributes_value2_ID": {
                    "label": "Created By:",
                    "name": "SystemAttributes_value2_ID",
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
                  }
                }
              },
              "templateId": {
                "type": "hidden"
              }
            }
          },
          "schema": {
            "description": "",
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
                  "Category_4302": {
                    "properties": {
                      "Category_4302__value1": {
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
                        ],
                        "required": true
                      },
                      "Category_4302__value1_DFor": {
                        "dependencies": "Category_4302__value1",
                        "format": "date"
                      },
                      "Category_4302__value1_DFrom": {
                        "dependencies": "Category_4302__value1",
                        "format": "date"
                      },
                      "Category_4302__value1_DTo": {
                        "dependencies": "Category_4302__value1",
                        "format": "date"
                      },
                      "Category_4302__value2": {
                        "enum": [
                          "",
                          "D/2015/11/10:0:0:0",
                          "D/2015/11/26:0:0:0"
                        ]
                      },
                      "Category_4302__value4": {},
                      "Category_4302__value5": {
                        "enum": [
                          "",
                          "2",
                          "1",
                          "3",
                          "4"
                        ]
                      },
                      "Category_4302__value6": {},
                      "Category_4302__value7": {},
                      "Category_4302__value8": {
                        "enum": [
                          "",
                          "jpg",
                          "test",
                          "abc"
                        ]
                      },
                      "Category_4302__value9_ID": {}
                    },
                    "title": "my category"
                  }
                },
                "title": "Categories..."
              },
              "Collections": {
                "properties": {
                  "collections_search_selected": {
                    "required": true
                  }
                },
                "title": "Slices"
              },
              "FullText": {
                "properties": {
                  "FullText_value1": {}
                },
                "title": "Full Text"
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
                      "189"
                    ]
                  },
                  "SystemAttributes_value2_ID": {}
                },
                "title": "System Attributes"
              },
              "templateId": {}
            },
            "title": "Custom View Search",
            "type": "object"
          }
        }
      }));

      mocks.push(mockjax({
        url: "//server/otcs/cs/api/v1/searchqueries/43996",
        responseTime: 0,
        responseText: {
          "data": {
            "Category": {
              "Category_43994": {
                "Category_43994__value1": ""
              }
            },
            "FullText": {
              "FullText_value1": "*"
            },
            "templateId": 43996
          },
          "options": {
            "fields": {
              "Category": {
                "fields": {
                  "Category_43994": {
                    "fields": {
                      "Category_43994__value1": {
                        "label": "Just Text Field",
                        "name": "Category_43994__value1",
                        "order": 1,
                        "OTRegionName": "Attr_43994_2"
                      }
                    },
                    "order": 2
                  }
                },
                "order": 500
              },
              "FullText": {
                "fields": {
                  "FullText_value1": {
                    "label": "Search Terms",
                    "name": "FullText_value1",
                    "order": 3,
                    "type": "text"
                  }
                },
                "order": 100
              },
              "templateId": {
                "type": "hidden"
              }
            }
          },
          "schema": {
            "properties": {
              "Category": {
                "properties": {
                  "Category_43994": {
                    "OTCatVerNum": 1,
                    "properties": {
                      "Category_43994__value1": {}
                    },
                    "title": "Textfield"
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
              "templateId": {}
            },
            "title": "For test",
            "type": "object"
          }
        }
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/search(.*)'),
        response: function (headers) {
          var responseText, urlParam = headers.url.match(/Category_43994__value1=(\w*)/);
          if (urlParam === null) {
            responseText = {};
          } else {
            responseText = urlParam[1] === 'a' ? foundResults : resultsNotFound;
          }
          this.responseText = responseText;
        }
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/members/favorites(\\?.*)?'),
        responseText: {
          results: []
        }
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/actions\\?ids=(.*)?$'),
        responseTime: 10,
        responseText: {
          "results": {
            '1': {
              data: {
                'delete': {}
              },
              map: {},
              order: {}
            }
          }
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
