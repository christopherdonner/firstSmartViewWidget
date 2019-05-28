/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define([
  'csui/lib/jquery.mockjax',
  'json!./assignment.results.json'
], function (mockjax, assignmentResults) {
  'use strict';

  var mocks = [];

  return {

    enable: function () {

      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/processes/([0-9]+)/subprocesses/([0-9]+)/activities'),
        responseText: {'links': {
          'data': {}
        },
          'results': {
            'data': {}
          }
        }

      }));
      mocks.push(mockjax({
            url: '//server/otcs/cs/api/v1/forms/processes/tasks/update?process_id=1&subprocess_id=1&task_id=1',
            responseText: {
              "data": {
                "title": "<Initiator>",
                "instructions": "Hi all,\r\nplease read the the attached project charter documents throughly!\r\nAdd notes if you see necessary than approve it.\r\nOnly reject the proposal if you can see some mayor issue or roadblock.\r\nThanks for your time!",
                "priority": 100,
                "comments_on": true,
                "attachments_on": true,
                "data_packages": [{
                  "type": 1,
                  "sub_type": 1,
                  data: {
                    "attachment_folder_id": 4711
                  }
                }],
                "actions": [{
                  "key": "SendOn",
                  "label": "Send On"
                }],
                "custom_actions": [{
                  "key": "Approve",
                  "label": "Approve"
                }, {
                  "key": "Reject",
                  "label": "Reject"
                }]
              },
              "forms": [
                {
                  "data": {
                    "sub_work_task_title": "<Initiator>",
                    "map_task_instructions": "Hi all,\r\nplease read the the attached project charter documents throughly!\r\nAdd notes if you see necessary than approve it.\r\nOnly reject the proposal if you can see some mayor issue or roadblock.\r\nThanks for your time!",
                    "map_task_priority": 100
                  },
                  "options": {
                    "fields": {
                      "sub_work_task_title": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Title",
                        "readonly": true,
                        "type": "text"
                      },
                      "map_task_instructions": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Instructions",
                        "readonly": true,
                        "type": "textarea"
                      },
                      "map_task_priority": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Priority",
                        "optionLabels": [
                          "Low",
                          "Medium",
                          "High"
                        ],
                        "readonly": false,
                        "type": "select"
                      }
                    }
                  },
                  "schema": {
                    "properties": {
                      "sub_work_task_title": {
                        "maxLength": 255,
                        "minLength": 0,
                        "readonly": true,
                        "required": false,
                        "title": "Title",
                        "type": "string"
                      },
                      "map_task_instructions": {
                        "default": "",
                        "readonly": true,
                        "required": false,
                        "title": "Instructions",
                        "type": "string"
                      },
                      "map_task_priority": {
                        "enum": [
                          0,
                          50,
                          100
                        ],
                        "readonly": false,
                        "required": true,
                        "title": "Priority",
                        "type": "integer"
                      }
                    },
                    "type": "object"
                  }
                }
              ]
            }
          }
      ));
      mocks.push(mockjax({
            url: '//server/otcs/cs/api/v1/forms/processes/tasks/update?process_id=2&subprocess_id=1&task_id=1',
            responseText: {
              "data": {
                "title": "Step 1",
                "instructions": "",
                "priority": 100,
                "comments_on": true,
                "attachments_on": true,
                "data_packages": [{
                  "type": 1,
                  "sub_type": 1,
                  data: {
                    "attachment_folder_id": 4711
                  }
                }],
                "actions": [{
                  "key": "SendOn",
                  "label": "SendOn"
                }],
                "custom_actions": []
              },
              "forms": [
                {
                  "data": {
                    "sub_work_task_title": "Step 1",
                    "map_task_instructions": "",
                    "map_task_priority": 100
                  },
                  "options": {
                    "fields": {
                      "sub_work_task_title": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Title",
                        "readonly": true,
                        "type": "text"
                      },
                      "map_task_instructions": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Instructions",
                        "readonly": true,
                        "type": "textarea"
                      },
                      "map_task_priority": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Priority",
                        "optionLabels": [
                          "Low",
                          "Medium",
                          "High"
                        ],
                        "readonly": false,
                        "type": "select"
                      }
                    }
                  },
                  "schema": {
                    "properties": {
                      "sub_work_task_title": {
                        "maxLength": 255,
                        "minLength": 0,
                        "readonly": true,
                        "required": false,
                        "title": "Title",
                        "type": "string"
                      },
                      "map_task_instructions": {
                        "default": "",
                        "readonly": true,
                        "required": false,
                        "title": "Instructions",
                        "type": "string"
                      },
                      "map_task_priority": {
                        "enum": [
                          0,
                          50,
                          100
                        ],
                        "readonly": false,
                        "required": true,
                        "title": "Priority",
                        "type": "integer"
                      }
                    },
                    "type": "object"
                  }
                }
              ]
            }
          }
      ));
      mocks.push(mockjax({
            url: '//server/otcs/cs/api/v1/forms/processes/tasks/update?process_id=3&subprocess_id=1&task_id=1',
            responseText: {
              "data": {
                "title": "Step 2",
                "instructions": "Step 2 instructions",
                "priority": 100,
                "comments_on": true,
                "attachments_on": true,
                "data_packages": [{
                  "type": 1,
                  "sub_type": 1,
                  data: {
                    "attachment_folder_id": 4711
                  }
                }],
                "actions": [{
                  "key": "SendOn",
                  "label": "SendOn"
                }],
                "custom_actions": []
              },
              "forms": [
                {
                  "Columns": 2,
                  "data": {
                    "form_field1": "Form field 1 data",
                    "form_field2": "Form field 2 data",
                    "form_priority": 100,
                    "form_field3": "Form field 3 data",
                    "form_field4": "Form field 4 data",
                    "form_field5": "Form field 5 data",
                    "form_field6": "Form field 6 data",
                    "form_field7": "Form field 7 data",
                    "form_field8": "Form field 8 data",
                    "form_field9": "Form field 9 data",
                    "form_field10": "Form field 10 data",
                    "form_field11": "Form field 11 data",
                    "form_field12": "Form field 12 data",
                    "form_field13": "Form field 13 data",
                    "form_field14": "Form field 14 data",
                    "form_field15": "Form field 15 data"
                  },
                  "options": {
                    "fields": {
                      "form_field1": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Form field 1",
                        "readonly": true,
                        "type": "text"
                      },
                      "form_field2": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Form field 2",
                        "readonly": true,
                        "type": "textarea"
                      },
                      "form_priority": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Priority",
                        "optionLabels": [
                          "Low",
                          "Medium",
                          "High"
                        ],
                        "readonly": false,
                        "type": "select"
                      },
                      "form_field3": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Form field 3",
                        "readonly": true,
                        "type": "text"
                      },
                      "form_field4": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Form field 4",
                        "readonly": true,
                        "type": "text"
                      },
                      "form_field5": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Form field 5",
                        "readonly": true,
                        "type": "text"
                      },
                      "form_field6": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Form field 6",
                        "readonly": true,
                        "type": "text"
                      },
                      "form_field7": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Form field 7",
                        "readonly": true,
                        "type": "text"
                      },
                      "form_field8": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Form field 8",
                        "readonly": true,
                        "type": "text"
                      },
                      "form_field9": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Form field 9",
                        "readonly": true,
                        "type": "text"
                      },
                      "form_field10": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Form field 10",
                        "readonly": true,
                        "type": "text"
                      },
                      "form_field11": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Form field 11",
                        "readonly": true,
                        "type": "text"
                      },
                      "form_field12": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Form field 12",
                        "readonly": true,
                        "type": "text"
                      },
                      "form_field13": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Form field 13",
                        "readonly": true,
                        "type": "text"
                      },
                      "form_field14": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Form field 14",
                        "readonly": true,
                        "type": "text"
                      },
                      "form_field15": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Form field 15",
                        "readonly": true,
                        "type": "text"
                      }
                    }
                  },
                  "schema": {
                    "properties": {
                      "form_field1": {
                        "maxLength": 255,
                        "minLength": 0,
                        "readonly": true,
                        "required": false,
                        "title": "Form field 1",
                        "type": "string"
                      },
                      "form_field2": {
                        "default": "",
                        "readonly": true,
                        "required": false,
                        "title": "Form field 2",
                        "type": "string"
                      },
                      "form_priority": {
                        "enum": [
                          0,
                          50,
                          100
                        ],
                        "readonly": false,
                        "required": true,
                        "title": "Priority",
                        "type": "integer"
                      },
                      "form_field3": {
                        "default": "",
                        "readonly": true,
                        "required": false,
                        "title": "Form field 3",
                        "type": "string"
                      },
                      "form_field4": {
                        "default": "",
                        "readonly": true,
                        "required": false,
                        "title": "Form field 4",
                        "type": "string"
                      },
                      "form_field5": {
                        "default": "",
                        "readonly": true,
                        "required": false,
                        "title": "Form field 5",
                        "type": "string"
                      },
                      "form_field6": {
                        "default": "",
                        "readonly": true,
                        "required": false,
                        "title": "Form field 6",
                        "type": "string"
                      },
                      "form_field7": {
                        "default": "",
                        "readonly": true,
                        "required": false,
                        "title": "Form field 7",
                        "type": "string"
                      },
                      "form_field8": {
                        "default": "",
                        "readonly": true,
                        "required": false,
                        "title": "Form field 8",
                        "type": "string"
                      },
                      "form_field9": {
                        "default": "",
                        "readonly": true,
                        "required": false,
                        "title": "Form field 9",
                        "type": "string"
                      },
                      "form_field10": {
                        "default": "",
                        "readonly": true,
                        "required": false,
                        "title": "Form field 10",
                        "type": "string"
                      },
                      "form_field11": {
                        "default": "",
                        "readonly": true,
                        "required": false,
                        "title": "Form field 11",
                        "type": "string"
                      },
                      "form_field12": {
                        "default": "",
                        "readonly": true,
                        "required": false,
                        "title": "Form field 12",
                        "type": "string"
                      },
                      "form_field13": {
                        "default": "",
                        "readonly": true,
                        "required": false,
                        "title": "Form field 13",
                        "type": "string"
                      },
                      "form_field14": {
                        "default": "",
                        "readonly": true,
                        "required": false,
                        "title": "Form field 14",
                        "type": "string"
                      },
                      "form_field15": {
                        "default": "",
                        "readonly": true,
                        "required": false,
                        "title": "Form field 15",
                        "type": "string"
                      }
                    },
                    "type": "object"
                  }
                },
                {
                  "Columns": 1,
                  "data": {
                    "sub_work_task_title": "Step 1",
                    "map_task_instructions": "",
                    "map_task_priority": 100,
                    "form_field1": "Form field 1 data",
                    "form_field2": "Form field 2 data"
                  },
                  "options": {
                    "fields": {
                      "sub_work_task_title": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Title",
                        "readonly": true,
                        "type": "text"
                      },
                      "map_task_instructions": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Instructions",
                        "readonly": true,
                        "type": "textarea"
                      },
                      "map_task_priority": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Priority",
                        "optionLabels": [
                          "Low",
                          "Medium",
                          "High"
                        ],
                        "readonly": false,
                        "type": "select"
                      },
                      "form_field1": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Form field 1",
                        "readonly": false,
                        "type": "text"
                      },
                      "form_field2": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Form field 2",
                        "readonly": true,
                        "type": "textarea"
                      }
                    },
                    "form": {
                      "attributes": {
                        "action": "api/v1/processes/3/subprocesses/1/tasks/1",
                        "method": "PUT"
                      }
                    }
                  },
                  "schema": {
                    "properties": {
                      "sub_work_task_title": {
                        "maxLength": 255,
                        "minLength": 0,
                        "readonly": true,
                        "required": false,
                        "title": "Title",
                        "type": "string"
                      },
                      "map_task_instructions": {
                        "default": "",
                        "readonly": true,
                        "required": false,
                        "title": "Instructions",
                        "type": "string"
                      },
                      "map_task_priority": {
                        "enum": [
                          0,
                          50,
                          100
                        ],
                        "readonly": false,
                        "required": true,
                        "title": "Priority",
                        "type": "integer"
                      },
                      "form_field1": {
                        "maxLength": 255,
                        "minLength": 0,
                        "readonly": false,
                        "required": true,
                        "title": "Form field 1",
                        "type": "string"
                      },
                      "form_field2": {
                        "default": "",
                        "readonly": true,
                        "required": false,
                        "title": "Form field 2",
                        "type": "string"
                      }
                    },
                    "type": "object"
                  }
                }
              ]
            }
          }
      ));
      mocks.push(mockjax({
            url: '//server/otcs/cs/api/v1/forms/processes/tasks/update?process_id=4&subprocess_id=1&task_id=1',
            responseText: {
              "data": {
                "title": "<Initiator>",
                "instructions": "Hi all,\r\nplease read the the attached project charter documents throughly!\r\nAdd notes if you see necessary than approve it.\r\nOnly reject the proposal if you can see some mayor issue or roadblock.\r\nThanks for your time!",
                "priority": 100,
                "actions": [],
                "custom_actions": []
              },
              "forms": []
            }
          }
      ));
      mocks.push(mockjax({
            url: '//server/otcs/cs/api/v1/forms/processes/tasks/update?process_id=5&subprocess_id=1&task_id=1',
            responseText: {
              "data": {
                "title": "Step 2",
                "instructions": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vestibulum, lectus at semper pharetra, enim ligula vestibulum velit, vitae volutpat eros lorem et erat. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Cras finibus porttitor dolor, sit amet facilisis odio malesuada ac. Donec tincidunt aliquet dapibus. Nullam ullamcorper congue tincidunt. Morbi nec purus non diam fringilla vulputate vitae efficitur felis. In hac habitasse platea dictumst. Aliquam sed dictum tellus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.\n" +
                                "\n" +
                                "Quisque vitae libero eget turpis tincidunt gravida quis id sapien. Interdum et malesuada fames ac ante ipsum primis in faucibus. Pellentesque id egestas diam, ut vehicula ligula. Pellentesque et sagittis urna. Phasellus quis diam felis. Ut id nisi et massa iaculis lobortis a vitae ipsum. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.\n" +
                                "\n" +
                                "Aenean ornare faucibus purus id viverra. Vestibulum convallis ligula eu arcu auctor sollicitudin. Nam hendrerit ultrices lorem et suscipit. Sed dapibus viverra elit a accumsan. Nam nec consequat nisl, a vestibulum dolor. Nam eu eros lacus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed eget augue posuere arcu cursus lobortis id eget nulla. Nulla facilisi. Phasellus malesuada enim massa, nec scelerisque odio lobortis ut. Maecenas auctor felis ac leo sollicitudin placerat. Quisque nec viverra leo. Suspendisse potenti. Fusce porttitor lorem massa, elementum varius nisl aliquet eget.\n" +
                                "\n" +
                                "Sed sit amet risus nec libero sagittis posuere. Etiam tempor lectus arcu, sed euismod tortor semper convallis. Duis eleifend quam sed mi convallis vulputate. Donec vestibulum diam sem, at maximus ligula ornare eget. Sed pharetra consectetur ultricies. Integer ornare lorem quis justo aliquam convallis. Vestibulum viverra felis mauris, posuere suscipit ipsum imperdiet sit amet. Nam iaculis nibh ac purus congue tincidunt. Suspendisse leo metus, malesuada non lectus quis, tristique semper urna. Praesent vel rutrum eros. Aliquam erat volutpat. Ut cursus nunc ac porttitor convallis.\n" +
                                "\n" +
                                "Nunc et lorem egestas, facilisis ante vitae, aliquam urna. Mauris odio libero, porttitor eget massa eu, vestibulum ultrices odio. Donec mollis at nunc iaculis aliquam. Vestibulum quis nisi lorem. Aenean rhoncus eros a porta laoreet. Vestibulum iaculis tortor dolor, et varius ex pretium sit amet. Aliquam condimentum gravida nulla, sed ornare est pharetra ac. Nullam convallis odio sed sem dictum vehicula. Cras finibus cursus gravida. In lacinia ligula efficitur mauris venenatis, vitae euismod dui egestas. Aenean vel ipsum et neque aliquet egestas eu eget nibh. Donec sodales, justo eget ullamcorper lacinia, est mi finibus sapien, nec ultrices elit ligula vel nulla. Interdum et malesuada fames ac ante ipsum primis in faucibus. Etiam vitae aliquet arcu. Nulla congue ullamcorper nisi ac molestie. Donec nisl quam, facilisis sit amet ornare eget, varius ut velit.\n",
                "priority": 100,
                "comments_on": true,
                "attachments_on": true,
                "data_packages": [{
                  "type": 1,
                  "sub_type": 1,
                  data: {
                    "attachment_folder_id": 4711
                  }
                }],
                "actions": [{
                  "key": "SendOn",
                  "label": "SendOn"
                }],
                "custom_actions": []
              },
              "forms": [
                {
                  "data": {
                    "form_field1": "Form field 1 data",
                    "form_field2": "Form field 2 data",
                    "form_priority": 100,
                    "form_field3": "Form field 3 data",
                    "form_field4": "Form field 4 data",
                    "form_field5": "Form field 5 data",
                    "form_field6": "Form field 6 data",
                    "form_field7": "Form field 7 data",
                    "form_field8": "Form field 8 data",
                    "form_field9": "Form field 9 data",
                    "form_field10": "Form field 10 data"
                  },
                  "options": {
                    "fields": {
                      "form_field1": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Form field 1",
                        "readonly": true,
                        "type": "text"
                      },
                      "form_field2": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Form field 2",
                        "readonly": true,
                        "type": "textarea"
                      },
                      "form_priority": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Priority",
                        "optionLabels": [
                          "Low",
                          "Medium",
                          "High"
                        ],
                        "readonly": false,
                        "type": "select"
                      },
                      "form_field3": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Form field 3",
                        "readonly": true,
                        "type": "text"
                      },
                      "form_field4": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Form field 4",
                        "readonly": true,
                        "type": "text"
                      },
                      "form_field5": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Form field 5",
                        "readonly": true,
                        "type": "text"
                      },
                      "form_field6": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Form field 6",
                        "readonly": true,
                        "type": "text"
                      },
                      "form_field7": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Form field 7",
                        "readonly": true,
                        "type": "text"
                      },
                      "form_field8": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Form field 8",
                        "readonly": true,
                        "type": "text"
                      },
                      "form_field9": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Form field 9",
                        "readonly": true,
                        "type": "text"
                      },
                      "form_field10": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Form field 10",
                        "readonly": true,
                        "type": "text"
                      }
                    }
                  },
                  "schema": {
                    "properties": {
                      "form_field1": {
                        "maxLength": 255,
                        "minLength": 0,
                        "readonly": true,
                        "required": false,
                        "title": "Form field 1",
                        "type": "string"
                      },
                      "form_field2": {
                        "default": "",
                        "readonly": true,
                        "required": false,
                        "title": "Form field 2",
                        "type": "string"
                      },
                      "form_priority": {
                        "enum": [
                          0,
                          50,
                          100
                        ],
                        "readonly": false,
                        "required": true,
                        "title": "Priority",
                        "type": "integer"
                      },
                      "form_field3": {
                        "default": "",
                        "readonly": true,
                        "required": false,
                        "title": "Form field 3",
                        "type": "string"
                      },
                      "form_field4": {
                        "default": "",
                        "readonly": true,
                        "required": false,
                        "title": "Form field 4",
                        "type": "string"
                      },
                      "form_field5": {
                        "default": "",
                        "readonly": true,
                        "required": false,
                        "title": "Form field 5",
                        "type": "string"
                      },
                      "form_field6": {
                        "default": "",
                        "readonly": true,
                        "required": false,
                        "title": "Form field 6",
                        "type": "string"
                      },
                      "form_field7": {
                        "default": "",
                        "readonly": true,
                        "required": false,
                        "title": "Form field 7",
                        "type": "string"
                      },
                      "form_field8": {
                        "default": "",
                        "readonly": true,
                        "required": false,
                        "title": "Form field 8",
                        "type": "string"
                      },
                      "form_field9": {
                        "default": "",
                        "readonly": true,
                        "required": false,
                        "title": "Form field 9",
                        "type": "string"
                      },
                      "form_field10": {
                        "default": "",
                        "readonly": true,
                        "required": false,
                        "title": "Form field 10",
                        "type": "string"
                      }
                    },
                    "type": "object"
                  }
                },
                {
                  "data": {
                    "sub_work_task_title": "Step 1",
                    "map_task_instructions": "",
                    "map_task_priority": 100
                  },
                  "options": {
                    "fields": {
                      "sub_work_task_title": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Title",
                        "readonly": true,
                        "type": "text"
                      },
                      "map_task_instructions": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Instructions",
                        "readonly": true,
                        "type": "textarea"
                      },
                      "map_task_priority": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Priority",
                        "optionLabels": [
                          "Low",
                          "Medium",
                          "High"
                        ],
                        "readonly": false,
                        "type": "select"
                      }
                    }
                  },
                  "schema": {
                    "properties": {
                      "sub_work_task_title": {
                        "maxLength": 255,
                        "minLength": 0,
                        "readonly": true,
                        "required": false,
                        "title": "Title",
                        "type": "string"
                      },
                      "map_task_instructions": {
                        "default": "",
                        "readonly": true,
                        "required": false,
                        "title": "Instructions",
                        "type": "string"
                      },
                      "map_task_priority": {
                        "enum": [
                          0,
                          50,
                          100
                        ],
                        "readonly": false,
                        "required": true,
                        "title": "Priority",
                        "type": "integer"
                      }
                    },
                    "type": "object"
                  }
                }
              ]
            }
          }
      ));
      mocks.push(mockjax({
            url: '//server/otcs/cs/api/v1/forms/processes/tasks/update?process_id=6&subprocess_id=1&task_id=1',
            responseText: {
              "data": {
                "title": "<Initiator>",
                "instructions": "Hi all,\r\nplease read the the attached project charter documents throughly!\r\nAdd notes if you see necessary than approve it.\r\nOnly reject the proposal if you can see some mayor issue or roadblock.\r\nThanks for your time!",
                "priority": 100,
                "comments_on": true,
                "attachments_on": true,
                "data_packages": [{
                  "type": 1,
                  "sub_type": 1,
                  data: {
                    "attachment_folder_id": 9999
                  }
                }],
                "actions": [],
                "custom_actions": []
              },
              "forms": []
            }
          }
      ));
      mocks.push(mockjax({
            url: '//server/otcs/cs/api/v1/forms/processes/tasks/update?process_id=7&subprocess_id=1&task_id=1',
            responseText: {
              "data": {
                "title": "<Initiator>",
                "instructions": "Hi all,\r\nplease read the the attached project charter documents throughly!\r\nAdd notes if you see necessary than approve it.\r\nOnly reject the proposal if you can see some mayor issue or roadblock.\r\nThanks for your time!",
                "priority": 100,
                "comments_on": true,
                "attachments_on": true,
                "data_packages": [{
                  "type": 1,
                  "sub_type": 1,
                  data: {
                    "attachment_folder_id": 4711
                  }
                }],
                "actions": [{
                  "key": "SendOn",
                  "label": "Send On"
                }],
                "custom_actions": [{
                  "key": "Approve",
                  "label": "Approve"
                }, {
                  "key": "Reject",
                  "label": "Reject"
                }],
                "message": {
                  "performer": 1002,
                  "text": "Please work on this task!",
                  "type": "delegate"
                }
              },
              "forms": [
                {
                  "data": {
                    "sub_work_task_title": "<Initiator>",
                    "map_task_instructions": "Hi all,\r\nplease read the the attached project charter documents throughly!\r\nAdd notes if you see necessary than approve it.\r\nOnly reject the proposal if you can see some mayor issue or roadblock.\r\nThanks for your time!",
                    "map_task_priority": 100
                  },
                  "options": {
                    "fields": {
                      "sub_work_task_title": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Title",
                        "readonly": true,
                        "type": "text"
                      },
                      "map_task_instructions": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Instructions",
                        "readonly": true,
                        "type": "textarea"
                      },
                      "map_task_priority": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Priority",
                        "optionLabels": [
                          "Low",
                          "Medium",
                          "High"
                        ],
                        "readonly": false,
                        "type": "select"
                      }
                    }
                  },
                  "schema": {
                    "properties": {
                      "sub_work_task_title": {
                        "maxLength": 255,
                        "minLength": 0,
                        "readonly": true,
                        "required": false,
                        "title": "Title",
                        "type": "string"
                      },
                      "map_task_instructions": {
                        "default": "",
                        "readonly": true,
                        "required": false,
                        "title": "Instructions",
                        "type": "string"
                      },
                      "map_task_priority": {
                        "enum": [
                          0,
                          50,
                          100
                        ],
                        "readonly": false,
                        "required": true,
                        "title": "Priority",
                        "type": "integer"
                      }
                    },
                    "type": "object"
                  }
                }
              ]
            }
          }
      ));
      mocks.push(mockjax({
            url: '//server/otcs/cs/api/v1/forms/processes/tasks/update?process_id=8&subprocess_id=1&task_id=1',
            responseText: {
              "data": {
                "title": "Step 2",
                "instructions": "Step 2 instructions",
                "priority": 100,
                "comments_on": true,
                "attachments_on": true,
                "data_packages": [{
                  "type": 1,
                  "sub_type": 1,
                  data: {
                    "attachment_folder_id": 4711
                  }
                }],
                "actions": [{
                  "key": "SendOn",
                  "label": "SendOn"
                }],
                "custom_actions": []
              },
              "forms": [
                {
                  "Columns": 1,
                  "data": {
                    "sub_work_task_title": "Step 1",
                    "map_task_instructions": "",
                    "map_task_priority": 100,
                    "form_field1": "",
                    "form_field2": ""
                  },
                  "options": {
                    "fields": {
                      "sub_work_task_title": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Title",
                        "readonly": true,
                        "type": "text"
                      },
                      "map_task_instructions": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Instructions",
                        "readonly": true,
                        "type": "textarea"
                      },
                      "map_task_priority": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Priority",
                        "optionLabels": [
                          "Low",
                          "Medium",
                          "High"
                        ],
                        "readonly": false,
                        "type": "select"
                      },
                      "form_field1": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Form field 1",
                        "readonly": false,
                        "type": "item_reference_picker",
                        "type_control": {
                          "action": "",
                          "name": "Form field 1 data",
                          "method": "",
                          "parameters": {
                            "select_types": [],
                            "parent": 2000
                          }
                        }
                      },
                      "form_field2": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Form field 2",
                        "readonly": true,
                        "type": "textarea"
                      }
                    },
                    "form": {
                      "attributes": {
                        "action": "api/v1/processes/3/subprocesses/1/tasks/1",
                        "method": "PUT"
                      }
                    }
                  },
                  "schema": {
                    "properties": {
                      "sub_work_task_title": {
                        "maxLength": 255,
                        "minLength": 0,
                        "readonly": true,
                        "required": false,
                        "title": "Title",
                        "type": "string"
                      },
                      "map_task_instructions": {
                        "default": "",
                        "readonly": true,
                        "required": false,
                        "title": "Instructions",
                        "type": "string"
                      },
                      "map_task_priority": {
                        "enum": [
                          0,
                          50,
                          100
                        ],
                        "readonly": false,
                        "required": true,
                        "title": "Priority",
                        "type": "integer"
                      },
                      "form_field1": {
                        "maxLength": 255,
                        "minLength": 0,
                        "readonly": false,
                        "required": true,
                        "title": "Form field 1",
                        "type": "integer"
                      },
                      "form_field2": {
                        "default": "",
                        "readonly": true,
                        "required": false,
                        "title": "Form field 2",
                        "type": "string"
                      }
                    },
                    "type": "object"
                  }
                }
              ]
            }
          }
      ));
      mocks.push(mockjax({
            url: '//server/otcs/cs/api/v1/forms/processes/tasks/update?process_id=9&subprocess_id=1&task_id=1',
            responseText: {
              "data": {
                "title": "<Initiator>",
                "instructions": "Hi all,\r\nplease read the the attached project charter documents throughly!\r\nAdd notes if you see necessary than approve it.\r\nOnly reject the proposal if you can see some mayor issue or roadblock.\r\nThanks for your time!",
                "priority": 100,
                "comments_on": true,
                "attachments_on": true,
                "data_packages": [{
                  "type": 1,
                  "sub_type": 1,
                  data: {
                    "attachment_folder_id": 4711
                  }
                },
                  {
                    "data": {
                    },
                    "sub_type": 1,
                    "type": 101
                  }],
                "actions": [{
                  "key": "SendOn",
                  "label": "Send On"
                }],
                "custom_actions": [{
                  "key": "Approve",
                  "label": "Approve"
                }, {
                  "key": "Reject",
                  "label": "Reject"
                }],
              "task": {
                "type":1000,
                "sub_type":1004
              },
              "authentication":true
              },
              "forms": [
                {
                  "data": {
                    "sub_work_task_title": "<Initiator>",
                    "map_task_instructions": "Hi all,\r\nplease read the the attached project charter documents throughly!\r\nAdd notes if you see necessary than approve it.\r\nOnly reject the proposal if you can see some mayor issue or roadblock.\r\nThanks for your time!",
                    "map_task_priority": 100
                  },
                  "options": {
                    "fields": {
                      "sub_work_task_title": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Title",
                        "readonly": true,
                        "type": "text"
                      },
                      "map_task_instructions": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Instructions",
                        "readonly": true,
                        "type": "textarea"
                      },
                      "map_task_priority": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Priority",
                        "optionLabels": [
                          "Low",
                          "Medium",
                          "High"
                        ],
                        "readonly": false,
                        "type": "select"
                      }
                    }
                  },
                  "schema": {
                    "properties": {
                      "sub_work_task_title": {
                        "maxLength": 255,
                        "minLength": 0,
                        "readonly": true,
                        "required": false,
                        "title": "Title",
                        "type": "string"
                      },
                      "map_task_instructions": {
                        "default": "",
                        "readonly": true,
                        "required": false,
                        "title": "Instructions",
                        "type": "string"
                      },
                      "map_task_priority": {
                        "enum": [
                          0,
                          50,
                          100
                        ],
                        "readonly": false,
                        "required": true,
                        "title": "Priority",
                        "type": "integer"
                      }
                    },
                    "type": "object"
                  }
                }
              ]
            }
          }
      ));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/docworkflows?doc_id=301425&parent_id=47111',
        responseText: {
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "\/api\/v2\/docworkflows",
                "method": "GET",
                "name": ""
              }
            }
          }, "results": {data: [{"DataID": 3653, "Name": "Enterprise:smartui"}]}
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/draftprocesses',
        responseText: {
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "\/api\/v2\/draftprocesses",
                "method": "POST",
                "name": ""
              }
            }
          }, "results": {"draftprocess_id": 8242}
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/forms/draftprocesses/update?draftprocess_id=8242',
        responseText: {
          "data": {
            "actions": [{"key": "Initiate", "label": "Start"}],
            "attachments_on": true,
            "comments_on": true,
            "data_packages": [{"data": {"attachment_folder_id": 4288}, "sub_type": 1, "type": 1}],
            "instructions": "",
            "process_id": 8242,
            "title": "Smart ui"
          },
          "forms": [{
            "Columns": null,
            "data": {"WorkflowForm_2": [null]},
            "options": {
              "fields": {
                "WorkflowForm_2": {
                  "fields": {"item": {"type": "text"}},
                  "hidden": false,
                  "hideInitValidationError": true,
                  "items": {"showMoveDownItemButton": false, "showMoveUpItemButton": false},
                  "label": "text field",
                  "readonly": false,
                  "toolbarSticky": true
                }
              },
              "form": {
                "attributes": {"action": "api\/v1\/draftprocesses\/8242", "method": "PUT"},
                "renderForm": true
              },
              "hidden": false,
              "hideInitValidationError": true,
              "label": "Attributes",
              "type": "object"
            },
            "schema": {
              "properties": {
                "WorkflowForm_2": {
                  "items": {
                    "defaultItems": 1,
                    "maxItems": 7,
                    "maxLength": 32,
                    "minItems": 1,
                    "type": "string"
                  }, "readonly": false, "required": false, "title": "text field", "type": "array"
                }
              }, "title": "Attributes", "type": "object"
            }
          }]
        }
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/4288/nodes?extra=false&actions=false&expand=node&limit=30&page=1',
        responseText: {
          "data": [
            {
              "volume_id": {
                container: true,
                container_size: 0,
                create_date: "2016-08-23T10:45:52",
                create_user_id: 1000,
                description: "",
                description_multilingual: {
                  en: ""
                },
                favorite: false,
                guid: null,
                icon: "/imgWF/webwork/folder-circles.gif",
                icon_large: "/imgWF/webwork/folder-circles_large.gif",
                id: 2081,
                modify_date: "2016-08-23T10:45:52",
                modify_user_id: 1000,
                name: "Workflow",
                name_multilingual: {
                  en: "Workflow"
                },
                owner_group_id: 1001,
                owner_user_id: 1000,
                parent_id: -1,
                reserved: false,
                reserved_date: null,
                reserved_user_id: 0,
                type: 161,
                type_name: "Workflow Volume",
                versions_control_advanced: false,
                volume_id: -2022
              },
              "id": 301425,
              "parent_id": {
                container: true,
                container_size: 0,
                create_date: "2016-08-23T10:45:52",
                description: "",
                favorite: false,
                guid: null,
                icon: "/imgWF/webwork/folder-circles.gif",
                icon_large: "/imgWF/webwork/folder-circles_large.gif",
                id: 301421,
                modify_date: "2016-08-23T10:45:52",
                modify_user_id: 1000,
                name: "workflow map-15248",
                owner_group_id: 1001,
                owner_user_id: 1000,
                parent_id: 2022,
                reserved: false,
                reserved_date: null,
                reserved_user_id: 0,
                type: 154,
                type_name: "Workflow Attachments",
                versions_control_advanced: false,
                volume_id: -2022
              },
              "original_id": {
                container: false,
                container_size: 0,
                create_date: "2016-08-23T10:45:52",
                description: "",
                favorite: false,
                guid: null,
                icon: "\/imgWF\/webdoc\/appxml.gif",
                icon_large: "\/imgWF\/webdoc\/appxml_large.gif",
                id: 301426,
                "mime_type": "text\/xml",
                modify_date: "2016-08-23T10:45:52",
                modify_user_id: 1000,
                name: "workflow map-15248",
                owner_group_id: 1001,
                owner_user_id: 1000,
                parent_id: 2022,
                reserved: false,
                reserved_date: null,
                reserved_user_id: 0,
                type: 144,
                type_name: "Document",
                versions_control_advanced: false,
                volume_id: -2022
              },
              "name": "test.jpg",
              "type": 1,
              "description": "Description of test.jpg, save returns an error",
              "create_date": "2016-08-17T13:21:46",
              "modify_date": "2016-08-17T13:21:46",
              "reserved": false,
              "reserved_user_id": 0,
              "reserved_date": null,
              "icon": "\/img_main\/webdoc\/doc.gif",
              "mime_type": "",
              "wnd_owner": 4201,
              "wnd_createdby": 4201,
              "wnd_createdate": "2016-08-17T13:21:54",
              "wnd_modifiedby": 4201,
              "wnd_version": null,
              "wnf_readydate": null,
              "wnd_comments": null,
              "wnf_att_5c6v_2": null,
              "type_name": "Shortcut",
              "container": false,
              "size": 206801,
              "perm_see": true,
              "perm_see_contents": true,
              "perm_modify": true,
              "perm_modify_attributes": true,
              "perm_modify_permissions": true,
              "perm_create": true,
              "perm_delete": true,
              "perm_delete_versions": true,
              "perm_reserve": true,
              "favorite": false,
              "size_formatted": "202 KB",
              "reserved_user_login": null,
              "action_url": "\/v1\/actions\/301423",
              "parent_id_url": "\/v1\/nodes\/301421"
            }
          ],
          "definitions": {
            "create_date": {
              "align": "center",
              "name": "Created",
              "persona": "",
              "type": -7,
              "width_weight": 0
            },
            "description": {
              "align": "left",
              "name": "Description",
              "persona": "",
              "type": -1,
              "width_weight": 100
            },
            "favorite": {
              "align": "center",
              "name": "Favorite",
              "persona": "",
              "type": 5,
              "width_weight": 0
            },
            "icon": {
              "align": "center",
              "name": "Icon",
              "persona": "",
              "type": -1,
              "width_weight": 0
            },
            "id": {
              "align": "left",
              "name": "ID",
              "persona": "node",
              "type": 2,
              "width_weight": 0
            },
            "mime_type": {
              "align": "left",
              "name": "MIME Type",
              "persona": "",
              "type": -1,
              "width_weight": 0
            },
            "modify_date": {
              "align": "left",
              "name": "Modified",
              "persona": "",
              "sort": true,
              "type": -7,
              "width_weight": 0
            },
            "name": {
              "align": "left",
              "name": "Name",
              "persona": "",
              "sort": true,
              "type": -1,
              "width_weight": 100
            },
            "original_id": {
              "align": "left",
              "name": "Original ID",
              "persona": "node",
              "type": 2,
              "width_weight": 0
            },
            "parent_id": {
              "align": "left",
              "name": "Parent ID",
              "persona": "node",
              "type": 2,
              "width_weight": 0
            },
            "reserved": {
              "align": "center",
              "name": "Reserve",
              "persona": "",
              "type": 5,
              "width_weight": 0
            },
            "reserved_date": {
              "align": "center",
              "name": "Reserved",
              "persona": "",
              "type": -7,
              "width_weight": 0
            },
            "reserved_user_id": {
              "align": "center",
              "name": "Reserved By",
              "persona": "member",
              "type": 2,
              "width_weight": 0
            },
            "size": {
              "align": "right",
              "name": "Size",
              "persona": "",
              "sort": true,
              "sort_key": "size",
              "type": 2,
              "width_weight": 0
            },
            "size_formatted": {
              "align": "right",
              "name": "Size",
              "persona": "",
              "sort": true,
              "sort_key": "size",
              "type": 2,
              "width_weight": 0
            },
            "type": {
              "align": "center",
              "name": "Type",
              "persona": "",
              "sort": true,
              "type": 2,
              "width_weight": 0
            },
            "volume_id": {
              "align": "left",
              "name": "VolumeID",
              "persona": "node",
              "type": 2,
              "width_weight": 0
            }
          },
          "definitions_map": {
            "name": [
              "menu"
            ]
          },
          "definitions_order": [
            "type",
            "name",
            "size_formatted",
            "modify_date"
          ],
          "limit": 30,
          "page": 1,
          "page_total": 1,
          "range_max": 2,
          "range_min": 1,
          "sort": "asc_name",
          "total_count": 2,
          "where_facet": [],
          "where_name": "",
          "where_type": []
        }
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/4288/addablenodetypes',
        responseText: {
          "data": {
            "compound_document": "api\/v1\/forms\/nodes\/create?type=136&parent_id=301508",
            "document": "api\/v1\/forms\/nodes\/create?type=144&parent_id=301508",
            "folder": "api\/v1\/forms\/nodes\/create?type=0&parent_id=301508",
            "shortcut": "api\/v1\/forms\/nodes\/create?type=1&parent_id=301508",
            "tasklist": "api\/v1\/forms\/nodes\/create?type=204&parent_id=301508",
            "url": "api\/v1\/forms\/nodes\/create?type=140&parent_id=301508"
          },
          "definitions": {
            "compound_document": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "\/img_main\/webdoc\/cd.gif",
              "method": "GET",
              "name": "Compound Document",
              "parameters": {},
              "tab_href": "",
              "type": 136
            },
            "document": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "\/img_main\/webdoc\/doc.gif",
              "method": "GET",
              "name": "Document",
              "parameters": {},
              "tab_href": "",
              "type": 144
            },
            "folder": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "\/img_main\/webdoc\/folder.gif",
              "method": "GET",
              "name": "Folder",
              "parameters": {},
              "tab_href": "",
              "type": 0
            },
            "shortcut": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "\/img_main\/tinyali.gif",
              "method": "GET",
              "name": "Shortcut",
              "parameters": {},
              "tab_href": "",
              "type": 1
            },
            "tasklist": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "\/img_main\/task\/16tasklist.gif",
              "method": "GET",
              "name": "Task List",
              "parameters": {},
              "tab_href": "",
              "type": 204
            },
            "url": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "\/img_main\/webdoc\/url.gif",
              "method": "GET",
              "name": "URL",
              "parameters": {},
              "tab_href": "",
              "type": 140
            }
          },
          "definitions_map": {},
          "definitions_order": ["compound_document", "document", "folder", "shortcut", "tasklist",
            "url"]
        }
      }));
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/4288?([^/?]+)' + '(\\?.*)?$'),
        responseText: {
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "\/api\/v2\/nodes\/4288?actions",
                "method": "GET",
                "name": ""
              }
            }
          },
          "results": {
            "actions": {
              "data": {
                "audit": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/4288\/audit?limit=1000",
                  "method": "GET",
                  "name": "Audit"
                },
                "makefavorite": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/members\/favorites\/4288",
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
                  "href": "\/api\/v2\/nodes\/301508\/nodes",
                  "method": "GET",
                  "name": "Open"
                },
                "permissions": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "",
                  "method": "",
                  "name": "[RESTIMPL_LABEL.?Permissions?]"
                },
                "properties": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/4288",
                  "method": "GET",
                  "name": "Properties"
                }
              },
              "map": {"default_action": "", "more": ["properties", "audit"]},
              "order": ["open", "makefavorite", "permissions", "more"]
            },
            "data": {
              "columns": [{"data_type": 2, "key": "type", "name": "Type", "sort_key": "x2098"},
                {"data_type": -1, "key": "name", "name": "Name", "sort_key": "x2095"},
                {"data_type": -1, "key": "size_formatted", "name": "Size", "sort_key": "x2096"},
                {"data_type": 401, "key": "modify_date", "name": "Modified", "sort_key": "x2094"}],
              "properties": {
                "container": true,
                "container_size": 9,
                "create_date": "2016-08-18T13:14:15",
                "create_user_id": 4201,
                "description": "",
                "description_multilingual": {"en": ""},
                "favorite": false,
                "id": 4288,
                "mime_type": null,
                "modify_date": "2016-08-22T09:19:58",
                "modify_user_id": 4201,
                "name": "LPAD-50044-LongInstructions-01-301510",
                "name_multilingual": {"en": "LPAD-50044-LongInstructions-01-301510"},
                "owner_group_id": 1001,
                "owner_user_id": 4201,
                "parent_id": 2081,
                "reserved": false,
                "reserved_date": null,
                "reserved_user_id": 0,
                "size": 9,
                "size_formatted": "9 Items",
                "type": 154,
                "type_name": "WorkflowAttachmentsFolder",
                "versions_control_advanced": false,
                "volume_id": -2081
              }
            }
          }
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/docworkflows?doc_id=4194&doc_id=2984&parent_id=23451',
        responseText: {
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "\/api\/v2\/docworkflows",
                "method": "GET",
                "name": ""
              }
            }
          }, "results": {data: [{"DataID": 3654, "Name": "Enterprise:smartui"}] }
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/forms/draftprocesses/update?draftprocess_id=8243',
        responseText: {
          "data": {
            "actions": [{"key": "Initiate", "label": "Start"}],
            "attachments_on": true,
            "comments_on": true,
            "data_packages": [{"data": {"attachment_folder_id": 8287}, "sub_type": 1, "type": 1}],
            "instructions": "",
            "process_id": 8286,
            "title": "Smart ui"
          }
          ,
          "forms": [{
            "Columns": null,
            "data": {"WorkflowForm_2": [null]},
            "options": {
              "fields": {
                "WorkflowForm_2": {
                  "fields": {"item": {"type": "text"}},
                  "hidden": false,
                  "hideInitValidationError": true,
                  "items": {"showMoveDownItemButton": false, "showMoveUpItemButton": false},
                  "label": "text field",
                  "readonly": false,
                  "toolbarSticky": true
                }
              },
              "form": {
                "attributes": {"action": "api\/v1\/draftprocesses\/8286", "method": "PUT"},
                "renderForm": true
              },
              "hidden": false,
              "hideInitValidationError": true,
              "label": "Attributes",
              "type": "object"
            },
            "schema": {
              "properties": {
                "WorkflowForm_2": {
                  "items": {
                    "defaultItems": 1,
                    "maxItems": 7,
                    "maxLength": 32,
                    "minItems": 1,
                    "type": "string"
                  }, "readonly": false, "required": false, "title": "text field", "type": "array"
                }
              }, "title": "Attributes", "type": "object"
            }
          }]
        }
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/8287/nodes?extra=false&actions=false&expand=node&limit=30&page=1',
        responseText: {
          "data": [{
            "volume_id": {
              "container": true,
              "container_size": 193,
              "create_date": "2017-08-17T19:13:34",
              "create_user_id": 1000,
              "description": "",
              "description_multilingual": {"en_IN": ""},
              "external_create_date": null,
              "external_identity": "",
              "external_identity_type": "",
              "external_modify_date": null,
              "external_source": "",
              "favorite": false,
              "guid": null,
              "icon": "\/img\/webwork\/folder-circles.gif",
              "icon_large": "\/img\/webwork\/folder-circles_large.gif",
              "id": 2221,
              "modify_date": "2017-08-18T17:05:30",
              "modify_user_id": 1000,
              "name": "Admin",
              "name_multilingual": {"en_IN": "Admin"},
              "owner_group_id": 1001,
              "owner_user_id": 1000,
              "parent_id": -1,
              "reserved": false,
              "reserved_date": null,
              "reserved_user_id": 0,
              "type": 162,
              "type_name": "Workflows Edit Volume",
              "versions_control_advanced": false,
              "volume_id": -2221
            },
            "id": 8289,
            "parent_id": {
              "container": true,
              "container_size": 2,
              "create_date": "2017-08-17T20:35:45",
              "create_user_id": 1000,
              "description": "",
              "description_multilingual": {"en_IN": ""},
              "external_create_date": null,
              "external_identity": "",
              "external_identity_type": "",
              "external_modify_date": null,
              "external_source": "",
              "favorite": false,
              "guid": null,
              "icon": "\/img\/webwork\/folder-attach.gif",
              "icon_large": "\/img\/webwork\/folder-attach_large.gif",
              "id": 8287,
              "modify_date": "2017-08-18T17:05:31",
              "modify_user_id": 1000,
              "name": "Attachments",
              "name_multilingual": {"en_IN": "Attachments"},
              "owner_group_id": 1001,
              "owner_user_id": 1000,
              "parent_id": 8286,
              "reserved": false,
              "reserved_date": null,
              "reserved_user_id": 0,
              "type": 154,
              "type_name": "Workflow Attachments",
              "versions_control_advanced": false,
              "volume_id": -2221
            },
            "name": "Desert.jpg",
            "type": 1,
            "description": "",
            "create_date": "2017-08-18T17:05:31",
            "modify_date": "2017-08-18T17:05:31",
            "reserved": false,
            "reserved_user_id": 0,
            "reserved_date": null,
            "icon": "\/img\/webdoc\/doc.gif",
            "mime_type": null,
            "original_id": {
              "container": false,
              "container_size": 0,
              "create_date": "2017-08-17T19:20:39",
              "create_user_id": 1000,
              "description": "",
              "description_multilingual": {"en_IN": ""},
              "external_create_date": null,
              "external_identity": "",
              "external_identity_type": "",
              "external_modify_date": null,
              "external_source": "",
              "favorite": false,
              "guid": null,
              "icon": "\/img\/webdoc\/appjpeg.gif",
              "icon_large": "\/img\/webdoc\/appjpeg_large.gif",
              "id": 4194,
              "mime_type": "image\/jpeg",
              "modify_date": "2017-08-17T19:20:39",
              "modify_user_id": 1000,
              "name": "Desert.jpg",
              "name_multilingual": {"en_IN": "Desert.jpg"},
              "owner_group_id": 1001,
              "owner_user_id": 1000,
              "parent_id": 2000,
              "reserved": false,
              "reserved_date": null,
              "reserved_user_id": 0,
              "type": 144,
              "type_name": "Document",
              "versions_control_advanced": false,
              "volume_id": -2000
            },
            "type_name": "Shortcut",
            "container": false,
            "size": null,
            "perm_see": true,
            "perm_see_contents": true,
            "perm_modify": true,
            "perm_modify_attributes": true,
            "perm_modify_permissions": true,
            "perm_create": true,
            "perm_delete": true,
            "perm_delete_versions": true,
            "perm_reserve": true,
            "favorite": false,
            "size_formatted": "",
            "reserved_user_login": null,
            "action_url": "\/v1\/actions\/8289",
            "parent_id_url": "\/v1\/nodes\/8287"
          }, {
            "volume_id": {
              "container": true,
              "container_size": 193,
              "create_date": "2017-08-17T19:13:34",
              "create_user_id": 1000,
              "description": "",
              "description_multilingual": {"en_IN": ""},
              "external_create_date": null,
              "external_identity": "",
              "external_identity_type": "",
              "external_modify_date": null,
              "external_source": "",
              "favorite": false,
              "guid": null,
              "icon": "\/img\/webwork\/folder-circles.gif",
              "icon_large": "\/img\/webwork\/folder-circles_large.gif",
              "id": 2221,
              "modify_date": "2017-08-18T17:05:30",
              "modify_user_id": 1000,
              "name": "Admin",
              "name_multilingual": {"en_IN": "Admin"},
              "owner_group_id": 1001,
              "owner_user_id": 1000,
              "parent_id": -1,
              "reserved": false,
              "reserved_date": null,
              "reserved_user_id": 0,
              "type": 162,
              "type_name": "Workflows Edit Volume",
              "versions_control_advanced": false,
              "volume_id": -2221
            },
            "id": 8290,
            "parent_id": {
              "container": true,
              "container_size": 2,
              "create_date": "2017-08-17T20:35:45",
              "create_user_id": 1000,
              "description": "",
              "description_multilingual": {"en_IN": ""},
              "external_create_date": null,
              "external_identity": "",
              "external_identity_type": "",
              "external_modify_date": null,
              "external_source": "",
              "favorite": false,
              "guid": null,
              "icon": "\/img\/webwork\/folder-attach.gif",
              "icon_large": "\/img\/webwork\/folder-attach_large.gif",
              "id": 8287,
              "modify_date": "2017-08-18T17:05:31",
              "modify_user_id": 1000,
              "name": "Attachments",
              "name_multilingual": {"en_IN": "Attachments"},
              "owner_group_id": 1001,
              "owner_user_id": 1000,
              "parent_id": 8286,
              "reserved": false,
              "reserved_date": null,
              "reserved_user_id": 0,
              "type": 154,
              "type_name": "Workflow Attachments",
              "versions_control_advanced": false,
              "volume_id": -2221
            },
            "name": "Hydrangeas.jpg",
            "type": 1,
            "description": "",
            "create_date": "2017-08-18T17:05:31",
            "modify_date": "2017-08-18T17:05:31",
            "reserved": false,
            "reserved_user_id": 0,
            "reserved_date": null,
            "icon": "\/img\/webdoc\/doc.gif",
            "mime_type": null,
            "original_id": {
              "container": false,
              "container_size": 0,
              "create_date": "2017-08-17T19:20:39",
              "create_user_id": 1000,
              "description": "",
              "description_multilingual": {"en_IN": ""},
              "external_create_date": null,
              "external_identity": "",
              "external_identity_type": "",
              "external_modify_date": null,
              "external_source": "",
              "favorite": false,
              "guid": null,
              "icon": "\/img\/webdoc\/appjpeg.gif",
              "icon_large": "\/img\/webdoc\/appjpeg_large.gif",
              "id": 2984,
              "mime_type": "image\/jpeg",
              "modify_date": "2017-08-17T19:20:39",
              "modify_user_id": 1000,
              "name": "Hydrangeas.jpg",
              "name_multilingual": {"en_IN": "Hydrangeas.jpg"},
              "owner_group_id": 1001,
              "owner_user_id": 1000,
              "parent_id": 2000,
              "reserved": false,
              "reserved_date": null,
              "reserved_user_id": 0,
              "type": 144,
              "type_name": "Document",
              "versions_control_advanced": false,
              "volume_id": -2000
            },
            "type_name": "Shortcut",
            "container": false,
            "size": null,
            "perm_see": true,
            "perm_see_contents": true,
            "perm_modify": true,
            "perm_modify_attributes": true,
            "perm_modify_permissions": true,
            "perm_create": true,
            "perm_delete": true,
            "perm_delete_versions": true,
            "perm_reserve": true,
            "favorite": false,
            "size_formatted": "",
            "reserved_user_login": null,
            "action_url": "\/v1\/actions\/8290",
            "parent_id_url": "\/v1\/nodes\/8287"
          }],
          "definitions": {
            "create_date": {
              "align": "center",
              "name": "Created",
              "persona": "",
              "type": -7,
              "width_weight": 0
            },
            "description": {
              "align": "left",
              "name": "Description",
              "persona": "",
              "type": -1,
              "width_weight": 100
            },
            "favorite": {
              "align": "center",
              "name": "Favorite",
              "persona": "",
              "type": 5,
              "width_weight": 0
            },
            "icon": {
              "align": "center",
              "name": "Icon",
              "persona": "",
              "type": -1,
              "width_weight": 0
            },
            "id": {"align": "left", "name": "ID", "persona": "node", "type": 2, "width_weight": 0},
            "mime_type": {
              "align": "left",
              "name": "MIME Type",
              "persona": "",
              "type": -1,
              "width_weight": 0
            },
            "modify_date": {
              "align": "left",
              "name": "Modified",
              "persona": "",
              "sort": true,
              "type": -7,
              "width_weight": 0
            },
            "name": {
              "align": "left",
              "name": "Name",
              "persona": "",
              "sort": true,
              "type": -1,
              "width_weight": 100
            },
            "original_id": {
              "align": "left",
              "name": "Original ID",
              "persona": "node",
              "type": 2,
              "width_weight": 0
            },
            "parent_id": {
              "align": "left",
              "name": "Parent ID",
              "persona": "node",
              "type": 2,
              "width_weight": 0
            },
            "reserved": {
              "align": "center",
              "name": "Reserve",
              "persona": "",
              "type": 5,
              "width_weight": 0
            },
            "reserved_date": {
              "align": "center",
              "name": "Reserved",
              "persona": "",
              "type": -7,
              "width_weight": 0
            },
            "reserved_user_id": {
              "align": "center",
              "name": "Reserved By",
              "persona": "member",
              "type": 2,
              "width_weight": 0
            },
            "size": {
              "align": "right",
              "name": "Size",
              "persona": "",
              "sort": true,
              "sort_key": "size",
              "type": 2,
              "width_weight": 0
            },
            "size_formatted": {
              "align": "right",
              "name": "Size",
              "persona": "",
              "sort": true,
              "sort_key": "size",
              "type": 2,
              "width_weight": 0
            },
            "type": {
              "align": "center",
              "name": "Type",
              "persona": "",
              "sort": true,
              "type": 2,
              "width_weight": 0
            },
            "volume_id": {
              "align": "left",
              "name": "VolumeID",
              "persona": "node",
              "type": 2,
              "width_weight": 0
            }
          },
          "definitions_map": {"name": ["menu"]},
          "definitions_order": ["type", "name", "size_formatted", "modify_date"],
          "limit": 30,
          "page": 1,
          "page_total": 1,
          "range_max": 2,
          "range_min": 1,
          "sort": "asc_name",
          "total_count": 2,
          "where_facet": [],
          "where_name": "",
          "where_type": []
        }
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/8287/addablenodetypes',
        responseText: {
          "data": {
            "compound_document": "api\/v1\/forms\/nodes\/create?type=136&parent_id=8287",
            "document": "api\/v1\/forms\/nodes\/create?type=144&parent_id=8287",
            "folder": "api\/v1\/forms\/nodes\/create?type=0&parent_id=8287",
            "shortcut": "api\/v1\/forms\/nodes\/create?type=1&parent_id=8287",
            "url": "api\/v1\/forms\/nodes\/create?type=140&parent_id=8287",
            "Wiki": "api\/v1\/forms\/nodes\/create?type=5573&parent_id=8287"
          },
          "definitions": {
            "compound_document": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "\/img\/webdoc\/cd.gif",
              "method": "GET",
              "name": "Compound Document",
              "parameters": {},
              "tab_href": "",
              "type": 136
            },
            "document": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "\/img\/webdoc\/doc.gif",
              "method": "GET",
              "name": "Document",
              "parameters": {},
              "tab_href": "",
              "type": 144
            },
            "folder": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "\/img\/webdoc\/folder.gif",
              "method": "GET",
              "name": "Folder",
              "parameters": {},
              "tab_href": "",
              "type": 0
            },
            "shortcut": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "\/img\/tinyali.gif",
              "method": "GET",
              "name": "Shortcut",
              "parameters": {},
              "tab_href": "",
              "type": 1
            },
            "url": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "\/img\/webdoc\/url.gif",
              "method": "GET",
              "name": "URL",
              "parameters": {},
              "tab_href": "",
              "type": 140
            },
            "Wiki": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "\/img\/wiki\/wiki.gif",
              "method": "GET",
              "name": "Wiki",
              "parameters": {},
              "tab_href": "",
              "type": 5573
            }
          },
          "definitions_map": {},
          "definitions_order": ["compound_document", "document", "folder", "shortcut", "url",
            "Wiki"]
        }
      }));
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/8287?([^/?]+)' + '(\\?.*)?$'),
        responseText: {
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "\/api\/v2\/nodes\/8287?actions=addclassifications&actions=addcategory&actions=addversion&actions=open&actions=copy&actions=delete&actions=download&actions=edit&actions=rename&actions=move&actions=properties&actions=reserve&actions=unreserve&actions=comment&actions=setasdefaultpage&actions=unsetasdefaultpage&actions=initiateworkflow&actions=initiatedocumentworkflow&expand=properties{original_id}&fields=properties",
                "method": "GET",
                "name": ""
              }
            }
          },
          "results": {
            "actions": {
              "data": {
                "addcategory": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/8287\/categories",
                  "method": "POST",
                  "name": "Add Category"
                },
                "open": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/8287\/nodes",
                  "method": "GET",
                  "name": "Open"
                },
                "properties": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/8287",
                  "method": "GET",
                  "name": "Properties"
                }
              },
              "map": {"default_action": "", "more": ["properties"]},
              "order": ["open", "addcategory"]
            },
            "data": {
              "properties": {
                "container": true,
                "container_size": 0,
                "create_date": "2017-08-17T20:35:45",
                "create_user_id": 1000,
                "description": "",
                "description_multilingual": {"en_IN": ""},
                "external_create_date": null,
                "external_identity": "",
                "external_identity_type": "",
                "external_modify_date": null,
                "external_source": "",
                "favorite": false,
                "id": 8287,
                "mime_type": null,
                "modify_date": "2017-08-18T17:05:30",
                "modify_user_id": 1000,
                "name": "Attachments",
                "name_multilingual": {"en_IN": "Attachments"},
                "owner_group_id": 1001,
                "owner_user_id": 1000,
                "parent_id": 8286,
                "reserved": false,
                "reserved_date": null,
                "reserved_user_id": 0,
                "size": 0,
                "size_formatted": "0 Items",
                "type": 154,
                "type_name": "Workflow Attachments",
                "versions_control_advanced": false,
                "volume_id": -2221
              }
            }
          }
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/workflows/status',
        responseText:{
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "/api/v2/workflows/status",
                "method": "POST",
                "name": ""
              }
            }
          },
          "results": {
            "assignee": [
              {
                "firstName": "Candidate",
                "lastName": "One",
                "userId": 54010
              }
            ]
          }
        }
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/workflows/status/widget?selectionType=100&wfretention=30&kind=Both',
        responseText: {
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "\/api\/v2\/workflows\/status\/widget",
                "method": "GET",
                "name": ""
              }
            }
          },
          "results": {
            "count": 1,
            "data": {
              "assignee": [{firstName: "Admin", lastName: "Admin", userId: 1000, groupName: ""}],
              "dateinitiated": "2017-09-11T10:33:35",
              "duedate": "",
              "status": "ontime",
              "stepname": "Joining Form",
              "wfname": "Employee Joining Form"
            }
          }
        }
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/members/7060',
        responseText: {
        "links": {
        "data": {
          "self": {
            "body": "",
                "content_type": "",
                "href": "/api/v2/members/7060",
                "method": "GET",
                "name": ""
          }
        }
      },
        "results": {
        "data": {
          "properties": {
            "birth_date": null,
                "business_email": "alex@ot.com",
                "business_fax": null,
                "business_phone": 546346326272,
                "cell_phone": null,
                "first_name": "Alex",
                "gender": null,
                "group_id": 7391,
                "home_address_1": null,
                "home_address_2": null,
                "home_fax": null,
                "home_phone": null,
                "id": 7060,
                "last_name": "Chaudry",
                "middle_name": null,
                "name": "alex",
                "name_formatted": "alex",
                "office_location": null,
                "pager": null,
                "personal_email": null,
                "personal_interests": null,
                "personal_url_1": null,
                "personal_url_2": null,
                "personal_url_3": null,
                "personal_website": null,
                "photo_url": null,
                "time_zone": -1,
                "title": null,
                "type": 0,
                "type_name": "User"
          }
        }
      }
      }
      }));

      mocks.push(mockjax({
		url: new RegExp('^//server/otcs/cs/api/v2/members/3495919/members?([^/?]+)' + '(\\?.*)?$'),
        responseText: {
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "/api/v2/members/3495919/members",
                "method": "GET",
                "name": ""
              }
            }
          },
          "results": [
            {
              "data": {
                "properties": {
                  "birth_date": null,
                  "business_email": "WilliamBergs@ot.com",
                  "business_fax": null,
                  "business_phone": "9874563214",
                  "cell_phone": null,
                  "deleted": false,
                  "first_name": "Alen",
                  "gender": null,
                  "group_id": 3495919,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 3502501,
                  "last_name": "William",
                  "middle_name": null,
                  "name": "Alen",
                  "name_formatted": "Alen William",
                  "office_location": null,
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_url": null,
                  "time_zone": -1,
                  "title": null,
                  "type": 0,
                  "type_name": "User"
                }
              }
            },
            {
              "data": {
                "properties": {
                  "birth_date": null,
                  "business_email": "dante@ot.com",
                  "business_fax": null,
                  "business_phone": "987456321",
                  "cell_phone": null,
                  "deleted": false,
                  "first_name": "Dante",
                  "gender": null,
                  "group_id": 1001,
                  "home_address_1": null,
                  "home_address_2": null,
                  "home_fax": null,
                  "home_phone": null,
                  "id": 3470750,
                  "last_name": "Carlo",
                  "middle_name": null,
                  "name": "amoljeet",
                  "name_formatted": "Dante Carlo",
                  "office_location": null,
                  "pager": null,
                  "personal_email": null,
                  "personal_interests": null,
                  "personal_url_1": null,
                  "personal_url_2": null,
                  "personal_url_3": null,
                  "personal_website": null,
                  "photo_url": null,
                  "time_zone": -1,
                  "title": "s",
                  "type": 0,
                  "type_name": "User"
                }
              }
            }
          ]
        }
      }));
      mocks.push(mockjax({
            url: '//server/otcs/cs/api/v2/workflows/status?selectionType=100&wfretention=30&kind=Both',
            responseText: {
              "links": {
                "data": {
                  "self": {
                    "body": "",
                    "content_type": "",
                    "href": "\/api\/v2\/workflows\/status",
                    "method": "GET",
                    "name": ""
                  }
                }
              },
              "results": [
                {
                  "data": {
                    "wfstatus": {
                      "assignee": [{"firstName": "Admin", "lastName": "Admin", "userId": 7060, "groupName": ""}],
                      "date_initiated":"2017-11-01T12:44:30",
                      "due_date": "2018-11-01T12:44:30",
                      "status_key": "ontime",
                      "step_name": "step1",
                      "wf_name": "Testing Workflow Status",
                      "process_id": 38504,
                      "subprocess_id": 38504
                    }
                  },
                  "definitions": {
                    "wfstatus": {
                      "assignee": {
                        "allow_undefined": false,
                        "bulk_shared": false,
                        "default_value": null,
                        "description": null,
                        "hidden": false,
                        "key": "assignee",
                        "max_value": null,
                        "min_value": null,
                        "multi_value": false,
                        "name": "Assigned to",
                        "persona": "",
                        "read_only": true,
                        "required": false,
                        "type": 2,
                        "type_name": "Integer",
                        "valid_values": [],
                        "valid_values_name": []
                      },
                      "date_initiated": {
                        "allow_undefined": false,
                        "bulk_shared": false,
                        "default_value": null,
                        "description": null,
                        "hidden": false,
                        "include_time": true,
                        "key": "date_initiated",
                        "multi_value": false,
                        "name": "Start Date",
                        "persona": "",
                        "read_only": true,
                        "required": false,
                        "type": -7,
                        "type_name": "Date",
                        "valid_values": [],
                        "valid_values_name": []
                      },
                      "due_date": {
                        "allow_undefined": false,
                        "bulk_shared": false,
                        "default_value": null,
                        "description": null,
                        "hidden": false,
                        "include_time": true,
                        "key": "due_date",
                        "multi_value": false,
                        "name": "Due Date",
                        "persona": "",
                        "read_only": true,
                        "required": false,
                        "type": -7,
                        "type_name": "Date",
                        "valid_values": [],
                        "valid_values_name": []
                      },
                      "status_key": {
                        "allow_undefined": false,
                        "bulk_shared": false,
                        "default_value": null,
                        "description": null,
                        "hidden": false,
                        "key": "status_key",
                        "max_length": null,
                        "min_length": null,
                        "multi_value": false,
                        "multiline": false,
                        "multilingual": false,
                        "name": "Status",
                        "password": false,
                        "persona": "",
                        "read_only": true,
                        "regex": "",
                        "required": false,
                        "type": -1,
                        "type_name": "String",
                        "valid_values": [],
                        "valid_values_name": []
                      },
                      "step_name": {
                        "allow_undefined": false,
                        "bulk_shared": false,
                        "default_value": null,
                        "description": null,
                        "hidden": false,
                        "key": "step_name",
                        "max_length": null,
                        "min_length": null,
                        "multi_value": false,
                        "multiline": false,
                        "multilingual": true,
                        "name": "Current Step",
                        "password": false,
                        "persona": "",
                        "read_only": true,
                        "regex": "",
                        "required": false,
                        "type": -1,
                        "type_name": "String",
                        "valid_values": [],
                        "valid_values_name": []
                      },
                      "wf_name": {
                        "allow_undefined": false,
                        "bulk_shared": false,
                        "default_value": null,
                        "description": null,
                        "hidden": false,
                        "key": "wf_name",
                        "max_length": null,
                        "min_length": null,
                        "multi_value": false,
                        "multiline": false,
                        "multilingual": true,
                        "name": "Workflow",
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
                    }
                  },
                  "definitions_map": {"wfstatus": {}},
                  "definitions_order": {
                    "wfstatus": ["status_key", "due_date", "wf_name", "step_name", "assignee",
                      "date_initiated"]
                  }
                },
                {
                  "data": {
                    "wfstatus": {
                      "assignee": [{"firstName": "Admin", "lastName": "Admin", "userId": 1000, "groupName": ""}],
                      "date_initiated":"2017-11-01T12:44:30",
                      "due_date": "",
                      "status_key": "completed",
                      "step_name": "step2",
                      "wf_name": "Testing Workflow Status"
                    }
                  },
                  "definitions": {
                    "wfstatus": {
                      "assignee": {
                        "allow_undefined": false,
                        "bulk_shared": false,
                        "default_value": null,
                        "description": null,
                        "hidden": false,
                        "key": "assignee",
                        "max_value": null,
                        "min_value": null,
                        "multi_value": false,
                        "name": "Assigned to",
                        "persona": "",
                        "read_only": true,
                        "required": false,
                        "type": 2,
                        "type_name": "Integer",
                        "valid_values": [],
                        "valid_values_name": []
                      },
                      "date_initiated": {
                        "allow_undefined": false,
                        "bulk_shared": false,
                        "default_value": null,
                        "description": null,
                        "hidden": false,
                        "include_time": true,
                        "key": "date_initiated",
                        "multi_value": false,
                        "name": "Start Date",
                        "persona": "",
                        "read_only": true,
                        "required": false,
                        "type": -7,
                        "type_name": "Date",
                        "valid_values": [],
                        "valid_values_name": []
                      },
                      "due_date": {
                        "allow_undefined": false,
                        "bulk_shared": false,
                        "default_value": null,
                        "description": null,
                        "hidden": false,
                        "include_time": true,
                        "key": "due_date",
                        "multi_value": false,
                        "name": "Due Date",
                        "persona": "",
                        "read_only": true,
                        "required": false,
                        "type": -7,
                        "type_name": "Date",
                        "valid_values": [],
                        "valid_values_name": []
                      },
                      "status_key": {
                        "allow_undefined": false,
                        "bulk_shared": false,
                        "default_value": null,
                        "description": null,
                        "hidden": false,
                        "key": "status_key",
                        "max_length": null,
                        "min_length": null,
                        "multi_value": false,
                        "multiline": false,
                        "multilingual": false,
                        "name": "Status",
                        "password": false,
                        "persona": "",
                        "read_only": true,
                        "regex": "",
                        "required": false,
                        "type": -1,
                        "type_name": "String",
                        "valid_values": [],
                        "valid_values_name": []
                      },
                      "step_name": {
                        "allow_undefined": false,
                        "bulk_shared": false,
                        "default_value": null,
                        "description": null,
                        "hidden": false,
                        "key": "step_name",
                        "max_length": null,
                        "min_length": null,
                        "multi_value": false,
                        "multiline": false,
                        "multilingual": true,
                        "name": "Current Step",
                        "password": false,
                        "persona": "",
                        "read_only": true,
                        "regex": "",
                        "required": false,
                        "type": -1,
                        "type_name": "String",
                        "valid_values": [],
                        "valid_values_name": []
                      },
                      "wf_name": {
                        "allow_undefined": false,
                        "bulk_shared": false,
                        "default_value": null,
                        "description": null,
                        "hidden": false,
                        "key": "wf_name",
                        "max_length": null,
                        "min_length": null,
                        "multi_value": false,
                        "multiline": false,
                        "multilingual": true,
                        "name": "Workflow",
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
                    }
                  },
                  "definitions_map": {"wfstatus": {}},
                  "definitions_order": {
                    "wfstatus": ["status_key", "due_date", "wf_name", "step_name", "assignee",
                      "date_initiated"]
                  }
                }
              ]
            }
          }
      ));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/workflows/status/processes/38504',
        responseText: {
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "\/api\/v2\/workflows\/status\/processes\/38504",
                "method": "GET",
                "name": ""
              }
            }
          },
          "results": {
            "attachments": {"attachment_folder_id": 8287},
            "step_list": {
              "completed": [{
                "task_id": 0,
                "process_id" : 38504,
                "subprocess_id" : 38504,
                "task_name": "Start Step",
                "task_due_date": "2017-12-20T10:27:43",
                "task_start_date": "2017-12-20T10:27:43",
                "task_status": "completed",
                "task_assignees": {"assignee": [{"firstName": "alex", "lastName": "dan", "userId": 7060}]}
              }, {
                "task_id": 1,
                "process_id" : 38504,
                "subprocess_id" : 38504,
                "task_name": "E-Mail",
                "task_due_date": "",
                "task_start_date": "2017-12-20T10:27:43",
                "task_status": "completed",
                "task_assignees": {"assignee": [{"firstName": "Dan", "lastName": "Brown", "userId": 1001}]}
              }],
              "current": [{
                "task_id": 2,
                "process_id" : 38504,
                "subprocess_id" : 38504,
                "task_name": "Current step",
                "task_due_date": "",
                "task_start_date": "2017-12-20T10:27:43",
                "task_status": "ontime",
                "task_assignees": {"assignee": [{"firstName": "alex", "lastName": "dan", "userId": 7060}]}
              }],
              "next" : []
            },
            "wf_details": {
              "initiator": {"firstName": "Admin", "lastName": "Admin", "userId": 7060},
              "date_initiated":"2017-11-01T12:44:30",
              "due_date": "2018-11-01T12:44:30",
              "status": "ontime",
              "wf_name": "Testing Workflow Status"
            }
          }
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/docworkflows?doc_id=38187&parent_id=47888',
        responseText: {
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "\/api\/v2\/docworkflows",
                "method": "GET",
                "name": ""
              }
            }
          },
          "results": {data: [{"DataID": 6762, "Name": "Enterprise:classic"},
            {"DataID": 6667, "Name": "Enterprise:map with  select"}]}
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/forms/draftprocesses/update?draftprocess_id=0',
        responseText: {
          "data": {}
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/forms/draftprocesses/update?draftprocess_id=4711',
        responseText: {
          "data": {}
        }
      }));

      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/forms/draftprocesses/update?draftprocess_id=4712',
        responseText: {
          "data": {}
        }
      }));


      mocks.push(mockjax({
        url: '^//server/otcs/cs/api/v2/nodes/301423?*',
        responseText: {
          "links": {
          },
          "results": {
           }
        }
      }));
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/4711?([^/?]+)' + '(\\?.*)?$'),
        responseText: {
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "\/api\/v2\/nodes\/4711?actions",
                "method": "GET",
                "name": ""
              }
            }
          },
          "results": {
            "actions": {
              "data": {
                "audit": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/4711\/audit?limit=1000",
                  "method": "GET",
                  "name": "Audit"
                },
                "makefavorite": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/members\/favorites\/4711",
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
                  "href": "\/api\/v2\/nodes\/301508\/nodes",
                  "method": "GET",
                  "name": "Open"
                },
                "permissions": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "",
                  "method": "",
                  "name": "[RESTIMPL_LABEL.?Permissions?]"
                },
                "properties": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/4711",
                  "method": "GET",
                  "name": "Properties"
                }
              },
              "map": {"default_action": "", "more": ["properties", "audit"]},
              "order": ["open", "makefavorite", "permissions", "more"]
            },
            "data": {
              "columns": [{"data_type": 2, "key": "type", "name": "Type", "sort_key": "x2098"},
                {"data_type": -1, "key": "name", "name": "Name", "sort_key": "x2095"},
                {"data_type": -1, "key": "size_formatted", "name": "Size", "sort_key": "x2096"},
                {"data_type": 401, "key": "modify_date", "name": "Modified", "sort_key": "x2094"}],
              "properties": {
                "container": true,
                "container_size": 9,
                "create_date": "2016-08-18T13:14:15",
                "create_user_id": 4201,
                "description": "",
                "description_multilingual": {"en": ""},
                "favorite": false,
                "id": 4711,
                "mime_type": null,
                "modify_date": "2016-08-22T09:19:58",
                "modify_user_id": 4201,
                "name": "LPAD-50044-LongInstructions-01-301510",
                "name_multilingual": {"en": "LPAD-50044-LongInstructions-01-301510"},
                "owner_group_id": 1001,
                "owner_user_id": 4201,
                "parent_id": 2081,
                "reserved": false,
                "reserved_date": null,
                "reserved_user_id": 0,
                "size": 9,
                "size_formatted": "9 Items",
                "type": 154,
                "type_name": "WorkflowAttachmentsFolder",
                "versions_control_advanced": false,
                "volume_id": -2081
              }
            }
          }
        }
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/nodes/1704?actions',
        responseText: {
          "links": {
            "data": {
              "self": {
                "body": "",
                "content_type": "",
                "href": "\/api\/v2\/nodes\/1704?actions",
                "method": "GET",
                "name": ""
              }
            }
          },
          "results": {
            "actions": {
              "data": {
                "audit": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/1704\/audit?limit=1000",
                  "method": "GET",
                  "name": "Audit"
                },
                "makefavorite": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/members\/favorites\/1704",
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
                  "href": "\/api\/v2\/nodes\/301508\/nodes",
                  "method": "GET",
                  "name": "Open"
                },
                "permissions": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "",
                  "method": "",
                  "name": "[RESTIMPL_LABEL.?Permissions?]"
                },
                "properties": {
                  "body": "",
                  "content_type": "",
                  "form_href": "",
                  "href": "\/api\/v2\/nodes\/1704",
                  "method": "GET",
                  "name": "Properties"
                }
              },
              "map": {"default_action": "", "more": ["properties", "audit"]},
              "order": ["open", "makefavorite", "permissions", "more"]
            },
            "data": {
              "columns": [{"data_type": 2, "key": "type", "name": "Type", "sort_key": "x2098"},
                {"data_type": -1, "key": "name", "name": "Name", "sort_key": "x2095"},
                {"data_type": -1, "key": "size_formatted", "name": "Size", "sort_key": "x2096"},
                {"data_type": 401, "key": "modify_date", "name": "Modified", "sort_key": "x2094"}],
              "properties": {
                "container": true,
                "container_size": 9,
                "create_date": "2016-08-18T13:14:15",
                "create_user_id": 4201,
                "description": "",
                "description_multilingual": {"en": ""},
                "favorite": false,
                "id": 1704,
                "mime_type": null,
                "modify_date": "2016-08-22T09:19:58",
                "modify_user_id": 4201,
                "name": "LPAD-50044-LongInstructions-01-301510",
                "name_multilingual": {"en": "LPAD-50044-LongInstructions-01-301510"},
                "owner_group_id": 1001,
                "owner_user_id": 4201,
                "parent_id": 2081,
                "reserved": false,
                "reserved_date": null,
                "reserved_user_id": 0,
                "size": 9,
                "size_formatted": "9 Items",
                "type": 154,
                "type_name": "WorkflowAttachmentsFolder",
                "versions_control_advanced": false,
                "volume_id": -2081
              }
            }
          }
        }
      }));
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/9999?([^/?]+)' + '(\\?.*)?$'),
        status: 404,
        responseText: {
          success: false,
          data: 'Invalid node id'
        }
      }));
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/nodes/([^/?]+)' + '(\\?.*)?$'),
        urlParams: ['nodeId'],
        type: 'GET',
        response: function (settings, done) {
          assignmentResults.data.workflow_open_in_smart_ui = true;
          assignmentResults.data.workflow_id = 1;
          assignmentResults.data.workflow_subworkflow_id = 1;
          assignmentResults.data.workflow_subworkflow_task_id = 1;
          this.responseText = assignmentResults;
          done();
        }
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v2/processes/1/subprocesses/1/tasks/100',
        type: 'PUT',
        status: 400,
        responseText: {
          success: false,
          data: 'Invalid task id'
        }
      }));
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v2/processes/([0-9]+)/subprocesses/1/tasks/1'),
        type: 'PUT',
        responseText: {
          success: true,
          data: 'Hello World'
        }
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/4711/nodes?extra=false&actions=false&limit=30&page=1',
        responseText: {
        }
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/4711/nodes?extra=false&actions=false&expand=node&limit=30&page=1',
        responseText: {
          "data": [
            {
              "volume_id": {
                container: true,
                container_size: 0,
                create_date: "2016-08-23T10:45:52",
                create_user_id: 1000,
                description: "",
                description_multilingual: {
                  en: ""
                },
                favorite: false,
                guid: null,
                icon: "/imgWF/webwork/folder-circles.gif",
                icon_large: "/imgWF/webwork/folder-circles_large.gif",
                id: 2081,
                modify_date: "2016-08-23T10:45:52",
                modify_user_id: 1000,
                name: "Workflow",
                name_multilingual: {
                  en: "Workflow"
                },
                owner_group_id: 1001,
                owner_user_id: 1000,
                parent_id: -1,
                reserved: false,
                reserved_date: null,
                reserved_user_id: 0,
                type: 161,
                type_name: "Workflow Volume",
                versions_control_advanced: false,
                volume_id: -2022
              },
              "id": 301422,
              "parent_id": {
                container: true,
                container_size: 0,
                create_date: "2016-08-23T10:45:52",
                description: "",
                favorite: false,
                guid: null,
                icon: "/imgWF/webwork/folder-circles.gif",
                icon_large: "/imgWF/webwork/folder-circles_large.gif",
                id: 301421,
                modify_date: "2016-08-23T10:45:52",
                modify_user_id: 1000,
                name: "workflow map-15248",
                owner_group_id: 1001,
                owner_user_id: 1000,
                parent_id: 2022,
                reserved: false,
                reserved_date: null,
                reserved_user_id: 0,
                type: 154,
                type_name: "Workflow Attachments",
                versions_control_advanced: false,
                volume_id: -2022
              },
              "name": "Document 1",
              "type": 144,
              "description": "Description of Document 1",
              "create_date": "2016-08-17T13:21:32",
              "modify_date": "2016-08-17T13:21:32",
              "reserved": false,
              "reserved_user_id": 0,
              "reserved_date": null,
              "icon": "\/img_main\/webdoc\/apptext.gif",
              "mime_type": "text\/plain",
              "original_id": 0,
              "wnd_owner": 4201,
              "wnd_createdby": 4201,
              "wnd_createdate": "2016-08-17T13:21:54",
              "wnd_modifiedby": 4201,
              "wnd_version": null,
              "wnf_readydate": null,
              "wnd_comments": null,
              "wnf_att_5c6v_2": null,
              "type_name": "Document",
              "container": false,
              "size": 3048,
              "perm_see": true,
              "perm_see_contents": true,
              "perm_modify": true,
              "perm_modify_attributes": true,
              "perm_modify_permissions": true,
              "perm_create": true,
              "perm_delete": true,
              "perm_delete_versions": true,
              "perm_reserve": true,
              "favorite": false,
              "size_formatted": "3 KB",
              "reserved_user_login": null,
              "action_url": "\/v1\/actions\/301422",
              "parent_id_url": "\/v1\/nodes\/301421"
            },
            {
              "volume_id": {
                container: true,
                container_size: 0,
                create_date: "2016-08-23T10:45:52",
                create_user_id: 1000,
                description: "",
                description_multilingual: {
                  en: ""
                },
                favorite: false,
                guid: null,
                icon: "/imgWF/webwork/folder-circles.gif",
                icon_large: "/imgWF/webwork/folder-circles_large.gif",
                id: 2081,
                modify_date: "2016-08-23T10:45:52",
                modify_user_id: 1000,
                name: "Workflow",
                name_multilingual: {
                  en: "Workflow"
                },
                owner_group_id: 1001,
                owner_user_id: 1000,
                parent_id: -1,
                reserved: false,
                reserved_date: null,
                reserved_user_id: 0,
                type: 161,
                type_name: "Workflow Volume",
                versions_control_advanced: false,
                volume_id: -2022
              },
              "id": 301423,
              "parent_id": {
                container: true,
                container_size: 0,
                create_date: "2016-08-23T10:45:52",
                description: "",
                favorite: false,
                guid: null,
                icon: "/imgWF/webwork/folder-circles.gif",
                icon_large: "/imgWF/webwork/folder-circles_large.gif",
                id: 301421,
                modify_date: "2016-08-23T10:45:52",
                modify_user_id: 1000,
                name: "workflow map-15248",
                owner_group_id: 1001,
                owner_user_id: 1000,
                parent_id: 2022,
                reserved: false,
                reserved_date: null,
                reserved_user_id: 0,
                type: 154,
                type_name: "Workflow Attachments",
                versions_control_advanced: false,
                volume_id: -2022
              },
              "name": "Document 2",
              "type": 144,
              "description": "Description of Document 2",
              "create_date": "2016-08-17T13:21:46",
              "modify_date": "2016-08-17T13:21:46",
              "reserved": false,
              "reserved_user_id": 0,
              "reserved_date": null,
              "icon": "\/img_main\/webdoc\/apptext.gif",
              "mime_type": "text\/plain",
              "original_id": 0,
              "wnd_owner": 4201,
              "wnd_createdby": 4201,
              "wnd_createdate": "2016-08-17T13:21:54",
              "wnd_modifiedby": 4201,
              "wnd_version": null,
              "wnf_readydate": null,
              "wnd_comments": null,
              "wnf_att_5c6v_2": null,
              "type_name": "Document",
              "container": false,
              "size": 206801,
              "perm_see": true,
              "perm_see_contents": true,
              "perm_modify": true,
              "perm_modify_attributes": true,
              "perm_modify_permissions": true,
              "perm_create": true,
              "perm_delete": true,
              "perm_delete_versions": true,
              "perm_reserve": true,
              "favorite": false,
              "size_formatted": "202 KB",
              "reserved_user_login": null,
              "action_url": "\/v1\/actions\/301423",
              "parent_id_url": "\/v1\/nodes\/301421"
            },
            {
              "volume_id": {
                container: true,
                container_size: 0,
                create_date: "2016-08-23T10:45:52",
                create_user_id: 1000,
                description: "",
                description_multilingual: {
                  en: ""
                },
                favorite: false,
                guid: null,
                icon: "/imgWF/webwork/folder-circles.gif",
                icon_large: "/imgWF/webwork/folder-circles_large.gif",
                id: 2081,
                modify_date: "2016-08-23T10:45:52",
                modify_user_id: 1000,
                name: "Workflow",
                name_multilingual: {
                  en: "Workflow"
                },
                owner_group_id: 1001,
                owner_user_id: 1000,
                parent_id: -1,
                reserved: false,
                reserved_date: null,
                reserved_user_id: 0,
                type: 161,
                type_name: "Workflow Volume",
                versions_control_advanced: false,
                volume_id: -2022
              },
              "id": 301424,
              "parent_id": {
                container: true,
                container_size: 0,
                create_date: "2016-08-23T10:45:52",
                description: "",
                favorite: false,
                guid: null,
                icon: "/imgWF/webwork/folder-circles.gif",
                icon_large: "/imgWF/webwork/folder-circles_large.gif",
                id: 301421,
                modify_date: "2016-08-23T10:45:52",
                modify_user_id: 1000,
                name: "workflow map-15248",
                owner_group_id: 1001,
                owner_user_id: 1000,
                parent_id: 2022,
                reserved: false,
                reserved_date: null,
                reserved_user_id: 0,
                type: 154,
                type_name: "Workflow Attachments",
                versions_control_advanced: false,
                volume_id: -2022
              },
              "name": "Document 3",
              "type": 144,
              "description": "Description of Document 3, save returns an error",
              "create_date": "2016-08-17T13:21:46",
              "modify_date": "2016-08-17T13:21:46",
              "reserved": false,
              "reserved_user_id": 0,
              "reserved_date": null,
              "icon": "\/img_main\/webdoc\/apptext.gif",
              "mime_type": "text\/plain",
              "original_id": 0,
              "wnd_owner": 4201,
              "wnd_createdby": 4201,
              "wnd_createdate": "2016-08-17T13:21:54",
              "wnd_modifiedby": 4201,
              "wnd_version": null,
              "wnf_readydate": null,
              "wnd_comments": null,
              "wnf_att_5c6v_2": null,
              "type_name": "Document",
              "container": false,
              "size": 206801,
              "perm_see": true,
              "perm_see_contents": true,
              "perm_modify": true,
              "perm_modify_attributes": true,
              "perm_modify_permissions": true,
              "perm_create": true,
              "perm_delete": true,
              "perm_delete_versions": true,
              "perm_reserve": true,
              "favorite": false,
              "size_formatted": "202 KB",
              "reserved_user_login": null,
              "action_url": "\/v1\/actions\/301423",
              "parent_id_url": "\/v1\/nodes\/301421"
            },
            {
              "volume_id": {
                container: true,
                container_size: 0,
                create_date: "2016-08-23T10:45:52",
                create_user_id: 1000,
                description: "",
                description_multilingual: {
                  en: ""
                },
                favorite: false,
                guid: null,
                icon: "/imgWF/webwork/folder-circles.gif",
                icon_large: "/imgWF/webwork/folder-circles_large.gif",
                id: 2081,
                modify_date: "2016-08-23T10:45:52",
                modify_user_id: 1000,
                name: "Workflow",
                name_multilingual: {
                  en: "Workflow"
                },
                owner_group_id: 1001,
                owner_user_id: 1000,
                parent_id: -1,
                reserved: false,
                reserved_date: null,
                reserved_user_id: 0,
                type: 161,
                type_name: "Workflow Volume",
                versions_control_advanced: false,
                volume_id: -2022
              },
              "id": 301425,
              "parent_id": {
                container: true,
                container_size: 0,
                create_date: "2016-08-23T10:45:52",
                description: "",
                favorite: false,
                guid: null,
                icon: "/imgWF/webwork/folder-circles.gif",
                icon_large: "/imgWF/webwork/folder-circles_large.gif",
                id: 301421,
                modify_date: "2016-08-23T10:45:52",
                modify_user_id: 1000,
                name: "workflow map-15248",
                owner_group_id: 1001,
                owner_user_id: 1000,
                parent_id: 2022,
                reserved: false,
                reserved_date: null,
                reserved_user_id: 0,
                type: 154,
                type_name: "Workflow Attachments",
                versions_control_advanced: false,
                volume_id: -2022
              },
              "original_id": {
                container: false,
                container_size: 0,
                create_date: "2016-08-23T10:45:52",
                description: "",
                favorite: false,
                guid: null,
                icon: "\/imgWF\/webdoc\/appxml.gif",
                icon_large: "\/imgWF\/webdoc\/appxml_large.gif",
                id: 301426,
                "mime_type": "text\/xml",
                modify_date: "2016-08-23T10:45:52",
                modify_user_id: 1000,
                name: "workflow map-15248",
                owner_group_id: 1001,
                owner_user_id: 1000,
                parent_id: 2022,
                reserved: false,
                reserved_date: null,
                reserved_user_id: 0,
                type: 144,
                type_name: "Document",
                versions_control_advanced: false,
                volume_id: -2022
              },
              "name": "Document 4",
              "type": 1,
              "description": "Description of Document 4, save returns an error",
              "create_date": "2016-08-17T13:21:46",
              "modify_date": "2016-08-17T13:21:46",
              "reserved": false,
              "reserved_user_id": 0,
              "reserved_date": null,
              "icon": "\/img_main\/webdoc\/doc.gif",
              "mime_type": "",
              "wnd_owner": 4201,
              "wnd_createdby": 4201,
              "wnd_createdate": "2016-08-17T13:21:54",
              "wnd_modifiedby": 4201,
              "wnd_version": null,
              "wnf_readydate": null,
              "wnd_comments": null,
              "wnf_att_5c6v_2": null,
              "type_name": "Shortcut",
              "container": false,
              "size": 206801,
              "perm_see": true,
              "perm_see_contents": true,
              "perm_modify": true,
              "perm_modify_attributes": true,
              "perm_modify_permissions": true,
              "perm_create": true,
              "perm_delete": true,
              "perm_delete_versions": true,
              "perm_reserve": true,
              "favorite": false,
              "size_formatted": "202 KB",
              "reserved_user_login": null,
              "action_url": "\/v1\/actions\/301423",
              "parent_id_url": "\/v1\/nodes\/301421"
            },
            {
              "volume_id": {
                container: true,
                container_size: 0,
                create_date: "2016-08-23T10:45:55",
                create_user_id: 1000,
                description: "",
                description_multilingual: {
                  en: ""
                },
                favorite: false,
                guid: null,
                icon: "/imgWF/webwork/folder-circles.gif",
                icon_large: "/imgWF/webwork/folder-circles_large.gif",
                id: 2081,
                modify_date: "2016-08-23T10:45:52",
                modify_user_id: 1000,
                name: "Workflow",
                name_multilingual: {
                  en: "Workflow"
                },
                owner_group_id: 1001,
                owner_user_id: 1000,
                parent_id: -1,
                reserved: false,
                reserved_date: null,
                reserved_user_id: 0,
                type: 161,
                type_name: "Workflow Volume",
                versions_control_advanced: false,
                volume_id: -2022
              },
              "id": 301426,
              "parent_id": {
                container: true,
                container_size: 0,
                create_date: "2016-08-23T10:45:52",
                description: "",
                favorite: false,
                guid: null,
                icon: "/imgWF/webwork/folder-circles.gif",
                icon_large: "/imgWF/webwork/folder-circles_large.gif",
                id: 301421,
                modify_date: "2016-08-23T10:45:52",
                modify_user_id: 1000,
                name: "workflow map-15248",
                owner_group_id: 1001,
                owner_user_id: 1000,
                parent_id: 2022,
                reserved: false,
                reserved_date: null,
                reserved_user_id: 0,
                type: 154,
                type_name: "Workflow Attachments",
                versions_control_advanced: false,
                volume_id: -2022
              },
              "name": "CS16 Documentation Project charter 2016 (1).docx",
              "type": 144,
              "description": "Description of Document 5",
              "create_date": "2016-08-17T13:21:46",
              "modify_date": "2016-08-17T13:21:46",
              "reserved": false,
              "reserved_user_id": 0,
              "reserved_date": null,
              "icon": "\/img_main\/webdoc\/apptext.gif",
              "mime_type": "application\/vnd.openxmlformats-officedocument.wordprocessingml.document",
              "original_id": 0,
              "wnd_owner": 4201,
              "wnd_createdby": 4201,
              "wnd_createdate": "2016-08-17T13:21:54",
              "wnd_modifiedby": 4201,
              "wnd_version": null,
              "wnf_readydate": null,
              "wnd_comments": null,
              "wnf_att_5c6v_2": null,
              "type_name": "Document",
              "container": false,
              "size": 206801,
              "perm_see": true,
              "perm_see_contents": true,
              "perm_modify": true,
              "perm_modify_attributes": true,
              "perm_modify_permissions": true,
              "perm_create": true,
              "perm_delete": true,
              "perm_delete_versions": true,
              "perm_reserve": true,
              "favorite": false,
              "size_formatted": "202 KB",
              "reserved_user_login": null,
              "action_url": "\/v1\/actions\/301423",
              "parent_id_url": "\/v1\/nodes\/301421"
            }
          ],
          "definitions": {
            "create_date": {
              "align": "center",
              "name": "Created",
              "persona": "",
              "type": -7,
              "width_weight": 0
            },
            "description": {
              "align": "left",
              "name": "Description",
              "persona": "",
              "type": -1,
              "width_weight": 100
            },
            "favorite": {
              "align": "center",
              "name": "Favorite",
              "persona": "",
              "type": 5,
              "width_weight": 0
            },
            "icon": {
              "align": "center",
              "name": "Icon",
              "persona": "",
              "type": -1,
              "width_weight": 0
            },
            "id": {
              "align": "left",
              "name": "ID",
              "persona": "node",
              "type": 2,
              "width_weight": 0
            },
            "mime_type": {
              "align": "left",
              "name": "MIME Type",
              "persona": "",
              "type": -1,
              "width_weight": 0
            },
            "modify_date": {
              "align": "left",
              "name": "Modified",
              "persona": "",
              "sort": true,
              "type": -7,
              "width_weight": 0
            },
            "name": {
              "align": "left",
              "name": "Name",
              "persona": "",
              "sort": true,
              "type": -1,
              "width_weight": 100
            },
            "original_id": {
              "align": "left",
              "name": "Original ID",
              "persona": "node",
              "type": 2,
              "width_weight": 0
            },
            "parent_id": {
              "align": "left",
              "name": "Parent ID",
              "persona": "node",
              "type": 2,
              "width_weight": 0
            },
            "reserved": {
              "align": "center",
              "name": "Reserve",
              "persona": "",
              "type": 5,
              "width_weight": 0
            },
            "reserved_date": {
              "align": "center",
              "name": "Reserved",
              "persona": "",
              "type": -7,
              "width_weight": 0
            },
            "reserved_user_id": {
              "align": "center",
              "name": "Reserved By",
              "persona": "member",
              "type": 2,
              "width_weight": 0
            },
            "size": {
              "align": "right",
              "name": "Size",
              "persona": "",
              "sort": true,
              "sort_key": "size",
              "type": 2,
              "width_weight": 0
            },
            "size_formatted": {
              "align": "right",
              "name": "Size",
              "persona": "",
              "sort": true,
              "sort_key": "size",
              "type": 2,
              "width_weight": 0
            },
            "type": {
              "align": "center",
              "name": "Type",
              "persona": "",
              "sort": true,
              "type": 2,
              "width_weight": 0
            },
            "volume_id": {
              "align": "left",
              "name": "VolumeID",
              "persona": "node",
              "type": 2,
              "width_weight": 0
            }
          },
          "definitions_map": {
            "name": [
              "menu"
            ]
          },
          "definitions_order": [
            "type",
            "name",
            "size_formatted",
            "modify_date"
          ],
          "limit": 30,
          "page": 1,
          "page_total": 1,
          "range_max": 2,
          "range_min": 1,
          "sort": "asc_name",
          "total_count": 2,
          "where_facet": [],
          "where_name": "",
          "where_type": []
        }
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/4711/addablenodetypes',
        responseText: {
          "data": {
            "compound_document": "api\/v1\/forms\/nodes\/create?type=136&parent_id=301508",
            "document": "api\/v1\/forms\/nodes\/create?type=144&parent_id=301508",
            "folder": "api\/v1\/forms\/nodes\/create?type=0&parent_id=301508",
            "shortcut": "api\/v1\/forms\/nodes\/create?type=1&parent_id=301508",
            "tasklist": "api\/v1\/forms\/nodes\/create?type=204&parent_id=301508",
            "url": "api\/v1\/forms\/nodes\/create?type=140&parent_id=301508"
          },
          "definitions": {
            "compound_document": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "\/img_main\/webdoc\/cd.gif",
              "method": "GET",
              "name": "Compound Document",
              "parameters": {},
              "tab_href": "",
              "type": 136
            },
            "document": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "\/img_main\/webdoc\/doc.gif",
              "method": "GET",
              "name": "Document",
              "parameters": {},
              "tab_href": "",
              "type": 144
            },
            "folder": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "\/img_main\/webdoc\/folder.gif",
              "method": "GET",
              "name": "Folder",
              "parameters": {},
              "tab_href": "",
              "type": 0
            },
            "shortcut": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "\/img_main\/tinyali.gif",
              "method": "GET",
              "name": "Shortcut",
              "parameters": {},
              "tab_href": "",
              "type": 1
            },
            "tasklist": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "\/img_main\/task\/16tasklist.gif",
              "method": "GET",
              "name": "Task List",
              "parameters": {},
              "tab_href": "",
              "type": 204
            },
            "url": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "\/img_main\/webdoc\/url.gif",
              "method": "GET",
              "name": "URL",
              "parameters": {},
              "tab_href": "",
              "type": 140
            }
          },
          "definitions_map": {},
          "definitions_order": ["compound_document", "document", "folder", "shortcut", "tasklist",
            "url"]
        }
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/1704/nodes?extra=false&actions=false&expand=node&limit=30&page=1',
        responseText: {
          "data": [
            {
              "volume_id": {
                container: true,
                container_size: 0,
                create_date: "2016-08-23T10:45:52",
                create_user_id: 1000,
                description: "",
                description_multilingual: {
                  en: ""
                },
                favorite: false,
                guid: null,
                icon: "/imgWF/webwork/folder-circles.gif",
                icon_large: "/imgWF/webwork/folder-circles_large.gif",
                id: 2081,
                modify_date: "2016-08-23T10:45:52",
                modify_user_id: 1000,
                name: "Workflow",
                name_multilingual: {
                  en: "Workflow"
                },
                owner_group_id: 1001,
                owner_user_id: 1000,
                parent_id: -1,
                reserved: false,
                reserved_date: null,
                reserved_user_id: 0,
                type: 161,
                type_name: "Workflow Volume",
                versions_control_advanced: false,
                volume_id: -2022
              },
              "id": 301422,
              "parent_id": {
                container: true,
                container_size: 0,
                create_date: "2016-08-23T10:45:52",
                description: "",
                favorite: false,
                guid: null,
                icon: "/imgWF/webwork/folder-circles.gif",
                icon_large: "/imgWF/webwork/folder-circles_large.gif",
                id: 301421,
                modify_date: "2016-08-23T10:45:52",
                modify_user_id: 1000,
                name: "workflow map-15248",
                owner_group_id: 1001,
                owner_user_id: 1000,
                parent_id: 2022,
                reserved: false,
                reserved_date: null,
                reserved_user_id: 0,
                type: 154,
                type_name: "Workflow Attachments",
                versions_control_advanced: false,
                volume_id: -2022
              },
              "name": "Document 1",
              "type": 144,
              "description": "Description of Document 1",
              "create_date": "2016-08-17T13:21:32",
              "modify_date": "2016-08-17T13:21:32",
              "reserved": false,
              "reserved_user_id": 0,
              "reserved_date": null,
              "icon": "\/img_main\/webdoc\/apptext.gif",
              "mime_type": "text\/plain",
              "original_id": 0,
              "wnd_owner": 4201,
              "wnd_createdby": 4201,
              "wnd_createdate": "2016-08-17T13:21:54",
              "wnd_modifiedby": 4201,
              "wnd_version": null,
              "wnf_readydate": null,
              "wnd_comments": null,
              "wnf_att_5c6v_2": null,
              "type_name": "Document",
              "container": false,
              "size": 3048,
              "perm_see": true,
              "perm_see_contents": true,
              "perm_modify": true,
              "perm_modify_attributes": true,
              "perm_modify_permissions": true,
              "perm_create": true,
              "perm_delete": true,
              "perm_delete_versions": true,
              "perm_reserve": true,
              "favorite": false,
              "size_formatted": "3 KB",
              "reserved_user_login": null,
              "action_url": "\/v1\/actions\/301422",
              "parent_id_url": "\/v1\/nodes\/301421"
            }
          ],
          "definitions": {
            "create_date": {
              "align": "center",
              "name": "Created",
              "persona": "",
              "type": -7,
              "width_weight": 0
            },
            "description": {
              "align": "left",
              "name": "Description",
              "persona": "",
              "type": -1,
              "width_weight": 100
            },
            "favorite": {
              "align": "center",
              "name": "Favorite",
              "persona": "",
              "type": 5,
              "width_weight": 0
            },
            "icon": {
              "align": "center",
              "name": "Icon",
              "persona": "",
              "type": -1,
              "width_weight": 0
            },
            "id": {
              "align": "left",
              "name": "ID",
              "persona": "node",
              "type": 2,
              "width_weight": 0
            },
            "mime_type": {
              "align": "left",
              "name": "MIME Type",
              "persona": "",
              "type": -1,
              "width_weight": 0
            },
            "modify_date": {
              "align": "left",
              "name": "Modified",
              "persona": "",
              "sort": true,
              "type": -7,
              "width_weight": 0
            },
            "name": {
              "align": "left",
              "name": "Name",
              "persona": "",
              "sort": true,
              "type": -1,
              "width_weight": 100
            },
            "original_id": {
              "align": "left",
              "name": "Original ID",
              "persona": "node",
              "type": 2,
              "width_weight": 0
            },
            "parent_id": {
              "align": "left",
              "name": "Parent ID",
              "persona": "node",
              "type": 2,
              "width_weight": 0
            },
            "reserved": {
              "align": "center",
              "name": "Reserve",
              "persona": "",
              "type": 5,
              "width_weight": 0
            },
            "reserved_date": {
              "align": "center",
              "name": "Reserved",
              "persona": "",
              "type": -7,
              "width_weight": 0
            },
            "reserved_user_id": {
              "align": "center",
              "name": "Reserved By",
              "persona": "member",
              "type": 2,
              "width_weight": 0
            },
            "size": {
              "align": "right",
              "name": "Size",
              "persona": "",
              "sort": true,
              "sort_key": "size",
              "type": 2,
              "width_weight": 0
            },
            "size_formatted": {
              "align": "right",
              "name": "Size",
              "persona": "",
              "sort": true,
              "sort_key": "size",
              "type": 2,
              "width_weight": 0
            },
            "type": {
              "align": "center",
              "name": "Type",
              "persona": "",
              "sort": true,
              "type": 2,
              "width_weight": 0
            },
            "volume_id": {
              "align": "left",
              "name": "VolumeID",
              "persona": "node",
              "type": 2,
              "width_weight": 0
            }
          },
          "definitions_map": {
            "name": [
              "menu"
            ]
          },
          "definitions_order": [
            "type",
            "name",
            "size_formatted",
            "modify_date"
          ],
          "limit": 30,
          "page": 1,
          "page_total": 1,
          "range_max": 2,
          "range_min": 1,
          "sort": "asc_name",
          "total_count": 2,
          "where_facet": [],
          "where_name": "",
          "where_type": []
        }
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/1704/addablenodetypes',
        responseText: {
          "data": {
            "compound_document": "api\/v1\/forms\/nodes\/create?type=136&parent_id=301508",
            "folder": "api\/v1\/forms\/nodes\/create?type=0&parent_id=301508",
            "tasklist": "api\/v1\/forms\/nodes\/create?type=204&parent_id=301508",
            "url": "api\/v1\/forms\/nodes\/create?type=140&parent_id=301508"
          },
          "definitions": {
            "compound_document": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "\/img_main\/webdoc\/cd.gif",
              "method": "GET",
              "name": "Compound Document",
              "parameters": {},
              "tab_href": "",
              "type": 136
            },
            "folder": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "\/img_main\/webdoc\/folder.gif",
              "method": "GET",
              "name": "Folder",
              "parameters": {},
              "tab_href": "",
              "type": 0
            },
            "tasklist": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "\/img_main\/task\/16tasklist.gif",
              "method": "GET",
              "name": "Task List",
              "parameters": {},
              "tab_href": "",
              "type": 204
            },
            "url": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "\/img_main\/webdoc\/url.gif",
              "method": "GET",
              "name": "URL",
              "parameters": {},
              "tab_href": "",
              "type": 140
            }
          },
          "definitions_map": {},
          "definitions_order": ["compound_document", "folder", "tasklist", "url"]
        }
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/9999/nodes?extra=false&actions=false&expand=node&limit=30&page=1',
        status: 404,
        responseText: {
          success: false,
          data: 'Invalid node id'
        }
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/9999/addablenodetypes',
        status: 404,
        responseText: {
          success: false,
          data: 'Invalid node id'
        }
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/815/nodes?extra=false&actions=false&expand=node&limit=30&page=1',
        responseText: {
          "data": [
            {
              "volume_id": {
                container: true,
                container_size: 0,
                create_date: "2016-08-23T10:45:52",
                create_user_id: 1000,
                description: "",
                description_multilingual: {
                  en: ""
                },
                favorite: false,
                guid: null,
                icon: "/imgWF/webwork/folder-circles.gif",
                icon_large: "/imgWF/webwork/folder-circles_large.gif",
                id: 2081,
                modify_date: "2016-08-23T10:45:52",
                modify_user_id: 1000,
                name: "Workflow",
                name_multilingual: {
                  en: "Workflow"
                },
                owner_group_id: 1001,
                owner_user_id: 1000,
                parent_id: -1,
                reserved: false,
                reserved_date: null,
                reserved_user_id: 0,
                type: 161,
                type_name: "Workflow Volume",
                versions_control_advanced: false,
                volume_id: -2022
              },
              "id": 301422,
              "parent_id": {
                container: true,
                container_size: 0,
                create_date: "2016-08-23T10:45:52",
                description: "",
                favorite: false,
                guid: null,
                icon: "/imgWF/webwork/folder-circles.gif",
                icon_large: "/imgWF/webwork/folder-circles_large.gif",
                id: 301421,
                modify_date: "2016-08-23T10:45:52",
                modify_user_id: 1000,
                name: "workflow map-15248",
                owner_group_id: 1001,
                owner_user_id: 1000,
                parent_id: 2022,
                reserved: false,
                reserved_date: null,
                reserved_user_id: 0,
                type: 154,
                type_name: "Workflow Attachments",
                versions_control_advanced: false,
                volume_id: -2022
              },
              "name": "Document 1",
              "type": 144,
              "description": "Description of Document 1",
              "create_date": "2016-08-17T13:21:32",
              "modify_date": "2016-08-17T13:21:32",
              "reserved": false,
              "reserved_user_id": 0,
              "reserved_date": null,
              "icon": "\/img_main\/webdoc\/apptext.gif",
              "mime_type": "text\/plain",
              "original_id": 0,
              "wnd_owner": 4201,
              "wnd_createdby": 4201,
              "wnd_createdate": "2016-08-17T13:21:54",
              "wnd_modifiedby": 4201,
              "wnd_version": null,
              "wnf_readydate": null,
              "wnd_comments": null,
              "wnf_att_5c6v_2": null,
              "type_name": "Document",
              "container": false,
              "size": 3048,
              "perm_see": true,
              "perm_see_contents": true,
              "perm_modify": true,
              "perm_modify_attributes": true,
              "perm_modify_permissions": true,
              "perm_create": true,
              "perm_delete": true,
              "perm_delete_versions": true,
              "perm_reserve": true,
              "favorite": false,
              "size_formatted": "3 KB",
              "reserved_user_login": null,
              "action_url": "\/v1\/actions\/301422",
              "parent_id_url": "\/v1\/nodes\/301421"
            }
          ],
          "definitions": {
            "create_date": {
              "align": "center",
              "name": "Created",
              "persona": "",
              "type": -7,
              "width_weight": 0
            },
            "description": {
              "align": "left",
              "name": "Description",
              "persona": "",
              "type": -1,
              "width_weight": 100
            },
            "favorite": {
              "align": "center",
              "name": "Favorite",
              "persona": "",
              "type": 5,
              "width_weight": 0
            },
            "icon": {
              "align": "center",
              "name": "Icon",
              "persona": "",
              "type": -1,
              "width_weight": 0
            },
            "id": {
              "align": "left",
              "name": "ID",
              "persona": "node",
              "type": 2,
              "width_weight": 0
            },
            "mime_type": {
              "align": "left",
              "name": "MIME Type",
              "persona": "",
              "type": -1,
              "width_weight": 0
            },
            "modify_date": {
              "align": "left",
              "name": "Modified",
              "persona": "",
              "sort": true,
              "type": -7,
              "width_weight": 0
            },
            "name": {
              "align": "left",
              "name": "Name",
              "persona": "",
              "sort": true,
              "type": -1,
              "width_weight": 100
            },
            "original_id": {
              "align": "left",
              "name": "Original ID",
              "persona": "node",
              "type": 2,
              "width_weight": 0
            },
            "parent_id": {
              "align": "left",
              "name": "Parent ID",
              "persona": "node",
              "type": 2,
              "width_weight": 0
            },
            "reserved": {
              "align": "center",
              "name": "Reserve",
              "persona": "",
              "type": 5,
              "width_weight": 0
            },
            "reserved_date": {
              "align": "center",
              "name": "Reserved",
              "persona": "",
              "type": -7,
              "width_weight": 0
            },
            "reserved_user_id": {
              "align": "center",
              "name": "Reserved By",
              "persona": "member",
              "type": 2,
              "width_weight": 0
            },
            "size": {
              "align": "right",
              "name": "Size",
              "persona": "",
              "sort": true,
              "sort_key": "size",
              "type": 2,
              "width_weight": 0
            },
            "size_formatted": {
              "align": "right",
              "name": "Size",
              "persona": "",
              "sort": true,
              "sort_key": "size",
              "type": 2,
              "width_weight": 0
            },
            "type": {
              "align": "center",
              "name": "Type",
              "persona": "",
              "sort": true,
              "type": 2,
              "width_weight": 0
            },
            "volume_id": {
              "align": "left",
              "name": "VolumeID",
              "persona": "node",
              "type": 2,
              "width_weight": 0
            }
          },
          "definitions_map": {
            "name": [
              "menu"
            ]
          },
          "definitions_order": [
            "type",
            "name",
            "size_formatted",
            "modify_date"
          ],
          "limit": 30,
          "page": 1,
          "page_total": 1,
          "range_max": 2,
          "range_min": 1,
          "sort": "asc_name",
          "total_count": 2,
          "where_facet": [],
          "where_name": "",
          "where_type": []
        }
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/815/addablenodetypes',
        responseText: {
          "data": {},
          "definitions": {},
          "definitions_map": {},
          "definitions_order": []
        }
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/301424',
        type: 'PUT',
        status: 400,
        responseText: '{"error":"Could not update \u0027index.html\u0027.  You do not have permission."}'
      }));
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v1/nodes/([0-9]+)'),
        type: 'PUT',
        responseText: {}
      }));
      mocks.push(mockjax({
        url: new RegExp('^//server/otcs/cs/api/v1/nodes/*'),
        type: 'POST',
        responseText: {}
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/1706/addablenodetypes',
        responseText: {
          "data": {
            "document": "api\/v1\/forms\/nodes\/create?type=144&parent_id=301508"
          },
          "definitions": {
            "document": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "\/img_main\/webdoc\/doc.gif",
              "method": "GET",
              "name": "Document",
              "parameters": {},
              "tab_href": "",
              "type": 144
            }
          },
          "definitions_map": {},
          "definitions_order": ["document"]
        }
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/1706/nodes?extra=false&actions=false&expand=node&limit=30&page=1',
        responseText: {
          "data": [
            {
              "volume_id": {
                container: true,
                container_size: 0,
                create_date: "2016-08-23T10:45:52",
                create_user_id: 1000,
                description: "",
                description_multilingual: {
                  en: ""
                },
                favorite: false,
                guid: null,
                icon: "/imgWF/webwork/folder-circles.gif",
                icon_large: "/imgWF/webwork/folder-circles_large.gif",
                id: 2081,
                modify_date: "2016-08-23T10:45:52",
                modify_user_id: 1000,
                name: "Workflow",
                name_multilingual: {
                  en: "Workflow"
                },
                owner_group_id: 1001,
                owner_user_id: 1000,
                parent_id: -1,
                reserved: false,
                reserved_date: null,
                reserved_user_id: 0,
                type: 161,
                type_name: "Workflow Volume",
                versions_control_advanced: false,
                volume_id: -2022
              },
              "id": 301422,
              "parent_id": {
                container: true,
                container_size: 0,
                create_date: "2016-08-23T10:45:52",
                description: "",
                favorite: false,
                guid: null,
                icon: "/imgWF/webwork/folder-circles.gif",
                icon_large: "/imgWF/webwork/folder-circles_large.gif",
                id: 301421,
                modify_date: "2016-08-23T10:45:52",
                modify_user_id: 1000,
                name: "workflow map-15248",
                owner_group_id: 1001,
                owner_user_id: 1000,
                parent_id: 2022,
                reserved: false,
                reserved_date: null,
                reserved_user_id: 0,
                type: 154,
                type_name: "Workflow Attachments",
                versions_control_advanced: false,
                volume_id: -2022
              },
              "name": "Document 1",
              "type": 144,
              "description": "Description of Document 1",
              "create_date": "2016-08-17T13:21:32",
              "modify_date": "2016-08-17T13:21:32",
              "reserved": false,
              "reserved_user_id": 0,
              "reserved_date": null,
              "icon": "\/img_main\/webdoc\/apptext.gif",
              "mime_type": "text\/plain",
              "original_id": 0,
              "wnd_owner": 4201,
              "wnd_createdby": 4201,
              "wnd_createdate": "2016-08-17T13:21:54",
              "wnd_modifiedby": 4201,
              "wnd_version": null,
              "wnf_readydate": null,
              "wnd_comments": null,
              "wnf_att_5c6v_2": null,
              "type_name": "Document",
              "container": false,
              "size": 3048,
              "perm_see": true,
              "perm_see_contents": true,
              "perm_modify": true,
              "perm_modify_attributes": true,
              "perm_modify_permissions": true,
              "perm_create": true,
              "perm_delete": true,
              "perm_delete_versions": true,
              "perm_reserve": true,
              "favorite": false,
              "size_formatted": "3 KB",
              "reserved_user_login": null,
              "action_url": "\/v1\/actions\/301422",
              "parent_id_url": "\/v1\/nodes\/301421"
            }
          ],
          "definitions": {
            "create_date": {
              "align": "center",
              "name": "Created",
              "persona": "",
              "type": -7,
              "width_weight": 0
            },
            "description": {
              "align": "left",
              "name": "Description",
              "persona": "",
              "type": -1,
              "width_weight": 100
            },
            "favorite": {
              "align": "center",
              "name": "Favorite",
              "persona": "",
              "type": 5,
              "width_weight": 0
            },
            "icon": {
              "align": "center",
              "name": "Icon",
              "persona": "",
              "type": -1,
              "width_weight": 0
            },
            "id": {
              "align": "left",
              "name": "ID",
              "persona": "node",
              "type": 2,
              "width_weight": 0
            },
            "mime_type": {
              "align": "left",
              "name": "MIME Type",
              "persona": "",
              "type": -1,
              "width_weight": 0
            },
            "modify_date": {
              "align": "left",
              "name": "Modified",
              "persona": "",
              "sort": true,
              "type": -7,
              "width_weight": 0
            },
            "name": {
              "align": "left",
              "name": "Name",
              "persona": "",
              "sort": true,
              "type": -1,
              "width_weight": 100
            },
            "original_id": {
              "align": "left",
              "name": "Original ID",
              "persona": "node",
              "type": 2,
              "width_weight": 0
            },
            "parent_id": {
              "align": "left",
              "name": "Parent ID",
              "persona": "node",
              "type": 2,
              "width_weight": 0
            },
            "reserved": {
              "align": "center",
              "name": "Reserve",
              "persona": "",
              "type": 5,
              "width_weight": 0
            },
            "reserved_date": {
              "align": "center",
              "name": "Reserved",
              "persona": "",
              "type": -7,
              "width_weight": 0
            },
            "reserved_user_id": {
              "align": "center",
              "name": "Reserved By",
              "persona": "member",
              "type": 2,
              "width_weight": 0
            },
            "size": {
              "align": "right",
              "name": "Size",
              "persona": "",
              "sort": true,
              "sort_key": "size",
              "type": 2,
              "width_weight": 0
            },
            "size_formatted": {
              "align": "right",
              "name": "Size",
              "persona": "",
              "sort": true,
              "sort_key": "size",
              "type": 2,
              "width_weight": 0
            },
            "type": {
              "align": "center",
              "name": "Type",
              "persona": "",
              "sort": true,
              "type": 2,
              "width_weight": 0
            },
            "volume_id": {
              "align": "left",
              "name": "VolumeID",
              "persona": "node",
              "type": 2,
              "width_weight": 0
            }
          },
          "definitions_map": {
            "name": [
              "menu"
            ]
          },
          "definitions_order": [
            "type",
            "name",
            "size_formatted",
            "modify_date"
          ],
          "limit": 30,
          "page": 1,
          "page_total": 1,
          "range_max": 2,
          "range_min": 1,
          "sort": "asc_name",
          "total_count": 2,
          "where_facet": [],
          "where_name": "",
          "where_type": []
        }
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/1705/addablenodetypes',
        responseText: {
          "data": {
            "shortcut": "api\/v1\/forms\/nodes\/create?type=1&parent_id=301508"
          },
          "definitions": {

            "shortcut": {
              "body": "",
              "content_type": "",
              "display_hint": "",
              "display_href": "",
              "handler": "form",
              "image": "\/img_main\/tinyali.gif",
              "method": "GET",
              "name": "Shortcut",
              "parameters": {},
              "tab_href": "",
              "type": 1
            }

          },
          "definitions_map": {},
          "definitions_order": ["shortcut"]
        }
      }));
      mocks.push(mockjax({
        url: '//server/otcs/cs/api/v1/nodes/1705/nodes?extra=false&actions=false&expand=node&limit=30&page=1',
        responseText: {
          "data": [
            {
              "volume_id": {
                container: true,
                container_size: 0,
                create_date: "2016-08-23T10:45:52",
                create_user_id: 1000,
                description: "",
                description_multilingual: {
                  en: ""
                },
                favorite: false,
                guid: null,
                icon: "/imgWF/webwork/folder-circles.gif",
                icon_large: "/imgWF/webwork/folder-circles_large.gif",
                id: 2081,
                modify_date: "2016-08-23T10:45:52",
                modify_user_id: 1000,
                name: "Workflow",
                name_multilingual: {
                  en: "Workflow"
                },
                owner_group_id: 1001,
                owner_user_id: 1000,
                parent_id: -1,
                reserved: false,
                reserved_date: null,
                reserved_user_id: 0,
                type: 161,
                type_name: "Workflow Volume",
                versions_control_advanced: false,
                volume_id: -2022
              },
              "id": 301422,
              "parent_id": {
                container: true,
                container_size: 0,
                create_date: "2016-08-23T10:45:52",
                description: "",
                favorite: false,
                guid: null,
                icon: "/imgWF/webwork/folder-circles.gif",
                icon_large: "/imgWF/webwork/folder-circles_large.gif",
                id: 301421,
                modify_date: "2016-08-23T10:45:52",
                modify_user_id: 1000,
                name: "workflow map-15248",
                owner_group_id: 1001,
                owner_user_id: 1000,
                parent_id: 2022,
                reserved: false,
                reserved_date: null,
                reserved_user_id: 0,
                type: 154,
                type_name: "Workflow Attachments",
                versions_control_advanced: false,
                volume_id: -2022
              },
              "name": "Document 1",
              "type": 144,
              "description": "Description of Document 1",
              "create_date": "2016-08-17T13:21:32",
              "modify_date": "2016-08-17T13:21:32",
              "reserved": false,
              "reserved_user_id": 0,
              "reserved_date": null,
              "icon": "\/img_main\/webdoc\/apptext.gif",
              "mime_type": "text\/plain",
              "original_id": 0,
              "wnd_owner": 4201,
              "wnd_createdby": 4201,
              "wnd_createdate": "2016-08-17T13:21:54",
              "wnd_modifiedby": 4201,
              "wnd_version": null,
              "wnf_readydate": null,
              "wnd_comments": null,
              "wnf_att_5c6v_2": null,
              "type_name": "Document",
              "container": false,
              "size": 3048,
              "perm_see": true,
              "perm_see_contents": true,
              "perm_modify": true,
              "perm_modify_attributes": true,
              "perm_modify_permissions": true,
              "perm_create": true,
              "perm_delete": true,
              "perm_delete_versions": true,
              "perm_reserve": true,
              "favorite": false,
              "size_formatted": "3 KB",
              "reserved_user_login": null,
              "action_url": "\/v1\/actions\/301422",
              "parent_id_url": "\/v1\/nodes\/301421"
            }
          ],
          "definitions": {
            "create_date": {
              "align": "center",
              "name": "Created",
              "persona": "",
              "type": -7,
              "width_weight": 0
            },
            "description": {
              "align": "left",
              "name": "Description",
              "persona": "",
              "type": -1,
              "width_weight": 100
            },
            "favorite": {
              "align": "center",
              "name": "Favorite",
              "persona": "",
              "type": 5,
              "width_weight": 0
            },
            "icon": {
              "align": "center",
              "name": "Icon",
              "persona": "",
              "type": -1,
              "width_weight": 0
            },
            "id": {
              "align": "left",
              "name": "ID",
              "persona": "node",
              "type": 2,
              "width_weight": 0
            },
            "mime_type": {
              "align": "left",
              "name": "MIME Type",
              "persona": "",
              "type": -1,
              "width_weight": 0
            },
            "modify_date": {
              "align": "left",
              "name": "Modified",
              "persona": "",
              "sort": true,
              "type": -7,
              "width_weight": 0
            },
            "name": {
              "align": "left",
              "name": "Name",
              "persona": "",
              "sort": true,
              "type": -1,
              "width_weight": 100
            },
            "original_id": {
              "align": "left",
              "name": "Original ID",
              "persona": "node",
              "type": 2,
              "width_weight": 0
            },
            "parent_id": {
              "align": "left",
              "name": "Parent ID",
              "persona": "node",
              "type": 2,
              "width_weight": 0
            },
            "reserved": {
              "align": "center",
              "name": "Reserve",
              "persona": "",
              "type": 5,
              "width_weight": 0
            },
            "reserved_date": {
              "align": "center",
              "name": "Reserved",
              "persona": "",
              "type": -7,
              "width_weight": 0
            },
            "reserved_user_id": {
              "align": "center",
              "name": "Reserved By",
              "persona": "member",
              "type": 2,
              "width_weight": 0
            },
            "size": {
              "align": "right",
              "name": "Size",
              "persona": "",
              "sort": true,
              "sort_key": "size",
              "type": 2,
              "width_weight": 0
            },
            "size_formatted": {
              "align": "right",
              "name": "Size",
              "persona": "",
              "sort": true,
              "sort_key": "size",
              "type": 2,
              "width_weight": 0
            },
            "type": {
              "align": "center",
              "name": "Type",
              "persona": "",
              "sort": true,
              "type": 2,
              "width_weight": 0
            },
            "volume_id": {
              "align": "left",
              "name": "VolumeID",
              "persona": "node",
              "type": 2,
              "width_weight": 0
            }
          },
          "definitions_map": {
            "name": [
              "menu"
            ]
          },
          "definitions_order": [
            "type",
            "name",
            "size_formatted",
            "modify_date"
          ],
          "limit": 30,
          "page": 1,
          "page_total": 1,
          "range_max": 2,
          "range_min": 1,
          "sort": "asc_name",
          "total_count": 2,
          "where_facet": [],
          "where_name": "",
          "where_type": []
        }
      }));

    },

    disable: function () {
      var mock;
      while ((mock = mocks.pop())) {
        mockjax.clear(mock);
      }
    }

  }
      ;

})
;
