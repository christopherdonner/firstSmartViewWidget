/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'require', 'csui/lib/underscore', 'csui/lib/jquery', 'csui/lib/jquery.mockjax'
], function (require, _, $, mockjax) {
  'use strict';

  _.extend($.mockjaxSettings, {
    responseTime: 0,
    headers: {}
  });

  var mocks = [];

  return {
    enable: function() {
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/validation/nodes',
        responseText:{
          "results": [
            {
              "id": null,
              "name": "file1.txt",
              "type": 144,
              "versioned": true
            },
            {
              "id": null,
              "name": "file2.txt",
              "type": 144,
              "versioned": true
            },
            {
              "id": null,
              "name": "file3.txt",
              "type": 144,
              "versioned": true
            }
          ]
        }
      }));
      mocks.push(mockjax({
        url:'//server/otcs/cs/api/v1/forms/nodes/create?parent_id=3880&type=144',
        responseText: {
          "forms": [
            {
              "data": {
                "file": null,
                "name": null,
                "description": "",
                "parent_id": 3880,
                "external_create_date": null,
                "external_modify_date": null,
                "external_source": "",
                "external_identity": "",
                "external_identity_type": "",
                "advanced_versioning": false,
                "type": 144
              },
              "options": {
                "fields": {
                  "file": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "File",
                    "readonly": false,
                    "type": "file"
                  },
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
                  "parent_id": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "label": "Location",
                    "readonly": false,
                    "type": "number"
                  },
                  "external_create_date": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "External Create Date",
                    "readonly": false,
                    "type": "datetime"
                  },
                  "external_modify_date": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "External Modify Date",
                    "readonly": false,
                    "type": "datetime"
                  },
                  "external_source": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "External Source",
                    "readonly": false,
                    "type": "text"
                  },
                  "external_identity": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "External Identity",
                    "readonly": false,
                    "type": "text"
                  },
                  "external_identity_type": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "External Identity Type",
                    "readonly": false,
                    "type": "text"
                  },
                  "advanced_versioning": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Version Control",
                    "optionLabels": [
                      "Standard - linear versioning",
                      "Advanced - major/minor versioning"
                    ],
                    "readonly": false,
                    "type": "radio"
                  },
                  "type": {
                    "hidden": true,
                    "hideInitValidationError": true,
                    "type": "integer"
                  }
                },
                "form": {
                  "attributes": {
                    "action": "api/v1/nodes",
                    "method": "POST"
                  },
                  "renderForm": true
                }
              },
              "schema": {
                "properties": {
                  "file": {
                    "readonly": false,
                    "required": true,
                    "title": "File",
                    "type": "string"
                  },
                  "name": {
                    "maxLength": 248,
                    "minLength": 1,
                    "readonly": false,
                    "required": true,
                    "title": "Name",
                    "type": "string"
                  },
                  "description": {
                    "default": "",
                    "readonly": false,
                    "required": false,
                    "title": "Description",
                    "type": "string"
                  },
                  "parent_id": {
                    "readonly": false,
                    "required": true,
                    "title": "Location",
                    "type": "integer"
                  },
                  "external_create_date": {
                    "readonly": false,
                    "required": false,
                    "title": "External Create Date",
                    "type": "string"
                  },
                  "external_modify_date": {
                    "readonly": false,
                    "required": false,
                    "title": "External Modify Date",
                    "type": "string"
                  },
                  "external_source": {
                    "default": "",
                    "readonly": false,
                    "required": false,
                    "title": "External Source",
                    "type": "string"
                  },
                  "external_identity": {
                    "default": "",
                    "readonly": false,
                    "required": false,
                    "title": "External Identity",
                    "type": "string"
                  },
                  "external_identity_type": {
                    "default": "",
                    "readonly": false,
                    "required": false,
                    "title": "External Identity Type",
                    "type": "string"
                  },
                  "advanced_versioning": {
                    "default": false,
                    "enum": [
                      false,
                      true
                    ],
                    "readonly": false,
                    "required": true,
                    "title": "Version Control",
                    "type": "boolean"
                  },
                  "type": {
                    "required": true,
                    "type": "integer"
                  }
                },
                "type": "object"
              }
            },
            {
              "data": {
                "5066": {
                  "5066_2": null,
                  "5066_1": {
                    "version_number": 1
                  }
                },
                "43994": {
                  "43994_2": null,
                  "43994_1": {
                    "version_number": 1
                  }
                }
              },
              "options": {
                "fields": {
                  "5066": {
                    "fields": {
                      "5066_2": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Name",
                        "readonly": false,
                        "type": "text"
                      },
                      "5066_1": {
                        "hidden": true,
                        "hideInitValidationError": true,
                        "readonly": true,
                        "type": "object"
                      }
                    },
                    "hideInitValidationError": true,
                    "label": "Name",
                    "type": "object"
                  },
                  "43994": {
                    "fields": {
                      "43994_2": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Just Text Field",
                        "readonly": false,
                        "type": "text"
                      },
                      "43994_1": {
                        "hidden": true,
                        "hideInitValidationError": true,
                        "readonly": true,
                        "type": "object"
                      }
                    },
                    "hideInitValidationError": true,
                    "label": "Textfield",
                    "type": "object"
                  }
                }
              },
              "role_name": "categories",
              "schema": {
                "properties": {
                  "5066": {
                    "properties": {
                      "5066_2": {
                        "maxLength": 32,
                        "readonly": false,
                        "required": true,
                        "title": "Name",
                        "type": "string"
                      },
                      "5066_1": {
                        "readonly": true,
                        "required": false,
                        "type": "object"
                      }
                    },
                    "title": "Name",
                    "type": "object"
                  },
                  "43994": {
                    "properties": {
                      "43994_2": {
                        "maxLength": 32,
                        "readonly": false,
                        "required": false,
                        "title": "Just Text Field",
                        "type": "string"
                      },
                      "43994_1": {
                        "readonly": true,
                        "required": false,
                        "type": "object"
                      }
                    },
                    "title": "Textfield",
                    "type": "object"
                  }
                },
                "title": "Categories",
                "type": "object"
              }
            },
            {
              "data": {
                "id": null,
                "name": null,
                "type": null,
                "selectable": null,
                "management_type": null,
                "score": null,
                "inherit_flag": null,
                "classvolumeid": 2054,
                "parent_managed": true
              },
              "options": {
                "fields": {
                  "id": {
                    "fields": {
                      "item": {
                        "type": "number"
                      }
                    },
                    "hidden": false,
                    "hideInitValidationError": true,
                    "items": {
                      "showMoveDownItemButton": false,
                      "showMoveUpItemButton": false
                    },
                    "label": "Classification",
                    "readonly": false,
                    "toolbarSticky": true
                  },
                  "name": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Classification Name",
                    "readonly": false,
                    "type": "text"
                  },
                  "type": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Subtype",
                    "readonly": false,
                    "type": "integer"
                  },
                  "selectable": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Selectable",
                    "readonly": false,
                    "type": "checkbox"
                  },
                  "management_type": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Management Type",
                    "readonly": false,
                    "type": "text"
                  },
                  "score": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Score",
                    "readonly": false,
                    "type": "text"
                  },
                  "inherit_flag": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Inherit",
                    "readonly": false,
                    "type": "checkbox"
                  },
                  "classvolumeid": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Classification Volume ID",
                    "readonly": false,
                    "type": "integer"
                  },
                  "parent_managed": {
                    "hidden": false,
                    "hideInitValidationError": true,
                    "label": "Parent managed",
                    "readonly": false,
                    "type": "checkbox"
                  }
                }
              },
              "role_name": "classifications",
              "schema": {
                "properties": {
                  "id": {
                    "items": {
                      "defaultItems": null,
                      "maxItems": null,
                      "minItems": 1,
                      "type": "integer"
                    },
                    "readonly": false,
                    "required": false,
                    "title": "Classification",
                    "type": "array"
                  },
                  "name": {
                    "readonly": false,
                    "required": false,
                    "title": "Classification Name",
                    "type": "string"
                  },
                  "type": {
                    "readonly": false,
                    "required": false,
                    "title": "Subtype",
                    "type": "integer"
                  },
                  "selectable": {
                    "readonly": false,
                    "required": false,
                    "title": "Selectable",
                    "type": "boolean"
                  },
                  "management_type": {
                    "readonly": false,
                    "required": false,
                    "title": "Management Type",
                    "type": "string"
                  },
                  "score": {
                    "readonly": false,
                    "required": false,
                    "title": "Score",
                    "type": "string"
                  },
                  "inherit_flag": {
                    "readonly": false,
                    "required": false,
                    "title": "Inherit",
                    "type": "boolean"
                  },
                  "classvolumeid": {
                    "readonly": false,
                    "required": false,
                    "title": "Classification Volume ID",
                    "type": "integer"
                  },
                  "parent_managed": {
                    "readonly": false,
                    "required": false,
                    "title": "Parent managed",
                    "type": "boolean"
                  }
                },
                "title": "Classifications",
                "type": "object"
              }
            }
          ]
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
