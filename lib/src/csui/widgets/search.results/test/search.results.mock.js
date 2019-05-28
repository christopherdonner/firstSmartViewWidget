/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['require', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/jquery.mockjax'
], function (require, _, $, mockjax) {

  var mocks = [],
      allMetadata = {
        "create_date": {
          "key": "create_date",
          "name": "Created",
          "read_only": true,
          "required": false,
          "type": -7
        },
        "create_user_id": {
          "key": "create_user_id",
          "name": "Created By",
          "read_only": false,
          "required": false,
          "type": 2
        },
        "description": {
          "key": "description",
          "name": "Description",
          "read_only": false,
          "required": false,
          "type": -1
        },
        "id": {
          "key": "id",
          "name": "ID",
          "read_only": false,
          "required": false,
          "type": 2
        },
        "modify_date": {
          "key": "modify_date",
          "name": "Modified",
          "read_only": true,
          "required": false,
          "type": -7
        },
        "modify_user_id": {
          "key": "modify_user_id",
          "name": "Modified By",
          "read_only": false,
          "required": false,
          "type": 2
        },
        "name": {
          "key": "name",
          "name": "Name",
          "read_only": false,
          "required": false,
          "type": -1
        },
        "owner_group_id": {
          "key": "owner_group_id",
          "name": "Owned By",
          "read_only": false,
          "required": false,
          "type": 2
        },
        "owner_user_id": {
          "key": "owner_user_id",
          "name": "Owned By",
          "read_only": false,
          "required": false,
          "type": 2
        },
        "parent_id": {
          "key": "parent_id",
          "name": "Parent ID",
          "read_only": false,
          "required": false,
          "type": 2
        },
        "reserved": {
          "key": "reserved",
          "name": "Reserved",
          "read_only": false,
          "required": false,
          "type": 5
        },
        "reserved_date": {
          "key": "reserved_date",
          "name": "Reserved",
          "read_only": false,
          "required": false,
          "type": -7
        },
        "reserved_user_id": {
          "key": "reserved_user_id",
          "name": "Reserved By",
          "read_only": false,
          "required": false,
          "type": 2
        },
        "type": {
          "key": "type",
          "name": "Type",
          "read_only": true,
          "required": false,
          "type": 2
        },
        "type_name": {
          "description": null,
          "key": "type_name",
          "name": "Type",
          "read_only": true,
          "required": false,
          "type": -1
        },
        "volume_id": {
          "description": null,
          "key": "volume_id",
          "read_only": false,
          "required": false,
          "type": 2
        }
      },
      allData =
        {
          "collection": {
            "paging": {
              "limit": 3,
              "links": {
                "next": {
                  "body": "",
                  "content_type": "",
                  "href": "/api/v2/search?actions=addcategory&actions=addversion&actions=default&actions=open&actions=browse&actions=copy&actions=delete&actions=download&actions=edit&actions=favorite&actions=nonfavorite&actions=rename&actions=move&actions=properties&actions=favorite_rename&actions=reserve&actions=unreserve&actions=comment&actions=setAsDefaultPage&actions=unSetAsDefaultPage&actions=initiateworkflow&expand=properties%7Boriginal_id%2Cowner_user_id%2Ccreate_user_id%2Cowner_id%2Creserved_user_id%7D&options=%7B%27highlight_summaries%27%2C%27facets%27%7D&location_id1=914014&where=*&limit=3&page=2&cache_id=953362122",
                  "method": "GET",
                  "name": "Next"
                }
              },
              "page": 1,
              "page_total": 9,
              "range_max": 3,
              "range_min": 1,
              "result_header_string": "Results 1 to 3 of 24 sorted by Relevance",
              "total_count": 24
            },
            "searching": {
              "cache_id": 953362122,
              "facets": {
                "available": [
                  {
                    "count": 48,
                    "count_exceeded": false,
                    "display_name": "Author",
                    "facet_items": [
                      {
                        "count": 24,
                        "display_name": "Admin",
                        "value": "Admin"
                      }
                    ],
                    "name": "Author",
                    "type": "Text"
                  },
                  {
                    "count": 10,
                    "count_exceeded": false,
                    "display_name": "Creation Date",
                    "facet_items": [
                      {
                        "count": 1,
                        "display_name": "2016 June",
                        "value": "m201606"
                      },
                      {
                        "count": 19,
                        "display_name": "2016 August",
                        "value": "m201608"
                      },
                      {
                        "count": 4,
                        "display_name": "2017 April",
                        "value": "m201704"
                      },
                      {
                        "count": 1,
                        "display_name": "09 Apr - 15 Apr",
                        "value": "w20170409"
                      },
                      {
                        "count": 3,
                        "display_name": "23 Apr - 29 Apr",
                        "value": "w20170423"
                      },
                      {
                        "count": 20,
                        "display_name": "2016",
                        "value": "y2016"
                      },
                      {
                        "count": 4,
                        "display_name": "2017",
                        "value": "y2017"
                      }
                    ],
                    "name": "OTCreateDate",
                    "type": "Date"
                  },
                  {
                    "count": 2,
                    "count_exceeded": false,
                    "display_name": "Category",
                    "facet_items": [
                      {
                        "count": 19,
                        "display_name": "000 Hyderabad : Single Required",
                        "value": "1149516"
                      },
                      {
                        "count": 2,
                        "display_name": "Categories Volume : cat with req attrs",
                        "value": "68013"
                      }
                    ],
                    "name": "OTDCategory",
                    "type": "Text"
                  },
                  {
                    "count": 49,
                    "count_exceeded": false,
                    "display_name": "File Type",
                    "facet_items": [
                      {
                        "count": 1,
                        "display_name": "Adobe PDF",
                        "value": "Adobe PDF"
                      },
                      {
                        "count": 1,
                        "display_name": "Audio",
                        "value": "Audio"
                      },
                      {
                        "count": 3,
                        "display_name": "Blog",
                        "value": "Blog"
                      },
                      {
                        "count": 3,
                        "display_name": "Compressed Archive",
                        "value": "Compressed Archive"
                      },
                      {
                        "count": 1,
                        "display_name": "Folder",
                        "value": "Folder"
                      },
                      {
                        "count": 1,
                        "display_name": "Language JavaScript",
                        "value": "Language JavaScript"
                      },
                      {
                        "count": 1,
                        "display_name": "Microsoft Excel",
                        "value": "Microsoft Excel"
                      },
                      {
                        "count": 1,
                        "display_name": "Microsoft PowerPoint",
                        "value": "Microsoft PowerPoint"
                      },
                      {
                        "count": 2,
                        "display_name": "Microsoft Word",
                        "value": "Microsoft Word"
                      },
                      {
                        "count": 3,
                        "display_name": "Photo",
                        "value": "Photo"
                      },
                      {
                        "count": 3,
                        "display_name": "Picture",
                        "value": "Picture"
                      },
                      {
                        "count": 1,
                        "display_name": "Software Report",
                        "value": "Software Report"
                      },
                      {
                        "count": 1,
                        "display_name": "Software Windows",
                        "value": "Software Windows"
                      },
                      {
                        "count": 5,
                        "display_name": "Text",
                        "value": "Text"
                      },
                      {
                        "count": 1,
                        "display_name": "Video ",
                        "value": "Video"
                      }
                    ],
                    "name": "OTFileType",
                    "type": "Text"
                  },
                  {
                    "count": 4,
                    "count_exceeded": false,
                    "display_name": "Container",
                    "facet_items": [
                      {
                        "count": 1,
                        "display_name": "Pulse",
                        "value": "132097"
                      },
                      {
                        "count": 2,
                        "display_name": "Pulse : Comments for - Audi-A8.jpg (3411566)",
                        "value": "3931957"
                      },
                      {
                        "count": 1,
                        "display_name": "007 Hyderabad : 00 Navya Test folder",
                        "value": "913574"
                      },
                      {
                        "count": 20,
                        "display_name": "00 Navya Test folder : All-fileTypes",
                        "value": "914014"
                      }
                    ],
                    "name": "OTParentID",
                    "type": "Text"
                  },
                  {
                    "count": 78,
                    "count_exceeded": false,
                    "display_name": "Content Type",
                    "facet_items": [
                      {
                        "count": 1,
                        "display_name": "Folder",
                        "value": "0"
                      },
                      {
                        "count": 3,
                        "display_name": "MicroPost",
                        "value": "1281"
                      },
                      {
                        "count": 20,
                        "display_name": "Document",
                        "value": "144"
                      }
                    ],
                    "name": "OTSubType",
                    "type": "Text"
                  }
                ]
              },
              "result_title": "Search Results in 'All-fileTypes' for: *"
            },
            "sorting": {
              "links": {
                "asc_OTObjectDate": {
                  "body": "",
                  "content_type": "",
                  "href": "/api/v2/search?actions=addcategory&actions=addversion&actions=default&actions=open&actions=browse&actions=copy&actions=delete&actions=download&actions=edit&actions=favorite&actions=nonfavorite&actions=rename&actions=move&actions=properties&actions=favorite_rename&actions=reserve&actions=unreserve&actions=comment&actions=setAsDefaultPage&actions=unSetAsDefaultPage&actions=initiateworkflow&expand=properties%7Boriginal_id%2Cowner_user_id%2Ccreate_user_id%2Cowner_id%2Creserved_user_id%7D&options=%7B%27highlight_summaries%27%2C%27facets%27%7D&location_id1=914014&where=*&limit=3&page=1&cache_id=953362122&sort=asc_OTObjectDate",
                  "method": "GET",
                  "name": "Date (Ascending)"
                },
                "asc_OTObjectSize": {
                  "body": "",
                  "content_type": "",
                  "href": "/api/v2/search?actions=addcategory&actions=addversion&actions=default&actions=open&actions=browse&actions=copy&actions=delete&actions=download&actions=edit&actions=favorite&actions=nonfavorite&actions=rename&actions=move&actions=properties&actions=favorite_rename&actions=reserve&actions=unreserve&actions=comment&actions=setAsDefaultPage&actions=unSetAsDefaultPage&actions=initiateworkflow&expand=properties%7Boriginal_id%2Cowner_user_id%2Ccreate_user_id%2Cowner_id%2Creserved_user_id%7D&options=%7B%27highlight_summaries%27%2C%27facets%27%7D&location_id1=914014&where=*&limit=3&page=1&cache_id=953362122&sort=asc_OTObjectSize",
                  "method": "GET",
                  "name": "Size (Ascending)"
                },
                "desc_OTObjectDate": {
                  "body": "",
                  "content_type": "",
                  "href": "/api/v2/search?actions=addcategory&actions=addversion&actions=default&actions=open&actions=browse&actions=copy&actions=delete&actions=download&actions=edit&actions=favorite&actions=nonfavorite&actions=rename&actions=move&actions=properties&actions=favorite_rename&actions=reserve&actions=unreserve&actions=comment&actions=setAsDefaultPage&actions=unSetAsDefaultPage&actions=initiateworkflow&expand=properties%7Boriginal_id%2Cowner_user_id%2Ccreate_user_id%2Cowner_id%2Creserved_user_id%7D&options=%7B%27highlight_summaries%27%2C%27facets%27%7D&location_id1=914014&where=*&limit=3&page=1&cache_id=953362122&sort=desc_OTObjectDate",
                  "method": "GET",
                  "name": "Date (Descending)"
                },
                "desc_OTObjectSize": {
                  "body": "",
                  "content_type": "",
                  "href": "/api/v2/search?actions=addcategory&actions=addversion&actions=default&actions=open&actions=browse&actions=copy&actions=delete&actions=download&actions=edit&actions=favorite&actions=nonfavorite&actions=rename&actions=move&actions=properties&actions=favorite_rename&actions=reserve&actions=unreserve&actions=comment&actions=setAsDefaultPage&actions=unSetAsDefaultPage&actions=initiateworkflow&expand=properties%7Boriginal_id%2Cowner_user_id%2Ccreate_user_id%2Cowner_id%2Creserved_user_id%7D&options=%7B%27highlight_summaries%27%2C%27facets%27%7D&location_id1=914014&where=*&limit=3&page=1&cache_id=953362122&sort=desc_OTObjectSize",
                  "method": "GET",
                  "name": "Size (Descending)"
                },
                "relevance": {
                  "body": "",
                  "content_type": "",
                  "href": "/api/v2/search?actions=addcategory&actions=addversion&actions=default&actions=open&actions=browse&actions=copy&actions=delete&actions=download&actions=edit&actions=favorite&actions=nonfavorite&actions=rename&actions=move&actions=properties&actions=favorite_rename&actions=reserve&actions=unreserve&actions=comment&actions=setAsDefaultPage&actions=unSetAsDefaultPage&actions=initiateworkflow&expand=properties%7Boriginal_id%2Cowner_user_id%2Ccreate_user_id%2Cowner_id%2Creserved_user_id%7D&options=%7B%27highlight_summaries%27%2C%27facets%27%7D&location_id1=914014&where=*&limit=3&page=1&cache_id=953362122",
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
                "href": "/api/v2/search?actions=addcategory&actions=addversion&actions=default&actions=open&actions=browse&actions=copy&actions=delete&actions=download&actions=edit&actions=favorite&actions=nonfavorite&actions=rename&actions=move&actions=properties&actions=favorite_rename&actions=reserve&actions=unreserve&actions=comment&actions=setAsDefaultPage&actions=unSetAsDefaultPage&actions=initiateworkflow&expand=properties%7Boriginal_id%2Cowner_user_id%2Ccreate_user_id%2Cowner_id%2Creserved_user_id%7D&options=%7B%27highlight_summaries%27%2C%27facets%27%7D&location_id1=914014&where=*&limit=3&page=1&cache_id=953362122",
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
                    "href": "/api/v2/nodes/914014/categories",
                    "method": "POST",
                    "name": "Add Category"
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
                    "form_href": "/api/v2/forms/nodes/copy?id=914014",
                    "href": "/api/v2/nodes",
                    "method": "POST",
                    "name": "Copy"
                  },
                  "delete": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/914014",
                    "method": "DELETE",
                    "name": "Delete"
                  },
                  "move": {
                    "body": "",
                    "content_type": "",
                    "form_href": "/api/v2/forms/nodes/move?id=914014",
                    "href": "/api/v2/nodes/914014",
                    "method": "PUT",
                    "name": "Move"
                  },
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/914014/nodes",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/914014",
                    "method": "GET",
                    "name": "Properties"
                  },
                  "rename": {
                    "body": "",
                    "content_type": "",
                    "form_href": "/api/v2/forms/nodes/rename?id=914014",
                    "href": "/api/v2/nodes/914014",
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
                  "delete",
                  "comment"
                ]
              },
              "data": {
                "properties": {
                  "container": true,
                  "container_size": 20,
                  "create_date": "2016-06-16T04:17:57",
                  "create_user_id": 1000,
                  "create_user_id_expand": {
                    "birth_date": null,
                    "business_email": null,
                    "business_fax": null,
                    "business_phone": null,
                    "cell_phone": null,
                    "first_name": "Admin",
                    "gender": null,
                    "group_id": 2426,
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
                    "photo_url": "api/v1/members/1000/photo?v=197642.1",
                    "time_zone": -1,
                    "title": null,
                    "type": 0,
                    "type_name": "User"
                  },
                  "description": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
                  "description_multilingual": {
                    "en": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet."
                  },
                  "external_create_date": null,
                  "external_identity": "",
                  "external_identity_type": "",
                  "external_modify_date": null,
                  "external_source": "",
                  "favorite": false,
                  "id": 914014,
                  "mime_type": null,
                  "modify_date": "2017-04-28T01:10:27",
                  "modify_user_id": 1000,
                  "name": "All-fileTypes",
                  "name_multilingual": {
                    "en": "All-fileTypes"
                  },
                  "owner_group_id": 1001,
                  "owner_user_id": 1000,
                  "owner_user_id_expand": {
                    "birth_date": null,
                    "business_email": null,
                    "business_fax": null,
                    "business_phone": null,
                    "cell_phone": null,
                    "first_name": "Admin",
                    "gender": null,
                    "group_id": 2426,
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
                    "photo_url": "api/v1/members/1000/photo?v=197642.1",
                    "time_zone": -1,
                    "title": null,
                    "type": 0,
                    "type_name": "User"
                  },
                  "parent_id": 913574,
                  "reserved": false,
                  "reserved_date": null,
                  "reserved_user_id": 0,
                  "short_summary": [
                    ""
                  ],
                  "size": 20,
                  "size_formatted": "20 Items",
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
                    "name": "Enterprise Workspace"
                  },
                  {
                    "href": "api/v1/nodes/604999",
                    "name": "007 Hyderabad"
                  },
                  {
                    "href": "api/v1/nodes/913574",
                    "name": "00 Navya Test folder"
                  }
                ],
                "ancestors_nodes": [
                  {
                    "href": "api/v1/nodes/2000/nodes",
                    "name": "Enterprise Workspace"
                  },
                  {
                    "href": "api/v1/nodes/604999/nodes",
                    "name": "007 Hyderabad"
                  },
                  {
                    "href": "api/v1/nodes/913574/nodes",
                    "name": "00 Navya Test folder"
                  }
                ],
                "parent": {
                  "href": "api/v1/nodes/913574",
                  "name": "00 Navya Test folder"
                },
                "parent_nodes": {
                  "href": "api/v1/nodes/913574/nodes",
                  "name": "00 Navya Test folder"
                }
              },
              "search_result_metadata": {
                "current_version": null,
                "object_href": null,
                "object_id": "DataId=914014&Version=0",
                "result_type": "264",
                "source_id": "4031392",
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
                    "href": "/api/v2/nodes/1563094/categories",
                    "method": "POST",
                    "name": "Add Category"
                  },
                  "addversion": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/1563094/versions",
                    "method": "POST",
                    "name": "Add Version"
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
                    "form_href": "/api/v2/forms/nodes/copy?id=1563094",
                    "href": "/api/v2/nodes",
                    "method": "POST",
                    "name": "Copy"
                  },
                  "delete": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/1563094",
                    "method": "DELETE",
                    "name": "Delete"
                  },
                  "download": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/1563094/content?download",
                    "method": "GET",
                    "name": "Download"
                  },
                  "edit": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "func=Edit.Edit&nodeid=1563094&VerNum=3",
                    "method": "GET",
                    "name": "Edit"
                  },
                  "move": {
                    "body": "",
                    "content_type": "",
                    "form_href": "/api/v2/forms/nodes/move?id=1563094",
                    "href": "/api/v2/nodes/1563094",
                    "method": "PUT",
                    "name": "Move"
                  },
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/1563094/content",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/1563094",
                    "method": "GET",
                    "name": "Properties"
                  },
                  "rename": {
                    "body": "",
                    "content_type": "",
                    "form_href": "/api/v2/forms/nodes/rename?id=1563094",
                    "href": "/api/v2/nodes/1563094",
                    "method": "PUT",
                    "name": "Rename"
                  },
                  "reserve": {
                    "body": "reserved_user_id=1000",
                    "content_type": "application/x-www-form-urlencoded",
                    "form_href": "",
                    "href": "/api/v2/nodes/1563094",
                    "method": "PUT",
                    "name": "Reserve"
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
                  "edit",
                  "download",
                  "addversion",
                  "addcategory",
                  "rename",
                  "copy",
                  "move",
                  "reserve",
                  "delete",
                  "comment"
                ]
              },
              "data": {
                "properties": {
                  "container": false,
                  "container_size": 0,
                  "create_date": "2016-08-05T01:59:11",
                  "create_user_id": 1000,
                  "create_user_id_expand": {
                    "birth_date": null,
                    "business_email": null,
                    "business_fax": null,
                    "business_phone": null,
                    "cell_phone": null,
                    "first_name": "Admin",
                    "gender": null,
                    "group_id": 2426,
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
                    "photo_url": "api/v1/members/1000/photo?v=197642.1",
                    "time_zone": -1,
                    "title": null,
                    "type": 0,
                    "type_name": "User"
                  },
                  "description": "test",
                  "description_multilingual": {
                    "en": "test"
                  },
                  "external_create_date": null,
                  "external_identity": "",
                  "external_identity_type": "",
                  "external_modify_date": null,
                  "external_source": "",
                  "favorite": false,
                  "id": 1563094,
                  "mime_type": "application/pdf",
                  "modify_date": "2017-04-17T01:12:56",
                  "modify_user_id": 1000,
                  "name": "testng_guide.pdf",
                  "name_multilingual": {
                    "en": "testng_guide.pdf"
                  },
                  "owner_group_id": 1001,
                  "owner_user_id": 1000,
                  "owner_user_id_expand": {
                    "birth_date": null,
                    "business_email": null,
                    "business_fax": null,
                    "business_phone": null,
                    "cell_phone": null,
                    "first_name": "Admin",
                    "gender": null,
                    "group_id": 2426,
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
                    "photo_url": "api/v1/members/1000/photo?v=197642.1",
                    "time_zone": -1,
                    "title": null,
                    "type": 0,
                    "type_name": "User"
                  },
                  "parent_id": 914014,
                  "reserved": false,
                  "reserved_date": null,
                  "reserved_user_id": 0,
                  "short_summary": [
                    "monday morning >> We must verify all camper information is correct and" +
                    " additional forms are filled out >> Verify camper information online" +
                    " https://fortuna.uwaterloo.ca/weconnect >> Registration begins at 8 am  and can take up to 15 minutes per child.  p..."
                  ],
                  "size": 1218822,
                  "size_formatted": "2 MB",
                  "summary": [
                    "monday morning >> We must verify all camper information is correct and additional forms are filled out >> Verify camper information online https://fortuna.uwaterloo.ca/weconnect >> Registration begins at 8 am  and can take up to 15 minutes per child.  pick-up and drop-off >> DC Quad uwaterloo.ca/map >> Drop-off is 8-9 am >> Pick-up is from 4-5 pm >> Charge is applied for a late pickup $5 for every 10 minutes .  alternate pick-up >> Parents must fill out pick-up consent form found at: esq.uwaterloo.ca/downloads >> Must show photo ID >> In the case of rain, pick-up is inside DC building >> Pick-up/drop-off outside of regular hours requires an email be sent to: esqinfo@uwaterloo.ca.  Camper must be signed out at the end of each day >> Camper will be wearing 'passport' that must be returned at the end of each day.  open house >> Thursday 4-4:45 pm >> View camp rooms and camper projects >> Pick-up your camper as usual and you will be directed to their camp room >> Directions to camp rooms will be provided."
                  ],
                  "type": 144,
                  "type_name": "Document",
                  "versions_control_advanced": false,
                  "volume_id": -2000
                },
                "versions": {
                  "create_date": "2017-04-05T11:45:11",
                  "description": null,
                  "file_create_date": "2017-04-05T11:45:10",
                  "file_modify_date": "2017-04-05T11:45:11",
                  "file_name": "esq_waterloo_information_package.pdf",
                  "file_size": 1218822,
                  "file_type": "pdf",
                  "id": 1563094,
                  "locked": false,
                  "locked_date": null,
                  "locked_user_id": null,
                  "mime_type": "application/pdf",
                  "modify_date": "2017-04-05T11:45:11",
                  "name": "esq_waterloo_information_package.pdf",
                  "owner_id": 1000,
                  "provider_id": 3188597,
                  "version_id": 3188598,
                  "version_number": 3,
                  "version_number_major": 0,
                  "version_number_minor": 3,
                  "version_number_name": "3"
                }
              },
              "links": {
                "ancestors": [
                  {
                    "href": "api/v1/nodes/2000",
                    "name": "Enterprise Workspace"
                  },
                  {
                    "href": "api/v1/nodes/604999",
                    "name": "007 Hyderabad"
                  },
                  {
                    "href": "api/v1/nodes/913574",
                    "name": "00 Navya Test folder"
                  },
                  {
                    "href": "api/v1/nodes/914014",
                    "name": "All-fileTypes"
                  }
                ],
                "ancestors_nodes": [
                  {
                    "href": "api/v1/nodes/2000/nodes",
                    "name": "Enterprise Workspace"
                  },
                  {
                    "href": "api/v1/nodes/604999/nodes",
                    "name": "007 Hyderabad"
                  },
                  {
                    "href": "api/v1/nodes/913574/nodes",
                    "name": "00 Navya Test folder"
                  },
                  {
                    "href": "api/v1/nodes/914014/nodes",
                    "name": "All-fileTypes"
                  }
                ],
                "parent": {
                  "href": "api/v1/nodes/914014",
                  "name": "All-fileTypes"
                },
                "parent_nodes": {
                  "href": "api/v1/nodes/914014/nodes",
                  "name": "All-fileTypes"
                }
              },
              "search_result_metadata": {
                "current_version": true,
                "object_href": null,
                "object_id": "DataId=1563094&Version=3",
                "result_type": "264",
                "source_id": "4031392",
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
                    "href": "/api/v2/nodes/3931957/categories",
                    "method": "POST",
                    "name": "Add Category"
                  },
                  "delete": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/3931957",
                    "method": "DELETE",
                    "name": "Delete"
                  },
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/3931957/nodes",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/3931957",
                    "method": "GET",
                    "name": "Properties"
                  },
                  "rename": {
                    "body": "",
                    "content_type": "",
                    "form_href": "/api/v2/forms/nodes/rename?id=3931957",
                    "href": "/api/v2/nodes/3931957",
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
                  "open",
                  "addcategory",
                  "rename",
                  "delete"
                ]
              },
              "data": {
                "properties": {
                  "container": true,
                  "container_size": 2,
                  "create_date": "2017-04-26T05:01:50",
                  "create_user_id": 1000,
                  "create_user_id_expand": {
                    "birth_date": null,
                    "business_email": null,
                    "business_fax": null,
                    "business_phone": null,
                    "cell_phone": null,
                    "first_name": "Admin",
                    "gender": null,
                    "group_id": 2426,
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
                    "photo_url": "api/v1/members/1000/photo?v=197642.1",
                    "time_zone": -1,
                    "title": null,
                    "type": 0,
                    "type_name": "User"
                  },
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
                  "id": 3931957,
                  "mime_type": null,
                  "modify_date": "2017-04-26T05:02:17",
                  "modify_user_id": 1000,
                  "name": "Comments for - Audi-A8.jpg (3411566)",
                  "name_multilingual": {
                    "en": "Comments for - Audi-A8.jpg (3411566)"
                  },
                  "owner_group_id": 2426,
                  "owner_user_id": 1000,
                  "owner_user_id_expand": {
                    "birth_date": null,
                    "business_email": null,
                    "business_fax": null,
                    "business_phone": null,
                    "cell_phone": null,
                    "first_name": "Admin",
                    "gender": null,
                    "group_id": 2426,
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
                    "photo_url": "api/v1/members/1000/photo?v=197642.1",
                    "time_zone": -1,
                    "title": null,
                    "type": 0,
                    "type_name": "User"
                  },
                  "parent_id": 132097,
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
                  "type": 1281,
                  "type_name": "MicroPost",
                  "versions_control_advanced": false,
                  "volume_id": -132097
                }
              },
              "links": {
                "ancestors": [
                  {
                    "href": "api/v1/nodes/132097",
                    "name": "Pulse"
                  }
                ],
                "ancestors_nodes": [
                  {
                    "href": "api/v1/nodes/132097/nodes",
                    "name": "Pulse"
                  }
                ],
                "parent": {
                  "href": "api/v1/nodes/132097",
                  "name": "Pulse"
                },
                "parent_nodes": {
                  "href": "api/v1/nodes/132097/nodes",
                  "name": "Pulse"
                }
              },
              "search_result_metadata": {
                "current_version": null,
                "object_href": null,
                "object_id": "DataId=3931957&Version=0",
                "result_type": "264",
                "source_id": "4031392",
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
                    "href": "/api/v2/nodes/1563416/categories",
                    "method": "POST",
                    "name": "Add Category"
                  },
                  "addversion": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/1563416/versions",
                    "method": "POST",
                    "name": "Add Version"
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
                    "form_href": "/api/v2/forms/nodes/copy?id=1563416",
                    "href": "/api/v2/nodes",
                    "method": "POST",
                    "name": "Copy"
                  },
                  "download": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/1563416/content?download",
                    "method": "GET",
                    "name": "Download"
                  },
                  "edit": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "func=Edit.Edit&nodeid=1563416&VerNum=3",
                    "method": "GET",
                    "name": "Edit"
                  },
                  "move": {
                    "body": "",
                    "content_type": "",
                    "form_href": "/api/v2/forms/nodes/move?id=1563416",
                    "href": "/api/v2/nodes/1563416",
                    "method": "PUT",
                    "name": "Move"
                  },
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/1563416/content",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/1563416",
                    "method": "GET",
                    "name": "Properties"
                  },
                  "rename": {
                    "body": "",
                    "content_type": "",
                    "form_href": "/api/v2/forms/nodes/rename?id=1563416",
                    "href": "/api/v2/nodes/1563416",
                    "method": "PUT",
                    "name": "Rename"
                  },
                  "unreserve": {
                    "body": "reserved_user_id=null",
                    "content_type": "application/x-www-form-urlencoded",
                    "form_href": "",
                    "href": "/api/v2/nodes/1563416",
                    "method": "PUT",
                    "name": "Unreserve"
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
                  "edit",
                  "download",
                  "addversion",
                  "addcategory",
                  "rename",
                  "copy",
                  "move",
                  "unreserve",
                  "comment"
                ]
              },
              "data": {
                "properties": {
                  "container": false,
                  "container_size": 0,
                  "create_date": "2016-08-05T01:58:54",
                  "create_user_id": 1000,
                  "create_user_id_expand": {
                    "birth_date": null,
                    "business_email": null,
                    "business_fax": null,
                    "business_phone": null,
                    "cell_phone": null,
                    "first_name": "Admin",
                    "gender": null,
                    "group_id": 2426,
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
                    "photo_url": "api/v1/members/1000/photo?v=197642.1",
                    "time_zone": -1,
                    "title": null,
                    "type": 0,
                    "type_name": "User"
                  },
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
                  "id": 1563416,
                  "mime_type": "application/msword",
                  "modify_date": "2017-04-17T05:20:09",
                  "modify_user_id": 1000,
                  "name": "CS10_5_Setup.docx",
                  "name_multilingual": {
                    "en": "CS10_5_Setup.docx"
                  },
                  "owner_group_id": 1001,
                  "owner_user_id": 1000,
                  "owner_user_id_expand": {
                    "birth_date": null,
                    "business_email": null,
                    "business_fax": null,
                    "business_phone": null,
                    "cell_phone": null,
                    "first_name": "Admin",
                    "gender": null,
                    "group_id": 2426,
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
                    "photo_url": "api/v1/members/1000/photo?v=197642.1",
                    "time_zone": -1,
                    "title": null,
                    "type": 0,
                    "type_name": "User"
                  },
                  "parent_id": 914014,
                  "reserved": true,
                  "reserved_date": "2017-04-17T05:20:15",
                  "reserved_user_id": 1000,
                  "reserved_user_id_expand": {
                    "birth_date": null,
                    "business_email": null,
                    "business_fax": null,
                    "business_phone": null,
                    "cell_phone": null,
                    "first_name": "Admin",
                    "gender": null,
                    "group_id": 2426,
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
                    "photo_url": "api/v1/members/1000/photo?v=197642.1",
                    "time_zone": -1,
                    "title": null,
                    "type": 0,
                    "type_name": "User"
                  },
                  "short_summary": [
                    ""
                  ],
                  "size": 19456,
                  "size_formatted": "19 KB",
                  "summary": [
                    ""
                  ],
                  "type": 144,
                  "type_name": "Document",
                  "versions_control_advanced": false,
                  "volume_id": -2000
                },
                "versions": {
                  "create_date": "2017-04-05T11:13:14",
                  "description": null,
                  "file_create_date": "2017-04-05T11:13:14",
                  "file_modify_date": "2017-04-05T11:13:14",
                  "file_name": "64_Characters.doc",
                  "file_size": 19456,
                  "file_type": "doc",
                  "id": 1563416,
                  "locked": false,
                  "locked_date": null,
                  "locked_user_id": null,
                  "mime_type": "application/msword",
                  "modify_date": "2017-04-05T11:13:14",
                  "name": "64_Characters.doc",
                  "owner_id": 1000,
                  "provider_id": 3188486,
                  "version_id": 3188487,
                  "version_number": 3,
                  "version_number_major": 0,
                  "version_number_minor": 3,
                  "version_number_name": "3"
                }
              },
              "links": {
                "ancestors": [
                  {
                    "href": "api/v1/nodes/2000",
                    "name": "Enterprise Workspace"
                  },
                  {
                    "href": "api/v1/nodes/604999",
                    "name": "007 Hyderabad"
                  },
                  {
                    "href": "api/v1/nodes/913574",
                    "name": "00 Navya Test folder"
                  },
                  {
                    "href": "api/v1/nodes/914014",
                    "name": "All-fileTypes"
                  }
                ],
                "ancestors_nodes": [
                  {
                    "href": "api/v1/nodes/2000/nodes",
                    "name": "Enterprise Workspace"
                  },
                  {
                    "href": "api/v1/nodes/604999/nodes",
                    "name": "007 Hyderabad"
                  },
                  {
                    "href": "api/v1/nodes/913574/nodes",
                    "name": "00 Navya Test folder"
                  },
                  {
                    "href": "api/v1/nodes/914014/nodes",
                    "name": "All-fileTypes"
                  }
                ],
                "parent": {
                  "href": "api/v1/nodes/914014",
                  "name": "All-fileTypes"
                },
                "parent_nodes": {
                  "href": "api/v1/nodes/914014/nodes",
                  "name": "All-fileTypes"
                }
              },
              "search_result_metadata": {
                "current_version": true,
                "object_href": null,
                "object_id": "DataId=1563416&Version=3",
                "result_type": "264",
                "source_id": "4031392",
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
                    "href": "/api/v2/nodes/1563420/categories",
                    "method": "POST",
                    "name": "Add Category"
                  },
                  "addversion": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/1563420/versions",
                    "method": "POST",
                    "name": "Add Version"
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
                    "form_href": "/api/v2/forms/nodes/copy?id=1563420",
                    "href": "/api/v2/nodes",
                    "method": "POST",
                    "name": "Copy"
                  },
                  "download": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/1563420/content?download",
                    "method": "GET",
                    "name": "Download"
                  },
                  "edit": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "func=Edit.Edit&nodeid=1563420&VerNum=1",
                    "method": "GET",
                    "name": "Edit"
                  },
                  "move": {
                    "body": "",
                    "content_type": "",
                    "form_href": "/api/v2/forms/nodes/move?id=1563420",
                    "href": "/api/v2/nodes/1563420",
                    "method": "PUT",
                    "name": "Move"
                  },
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/1563420/content",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/1563420",
                    "method": "GET",
                    "name": "Properties"
                  },
                  "rename": {
                    "body": "",
                    "content_type": "",
                    "form_href": "/api/v2/forms/nodes/rename?id=1563420",
                    "href": "/api/v2/nodes/1563420",
                    "method": "PUT",
                    "name": "Rename"
                  },
                  "unreserve": {
                    "body": "reserved_user_id=null",
                    "content_type": "application/x-www-form-urlencoded",
                    "form_href": "",
                    "href": "/api/v2/nodes/1563420",
                    "method": "PUT",
                    "name": "Unreserve"
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
                  "edit",
                  "download",
                  "addversion",
                  "addcategory",
                  "rename",
                  "copy",
                  "move",
                  "unreserve",
                  "comment"
                ]
              },
              "data": {
                "properties": {
                  "container": false,
                  "container_size": 0,
                  "create_date": "2016-08-05T01:59:09",
                  "create_user_id": 1000,
                  "create_user_id_expand": {
                    "birth_date": null,
                    "business_email": null,
                    "business_fax": null,
                    "business_phone": null,
                    "cell_phone": null,
                    "first_name": "Admin",
                    "gender": null,
                    "group_id": 2426,
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
                    "photo_url": "api/v1/members/1000/photo?v=197642.1",
                    "time_zone": -1,
                    "title": null,
                    "type": 0,
                    "type_name": "User"
                  },
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
                  "id": 1563420,
                  "mime_type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                  "modify_date": "2017-03-22T00:38:06",
                  "modify_user_id": 1000,
                  "name": "Sort_options.docx",
                  "name_multilingual": {
                    "en": "Sort_options.docx"
                  },
                  "owner_group_id": 1001,
                  "owner_user_id": 1000,
                  "owner_user_id_expand": {
                    "birth_date": null,
                    "business_email": null,
                    "business_fax": null,
                    "business_phone": null,
                    "cell_phone": null,
                    "first_name": "Admin",
                    "gender": null,
                    "group_id": 2426,
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
                    "photo_url": "api/v1/members/1000/photo?v=197642.1",
                    "time_zone": -1,
                    "title": null,
                    "type": 0,
                    "type_name": "User"
                  },
                  "parent_id": 914014,
                  "reserved": true,
                  "reserved_date": "2017-04-05T11:12:31",
                  "reserved_user_id": 1000,
                  "reserved_user_id_expand": {
                    "birth_date": null,
                    "business_email": null,
                    "business_fax": null,
                    "business_phone": null,
                    "cell_phone": null,
                    "first_name": "Admin",
                    "gender": null,
                    "group_id": 2426,
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
                    "photo_url": "api/v1/members/1000/photo?v=197642.1",
                    "time_zone": -1,
                    "title": null,
                    "type": 0,
                    "type_name": "User"
                  },
                  "short_summary": [
                    "Make sure that by default below set of sort options should be there on search results page Relevance Date Size."
                  ],
                  "size": 14051,
                  "size_formatted": "14 KB",
                  "summary": [
                    "Make sure that by default below set of sort options should be there on search results page Relevance Date Size."
                  ],
                  "type": 144,
                  "type_name": "Document",
                  "versions_control_advanced": false,
                  "volume_id": -2000
                },
                "versions": {
                  "create_date": "2016-08-05T01:59:09",
                  "description": null,
                  "file_create_date": "2016-08-05T01:59:09",
                  "file_modify_date": "2016-08-05T01:59:09",
                  "file_name": "Sort_options.docx",
                  "file_size": 14051,
                  "file_type": "docx",
                  "id": 1563420,
                  "locked": false,
                  "locked_date": null,
                  "locked_user_id": null,
                  "mime_type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                  "modify_date": "2016-08-05T01:59:09",
                  "name": "Sort_options.docx",
                  "owner_id": 1000,
                  "provider_id": 1563420,
                  "version_id": 1563420,
                  "version_number": 1,
                  "version_number_major": 0,
                  "version_number_minor": 1,
                  "version_number_name": "1"
                }
              },
              "links": {
                "ancestors": [
                  {
                    "href": "api/v1/nodes/2000",
                    "name": "Enterprise Workspace"
                  },
                  {
                    "href": "api/v1/nodes/604999",
                    "name": "007 Hyderabad"
                  },
                  {
                    "href": "api/v1/nodes/913574",
                    "name": "00 Navya Test folder"
                  },
                  {
                    "href": "api/v1/nodes/914014",
                    "name": "All-fileTypes"
                  }
                ],
                "ancestors_nodes": [
                  {
                    "href": "api/v1/nodes/2000/nodes",
                    "name": "Enterprise Workspace"
                  },
                  {
                    "href": "api/v1/nodes/604999/nodes",
                    "name": "007 Hyderabad"
                  },
                  {
                    "href": "api/v1/nodes/913574/nodes",
                    "name": "00 Navya Test folder"
                  },
                  {
                    "href": "api/v1/nodes/914014/nodes",
                    "name": "All-fileTypes"
                  }
                ],
                "parent": {
                  "href": "api/v1/nodes/914014",
                  "name": "All-fileTypes"
                },
                "parent_nodes": {
                  "href": "api/v1/nodes/914014/nodes",
                  "name": "All-fileTypes"
                }
              },
              "search_result_metadata": {
                "current_version": true,
                "object_href": null,
                "object_id": "DataId=1563420&Version=1",
                "result_type": "264",
                "source_id": "4031392",
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
                    "href": "/api/v2/nodes/1562866/categories",
                    "method": "POST",
                    "name": "Add Category"
                  },
                  "addversion": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/1562866/versions",
                    "method": "POST",
                    "name": "Add Version"
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
                    "form_href": "/api/v2/forms/nodes/copy?id=1562866",
                    "href": "/api/v2/nodes",
                    "method": "POST",
                    "name": "Copy"
                  },
                  "download": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/1562866/content?download",
                    "method": "GET",
                    "name": "Download"
                  },
                  "edit": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "func=Edit.Edit&nodeid=1562866&VerNum=1",
                    "method": "GET",
                    "name": "Edit"
                  },
                  "move": {
                    "body": "",
                    "content_type": "",
                    "form_href": "/api/v2/forms/nodes/move?id=1562866",
                    "href": "/api/v2/nodes/1562866",
                    "method": "PUT",
                    "name": "Move"
                  },
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/1562866/content",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/1562866",
                    "method": "GET",
                    "name": "Properties"
                  },
                  "rename": {
                    "body": "",
                    "content_type": "",
                    "form_href": "/api/v2/forms/nodes/rename?id=1562866",
                    "href": "/api/v2/nodes/1562866",
                    "method": "PUT",
                    "name": "Rename"
                  },
                  "unreserve": {
                    "body": "reserved_user_id=null",
                    "content_type": "application/x-www-form-urlencoded",
                    "form_href": "",
                    "href": "/api/v2/nodes/1562866",
                    "method": "PUT",
                    "name": "Unreserve"
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
                  "edit",
                  "download",
                  "addversion",
                  "addcategory",
                  "rename",
                  "copy",
                  "move",
                  "unreserve",
                  "comment"
                ]
              },
              "data": {
                "properties": {
                  "container": false,
                  "container_size": 0,
                  "create_date": "2016-08-05T01:59:14",
                  "create_user_id": 1000,
                  "create_user_id_expand": {
                    "birth_date": null,
                    "business_email": null,
                    "business_fax": null,
                    "business_phone": null,
                    "cell_phone": null,
                    "first_name": "Admin",
                    "gender": null,
                    "group_id": 2426,
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
                    "photo_url": "api/v1/members/1000/photo?v=197642.1",
                    "time_zone": -1,
                    "title": null,
                    "type": 0,
                    "type_name": "User"
                  },
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
                  "id": 1562866,
                  "mime_type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                  "modify_date": "2017-03-22T00:38:06",
                  "modify_user_id": 1000,
                  "name": "UE review.pptx",
                  "name_multilingual": {
                    "en": "UE review.pptx"
                  },
                  "owner_group_id": 1001,
                  "owner_user_id": 1000,
                  "owner_user_id_expand": {
                    "birth_date": null,
                    "business_email": null,
                    "business_fax": null,
                    "business_phone": null,
                    "cell_phone": null,
                    "first_name": "Admin",
                    "gender": null,
                    "group_id": 2426,
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
                    "photo_url": "api/v1/members/1000/photo?v=197642.1",
                    "time_zone": -1,
                    "title": null,
                    "type": 0,
                    "type_name": "User"
                  },
                  "parent_id": 914014,
                  "reserved": true,
                  "reserved_date": "2017-04-05T11:12:20",
                  "reserved_user_id": 1000,
                  "reserved_user_id_expand": {
                    "birth_date": null,
                    "business_email": null,
                    "business_fax": null,
                    "business_phone": null,
                    "cell_phone": null,
                    "first_name": "Admin",
                    "gender": null,
                    "group_id": 2426,
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
                    "photo_url": "api/v1/members/1000/photo?v=197642.1",
                    "time_zone": -1,
                    "title": null,
                    "type": 0,
                    "type_name": "User"
                  },
                  "short_summary": [
                    "Comment input box is not clearly visible.  Pencil icon for edit seems broken Default text is cutoff at the bottom Width of the comment input box does not occupy the full width.  Icons should appear inside text input area.  When user has typed in some..."
                  ],
                  "size": 390616,
                  "size_formatted": "382 KB",
                  "summary": [
                    "Comment input box is not clearly visible.  Pencil icon for edit seems broken Default text is cutoff at the bottom Width of the comment input box does not occupy the full width.  Icons should appear inside text input area.  When user has typed in some text and the focus is gone from the comment input area post button should not be hidden.  Delete confirmation dialog is not displayed at the center of the comments widget."
                  ],
                  "type": 144,
                  "type_name": "Document",
                  "versions_control_advanced": false,
                  "volume_id": -2000
                },
                "versions": {
                  "create_date": "2016-08-05T01:59:14",
                  "description": null,
                  "file_create_date": "2016-08-05T01:59:14",
                  "file_modify_date": "2016-08-05T01:59:14",
                  "file_name": "UE review.pptx",
                  "file_size": 390616,
                  "file_type": "pptx",
                  "id": 1562866,
                  "locked": false,
                  "locked_date": null,
                  "locked_user_id": null,
                  "mime_type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                  "modify_date": "2016-08-05T01:59:14",
                  "name": "UE review.pptx",
                  "owner_id": 1000,
                  "provider_id": 1562866,
                  "version_id": 1562866,
                  "version_number": 1,
                  "version_number_major": 0,
                  "version_number_minor": 1,
                  "version_number_name": "1"
                }
              },
              "links": {
                "ancestors": [
                  {
                    "href": "api/v1/nodes/2000",
                    "name": "Enterprise Workspace"
                  },
                  {
                    "href": "api/v1/nodes/604999",
                    "name": "007 Hyderabad"
                  },
                  {
                    "href": "api/v1/nodes/913574",
                    "name": "00 Navya Test folder"
                  },
                  {
                    "href": "api/v1/nodes/914014",
                    "name": "All-fileTypes"
                  }
                ],
                "ancestors_nodes": [
                  {
                    "href": "api/v1/nodes/2000/nodes",
                    "name": "Enterprise Workspace"
                  },
                  {
                    "href": "api/v1/nodes/604999/nodes",
                    "name": "007 Hyderabad"
                  },
                  {
                    "href": "api/v1/nodes/913574/nodes",
                    "name": "00 Navya Test folder"
                  },
                  {
                    "href": "api/v1/nodes/914014/nodes",
                    "name": "All-fileTypes"
                  }
                ],
                "parent": {
                  "href": "api/v1/nodes/914014",
                  "name": "All-fileTypes"
                },
                "parent_nodes": {
                  "href": "api/v1/nodes/914014/nodes",
                  "name": "All-fileTypes"
                }
              },
              "search_result_metadata": {
                "current_version": true,
                "object_href": null,
                "object_id": "DataId=1562866&Version=1",
                "result_type": "264",
                "source_id": "4031392",
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
                    "href": "/api/v2/nodes/3411566/categories",
                    "method": "POST",
                    "name": "Add Category"
                  },
                  "addversion": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/3411566/versions",
                    "method": "POST",
                    "name": "Add Version"
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
                    "form_href": "/api/v2/forms/nodes/copy?id=3411566",
                    "href": "/api/v2/nodes",
                    "method": "POST",
                    "name": "Copy"
                  },
                  "delete": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/3411566",
                    "method": "DELETE",
                    "name": "Delete"
                  },
                  "download": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/3411566/content?download",
                    "method": "GET",
                    "name": "Download"
                  },
                  "edit": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "func=Edit.Edit&nodeid=3411566&VerNum=1",
                    "method": "GET",
                    "name": "Edit"
                  },
                  "move": {
                    "body": "",
                    "content_type": "",
                    "form_href": "/api/v2/forms/nodes/move?id=3411566",
                    "href": "/api/v2/nodes/3411566",
                    "method": "PUT",
                    "name": "Move"
                  },
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/3411566/content",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/3411566",
                    "method": "GET",
                    "name": "Properties"
                  },
                  "rename": {
                    "body": "",
                    "content_type": "",
                    "form_href": "/api/v2/forms/nodes/rename?id=3411566",
                    "href": "/api/v2/nodes/3411566",
                    "method": "PUT",
                    "name": "Rename"
                  },
                  "reserve": {
                    "body": "reserved_user_id=1000",
                    "content_type": "application/x-www-form-urlencoded",
                    "form_href": "",
                    "href": "/api/v2/nodes/3411566",
                    "method": "PUT",
                    "name": "Reserve"
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
                  "edit",
                  "download",
                  "addversion",
                  "addcategory",
                  "rename",
                  "copy",
                  "move",
                  "reserve",
                  "delete",
                  "comment"
                ]
              },
              "data": {
                "properties": {
                  "container": false,
                  "container_size": 0,
                  "create_date": "2017-04-11T12:21:25",
                  "create_user_id": 1000,
                  "create_user_id_expand": {
                    "birth_date": null,
                    "business_email": null,
                    "business_fax": null,
                    "business_phone": null,
                    "cell_phone": null,
                    "first_name": "Admin",
                    "gender": null,
                    "group_id": 2426,
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
                    "photo_url": "api/v1/members/1000/photo?v=197642.1",
                    "time_zone": -1,
                    "title": null,
                    "type": 0,
                    "type_name": "User"
                  },
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
                  "id": 3411566,
                  "mime_type": "image/jpeg",
                  "modify_date": "2017-04-18T02:04:42",
                  "modify_user_id": 1000,
                  "name": "Audi-A8.jpg",
                  "name_multilingual": {
                    "en": "Audi-A8.jpg"
                  },
                  "owner_group_id": 1001,
                  "owner_user_id": 1000,
                  "owner_user_id_expand": {
                    "birth_date": null,
                    "business_email": null,
                    "business_fax": null,
                    "business_phone": null,
                    "cell_phone": null,
                    "first_name": "Admin",
                    "gender": null,
                    "group_id": 2426,
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
                    "photo_url": "api/v1/members/1000/photo?v=197642.1",
                    "time_zone": -1,
                    "title": null,
                    "type": 0,
                    "type_name": "User"
                  },
                  "parent_id": 914014,
                  "reserved": false,
                  "reserved_date": null,
                  "reserved_user_id": 0,
                  "short_summary": [
                    ""
                  ],
                  "size": 61726,
                  "size_formatted": "61 KB",
                  "summary": [
                    ""
                  ],
                  "type": 144,
                  "type_name": "Document",
                  "versions_control_advanced": false,
                  "volume_id": -2000
                },
                "versions": {
                  "create_date": "2017-04-11T12:21:26",
                  "description": null,
                  "file_create_date": "2017-04-11T12:21:25",
                  "file_modify_date": "2017-04-11T12:21:25",
                  "file_name": "Audi-A8.jpg",
                  "file_size": 61726,
                  "file_type": "jpg",
                  "id": 3411566,
                  "locked": false,
                  "locked_date": null,
                  "locked_user_id": null,
                  "mime_type": "image/jpeg",
                  "modify_date": "2017-04-11T12:21:26",
                  "name": "Audi-A8.jpg",
                  "owner_id": 1000,
                  "provider_id": 3411566,
                  "version_id": 3411566,
                  "version_number": 1,
                  "version_number_major": 0,
                  "version_number_minor": 1,
                  "version_number_name": "1"
                }
              },
              "links": {
                "ancestors": [
                  {
                    "href": "api/v1/nodes/2000",
                    "name": "Enterprise Workspace"
                  },
                  {
                    "href": "api/v1/nodes/604999",
                    "name": "007 Hyderabad"
                  },
                  {
                    "href": "api/v1/nodes/913574",
                    "name": "00 Navya Test folder"
                  },
                  {
                    "href": "api/v1/nodes/914014",
                    "name": "All-fileTypes"
                  }
                ],
                "ancestors_nodes": [
                  {
                    "href": "api/v1/nodes/2000/nodes",
                    "name": "Enterprise Workspace"
                  },
                  {
                    "href": "api/v1/nodes/604999/nodes",
                    "name": "007 Hyderabad"
                  },
                  {
                    "href": "api/v1/nodes/913574/nodes",
                    "name": "00 Navya Test folder"
                  },
                  {
                    "href": "api/v1/nodes/914014/nodes",
                    "name": "All-fileTypes"
                  }
                ],
                "parent": {
                  "href": "api/v1/nodes/914014",
                  "name": "All-fileTypes"
                },
                "parent_nodes": {
                  "href": "api/v1/nodes/914014/nodes",
                  "name": "All-fileTypes"
                }
              },
              "search_result_metadata": {
                "current_version": true,
                "object_href": null,
                "object_id": "DataId=3411566&Version=1",
                "result_type": "264",
                "source_id": "4031392",
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
                    "href": "/api/v2/nodes/1563772/categories",
                    "method": "POST",
                    "name": "Add Category"
                  },
                  "addversion": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/1563772/versions",
                    "method": "POST",
                    "name": "Add Version"
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
                    "form_href": "/api/v2/forms/nodes/copy?id=1563772",
                    "href": "/api/v2/nodes",
                    "method": "POST",
                    "name": "Copy"
                  },
                  "delete": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/1563772",
                    "method": "DELETE",
                    "name": "Delete"
                  },
                  "download": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/1563772/content?download",
                    "method": "GET",
                    "name": "Download"
                  },
                  "edit": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "func=Edit.Edit&nodeid=1563772&VerNum=1",
                    "method": "GET",
                    "name": "Edit"
                  },
                  "move": {
                    "body": "",
                    "content_type": "",
                    "form_href": "/api/v2/forms/nodes/move?id=1563772",
                    "href": "/api/v2/nodes/1563772",
                    "method": "PUT",
                    "name": "Move"
                  },
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/1563772/content",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/1563772",
                    "method": "GET",
                    "name": "Properties"
                  },
                  "rename": {
                    "body": "",
                    "content_type": "",
                    "form_href": "/api/v2/forms/nodes/rename?id=1563772",
                    "href": "/api/v2/nodes/1563772",
                    "method": "PUT",
                    "name": "Rename"
                  },
                  "reserve": {
                    "body": "reserved_user_id=1000",
                    "content_type": "application/x-www-form-urlencoded",
                    "form_href": "",
                    "href": "/api/v2/nodes/1563772",
                    "method": "PUT",
                    "name": "Reserve"
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
                  "edit",
                  "download",
                  "addversion",
                  "addcategory",
                  "rename",
                  "copy",
                  "move",
                  "reserve",
                  "delete",
                  "comment"
                ]
              },
              "data": {
                "properties": {
                  "container": false,
                  "container_size": 0,
                  "create_date": "2016-08-05T01:59:12",
                  "create_user_id": 1000,
                  "create_user_id_expand": {
                    "birth_date": null,
                    "business_email": null,
                    "business_fax": null,
                    "business_phone": null,
                    "cell_phone": null,
                    "first_name": "Admin",
                    "gender": null,
                    "group_id": 2426,
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
                    "photo_url": "api/v1/members/1000/photo?v=197642.1",
                    "time_zone": -1,
                    "title": null,
                    "type": 0,
                    "type_name": "User"
                  },
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
                  "id": 1563772,
                  "mime_type": "application/octet-stream",
                  "modify_date": "2017-03-22T00:38:06",
                  "modify_user_id": 1000,
                  "name": "tomcat-users.xml.bak",
                  "name_multilingual": {
                    "en": "tomcat-users.xml.bak"
                  },
                  "owner_group_id": 1001,
                  "owner_user_id": 1000,
                  "owner_user_id_expand": {
                    "birth_date": null,
                    "business_email": null,
                    "business_fax": null,
                    "business_phone": null,
                    "cell_phone": null,
                    "first_name": "Admin",
                    "gender": null,
                    "group_id": 2426,
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
                    "photo_url": "api/v1/members/1000/photo?v=197642.1",
                    "time_zone": -1,
                    "title": null,
                    "type": 0,
                    "type_name": "User"
                  },
                  "parent_id": 914014,
                  "reserved": false,
                  "reserved_date": null,
                  "reserved_user_id": 0,
                  "short_summary": [
                    "http tomcat.apache.org xml http www.w3.org XMLSchema-instance http tomcat.apache.org xml tomcat-users.xsd"
                  ],
                  "size": 1783,
                  "size_formatted": "2 KB",
                  "summary": [
                    "http tomcat.apache.org xml http www.w3.org XMLSchema-instance http tomcat.apache.org xml tomcat-users.xsd"
                  ],
                  "type": 144,
                  "type_name": "Document",
                  "versions_control_advanced": false,
                  "volume_id": -2000
                },
                "versions": {
                  "create_date": "2016-08-05T01:59:12",
                  "description": null,
                  "file_create_date": "2016-08-05T01:59:12",
                  "file_modify_date": "2016-08-05T01:59:12",
                  "file_name": "tomcat-users.xml.bak",
                  "file_size": 1783,
                  "file_type": "bak",
                  "id": 1563772,
                  "locked": false,
                  "locked_date": null,
                  "locked_user_id": null,
                  "mime_type": "application/octet-stream",
                  "modify_date": "2016-08-05T01:59:12",
                  "name": "tomcat-users.xml.bak",
                  "owner_id": 1000,
                  "provider_id": 1563772,
                  "version_id": 1563772,
                  "version_number": 1,
                  "version_number_major": 0,
                  "version_number_minor": 1,
                  "version_number_name": "1"
                }
              },
              "links": {
                "ancestors": [
                  {
                    "href": "api/v1/nodes/2000",
                    "name": "Enterprise Workspace"
                  },
                  {
                    "href": "api/v1/nodes/604999",
                    "name": "007 Hyderabad"
                  },
                  {
                    "href": "api/v1/nodes/913574",
                    "name": "00 Navya Test folder"
                  },
                  {
                    "href": "api/v1/nodes/914014",
                    "name": "All-fileTypes"
                  }
                ],
                "ancestors_nodes": [
                  {
                    "href": "api/v1/nodes/2000/nodes",
                    "name": "Enterprise Workspace"
                  },
                  {
                    "href": "api/v1/nodes/604999/nodes",
                    "name": "007 Hyderabad"
                  },
                  {
                    "href": "api/v1/nodes/913574/nodes",
                    "name": "00 Navya Test folder"
                  },
                  {
                    "href": "api/v1/nodes/914014/nodes",
                    "name": "All-fileTypes"
                  }
                ],
                "parent": {
                  "href": "api/v1/nodes/914014",
                  "name": "All-fileTypes"
                },
                "parent_nodes": {
                  "href": "api/v1/nodes/914014/nodes",
                  "name": "All-fileTypes"
                }
              },
              "search_result_metadata": {
                "current_version": true,
                "object_href": null,
                "object_id": "DataId=1563772&Version=1",
                "result_type": "264",
                "source_id": "4031392",
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
                    "href": "/api/v2/nodes/1563770/categories",
                    "method": "POST",
                    "name": "Add Category"
                  },
                  "addversion": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/1563770/versions",
                    "method": "POST",
                    "name": "Add Version"
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
                    "form_href": "/api/v2/forms/nodes/copy?id=1563770",
                    "href": "/api/v2/nodes",
                    "method": "POST",
                    "name": "Copy"
                  },
                  "delete": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/1563770",
                    "method": "DELETE",
                    "name": "Delete"
                  },
                  "download": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/1563770/content?download",
                    "method": "GET",
                    "name": "Download"
                  },
                  "edit": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "func=Edit.Edit&nodeid=1563770&VerNum=1",
                    "method": "GET",
                    "name": "Edit"
                  },
                  "move": {
                    "body": "",
                    "content_type": "",
                    "form_href": "/api/v2/forms/nodes/move?id=1563770",
                    "href": "/api/v2/nodes/1563770",
                    "method": "PUT",
                    "name": "Move"
                  },
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/1563770/content",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/1563770",
                    "method": "GET",
                    "name": "Properties"
                  },
                  "rename": {
                    "body": "",
                    "content_type": "",
                    "form_href": "/api/v2/forms/nodes/rename?id=1563770",
                    "href": "/api/v2/nodes/1563770",
                    "method": "PUT",
                    "name": "Rename"
                  },
                  "reserve": {
                    "body": "reserved_user_id=1000",
                    "content_type": "application/x-www-form-urlencoded",
                    "form_href": "",
                    "href": "/api/v2/nodes/1563770",
                    "method": "PUT",
                    "name": "Reserve"
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
                  "edit",
                  "download",
                  "addversion",
                  "addcategory",
                  "rename",
                  "copy",
                  "move",
                  "reserve",
                  "delete",
                  "comment"
                ]
              },
              "data": {
                "properties": {
                  "container": false,
                  "container_size": 0,
                  "create_date": "2016-08-05T01:59:04",
                  "create_user_id": 1000,
                  "create_user_id_expand": {
                    "birth_date": null,
                    "business_email": null,
                    "business_fax": null,
                    "business_phone": null,
                    "cell_phone": null,
                    "first_name": "Admin",
                    "gender": null,
                    "group_id": 2426,
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
                    "photo_url": "api/v1/members/1000/photo?v=197642.1",
                    "time_zone": -1,
                    "title": null,
                    "type": 0,
                    "type_name": "User"
                  },
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
                  "id": 1563770,
                  "mime_type": "text/plain",
                  "modify_date": "2017-03-22T00:38:06",
                  "modify_user_id": 1000,
                  "name": "multibyte.txt",
                  "name_multilingual": {
                    "en": "multibyte.txt"
                  },
                  "owner_group_id": 1001,
                  "owner_user_id": 1000,
                  "owner_user_id_expand": {
                    "birth_date": null,
                    "business_email": null,
                    "business_fax": null,
                    "business_phone": null,
                    "cell_phone": null,
                    "first_name": "Admin",
                    "gender": null,
                    "group_id": 2426,
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
                    "photo_url": "api/v1/members/1000/photo?v=197642.1",
                    "time_zone": -1,
                    "title": null,
                    "type": 0,
                    "type_name": "User"
                  },
                  "parent_id": 914014,
                  "reserved": false,
                  "reserved_date": null,
                  "reserved_user_id": 0,
                  "short_summary": [
                    "Човекът е толкова пъти човек, колкото езика знае 地不怕，只怕广东人说普通话。  天唔驚，地唔驚，只驚北方人講廣東話唔正。"
                  ],
                  "size": 2700,
                  "size_formatted": "3 KB",
                  "summary": [
                    "Човекът е толкова пъти човек, колкото езика знае 地不怕，只怕广东人说普通话。  天唔驚，地唔驚，只驚北方人講廣東話唔正。"
                  ],
                  "type": 144,
                  "type_name": "Document",
                  "versions_control_advanced": false,
                  "volume_id": -2000
                },
                "versions": {
                  "create_date": "2016-08-05T01:59:04",
                  "description": null,
                  "file_create_date": "2016-08-05T01:59:04",
                  "file_modify_date": "2016-08-05T01:59:04",
                  "file_name": "multibyte.txt",
                  "file_size": 2700,
                  "file_type": "txt",
                  "id": 1563770,
                  "locked": false,
                  "locked_date": null,
                  "locked_user_id": null,
                  "mime_type": "text/plain",
                  "modify_date": "2016-08-05T01:59:04",
                  "name": "multibyte.txt",
                  "owner_id": 1000,
                  "provider_id": 1563770,
                  "version_id": 1563770,
                  "version_number": 1,
                  "version_number_major": 0,
                  "version_number_minor": 1,
                  "version_number_name": "1"
                }
              },
              "links": {
                "ancestors": [
                  {
                    "href": "api/v1/nodes/2000",
                    "name": "Enterprise Workspace"
                  },
                  {
                    "href": "api/v1/nodes/604999",
                    "name": "007 Hyderabad"
                  },
                  {
                    "href": "api/v1/nodes/913574",
                    "name": "00 Navya Test folder"
                  },
                  {
                    "href": "api/v1/nodes/914014",
                    "name": "All-fileTypes"
                  }
                ],
                "ancestors_nodes": [
                  {
                    "href": "api/v1/nodes/2000/nodes",
                    "name": "Enterprise Workspace"
                  },
                  {
                    "href": "api/v1/nodes/604999/nodes",
                    "name": "007 Hyderabad"
                  },
                  {
                    "href": "api/v1/nodes/913574/nodes",
                    "name": "00 Navya Test folder"
                  },
                  {
                    "href": "api/v1/nodes/914014/nodes",
                    "name": "All-fileTypes"
                  }
                ],
                "parent": {
                  "href": "api/v1/nodes/914014",
                  "name": "All-fileTypes"
                },
                "parent_nodes": {
                  "href": "api/v1/nodes/914014/nodes",
                  "name": "All-fileTypes"
                }
              },
              "search_result_metadata": {
                "current_version": true,
                "object_href": null,
                "object_id": "DataId=1563770&Version=1",
                "result_type": "264",
                "source_id": "4031392",
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
                    "href": "/api/v2/nodes/1563760/categories",
                    "method": "POST",
                    "name": "Add Category"
                  },
                  "addversion": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/1563760/versions",
                    "method": "POST",
                    "name": "Add Version"
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
                    "form_href": "/api/v2/forms/nodes/copy?id=1563760",
                    "href": "/api/v2/nodes",
                    "method": "POST",
                    "name": "Copy"
                  },
                  "delete": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/1563760",
                    "method": "DELETE",
                    "name": "Delete"
                  },
                  "download": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/1563760/content?download",
                    "method": "GET",
                    "name": "Download"
                  },
                  "edit": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "func=Edit.Edit&nodeid=1563760&VerNum=1",
                    "method": "GET",
                    "name": "Edit"
                  },
                  "move": {
                    "body": "",
                    "content_type": "",
                    "form_href": "/api/v2/forms/nodes/move?id=1563760",
                    "href": "/api/v2/nodes/1563760",
                    "method": "PUT",
                    "name": "Move"
                  },
                  "open": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/1563760/content",
                    "method": "GET",
                    "name": "Open"
                  },
                  "properties": {
                    "body": "",
                    "content_type": "",
                    "form_href": "",
                    "href": "/api/v2/nodes/1563760",
                    "method": "GET",
                    "name": "Properties"
                  },
                  "rename": {
                    "body": "",
                    "content_type": "",
                    "form_href": "/api/v2/forms/nodes/rename?id=1563760",
                    "href": "/api/v2/nodes/1563760",
                    "method": "PUT",
                    "name": "Rename"
                  },
                  "reserve": {
                    "body": "reserved_user_id=1000",
                    "content_type": "application/x-www-form-urlencoded",
                    "form_href": "",
                    "href": "/api/v2/nodes/1563760",
                    "method": "PUT",
                    "name": "Reserve"
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
                  "edit",
                  "download",
                  "addversion",
                  "addcategory",
                  "rename",
                  "copy",
                  "move",
                  "reserve",
                  "delete",
                  "comment"
                ]
              },
              "data": {
                "properties": {
                  "container": false,
                  "container_size": 0,
                  "create_date": "2016-08-05T01:58:55",
                  "create_user_id": 1000,
                  "create_user_id_expand": {
                    "birth_date": null,
                    "business_email": null,
                    "business_fax": null,
                    "business_phone": null,
                    "cell_phone": null,
                    "first_name": "Admin",
                    "gender": null,
                    "group_id": 2426,
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
                    "photo_url": "api/v1/members/1000/photo?v=197642.1",
                    "time_zone": -1,
                    "title": null,
                    "type": 0,
                    "type_name": "User"
                  },
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
                  "id": 1563760,
                  "mime_type": "application/octet-stream",
                  "modify_date": "2017-03-22T00:38:06",
                  "modify_user_id": 1000,
                  "name": "alt-rt.jar",
                  "name_multilingual": {
                    "en": "alt-rt.jar"
                  },
                  "owner_group_id": 1001,
                  "owner_user_id": 1000,
                  "owner_user_id_expand": {
                    "birth_date": null,
                    "business_email": null,
                    "business_fax": null,
                    "business_phone": null,
                    "cell_phone": null,
                    "first_name": "Admin",
                    "gender": null,
                    "group_id": 2426,
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
                    "photo_url": "api/v1/members/1000/photo?v=197642.1",
                    "time_zone": -1,
                    "title": null,
                    "type": 0,
                    "type_name": "User"
                  },
                  "parent_id": 914014,
                  "reserved": false,
                  "reserved_date": null,
                  "reserved_user_id": 0,
                  "short_summary": [
                    "ZIP META-INF MANIFEST.MF java math BigDecimal java math BigDecimal LongOverflow.class"
                  ],
                  "size": 123459,
                  "size_formatted": "121 KB",
                  "summary": [
                    "ZIP META-INF MANIFEST.MF java math BigDecimal java math BigDecimal LongOverflow.class"
                  ],
                  "type": 144,
                  "type_name": "Document",
                  "versions_control_advanced": false,
                  "volume_id": -2000
                },
                "versions": {
                  "create_date": "2016-08-05T01:58:55",
                  "description": null,
                  "file_create_date": "2016-08-05T01:58:55",
                  "file_modify_date": "2016-08-05T01:58:55",
                  "file_name": "alt-rt.jar",
                  "file_size": 123459,
                  "file_type": "jar",
                  "id": 1563760,
                  "locked": false,
                  "locked_date": null,
                  "locked_user_id": null,
                  "mime_type": "application/octet-stream",
                  "modify_date": "2016-08-05T01:58:55",
                  "name": "alt-rt.jar",
                  "owner_id": 1000,
                  "provider_id": 1563760,
                  "version_id": 1563760,
                  "version_number": 1,
                  "version_number_major": 0,
                  "version_number_minor": 1,
                  "version_number_name": "1"
                }
              },
              "links": {
                "ancestors": [
                  {
                    "href": "api/v1/nodes/2000",
                    "name": "Enterprise Workspace"
                  },
                  {
                    "href": "api/v1/nodes/604999",
                    "name": "007 Hyderabad"
                  },
                  {
                    "href": "api/v1/nodes/913574",
                    "name": "00 Navya Test folder"
                  },
                  {
                    "href": "api/v1/nodes/914014",
                    "name": "All-fileTypes"
                  }
                ],
                "ancestors_nodes": [
                  {
                    "href": "api/v1/nodes/2000/nodes",
                    "name": "Enterprise Workspace"
                  },
                  {
                    "href": "api/v1/nodes/604999/nodes",
                    "name": "007 Hyderabad"
                  },
                  {
                    "href": "api/v1/nodes/913574/nodes",
                    "name": "00 Navya Test folder"
                  },
                  {
                    "href": "api/v1/nodes/914014/nodes",
                    "name": "All-fileTypes"
                  }
                ],
                "parent": {
                  "href": "api/v1/nodes/914014",
                  "name": "All-fileTypes"
                },
                "parent_nodes": {
                  "href": "api/v1/nodes/914014/nodes",
                  "name": "All-fileTypes"
                }
              },
              "search_result_metadata": {
                "current_version": true,
                "object_href": null,
                "object_id": "DataId=1563760&Version=1",
                "result_type": "264",
                "source_id": "4031392",
                "version_type": null
              }
            }
          ]
        };


  return {

    enable: function () {

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/searchbar?enterprise_slices=true',
        responseTime: 0,
        responseText: {
            "data": {
              "fields": "actions",
              "options": "{'featured'','highlight_summaries'}",
              "slice": 3479,
              "where": ""
            },
            "options": {
              "fields": {
                "fields": "hidden",
                "options": "hidden",
                "slice": {
                  "label": "Search in:",
                  "optionLabels": ["Enterprise", "Enterprise [All Versions]"],
                  "type": "select"
                }
              },
              "form": {
                "attributes": {
                  "action": "api\/v2\/search",
                  "method": "post"
                },
                "buttons": {
                  "submit": {
                    "title": "Search",
                    "value": "Search"
                  }
                }
              },
              "renderForm": true
            },
            "schema": {
              "properties": {
                "fields": {
                  "type": "string"
                },
                "options": {
                  "type": "string"
                },
                "slice": {
                  "enum": [3479, 3482],
                  "required": true
                },
                "where": {
                  "title": "Search for:",
                  "type": "string"
                }
              }
            }
        }
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/search(?:\\?|\\&)(?:[^=]+)\\=(?:[^&\\s]+)'),
        urlParams: ['where', 'actions', 'limit', 'page', 'expand', 'options'],
        response: function () {
          this.responseText = allData;
        }
      }));

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v1/auth'),
        response: function () {
          this.responseText = allData;
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/members/favorites/tabs?fields=properties&sort=order',
        response: function () {
          this.responseText = {results: []};
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
