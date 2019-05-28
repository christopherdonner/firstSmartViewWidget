/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["csui/lib/jquery",
  "csui/lib/underscore",
  "csui/lib/backbone",
  "csui/lib/marionette",
  'csui/utils/contexts/factories/connector',
  'csui/utils/contexts/page/page.context',
  "csui/lib/alpaca/js/alpaca",
  'csui/models/form',
  "csui/models/node/node.model",
  'csui/controls/form/form.view',
  'csui/widgets/metadata/property.panels/categories/impl/category.form.view',
  '../../../utils/testutils/async.test.utils.js',
  'csui/lib/bililiteRange',
  'csui/lib/jquery.simulate',
  'csui/lib/jquery.simulate.ext',
  'csui/lib/jquery.simulate.key-sequence'
], function ($, _, Backbone, Marionette, ConnectorFactory,
    PageContext, Alpaca, FormModel, NodeModel, FormView, CategoryFormView, asyncTestUtils) {
  'use strict';

  describe("Form Set Controls", function () {
    describe("Update mode", function () {

      var form, form1, formModel, formView, categoryFormView, lockElements, unlockElements, unlockMVElements;

      beforeAll(function (done) {

        form1 = {
          "data": {
            "46872_2": [
              {
                "46872_2_x_27": null,
                "46872_2_x_28": null,
                "46872_2_x_29": false,
                "46872_2_x_30": null,
                "46872_2_x_32": null,
                "46872_2_x_33": null,
                "46872_2_x_34": null,
                "46872_2_x_36": null
              },
              {
                "46872_2_x_27": null,
                "46872_2_x_28": null,
                "46872_2_x_29": false,
                "46872_2_x_30": null,
                "46872_2_x_32": null,
                "46872_2_x_33": null,
                "46872_2_x_34": null,
                "46872_2_x_36": null
              }
            ],
            "46872_3": [
              {
                "46872_3_x_10": null,
                "46872_3_x_11": null,
                "46872_3_x_12": null,
                "46872_3_x_13": null,
                "46872_3_x_14": null,
                "46872_3_x_15": null,
                "46872_3_x_16": null,
                "46872_3_x_7": null,
                "46872_3_x_8": null,
                "46872_3_x_9": false
              }
            ],
            "46872_4": [
              {
                "46872_4_x_17": [
                  null
                ],
                "46872_4_x_18": [
                  null
                ],
                "46872_4_x_19": false,
                "46872_4_x_20": [
                  null
                ],
                "46872_4_x_21": [
                  null
                ],
                "46872_4_x_22": [
                  null
                ],
                "46872_4_x_23": [
                  null
                ],
                "46872_4_x_24": [
                  null
                ],
                "46872_4_x_25": [
                  null
                ],
                "46872_4_x_26": [
                  null
                ]
              }
            ],
            "46872_2_1": null,
            "46872_2_2": null,
            "46872_3_1": null,
            "46872_4_1": null
          },
          "options": {
            "fields": {
              "46872_2": {
                "fields": {
                  "item": {
                    "fields": {
                      "46872_2_x_27": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Date Field",
                        "readonly": false,
                        "type": "date"
                      },
                      "46872_2_x_28": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "DatePopUp",
                        "optionLabels": [
                          "2017-06-21",
                          "2017-06-20"
                        ],
                        "readonly": false,
                        "type": "radio"
                      },
                      "46872_2_x_29": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Flag",
                        "readonly": false,
                        "type": "checkbox"
                      },
                      "46872_2_x_30": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "IntegerField",
                        "readonly": false,
                        "type": "integer"
                      },
                      "46872_2_x_32": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "TextField",
                        "readonly": false,
                        "type": "text"
                      },
                      "46872_2_x_33": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "TextArea",
                        "readonly": false,
                        "type": "textarea"
                      },
                      "46872_2_x_34": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "TextPopUp",
                        "readonly": false,
                        "type": "select"
                      },
                      "46872_2_x_36": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "UserField",
                        "readonly": false,
                        "type": "otcs_user_picker",
                        "type_control": {}
                      }
                    },
                    "type": "object"
                  }
                },
                "hideInitValidationError": true,
                "items": {
                  "showMoveDownItemButton": false,
                  "showMoveUpItemButton": false
                },
                "label": "SetLock",
                "toolbarSticky": true
              },
              "46872_3": {
                "fields": {
                  "item": {
                    "fields": {
                      "46872_3_x_7": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Date Field",
                        "readonly": false,
                        "type": "date"
                      },
                      "46872_3_x_8": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "DatePopUp",
                        "optionLabels": [
                          "2017-06-22",
                          "2017-06-20"
                        ],
                        "readonly": false,
                        "type": "radio"
                      },
                      "46872_3_x_9": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Flag",
                        "readonly": false,
                        "type": "checkbox"
                      },
                      "46872_3_x_10": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "IntegerField",
                        "readonly": false,
                        "type": "integer"
                      },
                      "46872_3_x_11": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "IntegerPopup",
                        "readonly": false,
                        "type": "select"
                      },
                      "46872_3_x_12": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "TextField",
                        "readonly": false,
                        "type": "text"
                      },
                      "46872_3_x_13": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "TextArea",
                        "readonly": false,
                        "type": "textarea"
                      },
                      "46872_3_x_14": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "TextPopUp",
                        "readonly": false,
                        "type": "select"
                      },
                      "46872_3_x_15": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "UserField",
                        "readonly": false,
                        "type": "otcs_user_picker",
                        "type_control": {}
                      },
                      "46872_3_x_16": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "TKL",
                        "readonly": false,
                        "type": "tkl"
                      }
                    },
                    "type": "object"
                  }
                },
                "hideInitValidationError": true,
                "items": {
                  "showMoveDownItemButton": false,
                  "showMoveUpItemButton": false
                },
                "label": "SetUnlock",
                "toolbarSticky": true
              },
              "46872_4": {
                "fields": {
                  "item": {
                    "fields": {
                      "46872_4_x_17": {
                        "fields": {
                          "item": {
                            "type": "date"
                          }
                        },
                        "hidden": false,
                        "hideInitValidationError": true,
                        "items": {
                          "showMoveDownItemButton": false,
                          "showMoveUpItemButton": false
                        },
                        "label": "Date Field",
                        "readonly": false,
                        "toolbarSticky": true
                      },
                      "46872_4_x_18": {
                        "fields": {
                          "item": {
                            "optionLabels": [
                              "2017-06-21",
                              "2017-06-20"
                            ],
                            "type": "select"
                          }
                        },
                        "hidden": false,
                        "hideInitValidationError": true,
                        "items": {
                          "showMoveDownItemButton": false,
                          "showMoveUpItemButton": false
                        },
                        "label": "DatePopUp",
                        "readonly": false,
                        "toolbarSticky": true
                      },
                      "46872_4_x_19": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Flag",
                        "readonly": false,
                        "type": "checkbox"
                      },
                      "46872_4_x_20": {
                        "fields": {
                          "item": {
                            "type": "integer"
                          }
                        },
                        "hidden": false,
                        "hideInitValidationError": true,
                        "items": {
                          "showMoveDownItemButton": false,
                          "showMoveUpItemButton": false
                        },
                        "label": "IntegerField",
                        "readonly": false,
                        "toolbarSticky": true
                      },
                      "46872_4_x_21": {
                        "fields": {
                          "item": {
                            "type": "select"
                          }
                        },
                        "hidden": false,
                        "hideInitValidationError": true,
                        "items": {
                          "showMoveDownItemButton": false,
                          "showMoveUpItemButton": false
                        },
                        "label": "IntegerPopup",
                        "readonly": false,
                        "toolbarSticky": true
                      },
                      "46872_4_x_22": {
                        "fields": {
                          "item": {
                            "type": "text"
                          }
                        },
                        "hidden": false,
                        "hideInitValidationError": true,
                        "items": {
                          "showMoveDownItemButton": false,
                          "showMoveUpItemButton": false
                        },
                        "label": "TextField",
                        "readonly": false,
                        "toolbarSticky": true
                      },
                      "46872_4_x_23": {
                        "fields": {
                          "item": {
                            "type": "textarea"
                          }
                        },
                        "hidden": false,
                        "hideInitValidationError": true,
                        "items": {
                          "showMoveDownItemButton": false,
                          "showMoveUpItemButton": false
                        },
                        "label": "TextArea",
                        "readonly": false,
                        "toolbarSticky": true
                      },
                      "46872_4_x_24": {
                        "fields": {
                          "item": {
                            "type": "select"
                          }
                        },
                        "hidden": false,
                        "hideInitValidationError": true,
                        "items": {
                          "showMoveDownItemButton": false,
                          "showMoveUpItemButton": false
                        },
                        "label": "TextPopUp",
                        "readonly": false,
                        "toolbarSticky": true
                      },
                      "46872_4_x_25": {
                        "fields": {
                          "item": {
                            "type": "tkl"
                          }
                        },
                        "hidden": false,
                        "hideInitValidationError": true,
                        "items": {
                          "showMoveDownItemButton": false,
                          "showMoveUpItemButton": false
                        },
                        "label": "TKL",
                        "readonly": false,
                        "toolbarSticky": true
                      },
                      "46872_4_x_26": {
                        "fields": {
                          "item": {
                            "type": "otcs_user_picker",
                            "type_control": {}
                          }
                        },
                        "hidden": false,
                        "hideInitValidationError": true,
                        "items": {
                          "showMoveDownItemButton": false,
                          "showMoveUpItemButton": false
                        },
                        "label": "UserField",
                        "readonly": false,
                        "toolbarSticky": true
                      }
                    },
                    "type": "object"
                  }
                },
                "hideInitValidationError": true,
                "items": {
                  "showMoveDownItemButton": false,
                  "showMoveUpItemButton": false
                },
                "label": "SetMultiValue",
                "toolbarSticky": true
              },
              "46872_2_1": {
                "hidden": true
              },
              "46872_2_2": {
                "hidden": true
              },
              "46872_3_1": {
                "hidden": true
              },
              "46872_4_1": {
                "hidden": true
              }
            },
            "form": {
              "attributes": {
                "action": "api/v1/nodes/24762/categories/46872",
                "method": "PUT"
              },
              "renderForm": true
            }

          },
          "schema": {
            "properties": {
              "46872_2": {
                "items": {
                  "maxItems": 2,
                  "minItems": 2,
                  "properties": {
                    "46872_2_x_27": {
                      "readonly": false,
                      "required": false,
                      "title": "Date Field",
                      "type": "string"
                    },
                    "46872_2_x_28": {
                      "enum": [
                        "2017-06-21T00:00:00",
                        "2017-06-20T00:00:00"
                      ],
                      "readonly": false,
                      "required": false,
                      "title": "DatePopUp",
                      "type": "string"
                    },
                    "46872_2_x_29": {
                      "readonly": false,
                      "required": false,
                      "title": "Flag",
                      "type": "boolean"
                    },
                    "46872_2_x_30": {
                      "readonly": false,
                      "required": false,
                      "title": "IntegerField",
                      "type": "integer"
                    },
                    "46872_2_x_32": {
                      "maxLength": 32,
                      "readonly": false,
                      "required": false,
                      "title": "TextField",
                      "type": "string"
                    },
                    "46872_2_x_33": {
                      "readonly": false,
                      "required": false,
                      "title": "TextArea",
                      "type": "string"
                    },
                    "46872_2_x_34": {
                      "enum": [
                        "as",
                        "asd",
                        "sad",
                        "ds",
                        "AH",
                        "S",
                        "SDSD",
                        "CCV",
                        "VV",
                        "ER",
                        "FGG",
                        "AQ",
                        "q2131",
                        "13fdgfd",
                        "sdg",
                        "5",
                        "gd",
                        "t6ryt"
                      ],
                      "readonly": false,
                      "required": false,
                      "title": "TextPopUp",
                      "type": "string"
                    },
                    "46872_2_x_36": {
                      "readonly": false,
                      "required": false,
                      "title": "UserField",
                      "type": "otcs_user_picker"
                    }
                  },
                  "type": "object"
                },
                "title": "SetLock",
                "type": "array"
              },
              "46872_3": {
                "items": {
                  "defaultItems": 1,
                  "maxItems": 2,
                  "minItems": 1,
                  "properties": {
                    "46872_3_x_7": {
                      "readonly": false,
                      "required": false,
                      "title": "Date Field",
                      "type": "string"
                    },
                    "46872_3_x_8": {
                      "enum": [
                        "2017-06-22T00:00:00",
                        "2017-06-20T00:00:00"
                      ],
                      "readonly": false,
                      "required": false,
                      "title": "DatePopUp",
                      "type": "string"
                    },
                    "46872_3_x_9": {
                      "readonly": false,
                      "required": false,
                      "title": "Flag",
                      "type": "boolean"
                    },
                    "46872_3_x_10": {
                      "readonly": false,
                      "required": false,
                      "title": "IntegerField",
                      "type": "integer"
                    },
                    "46872_3_x_11": {
                      "enum": [
                        1,
                        2,
                        3,
                        4,
                        56,
                        213,
                        6,
                        768,
                        32,
                        890,
                        5
                      ],
                      "readonly": false,
                      "required": false,
                      "title": "IntegerPopup",
                      "type": "integer"
                    },
                    "46872_3_x_12": {
                      "maxLength": 32,
                      "readonly": false,
                      "required": false,
                      "title": "TextField",
                      "type": "string"
                    },
                    "46872_3_x_13": {
                      "readonly": false,
                      "required": false,
                      "title": "TextArea",
                      "type": "string"
                    },
                    "46872_3_x_14": {
                      "enum": [
                        "we",
                        "W",
                        "sfds",
                        "ddf",
                        "vbn",
                        "yuiyi",
                        "2gdfg",
                        "8",
                        "fg",
                        "dghfWDK",
                        "DD",
                        "FD",
                        "P",
                        "WE",
                        "#",
                        "$",
                        "%",
                        "^"
                      ],
                      "readonly": false,
                      "required": false,
                      "title": "TextPopUp",
                      "type": "string"
                    },
                    "46872_3_x_15": {
                      "readonly": false,
                      "required": false,
                      "title": "UserField",
                      "type": "otcs_user_picker"
                    },
                    "46872_3_x_16": {
                      "enum": [],
                      "parents": [],
                      "readonly": false,
                      "required": false,
                      "title": "TKL",
                      "type": "String"
                    }
                  },
                  "type": "object"
                },
                "title": "SetUnlock",
                "type": "array"
              },
              "46872_4": {
                "items": {
                  "defaultItems": 1,
                  "maxItems": 2,
                  "minItems": 1,
                  "properties": {
                    "46872_4_x_17": {
                      "items": {
                        "defaultItems": 1,
                        "maxItems": 2,
                        "minItems": 1,
                        "type": "string"
                      },
                      "readonly": false,
                      "required": false,
                      "title": "Date Field",
                      "type": "array"
                    },
                    "46872_4_x_18": {
                      "items": {
                        "defaultItems": 1,
                        "enum": [
                          "2017-06-21T00:00:00",
                          "2017-06-20T00:00:00"
                        ],
                        "maxItems": 2,
                        "minItems": 1,
                        "type": "string"
                      },
                      "readonly": false,
                      "required": false,
                      "title": "DatePopUp",
                      "type": "array"
                    },
                    "46872_4_x_19": {
                      "readonly": false,
                      "required": false,
                      "title": "Flag",
                      "type": "boolean"
                    },
                    "46872_4_x_20": {
                      "items": {
                        "defaultItems": 1,
                        "maxItems": 2,
                        "minItems": 1,
                        "type": "integer"
                      },
                      "readonly": false,
                      "required": false,
                      "title": "IntegerField",
                      "type": "array"
                    },
                    "46872_4_x_21": {
                      "items": {
                        "defaultItems": 1,
                        "enum": [
                          1,
                          23,
                          4,
                          7,
                          35,
                          76,
                          2,
                          546
                        ],
                        "maxItems": 2,
                        "minItems": 1,
                        "type": "integer"
                      },
                      "readonly": false,
                      "required": false,
                      "title": "IntegerPopup",
                      "type": "array"
                    },
                    "46872_4_x_22": {
                      "items": {
                        "defaultItems": 1,
                        "maxItems": 2,
                        "maxLength": 32,
                        "minItems": 1,
                        "type": "string"
                      },
                      "readonly": false,
                      "required": false,
                      "title": "TextField",
                      "type": "array"
                    },
                    "46872_4_x_23": {
                      "items": {
                        "defaultItems": 1,
                        "maxItems": 2,
                        "minItems": 1,
                        "type": "string"
                      },
                      "readonly": false,
                      "required": false,
                      "title": "TextArea",
                      "type": "array"
                    },
                    "46872_4_x_24": {
                      "items": {
                        "defaultItems": 1,
                        "enum": [
                          "wqe",
                          "sad",
                          "esf",
                          "asd",
                          "sf",
                          "af",
                          "awda",
                          "fd",
                          "fg",
                          "H",
                          "HA",
                          "A",
                          "S",
                          "FGH",
                          "AS",
                          "XSS",
                          "67SD",
                          "*S",
                          "8jkj"
                        ],
                        "maxItems": 2,
                        "minItems": 1,
                        "type": "string"
                      },
                      "readonly": false,
                      "required": false,
                      "title": "TextPopUp",
                      "type": "array"
                    },
                    "46872_4_x_25": {
                      "items": {
                        "defaultItems": 1,
                        "enum": [],
                        "maxItems": 2,
                        "minItems": 1,
                        "parents": [],
                        "type": "String"
                      },
                      "readonly": false,
                      "required": false,
                      "title": "TKL",
                      "type": "array"
                    },
                    "46872_4_x_26": {
                      "items": {
                        "defaultItems": 1,
                        "maxItems": 2,
                        "minItems": 1,
                        "type": "otcs_user_picker"
                      },
                      "readonly": false,
                      "required": false,
                      "title": "UserField",
                      "type": "array"
                    }
                  },
                  "type": "object"
                },
                "title": "SetMultiValue",
                "type": "array"
              },
              "46872_2_1": {
                "type": "string"
              },
              "46872_2_2": {
                "type": "string"
              },
              "46872_3_1": {
                "type": "string"
              },
              "46872_4_1": {
                "type": "string"
              }
            },
            "type": "object"
          }
        };

        formModel = new FormModel(form1);

        formView = new FormView({
          model: formModel,
          context: new PageContext({
            factories: {
              connector: {
                connection: {
                  url: '//server/otcs/cs/api/v1/',
                  supportPath: '/support',
                  session: {
                    ticket: 'dummy'
                  }
                }
              }
            }
          })
        });

        formView.render();
        $('<div id="form"/>').appendTo('body').append(formView.$el);
        asyncTestUtils.asyncElement(formView.$el, '.cs-array.alpaca-container-item').done(function(el) {
          lockElements = formView.$el.find('.cs-form-set').children('div:eq(0)');
          unlockElements = formView.$el.find('.cs-form-set').children('div:eq(1)');
          unlockMVElements = formView.$el.find('.cs-form-set').children('div:eq(2)');
          done();
        });
      });

      xit("Present in the form [low]", function () {
        var setLength = formView.$el.find('.cs-form-set').length;
        expect(setLength).toEqual(1);
      });

      xit("Non empty set [low]", function () {
        var setChildLength = formView.$el.find('.cs-form-set').children().length;
        expect(setChildLength).toEqual(3);
      });

      xdescribe("Locked set", function () {

        it("Initially on read mode on render [medium]", function () {
          expect(lockElements.find(".csui-bulk-edit-cancel.binf-hidden").length).toEqual(1);
          expect(lockElements.find('.cs-field-write.binf-hidden').length).toEqual(14);
          expect(lockElements.find('.cs-field-write:not(.binf-hidden)').length).toEqual(2);//boolean field
          expect(lockElements.find('.cs-field-read').length).toEqual(14);
          expect(lockElements.find('.cs-field-read.binf-hidden').length).toEqual(0);
        });

        it("On mouse leave the set edit icon is invisible [medium]", function () {
          var set = lockElements.find('.cs-form-set-container');
          set.trigger('mouseleave');
          expect(lockElements.find('.csui-array-bulk-edit.binf-hidden').length).toEqual(1);
        });

        it("On mouse enter the set edit icon is visible [medium]", function () {
          var set = lockElements.find('.cs-form-set-container');
          set.trigger('mouseenter');
          expect(lockElements.find('.csui-array-bulk-edit.binf-hidden').length).toEqual(0);
        });

        it("Edit icon is hidden on focus out of set [medium]", function () {
          var set = lockElements.find('.cs-form-set-container');
          set.trigger('focusout');
          expect(lockElements.find('.csui-array-bulk-edit.binf-hidden').length).toEqual(1);
        });

        it("Writable on clicking edit icon [high]", function () {
          expect(lockElements.find(".csui-bulk-edit.binf-hidden").length).toEqual(0);
          expect(lockElements.find('.csui-bulk-edit-cancel.binf-hidden').length).toEqual(1);
          var editButton = lockElements.find('.csui-bulk-edit');
          editButton.trigger('click');
          expect(lockElements.find(".csui-bulk-edit.binf-hidden").length).toEqual(1);
          expect(lockElements.find(".csui-array-bulk-edit").length).toEqual(1);
          expect(lockElements.find('.csui-bulk-edit-cancel').length).toEqual(1);
          expect(lockElements.find('.cs-field-write').length).toEqual(16);
          expect(lockElements.find('.cs-field-write.binf-hidden').length).toEqual(0);
          expect(lockElements.find('.cs-field-read.binf-hidden').length).toEqual(14);
        });

        it("Contains lock set with single fields[medium]", function () {
          var setType = lockElements.alpaca().options.isSetType;
          expect(setType).toBeTruthy();
          var set = lockElements.find('.cs-form-set-container');
          set.trigger('mouseenter');
          var actionbarHide = lockElements.find(".alpaca-array-actionbar-action.binf-hidden");
          expect(actionbarHide.length).toEqual(2);
        });

        it("Readable on clicking cancel icon [high]", function (done) {
          var cancelButton = lockElements.find('.csui-bulk-edit-cancel');
          cancelButton.trigger('click');
          asyncTestUtils.asyncElement(lockElements, '.cs-field-write.binf-hidden').done(function() {
            expect(lockElements.find('.cs-field-write.binf-hidden').length).toEqual(14);
            expect(lockElements.find('.cs-field-read.binf-hidden').length).toEqual(0);
            expect(lockElements.find('.csui-bulk-edit.binf-hidden').length).toEqual(0);
            expect(lockElements.find('.csui-array-bulk-edit.binf-hidden').length).toEqual(1);
            expect(lockElements.find('.csui-bulk-edit-cancel.binf-hidden').length).toEqual(1);
            expect(lockElements.find('.cs-field-read').length).toEqual(14);
            expect(lockElements.find('.cs-field-write:not(.binf-hidden)').length).toEqual(2);
            done();
          });
        });

        it("Writable on pressing enter [high]", function () {
          expect(lockElements.find(".csui-bulk-edit.binf-hidden").length).toEqual(0);
          expect(lockElements.find('.csui-bulk-edit-cancel.binf-hidden').length).toEqual(1);
          var set = lockElements.find('.cs-form-set-container');
          set.trigger({type: 'keydown', keyCode: 13});
          expect(lockElements.find(".csui-bulk-edit.binf-hidden").length).toEqual(1);
          expect(lockElements.find(".csui-array-bulk-edit").length).toEqual(1);
          expect(lockElements.find('.csui-bulk-edit-cancel').length).toEqual(1);
          expect(lockElements.find('.cs-field-write').length).toEqual(16);
          expect(lockElements.find('.cs-field-write.binf-hidden').length).toEqual(0);
          expect(lockElements.find('.cs-field-read.binf-hidden').length).toEqual(14);
        });

        it("Readable on pressing escape [high]", function (done) {
          var set = lockElements.find('.cs-form-set-container');
          set.trigger({type: 'keydown', keyCode: 27});
          asyncTestUtils.asyncElement(lockElements, '.cs-field-write.binf-hidden').done(function() {
            expect(lockElements.find('.cs-field-write.binf-hidden').length).toEqual(14);
            expect(lockElements.find('.cs-field-read.binf-hidden').length).toEqual(0);
            expect(lockElements.find('.csui-bulk-edit.binf-hidden').length).toEqual(0);
            expect(lockElements.find('.csui-array-bulk-edit.binf-hidden').length).toEqual(1);
            expect(lockElements.find('.cs-field-read').length).toEqual(14);
            expect(lockElements.find('.cs-field-write:not(.binf-hidden)').length).toEqual(2);
            done();
          });
        });

        it("Set is writable on pressing enter in case of invalid values [high]", function (done) {
          expect(lockElements.find('.cs-field-read.binf-hidden').length).toEqual(0);
          var set = lockElements.find('.cs-form-set-container');
          var integerfield = lockElements.find('[data-alpaca-container-item-index=3]').alpaca().fieldView;
          integerfield.setValue('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
          lockElements.find('[data-alpaca-container-item-index=3]').trigger({type: 'keydown', keyCode: 13});
          asyncTestUtils.asyncElement(formView.$el,'.cs-form-set-container .alpaca-container .alpaca-invalid').done(function(el) {
            expect(el.length).toEqual(1);
            expect(integerfield.getValue()).toEqual('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
            expect(lockElements.find(".csui-bulk-edit.binf-hidden").length).toEqual(1);
            expect(lockElements.find('.csui-bulk-edit-cancel').length).toEqual(1);
            expect(lockElements.find('.cs-field-write').length).toEqual(16);
            expect(lockElements.find('.cs-field-write.binf-hidden').length).toEqual(0);
            expect(lockElements.find('.cs-field-read.binf-hidden').length).toEqual(14);
            done();
          });
        });
        it("Set is readable mode on pressing enter in case of valid values [medium]", function (done) {
          var set = lockElements.find('.cs-form-set-container');
          var integerfield = lockElements.find('[data-alpaca-container-item-index=3]').alpaca().fieldView;
          integerfield.setValue(1);
          lockElements.find('[data-alpaca-container-item-index=3]').trigger({type: 'keydown', keyCode: 13});
          asyncTestUtils.asyncElement(formView.$el,'.cs-form-set-container .alpaca-container .alpaca-invalid', true).done(function(el) {
            expect(el.length).toEqual(0);
            expect(parseInt(integerfield.getValue())).toEqual(1);
            done();
          });
        });
      });

      describe("UnLocked set", function () {

        xit("Action icons are visible on clicking edit icon[medium]", function () {
          expect(unlockElements.find(".csui-bulk-edit.binf-hidden").length).toEqual(0);
          expect(unlockElements.find('.csui-bulk-edit-cancel.binf-hidden').length).toEqual(1);
          var editButton = unlockElements.find('.csui-bulk-edit');
          editButton.trigger('click');
          expect(unlockElements.find(".csui-bulk-edit.binf-hidden").length).toEqual(1);
          expect(unlockElements.find('.csui-bulk-edit-cancel.binf-hidden').length).toEqual(0);
          var set = unlockElements.find('.cs-form-set-container');
          set.trigger('mouseenter');
          var actionbarVisible = unlockElements.find(
              ".alpaca-array-actionbar-action:not(.binf-hidden)");
          expect(actionbarVisible.length).toEqual(2);
        });

        xit("Can add one row on clicking add icon [high]", function (done) {
          expect(unlockElements.find(".csui-bulk-edit.binf-hidden").length).toEqual(1);
          expect(unlockElements.find('.csui-bulk-edit-cancel.binf-hidden').length).toEqual(0);
          var addButton = unlockElements.find('.csui-array-icon-add-46872_3').first();
          addButton.trigger('click');
          asyncTestUtils.asyncElement(unlockElements, '.cs-array.alpaca-container-item', {length: 1}).done(function(el) {
            expect(el.length).toEqual(2);
            done();
          });
        });

        xit("Can remove one row on clicking delete icon [high]", function (done) {
          var prevContainerItem = unlockElements.find(".cs-array.alpaca-container-item").length;
          expect(prevContainerItem).toEqual(2);
          var deleteButton = unlockElements.find('.csui-array-icon-delete-46872_3').first();
          deleteButton.trigger('click');
          var containerItem = 0;
          asyncTestUtils.asyncElement(unlockElements, '.cs-array.alpaca-container-item').done(function(el) {
            expect(el.length).toEqual(1);
            done();
          });
        });

        xit("Can't remove a single row set [medium]", function () {
          var contItem = unlockElements.find(
              ".cs-array.alpaca-container-item.alpaca-container-item-first.alpaca-container-item-last").length;
          expect(contItem).toEqual(1);
          expect(unlockElements.find(
              ".alpaca-array-actionbar-action.alpaca-button-disabled .circle_delete_grey").length).toEqual(
              1);

        });

        xit("Can't add a row for set with maximum rows [high]", function (done) {
          var prevConItem = unlockElements.find(".cs-array.alpaca-container-item").length;
          expect(prevConItem).toEqual(1);
          var addBut = unlockElements.find('.csui-array-icon-add-46872_3').first();
          addBut.trigger('click');
          asyncTestUtils.asyncElement(unlockElements, '.cs-array.alpaca-container-item', {length: 1}).done(function(el) {
            expect(el.length).toEqual(2);
            expect(unlockElements.find(
              ".cs-array.alpaca-container-item.alpaca-container-item-last").length).toEqual(1);
              expect(unlockElements.find(".alpaca-array-actionbar-action.alpaca-button-disabled .circle_add_grey").length).toEqual(2);
              done();
          });
        });

        describe("With multi-value fields", function () {

          xit("Clicking edit button focus goes to first input field and add icon is visible [High]",
              function () {
                expect(unlockMVElements.find('.csui-bulk-edit.binf-hidden').length).toEqual(0);
                expect(unlockMVElements.find('.csui-bulk-edit-cancel.binf-hidden').length).toEqual(
                    1);
                var editButton = unlockMVElements.find('.csui-bulk-edit');
                editButton.trigger('click');
                expect(unlockMVElements.find('.csui-bulk-edit.binf-hidden').length).toEqual(1);
                expect(unlockMVElements.find('.csui-bulk-edit-cancel.binf-hidden').length).toEqual(
                    0);
                expect(unlockMVElements.find('.cs-field-read.binf-hidden').length).toEqual(9);
                expect(unlockMVElements.find('.cs-field-write:not(.binf-hidden)').length).toEqual(
                    10);
                expect(
                    unlockMVElements.find('input').first()[0] ===
                    document.activeElement).toBeTruthy();
                expect(
                    unlockMVElements.find(".alpaca-array-actionbar-action.alpaca-button-disabled" +
                                          " .circle_delete_grey.csui-array-icon-delete-46872_4_x_17").length).toEqual(
                    1);
                expect(
                    unlockMVElements.find(
                        ".alpaca-array-actionbar-action:not(.alpaca-button-disabled)" +
                        " .csui-array-icon-add-46872_4_x_17").length).toEqual(
                    1);
              });

          xit("Inside set shows add icons on mouse enter [medium]", function () {
            expect(unlockMVElements.find('.cs-field-read.binf-hidden').length).toEqual(9);
            expect(unlockMVElements.find('.cs-field-write:not(.binf-hidden)').length).toEqual(10);
            var lastInputDiv = unlockMVElements.find('input').last().closest('.cs-field-write');
            lastInputDiv.trigger('mouseenter');
            expect(unlockMVElements.find(".alpaca-array-actionbar-action.alpaca-button-disabled" +
                                         " .circle_delete_grey.csui-array-icon-delete-46872_4_x_17").length).toEqual(
                1);
            expect(
                unlockMVElements.find(
                    ".alpaca-array-actionbar-action:not(.alpaca-button-disabled)" +
                    " .circle_add_grey.csui-array-icon-add-46872_4_x_17").length).toEqual(
                1);
          });

          xit("Can add one more field inside set[High]", function (done) {
            expect(unlockMVElements.find('.cs-field-read.binf-hidden').length).toEqual(9);
            expect(unlockMVElements.find('.cs-field-write:not(.binf-hidden)').length).toEqual(10);
            expect(unlockMVElements.find('.cs-form-multi-action-container').length).toEqual(9);
            var fieldAddButton = unlockMVElements.find('.csui-array-icon-add-46872_4_x_17').first();
            fieldAddButton.trigger('click');
          });

          xit("Action icons are hidden and readable on pressing escape [High]", function (done) {
            expect(unlockMVElements.find('.cs-field-read.binf-hidden').length).toEqual(10);
            var setContainer = unlockMVElements.find('.cs-form-set-container');
            setContainer.trigger({type: 'keydown', keyCode: 27});
          });

        });

      });

      afterAll(function () {
        $('body').empty();
        formModel.destroy();
        formView.destroy();
        form = {};
      });

    });

    xdescribe("Create mode", function () {
      var form, formModel, formView, formViewObject, FormElements;
      beforeAll(function (done) {
        form = {
          "data": {
            "category_id": 30922,
            "30922_2": [{
              "30922_2_x_10": null,
              "30922_2_x_11": null,
              "30922_2_x_12": false,
              "30922_2_x_4": null,
              "30922_2_x_5": null,
              "30922_2_x_6": null,
              "30922_2_x_7": null,
              "30922_2_x_8": null,
              "30922_2_x_9": null
            }],
            "30922_2_1": null
          },
          "options": {
            "fields": {
              "category_id": {
                "hidden": true,
                "hideInitValidationError": true,
                "label": "Simple Set",
                "readonly": false,
                "type": "number"
              },
              "30922_2": {
                "fields": {
                  "item": {
                    "fields": {
                      "30922_2_x_4": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": " Integer: Field",
                        "readonly": false,
                        "type": "integer",
                        "validate": false
                      },
                      "30922_2_x_5": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": " Text: Field",
                        "readonly": false,
                        "type": "text"
                      },
                      "30922_2_x_6": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Text: MultiLine",
                        "readonly": false,
                        "type": "textarea"
                      },
                      "30922_2_x_7": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": " Date: Field",
                        "readonly": false,
                        "type": "date"
                      },
                      "30922_2_x_8": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Date: Popup",
                        "optionLabels": ["2017-07-10", "2017-06-07"],
                        "readonly": false,
                        "type": "radio"
                      },
                      "30922_2_x_9": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Integer: Popup",
                        "readonly": false,
                        "type": "select"
                      },
                      "30922_2_x_10": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "User: Field",
                        "readonly": false,
                        "type": "otcs_user_picker",
                        "type_control": {}
                      },
                      "30922_2_x_11": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Text: Popup",
                        "readonly": false,
                        "type": "text"
                      },
                      "30922_2_x_12": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": " Flag: Checkbox",
                        "readonly": false,
                        "type": "checkbox"
                      }
                    }, "type": "object"
                  }
                },
                "hideInitValidationError": true,
                "items": {"showMoveDownItemButton": false, "showMoveUpItemButton": false},
                "label": "Simple Set",
                "toolbarSticky": true
              },
              "30922_2_1": {"hidden": true}
            },
            "form": {
              "attributes": {"action": "api\/v1\/nodes\/30372\/categories", "method": "POST"},
              "renderForm": true
            }

          },
          "schema": {
            "properties": {
              "category_id": {
                "readonly": false,
                "required": false,
                "title": "Simple Set",
                "type": "integer"
              },
              "30922_2": {
                "items": {
                  "defaultItems": 1,
                  "maxItems": 2,
                  "minItems": 1,
                  "properties": {
                    "30922_2_x_4": {
                      "readonly": false,
                      "required": true,
                      "title": " Integer: Field",
                      "type": "integer"
                    },
                    "30922_2_x_5": {
                      "maxLength": 32,
                      "readonly": false,
                      "required": false,
                      "title": " Text: Field",
                      "type": "string"
                    },
                    "30922_2_x_6": {
                      "readonly": false,
                      "required": false,
                      "title": "Text: MultiLine",
                      "type": "string"
                    },
                    "30922_2_x_7": {
                      "readonly": false,
                      "required": false,
                      "title": " Date: Field",
                      "type": "string"
                    },
                    "30922_2_x_8": {
                      "enum": ["2017-07-10T00:00:00", "2017-06-07T00:00:00"],
                      "readonly": false,
                      "required": false,
                      "title": "Date: Popup",
                      "type": "string"
                    },
                    "30922_2_x_9": {
                      "enum": [1, 2, 3, 4, 5],
                      "readonly": false,
                      "required": false,
                      "title": "Integer: Popup",
                      "type": "integer"
                    },
                    "30922_2_x_10": {
                      "readonly": false,
                      "required": false,
                      "title": "User: Field",
                      "type": "otcs_user_picker"
                    },
                    "30922_2_x_11": {
                      "readonly": false,
                      "required": false,
                      "title": "Text: Popup",
                      "type": "string"
                    },
                    "30922_2_x_12": {
                      "readonly": false,
                      "required": false,
                      "title": " Flag: Checkbox",
                      "type": "boolean"
                    }
                  },
                  "type": "object"
                }, "title": "Simple Set", "type": "array"
              },
              "30922_2_1": {"type": "string"}
            }, "type": "object"
          }
        };
        formModel = new FormModel(form);
        formView = new FormView({
          model: formModel,
          context: new PageContext({
            factories: {
              connector: {
                connection: {
                  url: '//server/otcs/cs/api/v1/',
                  supportPath: '/support',
                  session: {
                    ticket: 'dummy'
                  }
                }
              }
            }
          }),
          mode: 'create'
        });
        formView.render();
        $('<div id="form"/>').appendTo('body').append(formView.$el);
        asyncTestUtils.asyncElement(formView.$el, '.cs-array.alpaca-container-item').done(function(el) {
          formView.isRendered = true;
          done();
        });
      });
      afterAll(function () {
        $('body').empty();
      });
      it("Expect form to be defined[low]", function () {
        expect(formView).toBeDefined();
      });

      it("Expect form to be rendered [low]", function () {
        expect(formView.isRendered).toBeTruthy();
      });

      it("Expected set to be present in the form [low]", function () {
        expect(formView.$el.find('.cs-form-set').length).toEqual(1);
      });
      it("Expected to be non empty set [low]", function () {
        expect(formView.$el.find('.cs-form-set').children().length).toEqual(1);
      });
      it("Expected set to be in write mode  but bulk edit cancel icon hidden on render [medium]",
          function () {
            expect(formView.$el.find(".csui-bulk-edit-cancel.binf-hidden").length).toEqual(1);
            expect(formView.$el.find('.cs-field-write').length).toEqual(9);
            expect(formView.$el.find('.cs-field-read.binf-hidden').length).toEqual(8);
          });
      it("Expect set to stay in write mode even on pressing escape [medium]", function () {
        formView.$el.find('.cs-form-set-container').focus();
        var set = formView.$el.find('.cs-form-set-container');
        set.trigger({type: 'keydown', keyCode: 27});
        expect(formView.$el.find('.cs-field-write').length).toEqual(9);
        expect(formView.$el.find('.cs-field-read.binf-hidden').length).toEqual(8);
      });
      it("Expect set to stay in write mode even on pressing enter [medium]", function () {
        formView.$el.find('.cs-form-set-container').focus();
        var set = formView.$el.find('.cs-form-set-container');
        set.trigger({type: 'keydown', keyCode: 13});
        expect(formView.$el.find('.cs-field-write').length).toEqual(9);
        expect(formView.$el.find('.cs-field-read.binf-hidden').length).toEqual(8);
      });
      it("Expect set to stay in write mode even on pressing F2 [medium]", function () {
        formView.$el.find('.cs-form-set-container').focus();
        var set = formView.$el.find('.cs-form-set-container');
        set.trigger({type: 'keydown', keyCode: 113});
        expect(formView.$el.find('.cs-field-write').length).toEqual(9);
        expect(formView.$el.find('.cs-field-read.binf-hidden').length).toEqual(8);
      });

      it("Expected set to stay in write mode even on focus out of set [medium]", function () {
        var set = formView.$el.find('.cs-form-set-container');
        set.trigger('focusout');
        expect(formView.$el.find('.cs-field-write').length).toEqual(9);
        expect(formView.$el.find('.cs-field-read.binf-hidden').length).toEqual(8);
      });
    });

    describe("Responsive Set", function () {
      var form, formModel, categoryFormView, responsiveSet;
      beforeAll(function (done) {
        form = {
          "data": {
            "46872_4": [
              {
                "46872_4_x_17": [
                  null
                ],
                "46872_4_x_18": [
                  null
                ],
                "46872_4_x_19": false,
                "46872_4_x_20": [
                  null
                ],
                "46872_4_x_21": [
                  null
                ],
                "46872_4_x_22": [
                  null
                ],
                "46872_4_x_23": [
                  null
                ],
                "46872_4_x_24": [
                  null
                ],
                "46872_4_x_25": [
                  null
                ],
                "46872_4_x_26": [
                  null
                ]
              }
            ],
            "46872_4_1": null
          },
          "options": {
            "fields": {
              "46872_4": {
                "fields": {
                  "item": {
                    "fields": {
                      "46872_4_x_17": {
                        "fields": {
                          "item": {
                            "type": "date"
                          }
                        },
                        "hidden": false,
                        "hideInitValidationError": true,
                        "items": {
                          "showMoveDownItemButton": false,
                          "showMoveUpItemButton": false
                        },
                        "label": "Date Field",
                        "readonly": false,
                        "toolbarSticky": true
                      },
                      "46872_4_x_18": {
                        "fields": {
                          "item": {
                            "optionLabels": [
                              "2017-06-21",
                              "2017-06-20"
                            ],
                            "type": "select"
                          }
                        },
                        "hidden": false,
                        "hideInitValidationError": true,
                        "items": {
                          "showMoveDownItemButton": false,
                          "showMoveUpItemButton": false
                        },
                        "label": "DatePopUp",
                        "readonly": false,
                        "toolbarSticky": true
                      },
                      "46872_4_x_19": {
                        "hidden": false,
                        "hideInitValidationError": true,
                        "label": "Flag",
                        "readonly": false,
                        "type": "checkbox"
                      },
                      "46872_4_x_20": {
                        "fields": {
                          "item": {
                            "type": "integer"
                          }
                        },
                        "hidden": false,
                        "hideInitValidationError": true,
                        "items": {
                          "showMoveDownItemButton": false,
                          "showMoveUpItemButton": false
                        },
                        "label": "IntegerField",
                        "readonly": false,
                        "toolbarSticky": true
                      },
                      "46872_4_x_21": {
                        "fields": {
                          "item": {
                            "type": "select"
                          }
                        },
                        "hidden": false,
                        "hideInitValidationError": true,
                        "items": {
                          "showMoveDownItemButton": false,
                          "showMoveUpItemButton": false
                        },
                        "label": "IntegerPopup",
                        "readonly": false,
                        "toolbarSticky": true
                      },
                      "46872_4_x_22": {
                        "fields": {
                          "item": {
                            "type": "text"
                          }
                        },
                        "hidden": false,
                        "hideInitValidationError": true,
                        "items": {
                          "showMoveDownItemButton": false,
                          "showMoveUpItemButton": false
                        },
                        "label": "TextField",
                        "readonly": false,
                        "toolbarSticky": true
                      },
                      "46872_4_x_23": {
                        "fields": {
                          "item": {
                            "type": "textarea"
                          }
                        },
                        "hidden": false,
                        "hideInitValidationError": true,
                        "items": {
                          "showMoveDownItemButton": false,
                          "showMoveUpItemButton": false
                        },
                        "label": "TextArea",
                        "readonly": false,
                        "toolbarSticky": true
                      },
                      "46872_4_x_24": {
                        "fields": {
                          "item": {
                            "type": "select"
                          }
                        },
                        "hidden": false,
                        "hideInitValidationError": true,
                        "items": {
                          "showMoveDownItemButton": false,
                          "showMoveUpItemButton": false
                        },
                        "label": "TextPopUp",
                        "readonly": false,
                        "toolbarSticky": true
                      },
                      "46872_4_x_25": {
                        "fields": {
                          "item": {
                            "type": "tkl"
                          }
                        },
                        "hidden": false,
                        "hideInitValidationError": true,
                        "items": {
                          "showMoveDownItemButton": false,
                          "showMoveUpItemButton": false
                        },
                        "label": "TKL",
                        "readonly": false,
                        "toolbarSticky": true
                      },
                      "46872_4_x_26": {
                        "fields": {
                          "item": {
                            "type": "otcs_user_picker",
                            "type_control": {}
                          }
                        },
                        "hidden": false,
                        "hideInitValidationError": true,
                        "items": {
                          "showMoveDownItemButton": false,
                          "showMoveUpItemButton": false
                        },
                        "label": "UserField",
                        "readonly": false,
                        "toolbarSticky": true
                      }
                    },
                    "type": "object"
                  }
                },
                "hideInitValidationError": true,
                "items": {
                  "showMoveDownItemButton": false,
                  "showMoveUpItemButton": false
                },
                "label": "SetMultiValue",
                "toolbarSticky": true
              },
              "46872_4_1": {
                "hidden": true
              }
            },
            "form": {
              "attributes": {
                "action": "api/v1/nodes/24762/categories/46872",
                "method": "PUT"
              },
              "renderForm": true
            }
          },
          "schema": {
            "properties": {
              "46872_4": {
                "items": {
                  "defaultItems": 1,
                  "maxItems": 2,
                  "minItems": 1,
                  "properties": {
                    "46872_4_x_17": {
                      "items": {
                        "defaultItems": 1,
                        "maxItems": 2,
                        "minItems": 1,
                        "type": "string"
                      },
                      "readonly": false,
                      "required": false,
                      "title": "Date Field",
                      "type": "array"
                    },
                    "46872_4_x_18": {
                      "items": {
                        "defaultItems": 1,
                        "enum": [
                          "2017-06-21T00:00:00",
                          "2017-06-20T00:00:00"
                        ],
                        "maxItems": 2,
                        "minItems": 1,
                        "type": "string"
                      },
                      "readonly": false,
                      "required": false,
                      "title": "DatePopUp",
                      "type": "array"
                    },
                    "46872_4_x_19": {
                      "readonly": false,
                      "required": false,
                      "title": "Flag",
                      "type": "boolean"
                    },
                    "46872_4_x_20": {
                      "items": {
                        "defaultItems": 1,
                        "maxItems": 2,
                        "minItems": 1,
                        "type": "integer"
                      },
                      "readonly": false,
                      "required": false,
                      "title": "IntegerField",
                      "type": "array"
                    },
                    "46872_4_x_21": {
                      "items": {
                        "defaultItems": 1,
                        "enum": [
                          1,
                          23,
                          4,
                          7,
                          35,
                          76,
                          2,
                          546
                        ],
                        "maxItems": 2,
                        "minItems": 1,
                        "type": "integer"
                      },
                      "readonly": false,
                      "required": false,
                      "title": "IntegerPopup",
                      "type": "array"
                    },
                    "46872_4_x_22": {
                      "items": {
                        "defaultItems": 1,
                        "maxItems": 2,
                        "maxLength": 32,
                        "minItems": 1,
                        "type": "string"
                      },
                      "readonly": false,
                      "required": false,
                      "title": "TextField",
                      "type": "array"
                    },
                    "46872_4_x_23": {
                      "items": {
                        "defaultItems": 1,
                        "maxItems": 2,
                        "minItems": 1,
                        "type": "string"
                      },
                      "readonly": false,
                      "required": false,
                      "title": "TextArea",
                      "type": "array"
                    },
                    "46872_4_x_24": {
                      "items": {
                        "defaultItems": 1,
                        "enum": [
                          "wqe",
                          "sad",
                          "esf",
                          "asd",
                          "sf",
                          "af",
                          "awda",
                          "fd",
                          "fg",
                          "H",
                          "HA",
                          "A",
                          "S",
                          "FGH",
                          "AS",
                          "XSS",
                          "67SD",
                          "*S",
                          "8jkj"
                        ],
                        "maxItems": 2,
                        "minItems": 1,
                        "type": "string"
                      },
                      "readonly": false,
                      "required": false,
                      "title": "TextPopUp",
                      "type": "array"
                    },
                    "46872_4_x_25": {
                      "items": {
                        "defaultItems": 1,
                        "enum": [],
                        "maxItems": 2,
                        "minItems": 1,
                        "parents": [],
                        "type": "String"
                      },
                      "readonly": false,
                      "required": false,
                      "title": "TKL",
                      "type": "array"
                    },
                    "46872_4_x_26": {
                      "items": {
                        "defaultItems": 1,
                        "maxItems": 2,
                        "minItems": 1,
                        "type": "otcs_user_picker"
                      },
                      "readonly": false,
                      "required": false,
                      "title": "UserField",
                      "type": "array"
                    }
                  },
                  "type": "object"
                },
                "title": "SetMultiValue",
                "type": "array"
              },
              "46872_4_1": {
                "type": "string"
              }
            },
            "type": "object"
          }
        };
        formModel = new FormModel(form);
        categoryFormView = new CategoryFormView({
          model: formModel,
          context: new PageContext({
            factories: {
              connector: {
                connection: {
                  url: '//server/otcs/cs/api/v1/',
                  supportPath: '/support',
                  session: {
                    ticket: 'dummy'
                  }
                }
              }
            }
          })
        });
        categoryFormView.render();
        $('<div id="form"/>').appendTo('body').append(categoryFormView.$el);
        asyncTestUtils.asyncElement(categoryFormView.$el, '.cs-array.alpaca-container-item').done(function(el) {
          responsiveSet = categoryFormView.$el.find('.cs-form-set');
          done();
        });
      });

      xit("Responsive on window resize [medium]", function (done) {
        $(window).resize(function () {
          $('body #form').height(300);
          $('body #form').width(800);
        });
        $(window).trigger('resize');
        asyncTestUtils.asyncElement(responsiveSet, '.csui-show-colout').done(function(el) {
          expect(responsiveSet.find('.csui-show-colout').length).toEqual(1);
          expect(responsiveSet.find('.csui-shadowleft-container').length).toEqual(1);
          expect(responsiveSet.find('.csui-shadowright-container').length).toEqual(1);
          done();
        });
      });
      xit("expect popover to open on clicking on colout when close [medium]", function (done) {
        expect(responsiveSet.find('.binf-popover').length).toEqual(0);
        responsiveSet.find('.csui-show-colout-46872_4_0').trigger('click');
        asyncTestUtils.asyncElement(responsiveSet, '.binf-popover:visible').done(function(el) {
          expect(el.length).toEqual(1);
          expect(responsiveSet.find('.csui-set-scroll-container-parent' +
                                    ' .csui-set-scroll-container-child .ps-scrollbar-x-rail').length).toEqual(
              1);
          done();
        });
      });
      xit("expect popover to be read only [medium]", function () {
        expect(responsiveSet.find('.binf-popover-content .csui-colout-formitems .cs-form-read').length).toEqual(1);
      });
      xit("expect popover to close on clicking on colout when open [medium]", function (done) {
        expect(responsiveSet.find('.binf-popover').length).toEqual(1);
        responsiveSet.find('.csui-show-colout-46872_4_0').trigger('click');
        asyncTestUtils.asyncElement(responsiveSet, '.binf-popover', true).done(function(el) {
          expect(el.length).toEqual(0);
          done();
        });
      });
      afterAll(function () {
        $('body').empty();
        formModel.destroy();
        categoryFormView.destroy();
        form = {};
      });

    });

  });

});
