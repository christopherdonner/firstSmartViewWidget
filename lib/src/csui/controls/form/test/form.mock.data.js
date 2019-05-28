/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(['csui/lib/jquery.mockjax'], function (mockjax) {

  mockjax({
    url: '/api/v1/forms/nodes/properties/general?id=2000',
    responseTime: 0,
    responseText: [
      {
        "forms": [
          {
            "data": {
              "name": "Enterprise",
              "description": "",
              "create_date": "2010-10-20T18:31:01",
              "create_user_id": "Admin",
              "type": 141,
              "type_name": "Enterprise Workspace",
              "modify_date": "2015-03-26T15:45:22",
              "owner_user_id": "Admin"
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
                  "type": "text"
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
                  "type": "text"
                }
              },
              "form": {
                "attributes": {
                  "action": "api/v1/nodes/2000",
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
                  "type": "string"
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
                  "type": "string"
                }
              },
              "type": "object"
            }
          }
        ]
      }
    ]
  });

});
