/* Copyright (c) 2016-2017  OpenText Corp. All Rights Reserved. */

define(["csui/lib/jquery",
  "csui/lib/underscore",
  "csui/lib/backbone",
  "csui/lib/marionette",
  "csui/utils/base",
  "csui/controls/form/form.view",
  'csui/widgets/metadata/general.panels/document/document.general.form.model',
  'csui/utils/contexts/page/page.context',
  'csui/utils/connector',
  'csui/utils/contexts/factories/connector',
  'csui/models/action',
  'csui/models/actions',
  'csui/models/node/node.model',
  'csui/widgets/metadata/property.panels/categories/impl/category.form.view',
  './tklfield.mock.js',
  '../../../utils/testutils/async.test.utils.js',
  'csui/lib/bililiteRange',
  'csui/lib/jquery.simulate',
  'csui/lib/jquery.simulate.ext',
  'csui/lib/jquery.simulate.key-sequence'
], function ($, _, Backbone, Marionette, base, FormView, DocumentGeneralFormModel,
    PageContext, Connector, ConnectionFactory, ActionModel,
    ActionCollection, NodeModel, CategoryFormView, Mock, testUtils) {
  'use strict';
  describe("Form Controls", function () {

    describe("TKLFieldView", function () {
      var context, form, formModel, formView, node, connector, formElements,
          multivalueParentMultivalueChildModel, standaloneParentMultivalueChildModel;

      standaloneParentMultivalueChildModel = {
        "data": {
          "60663_2": null,
          "60663_3": ["", "", ""],
          "60663_4": "",
          "60663_5": ["", "", ""],
          "60663_6": "",
          "60663_7": ["", "", ""],
          "60663_8": null,
          "60663_9": ["", "", ""],
          "60663_10": null,
          "60663_11": ["", "", ""],
          "60663_12": null,
          "60663_13": ["", "", ""]
        },
        "options": {
          "fields": {
            "60663_2": {
              "hidden": false,
              "hideInitValidationError": true,
              "label": "Integer",
              "readonly": false,
              "type": "integer"
            },
            "60663_3": {
              "fields": {"item": {"type": "tkl"}},
              "hidden": false,
              "hideInitValidationError": true,
              "items": {"showMoveDownItemButton": false, "showMoveUpItemButton": false},
              "label": "TKL",
              "readonly": false,
              "toolbarSticky": true
            },
            "60663_4": {
              "hidden": false,
              "hideInitValidationError": true,
              "label": "TextField",
              "readonly": false,
              "type": "text"
            },
            "60663_5": {
              "fields": {"item": {"type": "tkl"}},
              "hidden": false,
              "hideInitValidationError": true,
              "items": {"showMoveDownItemButton": false, "showMoveUpItemButton": false},
              "label": "TextTKLField",
              "readonly": false,
              "toolbarSticky": true
            },
            "60663_6": {
              "hidden": false,
              "hideInitValidationError": true,
              "label": "TextMultiline",
              "readonly": false,
              "type": "textarea"
            },
            "60663_7": {
              "fields": {"item": {"type": "tkl"}},
              "hidden": false,
              "hideInitValidationError": true,
              "items": {"showMoveDownItemButton": false, "showMoveUpItemButton": false},
              "label": "TextMultilineTKL",
              "readonly": false,
              "toolbarSticky": true
            },
            "60663_8": {
              "hidden": false,
              "hideInitValidationError": true,
              "label": "IntegerPopup",
              "readonly": false,
              "type": "radio"
            },
            "60663_9": {
              "fields": {"item": {"type": "tkl"}},
              "hidden": false,
              "hideInitValidationError": true,
              "items": {"showMoveDownItemButton": false, "showMoveUpItemButton": false},
              "label": "IntegerPopupTKL",
              "readonly": false,
              "toolbarSticky": true
            },
            "60663_10": {
              "hidden": false,
              "hideInitValidationError": true,
              "label": "TKL",
              "readonly": false,
              "type": "tkl"
            },
            "60663_11": {
              "fields": {"item": {"type": "tkl"}},
              "hidden": false,
              "hideInitValidationError": true,
              "items": {"showMoveDownItemButton": false, "showMoveUpItemButton": false},
              "label": "ChildTKL",
              "readonly": false,
              "toolbarSticky": true
            },
            "60663_12": {
              "hidden": false,
              "hideInitValidationError": true,
              "label": "UserField",
              "readonly": false,
              "type": "otcs_user_picker"
            },
            "60663_13": {
              "fields": {"item": {"type": "tkl"}},
              "hidden": false,
              "hideInitValidationError": true,
              "items": {"showMoveDownItemButton": false, "showMoveUpItemButton": false},
              "label": "UserFieldTKL",
              "readonly": false,
              "toolbarSticky": true
            }
          },
          "form": {
            "attributes": {
              "action": "api\/v1\/nodes\/27601\/categories\/60663",
              "method": "PUT"
            }, "renderForm": true
          }
        },
        "schema": {
          "properties": {
            "60663_2": {
              "readonly": false,
              "required": false,
              "title": "Integer",
              "type": "integer"
            },
            "60663_3": {
              "items": {
                "defaultItems": 3,
                "enum": [],
                "maxItems": 4,
                "minItems": 1,
                "parents": [2],
                "type": "String"
              }, "readonly": false, "required": false, "title": "TKL", "type": "array"
            },
            "60663_4": {
              "maxLength": 32,
              "readonly": false,
              "required": false,
              "title": "TextField",
              "type": "string"
            },
            "60663_5": {
              "items": {
                "defaultItems": 3,
                "enum": [],
                "maxItems": 4,
                "minItems": 1,
                "parents": [4],
                "type": "String"
              },
              "readonly": false,
              "required": false,
              "title": "TextTKLField",
              "type": "array"
            },
            "60663_6": {
              "readonly": false,
              "required": false,
              "title": "TextMultiline",
              "type": "string"
            },
            "60663_7": {
              "items": {
                "defaultItems": 3,
                "enum": [],
                "maxItems": 3,
                "minItems": 1,
                "parents": [6],
                "type": "String"
              },
              "readonly": false,
              "required": false,
              "title": "TextMultilineTKL",
              "type": "array"
            },
            "60663_8": {
              "enum": [2000, 3000, 4000],
              "readonly": false,
              "required": false,
              "title": "IntegerPopup",
              "type": "integer"
            },
            "60663_9": {
              "items": {
                "defaultItems": 3,
                "enum": [],
                "maxItems": 3,
                "minItems": 1,
                "parents": [8],
                "type": "String"
              },
              "readonly": false,
              "required": false,
              "title": "IntegerPopupTKL",
              "type": "array"
            },
            "60663_10": {
              "enum": [],
              "parents": [],
              "readonly": false,
              "required": false,
              "title": "TKL",
              "type": "String"
            },
            "60663_11": {
              "items": {
                "defaultItems": 3,
                "enum": [],
                "maxItems": 3,
                "minItems": 1,
                "parents": [10],
                "type": "String"
              }, "readonly": false, "required": false, "title": "ChildTKL", "type": "array"
            },
            "60663_12": {
              "readonly": false,
              "required": false,
              "title": "UserField",
              "type": "otcs_user_picker"
            },
            "60663_13": {
              "items": {
                "defaultItems": 3,
                "enum": [],
                "maxItems": 3,
                "minItems": 1,
                "parents": [12],
                "type": "String"
              }, "readonly": false, "required": false, "title": "UserFieldTKL", "type": "array"
            }
          }, "type": "object"
        }
      };

      multivalueParentMultivalueChildModel = {

        "data": {
          "60717_2": [null, null],
          "60717_3": ["", "", ""],
          "60717_4": ["", ""],
          "60717_5": ["", "", ""],
          "60717_6": ["", ""],
          "60717_7": ["", "", ""],
          "60717_8": [null, null],
          "60717_9": ["", "", ""],
          "60717_10": ["", ""],
          "60717_11": ["", "", ""],
          "60717_12": [null, null],
          "60717_13": ["", "", ""]
        },
        "options": {
          "fields": {
            "60717_2": {
              "fields": {"item": {"type": "integer"}},
              "hidden": false,
              "hideInitValidationError": true,
              "items": {"showMoveDownItemButton": false, "showMoveUpItemButton": false},
              "label": "Integer",
              "readonly": false,
              "toolbarSticky": true
            },
            "60717_3": {
              "fields": {"item": {"type": "tkl"}},
              "hidden": false,
              "hideInitValidationError": true,
              "items": {"showMoveDownItemButton": false, "showMoveUpItemButton": false},
              "label": "TKL",
              "readonly": false,
              "toolbarSticky": true
            },
            "60717_4": {
              "fields": {"item": {"type": "text"}},
              "hidden": false,
              "hideInitValidationError": true,
              "items": {"showMoveDownItemButton": false, "showMoveUpItemButton": false},
              "label": "TextField",
              "readonly": false,
              "toolbarSticky": true
            },
            "60717_5": {
              "fields": {"item": {"type": "tkl"}},
              "hidden": false,
              "hideInitValidationError": true,
              "items": {"showMoveDownItemButton": false, "showMoveUpItemButton": false},
              "label": "TextTKLField",
              "readonly": false,
              "toolbarSticky": true
            },
            "60717_6": {
              "fields": {"item": {"type": "textarea"}},
              "hidden": false,
              "hideInitValidationError": true,
              "items": {"showMoveDownItemButton": false, "showMoveUpItemButton": false},
              "label": "TextMultiline",
              "readonly": false,
              "toolbarSticky": true
            },
            "60717_7": {
              "fields": {"item": {"type": "tkl"}},
              "hidden": false,
              "hideInitValidationError": true,
              "items": {"showMoveDownItemButton": false, "showMoveUpItemButton": false},
              "label": "TextMultilineTKL",
              "readonly": false,
              "toolbarSticky": true
            },
            "60717_8": {
              "fields": {"item": {"type": "select"}},
              "hidden": false,
              "hideInitValidationError": true,
              "items": {"showMoveDownItemButton": false, "showMoveUpItemButton": false},
              "label": "IntegerPopup",
              "readonly": false,
              "toolbarSticky": true
            },
            "60717_9": {
              "fields": {"item": {"type": "tkl"}},
              "hidden": false,
              "hideInitValidationError": true,
              "items": {"showMoveDownItemButton": false, "showMoveUpItemButton": false},
              "label": "IntegerPopupTKL",
              "readonly": false,
              "toolbarSticky": true
            }, "60717_10": {
              "fields": {"item": {"type": "tkl"}},
              "hidden": false,
              "hideInitValidationError": true,
              "items": {"showMoveDownItemButton": false, "showMoveUpItemButton": false},
              "label": "TKL",
              "readonly": false
            },
            "60717_11": {
              "fields": {"item": {"type": "tkl"}},
              "hidden": false,
              "hideInitValidationError": true,
              "items": {"showMoveDownItemButton": false, "showMoveUpItemButton": false},
              "label": "ChildTKL",
              "readonly": false,
              "toolbarSticky": true
            },
            "60717_12": {
              "fields": {
                "item": {
                  "type": "otcs_user_picker",
                  "type_control": {}
                }
              },
              "hidden": false,
              "hideInitValidationError": true,
              "items": {"showMoveDownItemButton": false, "showMoveUpItemButton": false},
              "label": "UserField",
              "readonly": false
            },
            "60717_13": {
              "fields": {"item": {"type": "tkl"}},
              "hidden": false,
              "hideInitValidationError": true,
              "items": {"showMoveDownItemButton": false, "showMoveUpItemButton": false},
              "label": "UserFieldTKL",
              "readonly": false,
              "toolbarSticky": true
            }
          },
          "form": {
            "attributes": {
              "action": "api\/v1\/nodes\/27601\/categories\/60717",
              "method": "PUT"
            }, "renderForm": true
          }
        },
        "schema": {
          "properties": {
            "60717_2": {
              "items": {
                "defaultItems": 1,
                "maxItems": 2,
                "minItems": 1,
                "type": "integer"
              }, "readonly": false, "required": false, "title": "Integer", "type": "array"
            },
            "60717_3": {
              "items": {
                "defaultItems": 1,
                "enum": [],
                "maxItems": 3,
                "minItems": 1,
                "parents": [2],
                "type": "String"
              }, "readonly": false, "required": false, "title": "TKL", "type": "array"
            },
            "60717_4": {
              "items": {
                "defaultItems": 1,
                "maxItems": 3,
                "maxLength": 32,
                "minItems": 1,
                "type": "string"
              }, "readonly": false, "required": false, "title": "TextField", "type": "array"
            },
            "60717_5": {
              "items": {
                "defaultItems": 1,
                "enum": [],
                "maxItems": 4,
                "minItems": 1,
                "parents": [4],
                "type": "String"
              },
              "readonly": false,
              "required": false,
              "title": "TextTKLField",
              "type": "array"
            },
            "60717_6": {
              "items": {
                "defaultItems": 1,
                "maxItems": 3,
                "minItems": 1,
                "type": "string"
              },
              "readonly": false,
              "required": false,
              "title": "TextMultiline",
              "type": "array"
            },
            "60717_7": {
              "items": {
                "defaultItems": 1,
                "enum": [],
                "maxItems": 3,
                "minItems": 1,
                "parents": [6],
                "type": "String"
              },
              "readonly": false,
              "required": false,
              "title": "TextMultilineTKL",
              "type": "array"
            },
            "60717_8": {
              "items": {
                "defaultItems": 1,
                "enum": [2000, 3000, 4000],
                "maxItems": 3,
                "minItems": 1,
                "type": "integer"
              },
              "readonly": false,
              "required": false,
              "title": "IntegerPopup",
              "type": "array"
            },
            "60717_9": {
              "items": {
                "defaultItems": 1,
                "enum": [],
                "maxItems": 3,
                "minItems": 1,
                "parents": [8],
                "type": "String"
              },
              "readonly": false,
              "required": false,
              "title": "IntegerPopupTKL",
              "type": "array"
            },
            "60717_10": {
              "items": {
                "defaultItems": 3,
                "enum": ["CWS",
                  "Enterprise", "Content Server Policies"],
                "maxItems": 3,
                "minItems": 1,
                "type": "String"
              },
              "parents": [],
              "readonly": false,
              "required": false,
              "title": "TKL",
              "type": "array"
            },
            "60717_11": {
              "items": {
                "defaultItems": 3,
                "enum": [""],
                "maxItems": 3,
                "minItems": 1,
                "parents": [10],
                "type": "String"
              }, "readonly": false, "required": false, "title": "ChildTKL", "type": "array"
            },
            "60717_12": {
              "items": {
                "defaultItems": 3,
                "maxItems": 3,
                "minItems": 1,
                "type": "otcs_user_picker"
              },
              "readonly": false,
              "required": false,
              "title": "UserField",
              "type": "array"
            },
            "60717_13": {
              "items": {
                "defaultItems": 3,
                "enum": [""],
                "maxItems": 3,
                "minItems": 1,
                "parents": [12],
                "type": "String"
              }, "readonly": false, "required": false, "title": "UserFieldTKL", "type": "array"
            }
          }, "type": "object"
        }

      };

      context = new PageContext({
        factories: {
          connector: {
            connection: {
              url: '//server/otcs/cs/api/v1',
              supportPath: '/support',
              session: {
                ticket: 'dummy'
              }
            }
          }
        }
      });

      connector = context.getObject(ConnectionFactory);

      node = new NodeModel({id: 162675}, {
        connector: connector
      });

      beforeAll(function () {
        Mock.enable();

      });

      afterAll(function () {
        Mock.disable();
      });

      describe("as a control", function () {

        beforeAll(function (done) {

          formModel = new Backbone.Model({
            "data": {
              "151469_6": "CWS",
              "151469_3": "140988"
            },
            "options": {
              "fields": {
                "151469_6": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "Parent_TextField",
                  "readonly": false,
                  "type": "text"
                },
                "151469_3": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "TKL",
                  "readonly": false,
                  "type": "tkl"
                }
              },
              "form": {
                "attributes": {
                  "action": "api\/v1\/nodes\/106118\/categories\/151469",
                  "method": "PUT"
                },
                "renderForm": true
              }
            },
            "schema": {
              "properties": {
                "151469_6": {
                  "maxLength": 32,
                  "readonly": false,
                  "required": false,
                  "title": "Parent_TextField",
                  "type": "string"
                },
                "151469_3": {
                  "enum": ["140988"],
                  "parents": [6],
                  "readonly": false,
                  "required": false,
                  "title": "TKL",
                  "type": "String"
                }
              },
              "type": "object"
            }
          });

          formView = new CategoryFormView({model: formModel, node: node, context: context});
          $('body').append("<div id='tkl-div-region'></div>");

          new Marionette.Region({
            el: "#tkl-div-region"
          }).show(formView);

          formView.$form.postRender;
          testUtils.asyncElement(formView.$el, '.cs-formfield.cs-tklfield').done(
              function () {
                done();
              });

        });

        it("can be instantiated [Low]", function () {
          expect(formView).toBeDefined();
        });

        it('assigns right classes [Medium]', function () {
          var className = formView.form.children[1].fieldView.$el.attr('class');
          expect(className).toBeDefined();
          var classes = className.split(' ');
          expect(classes).toContain('cs-formfield', 'cs-tklfield');
        });

        it('can be edited [High]', function (done) {
          var tklReadFieldButton = formView.form.children[0].fieldView.$el.find(
              '.cs-field-read button');
          var tklReadField = formView.form.children[0].fieldView.$el.find('.cs-field-read');
          tklReadField.trigger('click');
          testUtils.asyncElement(formView.$el, '.cs-field-write.binf-hidden', true).done(
              function (el) {
                expect(el.length).toEqual(0);
                expect(tklReadField.hasClass('binf-hidden')).toBeTruthy();
                done();
              });
        });

        it('on change of parent tkl value,child tkl field is set to none [High]', function (done) {
          var writeField = formView.form.children[0].fieldView.$el.find(
              'div.cs-field-write > div > input');
          writeField.val('Enterprise');
          var readTklField = formView.form.children[1].fieldView.$el.find(
              'div.cs-field-read button > span');
          expect(readTklField.text()).toEqual('140988');
          var field = formView.form.children[0].fieldView.ui.writeField;
          field.trigger('focusout');
          testUtils.asyncElement(formView.$el,
              'div.cs-field-read:eq(1) button > span[title="None"]').done(
              function (el) {
                expect(el.length).toEqual(1);
                expect(formView.$el.find('div.cs-field-read:eq(1) button > span').text()).toEqual(
                    'None');
                done();
              });
        });

        it('on change of child tkl ,child tkl drop down is populated with corresponding mapped' +
           ' value [High]', function (done) {
          var childField = formView.form.children[1].fieldView.$el.find(
              'div.cs-field-write .cs-tkl-search-box input');
          childField.trigger('mouseup');
          testUtils.asyncElement(formView.$el, '.cs-tkl-options-container.binf-show' +
                                               ' li:nth-child(2) > a').done(
              function (el) {
                expect(el.length).toEqual(1);
                expect(formView.$el.find('.cs-tkl-options-container.binf-show li > a').eq(
                    1).text()).toEqual('2000');
                done();
              });
        });

        it('on clicking outside corresponding child tkl goes to read mode and child' +
           ' tkl is set to none [Medium]', function (done) {
          var formDivElement = formView.$el.find('.cs-form.cs-form-update');
          formDivElement.trigger('mouseup');
          testUtils.asyncElement(formView.$el, 'div.cs-field-write.binf-hidden').done(
              function (el) {
                expect(el.length).toEqual(2);
                expect(formView.$el.find('div.cs-field-read:eq(1) button > span').text()).toEqual(
                    'None');
                done();
              });
        });

        afterAll(function () {
          formView.destroy();
          formModel.destroy();
          $('body').empty();
        });

      });

      describe("for set", function () {

        var setElement, tklFields;

        beforeAll(function (done) {
          formModel = new Backbone.Model({
            "data": {
              "7941736_3": [
                {
                  "7941736_3_x_8": null,
                  "7941736_3_x_9": null
                },
                {
                  "7941736_3_x_8": null,
                  "7941736_3_x_9": null
                }
              ],
              "7941736_3_1": null,
              "7941736_3_2": null
            },
            "options": {
              "fields": {
                "7941736_3": {
                  "fields": {
                    "item": {
                      "fields": {
                        "7941736_3_x_8": {
                          "hidden": false,
                          "hideInitValidationError": true,
                          "label": "ParentTKL",
                          "readonly": false,
                          "type": "tkl"
                        },
                        "7941736_3_x_9": {
                          "hidden": false,
                          "hideInitValidationError": true,
                          "label": "ChildTKL",
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
                  "label": "SetWithLockedField",
                  "toolbarSticky": true
                },
                "7941736_3_1": {
                  "hidden": true
                },
                "7941736_3_2": {
                  "hidden": true
                }
              },
              "form": {
                "attributes": {
                  "action": "api/v1/nodes/2316862/categories/7941736",
                  "method": "PUT"
                },
                "renderForm": true
              }
            },
            "schema": {
              "properties": {
                "7941736_3": {
                  "items": {
                    "maxItems": 2,
                    "minItems": 2,
                    "properties": {
                      "7941736_3_x_8": {
                        "enum": [],
                        "parents": [],
                        "readonly": false,
                        "required": false,
                        "title": "ParentTKL",
                        "type": "String"
                      },
                      "7941736_3_x_9": {
                        "enum": [],
                        "parents": [
                          8
                        ],
                        "readonly": false,
                        "required": false,
                        "title": "ChildTKL",
                        "type": "String"
                      }
                    },
                    "type": "object"
                  },
                  "title": "SetWithLockedField",
                  "type": "array"
                },
                "7941736_3_1": {
                  "type": "string"
                },
                "7941736_3_2": {
                  "type": "string"
                }
              },
              "type": "object"
            }
          });

          formView = new CategoryFormView({model: formModel, node: node, context: context});
          $('body').append("<div id='tkl-inside-set-div-region'></div>");

          new Marionette.Region({
            el: "#tkl-inside-set-div-region"
          }).show(formView);
          formView.$form.postRender;

          testUtils.asyncElement(formView.$el, '.cs-form-set', false).done(
              function (el) {
                setElement = formView.$el.find('.cs-form-set').children('div:eq(0)');
                tklFields = setElement.find('.cs-formfield.cs-tklfield');
                done();
              });
        });

        xdescribe("with single dependent TKL ", function () {

          it('contains TKL fields [Low]', function () {
            expect(tklFields.length).toEqual(4);
          });

          it('initially TKL fields value are none and are in read mode [Medium]', function () {
            expect(setElement.find('.cs-field-write.binf-hidden').length).toEqual(4);
            for (var i = 0; i < tklFields.length; i++) {
              if (tklFields.eq(i).children('div.cs-field-read')[0] !== undefined) {
                expect(tklFields.eq(i).children('div.cs-field-read').find(
                    'div > button > span').attr('title')).toBe('None');
              }
            }
          });

          it('on click of parent TKL field all fields goes to write mode [High]', function (done) {
            expect(setElement.find(".csui-bulk-edit-cancel.binf-hidden").length).toEqual(1);
            var tklReadFieldButton = tklFields.children('div.cs-field-read:eq(0)').find(
                'div > button');
            tklReadFieldButton.trigger('click');
            testUtils.asyncElement(tklFields, 'div.cs-field-write.binf-hidden', true).done(
                function (el) {
                  expect(el.length).toEqual(0);
                  var visibleWriteFields = tklFields.children(
                      'div.cs-field-write:not(.binf-hidden)');
                  expect(visibleWriteFields.length).toEqual(4);
                  expect(
                      setElement.find(".csui-bulk-edit-cancel:not(.binf-hidden)").length).toEqual(
                      1);
                  done();
                });
          });

          it('on click of parent TKL field in write mode parent tkl field drop down is' +
             ' visible [High]', function (done) {
            var visibleWriteFields = tklFields.children('div.cs-field-write:not(.binf-hidden)');
            expect(visibleWriteFields.length).toEqual(4);
            var tklWriteFieldInput = tklFields.children('div.cs-field-write:eq(0)').find(
                'div > input');
            tklWriteFieldInput.trigger('mouseup');
            testUtils.asyncElement(tklFields, '.cs-tkl-options-container.binf-show').done(
                function (el) {
                  expect(el.length).toEqual(1);
                  var visibleWriteFields = tklFields.children(
                      'div.cs-field-write:not(.binf-hidden)');
                  expect(visibleWriteFields.length).toEqual(4);
                  expect(
                      setElement.find(".csui-bulk-edit-cancel:not(.binf-hidden)").length).toEqual(
                      1);
                  done();
                });
          });

          it('on change of parent TKL field in write mode child tkl ' +
             ' value is reset to none and parent tkl is populated with selected value[High]',
              function (done) {
                var tklDropDown = tklFields.find('.cs-tkl-options-container.binf-show');
                var selectedElement = tklDropDown.find('li > a').eq(1);
                selectedElement.trigger('click');
                testUtils.asyncElement(tklFields, '.cs-tkl-options-container.binf-show', true).done(
                    function (el) {
                      expect(el.length).toEqual(0);
                      expect(tklFields.eq(0).children('div.cs-field-read').find(
                          'div > button > span').attr('title')).toBe('Enterprise');
                      done();
                    });
              });

          it('on click of child TKL field in write mode when parent tkl is changed' +
             ' child TKL list is populated [High]', function (done) {
            var dropDownLength = tklFields.find('.cs-tkl-options-container.binf-show').length;
            expect(dropDownLength).toEqual(0);
            var tklChildInput = tklFields.children('div.cs-field-write:eq(1)').find(
                'div > input');
            tklChildInput.trigger('mouseup');
            testUtils.asyncElement(tklFields,
                '.cs-tkl-options-container.binf-show li:nth-child(2) > a').done(function (el) {
              expect(el.length).toEqual(1);
              var childDropDown = tklFields.find('.cs-tkl-options-container.binf-show');
              var populatedElement = childDropDown.find('li > a').eq(1);
              expect(populatedElement.text()).toEqual('2000');
              done();
            });
          });

          it('on click of child TKL field in write mode child TKL value is set [High]',
              function (done) {
                var tklDropDown = tklFields.find('.cs-tkl-options-container.binf-show');
                var selectedElement = tklDropDown.find('li > a').eq(1);
                selectedElement.trigger('click');
                testUtils.asyncElement(tklFields, '.cs-tkl-options-container.binf-show',
                    true).done(function (el) {
                  expect(el.length).toEqual(0);
                  expect(tklFields.eq(1).children('div.cs-field-read').find(
                      'div > button > span').attr('title')).toBe('2000');
                  done();
                });
              });

          it('on change of parent TKL field child tkl value is set to none[High]',
              function (done) {
                var tklParentInput = tklFields.children('div.cs-field-write:eq(0)').find(
                    'div > input');
                tklParentInput.trigger('mouseup');
                testUtils.asyncElement(tklFields, '.cs-tkl-options-container.binf-show').done(
                    function (el) {
                      expect(el.length).toEqual(1);
                      var tklDropDown = tklFields.find('.cs-tkl-options-container.binf-show');
                      var selectedElement = tklDropDown.find('li > a').eq(2);
                      selectedElement.trigger('click');
                      testUtils.asyncElement(tklFields, '.cs-tkl-options-container.binf-show',
                          true).done(
                          function (el) {
                            expect(el.length).toEqual(0);
                            expect(tklFields.eq(1).children('div.cs-field-read').find(
                                'div > button > span').attr('title')).toBe('None');
                            done();
                          });
                    });
              });

          it('on click of cancel edit icon , TKL fields are in read mode[Medium]',
              function (done) {
                var visibleWriteFields = tklFields.children('div.cs-field-write:not(.binf-hidden)');
                expect(visibleWriteFields.length).toEqual(4);
                expect(setElement.find(".csui-bulk-edit-cancel:not(.binf-hidden)").length).toEqual(
                    1);
                var cancelButton = setElement.find('.csui-bulk-edit-cancel');
                cancelButton.trigger('click');
                testUtils.asyncElement(setElement, 'div.cs-field-read.binf-hidden', true).done(
                    function (el) {
                      expect(el.length).toEqual(0);
                      tklFields = setElement.find('.cs-formfield.cs-tklfield');
                      var readFields = tklFields.children('div.cs-field-read:not(.binf-hidden)');
                      expect(readFields.length).toEqual(4);
                      expect(setElement.find(".csui-bulk-edit-cancel.binf-hidden").length).toEqual(
                          1);
                      done();
                    });
              });
        });

        afterAll(function () {
          formView.destroy();
          formModel.destroy();
          $('body').empty();
        });

      });

      describe("for standalone", function () {
        beforeAll(function (done) {
          formModel = new Backbone.Model({
            "data": {
              "60743_2": null,
              "60743_3": null,
              "60743_4": null,
              "60743_5": null,
              "60743_6": null,
              "60743_7": null,
              "60743_9": "2017-09-11T00:00:00",
              "60743_10": null,
              "60743_11": null,
              "60743_12": null,
              "60743_13": 1001,
              "60743_14": "00 Arvinder cat attr",
              "60743_15": null,
              "60743_16": null,
              "60743_17": null,
              "60743_18": null,
              "60743_19": null,
              "60743_20": null
            },
            "options": {
              "fields": {
                "60743_2": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "Integer",
                  "readonly": false,
                  "type": "integer"
                },
                "60743_3": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "TKL",
                  "readonly": false,
                  "type": "tkl",
                  "validate": false
                },
                "60743_4": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "TextField",
                  "readonly": false,
                  "type": "text"
                },
                "60743_5": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "TextTKLField",
                  "readonly": false,
                  "type": "tkl"
                },
                "60743_6": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "TextMultiline",
                  "readonly": false,
                  "type": "textarea"
                },
                "60743_7": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "TextMultilineTKL",
                  "readonly": false,
                  "type": "tkl"
                },
                "60743_9": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "DatePopup",
                  "optionLabels": [
                    "2017-09-11",
                    "2017-09-14"
                  ],
                  "readonly": false,
                  "type": "radio"
                },
                "60743_10": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "TKLDatePopup",
                  "readonly": false,
                  "type": "tkl"
                },
                "60743_11": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "DateField",
                  "readonly": false,
                  "type": "datetime",
                  "validate": false
                },
                "60743_12": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "DateFieldTKL",
                  "readonly": false,
                  "type": "tkl"
                },
                "60743_13": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "IntegerPopup",
                  "readonly": false,
                  "type": "radio"
                },
                "60743_14": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "IntegerPopupTKL",
                  "readonly": false,
                  "type": "tkl"
                },
                "60743_15": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "TextPopup",
                  "readonly": false,
                  "type": "select"
                },
                "60743_16": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "TextPopupTKL",
                  "readonly": false,
                  "type": "tkl"
                },
                "60743_17": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "UserField",
                  "readonly": false,
                  "type": "otcs_user_picker"
                },
                "60743_18": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "UserFieldTKL",
                  "readonly": false,
                  "type": "tkl"
                },
                "60743_19": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "DateFieldOnly",
                  "readonly": false,
                  "type": "date"
                },
                "60743_20": {
                  "hidden": false,
                  "hideInitValidationError": true,
                  "label": "DateTKLField",
                  "readonly": false,
                  "type": "tkl"
                }
              },
              "form": {
                "attributes": {
                  "action": "api/v1/nodes/63924/categories/60743",
                  "method": "PUT"
                },
                "renderForm": true
              }
            },
            "schema": {
              "properties": {
                "60743_2": {
                  "readonly": false,
                  "required": false,
                  "title": "Integer",
                  "type": "integer"
                },
                "60743_3": {
                  "enum": [],
                  "parents": [
                    2
                  ],
                  "readonly": false,
                  "required": true,
                  "title": "TKL",
                  "type": "String"
                },
                "60743_4": {
                  "maxLength": 32,
                  "readonly": false,
                  "required": false,
                  "title": "TextField",
                  "type": "string"
                },
                "60743_5": {
                  "enum": [],
                  "parents": [
                    4
                  ],
                  "readonly": false,
                  "required": false,
                  "title": "TextTKLField",
                  "type": "String"
                },
                "60743_6": {
                  "readonly": false,
                  "required": false,
                  "title": "TextMultiline",
                  "type": "string"
                },
                "60743_7": {
                  "enum": [],
                  "parents": [
                    6
                  ],
                  "readonly": false,
                  "required": false,
                  "title": "TextMultilineTKL",
                  "type": "String"
                },
                "60743_9": {
                  "enum": [
                    "2017-09-11T00:00:00",
                    "2017-09-14T00:00:00"
                  ],
                  "readonly": false,
                  "required": false,
                  "title": "DatePopup",
                  "type": "string"
                },
                "60743_10": {
                  "enum": [],
                  "parents": [
                    9
                  ],
                  "readonly": false,
                  "required": false,
                  "title": "TKLDatePopup",
                  "type": "String"
                },
                "60743_11": {
                  "readonly": false,
                  "required": true,
                  "title": "DateField",
                  "type": "string"
                },
                "60743_12": {
                  "enum": [],
                  "parents": [
                    11
                  ],
                  "readonly": false,
                  "required": false,
                  "title": "DateFieldTKL",
                  "type": "String"
                },
                "60743_13": {
                  "enum": [
                    1001,
                    1000,
                    2000
                  ],
                  "readonly": false,
                  "required": false,
                  "title": "IntegerPopup",
                  "type": "integer"
                },
                "60743_14": {
                  "enum": [
                    "00 Arvinder cat attr"
                  ],
                  "parents": [
                    13
                  ],
                  "readonly": false,
                  "required": false,
                  "title": "IntegerPopupTKL",
                  "type": "String"
                },
                "60743_15": {
                  "enum": [
                    "AdminHome",
                    "RecycleBin",
                    "SliceFolder",
                    "enterprise"
                  ],
                  "readonly": false,
                  "required": false,
                  "title": "TextPopup",
                  "type": "string"
                },
                "60743_16": {
                  "enum": [],
                  "parents": [
                    15
                  ],
                  "readonly": false,
                  "required": false,
                  "title": "TextPopupTKL",
                  "type": "String"
                },
                "60743_17": {
                  "readonly": false,
                  "required": false,
                  "title": "UserField",
                  "type": "otcs_user_picker"
                },
                "60743_18": {
                  "enum": [],
                  "parents": [
                    17
                  ],
                  "readonly": false,
                  "required": false,
                  "title": "UserFieldTKL",
                  "type": "String"
                },
                "60743_19": {
                  "readonly": false,
                  "required": false,
                  "title": "DateFieldOnly",
                  "type": "string"
                },
                "60743_20": {
                  "enum": [],
                  "parents": [
                    19
                  ],
                  "readonly": false,
                  "required": false,
                  "title": "DateTKLField",
                  "type": "String"
                }
              },
              "type": "object"
            }
          });

          formView = new CategoryFormView({model: formModel, node: node, context: context});
          $('body').append("<div id='tkl-standalone-div-region'></div>");

          new Marionette.Region({
            el: "#tkl-standalone-div-region"
          }).show(formView);
          formView.$form.postRender;
          testUtils.asyncElement(formView.$el, '.cs-formfield').done(
              function (el) {
                formElements = formView.$el;
                done();
              });
        });
        describe("Integer field", function () {

          it('on click of integer field dependent tkl and integer field goes to write mode [Low]',
              function (done) {
                var integerValue = formElements.find('.cs-field-read:eq(0)');
                integerValue.trigger('click');
                testUtils.asyncElement(formElements, '.cs-field-write:not(.binf-hidden)').done(
                    function (el) {
                      expect(el.length).toEqual(2);
                      done();
                    });
              });

          it('on change of integer field dependent tkl drop down is populated with corresponding' +
             ' mapped value [High]',
              function (done) {
                formElements.find('.cs-field-write:eq(0) input').val("2000").submit();
                var tklField = formElements.find('.cs-field-write:eq(1) input');
                tklField.trigger('mouseup');
                testUtils.asyncElement(formElements, '.cs-tkl-options-container.binf-show' +
                                                     ' li:nth-child(4) > a').done(
                    function (el) {
                      expect(el.length).toEqual(1);
                      expect(formElements.find('.cs-tkl-options-container.binf-show li > a').eq(
                          1).text()).toEqual('2001');
                      done();
                    });
              });
          it('on clicking read field both tkl and integer field goes to read mode and tkl' +
             ' field is set to none [Medium]',
              function (done) {
                expect(formElements.find('.cs-tkl-options-container.binf-show').length).toEqual(1);
                expect(formElements.find('.cs-field-read:not(.binf-hidden)').length).toEqual(16);
                var writeField = formElements.find('.cs-field-write:eq(0) input');
                writeField.trigger('focusout');
                testUtils.asyncElement(formElements, '.cs-field-read.binf-hidden', true).done(
                    function (el) {
                      expect(el.length).toEqual(0);
                      expect(formElements.find('.cs-field-read:not(.binf-hidden)').length).toEqual(
                          18);
                      expect(formElements.find('div.cs-field-read div > button > span').eq(1).attr(
                          'title')).toBe('None');
                      done();
                    });
              });

        });
        afterAll(function () {
          formView.destroy();
          formModel.destroy();
          $('body').empty();
        });

      });

      describe("as multivalue tkl", function () {

        describe("dependency on stand alone ", function () {
          beforeAll(function (done) {

            formModel = new Backbone.Model(standaloneParentMultivalueChildModel);

            formView = new CategoryFormView({model: formModel, node: node, context: context});
            $('body').append("<div id='standalone-parent-multivalue-tkl-child-div-region'></div>");

            new Marionette.Region({
              el: "#standalone-parent-multivalue-tkl-child-div-region"
            }).show(formView);
            formView.$form.postRender;
            testUtils.asyncElement(formView.$el, '.cs-formfield').done(
                function () {
                  formElements = formView.$el;
                  done();
                });
          });
          describe("integer field", function () {
            var parentField, childFields, parentReadField, childReadFields, parentWriteField,
                childWriteFields, focusOutEvent;
            beforeAll(function () {
              parentField = formView.$el.find(
                  ".alpaca-container-item[data-alpaca-container-item-name='60663_2'] ");
              childFields = formView.$el.find(
                  ".alpaca-container-item[data-alpaca-container-item-name='60663_3'] .csui-multivalue-container .cs-formfield.cs-tklfield");
            });
            it('child fields turn to write mode once parent turns to write mode', function (done) {
              parentField.eq(0).find('.cs-field-read button').trigger('click');
              testUtils.asyncElement(parentField,
                  '.cs-field-read.binf-hidden').done(function () {
                expect(parentField.find('.cs-field-read.binf-hidden').length).toEqual(1);
                expect(parentField.find('.cs-field-write:not(.binf-hidden)').length).toEqual(1);
                expect(childFields.find('.cs-field-read.binf-hidden').length).toEqual(3);
                expect(childFields.find('.cs-field-write:not(.binf-hidden)').length).toEqual(3);
                done();
              });
            });

            describe("on change of parent value", function () {
              beforeAll(function () {
                parentReadField = parentField.find('.cs-field-read');
                parentWriteField = parentField.find('.cs-field-write input');
                childReadFields = childFields.find('.cs-field-read');
                childWriteFields = childFields.find('.cs-field-write input');
                focusOutEvent = {
                  target: parentField.find('input')[0],
                  relatedTarget: childWriteFields.find('input')[0]
                };
              });
              describe("should populate", function () {
                beforeAll(function () {
                  parentWriteField.val("2000");
                  parentField.alpaca().fieldView.getEditableBehavior().onFocusOutWrite(
                      focusOutEvent);
                });
                it('first child values with respect to parent value',
                    function (done) {
                      expect(parentWriteField.val())
                          .toEqual("2000");
                      childWriteFields.eq(0).trigger('mouseup');
                      testUtils.asyncElement(childFields.eq(0),
                          ".cs-tkl-options-container.binf-show ul li a[title!='None']").done(
                          function (el) {
                            expect(el.eq(0).attr('title')).toEqual('2001');
                            el.eq(0).trigger('click');
                            done();
                          });
                    });
                it('second child values with respect to parent value',
                    function (done) {
                      expect(parentWriteField.val())
                          .toEqual("2000");
                      childWriteFields.eq(1).trigger('mouseup');
                      testUtils.asyncElement(childFields.eq(1),
                          ".cs-tkl-options-container.binf-show ul li a[title!='None']").done(
                          function (el) {
                            expect(el.eq(1).attr('title')).toEqual('2002');
                            el.eq(1).trigger('click');
                            done();
                          });
                    });
              });

              it('should turn child values  to  none', function () {
                parentWriteField.val("3000");
                parentField.alpaca().fieldView.getEditableBehavior().onFocusOutWrite(focusOutEvent);
                expect(parentWriteField.val())
                    .toEqual("3000");
                childWriteFields = childFields.find('.cs-field-write input');
                expect(childWriteFields.eq(0).text()).toEqual("");
                expect(childWriteFields.eq(1).text()).toEqual("");
                expect(childWriteFields.eq(2).text()).toEqual("");
              });
            });
          });

          describe("Text Field", function () {
            var parentField, childFields, parentReadField, childReadFields, parentWriteField,
                childWriteFields, focusOutEvent;
            beforeAll(function () {
              parentField = formView.$el.find(
                  ".alpaca-container-item[data-alpaca-container-item-name='60663_4']");
              childFields = formView.$el.find(
                  ".alpaca-container-item[data-alpaca-container-item-name='60663_5'] .csui-multivalue-container .cs-formfield.cs-tklfield");
            });
            it('child fields turn to write mode once parent turns to write mode', function (done) {
              parentField.eq(0).find('.cs-field-read').trigger('click');
              testUtils.asyncElement(parentField,
                  '.cs-field-read.binf-hidden').done(function () {
                expect(parentField.find('.cs-field-read.binf-hidden').length).toEqual(1);
                expect(parentField.find('.cs-field-write:not(.binf-hidden)').length).toEqual(1);
                expect(childFields.find('.cs-field-read.binf-hidden').length).toEqual(3);
                expect(childFields.find('.cs-field-write:not(.binf-hidden)').length).toEqual(3);
                done();
              });
            });

            describe("on change of parent value", function () {
              beforeAll(function () {
                parentReadField = parentField.find('.cs-field-read');
                parentWriteField = parentField.find('.cs-field-write input');
                childReadFields = childFields.find('.cs-field-read');
                childWriteFields = childFields.find('.cs-field-write input');
                focusOutEvent = {
                  target: parentField.find('input')[0],
                  relatedTarget: childWriteFields.find('input')[0]
                };
              });
              describe("should populate", function () {
                beforeAll(function () {
                  parentWriteField.val("CWS");
                  parentField.alpaca().fieldView.getEditableBehavior().onFocusOutWrite(
                      focusOutEvent);
                });
                it('first child values with respect to parent value',
                    function (done) {
                      expect(parentWriteField.val())
                          .toEqual("CWS");
                      childWriteFields.eq(0).trigger('mouseup');
                      testUtils.asyncElement(childFields.eq(0),
                          ".cs-tkl-options-container.binf-show ul li a[title!='None']").done(
                          function (el) {
                            expect(el.eq(0).attr('title')).toEqual('123456');
                            el.eq(0).trigger('click');
                            done();
                          });
                    });
                it('second child values with respect to parent value',
                    function (done) {
                      expect(parentWriteField.val())
                          .toEqual("CWS");
                      childWriteFields.eq(1).trigger('mouseup');
                      testUtils.asyncElement(childFields.eq(1),
                          ".cs-tkl-options-container.binf-show ul li a[title!='None']").done(
                          function (el) {
                            expect(el.eq(0).attr('title')).toEqual('123456');
                            el.eq(0).trigger('click');
                            done();
                          });
                    });
              });

              it('should turn child values  to  none', function () {
                parentWriteField.val("Content Server Policies");
                parentField.alpaca().fieldView.getEditableBehavior().onFocusOutWrite(focusOutEvent);
                expect(parentWriteField.val())
                    .toEqual("Content Server Policies");
                childWriteFields = childFields.find('.cs-field-write input');
                expect(childWriteFields.eq(0).text()).toEqual("");
                expect(childWriteFields.eq(1).text()).toEqual("");
                expect(childWriteFields.eq(2).text()).toEqual("");
              });
            });
          });

          describe("TextMultiline Field", function () {
            var parentField, childFields, parentReadField, childReadFields, parentWriteField,
                childWriteFields, focusOutEvent;
            beforeAll(function () {
              parentField = formView.$el.find(
                  ".alpaca-container-item[data-alpaca-container-item-name='60663_6']");
              childFields = formView.$el.find(
                  ".alpaca-container-item[data-alpaca-container-item-name='60663_7'] .csui-multivalue-container .cs-formfield.cs-tklfield");
            });
            it('child fields turn to write mode once parent turns to write mode', function (done) {
              parentField.eq(0).find('.cs-field-read').trigger('click');
              testUtils.asyncElement(parentField,
                  '.cs-field-read.binf-hidden').done(function () {
                expect(parentField.find('.cs-field-read.binf-hidden').length).toEqual(1);
                expect(parentField.find('.cs-field-write:not(.binf-hidden)').length).toEqual(1);
                expect(childFields.find('.cs-field-read.binf-hidden').length).toEqual(3);
                expect(childFields.find('.cs-field-write:not(.binf-hidden)').length).toEqual(3);
                done();
              });
            });

            describe("on change of parent value", function () {
              beforeAll(function () {
                parentReadField = parentField.find('.cs-field-read');
                parentWriteField = parentField.find('.cs-field-write textarea');
                childReadFields = childFields.find('.cs-field-read');
                childWriteFields = childFields.find('.cs-field-write input');
                focusOutEvent = {
                  target: parentField.find('textarea')[0],
                  relatedTarget: childWriteFields.find('input')[0]
                };
              });
              describe("should populate", function () {
                beforeAll(function () {
                  parentWriteField.val("Content Server Policies");
                  parentField.alpaca().fieldView.getEditableBehavior().onFocusOutWrite(
                      focusOutEvent);
                });
                it('first child values with respect to parent value',
                    function (done) {
                      expect(parentWriteField.val())
                          .toEqual("Content Server Policies");
                      childWriteFields.eq(0).trigger('mouseup');
                      testUtils.asyncElement(childFields.eq(0),
                          ".cs-tkl-options-container.binf-show ul li a[title!='None']").done(
                          function (el) {
                            expect(el.eq(0).attr('title')).toEqual('143311');
                            el.eq(0).trigger('click');
                            done();
                          });
                    });
                it('second child values with respect to parent value',
                    function (done) {
                      expect(parentWriteField.val())
                          .toEqual("Content Server Policies");
                      childWriteFields.eq(1).trigger('mouseup');
                      testUtils.asyncElement(childFields.eq(1),
                          ".cs-tkl-options-container.binf-show ul li a[title!='None']").done(
                          function (el) {
                            expect(el.eq(0).attr('title')).toEqual('143311');
                            el.eq(0).trigger('click');
                            done();
                          });
                    });
              });

              it('should turn child values  to  none', function () {
                parentWriteField.val("CWS");
                parentField.alpaca().fieldView.getEditableBehavior().onFocusOutWrite(focusOutEvent);
                expect(parentWriteField.val())
                    .toEqual("CWS");
                childWriteFields = childFields.find('.cs-field-write input');
                expect(childWriteFields.eq(0).text()).toEqual("");
                expect(childWriteFields.eq(1).text()).toEqual("");
                expect(childWriteFields.eq(2).text()).toEqual("");
              });
            });

          });

          xdescribe("Select Field", function () {
            var parentField, childFields, parentReadField, childReadFields, parentWriteField,
                childWriteFields;
            beforeAll(function () {
              parentField = formView.$el.find(
                  ".alpaca-container-item[data-alpaca-container-item-name='60663_8']");
              childFields = formView.$el.find(
                  ".alpaca-container-item[data-alpaca-container-item-name='60663_9'] .csui-multivalue-container .cs-formfield.cs-tklfield");
            });
            it('child fields turn to write mode once parent turns to write mode', function (done) {
              parentField.eq(0).find('.cs-field-read').trigger('click');
              testUtils.asyncElement(parentField,
                  '.cs-field-read.binf-hidden').done(function () {
                expect(parentField.find('.cs-field-read.binf-hidden').length).toEqual(1);
                expect(parentField.find('.cs-field-write:not(.binf-hidden)').length).toEqual(1);
                expect(childFields.find('.cs-field-read.binf-hidden').length).toEqual(3);
                expect(childFields.find('.cs-field-write:not(.binf-hidden)').length).toEqual(3);
                done();
              });
            });

            describe("on change of parent value", function () {
              beforeAll(function () {
                parentReadField = parentField.find('.cs-field-read');
                parentWriteField = parentField.find('.cs-field-write button');
                childReadFields = childFields.find('.cs-field-read');
                childWriteFields = childFields.find('.cs-field-write input');
              });
              xdescribe("should populate", function () {
                beforeAll(function (done) {
                  parentWriteField.trigger('click');
                  testUtils.asyncElement(parentField,
                      ".cs-drop-down.binf-open ul li a span").done(function () {
                    parentField.find(".cs-drop-down.binf-open ul li a span").eq(2).trigger('click');
                    done();
                  });
                });
                it('first child values with respect to parent value',
                    function (done) {
                      expect(parentField.find('.cs-field-write button')[0].id)
                          .toEqual("3000");
                      childWriteFields.eq(0).trigger('mouseup');
                      testUtils.asyncElement(childFields,
                          ".cs-tkl-options-container.binf-show ul li a[title!='None']").done(
                          function (el) {
                            expect(el.eq(0).attr('title')).toEqual('3001');
                            el.eq(0).trigger('click');
                            done();
                          });
                    });
                it('second child values with respect to parent value',
                    function (done) {
                      expect(parentField.find('.cs-field-write button')[0].id)
                          .toEqual("3000");
                      childWriteFields.eq(1).trigger('mouseup');
                      testUtils.asyncElement(childFields,
                          ".cs-tkl-options-container.binf-show ul li a[title!='None']").done(
                          function (el) {
                            expect(el.eq(1).attr('title')).toEqual('3002');
                            el.eq(1).trigger('click');
                            done();
                          });
                    });
              });
              xit('should turn child values  to  none', function (done) {
                parentWriteField = parentField.find('.cs-field-write button');
                parentWriteField.trigger('click');
                testUtils.asyncElement(parentField,
                    ".cs-drop-down.binf-open ul li a span").done(function () {
                  parentField.find(".cs-drop-down.binf-open ul li a span").eq(1).trigger('click');
                  expect(parentField.find('.cs-field-write button').text())
                      .toEqual("2000");
                  childWriteFields = childFields.find('.cs-field-write input');
                  expect(childWriteFields.eq(0).text()).toEqual("");
                  expect(childWriteFields.eq(1).text()).toEqual("");
                  expect(childWriteFields.eq(2).text()).toEqual("");
                  done();
                });
              });
            });
          });

          describe("TKL Field", function () {
            var parentField, childFields, parentReadField, childReadFields, parentWriteField,
                childWriteFields;
            beforeAll(function () {
              parentField = formView.$el.find(
                  ".alpaca-container-item[data-alpaca-container-item-name='60663_10'] .cs-formfield.cs-tklfield");
              childFields = formView.$el.find(
                  ".alpaca-container-item[data-alpaca-container-item-name='60663_11'] .csui-multivalue-container .cs-formfield.cs-tklfield");
            });

            it('child fields turn to write mode once parent turns to write mode', function (done) {
              parentField.eq(0).find('.cs-field-read').trigger('click');
              testUtils.asyncElement(parentField,
                  '.cs-field-read.binf-hidden').done(function () {
                expect(parentField.find('.cs-field-read.binf-hidden').length).toEqual(1);
                expect(parentField.find('.cs-field-write:not(.binf-hidden)').length).toEqual(1);
                expect(childFields.find('.cs-field-read.binf-hidden').length).toEqual(3);
                expect(childFields.find('.cs-field-write:not(.binf-hidden)').length).toEqual(3);
                done();
              });
            });

            describe("on change of parent value", function () {
              beforeAll(function () {
                parentReadField = parentField.find('.cs-field-read');
                parentWriteField = parentField.find('.cs-field-write input');
                childReadFields = childFields.find('.cs-field-read');
                childWriteFields = childFields.find('.cs-field-write input');
              });
              describe("should populate", function () {
                beforeAll(function (done) {
                  parentWriteField.trigger('mouseup');
                  testUtils.asyncElement(parentField,
                      ".cs-tkl-options-container.binf-show ul li a[title!='None']").done(
                      function () {
                        parentField.find(".cs-tkl-options-container ul li a[title='CWS']").eq(
                            0).trigger('click');
                        done();
                      });
                });
                it('first child values with respect to parent value',
                    function (done) {
                      expect(parentField.find('.cs-field-write input').val())
                          .toEqual("CWS");
                      childWriteFields.eq(0).trigger('mouseup');
                      testUtils.asyncElement(childFields.eq(0),
                          ".cs-tkl-options-container ul li a[title!='None']").done(
                          function (el) {
                            expect(el.eq(0).attr('title')).toEqual('123456');
                            el.eq(0).trigger('click');
                            expect(childFields.find('.cs-field-write input').eq(0).val()).toEqual(
                                '123456');
                            done();
                          });
                    });
                it('second child values with respect to parent value',
                    function (done) {
                      expect(parentField.find('.cs-field-write input').val())
                          .toEqual("CWS");
                      childWriteFields = childFields.find('.cs-field-write input');
                      childWriteFields.eq(1).trigger('mouseup');
                      testUtils.asyncElement(childFields.eq(1),
                          ".cs-tkl-options-container.binf-show ul li a[title!='None']").done(
                          function (el) {
                            expect(el.eq(0).attr('title')).toEqual('123456');
                            el.eq(0).trigger('click');
                            expect(childFields.find('.cs-field-write input').eq(1).val()).toEqual(
                                '123456');
                            done();
                          });
                    });
              });

              it('should turn child values  to  none', function (done) {
                parentWriteField = parentField.find('.cs-field-write input');
                parentWriteField.trigger('mouseup');

                testUtils.asyncElement(parentField,
                    ".cs-tkl-options-container.binf-show ul li a[title!='None']").done(function () {

                  parentField.find(".cs-tkl-options-container ul li a[title='Enterprise']").eq(
                      0).trigger('click');
                  expect(parentField.find('.cs-field-write input').val()).toEqual("Enterprise");
                  childWriteFields = childFields.find('.cs-field-write input');
                  expect(childWriteFields.eq(0).text()).toEqual("");
                  expect(childWriteFields.eq(1).text()).toEqual("");
                  expect(childWriteFields.eq(2).text()).toEqual("");
                  done();
                });
              });
            });
          });

          describe("User Field", function () {
            var parentField, childFields, parentReadField, childReadFields, parentWriteField,
                childWriteFields;
            beforeAll(function () {
              parentField = formView.$el.find(
                  ".alpaca-container-item[data-alpaca-container-item-name='60663_12'] .cs-formfield.cs-userfield");
              childFields = formView.$el.find(
                  ".alpaca-container-item[data-alpaca-container-item-name='60663_13'] .csui-multivalue-container .cs-formfield.cs-tklfield");
            });

            it('child fields turn to write mode once parent turns to write mode', function (done) {
              parentField.eq(0).find('.cs-field-read').trigger('click');
              testUtils.asyncElement(parentField,
                  '.cs-field-read.binf-hidden').done(function () {
                expect(parentField.find('.cs-field-read.binf-hidden').length).toEqual(1);
                expect(parentField.find('.cs-field-write:not(.binf-hidden)').length).toEqual(1);
                expect(childFields.find('.cs-field-read.binf-hidden').length).toEqual(3);
                expect(childFields.find('.cs-field-write:not(.binf-hidden)').length).toEqual(3);
                done();
              });
            });

            describe("on change of parent value", function () {
              beforeAll(function () {
                parentReadField = parentField.find('.cs-field-read');
                parentWriteField = parentField.find('.cs-field-write input');
                childReadFields = childFields.find('.cs-field-read');
                childWriteFields = childFields.find('.cs-field-write input');
              });
              describe("should populate", function () {
                beforeAll(function (done) {
                  parentWriteField.val('c');
                  parentWriteField.trigger('keyup');
                  testUtils.asyncElement(parentField,
                      ".typeahead.ps-container ul[style*='display: block'] li").done(function (el) {
                    el.eq(0).trigger('click');
                    done();
                  });
                });
                xit('first child values with respect to parent value',
                    function (done) {
                      expect(parentField.find('.cs-field-write input').val())
                          .toEqual("Content Server Policies");
                      childWriteFields.eq(0).trigger('mouseup');
                      testUtils.asyncElement(childFields.eq(0),
                          ".cs-tkl-options-container.binf-show ul li a[title!='None']").done(
                          function (el) {
                            expect(el.eq(0).attr('title')).toEqual('143311');
                            el.eq(0).trigger('click');
                            expect(childFields.find('.cs-field-write input').eq(0).val()).toEqual(
                                '143311');
                            done();
                          });
                    });
                xit('second child values with respect to parent value',
                    function (done) {
                      expect(parentField.find('.cs-field-write input').val())
                          .toEqual("Content Server Policies");
                      childWriteFields.eq(1).trigger('mouseup');
                      testUtils.asyncElement(childFields.eq(1),
                          ".cs-tkl-options-container.binf-show ul li a[title!='None']").done(
                          function (el) {
                            expect(el.eq(0).attr('title')).toEqual('143311');
                            el.eq(0).trigger('click');
                            expect(childFields.find('.cs-field-write input').eq(1).val()).toEqual(
                                '143311');
                            done();
                          });
                    });
              });

              xit('should turn child values  to  none', function (done) {
                parentWriteField = parentField.find('.cs-field-write input');
                parentWriteField.val('w');
                parentWriteField = parentField.find('.cs-field-write input');
                parentWriteField.trigger('keyup');
                testUtils.asyncElement(parentField,
                    ".typeahead.ps-container ul[style*='display: block'] li").done(function (el) {
                  el.eq(0).trigger('click');
                  expect(parentField.find('.cs-field-write input').val()).toEqual("CWS");
                  childWriteFields = childFields.find('.cs-field-write input');
                  expect(childWriteFields.eq(0).text()).toEqual("");
                  expect(childWriteFields.eq(1).text()).toEqual("");
                  expect(childWriteFields.eq(2).text()).toEqual("");
                  done();
                });
              });
            });
          });

          afterAll(function () {
            formView.destroy();
            formModel.destroy();
            $('body').empty();
          });
        });

        xdescribe("dependency on multivalue", function () {
          beforeAll(function (done) {
            $('body').empty();

            formModel = new Backbone.Model(multivalueParentMultivalueChildModel);

            formModel.connector = connector;

            node = new NodeModel({id: 60717}, {
              connector: connector
            });

            formView = new CategoryFormView({model: formModel, node: node, context: context});
            $('body').append("<div id='mulitvalue-parent-multivalue-tkl-child-div-region'></div>");

            new Marionette.Region({
              el: "#mulitvalue-parent-multivalue-tkl-child-div-region"
            }).show(formView);
            formView.$form.postRender;
            testUtils.asyncElement(formView.$el, '.cs-formfield.cs-tklfield').done(
                function (el) {
                  done();
                });

          });

          afterAll(function () {
            formView.destroy();
            formModel.destroy();
            $('body').empty();
          });

          describe("Integer Field", function () {
            var parentFields, childFields, flag = false, parentReadFields, parentWriteFields,
                childReadFields, childWriteFields, focusOutEvent;
            beforeAll(function () {
              parentFields = formView.$el.find(
                  ".alpaca-container-item[data-alpaca-container-item-name='60717_2']");
              childFields = formView.$el.find(
                  ".alpaca-container-item[data-alpaca-container-item-name='60717_3'] .cs-formfield.cs-tklfield");
            });

            it('child fields turn to write mode once parent turns to write mode',
                function (done) {
                  parentFields.eq(0).find('.cs-field-read').trigger('click');
                  testUtils.asyncElement(parentFields,
                      '.cs-field-read.binf-hidden').done(function () {
                    expect(parentFields.find('.cs-field-read.binf-hidden').length).toEqual(2);
                    expect(parentFields.find('.cs-field-write:not(.binf-hidden)').length).toEqual(
                        2);
                    expect(childFields.find('.cs-field-read.binf-hidden').length).toEqual(3);
                    expect(childFields.find('.cs-field-write:not(.binf-hidden)').length).toEqual(3);
                    done();
                  });
                });

            describe("on change of parent value", function () {
              beforeAll(function () {
                parentReadFields = parentFields.find('.cs-field-read');
                parentWriteFields = parentFields.find('.cs-field-write input');
                childReadFields = childFields.find('.cs-field-read');
                childWriteFields = childFields.find('.cs-field-write input');
                focusOutEvent = {
                  target: parentFields.find('input')[1],
                  relatedTarget: childWriteFields.find('input')[1]
                };
              });
              describe("should populate", function () {
                beforeEach(function () {
                  childWriteFields = childFields.find('.cs-field-write input');
                  if (flag) {
                    parentFields.alpaca().children[1].fieldView.setValue("3000");
                  } else {
                    parentFields.alpaca().children[0].fieldView.setValue("2000");
                  }
                  flag = !flag;

                });
                it('first child values with respect to first parent value',
                    function (done) {
                      expect(parentFields.find('.cs-field-write input').eq(0).val())
                          .toEqual("2000");
                      childWriteFields.eq(0).trigger('mouseup');
                      testUtils.asyncElement(childFields.eq(0),
                          ".cs-tkl-options-container.binf-show ul li a[title!='None']").done(
                          function (el) {
                            expect(el.attr('title')).toEqual('2001');
                            el.trigger('click');
                            done();
                          });

                    });

                it('second child values with respect to second parent value',
                    function (done) {
                      expect(parentFields.find('.cs-field-write input').eq(1).val())
                          .toEqual("3000");
                      childWriteFields.eq(1).trigger('mouseup');
                      testUtils.asyncElement(childFields.eq(1),
                          ".cs-tkl-options-container.binf-show ul li a[title!='None']").done(
                          function (el) {
                            expect(el.eq(0).attr('title')).toEqual('3001');
                            el.eq(0).trigger('click');
                            done();
                          });
                    });
              });

              it('should turn respective child value  to  none', function () {
                parentWriteFields = parentFields.find('.cs-field-write input');
                childWriteFields = childFields.find('.cs-field-write input');
                parentWriteFields.eq(1).val("2000");
                parentFields.alpaca().children[1].fieldView.getEditableBehavior().onFocusOutWrite(
                    focusOutEvent);
                expect(parentWriteFields.eq(1).val()).toEqual("2000");
                expect(childWriteFields.eq(0).val()).toEqual("2001");
                expect(childWriteFields.eq(1).val()).toEqual("");
              });
            });
          });

          describe("Text Field", function () {
            var parentFields, childFields, flag = false, parentReadFields, parentWriteFields,
                childReadFields, childWriteFields, focusOutEvent;
            beforeAll(function () {
              parentFields = formView.$el.find(
                  ".alpaca-container-item[data-alpaca-container-item-name='60717_4']");
              childFields = formView.$el.find(
                  ".alpaca-container-item[data-alpaca-container-item-name='60717_5'] .cs-formfield.cs-tklfield");
            });

            it('child fields turn to write mode once parent turns to write mode',
                function (done) {
                  parentFields.eq(0).find('.cs-field-read').trigger('click');
                  testUtils.asyncElement(parentFields,
                      '.cs-field-read.binf-hidden').done(function () {
                    expect(parentFields.find('.cs-field-read.binf-hidden').length).toEqual(2);
                    expect(parentFields.find('.cs-field-write:not(.binf-hidden)').length).toEqual(
                        2);
                    expect(childFields.find('.cs-field-read.binf-hidden').length).toEqual(3);
                    expect(childFields.find('.cs-field-write:not(.binf-hidden)').length).toEqual(3);
                    done();
                  });
                });
            describe("on change of parent value", function () {
              beforeAll(function () {
                parentReadFields = parentFields.find('.cs-field-read');
                parentWriteFields = parentFields.find('.cs-field-write input');
                childReadFields = childFields.find('.cs-field-read');
                childWriteFields = childFields.find('.cs-field-write input');
                focusOutEvent = {
                  target: parentFields.find('input')[1],
                  relatedTarget: childWriteFields.find('input')[1]
                };
              });
              describe("should populate", function () {
                beforeEach(function () {
                  childWriteFields = childFields.find('.cs-field-write input');
                  if (flag) {
                    parentFields.alpaca().children[1].fieldView.setValue("Enterprise");
                  } else {
                    parentFields.alpaca().children[0].fieldView.setValue("CWS");
                  }
                  flag = !flag;

                });
                it('first child values with respect to first parent value',
                    function (done) {
                      expect(parentFields.find('.cs-field-write input').eq(0).val())
                          .toEqual("CWS");
                      childWriteFields.eq(0).trigger('mouseup');
                      testUtils.asyncElement(childFields.eq(0),
                          ".cs-tkl-options-container.binf-show ul li a[title!='None']").done(
                          function (el) {
                            expect(el.attr('title')).toEqual('123456');
                            el.trigger('click');
                            done();
                          });

                    });

                it('second child values with respect to second parent value',
                    function (done) {
                      expect(parentFields.find('.cs-field-write input').eq(1).val())
                          .toEqual("Enterprise");
                      childWriteFields.eq(1).trigger('mouseup');
                      testUtils.asyncElement(childFields.eq(1),
                          ".cs-tkl-options-container.binf-show ul li a[title!='None']").done(
                          function (el) {
                            expect(el.eq(0).attr('title')).toEqual('2000');
                            el.eq(0).trigger('click');
                            done();
                          });
                    });
              });

              xit('should turn respective child value  to  none', function () {
                parentWriteFields = parentFields.find('.cs-field-write input');
                childWriteFields = childFields.find('.cs-field-write input');
                parentWriteFields.eq(1).val("CWS");
                parentFields.alpaca().children[1].fieldView.getEditableBehavior().onFocusOutWrite(
                    focusOutEvent);
                expect(parentWriteFields.eq(1).val()).toEqual("CWS");
                expect(childWriteFields.eq(0).val()).toEqual("123456");
                expect(childWriteFields.eq(1).val()).toEqual("");
              });
            });
          });

          describe("Multiline Field", function () {
            var parentFields, childFields, flag = false, parentReadFields, parentWriteFields,
                childReadFields, childWriteFields, focusOutEvent;
            beforeAll(function () {
              parentFields = formView.$el.find(
                  ".alpaca-container-item[data-alpaca-container-item-name='60717_6']");
              childFields = formView.$el.find(
                  ".alpaca-container-item[data-alpaca-container-item-name='60717_7'] .cs-formfield.cs-tklfield");
            });

            it('child fields turn to write mode once parent turns to write mode',
                function (done) {
                  parentFields.eq(0).find('.cs-field-read').trigger('click');
                  testUtils.asyncElement(parentFields,
                      '.cs-field-read.binf-hidden').done(function () {
                    expect(parentFields.find('.cs-field-read.binf-hidden').length).toEqual(2);
                    expect(parentFields.find('.cs-field-write:not(.binf-hidden)').length).toEqual(
                        2);
                    expect(childFields.find('.cs-field-read.binf-hidden').length).toEqual(3);
                    expect(childFields.find('.cs-field-write:not(.binf-hidden)').length).toEqual(3);
                    done();
                  });
                });

            describe("on change of parent value", function () {
              beforeAll(function () {
                parentReadFields = parentFields.find('.cs-field-read');
                parentWriteFields = parentFields.find('.cs-field-write textarea');
                childReadFields = childFields.find('.cs-field-read');
                childWriteFields = childFields.find('.cs-field-write input');
                focusOutEvent = {
                  target: parentFields.find('input')[1],
                  relatedTarget: childWriteFields.find('input')[1]
                };
              });
              describe("should populate", function () {
                beforeEach(function () {
                  childWriteFields = childFields.find('.cs-field-write input');
                  if (flag) {
                    parentFields.alpaca().children[1].fieldView.setValue("Enterprise");
                  } else {
                    parentFields.alpaca().children[0].fieldView.setValue("CWS");
                  }
                  flag = !flag;

                });
                xit('first child values with respect to first parent value',
                    function (done) {
                      expect(parentFields.find('.cs-field-write textarea').eq(0).val())
                          .toEqual("CWS");
                      childWriteFields.eq(0).trigger('mouseup');
                      testUtils.asyncElement(childFields.eq(0),
                          ".cs-tkl-options-container.binf-show ul li a[title!='None']").done(
                          function (el) {
                            expect(el.attr('title')).toEqual('123456');
                            el.trigger('click');
                            done();
                          });

                    });

                xit('second child values with respect to second parent value',
                    function (done) {
                      expect(parentFields.find('.cs-field-write textarea').eq(1).val())
                          .toEqual("Enterprise");
                      childWriteFields.eq(1).trigger('mouseup');
                      testUtils.asyncElement(childFields.eq(1),
                          ".cs-tkl-options-container.binf-show ul li a[title!='None']").done(
                          function (el) {
                            expect(el.eq(0).attr('title')).toEqual('2000');
                            el.eq(0).trigger('click');
                            done();
                          });
                    });
              });

              xit('should turn respective child value to none', function () {
                parentWriteFields = parentFields.find('.cs-field-write textarea');
                childWriteFields = childFields.find('.cs-field-write input');
                parentWriteFields.eq(1).val("CWS");
                parentFields.alpaca().children[1].fieldView.getEditableBehavior().onFocusOutWrite(
                    focusOutEvent);
                expect(parentWriteFields.eq(1).val()).toEqual("CWS");
                expect(childWriteFields.eq(0).val()).toEqual("123456");
                expect(childWriteFields.eq(1).val()).toEqual("");
              });
            });
          });

          xdescribe("Select Field", function () {
            var parentFields, childFields, flag = false, parentReadFields, parentWriteFields,
                childReadFields, childWriteFields;
            beforeAll(function () {
              parentFields = formView.$el.find(
                  ".alpaca-container-item[data-alpaca-container-item-name='60717_8']");
              childFields = formView.$el.find(
                  ".alpaca-container-item[data-alpaca-container-item-name='60717_9'] .cs-formfield.cs-tklfield");
            });

            it('child fields turn to write mode once parent turns to write mode',
                function (done) {
                  parentFields.eq(0).find('.cs-field-read').trigger('click');
                  testUtils.asyncElement(parentFields,
                      '.cs-field-read.binf-hidden').done(function () {
                    expect(parentFields.find('.cs-field-read.binf-hidden').length).toEqual(2);
                    expect(parentFields.find('.cs-field-write:not(.binf-hidden)').length).toEqual(
                        2);
                    expect(childFields.find('.cs-field-read.binf-hidden').length).toEqual(3);
                    expect(childFields.find('.cs-field-write:not(.binf-hidden)').length).toEqual(3);
                    done();
                  });
                });

            describe("on change of parent value", function () {
              beforeAll(function () {
                parentReadFields = parentFields.find('.cs-field-read');
                parentWriteFields = parentFields.find('.cs-field-write button');
                childReadFields = childFields.find('.cs-field-read');
                childWriteFields = childFields.find('.cs-field-write input');
              });
              xdescribe("should populate", function () {
                beforeEach(function (done) {
                  if (flag) {
                    parentWriteFields.eq(1).trigger('click');
                    testUtils.asyncElement(parentFields.find(".cs-field-write").eq(1),
                        '.cs-drop-down.binf-open ul li a span').done(function (el) {
                      el.eq(2).trigger('click');
                      done();
                    });
                  } else {
                    parentWriteFields.eq(0).trigger('click');
                    testUtils.asyncElement(parentFields.find(".cs-field-write").eq(0),
                        '.cs-drop-down.binf-open ul li a span').done(function (el) {
                      el.eq(1).trigger('click');
                      done();
                    });
                  }
                  flag = !flag;
                });
                it('first child values with respect to first parent value',
                    function (done) {
                      expect(parentFields.find('.cs-field-write button')[0].text())
                          .toEqual("2000");
                      childWriteFields.eq(0).trigger('mouseup');
                      testUtils.asyncElement(childFields.eq(0),
                          ".cs-tkl-options-container.binf-show ul li a[title!='None']").done(
                          function (el) {
                            expect(el.eq(0).attr('title')).toEqual('2001');
                            el.eq(0).trigger('click');
                            done();
                          });

                    });

                it('second child values with respect to second parent value',
                    function (done) {
                      expect(parentFields.find('.cs-field-write button').text())
                          .toEqual("3000");
                      childWriteFields.eq(1).trigger('mouseup');
                      testUtils.asyncElement(childFields.eq(1),
                          ".cs-tkl-options-container.binf-show ul li a[title!='None']").done(
                          function (el) {
                            expect(el.eq(0).attr('title')).toEqual('3001');
                            el.eq(0).trigger('click');
                            done();
                          });
                    });
              });

              it('should turn respective child value  to  none', function (done) {
                parentWriteFields = parentFields.find('.cs-field-write button');
                childWriteFields = childFields.find('.cs-field-write input');
                parentWriteFields.eq(1).trigger('click');
                testUtils.asyncElement(parentFields.find(".cs-field-write").eq(1),
                    '.cs-drop-down.binf-open ul li a span').done(function (el) {
                  el.eq(1).trigger('click');
                  expect(parentFields.find('.cs-field-write button').text())
                      .toEqual("2000");
                  expect(childWriteFields.eq(0).val()).toEqual("2001");
                  expect(childWriteFields.eq(1).val()).toEqual("");
                  done();
                });
              });
            });
          });

          describe("TKL Field", function () {
            var parentFields, childFields, flag = false, parentReadFields, parentWriteFields,
                childReadFields, childWriteFields;
            beforeAll(function () {
              parentFields = formView.$el.find(
                  ".alpaca-container-item[data-alpaca-container-item-name='60717_10'] .cs-formfield.cs-tklfield");
              childFields = formView.$el.find(
                  ".alpaca-container-item[data-alpaca-container-item-name='60717_11'] .cs-formfield.cs-tklfield");
            });

            it('child fields turn to write mode once parent turns to write mode',
                function (done) {
                  parentFields.eq(0).find('.cs-field-read').trigger('click');
                  testUtils.asyncElement(parentFields,
                      '.cs-field-read.binf-hidden').done(function () {
                    expect(parentFields.find('.cs-field-read.binf-hidden').length).toEqual(2);
                    expect(parentFields.find('.cs-field-write:not(.binf-hidden)').length).toEqual(
                        2);
                    expect(childFields.find('.cs-field-read.binf-hidden').length).toEqual(3);
                    expect(childFields.find('.cs-field-write:not(.binf-hidden)').length).toEqual(3);
                    done();
                  });
                });
            xdescribe("on change of parent value", function () {
              beforeAll(function () {
                parentReadFields = parentFields.find('.cs-field-read');
                parentWriteFields = parentFields.find('.cs-field-write input');
                childReadFields = childFields.find('.cs-field-read');
                childWriteFields = childFields.find('.cs-field-write input');
              });
              xdescribe("should populate", function () {
                beforeEach(function (done) {
                  parentWriteFields = parentFields.find('.cs-field-write input');
                  childWriteFields = childFields.find('.cs-field-write input');
                  if (flag) {
                    parentWriteFields.eq(1).trigger('mouseup');
                    testUtils.asyncElement(parentFields.eq(1),
                        ".cs-tkl-options-container.binf-show ul li a[title!='None']").done(
                        function (el) {
                          expect(el.eq(1).attr('title')).toEqual('Enterprise');
                          el.eq(1).trigger('click');
                          done();
                        });
                  } else {
                    parentWriteFields.eq(0).trigger('mouseup');
                    testUtils.asyncElement(parentFields.eq(0),
                        ".cs-tkl-options-container.binf-show ul li a[title!='None']").done(
                        function (el) {
                          expect(el.eq(0).attr('title')).toEqual('CWS');
                          el.eq(0).trigger('click');
                          done();
                        });
                  }
                  flag = !flag;
                });
                it('first child values with respect to first parent value',
                    function (done) {
                      expect(parentFields.find('.cs-field-write input').eq(0).val())
                          .toEqual("CWS");
                      childWriteFields.eq(0).trigger('mouseup');
                      testUtils.asyncElement(childFields.eq(0),
                          ".cs-tkl-options-container.binf-show ul li a[title!='None']").done(
                          function (el) {
                            expect(el.eq(0).attr('title')).toEqual('123456');
                            el.eq(0).trigger('click');
                            done();
                          });
                    });

                it('second child values with respect to second parent value',
                    function (done) {
                      expect(parentFields.find('.cs-field-write input').eq(1).val())
                          .toEqual("Enterprise");
                      childWriteFields.eq(1).trigger('mouseup');
                      testUtils.asyncElement(childFields.eq(1),
                          ".cs-tkl-options-container.binf-show ul li a[title!='None']").done(
                          function (el) {
                            expect(el.eq(0).attr('title')).toEqual('2000');
                            el.eq(0).trigger('click');
                            done();
                          });
                    });
              });

              xit('should turn respective child value  to  none', function (done) {
                parentWriteFields = parentFields.find('.cs-field-write input');
                childWriteFields = childFields.find('.cs-field-write input');
                parentWriteFields.eq(1).trigger('mouseup');
                testUtils.asyncElement(parentFields.eq(1),
                    ".cs-tkl-options-container.binf-show ul li a[title!='None']").done(
                    function (el) {
                      expect(el.eq(0).attr('title')).toEqual('CWS');
                      el.eq(0).trigger('click');
                      expect(parentFields.find('.cs-field-write input').eq(1).val()).toEqual("CWS");
                      expect(childWriteFields.eq(0).val()).toEqual("123456");
                      expect(childWriteFields.eq(1).val()).toEqual("");
                      done();
                    });
              });
            });
          });

          describe("User Field", function () {
            var parentFields, childFields, flag = false, parentReadFields, parentWriteFields,
                childReadFields, childWriteFields;
            beforeAll(function () {
              parentFields = formView.$el.find(
                  ".alpaca-container-item[data-alpaca-container-item-name='60717_12'] .cs-formfield.cs-userfield");
              childFields = formView.$el.find(
                  ".alpaca-container-item[data-alpaca-container-item-name='60717_13'] .cs-formfield.cs-tklfield");
            });

            xit('child fields turn to write mode once parent turns to write mode',
                function (done) {
                  parentFields.eq(0).find('.cs-field-read').trigger('click');
                  testUtils.asyncElement(parentFields,
                      '.cs-field-read.binf-hidden').done(function () {
                    expect(parentFields.find('.cs-field-read.binf-hidden').length).toEqual(2);
                    expect(parentFields.find('.cs-field-write:not(.binf-hidden)').length).toEqual(
                        2);
                    expect(childFields.find('.cs-field-read.binf-hidden').length).toEqual(3);
                    expect(childFields.find('.cs-field-write:not(.binf-hidden)').length).toEqual(3);
                    done();
                  });
                });
          });

        });
      });

    });

  });
});

